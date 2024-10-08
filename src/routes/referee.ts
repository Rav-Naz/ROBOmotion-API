import { WYNIKI_CZASOWE } from '../models/database/WYNIKI_CZASOWE';
import { WIADOMOSCI } from '../models/database/WIADOMOSCI';
import { WALKI } from '../models/database/WALKI';
import { UZYTKOWNICY } from '../models/database/UZYTKOWNICY';
import { STANOWISKA } from '../models/database/STANOWISKA';
import { KATEGORIE } from '../models/database/KATEGORIE';
import { ROBOTY } from '../models/database/ROBOTY';
import express from 'express';
import { ClientError } from '../responses/client_errors';
import { ServerError } from '../responses/server_errors';
import { Success } from '../responses/success';
import db from '../utils/database';
import * as socketIO from '../utils/socket';
import sms from '../utils/sms';
import { GRUPY_WALK } from '../models/database/GRUPY_WALK';
import { AKTYWNE_WALKI_I_PRZEJAZDY } from '../models/database/AKTYWNE_WALKI_I_PRZEJAZDY';
import { AKTYWNE_WALKI_I_PRZEJAZDY_pobierz } from './public';

const router = express.Router();

export function STANOWISKA_czyStanowiskoMaKategorie(res: express.Response, stanowisko_id: number, kategoria_id: number): Promise<object> {
    return new Promise<object>((resolve, reject) => {
        try {
            STANOWISKA.validator({ stanowisko_id: stanowisko_id });
            KATEGORIE.validator({ kategoria_id: kategoria_id })
        } catch (err: any) {
            ClientError.notAcceptable(res, err.message);
            reject();
            return;
        }

        db.query("CALL `STANOWISKA_czyStanowiskoMaKategorie(S)`(?, ?, @p2);", [stanowisko_id, kategoria_id], (err, results, fields) => {
            if (err?.sqlState === '45000') {
                ClientError.badRequest(res, err.sqlMessage);
                reject();
                return;
            } else if (err) {
                ServerError.internalServerError(res, err.sqlMessage);
                reject();
                return;
            }
            resolve(results[0][0]);
        });
    });
}

router.get('/checkIfRobotHasCategory/:robot_uuid/:kategoria_id', (req, res, next) => {

    const robot_uuid = req.params?.robot_uuid;
    const kategoria_id = Number(req.params?.kategoria_id);

    try {
        ROBOTY.validator({ robot_uuid: robot_uuid });
        KATEGORIE.validator({ kategoria_id: kategoria_id })
    } catch (err: any) {
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

router.put('/setRobotWeight', (req, res, next) => {


    const body = req.body;
    const robot_uuid = body?.robot_uuid;
    const weight = Number(body?.weight);

    try {
        ROBOTY.validator({ robot_uuid: robot_uuid, });
    } catch (err: any) {
        ClientError.notAcceptable(res, err.message);
        return;
    }

    db.query("CALL `ROBOTY_edytujWage(S)`(?, ?, @p2);", [weight, robot_uuid], (err, results, fields) => {
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
    } catch (err: any) {
        ClientError.notAcceptable(res, err.message);
        return;
    }

    STANOWISKA_czyStanowiskoMaKategorie(res, stanowisko_id, kategoria_id).catch(() => {
        return;
    }).then((result) => {
        Success.OK(res, result as object);
    });
});

router.get('/getRefereePositions/:uzytkownik_uuid', (req, res, next) => {

    const uzytkownik_uuid = req.params?.uzytkownik_uuid;

    try {
        UZYTKOWNICY.validator({ uzytkownik_uuid: uzytkownik_uuid });
    } catch (err: any) {
        ClientError.notAcceptable(res, err.message);
        return;
    }

    db.query("CALL `UZYTKOWNICY_pobierzStanowiskaSedziego(S)`(?);", [uzytkownik_uuid], (err, results, fields) => {
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
    } catch (err: any) {
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

router.get('/getUsers', (req, res, next) => {

    const uzytkownik_uuid = (req.query.JWTdecoded as any).uzytkownik_uuid;

    try {
        UZYTKOWNICY.validator({ uzytkownik_uuid: uzytkownik_uuid });
    } catch (err: any) {
        ClientError.notAcceptable(res, err.message);
        return;
    }

    db.query("CALL `UZYTKOWNICY_pobierzUzytkownikow(S)`(?);", [uzytkownik_uuid], (err, results, fields) => {
        if (err?.sqlState === '45000') {
            ClientError.badRequest(res, err.sqlMessage);
            return;
        } else if (err) {
            ServerError.internalServerError(res, err.sqlMessage);
            return;
        }

        const uzytkownicy = results[0];
        Success.OK(res, uzytkownicy);
    });
});

router.get('/getRobotsOfUserInCategory/:uzytkownik_uuid/:kategoria_id', (req, res, next) => {

    const uzytkownik_uuid = req.params?.uzytkownik_uuid;
    const kategoria_id = Number(req.params?.kategoria_id);

    try {
        UZYTKOWNICY.validator({ uzytkownik_uuid: uzytkownik_uuid });
        KATEGORIE.validator({ kategoria_id: kategoria_id });
    } catch (err: any) {
        ClientError.notAcceptable(res, err.message);
        return;
    }

    db.query("CALL `KONSTRUKTORZY_pobierzWszystkieRobotyKonstruktoraWKategorii(S)`(?,?);", [uzytkownik_uuid, kategoria_id], (err, results, fields) => {
        if (err?.sqlState === '45000') {
            ClientError.badRequest(res, err.sqlMessage);
            return;
        } else if (err) {
            ServerError.internalServerError(res, err.sqlMessage);
            return;
        }

        const roboty = results[0];
        Success.OK(res, roboty);
    });
});

router.post('/setFightResult', (req, res, next) => {

    const body = req.body;
    const walka_id = Number(body?.walka_id);
    const wygrane_rundy_robot1 = Number(body?.wygrane_rundy_robot1);
    const wygrane_rundy_robot2 = Number(body?.wygrane_rundy_robot2);
    const uzytkownik_uuid = (req.query.JWTdecoded as any).uzytkownik_uuid;
    const uwagi = body?.uwagi;

    try {
        WALKI.validator({ wygrane_rundy_robot1: wygrane_rundy_robot1, wygrane_rundy_robot2: wygrane_rundy_robot2, walka_id: walka_id, uwagi: uwagi });
    } catch (err: any) {
        ClientError.notAcceptable(res, err.message);
        return;
    }

    db.query("CALL `WALKI_ustalWynikWalki(S)`(?,?,?,@p2,?,?);", [walka_id, wygrane_rundy_robot1, wygrane_rundy_robot2, uzytkownik_uuid, uwagi], (err, results, fields) => {
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
            stanowisko_id: results[0][0].stanowisko_id,
            czas_zakonczenia: new Date().toISOString(),
            wygrane_rundy_robot1: wygrane_rundy_robot1,
            wygrane_rundy_robot2: wygrane_rundy_robot2,
            isSucces: results[0][0].pIsSucces,
            uwagi: uwagi
        }

        socketIO.default.getIO().to(`robots/${walka.robot1_uuid}`).to(`robots/${walka.robot2_uuid}`).emit("robots/setFightResult", walka);
        // socketIO.default.getIO().to(`robots/${walka.robot1_uuid}`).to(`robots/${walka.robot2_uuid}`).emit("robots/setFightResult", nastepna_walka);
        socketIO.default.getIO().emit("setFightResult", walka);
        if (results[2]) {
            socketIO.default.getIO().emit("addRobotToFight", results[2][0]);
        }
        Success.OK(res, walka);
    });
});

router.post('/sendMessageToAllConstructorsOfRobot', (req, res, next) => {

    const body = req?.body;
    const robot_uuid = body?.robot_uuid;
    const tresc = body?.tresc;

    try {
        ROBOTY.validator({ robot_uuid: robot_uuid });
        WIADOMOSCI.validator({ tresc: tresc });
    } catch (err: any) {
        ClientError.notAcceptable(res, err.message);
        return;
    }

    db.query("CALL `ROBOTY_pobierzDaneKonstruktorowRobota(S)`(?);", [robot_uuid], (err, results, fields) => {
        if (err?.sqlState === '45000') {
            ClientError.badRequest(res, err.sqlMessage);
            return;
        } else if (err) {
            ServerError.internalServerError(res, err.sqlMessage);
            return;
        }


        let numery = results[0];
        for (let i = 0; i < numery.length; i++) {
            db.query("CALL `WIADOMOSCI_wyslijWiadomosc(A)`(?,?);", [numery[i].uzytkownik_uuid, tresc], (err, results, fields) => {
                sms.sendSms(numery[i].numer_telefonu, tresc)
            })
        }

        let response = {
            sendedCount: numery.length
        }

        Success.OK(res, response);
    });
});

router.put('/confirmStarterpackGiven', (req, res, next) => {

    const body = req?.body;
    const uzytkownik_uuid = body?.uzytkownik_uuid;

    try {
        UZYTKOWNICY.validator({ uzytkownik_uuid: uzytkownik_uuid });
    } catch (err: any) {
        ClientError.notAcceptable(res, err.message);
        return;
    }

    db.query("CALL `UZYTKOWNICY_potwierdzWydanieStarterpacka(S)`(?);", [uzytkownik_uuid], (err, results, fields) => {
        if (err?.sqlState === '45000') {
            ClientError.badRequest(res, err.sqlMessage);
            return;
        } else if (err) {
            ServerError.internalServerError(res, err.sqlMessage);
            return;
        }
        let resp = {
            uzytkownik_uuid: uzytkownik_uuid,
            czy_odebral_starterpack: 1
        }
        socketIO.default.getIO().to("referee").to("admin").emit("user/giveStarterpack", resp);
        Success.OK(res);
    });
});

router.put('/setBarcode', (req, res, next) => {

    const body = req?.body;
    const uzytkownik_uuid = body?.uzytkownik_uuid;
    const uzytkownik_kod = body?.uzytkownik_kod;

    try {
        UZYTKOWNICY.validator({ uzytkownik_uuid: uzytkownik_uuid, uzytkownik_kod: uzytkownik_kod });
    } catch (err: any) {
        ClientError.notAcceptable(res, err.message);
        return;
    }

    db.query("CALL `UZYTKOWNICY_dodajKodKreskowy(S)`(?, ?);", [uzytkownik_uuid, uzytkownik_kod], (err, results, fields) => {
        if (err?.sqlState === '45000') {
            ClientError.badRequest(res, err.sqlMessage);
            return;
        } else if (err) {
            ServerError.internalServerError(res, err.sqlMessage);
            return;
        }
        let resp = {
            uzytkownik_uuid: uzytkownik_uuid,
            uzytkownik_kod: uzytkownik_kod
        }
        socketIO.default.getIO().to("referee").to("admin").emit("user/setBarcode", resp);
        Success.OK(res);
    });
});

router.put('/confirmArrival', (req, res, next) => {

    const body = req?.body;
    const robot_uuid = body?.robot_uuid;
    const value = body?.value;
    try {
        ROBOTY.validator({ robot_uuid: robot_uuid });
    } catch (err: any) {
        ClientError.notAcceptable(res, err.message);
        return;
    }

    db.query("CALL `ROBOTY_potwierdzDotarcie(S)`(?, @p2, ?);", [robot_uuid, value ? 1 : 0], (err, results, fields) => {
        if (err?.sqlState === '45000') {
            ClientError.badRequest(res, err.sqlMessage);
            return;
        } else if (err) {
            ServerError.internalServerError(res, err.sqlMessage);
            return;
        }
        const robot = results[0][0];
        socketIO.default.getIO().to(`robots/${robot_uuid}`).to("referee").to("admin").emit("robots/newArrival", robot);
        Success.OK(res, robot);
    });
});

router.post('/setTimeResult', (req, res, next) => {

    const body = req.body;
    const robot_uuid = body?.robot_uuid;
    const czas_przejazdu = Number(body?.czas_przejazdu);
    const stanowisko_id = Number(body?.stanowisko_id);
    const kategoria_id = Number(body?.kategoria_id);
    const uzytkownik_uuid = (req.query.JWTdecoded as any).uzytkownik_uuid;
    const uwagi = body?.uwagi;
    try {
        ROBOTY.validator({ robot_uuid: robot_uuid });
        WYNIKI_CZASOWE.validator({ czas_przejazdu: czas_przejazdu, kategoria_id: kategoria_id, stanowisko_id: stanowisko_id, uwagi: uwagi })
    } catch (err: any) {
        ClientError.notAcceptable(res, err.message);
        return;
    }

    db.query("CALL `WYNIKI_CZASOWE_dodajWynik(S)`(?,?,?,?,?,?);", [robot_uuid, czas_przejazdu, stanowisko_id, kategoria_id, uzytkownik_uuid, uwagi], (err, results, fields) => {
        if (err?.sqlState === '45000') {
            ClientError.badRequest(res, err.sqlMessage);
            return;
        } else if (err) {
            ServerError.internalServerError(res, err.sqlMessage);
            return;
        }

        const wynik = {
            wynik_id: results[3][0].wynik_id,
            robot_id: results[3][0].robot_id,
            nazwa_robota: results[3][0].nazwa_robota,
            nazwa_kategorii: results[3][0].nazwa_kategorii,
            nazwa_stanowiska: results[3][0].nazwa_stanowiska,
            czas_zakonczenia: new Date().toISOString(),
            robot_uuid: robot_uuid,
            czas_przejazdu: czas_przejazdu,
            stanowisko_id: stanowisko_id,
            kategoria_id: kategoria_id,
            uwagi: uwagi
        }

        socketIO.default.getIO().to(`robots/${robot_uuid}`).emit("robots/setTimeResult", wynik);
        socketIO.default.getIO().emit("setTimeResult", wynik);
        Success.OK(res, wynik);
    });
});

router.put('/updateTimeResult', (req, res, next) => {

    const body = req.body;
    const wynik_id = Number(body?.wynik_id);
    const czas_przejazdu = Number(body?.czas_przejazdu);
    const uzytkownik_uuid = (req.query.JWTdecoded as any).uzytkownik_uuid;
    const uwagi = body?.uwagi;

    try {
        WYNIKI_CZASOWE.validator({ czas_przejazdu: czas_przejazdu, wynik_id: wynik_id, uwagi: uwagi })
    } catch (err: any) {
        ClientError.notAcceptable(res, err.message);
        return;
    }

    db.query("CALL `WYNIKI_CZASOWE_edytujWynik(S)`(?,?,@p2,?,?);", [wynik_id, czas_przejazdu, uzytkownik_uuid, uwagi], (err, results, fields) => {
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
            isSucces: results[0][0].pIsSucces,
            uwagi: uwagi
        }

        socketIO.default.getIO().to(`robots/${wynik.robot_uuid}`).emit("robots/updateTimeResult", wynik);
        socketIO.default.getIO().emit("updateTimeResult", wynik);
        Success.OK(res, wynik);
    });
});

router.delete('/deleteTimeResult', (req, res, next) => {

    const body = req?.body;
    const wynik_id = body?.wynik_id;

    try {
        WYNIKI_CZASOWE.validator({ wynik_id: wynik_id })
    } catch (err: any) {
        ClientError.notAcceptable(res, err.message);
        return;
    }

    db.query("CALL `WYNIKI_CZASOWE_usunWynik(A)`(?,@p2);", [wynik_id], (err, results, fields) => {
        if (err?.sqlState === '45000') {
            ClientError.badRequest(res, err.sqlMessage);
            return;
        } else if (err) {
            ServerError.internalServerError(res, err.sqlMessage);
            return;
        }
        const response = {
            success: results[0][0],
            wynik_id: wynik_id
        };
        socketIO.default.getIO().emit("deleteTimeResult", response);
        Success.OK(res, response);
    });
});

router.put('/activateGroup', (req, res, next) => {

    const body = req?.body;
    const grupa_id = body?.grupa_id;

    try {
        GRUPY_WALK.validator({ grupa_id: grupa_id })
    } catch (err: any) {
        ClientError.notAcceptable(res, err.message);
        return;
    }

    db.query("CALL `GRUPY_WALK_aktywujGrupe(S)`(?);", [grupa_id], (err, results, fields) => {
        if (err?.sqlState === '45000') {
            ClientError.badRequest(res, err.sqlMessage);
            return;
        } else if (err) {
            ServerError.internalServerError(res, err.sqlMessage);
            return;
        }
        const response = {
            grupa_id: grupa_id,
            czy_aktywna: 1
        }
        socketIO.default.getIO().emit("activateGroup", response);
        Success.OK(res, response);
    });
});

router.put('/deactivateGroup', (req, res, next) => {

    const body = req?.body;
    const grupa_id = body?.grupa_id;

    try {
        GRUPY_WALK.validator({ grupa_id: grupa_id })
    } catch (err: any) {
        ClientError.notAcceptable(res, err.message);
        return;
    }

    db.query("CALL `GRUPY_WALK_dezaktywujGrupe(S)`(?);", [grupa_id], (err, results, fields) => {
        if (err?.sqlState === '45000') {
            ClientError.badRequest(res, err.sqlMessage);
            return;
        } else if (err) {
            ServerError.internalServerError(res, err.sqlMessage);
            return;
        }
        const response = {
            grupa_id: grupa_id,
            czy_aktywna: 0
        }
        socketIO.default.getIO().emit("activateGroup", response);
        Success.OK(res, response);
    });
});

router.post('/sendPrivateMessage', (req, res, next) => {

    const body = req?.body;
    const uzytkownik_uuid = body?.uzytkownik_uuid;
    const tresc = body?.tresc;

    try {
        UZYTKOWNICY.validator({ uzytkownik_uuid: uzytkownik_uuid })
        WIADOMOSCI.validator({ tresc: tresc });
    } catch (err: any) {
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
        let numer_telefonu = results[0][0].numer_telefonu;
        const wiadomosc = {
            numer_telefonu: numer_telefonu,
            uzytkownik_uuid: uzytkownik_uuid,
            tresc: tresc
        }
        if (numer_telefonu != null) {
            db.query("CALL `WIADOMOSCI_wyslijWiadomosc(A)`(?,?);", [uzytkownik_uuid, tresc], (err, results, fields) => {
                sms.sendSms(numer_telefonu, tresc);
            })
        }
        Success.OK(res, wiadomosc);
    });
});


router.post('/addCurrentFightOrTime', (req, res, next) => {

    const body = req?.body;
    const stanowisko_id = Number(body?.stanowisko_id);
    const kategoria_id = Number(body?.kategoria_id);
    const ring_arena = Number(body?.ring_arena);
    const robot1_id = Number(body?.robot1_id);
    const robot2_id = Number(body?.robot2_id);

    try {
        AKTYWNE_WALKI_I_PRZEJAZDY.validator({ kategoria_id: kategoria_id, ring_arena: ring_arena, robot1_id: robot1_id, robot2_id: robot2_id, stanowisko_id: stanowisko_id })
    } catch (err: any) {
        ClientError.notAcceptable(res, err.message);
        return;
    }

    db.query("CALL `AKTYWNE_WALKI_I_PRZEJAZDY_dodajWpis(S)`(?,?,?,?,?);", [stanowisko_id, kategoria_id, ring_arena, robot1_id, robot2_id], async (err, results, fields) => {
        if (err?.sqlState === '45000') {
            ClientError.badRequest(res, err.sqlMessage);
            return;
        } else if (err) {
            ServerError.internalServerError(res, err.sqlMessage);
            return;
        }
        const response = {
            aktywne_walki_i_przejazdy_id: results[0][0].aktywne_walki_i_przejazdy_id,
            stanowisko_id: stanowisko_id,
            kategoria_id: kategoria_id,
            ring_arena: ring_arena,
            robot1_id: robot1_id,
            robot2_id: robot2_id
        }
        socketIO.default.getIO().emit("currentFightsOrTimes", await AKTYWNE_WALKI_I_PRZEJAZDY_pobierz(res));
        Success.OK(res, response);
    });
});

router.delete('/removeCurrentFightOrTime', (req, res, next) => {

    const body = req?.body;
    const stanowisko_id = Number(body?.stanowisko_id);
    const kategoria_id = Number(body?.kategoria_id);
    const ring_arena = Number(body?.ring_arena);

    try {
        AKTYWNE_WALKI_I_PRZEJAZDY.validator({ kategoria_id: kategoria_id, ring_arena: ring_arena, stanowisko_id: stanowisko_id })
    } catch (err: any) {
        ClientError.notAcceptable(res, err.message);
        return;
    }

    db.query("CALL `AKTYWNE_WALKI_I_PRZEJAZDY_usunWpis(S)`(?,?,?);", [stanowisko_id, kategoria_id, ring_arena], async (err, results, fields) => {
        if (err?.sqlState === '45000') {
            ClientError.badRequest(res, err.sqlMessage);
            return;
        } else if (err) {
            ServerError.internalServerError(res, err.sqlMessage);
            return;
        }
        const response = {
            stanowisko_id: stanowisko_id,
            kategoria_id: kategoria_id,
            ring_arena: ring_arena
        }
        socketIO.default.getIO().emit("currentFightsOrTimes", await AKTYWNE_WALKI_I_PRZEJAZDY_pobierz(res));
        Success.OK(res, response);
    });
});

export default router;