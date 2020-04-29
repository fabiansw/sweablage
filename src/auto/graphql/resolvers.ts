/*
 * Copyright (C) 2018 - present Juergen Zimmermann, Hochschule Karlsruhe
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

import type {
    IResolverObject,
    IResolvers,
} from 'graphql-tools/dist/Interfaces';
import type { Auto } from './../entity/types';
import { AutoService } from '../service/autoService';
import { logger } from '../../shared';

const autoService = new AutoService();

const findAutos = (modell: string) => {
    const suchkriterium = modell === undefined ? {} : { modell };
    return autoService.find(suchkriterium);
};

interface ModellCriteria {
    modell: string;
}

interface IdCriteria {
    id: string;
}

const createAuto = (auto: Auto) => {
    auto.datum = new Date(auto.datum as string);
    return autoService.create(auto);
};

const updateAuto = async (auto: Auto) => {
    const version = auto.__v ?? 0;
    auto.datum = new Date(auto.datum as string);
    const autoUpdated = await autoService.update(auto, version.toString());
    logger.debug(`resolvers updateAuto(): Versionsnummer: ${auto.__v}`);
    return autoUpdated;
};

const deleteAuto = async (id: string) => {
    await autoService.delete(id);
};

// Queries passend zu "type Query" in typeDefs.ts
const query: IResolverObject = {
    // Autos suchen, ggf. mit Modell als Suchkriterium
    autos: (_: unknown, { modell }: ModellCriteria) => findAutos(modell),
    // Ein Auto mit einer bestimmten ID suchen
    auto: (_: unknown, { id }: IdCriteria) => autoService.findById(id),
};

const mutation: IResolverObject = {
    createAuto: (_: unknown, auto: Auto) => createAuto(auto),
    updateAuto: (_: unknown, auto: Auto) => updateAuto(auto),
    deleteAuto: (_: unknown, { id }: IdCriteria) => deleteAuto(id),
};

export const resolvers: IResolvers = {
    Query: query,
    Mutation: mutation,
};
