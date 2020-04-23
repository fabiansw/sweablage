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

export enum Hersteller {
    VW_HERSTELLER = 'VW_HERSTELLER',
    PORSCHE_HERSTELLER = 'PORSCHE_HERSTELLER',
}

export enum AutoArt {
    MECHANIK = 'MECHANIK',
    AUTOMATIK = 'AUTOMATIK',
}

// gemeinsames Basis-Interface fuer REST und GraphQL
export interface Auto {
    _id?: string;
    __v?: number;
    modell: string;
    rating?: number;
    art?: AutoArt | '';
    hersteller: Hersteller | '';
    preis: number;
    premium?: number;
    lieferbar?: boolean;
    datum?: string | Date;
    seriennr: string;
    homepage?: string;
    assistenzsysteme?: Array<string>;
    autoren: any;
}

export interface AutoData extends Auto {
    createdAt?: number;
    updatedAt?: number;
    _links?: {
        self?: { href: string };
        list?: { href: string };
        add?: { href: string };
        update?: { href: string };
        remove?: { href: string };
    };
}
