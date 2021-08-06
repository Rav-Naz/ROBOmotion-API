import express from 'express';
import { Success } from '../responses/success';
import { env } from 'process';
import * as socketIO from '../utils/socket';

const router = express.Router();

router.get('/info', (req, res, next) => {

    const eventDate = new Date(2021, 10, 27, 9, 0, 0);
    const streamLink = env.WS_STREAMLINK;

    Success.OK(res, {
        eventDate: eventDate,
        streamLink: streamLink
    })
})


export default router;