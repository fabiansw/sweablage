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

import { AutoData } from './auto';
import type { Document } from 'mongoose';
import { MAX_RATING } from '../../shared';
import validator from 'validator';

const { isUUID, isURL, isSERIENNR } = validator;

export interface ValidationErrorMsg {
    id?: string;
    modell?: string;
    art?: string;
    rating?: string;
    hersteller?: string;
    seriennr?: string;
    homepage?: string;
}

/* eslint-disable no-null/no-null */
export const validateAuto = (auto: Document) => {
    const err: ValidationErrorMsg = {};
    const { modell, art, rating, hersteller, seriennr, homepage } = auto as Document &
        AutoData;

    const autoDocument = auto;
    if (!autoDocument.isNew && !isUUID(autoDocument._id)) {
        err.id = 'Das Auto hat eine ungueltige ID.';
    }

    if (modell === undefined || modell === null || modell === '') {
        err.modell = 'Ein Auto muss ein Modell haben.';
    } else if (!/^\w.*/u.test(modell)) {
        err.modell =
            'Ein Automodell muss mit einem Buchstaben, einer Ziffer oder _ beginnen.';
    }
    if (art === undefined || art === null || art === '') {
        err.art = 'Die Art eines Autos muss gesetzt sein';
    } else if (art !== 'MECHANIK' && art !== 'AUTOMATIK') {
        err.art = 'Die Art eines Autos muss MECHANIK oder AUTOMATIK sein.';
    }
    if (
        rating !== undefined &&
        rating !== null &&
        (rating < 0 || rating > MAX_RATING)
    ) {
        err.rating = `${rating} ist keine gueltige Bewertung.`;
    }
    if (hersteller === undefined || hersteller === null || hersteller === '') {
        err.hersteller = 'Der Hersteller des Autos muss gesetzt sein.';
    } else if (hersteller !== 'VW_HERSTELLER' && hersteller !== 'PORSCHE_HERSTELLER') {
        err.hersteller =
            'Der Hersteller eines Autos muss VW_HERSTELLER oder PORSCHE_HERSTELLER sein.';
    }
    if (
        seriennr !== undefined &&
        seriennr !== null &&
        (typeof seriennr !== 'string' || !isSERIENNR(seriennr))
    ) {
        err.seriennr = 'Keine gueltige Seriennummer.';
    }
    // Falls "preis" ein string ist: Pruefung z.B. 12.30
    // if (isPresent(preis) && !isCurrency(`${preis}`)) {
    //     err.preis = `${preis} ist kein gueltiger Preis`
    // }
    if (
        homepage !== undefined &&
        homepage !== null &&
        (typeof homepage !== 'string' || !isURL(homepage))
    ) {
        err.homepage = 'Keine gueltige URL.';
    }

    return Object.entries(err).length === 0 ? undefined : err;
};
