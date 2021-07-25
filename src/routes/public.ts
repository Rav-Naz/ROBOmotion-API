import { ServerError } from './../responses/server_errors';
import { GRUPY_WALK } from './../models/database/GRUPY_WALK';
import express from 'express';
import db from '../utils/database'
import { ClientError } from '../responses/client_errors';
import { Success } from '../responses/success';

const router = express.Router();

router.get('/hello', (req, res, next) => {

    const a = "asd";

    try {
        GRUPY_WALK.validator({nazwa: a});
    } catch (err) {
        ClientError.notAcceptable(res, err.message)
        return;
    }

    db.query("CALL `ROBOTY_pobierzWszystkieRoboty`();", (err, results, fields) => {

        if (err) {
            ServerError.internalServerError(res, err.sqlMessage)
            return;
        }

        Success.OK(res, results);
    })
})


export default router;