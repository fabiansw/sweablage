/* eslint-disable max-classes-per-file */

// Statt JWT (nahezu) komplett zu implementieren, koennte man z.B. Passport
// verwenden
import { logger } from '../../shared';

// http://stackoverflow.com/questions/1382107/whats-a-good-way-to-extend-error-in-javascript#answer-5251506
// https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Global_Objects/Error

export class AuthorizationInvalidError extends Error {
    name = 'AuthorizationInvalidError';

    constructor(public readonly message: string) {
        super();
        logger.silly('AuthorizationInvalidError.constructor()');
        Object.setPrototypeOf(this, new.target.prototype);
        Error.captureStackTrace(this);
    }
}

export class TokenInvalidError extends Error {
    name = 'TokenInvalidError';

    constructor(public readonly message: string) {
        super();
        logger.silly('TokenInvalidError.constructor()');
        Object.setPrototypeOf(this, new.target.prototype);
        Error.captureStackTrace(this);
    }
}
