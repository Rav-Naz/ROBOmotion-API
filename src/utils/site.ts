import express from 'express';
import { Success } from '../responses/success';
import { env } from 'process';
import * as access from './access';

const router = express.Router();

const eventDate = new Date(2021, 10, 28, 9, 0, 0);
router.get('/info', (req, res, next) => {

    const streamLink = env.WS_STREAMLINK;

    Success.OK(res, {
        eventDate: eventDate,
        streamLink: streamLink,
        accessToModifyExpirationDate: access.default.getExpirationDate(),
        accessToSmashRobots: access.default.getSmashRobotsExpirationDate()
    })
})


export default router;