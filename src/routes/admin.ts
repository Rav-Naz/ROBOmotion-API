import { KATEGORIE } from './../models/database/KATEGORIE';
import { WYNIKI_CZASOWE } from './../models/database/WYNIKI_CZASOWE';
import { UZYTKOWNICY } from './../models/database/UZYTKOWNICY';
import { WIADOMOSCI } from './../models/database/WIADOMOSCI';
import { WALKI } from './../models/database/WALKI';
import { ROBOTY } from './../models/database/ROBOTY';
import express from 'express';
import { GRUPY_WALK } from '../models/database/GRUPY_WALK';
import { ClientError } from '../responses/client_errors';
import db from '../utils/database';
import { ServerError } from '../responses/server_errors';
import { Success } from '../responses/success';
import * as socketIO from '../utils/socket';



const router = express.Router();

function GRUPY_WALK_dodajGrupe(res: express.Response, nazwa: string, kategoria_id: number): Promise<object> {
    return new Promise<object>((resolve, reject) => {
        try {
            GRUPY_WALK.validator({nazwa: nazwa, kategoria_id: kategoria_id});
        } catch (err) {
            ClientError.notAcceptable(res, err.message);
            reject();
        }

        db.query("CALL `GRUPY_WALK_dodajGrupe(A)`(?, ?);", [nazwa, kategoria_id], (err, results, fields) => {
            if (err?.sqlState === '45000') {
                ClientError.badRequest(res, err.sqlMessage);
                reject();
                return;
            } else if (err) {
                ServerError.internalServerError(res, err.sqlMessage);
                reject();
                return;
            }
            const grupa = {
                grupa_id: results[1][0].grupa_id,
                nazwa: nazwa
            };
            socketIO.default.getIO().emit("addGroup", grupa);
            resolve(grupa);
        });
    });
}

function WALKI_dodajWalke(res: express.Response, stanowisko_id: number, nastepna_walka_id: number, grupa_id: number): Promise<object> {
    return new Promise<object>((resolve, reject) => {
        try {
            WALKI.validator({stanowisko_id: stanowisko_id, nastepna_walka_id: nastepna_walka_id, grupa_id: grupa_id});
        } catch (err) {
            ClientError.notAcceptable(res, err.message);
            reject();
        }

        db.query("CALL `WALKI_dodajWalke(A)`(?,?,?, @p1, @p2);", [stanowisko_id, nastepna_walka_id, grupa_id], (err, results, fields) => {
            if (err?.sqlState === '45000') {
                ClientError.badRequest(res, err.sqlMessage);
                reject();
                return;
            } else if (err) {
                ServerError.internalServerError(res, err.sqlMessage);
                reject();
                return;
            }
            const walka = {
                walka_id: (results as any)[0][0].walka_id,
                robot1_id: null,
                robot2_id: null,
                wygrane_rundy_robot1: null,
                wygrane_rundy_robot2: null,
                czas_zakonczenia: null,
                stanowisko_id: stanowisko_id,
                nastepna_walka_id: nastepna_walka_id === 0 ? null : nastepna_walka_id,
                grupa_id: grupa_id,
    
            };
            socketIO.default.getIO().emit("addFight", walka);
            resolve(walka);
        });
    });
}

router.post('/addGroup', (req, res, next) => {

    const body = req?.body;
    const nazwa = body?.nazwa;
    const kategoria_id = Number(body?.kategoria_id);
    try {
        GRUPY_WALK.validator({nazwa: nazwa, kategoria_id: kategoria_id});
    } catch (err) {
        ClientError.notAcceptable(res, err.message);
        return;
    }

    GRUPY_WALK_dodajGrupe(res,nazwa,kategoria_id).catch(() => {
        ServerError.internalServerError(res);
    }).then((result) => {
        Success.OK(res, result as object);
    });
});

router.delete('/deleteGroup', (req, res, next) => {

    const body = req?.body;
    const grupa_id = Number(body?.grupa_id);
    try {
        GRUPY_WALK.validator({grupa_id: grupa_id});
    } catch (err) {
        ClientError.notAcceptable(res, err.message);
        return;
    }

    db.query("CALL `GRUPY_WALK_usunGrupe(A)`(?, @p2);", [grupa_id], (err, results, fields) => {
        if (err?.sqlState === '45000') {
            ClientError.badRequest(res, err.sqlMessage);
            return;
        } else if (err) {
            ServerError.internalServerError(res, err.sqlMessage);
            return;
        }
        const grupa = {
            grupa_id: grupa_id,
            isSucces: results[0][0].pIsSucces
        };
        socketIO.default.getIO().emit("deleteGroup", grupa);
        Success.OK(res, grupa);
    });
});

router.put('/confirmArrival', (req, res, next) => {

    const body = req?.body;
    const robot_uuid = body?.robot_uuid;
    try {
        ROBOTY.validator({robot_uuid: robot_uuid});
    } catch (err) {
        ClientError.notAcceptable(res, err.message);
        return;
    }

    db.query("CALL `ROBOTY_potwierdzDotarcie(A)`(?, @p2);", [robot_uuid], (err, results, fields) => {
        if (err?.sqlState === '45000') {
            ClientError.badRequest(res, err.sqlMessage);
            return;
        } else if (err) {
            ServerError.internalServerError(res, err.sqlMessage);
            return;
        }
        const robot = results[0][0];
        socketIO.default.getIO().to(`robots/${robot_uuid}`).to("referee").to("admin").emit("newArrival", robot);
        Success.OK(res, robot);
    });
});

router.post('/addFight', (req, res, next) => {

    const body = req?.body;
    const stanowisko_id = Number(body?.stanowisko_id);
    const nastepna_walka_id = Number(body?.nastepna_walka_id);
    const grupa_id = Number(body?.grupa_id);

    try {
        WALKI.validator({stanowisko_id: stanowisko_id, nastepna_walka_id: nastepna_walka_id, grupa_id: grupa_id});
    } catch (err) {
        ClientError.notAcceptable(res, err.message);
        return;
    }
    
    WALKI_dodajWalke(res,stanowisko_id,nastepna_walka_id,grupa_id).catch(() => {
        ServerError.internalServerError(res);
    }).then((result) => {
        Success.OK(res, result as object);
    });
});

router.post('/addFightAndRobots', (req, res, next) => {

    const body = req?.body;
    const stanowisko_id = Number(body?.stanowisko_id);
    const grupa_id = Number(body?.grupa_id);
    const robot1_uuid = body?.robot1_uuid;
    const robot2_uuid = body?.robot2_uuid;

    try {
        ROBOTY.validator({robot_uuid: robot1_uuid});
        ROBOTY.validator({robot_uuid: robot2_uuid});
        WALKI.validator({stanowisko_id: stanowisko_id, grupa_id: grupa_id});
    } catch (err) {
        ClientError.notAcceptable(res, err.message);
        return;
    }
    
    db.query("CALL `WALKI_dodajWalkeOrazRoboty(A)`(?,?,@p2,?,?);", [robot1_uuid, robot2_uuid, grupa_id, stanowisko_id], (err, results, fields) => {
        if (err?.sqlState === '45000') {
            ClientError.badRequest(res, err.sqlMessage);
            return;
        } else if (err) {
            ServerError.internalServerError(res, err.sqlMessage);
            return;
        }
        const walka = results[results.length-2][0];
        socketIO.default.getIO().emit("addRobotToFight", walka);
        Success.OK(res, walka);
    });
});

router.post('/addRobotToFight', (req, res, next) => {

    const body = req?.body;
    const walka_id = Number(body?.walka_id);
    const robot_uuid = body?.robot_uuid;

    try {
        WALKI.validator({walka_id: walka_id});
        ROBOTY.validator({robot_uuid: robot_uuid});
    } catch (err) {
        ClientError.notAcceptable(res, err.message);
        return;
    }
    
    db.query("CALL `WALKI_dodajRobotaDoWalki(A)`(?,?, @p2);", [robot_uuid, walka_id], (err, results, fields) => {
        if (err?.sqlState === '45000') {
            ClientError.badRequest(res, err.sqlMessage);
            return;
        } else if (err) {
            ServerError.internalServerError(res, err.sqlMessage);
            return;
        }
        const walka = results[2][0];
        socketIO.default.getIO().emit("addRobotToFight", walka);
        Success.OK(res, walka);
    });
});

router.delete('/removeFight', (req, res, next) => {

    const body = req?.body;
    const walka_id = Number(body?.walka_id);

    try {
        WALKI.validator({walka_id: walka_id});
    } catch (err) {
        ClientError.notAcceptable(res, err.message);
    }
    
    db.query("CALL `WALKI_usunWalke(A)`(?, @p2);", [walka_id], (err, results, fields) => {
        if (err?.sqlState === '45000') {
            ClientError.badRequest(res, err.sqlMessage);
            return;
        } else if (err) {
            ServerError.internalServerError(res, err.sqlMessage);
            return;
        }
        const walka = {
            walka_id: walka_id,
            isSucces: results[0][0].pIsSucces
        };
        socketIO.default.getIO().emit("removeFight", walka);
        Success.OK(res, walka);
    });
});

router.post('/sendPrivateMessage', (req, res, next) => {

    const body = req?.body;
    const uzytkownik_uuid = body?.uzytkownik_uuid;
    const tresc = body?.tresc;

    try {
        UZYTKOWNICY.validator({uzytkownik_uuid: uzytkownik_uuid})
        WIADOMOSCI.validator({tresc: tresc});
    } catch (err) {
        ClientError.notAcceptable(res, err.message);
        return;
    }
    
    db.query("CALL `WIADOMOSCI_wyslijWiadomosc(A)`(?,?);", [uzytkownik_uuid, tresc], (err, results, fields) => {
        if (err?.sqlState === '45000') {
            ClientError.badRequest(res, err.sqlMessage);
            return;
        } else if (err) {
            ServerError.internalServerError(res, err.sqlMessage);
            return;
        }
        const wiadomosc = {
            wiadomosc_id: results[0][0].wiadomosc_id,
            uzytkownik_uuid: uzytkownik_uuid,
            tresc: tresc
        }
        Success.OK(res, wiadomosc);
    });
});

router.delete('/deleteTimeResult', (req, res, next) => {

    const body = req?.body;
    const wynik_id = body?.wynik_id;

    try {
        WYNIKI_CZASOWE.validator({wynik_id: wynik_id})
    } catch (err) {
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
       
        Success.OK(res, results[0][0]);
    });
});

router.post('/createGroupsFromCategory', (req, res, next) => {

    const body = req?.body;
    const kategoria_id = Number(body?.kategoria_id);
    const stanowiskaLista = Array(body?.stanowiskaLista);
    const iloscDoFInalu = Number(body?.iloscDoFinalu);
    const nazwyGrup = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"]

    try {
        KATEGORIE.validator({kategoria_id: kategoria_id});
    } catch (err) {
        ClientError.notAcceptable(res, err.message);
        return;
    }

    //sprawdzenie stanowiska pod względem kategorii

    //pobranie robotow do ustawienia

    //sprawdzenie czy ilość stanowisk <= ilość do finalu <= ilość robotów
    
    //sprawdzenie czy ilosc do finalu, ilosc stanowisk 2^n

    //DRZEWKO FINAŁU
        //utwórz grupe finałową
        //rozpocznij od walki szczytowej, zejdź do podstawy gdzie ilość walk/2 = ilosć do finału
        
    //ELIMINACJE
        //podziel roboty na grupy (losowo), ilością równe ilości do finału
        //utwórz grupę eliminacyjną + literka
            //w każdej grupie ustaw roboty, przeciwko sobie
    
    // db.query("CALL `WIADOMOSCI_wyslijWiadomosc(A)`(?,?);", [uzytkownik_uuid, tresc], (err, results, fields) => {
    //     if (err?.sqlState === '45000') {
    //         ClientError.badRequest(res, err.sqlMessage);
    //         return;
    //     } else if (err) {
    //         ServerError.internalServerError(res, err.sqlMessage);
    //         return;
    //     }
    //     const wiadomosc = {
    //         wiadomosc_id: results[0][0].wiadomosc_id,
    //         uzytkownik_uuid: uzytkownik_uuid,
    //         tresc: tresc
    //     }
    //     Success.OK(res, wiadomosc);
    // });
});

export default router;