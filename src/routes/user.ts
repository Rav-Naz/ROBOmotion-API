import express from 'express';
import { ClientError } from '../responses/client_errors';
import { ServerError } from '../responses/server_errors';
import { Success } from '../responses/success';
import db from '../utils/database'


const router = express.Router();

router.get('/getAllCategories', (req, res, next) => {

    db.query("CALL `KATEGORIE_pobierzWszystkieKategorie(*)`();", (err, results, fields) => {

        if (err?.sqlState === '45000') {
            ClientError.badRequest(res, err.sqlMessage)
            return;
        } else if (err) {
            ServerError.internalServerError(res, err.sqlMessage)
            return;
        }

        Success.OK(res, results[0]);
    })
})

export default router;