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

/* globals describe, expect, test, beforeAll, afterAll */

// REST-Schnittstelle testen: Supertest oder (primitiver!) request

// import dotenv from 'dotenv';
// const result = dotenv.config();
// if (result.error !== undefined) {
//     throw result.error;
// }
// console.info(`.env: ${JSON.stringify(result.parsed)}`);
// const dev = result?.parsed?.NODE_ENV?.startsWith('dev') ?? false;

import { HttpStatus } from '../../../src/shared';
import { PATHS } from '../../../src/app';
import type { AutoData } from '../../../src/auto/entity/types';
import type { Server } from 'http';
import chai from 'chai';
import { createTestserver } from '../../createTestserver';
import request from 'supertest';

const { expect } = chai;

// startWith(), endWith()
import('chai-string').then(chaiString => chai.use(chaiString.default));

// -----------------------------------------------------------------------------
// T e s t s e r v e r   m i t   H T T P   u n d   R a n d o m   P o r t
// -----------------------------------------------------------------------------
const path = PATHS.autos;
let server: Server;

// Test-Suite
describe('GET /autos', () => {
    beforeAll(async () => (server = await createTestserver()));

    afterAll(async () => {
        server.close();
        // "open handle error (TCPSERVERWRAP)" bei Supertest mit Jest vermeiden
        // https://github.com/visionmedia/supertest/issues/520
        await new Promise(resolve => setTimeout(() => resolve(), 1000)); // eslint-disable-line @typescript-eslint/no-magic-numbers
    });

    test('Alle Autos', async () => {
        // when
        const response = await request(server)
            .get(path)
            .trustLocalhost();

        // then
        const { status, header, body } = response;
        expect(status).to.be.equal(HttpStatus.OK);
        expect(header['content-type']).to.match(/json/iu);
        // https://jestjs.io/docs/en/expect
        // JSON-Array mit mind. 1 JSON-Objekt
        expect(body).not.to.be.empty;
    });

    test('Autos mit einem Modell, der ein "a" enthaelt', async () => {
        // given
        const teilName = 'a';

        // when
        const response = await request(server)
            .get(`${path}?modell=${teilName}`)
            .trustLocalhost();

        // then
        const { status, header, body } = response;
        expect(status).to.be.equal(HttpStatus.OK);
        expect(header['content-type']).to.match(/json/iu);
        // response.body ist ein JSON-Array mit mind. 1 JSON-Objekt
        expect(body).not.to.be.empty;

        // Jedes Auto hat einen Modell mit dem Teilstring 'a'
        body.map((auto: AutoData) => auto.modell).forEach((modell: string) =>
            expect(modell).to.have.string(teilName),
        );
    });

    test('Keine Autos mit einem Modell, der "XX" enthaelt', async () => {
        // given
        const teilName = 'XX';

        // when
        const response = await request(server)
            .get(`${path}?modell=${teilName}`)
            .trustLocalhost();

        // then
        const { status, body } = response;
        expect(status).to.be.equal(HttpStatus.NOT_FOUND);
        // Leerer Rumpf
        expect(Object.entries(body)).to.be.empty;
    });

    test('Mind. 1 Auto mit dem Assistenzsystem "Tempomat"', async () => {
        // given
        const assistenzsystem = 'tempomat';

        // when
        const response = await request(server)
            .get(`${path}?${assistenzsystem}=true`)
            .trustLocalhost();

        // then
        const { status, header, body } = response;
        expect(status).to.be.equal(HttpStatus.OK);
        expect(header['content-type']).to.match(/json/iu);
        // JSON-Array mit mind. 1 JSON-Objekt
        expect(body).not.to.be.empty;

        // Jedes Auto hat im Array der Assistenzsysteme "javascript"
        body.map(
            (auto: AutoData) => auto.assistenzsysteme,
        ).forEach((s: Array<string>) =>
            expect(s).to.include(assistenzsystem.toUpperCase()),
        );
    });

    test('Keine Autos mit dem Schlagwort "Selbstfahrend"', async () => {
        // given
        const assistenzsystem = 'Selbstfahrend';

        // when
        const response = await request(server)
            .get(`${path}?${assistenzsystem}=true`)
            .trustLocalhost();

        // then
        const { status, body } = response;
        expect(status).to.be.equal(HttpStatus.NOT_FOUND);
        // Leerer Rumpf
        expect(Object.entries(body)).to.be.empty;
    });
});
