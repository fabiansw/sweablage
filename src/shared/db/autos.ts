/*
 * Copyright (C) 2020 - present Juergen Zimmermann, Hochschule Karlsruhe
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

export const autos = [
    {
        _id: '00000000-0000-0000-0000-000000000001',
        modell: 'Golf',
        rating: 4,
        art: 'AUTOMATIK',
        hersteller: 'VW_HERSTELLER',
        preis: 11.1,
        premium: 0.011,
        lieferbar: true,
        // https://docs.mongodb.com/manual/reference/method/Date
        datum: new Date('2019-02-01'),
        seriennr: '978-3897225831',
        homepage: 'https://acme..at/',
        assistenzsysteme: ['TEMPOMAT'],
        autohaeuser: [
            {
                nachname: 'Alpha',
                vorname: 'Adriana',
            },
            {
                nachname: 'Alpha',
                vorname: 'Alfred',
            },
        ],
        __v: 0,
        createdAt: new Date('2019-02-01'),
        updatedAt: new Date('2019-02-01'),
    },
    {
        _id: '00000000-0000-0000-0000-000000000002',
        modell: 'Carrera GTS',
        rating: 2,
        art: 'MECHANIK',
        hersteller: 'PORSCHE_HERSTELLER',
        preis: 22.2,
        premium: 0.022,
        lieferbar: true,
        datum: new Date('2019-02-02'),
        seriennr: '978-3827315526',
        homepage: 'https://acme..biz/',
        assistenzsysteme: ['AUTOPILOT'],
        autohaeuser: [
            {
                nachname: 'Beta',
                vorname: 'Brunhilde',
            },
        ],
        __v: 0,
        createdAt: new Date('2019-02-01'),
        updatedAt: new Date('2019-02-01'),
    },
    {
        _id: '00000000-0000-0000-0000-000000000003',
        modell: 'Polo',
        rating: 1,
        art: 'AUTOMATIK',
        hersteller: 'VW_HERSTELLER',
        preis: 33.3,
        premium: 0.033,
        lieferbar: true,
        datum: new Date('2019-02-03'),
        seriennr: '978-0201633610',
        homepage: 'https://acme.com/',
        assistenzsysteme: ['TEMPOMAT', 'AUTOPILOT'],
        autohaeuser: [
            {
                nachname: 'Gamma',
                vorname: 'Claus',
            },
        ],
        __v: 0,
        createdAt: new Date('2019-02-01'),
        updatedAt: new Date('2019-02-01'),
    },
    {
        _id: '00000000-0000-0000-0000-000000000004',
        modell: 'Turbo S',
        rating: 3,
        art: 'AUTOMATIK',
        hersteller: 'PORSCHE_HERSTELLER',
        preis: 44.4,
        premium: 0.044,
        lieferbar: true,
        datum: new Date('2019-02-04'),
        seriennr: '978-0387534046',
        homepage: 'https://acme.de/',
        assistenzsysteme: [],
        autohaeuser: [
            {
                nachname: 'Delta',
                vorname: 'Dieter',
            },
        ],
        __v: 0,
        createdAt: new Date('2019-02-01'),
        updatedAt: new Date('2019-02-01'),
    },
    {
        _id: '00000000-0000-0000-0000-000000000005',
        modell: 'Touran',
        rating: 2,
        art: 'MECHANIK',
        hersteller: 'VW_HERSTELLER',
        preis: 55.5,
        premium: 0.055,
        lieferbar: true,
        datum: new Date('2019-02-05'),
        seriennr: '978-3824404810',
        homepage: 'https://acme.es/',
        assistenzsysteme: ['AUTOPILOT'],
        autohaeuser: [
            {
                nachname: 'Epsilon',
                vorname: 'Elfriede',
            },
        ],
        __v: 0,
        createdAt: new Date('2019-02-01'),
        updatedAt: new Date('2019-02-01'),
    },
];
