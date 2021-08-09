import { WYNIKI_CZASOWE } from './../models/database/WYNIKI_CZASOWE';
import { WIADOMOSCI } from './../models/database/WIADOMOSCI';
import { WALKI } from './../models/database/WALKI';
import { UZYTKOWNICY } from './../models/database/UZYTKOWNICY';
import { STANOWISKA } from './../models/database/STANOWISKA';
import { KATEGORIE } from './../models/database/KATEGORIE';
import { ROBOTY } from './../models/database/ROBOTY';
import express from 'express';
import { ClientError } from '../responses/client_errors';
import { ServerError } from '../responses/server_errors';
import { Success } from '../responses/success';
import db from '../utils/database';
import * as socketIO from '../utils/socket';

const router = express.Router();

router.get('/checkIfRobotHasCategory/:robot_uuid/:kategoria_id', (req, res, next) => {

    const robot_uuid = req.params?.robot_uuid;
    const kategoria_id = Number(req.params?.kategoria_id);

    try {
        ROBOTY.validator({ robot_uuid: robot_uuid });
        KATEGORIE.validator({ kategoria_id: kategoria_id })
    } catch (err) {
        ClientError.notAcceptable(res, err.message);
        return;
    }

    db.query("CALL `KATEGORIE_ROBOTA_czyRobotMaKategorie(S)`(?, ?, @p2);", [robot_uuid, kategoria_id], (err, results, fields) => {
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

router.get('/checkIfPositionHasCategory/:stanowisko_id/:kategoria_id', (req, res, next) => {

    const stanowisko_id = Number(req.params?.stanowisko_id);
    const kategoria_id = Number(req.params?.kategoria_id);

    try {
        STANOWISKA.validator({ stanowisko_id: stanowisko_id });
        KATEGORIE.validator({ kategoria_id: kategoria_id })
    } catch (err) {
        ClientError.notAcceptable(res, err.message);
        return;
    }

    db.query("CALL `STANOWISKA_czyStanowiskoMaKategorie(S)`(?, ?, @p2);", [stanowisko_id, kategoria_id], (err, results, fields) => {
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

router.get('/getJudgePositions/:uzytkownik_uuid', (req, res, next) => {

    const uzytkownik_uuid = req.params?.uzytkownik_uuid;

    try {
        UZYTKOWNICY.validator({ uzytkownik_uuid: uzytkownik_uuid });
    } catch (err) {
        ClientError.notAcceptable(res, err.message);
        return;
    }

    db.query("CALL `UZYTKOWNICY_pobierzStanowiskaSedziego(S)`(?);",  [uzytkownik_uuid], (err, results, fields) => {
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

router.get('/getUserContactDetails/:uzytkownik_uuid', (req, res, next) => {

    const uzytkownik_uuid = req.params?.uzytkownik_uuid;

    try {
        UZYTKOWNICY.validator({ uzytkownik_uuid: uzytkownik_uuid });
    } catch (err) {
        ClientError.notAcceptable(res, err.message);
        return;
    }

    db.query("CALL `UZYTKOWNICY_pobierzDaneKontaktoweUzytkownika(S)`(?);", [uzytkownik_uuid], (err, results, fields) => {
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

router.post('/setFightResult', (req, res, next) => {

    const body = req.body;
    const walka_id = Number(body?.walka_id);
    const wygrane_rundy_robot1 = Number(body?.wygrane_rundy_robot1);
    const wygrane_rundy_robot2 = Number(body?.wygrane_rundy_robot2);
    const uzytkownik_uuid = (req.query.JWTdecoded as any).uzytkownik_uuid;

    try {
        WALKI.validator({wygrane_rundy_robot1: wygrane_rundy_robot1, wygrane_rundy_robot2: wygrane_rundy_robot2, walka_id: walka_id});
    } catch (err) {
        ClientError.notAcceptable(res, err.message);
        return;
    }

    db.query("CALL `WALKI_ustalWynikWalki(S)`(?,?,?,@p2,?);",  [walka_id, wygrane_rundy_robot1, wygrane_rundy_robot2,uzytkownik_uuid], (err, results, fields) => {
        if (err?.sqlState === '45000') {
            ClientError.badRequest(res, err.sqlMessage);
            return;
        } else if (err) {
            ServerError.internalServerError(res, err.sqlMessage);
            return;
        }

        const walka = {
            walka_id: walka_id,
            robot1_uuid: results[0][0].robot1_uuid,
            robot2_uuid: results[0][0].robot2_uuid,
            wygrane_rundy_robot1: wygrane_rundy_robot1,
            wygrane_rundy_robot2: wygrane_rundy_robot2,
            isSucces: results[0][0].pIsSucces,
        }

        socketIO.default.getIO().to("fights").to(`fights/${walka_id}`).to(`robots/${walka.robot1_uuid}`).to(`robots/${walka.robot2_uuid}`).emit("setFightResult", walka);
        Success.OK(res, walka);
    });
});

router.post('/sendMessageToAllConstructorsOfRobot', (req, res, next) => {

    const body = req?.body;
    const robot_uuid = body?.robot_uuid;
    const tresc = body?.tresc;

    try {
        ROBOTY.validator({robot_uuid: robot_uuid});
        WIADOMOSCI.validator({tresc: tresc});
    } catch (err) {
        ClientError.notAcceptable(res, err.message);
        return;
    }

    db.query("CALL `WIADOMOSCI_wyslijWiadomoscDoWszystkichKonstruktorowRobota(S)`(?,?);", [robot_uuid, tresc], (err, results, fields) => {
        if (err?.sqlState === '45000') {
            ClientError.badRequest(res, err.sqlMessage);
            return;
        } else if (err) {
            ServerError.internalServerError(res, err.sqlMessage);
            return;
        }

        Success.OK(res, results[results.length-2][0]);
    });
});

router.post('/setTimeResult', (req, res, next) => {

    const body = req.body;
    const robot_uuid = body?.robot_uuid;
    const czas_przejazdu = Number(body?.czas_przejazdu);
    const stanowisko_id = Number(body?.stanowisko_id);
    const kategoria_id = Number(body?.kategoria_id);
    const uzytkownik_uuid = (req.query.JWTdecoded as any).uzytkownik_uuid;

    try {
        ROBOTY.validator({robot_uuid: robot_uuid});
        WYNIKI_CZASOWE.validator({czas_przejazdu: czas_przejazdu, kategoria_id: kategoria_id, stanowisko_id: stanowisko_id})
    } catch (err) {
        ClientError.notAcceptable(res, err.message);
        return;
    }

    db.query("CALL `WYNIKI_CZASOWE_dodajWynik(S)`(?,?,?,?,?);",  [robot_uuid, czas_przejazdu, stanowisko_id, kategoria_id, uzytkownik_uuid], (err, results, fields) => {
        if (err?.sqlState === '45000') {
            ClientError.badRequest(res, err.sqlMessage);
            return;
        } else if (err) {
            ServerError.internalServerError(res, err.sqlMessage);
            return;
        }

        const wynik = {
            wynik_id: results[0][0].wynik_id,
            robot_id: results[0][0].robot_id,
            robot_uuid: robot_uuid,
            czas_przejazdu: czas_przejazdu,
            stanowisko_id: stanowisko_id,
            kategoria_id: kategoria_id
        }

        socketIO.default.getIO().to("times").to(`robots/${robot_uuid}`).emit("setTimeResult", wynik);
        Success.OK(res, wynik);
    });
});

router.put('/updateTimeResult', (req, res, next) => {

    const body = req.body;
    const wynik_id = Number(body?.wynik_id);
    const czas_przejazdu = Number(body?.czas_przejazdu);
    const uzytkownik_uuid = (req.query.JWTdecoded as any).uzytkownik_uuid;

    try {
        WYNIKI_CZASOWE.validator({czas_przejazdu: czas_przejazdu, wynik_id: wynik_id})
    } catch (err) {
        ClientError.notAcceptable(res, err.message);
        return;
    }

    db.query("CALL `WYNIKI_CZASOWE_edytujWynik(S)`(?,?,@p2,?);",  [wynik_id, czas_przejazdu, uzytkownik_uuid], (err, results, fields) => {
        if (err?.sqlState === '45000') {
            ClientError.badRequest(res, err.sqlMessage);
            return;
        } else if (err) {
            ServerError.internalServerError(res, err.sqlMessage);
            return;
        }

        const wynik = {
            wynik_id: wynik_id,
            robot_uuid: results[0][0].robot_uuid,
            czas_przejazdu: czas_przejazdu,
            isSucces: results[0][0].pIsSucces
        }

        socketIO.default.getIO().to("times").to(`robots/${wynik.robot_uuid}`).emit("updateTimeResult", wynik);
        Success.OK(res, wynik);
    });
});

export default router;