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

import { AutoArt, Hersteller } from '../../../src/auto/entity';
import type { Auto } from '../../../src/auto/entity/types';
import { HttpStatus } from '../../../src/shared';
import { PATHS } from '../../../src/app';
import type { Server } from 'http';
import chai from 'chai';
import { createTestserver } from '../../createTestserver';
import request from 'supertest';

const { expect } = chai;

// startWith(), endWith()
import('chai-string').then(chaiString => chai.use(chaiString.default));

// -----------------------------------------------------------------------------
// T e s t d a t e n
// -----------------------------------------------------------------------------
const neuesAuto: Auto = {
    modell: 'Golf',
    rating: 1,
    art: AutoArt.AUTOMATIK,
    hersteller: Hersteller.VW_HERSTELLER,
    preis: 99.99,
    premium: 0.099,
    lieferbar: true,
    datum: '2016-02-28',
    seriennr: '0-0070-0644-6',
    homepage: 'https://test.de/',
    assistenzsysteme: ['TEMPOMAT', 'AUTOPILOT'],
    autohaeuser: [{ nachname: 'Test', vorname: 'Haus' }],
};
const neuesAutoInvalid: object = {
    modell: 'Blabla',
    rating: -1,
    art: 'Falsche_Art',
    hersteller: 'Falscher_Hersteller',
    preis: 0,
    premium: 0,
    lieferbar: true,
    datum: '2016-02-01',
    seriennr: 'falsche-Seriennummer',
    homepage: 'keine Homepage',
    assistenzsysteme: [],
    autohaeuser: [{ nachname: 'Test', vorname: 'Theo' }],
};
const neuesAutoTitelExistiert: Auto = {
    modell: 'Golf',
    rating: 1,
    art: AutoArt.AUTOMATIK,
    hersteller: Hersteller.VW_HERSTELLER,
    preis: 99.99,
    premium: 0.099,
    lieferbar: true,
    datum: '2016-02-28',
    seriennr: '0-0070-9732-8',
    homepage: 'https://test.de/',
    assistenzsysteme: ['TEMPOMAT', 'AUTOPILOT'], 
    autohaeuser: [{ nachname: 'Test', vorname: 'Theo' }],
    
};

const loginDaten: object = {
    username: 'admin',
    password: 'p',
};

// -----------------------------------------------------------------------------
// T e s t s
// -----------------------------------------------------------------------------
const path = PATHS.autos;
const loginPath = PATHS.login;
let server: Server;

// Test-Suite
describe('POST /autos', () => {
    // Testserver starten und dabei mit der DB verbinden
    beforeAll(async () => (server = await createTestserver()));

    afterAll(async () => {
        server.close();
        // "open handle error (TCPSERVERWRAP)" bei Supertest mit Jest vermeiden
        // https://github.com/visionmedia/supertest/issues/520
        await new Promise(resolve => setTimeout(() => resolve(), 1000)); // eslint-disable-line @typescript-eslint/no-magic-numbers
    });

    test('Neues Auto', async () => {
        // given: neuesAuto
        let response = await request(server)
            .post(`${loginPath}`)
            .set('Content-type', 'application/x-www-form-urlencoded')
            .send(loginDaten)
            .trustLocalhost();
        const { token } = response.body;

        // when
        response = await request(server)
            .post(path)
            .set('Authorization', `Bearer ${token}`)
            .send(neuesAuto)
            .trustLocalhost();

        // then
        const { status, header } = response;
        expect(status).to.be.equal(HttpStatus.CREATED);

        const { location } = header;
        expect(location).to.exist;
        expect(typeof location === 'string').to.be.true;
        expect(location).not.to.be.empty;

        // UUID: Muster von HEX-Ziffern
        const indexLastSlash: number = location.lastIndexOf('/');
        const idStr = location.slice(indexLastSlash + 1);

        expect(idStr).to.match(
            // eslint-disable-next-line max-len
            /[\dA-Fa-f]{8}-[\dA-Fa-f]{4}-[\dA-Fa-f]{4}-[\dA-Fa-f]{4}-[\dA-Fa-f]{12}/u,
        );
    });

    test('Neues Auto mit ungueltigen Daten', async () => {
        // given: neuesAutoInvalid
        let response = await request(server)
            .post(`${loginPath}`)
            .set('Content-type', 'application/x-www-form-urlencoded')
            .send(loginDaten)
            .trustLocalhost();
        const { token } = response.body;

        // when
        response = await request(server)
            .post(path)
            .set('Authorization', `Bearer ${token}`)
            .send(neuesAutoInvalid)
            .trustLocalhost();

        // then
        const { status, body } = response;
        expect(status).to.be.equal(HttpStatus.BAD_REQUEST);
        const { art, rating, hersteller, seriennr } = body;

        expect(art).to.be.equal(
            'Die Art eines Autos muss Mechanik oder Automatik sein.',
        );
        expect(rating).to.endWith('eine gueltige Bewertung.');
        expect(hersteller).to.be.equal(
            'Der Hersteller eines Autos muss FOO_VERLAG oder BAR_VERLAG sein.',
        );
        expect(seriennr).to.endWith('eine gueltige Seriennummer.');
    });

    test('Neues Auto, aber das Modell existiert bereits', async () => {
        // given: neuesAutoInvalid
        let response = await request(server)
            .post(`${loginPath}`)
            .set('Content-type', 'application/x-www-form-urlencoded')
            .send(loginDaten)
            .trustLocalhost();
        const { token } = response.body;

        // when
        response = await request(server)
            .post(path)
            .set('Authorization', `Bearer ${token}`)
            .send(neuesAutoTitelExistiert)
            .trustLocalhost();

        // then
        const { status, text } = response;
        expect(status).to.be.equal(HttpStatus.BAD_REQUEST);
        expect(text).has.string('Modell');
    });

    test('Neues Auto, aber ohne Token', async () => {
        // given: neuesAuto

        // when
        const response = await request(server)
            .post(path)
            .send(neuesAuto)
            .trustLocalhost();

        // then
        const { status, body } = response;
        expect(status).to.be.equal(HttpStatus.UNAUTHORIZED);
        expect(Object.entries(body)).to.be.empty;
    });

    test('Neues Auto, aber mit falschem Token', async () => {
        // given: neuesAuto
        const falscherToken = 'x';

        // when
        const response = await request(server)
            .post(path)
            .set('Authorization', `Bearer ${falscherToken}`)
            .send(neuesAuto)
            .trustLocalhost();

        // then
        const { status, body } = response;
        expect(status).to.be.equal(HttpStatus.UNAUTHORIZED);
        expect(Object.entries(body)).to.be.empty;
    });

    test.todo('Test mit abgelaufenem Token');
});
