import { KONSTRUKTORZY } from './../models/database/KONSTRUKTORZY';
import { KATEGORIE } from './../models/database/KATEGORIE';
import { UZYTKOWNICY } from './../models/database/UZYTKOWNICY';
import { ROBOTY } from './../models/database/ROBOTY';
import express from 'express';
import { ClientError } from '../responses/client_errors';
import { ServerError } from '../responses/server_errors';
import { Success } from '../responses/success';
import db from '../utils/database';
import * as access from '../utils/access';
import * as socketIO from '../utils/socket';
import auth from '../utils/auth';


const router = express.Router();

function KONSTRUKTORZY_czyUzytkownikJestKonstruktoremRobota(res: express.Response, robot_uuid: string, uzytkownik_uuid: string): Promise<object> {
    return new Promise<object>((resolve, reject) => {
        try {
            ROBOTY.validator({robot_uuid: robot_uuid});
            UZYTKOWNICY.validator({uzytkownik_uuid: uzytkownik_uuid});
        } catch (err) {
            ClientError.notAcceptable(res, err.message);
            reject();
            return;
        }

        db.query("CALL `KONSTRUKTORZY_czyUzytkownikJestKonstruktoremRobota(U)`(?, ?, @p2);", [robot_uuid, uzytkownik_uuid], (err, results, fields) => {
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

export function KONSTRUKTORZY_pobierzWszystkieRobotyKonstruktora(uzytkownik_uuid: string, res?: express.Response): Promise<object> {
    return new Promise<object>((resolve, reject) => {
        try {
            UZYTKOWNICY.validator({uzytkownik_uuid: uzytkownik_uuid});
        } catch (err) {
            if (res) {
                ClientError.notAcceptable(res, err.message);
            }
            reject();
        }

        db.query("CALL `KONSTRUKTORZY_pobierzWszystkieRobotyKonstruktora(U)`(?);", [uzytkownik_uuid], (err, results, fields) => {
            if (err?.sqlState === '45000') {
                if (res) {
                    ClientError.badRequest(res, err.sqlMessage);
                }
                reject();
                return;
            } else if (err) {
                if (res) {
                    ServerError.internalServerError(res, err.sqlMessage);
                }
                reject();
                return;
            }
            resolve(results[0]);
        });
    });
}

router.get('/checkIfUserIsConstructorOfRobot/:uzytkownik_uuid/:robot_uuid', (req, res, next) => {

    const robot_uuid = req.params?.robot_uuid;
    const uzytkownik_uuid = req.params?.uzytkownik_uuid;
    try {
        ROBOTY.validator({robot_uuid: robot_uuid});
        UZYTKOWNICY.validator({uzytkownik_uuid: uzytkownik_uuid});
    } catch (err) {
        ClientError.notAcceptable(res, err.message);
        return;
    }

    KONSTRUKTORZY_czyUzytkownikJestKonstruktoremRobota(res,robot_uuid,uzytkownik_uuid).catch(() => {
        ServerError.internalServerError(res);
    }).then((result) => {
        Success.OK(res, Object(result));
    });
});


router.post('/addRobotCategory', access.default.canModify, async (req, res, next) => {

    const body = req.body;
    const robot_uuid = body?.robot_uuid;
    const kategoria_id = Number(body?.kategoria_id);
    const uzytkownik_uuid = (req.query.JWTdecoded as any).uzytkownik_uuid;

    try {
        ROBOTY.validator({robot_uuid: robot_uuid});
        KATEGORIE.validator({kategoria_id: kategoria_id});
    } catch (err) {
        ClientError.notAcceptable(res, err.message);
        return;
    }

    if(access.default.getSmashRobotsExpirationDate() < new Date() && kategoria_id === 1) {
        ClientError.locked(res, "Time to add Smash Robots category has ended!");
        return;
    }

    if((req.query.JWTdecoded as any).uzytkownik_typ < 2) {
        const czyJest = await KONSTRUKTORZY_czyUzytkownikJestKonstruktoremRobota(res,robot_uuid,uzytkownik_uuid);
        if((czyJest as any).pCzyJest == 0) {
            ClientError.unauthorized(res, "User is not constructor of a robot");
            return;
        }
    }

    db.query("CALL `KATEGORIE_ROBOTA_dodajKategorieRobota(U)`(?, ?, @p2);;", [robot_uuid, kategoria_id], (err, results, fields) => {
        if (err?.sqlState === '45000') {
            ClientError.badRequest(res, err.sqlMessage);
            return;
        } else if (err) {
            if(err.code == "ER_DUP_ENTRY") {
                ClientError.conflict(res, "Duplicate entry");
            } else {
                ServerError.internalServerError(res, err.sqlMessage);
            }
            return;
        }
        const kategoria_robota = {
            robot_id: results[0][0].robot_id,
            robot_uuid: robot_uuid,
            kategoria_id: kategoria_id,
            isSucces: results[0][0].pIsSucces
        };

        socketIO.default.getIO().to(`users/${uzytkownik_uuid}`).to(`robots/${robot_uuid}`).emit("robots/addRobotCategory", kategoria_robota);
        Success.OK(res, kategoria_robota);
    });
});

router.delete('/deleteRobotCategory', access.default.canModify, async (req, res, next) => {

    const body = req.body;
    const robot_uuid = body?.robot_uuid;
    const kategoria_id = Number(body?.kategoria_id);
    const uzytkownik_uuid = (req.query.JWTdecoded as any).uzytkownik_uuid;

    try {
        ROBOTY.validator({robot_uuid: robot_uuid});
        KATEGORIE.validator({kategoria_id: kategoria_id});
    } catch (err) {
        ClientError.notAcceptable(res, err.message);
        return;
    }

    if((req.query.JWTdecoded as any).uzytkownik_typ < 2) {
        const czyJest = await KONSTRUKTORZY_czyUzytkownikJestKonstruktoremRobota(res,robot_uuid,uzytkownik_uuid);
        if((czyJest as any).pCzyJest == 0) {
            ClientError.unauthorized(res, "User is not constructor of a robot");
            return;
        }
    }

    db.query("CALL `KATEGORIE_ROBOTA_usunKategorieRobota(U)`(?, @p2, ?);;", [robot_uuid, kategoria_id], (err, results, fields) => {
        if (err?.sqlState === '45000') {
            ClientError.badRequest(res, err.sqlMessage);
            return;
        } else if (err) {
            ServerError.internalServerError(res, err.sqlMessage);
            return;
        }

        const kategoria_robota = {
            robot_id: results[0][0].robot_id,
            robot_uuid: robot_uuid,
            kategoria_id: kategoria_id,
            isSucces: results[0][0].pIsSucces
        };

        socketIO.default.getIO().to(`users/${uzytkownik_uuid}`).to(`robots/${robot_uuid}`).emit("robots/deleteRobotCategory", kategoria_robota);
        Success.OK(res, kategoria_robota);
    });
});

router.post('/addConstructor', access.default.canModify, async (req, res, next) => {

    const body = req.body;
    const robot_uuid = body?.robot_uuid;
    const nowy_uzytkownik_uuid = body?.uzytkownik_uuid;
    const uzytkownik_uuid = (req.query.JWTdecoded as any).uzytkownik_uuid;

    try {
        ROBOTY.validator({robot_uuid: robot_uuid});
        UZYTKOWNICY.validator({uzytkownik_uuid: nowy_uzytkownik_uuid});
    } catch (err) {
        ClientError.notAcceptable(res, err.message);
        return;
    }

    if((req.query.JWTdecoded as any).uzytkownik_typ < 2) {
        const czyJest = await KONSTRUKTORZY_czyUzytkownikJestKonstruktoremRobota(res,robot_uuid,uzytkownik_uuid);
        if((czyJest as any).pCzyJest == 0) {
            ClientError.unauthorized(res, "User is not constructor of a robot");
            return;
        }
    }

    db.query("CALL `KONSTRUKTORZY_dodajKonstruktora(U)`(?, ?);", [robot_uuid, nowy_uzytkownik_uuid], (err, results, fields) => {
        if (err?.sqlState === '45000') {
            ClientError.badRequest(res, err.sqlMessage);
            return;
        } else if (err) {
            ServerError.internalServerError(res, err.sqlMessage);
            return;
        }

        const utworzony_konstruktor = {
            uzytkownik_uuid: nowy_uzytkownik_uuid,
            konstruktor_id: results[0][0].konstruktor_id,
            robot_uuid: robot_uuid
        };

        socketIO.default.getIO().to(`users/${uzytkownik_uuid}`).to(`users/${nowy_uzytkownik_uuid}`).to(`robots/${robot_uuid}`).emit("robots/addConstructor", utworzony_konstruktor);
        Success.OK(res, utworzony_konstruktor);
    });
});

router.get('/getConstructors/:robot_uuid', async (req, res, next) => {

    const body = req.body;
    const robot_uuid = req.params?.robot_uuid;
    const uzytkownik_uuid = (req.query.JWTdecoded as any).uzytkownik_uuid;

    try {
        ROBOTY.validator({robot_uuid: robot_uuid});
    } catch (err) {
        ClientError.notAcceptable(res, err.message);
        return;
    }

    if((req.query.JWTdecoded as any).uzytkownik_typ < 1) {
        const czyJest = await KONSTRUKTORZY_czyUzytkownikJestKonstruktoremRobota(res,robot_uuid,uzytkownik_uuid);
        if((czyJest as any).pCzyJest == 0) {
            ClientError.unauthorized(res, "User is not constructor of a robot");
            return;
        }
    }

    db.query("CALL `ROBOTY_pobierzKonstruktorowRobota(U)`(?);", [robot_uuid], (err, results, fields) => {
        if (err?.sqlState === '45000') {
            ClientError.badRequest(res, err.sqlMessage);
            return;
        } else if (err) {
            ServerError.internalServerError(res, err.sqlMessage);
            return;
        }

        const konstruktorzy = results[0];

        Success.OK(res, konstruktorzy);
    });
});

router.delete('/deleteConstructor', access.default.canModify, async (req, res, next) => {

    const body = req.body;
    const konstruktor_id = body?.konstruktor_id;
    const robot_uuid = body?.robot_uuid;
    const uzytkownik_uuid = (req.query.JWTdecoded as any).uzytkownik_uuid;

    try {
        KONSTRUKTORZY.validator({konstruktor_id: konstruktor_id});
    } catch (err) {
        ClientError.notAcceptable(res, err.message);
        return;
    }

    if((req.query.JWTdecoded as any).uzytkownik_typ < 2) {
        const czyJest = await KONSTRUKTORZY_czyUzytkownikJestKonstruktoremRobota(res,robot_uuid,uzytkownik_uuid);
        if((czyJest as any).pCzyJest == 0) {
            ClientError.unauthorized(res, "User is not constructor of a robot");
            return;
        }
    }

    db.query("CALL `KONSTRUKTORZY_usunKonstruktora(U)`(?, @p1);", [konstruktor_id], (err, results, fields) => {
        if (err?.sqlState === '45000') {
            ClientError.badRequest(res, err.sqlMessage);
            return;
        } else if (err) {
            ServerError.internalServerError(res, err.sqlMessage);
            return;
        }

        const konstruktor = {
            uzytkownik_uuid: results[0][0].uzytkownik_uuid,
            konstruktor_id: konstruktor_id,
            robot_uuid: robot_uuid,
            isSucces: results[0][0].pIsSucces
        };

        socketIO.default.getIO().to(`users/${uzytkownik_uuid}`).to(`users/${konstruktor.uzytkownik_uuid}`).to(`robots/${robot_uuid}`).emit("robots/deleteConstructor", konstruktor);
        Success.OK(res, konstruktor);
    });
});

router.post('/addConfirmationCodeToPhone', async (req, res, next) => {

    const uzytkownik_uuid = (req.query.JWTdecoded as any).uzytkownik_uuid;

    db.query("CALL `POTWIERDZENIA_dodajPotwierdzenie(U)`(?, 0, 1);", [uzytkownik_uuid], (err, results, fields) => {
        if (err?.sqlState === '45000') {
            ClientError.badRequest(res, err.sqlMessage);
            return;
        } else if (err) {
            ServerError.internalServerError(res, err.sqlMessage);
            return;
        }
        const wiadomosc = {
            wiadomosc_id: results[0][0].wiadomosc_id
        };

        Success.OK(res, wiadomosc);
    });
});

router.post('/addRobot', access.default.canModify, async (req, res, next) => {

    const body = req.body;
    const nazwa = body?.nazwa;
    const kategoria_id = Number(body?.kategoria_id);
    const uzytkownik_uuid = (req.query.JWTdecoded as any).uzytkownik_uuid;

    try {
        ROBOTY.validator({nazwa: nazwa});
        KATEGORIE.validator({kategoria_id: kategoria_id});
    } catch (err) {
        ClientError.notAcceptable(res, err.message);
        return;
    }

    db.query("CALL `ROBOTY_dodajRobota(U)`(?, ?, ?);", [nazwa, uzytkownik_uuid, kategoria_id], (err, results, fields) => {
        if (err?.sqlState === '45000') {
            ClientError.badRequest(res, err.sqlMessage);
            return;
        } else if (err) {
            ServerError.internalServerError(res, err.sqlMessage);
            return;
        }

        const robot = {
            robot_id: results[2][0].robot_id,
            robot_uuid: results[2][0].robot_uuid,
            nazwa: nazwa,
            kategoria_id: kategoria_id,
        };
        const konstruktor = {
            konstruktor_id: results[1][0].konstruktor_id
        };
        socketIO.default.getIO().to(`users/${uzytkownik_uuid}`).emit("robots/addRobot", {robot, konstruktor});
        Success.OK(res, {robot, konstruktor});
    });
});

router.put('/updateRobot', access.default.canModify, async (req, res, next) => {

    const body = req.body;
    const nazwa = body?.nazwa;
    const robot_uuid = body?.robot_uuid;
    const uzytkownik_uuid = (req.query.JWTdecoded as any).uzytkownik_uuid;

    try {
        ROBOTY.validator({nazwa: nazwa, robot_uuid: robot_uuid});
    } catch (err) {
        ClientError.notAcceptable(res, err.message);
        return;
    }

    if((req.query.JWTdecoded as any).uzytkownik_typ < 2) {
        const czyJest = await KONSTRUKTORZY_czyUzytkownikJestKonstruktoremRobota(res,robot_uuid,uzytkownik_uuid);
        if((czyJest as any).pCzyJest == 0) {
            ClientError.unauthorized(res, "User is not constructor of a robot");
            return;
        }
    }

    db.query("CALL `ROBOTY_edytujRobota(U)`(?, ?, @p1);", [robot_uuid, nazwa], (err, results, fields) => {
        if (err?.sqlState === '45000') {
            ClientError.badRequest(res, err.sqlMessage);
            return;
        } else if (err) {
            ServerError.internalServerError(res, err.sqlMessage);
            return;
        }

        const robot = {
            robot_id: results[0][0].robot_id,
            robot_uuid: robot_uuid,
            nazwa: nazwa,
            isSucces: results[0][0].pIsSucces
        };
        socketIO.default.getIO().to(`users/${uzytkownik_uuid}`).to(`robots/${robot_uuid}`).emit("robots/updateRobot", robot);
        Success.OK(res, robot);
    });
});

router.get('/getAllRobotsOfUser', (req, res, next) => {

    const uzytkownik_uuid = (req.query.JWTdecoded as any).uzytkownik_uuid;
    try {
        UZYTKOWNICY.validator({uzytkownik_uuid: uzytkownik_uuid});
    } catch (err) {
        ClientError.notAcceptable(res, err.message);
        return;
    }

    KONSTRUKTORZY_pobierzWszystkieRobotyKonstruktora(uzytkownik_uuid, res).catch(() => {
        ServerError.internalServerError(res);
    }).then((result) => {
        Success.OK(res, Object(result));
    });
});

router.delete('/deleteRobot', access.default.canModify, async (req, res, next) => {

    const body = req.body;
    const robot_uuid = body?.robot_uuid;
    const uzytkownik_uuid = (req.query.JWTdecoded as any).uzytkownik_uuid;

    try {
        ROBOTY.validator({robot_uuid: robot_uuid});
    } catch (err) {
        ClientError.notAcceptable(res, err.message);
        return;
    }

    if((req.query.JWTdecoded as any).uzytkownik_typ < 2) {
        const czyJest = await KONSTRUKTORZY_czyUzytkownikJestKonstruktoremRobota(res,robot_uuid,uzytkownik_uuid);
        if((czyJest as any).pCzyJest == 0) {
            ClientError.unauthorized(res, "User is not constructor of a robot");
            return;
        }
    }

    db.query("CALL `ROBOTY_usunRobota(U)`(?, @p1);", [robot_uuid], (err, results, fields) => {
        if (err?.sqlState === '45000') {
            ClientError.badRequest(res, err.sqlMessage);
            return;
        } else if (err) {
            ServerError.internalServerError(res, err.sqlMessage);
            return;
        }
        const robot = {
            robot_id: results[0][0].robot_id,
            robot_uuid: robot_uuid,
            isSucces: results[0][0].pIsSucces
        };
        socketIO.default.getIO().to(`users/${uzytkownik_uuid}`).to(`robots/${robot_uuid}`).emit("robots/deleteRobot", robot);
        // socketIO.default.getIO().in(`robots/${robot_uuid}`).c
        Success.OK(res, robot);
    });
});

router.post('/addUserPhoneNumber', async (req, res, next) => {

    const body = req.body;
    const numer_telefonu = body?.numer_telefonu;
    const uzytkownik_uuid = (req.query.JWTdecoded as any).uzytkownik_uuid;

    try {
        UZYTKOWNICY.validator({numer_telefonu: numer_telefonu});
    } catch (err) {
        ClientError.notAcceptable(res, err.message);
        return;
    }

    db.query("CALL `UZYTKOWNICY_dodajNumerTelefonuUzytkownika(U)`(?, ?);", [uzytkownik_uuid, numer_telefonu], (err, results, fields) => {
        if (err?.sqlState === '45000') {
            ClientError.badRequest(res, err.sqlMessage);
            return;
        } else if (err) {
            ServerError.internalServerError(res, err.sqlMessage);
            return;
        }

        const uzytkownik = {
            uzytkownik_id: results[2][0].uzytkownik_id,
            uzytkownik_uuid: uzytkownik_uuid,
            numer_telefonu: numer_telefonu,
            isSucces: results[2][0].pIsSucces
        };
        socketIO.default.getIO().to(`users/${uzytkownik_uuid}`).emit("users/addUserPhoneNumber", uzytkownik);
        Success.OK(res, uzytkownik);
    });
});

router.put('/editUser', access.default.canModify, async (req, res, next) => {

    const body = req.body;
    const imie = body?.imie;
    const nazwisko = body?.nazwisko;
    const uzytkownik_uuid = (req.query.JWTdecoded as any).uzytkownik_uuid;

    try {
        UZYTKOWNICY.validator({nazwisko: nazwisko, imie: imie});
    } catch (err) {
        ClientError.notAcceptable(res, err.message);
        return;
    }

    db.query("CALL `UZYTKOWNICY_edytujDaneUzytkownika(U)`(?, ?, ?, @p);", [uzytkownik_uuid, imie, nazwisko], (err, results, fields) => {
        if (err?.sqlState === '45000') {
            ClientError.badRequest(res, err.sqlMessage);
            return;
        } else if (err) {
            ServerError.internalServerError(res, err.sqlMessage);
            return;
        }
        
        const uzytkownik = {
            uzytkownik_id: results[0][0].uzytkownik_id,
            uzytkownik_uuid: uzytkownik_uuid,
            imie: imie,
            nazwisko: nazwisko,
            isSucces: results[0][0].pIsSucces
        };
        socketIO.default.getIO().to(`users/${uzytkownik_uuid}`).emit("users/editUser", uzytkownik);
        Success.OK(res, uzytkownik);
    });
});

router.get('/getUser', async (req, res, next) => {

    const uzytkownik_uuid = (req.query.JWTdecoded as any).uzytkownik_uuid;

    db.query("CALL `UZYTKOWNICY_pobierzUzytkownika(U)`(?);", [uzytkownik_uuid], (err, results, fields) => {
        if (err?.sqlState === '45000') {
            ClientError.badRequest(res, err.sqlMessage);
            return;
        } else if (err) {
            ServerError.internalServerError(res, err.sqlMessage);
            return;
        }
        let result = results[0][0]
        Success.OK(res, {...result, token: req.query.JWT});
    });
});

router.delete('/deleteUser', access.default.canModify,  async (req, res, next) => {

    const uzytkownik_uuid = (req.query.JWTdecoded as any).uzytkownik_uuid;

    db.query("CALL `UZYTKOWNICY_usunUzytkownika(U)`(?,@p1);", [uzytkownik_uuid], (err, results, fields) => {
        if (err?.sqlState === '45000') {
            ClientError.badRequest(res, err.sqlMessage);
            return;
        } else if (err) {
            ServerError.internalServerError(res, err.sqlMessage);
            return;
        }
        
        const uzytkownik = {
            uzytkownik_id: results[0][0].uzytkownik_id,
            uzytkownik_uuid: uzytkownik_uuid,
            isSucces: results[0][0].pIsSucces
        };
        
        socketIO.default.getIO().to(`users/${uzytkownik_uuid}`).emit("users/deleteUser", uzytkownik);
        Success.OK(res, uzytkownik);
    });
});

router.put('/changeUserPassword', async (req, res, next) => {

    const body = req.body;
    const stareHaslo = body?.stareHaslo;
    const noweHaslo = body?.noweHaslo;
    const uzytkownik_uuid = (req.query.JWTdecoded as any).uzytkownik_uuid;

    try {
        UZYTKOWNICY.validator({haslo: noweHaslo});
    } catch (err) {
        ClientError.notAcceptable(res, err.message);
        return;
    }

    db.query("CALL `UZYTKOWNICY_zmienHaslo(U)`(?,?,?,@p1);", [uzytkownik_uuid, auth.hashPassword(stareHaslo).toString(), auth.hashPassword(noweHaslo).toString()], (err, results, fields) => {
        if (err?.sqlState === '45000') {
            ClientError.badRequest(res, err.sqlMessage);
            return;
        } else if (err) {
            ServerError.internalServerError(res, err.sqlMessage);
            return;
        }

        const uzytkownik = {
            uzytkownik_id: results[0][0].uzytkownik_id,
            uzytkownik_uuid: uzytkownik_uuid,
            isSucces: results[0][0].pIsSucces
        };
        Success.OK(res, uzytkownik);
    });
});

export default router;