import { WALKI } from './../models/database/WALKI';
import { GRUPY_WALK } from './../models/database/GRUPY_WALK';
import { POTWIERDZENIA } from './../models/database/POTWIERDZENIA';
import { UZYTKOWNICY } from './../models/database/UZYTKOWNICY';
import { STANOWISKA } from './../models/database/STANOWISKA';
import { ROBOTY } from './../models/database/ROBOTY';
import { KATEGORIE } from './../models/database/KATEGORIE';
import { ServerError } from './../responses/server_errors';
import express from 'express';
import db from '../utils/database';
import { ClientError } from '../responses/client_errors';
import { Success } from '../responses/success';
import * as JWT from '../utils/jwt';
import auth from '../utils/auth';
import Handlebars from 'handlebars';
import * as Nodemailer from "../utils/nodemailer";
import fs from 'fs';
import path from 'path';
import time_constraints from '../utils/time_constraints';
import visitor_counter from '../utils/visitor_counter';


const router = express.Router();

function WALKI_pobierzWalke(res: express.Response, walka_id: number): Promise<object> {
    return new Promise<object>((resolve, reject) => {
        try {
            WALKI.validator({ walka_id: walka_id });
        } catch (err: any) {
            ClientError.notAcceptable(res, err.message);
            reject();
            return;
        }

        db.query("CALL `WALKI_pobierzWalke(*)`(?);", [walka_id], (err, results, fields) => {
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

export function KATEGORIE_czyToKategoriaWalki(res: express.Response, kategoria_id: number): Promise<object> {
    return new Promise<object>((resolve, reject) => {
        try {
            KATEGORIE.validator({ kategoria_id: kategoria_id })
        } catch (err: any) {
            ClientError.notAcceptable(res, err.message);
            reject();
            return;
        }

        db.query("CALL `KATEGORIE_czyToKategoriaWalki(*)`(?,@p1);", [kategoria_id], (err, results, fields) => {
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

router.get('/userInTH/:email', (req, res, next) => {
    const email = req.params.email;
    try {
        UZYTKOWNICY.validator({ email: email })
    } catch (err: any) {
        ClientError.notAcceptable(res, err.message);
        return;
    }

    db.query("CALL `UZYTKOWNICY_czyUzytkownikMaTH(*)`(?);", [email], (err, results, fields) => {

        if (err?.sqlState === '45000') {
            ClientError.badRequest(res, err.sqlMessage);
            return;
        } else if (err) {
            ServerError.internalServerError(res, err.sqlMessage);
            return;
        }

        Success.OK(res, results[0][0].exist);
    });
});

router.get('/isItFightingCategory/:kategoria_id', (req, res, next) => {
    const kategoria_id = Number(req.params.kategoria_id);
    try {
        KATEGORIE.validator({ kategoria_id: kategoria_id });
    } catch (err: any) {
        ClientError.notAcceptable(res, err.message);
        return;
    }

    KATEGORIE_czyToKategoriaWalki(res, kategoria_id).catch(() => {
        return;
    }).then((result) => {
        Success.OK(res, result as object);
    });
});

router.get('/getAllCategories', (req, res, next) => {

    db.query("CALL `KATEGORIE_pobierzWszystkieKategorie(*)`();", (err, results, fields) => {

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

router.get('/getRobot/:robot_uuid', (req, res, next) => {
    const robot_uuid = req.params.robot_uuid;
    try {
        ROBOTY.validator({ robot_uuid: robot_uuid });
    } catch (err: any) {
        ClientError.notAcceptable(res, err.message);
        return;
    }

    db.query("CALL `ROBOTY_pobierzRobota(*)`(?);", [robot_uuid], (err, results, fields) => {

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

router.get('/getAllRobots', (req, res, next) => {

    db.query("CALL `ROBOTY_pobierzWszystkieRoboty(*)`();", (err, results, fields) => {

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

router.get('/getAllGroups', (req, res, next) => {

    db.query("CALL `GRUPY_WALK_pobierzGrupy(*)`();", (err, results, fields) => {

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

router.get('/getRefereesForThePosition/:stanowisko_id', (req, res, next) => {
    const stanowisko_id = Number(req.params.stanowisko_id);
    try {
        STANOWISKA.validator({ stanowisko_id: stanowisko_id });
    } catch (err: any) {
        ClientError.notAcceptable(res, err.message);
        return;
    }

    db.query("CALL `STANOWISKA_pobierzSedziowDlaStanowiska(*)`(?);", [stanowisko_id], (err, results, fields) => {

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

router.get('/getPosition/:stanowisko_id', (req, res, next) => {
    const stanowisko_id = Number(req.params.stanowisko_id);
    try {
        STANOWISKA.validator({ stanowisko_id: stanowisko_id });
    } catch (err: any) {
        ClientError.notAcceptable(res, err.message);
        return;
    }

    db.query("CALL `STANOWISKA_pobierzStanowisko(*)`(?);", [stanowisko_id], (err, results, fields) => {

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

router.get('/getPositions', (req, res, next) => {

    db.query("CALL `STANOWISKA_pobierzWszystkieStanowiska(*)`();", (err, results, fields) => {

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

router.get('/checkIfRobotCanInThisPosition/:robot_uuid/:kategoria_id/:stanowisko_id', (req, res, next) => {
    const robot_uuid = req.params.robot_uuid;
    const kategoria_id = Number(req.params.kategoria_id);
    const stanowisko_id = Number(req.params.stanowisko_id);
    try {
        STANOWISKA.validator({ stanowisko_id: stanowisko_id });
        ROBOTY.validator({ robot_uuid: robot_uuid });
        KATEGORIE.validator({ kategoria_id: kategoria_id });
    } catch (err: any) {
        ClientError.notAcceptable(res, err.message);
        return;
    }

    db.query(" CALL `STANOWISKA_sprawdzCzyRobotMozeNaTymStanowisku(*)`(?, ?, @p2, ?);", [robot_uuid, kategoria_id, stanowisko_id], (err, results, fields) => {

        if (err?.sqlState === '45000') {
            ClientError.badRequest(res, err.sqlMessage);
            return;
        } else if (err) {
            ServerError.internalServerError(res, err.sqlMessage);
            return;
        }

        Success.OK(res, results[2][0]);
    });
});

const registerEmailTemplatePath = process.env.EMAIL_VIEWS_PATH + 'register.hbs';
const registerEmailTemplatePathEng = process.env.EMAIL_VIEWS_PATH + 'registereng.hbs';
var registerEmailTemplate = Handlebars.compile(fs.readFileSync(path.resolve(registerEmailTemplatePath), 'utf8'));
var registerEmailTemplateEng = Handlebars.compile(fs.readFileSync(path.resolve(registerEmailTemplatePathEng), 'utf8'));

router.post('/registerUser', (req, res, next) => {
    const body = req.body;
    const imie = body?.imie;
    const nazwisko = body?.nazwisko;
    const email = body?.email;
    const haslo = body?.haslo;
    const numer_telefonu = body?.numer_telefonu;
    const kod_pocztowy = body?.kod_pocztowy;
    const jedzenie = Number(body?.preferowane_jedzenie);
    const rozmiar_koszulki = Number(body?.rozmiar_koszulki);
    const czy_opiekun = body?.czy_opiekun;
    const czy_bedzie_osobiscie = body?.czy_bedzie_osobiscie;
    const referencerToken = body?.referencerToken;
    const lang = body?.lang ? body?.lang : 'en';

    try {
        UZYTKOWNICY.validator({ imie: imie, nazwisko: nazwisko, email: email, haslo: haslo, numer_telefonu: numer_telefonu, kod_pocztowy: kod_pocztowy, preferowane_jedzenie: jedzenie, rozmiar_koszulki: rozmiar_koszulki, czy_opiekun: czy_opiekun });
    } catch (err: any) {
        ClientError.notAcceptable(res, err.message);
        return;
    }
    const now = new Date();
    const uzytkownik_typ = referencerToken ? JWT.default.getUserType(referencerToken) : 0;
    const isForced = uzytkownik_typ >= 3 ? 1 : 0;
    const rejestracja = time_constraints.getTimeConstraint("Rejestracja");
    if ((uzytkownik_typ === 0 && (now > rejestracja?.data_zakonczenia! || now < rejestracja?.data_rozpoczecia!))) {
        ClientError.badRequest(res, "errors.details.register-ends");
        return;
    }

    db.query("CALL `UZYTKOWNICY_dodajUzytkownika(*)`(?,?,?,?,?,?,?,?,?,?,?);", [imie, nazwisko, email, auth.hashPassword(haslo).toString(), numer_telefonu, kod_pocztowy, jedzenie, rozmiar_koszulki, czy_opiekun, isForced, czy_bedzie_osobiscie], async (err, results, fields) => {

        if (err?.sqlState === '45000') {
            ClientError.badRequest(res, err.sqlMessage);
            return;
        } else if (err) {
            ServerError.internalServerError(res, err.sqlMessage);
            return;
        }


        var options = (email: string, locals?: object) => {
            return {
                from: `XChallenge <${process.env.EMAIL_FROM_ADDR}>`,
                to: email,
                subject: lang === 'en' ? 'Account activation' : 'Aktywacja konta',
                html: lang === 'en' ? registerEmailTemplateEng(locals) : registerEmailTemplate(locals)
            };
        };

        const kod = results[0][0].kod;

        const nowyUzytkownik = {
            uzytkownik_id: results[1][0].uzytkownik_id,
            uzytkownik_uuid: results[1][0].uzytkownik_uuid,
            imie: imie,
            nazwisko: nazwisko,
            email: email
        };

        let blad = false;
        const result = await Nodemailer.default.getTransporter().sendMail(
            options(email, {
                LINK: `${process.env.CONFIRM_EMAIL_LINK}/${nowyUzytkownik.uzytkownik_uuid}/${kod}/0`
            })
        ).catch((err) => {
            blad = true;
            ClientError.expectationFailed(res, "Nie można wysłać maila na ten adres!")
            return;
        });

        if (blad) return;

        Success.OK(res, nowyUzytkownik);
    });
});

const resetPasswordEmailTemplatePath = process.env.EMAIL_VIEWS_PATH + 'resetpassword.hbs';
const resetPasswordEmailTemplatePathEng = process.env.EMAIL_VIEWS_PATH + 'resetpasswordeng.hbs';
var resetPasswordEmailTemplate = Handlebars.compile(fs.readFileSync(path.resolve(resetPasswordEmailTemplatePath), 'utf8'));
var resetPasswordEmailTemplateEng = Handlebars.compile(fs.readFileSync(path.resolve(resetPasswordEmailTemplatePathEng), 'utf8'));

router.post('/remind', (req, res, next) => {
    const body = req.body;
    const email = body?.email;
    const lang = body?.lang ? body?.lang : 'en';
    try {
        UZYTKOWNICY.validator({ email: email });
    } catch (err: any) {
        ClientError.notAcceptable(res, err.message);
        return;
    }


    db.query("CALL `UZYTKOWNICY_zapomnialemHaslo(*)`(?);", [email], async (err, results, fields) => {

        if (err?.sqlState === '45000') {
            ClientError.badRequest(res, err.sqlMessage);
            return;
        } else if (err) {
            ServerError.internalServerError(res, err.sqlMessage);
            return;
        }


        var options = (email: string, locals?: object) => {
            return {
                from: `XChallenge <${process.env.EMAIL_FROM_ADDR}>`,
                to: email,
                subject: lang === 'en' ? 'Have you forgotten your password?' : 'Zapomniałeś hasła?',
                html: lang === 'en' ? resetPasswordEmailTemplateEng(locals) : resetPasswordEmailTemplate(locals)
            };
        };

        const kod = results[0][0].kod;
        const uzytkownik_uuid = results[1][0].uzytkownik_uuid;

        let blad = false;
        const result = await Nodemailer.default.getTransporter().sendMail(
            options(email, {
                LINK: `${process.env.RESET_PASSWORD_LINK}/${uzytkownik_uuid}/${kod}`
            })
        ).catch((err) => {
            blad = true;
            ClientError.expectationFailed(res, "Nie można wysłać maila na ten adres!")
            return;
        });

        if (blad) return;

        Success.OK(res, { pIsSucces: 1 });
    });
});

router.post('/reset-password', (req, res, next) => {
    const body = req.body;
    const uzytkownik_uuid = body?.uzytkownik_uuid;
    const kod = Number(body?.kod);
    const haslo = body?.haslo;
    try {
        POTWIERDZENIA.validator({ kod: kod })
        UZYTKOWNICY.validator({ uzytkownik_uuid: uzytkownik_uuid, haslo: haslo });
    } catch (err: any) {
        ClientError.notAcceptable(res, err.message);
        return;
    }

    db.query("CALL `UZYTKOWNICY_nadajNoweHaslo(*)`(?,?,?);", [uzytkownik_uuid, kod, auth.hashPassword(haslo).toString()], async (err, results, fields) => {

        if (err?.sqlState === '45000') {
            ClientError.badRequest(res, err.sqlMessage);
            return;
        } else if (err) {
            ServerError.internalServerError(res, err.sqlMessage);
            return;
        }

        Success.OK(res, { pIsSucces: 1 });
    });
});

router.get('/confirmCode/:uzytkownik_uuid/:kod/:czy_na_telefon', (req, res, next) => {
    const uzytkownik_uuid = req.params?.uzytkownik_uuid;
    const kod = Number(req.params?.kod);
    const czy_na_telefon = Number(req.params?.czy_na_telefon);
    try {
        UZYTKOWNICY.validator({ uzytkownik_uuid: uzytkownik_uuid });
        POTWIERDZENIA.validator({ kod: kod, czy_na_telefon: czy_na_telefon });
    } catch (err: any) {
        ClientError.notAcceptable(res, err.message);
        return;
    }
    db.query("CALL `POTWIERDZENIA_potwierdzKod(*)`(?, ?, @p2, ?);", [uzytkownik_uuid, kod, czy_na_telefon], (err, results, fields) => {

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

router.post('/loginUser', (req, res, next) => {
    const body = req.body;
    const email = body?.email;
    const haslo = body?.haslo;

    try {
        UZYTKOWNICY.validator({ email: email, haslo: haslo });
    } catch (err: any) {
        ClientError.notAcceptable(res, err.message);
        return;
    }

    db.query("CALL `UZYTKOWNICY_zalogujUzytkownika(*)`(?, ?, @p2)", [email, auth.hashPassword(haslo).toString()], (err, results, fields) => {

        if (err?.sqlState === '45000') {
            ClientError.badRequest(res, err.sqlMessage);
            return;
        } else if (err) {
            ServerError.internalServerError(res, err.sqlMessage);
            return;
        }

        if (results.length === 2 && results[0][0].pIsSucces == "0") {
            ClientError.unauthorized(res, "The given data is incorrect");
            return;
        }

        const user = results[0][0];


        Success.OK(res, { ...user, token: JWT.default.createToken(user.uzytkownik_id, user.uzytkownik_uuid, user.uzytkownik_typ) });
    });
});

router.get('/getFight/:walka_id', (req, res, next) => {

    const walka_id = Number(req.params?.walka_id);
    try {
        WALKI.validator({ walka_id: walka_id });
    } catch (err: any) {
        ClientError.notAcceptable(res, err.message);
        return;
    }

    WALKI_pobierzWalke(res, walka_id).catch(() => {
        return;
    }).then((result) => {
        Success.OK(res, result as object);
    });
});

router.get('/getAllFights', (req, res, next) => {

    db.query("CALL `WALKI_pobierzWalki(*)`();", (err, results, fields) => {

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

router.get('/getAllFightsForGroup/:grupa_id', (req, res, next) => {

    const grupa_id = Number(req.params?.grupa_id);
    try {
        GRUPY_WALK.validator({ grupa_id: grupa_id });
    } catch (err: any) {
        ClientError.notAcceptable(res, err.message);
        return;
    }

    db.query("CALL `WALKI_pobierzWalkiDlaGrupy(*)`(?);", [grupa_id], (err, results, fields) => {

        if (err?.sqlState === '45000') {
            ClientError.badRequest(res, err.sqlMessage);
            return;
        } else if (err) {
            ServerError.internalServerError(res, err.sqlMessage);
            return;
        }

        Success.OK(res, results[1]);
    });
});

router.get('/getAllFightsForCategory/:kategoria_id', (req, res, next) => {

    const kategoria_id = Number(req.params?.kategoria_id);
    try {
        KATEGORIE.validator({ kategoria_id: kategoria_id });
    } catch (err: any) {
        ClientError.notAcceptable(res, err.message);
        return;
    }

    db.query("CALL `WALKI_pobierzWalkiDlaKategorii(*)`(?);", [kategoria_id], (err, results, fields) => {

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

router.get('/getAllFightsForRobot/:robot_uuid', (req, res, next) => {

    const robot_uuid = req.params?.robot_uuid;
    try {
        ROBOTY.validator({ robot_uuid: robot_uuid });
    } catch (err: any) {
        ClientError.notAcceptable(res, err.message);
        return;
    }

    db.query("CALL `WALKI_pobierzWalkiDlaRobota(*)`(?);", [robot_uuid], (err, results, fields) => {

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

router.get('/getAllFightsForPosiotion/:stanowisko_id', (req, res, next) => {

    const stanowisko_id = Number(req.params?.stanowisko_id);
    try {
        STANOWISKA.validator({ stanowisko_id: stanowisko_id });
    } catch (err: any) {
        ClientError.notAcceptable(res, err.message);
        return;
    }

    db.query("CALL `WALKI_pobierzWalkiDlaStanowiska(*)`(?);", [stanowisko_id], (err, results, fields) => {

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

router.get('/getWinnersForGroup/:grupa_id', (req, res, next) => {

    const grupa_id = Number(req.params?.grupa_id);
    try {
        GRUPY_WALK.validator({ grupa_id: grupa_id });
    } catch (err: any) {
        ClientError.notAcceptable(res, err.message);
        return;
    }

    db.query("CALL `WALKI_pobierzWygranychDlaGrupy(*)`(?);", [grupa_id], (err, results, fields) => {

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

router.get('/getWinnersForCategory/:kategoria_id', (req, res, next) => {

    const kategoria_id = Number(req.params?.kategoria_id);
    try {
        KATEGORIE.validator({ kategoria_id: kategoria_id });
    } catch (err: any) {
        ClientError.notAcceptable(res, err.message);
        return;
    }

    db.query("CALL `WALKI_pobierzWygranychDlaKategorii(*)`(?);", [kategoria_id], (err, results, fields) => {

        if (err?.sqlState === '45000') {
            ClientError.badRequest(res, err.sqlMessage);
            return;
        } else if (err) {
            ServerError.internalServerError(res, err.sqlMessage);
            return;
        }

        Success.OK(res, results[1]);
    });
});

router.get('/getBestTimes', (req, res, next) => {

    db.query("CALL `WYNIKI_CZASOWE_pobierzNajlepszeWyniki(*)`();", (err, results, fields) => {

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

router.get('/getAllTimes', (req, res, next) => {

    db.query("CALL `WYNIKI_CZASOWE_pobierzWszystkieWyniki(*)`();", (err, results, fields) => {

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

router.get('/getAllTimesForCategory/:kategoria_id', (req, res, next) => {

    const kategoria_id = Number(req.params?.kategoria_id);
    try {
        KATEGORIE.validator({ kategoria_id: kategoria_id });
    } catch (err: any) {
        ClientError.notAcceptable(res, err.message);
        return;
    }

    db.query("CALL `WYNIKI_CZASOWE_pobierzWynikiDlaKategorii(*)`(?);", [kategoria_id], (err, results, fields) => {

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

router.get('/getAllTimesForRobot/:robot_uuid', (req, res, next) => {

    const robot_uuid = req.params?.robot_uuid;
    try {
        ROBOTY.validator({ robot_uuid: robot_uuid });
    } catch (err: any) {
        ClientError.notAcceptable(res, err.message);
        return;
    }

    db.query("CALL `WYNIKI_CZASOWE_pobierzWynikiRobota(*)`(?);", [robot_uuid], (err, results, fields) => {

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

router.get('/getAllTimesForPosiotion/:stanowisko_id', (req, res, next) => {

    const stanowisko_id = Number(req.params?.stanowisko_id);
    try {
        STANOWISKA.validator({ stanowisko_id: stanowisko_id });
    } catch (err: any) {
        ClientError.notAcceptable(res, err.message);
        return;
    }

    db.query("CALL `WYNIKI_CZASOWE_pobierzWynikiDlaStanowiska(*)`(?);", [stanowisko_id], (err, results, fields) => {

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

router.get('/currentVisitors', (req, res, next) => {

    let current = visitor_counter.getIleOsobNaWydarzeniu();
    Success.OK(res, { currentVisitors: current })

});

router.get('/getAnnouncements', (req, res, next) => {

    db.query("CALL `WIADOMOSCI_pobierzOgloszenia(*)`();", (err, results, fields) => {

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

router.get('/getTimetables', (req, res, next) => {

    db.query("CALL `HARMONOGRAM_pobierzHarmonogramy(*)`();", (err, results, fields) => {

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

export function AKTYWNE_WALKI_I_PRZEJAZDY_pobierz(res: express.Response): Promise<object> {
    return new Promise<object>((resolve, reject) => {
        db.query("CALL `AKTYWNE_WALKI_I_PRZEJAZDY_pobierz(*)`();", (err, results, fields) => {
            if (err?.sqlState === '45000') {
                ClientError.badRequest(res, err.sqlMessage);
                reject();
                return;
            } else if (err) {
                ServerError.internalServerError(res, err.sqlMessage);
                reject();
                return;
            }
            resolve(results[0])
        });
    });
}

router.get('/getCurrentFightsOrTimes', async (req, res, next) => {
    Success.OK(res, await AKTYWNE_WALKI_I_PRZEJAZDY_pobierz(res));
});



export default router;