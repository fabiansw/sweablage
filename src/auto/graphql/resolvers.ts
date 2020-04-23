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

const buchService = new AutoService();

const findBuecher = (titel: string) => {
    const suchkriterium = titel === undefined ? {} : { titel };
    return buchService.find(suchkriterium);
};

interface TitelCriteria {
    titel: string;
}

interface IdCriteria {
    id: string;
}

const createBuch = (buch: Auto) => {
    buch.datum = new Date(buch.datum as string);
    return buchService.create(buch);
};

const updateBuch = async (buch: Auto) => {
    const version = buch.__v ?? 0;
    buch.datum = new Date(buch.datum as string);
    const buchUpdated = await buchService.update(buch, version.toString());
    logger.debug(`resolvers updateBuch(): Versionsnummer: ${buch.__v}`);
    return buchUpdated;
};

const deleteBuch = async (id: string) => {
    await buchService.delete(id);
};

// Queries passend zu "type Query" in typeDefs.ts
const query: IResolverObject = {
    // Buecher suchen, ggf. mit Titel als Suchkriterium
    buecher: (_: unknown, { titel }: TitelCriteria) => findBuecher(titel),
    // Ein Buch mit einer bestimmten ID suchen
    buch: (_: unknown, { id }: IdCriteria) => buchService.findById(id),
};

const mutation: IResolverObject = {
    createBuch: (_: unknown, buch: Auto) => createBuch(buch),
    updateBuch: (_: unknown, buch: Auto) => updateBuch(buch),
    deleteBuch: (_: unknown, { id }: IdCriteria) => deleteBuch(id),
};

export const resolvers: IResolvers = {
    Query: query,
    Mutation: mutation,
};
