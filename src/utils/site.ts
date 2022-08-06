import express from 'express';
import { Success } from '../responses/success';
import { env } from 'process';
import time_constraints from './time_constraints';
import register_addons from './register_addons';

const router = express.Router();

router.get('/info', (req, res, next) => {

    const streamLink = env.WS_STREAMLINK;

    Success.OK(res, {
        eventDate: time_constraints.getTimeConstraint('Zawody'),
        streamLink: streamLink,
        accessToModifyExpirationDate: time_constraints.getTimeConstraint('Rejestracja')
    })
})

router.get('/registerAddons', (req, res, next) => {

    Success.OK(res, {
        rozmiaryKoszulek: register_addons.getRozmiaryKoszulek(),
        jedzenie: register_addons.getJedzenie()
    })
})

export default router;