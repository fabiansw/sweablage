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

import { auto, autos } from './auto';
import { Auto } from '../../entity/types';
import JSON5 from 'json5';
import { logger } from '../../../shared';
import { v4 as uuid } from 'uuid';

/* eslint-disable @typescript-eslint/no-unused-vars,require-await,@typescript-eslint/require-await */
export class AutoServiceMock {
    async findById(id: string) {
        auto._id = id;
        return auto;
    }

    async find(_?: any) {
        return autos;
    }

    async create(autoData: Auto) {
        autoData._id = uuid();
        logger.info(`Neues Auto: ${JSON5.stringify(autoData)}`);
        return autoData;
    }

    async update(autoData: Auto) {
        if (autoData.__v !== undefined) {
            autoData.__v++;
        }
        logger.info(`Aktualisiertes Auto: ${JSON5.stringify(autoData)}`);
        return Promise.resolve(autoData);
    }

    async remove(id: string) {
        logger.info(`ID des geloeschten Autos: ${id}`);
        return true;
    }
}
