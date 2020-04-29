/* eslint-disable max-lines */
/*
 * Copyright (C) 2016 - present Juergen Zimmermann, Hochschule Karlsruhe
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import type { Auto, AutoData } from '../entity/types';
import { AutoModel, validateAuto } from '../entity';
import {
    AutoNotExistsError,
    SeriennrExistsError,
    ModellExistsError,
    ValidationError,
    VersionInvalidError,
} from './exceptions';
import { dbConfig, logger } from '../../shared';
import { AutoServiceMock } from './mock';
import type { Document } from 'mongoose';
import JSON5 from 'json5';
import { startSession } from 'mongoose';
// UUID v4: random
// https://github.com/uuidjs/uuid
import { v4 as uuid } from 'uuid';

const { mockDB } = dbConfig;

// API-Dokumentation zu mongoose:
// http://mongoosejs.com/docs/api.html
// https://github.com/Automattic/mongoose/issues/3949

/* eslint-disable require-await, no-null/no-null */
export class AutoService {
    private readonly mock: AutoServiceMock | undefined;

    constructor() {
        if (mockDB) {
            this.mock = new AutoServiceMock();
        }
    }

    // Status eines Promise:
    // Pending: das Resultat gibt es noch nicht, weil die asynchrone Operation,
    //          die das Resultat liefert, noch nicht abgeschlossen ist
    // Fulfilled: die asynchrone Operation ist abgeschlossen und
    //            das Promise-Objekt hat einen Wert
    // Rejected: die asynchrone Operation ist fehlgeschlagen and das
    //           Promise-Objekt wird nicht den Status "fulfilled" erreichen.
    //           Stattdessen ist im Promise-Objekt die Fehlerursache enthalten.

    async findById(id: string) {
        if (this.mock !== undefined) {
            return this.mock.findById(id);
        }
        logger.debug(`AutoService.findById(): id= ${id}`);

        // ein Auto zur gegebenen ID asynchron suchen
        // Pattern "Active Record" (urspruengl. von Ruby-on-Rails)
        // null falls nicht gefunden
        // lean() liefert ein "Plain JavaScript Object" statt ein Mongoose Document
        return AutoModel.findById(id)
            .lean<AutoData>()
            .then(auto => auto ?? undefined);
    }

    async find(query?: any) {
        if (this.mock !== undefined) {
            return this.mock.find(query);
        }

        logger.debug(`AutoService.find(): query=${JSON5.stringify(query)}`);
        const tmpQuery = AutoModel.find().lean<AutoData>();

        // alle Autos asynchron suchen u. aufsteigend nach modell sortieren
        // nach _id sortieren: Timestamp des INSERTs (Basis: Sek)
        // https://docs.mongodb.org/manual/reference/object-id
        if (query === undefined || Object.entries(query).length === 0) {
            // lean() liefert ein "Plain JavaScript Object" statt ein Mongoose Document
            return tmpQuery.sort('modell').lean<AutoData>();
        }

        const { modell, tempomat, autopilot, ...dbQuery } = query;

        // Autos zur Query (= JSON-Objekt durch Express) asynchron suchen
        if (modell !== undefined) {
            // Modell in der Query: Teilstring des Modells,
            // d.h. "LIKE" als regulaerer Ausdruck
            // 'i': keine Unterscheidung zw. Gross- u. Kleinschreibung
            // NICHT /.../, weil das Muster variabel sein muss
            // CAVEAT: KEINE SEHR LANGEN Strings wg. regulaerem Ausdruck
            // eslint-disable-next-line @typescript-eslint/no-magic-numbers
            if (modell.length < 20) {
                dbQuery.modell = new RegExp(modell, 'iu'); // eslint-disable-line security/detect-non-literal-regexp
            }
        }

        // z.B. {tempomat: true, autopilot: true}
        const assistenzsysteme = [];
        if (tempomat === 'true') {
            assistenzsysteme.push('TEMPOMAT');
        }
        if (autopilot === 'true') {
            assistenzsysteme.push('AUTOPILOT');
        }
        if (assistenzsysteme.length === 0) {
            delete dbQuery.assistenzsysteme;
        } else {
            dbQuery.assistenzsysteme = assistenzsysteme;
        }

        logger.debug(`AutoService.find(): dbQuery=${JSON5.stringify(dbQuery)}`);

        // Pattern "Active Record" (urspruengl. von Ruby-on-Rails)
        // leeres Array, falls nichts gefunden wird
        // lean() liefert ein "Plain JavaScript Object" statt ein Mongoose Document
        return AutoModel.find(dbQuery).lean<AutoData>();
        // Auto.findOne(query), falls das Suchkriterium eindeutig ist
        // bei findOne(query) wird null zurueckgeliefert, falls nichts gefunden
    }

    // eslint-disable-next-line max-statements,max-lines-per-function
    async create(autoData: Auto) {
        if (this.mock !== undefined) {
            return this.mock.create(autoData);
        }

        // Das gegebene Auto innerhalb von save() asynchron neu anlegen:
        // Promise.reject(err) bei Verletzung von DB-Constraints, z.B. unique

        const auto = new AutoModel(autoData);
        const errorMsg = validateAuto(auto);
        if (errorMsg !== undefined) {
            logger.debug(
                `AutoService.create(): Validation Message: ${JSON5.stringify(
                    errorMsg,
                )}`,
            );
            // Promise<void> als Rueckgabewert
            // Eine von Error abgeleitete Klasse hat die Property "message"
            return Promise.reject(new ValidationError(errorMsg));
        }

        // Pattern "Active Record" (urspruengl. von Ruby-on-Rails)
        const { modell } = autoData;
        let tmp = await AutoModel.findOne({ modell }).lean<AutoData>();
        if (tmp !== null) {
            // Promise<void> als Rueckgabewert
            // Eine von Error abgeleitete Klasse hat die Property "message"
            return Promise.reject(
                new ModellExistsError(`Das Modell "${modell}" existiert bereits.`),
            );
        }

        const { seriennr } = autoData;
        tmp = await AutoModel.findOne({ seriennr: seriennr }).lean<AutoData>();
        if (tmp !== null) {
            return Promise.reject(
                new SeriennrExistsError(
                    `Die Serien-Nr. "${seriennr}" existiert bereits.`,
                ),
            );
        }

        auto._id = uuid(); // eslint-disable-line require-atomic-updates

        let autoSaved!: Document;
        // https://www.mongodb.com/blog/post/quick-start-nodejs--mongodb--how-to-implement-transactions
        const session = await startSession();
        try {
            await session.withTransaction(async () => {
                autoSaved = await auto.save();
            });
        } catch (err) {
            logger.error(
                `AutoService.create(): Die Transaktion wurde abgebrochen: ${JSON5.stringify(
                    err,
                )}`,
            );
            // TODO Weitere Fehlerbehandlung bei Rollback
        } finally {
            session.endSession();
        }
        const autoDataSaved: AutoData = autoSaved.toObject();
        logger.debug(
            `AutoService.create(): autoDataSaved=${JSON5.stringify(
                autoDataSaved,
            )}`,
        );

        // TODO Email senden

        return autoDataSaved;
    }

    // eslint-disable-next-line max-lines-per-function,max-statements
    async update(autoData: Auto, versionStr: string) {
        if (this.mock !== undefined) {
            return this.mock.update(autoData);
        }

        if (versionStr === undefined) {
            return Promise.reject(
                new VersionInvalidError('Die Versionsnummer fehlt'),
            );
        }
        const version = Number.parseInt(versionStr, 10);
        if (Number.isNaN(version)) {
            return Promise.reject(
                new VersionInvalidError('Die Versionsnummer ist ungueltig'),
            );
        }
        logger.debug(`AutoService.update(): version=${version}`);

        logger.debug(`AutoService.update(): auto=${JSON5.stringify(autoData)}`);
        const auto = new AutoModel(autoData);
        const err = validateAuto(auto);
        if (err !== undefined) {
            logger.debug(
                `AutoService.update(): Validation Message: ${JSON5.stringify(
                    err,
                )}`,
            );
            // Promise<void> als Rueckgabewert
            return Promise.reject(new ValidationError(err));
        }

        const { modell }: { modell: string } = autoData;
        const tmp = await AutoModel.findOne({ modell }).lean<AutoData>();
        if (tmp !== null && tmp._id !== auto._id) {
            return Promise.reject(
                new ModellExistsError(
                    `Das Modell "${modell}" existiert bereits bei ${
                        tmp._id as string
                    }.`,
                ),
            );
        }

        const autoDb = await AutoModel.findById(auto._id).lean<AutoData>();
        if (autoDb === null) {
            return Promise.reject(
                new AutoNotExistsError('Kein Auto mit der ID'),
            );
        }
        const versionDb = autoDb?.__v ?? 0;
        if (version < versionDb) {
            return Promise.reject(
                new VersionInvalidError(
                    `Die Versionsnummer ${version} ist nicht aktuell`,
                ),
            );
        }

        // findByIdAndReplace ersetzt ein Document mit ggf. weniger Properties
        const result = await AutoModel.findByIdAndUpdate(auto._id, auto).lean<
            AutoData
        >();
        if (result === null) {
            return Promise.reject(
                new VersionInvalidError(
                    `Kein Auto mit ID ${
                        auto._id as string
                    } und Version ${version}`,
                ),
            );
        }

        if (result.__v !== undefined) {
            result.__v++;
        }
        logger.debug(`AutoService.update(): result=${JSON5.stringify(result)}`);

        // Weitere Methoden von mongoose zum Aktualisieren:
        //    Auto.findOneAndUpdate(update)
        //    auto.update(bedingung)
        return Promise.resolve(result);
    }

    async delete(id: string) {
        if (this.mock !== undefined) {
            return this.mock.remove(id);
        }
        logger.debug(`AutoService.delete(): id=${id}`);

        // Das Auto zur gegebenen ID asynchron loeschen
        const { deletedCount } = await AutoModel.deleteOne({ _id: id });
        logger.debug(`AutoService.delete(): deletedCount=${deletedCount}`);
        return deletedCount !== undefined;

        // Weitere Methoden von mongoose, um zu loeschen:
        //  Auto.findByIdAndRemove(id)
        //  Auto.findOneAndRemove(bedingung)
    }
}
