import type { User } from './user.service';

export const users: Array<User> = [
    {
        _id: '20000000-0000-0000-0000-000000000001',
        username: 'admin',
        password:
            '$2b$12$jC0vLwqFtvikW9hrKL4RZ.ZMeaW5r/jYrNkm.ub23bMWL/mE2O20O',
        email: 'admin@auto.com',
        roles: ['admin', 'mitarbeiter', 'kunde'],
    },
    {
        _id: '20000000-0000-0000-0000-000000000002',
        username: 'brenna.olson',
        password:
            '$2b$12$jC0vLwqFtvikW9hrKL4RZ.ZMeaW5r/jYrNkm.ub23bMWL/mE2O20O',
        email: 'brenna.olson@auto.com',
        roles: ['admin', 'mitarbeiter', 'kunde'],
    },
    {
        _id: '20000000-0000-0000-0000-000000000003',
        username: 'debra.knott',
        password:
            '$2b$12$jC0vLwqFtvikW9hrKL4RZ.ZMeaW5r/jYrNkm.ub23bMWL/mE2O20O',
        email: 'debra.knott@auto.com',
        roles: ['mitarbeiter', 'kunde'],
    },
    {
        _id: '20000000-0000-0000-0000-000000000004',
        username: 'kevin.richard',
        password:
            '$2b$12$jC0vLwqFtvikW9hrKL4RZ.ZMeaW5r/jYrNkm.ub23bMWL/mE2O20O',
        email: 'kevin.richard@auto.com',
        roles: ['mitarbeiter', 'kunde'],
    },
    {
        _id: '20000000-0000-0000-0000-000000000005',
        username: 'dominik.brandt',
        password:
            '$2b$12$jC0vLwqFtvikW9hrKL4RZ.ZMeaW5r/jYrNkm.ub23bMWL/mE2O20O',
        email: 'dominik.brandt@auto.com',
        roles: ['kunde'],
    },
    {
        _id: '20000000-0000-0000-0000-000000000006',
        username: 'richard.wyatt',
        password:
            '$2b$12$jC0vLwqFtvikW9hrKL4RZ.ZMeaW5r/jYrNkm.ub23bMWL/mE2O20O',
        email: 'richard.wyatt@auto.com',
    },
];
