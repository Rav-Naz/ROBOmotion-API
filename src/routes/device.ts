import express from 'express';
import { WIADOMOSCI } from '../models/database/WIADOMOSCI';
import { ClientError } from '../responses/client_errors';
import { ServerError } from '../responses/server_errors';
import { Success } from '../responses/success';
import db from '../utils/database';
import sms from '../utils/sms';
import * as visitor_counter from '../utils/visitor_counter';


const router = express.Router();

router.post('/confirmSendMessage', (req, res, next) => {

    const body = req?.body;
    const wiadomosc_id = Number(body?.wiadomosc_id);

    try {
        WIADOMOSCI.validator({wiadomosc_id: wiadomosc_id});
    } catch (err: any) {
        ClientError.notAcceptable(res, err.message);
    }
    
    db.query("CALL `WIADOMOSCI_potwierdzWyslanieWiadomosci(A)`(?,@p2);", [wiadomosc_id], (err, results, fields) => {
        if (err?.sqlState === '45000') {
            ClientError.badRequest(res, err.sqlMessage);
            return;
        } else if (err) {
            ServerError.internalServerError(res, err.sqlMessage);
            return;
        }

        Success.OK(res, results[0][0]);
    });
});

router.get('/getRecipients', (req, res, next) => {
    
    db.query("CALL `WIADOMOSCI_pobierzAdresatow(A)`();", (err, results, fields) => {
        if (err?.sqlState === '45000') {
            ClientError.badRequest(res, err.sqlMessage);
            return;
        } else if (err) {
            ServerError.internalServerError(res, err.sqlMessage);
            return;
        }

        Success.OK(res, results[0]);
    });
});

router.get('/saveCurrentVisitorsCount', (req, res, next) => {
    
    db.query("CALL `ILE_OSOB_NA_WYDARZENIU_zapisz(D)`(?)",[visitor_counter.default.getIleOsobNaWydarzeniu()], (err, results, fields) => {
        if (err?.sqlState === '45000') {
            ClientError.badRequest(res, err.sqlMessage);
            return;
        } else if (err) {
            ServerError.internalServerError(res, err.sqlMessage);
            return;
        }

        Success.OK(res);
    });
});

router.get('/refreshCallapiToken', (req, res, next) => {
    sms.login();
    Success.OK(res);
});

router.get('/removeJunks', (req, res, next) => {
    
    db.query("CALL `_removeJunks`();", (err, results, fields) => {
        if (err?.sqlState === '45000') {
            ClientError.badRequest(res, err.sqlMessage);
            return;
        } else if (err) {
            ServerError.internalServerError(res, err.sqlMessage);
            return;
        }

        Success.OK(res);
    });
});


export default router;