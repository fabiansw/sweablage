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

/**
 * Typdefinitionen fuer GraphQL:
 *  Vordefinierte skalare Typen
 *      Int: 32‐bit Integer
 *      Float: Gleitkommmazahl mit doppelter Genauigkeit
 *      String:
 *      Boolean: true, false
 *      ID: eindeutiger Bezeichner, wird serialisiert wie ein String
 *  Auto: eigene Typdefinition für Queries
 *        "!" markiert Pflichtfelder
 *  Query: Signatur der Lese-Methoden
 *  Mutation: Signatur der Schreib-Methoden
 */
export const typeDefs = `
    enum Art {
        AUTOMATIK
        MECHANIK
    }

    enum Hersteller {
        VW_HERSTELLER
        PORSCHE_HERSTELLER
    }

    type Auto {
        _id: ID!
        modell: String!
        rating: Int
        art: Art
        hersteller: Hersteller!
        preis: Float
        premium: Float
        lieferbar: Boolean
        datum: String
        seriennr: String
        homepage: String
        assistenzsysteme: [String]
        version: Int
    }

    type Query {
        autos(modell: String): [Auto]
        auto(id: ID!): Auto
    }

    type Mutation {
        createAuto(modell: String!, rating: Int, art: String, hersteller: String!
            preis: Float, premium: Float, lieferbar: Boolean, datum: String,
            seriennr: String, homepage: String, assistenzsysteme: [String]): Auto
        updateAuto(_id: ID, modell: String!, rating: Int, art: String,
            hersteller: String!, preis: Float, premium: Float, lieferbar: Boolean,
            datum: String, seriennr: String, homepage: String,
            assistenzsysteme: [String], version: Int): Auto
        deleteAuto(id: ID!): Boolean
    }
`;
