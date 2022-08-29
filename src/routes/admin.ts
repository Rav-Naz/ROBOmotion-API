import { STANOWISKA } from './../models/database/STANOWISKA';
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
import * as referee from '../routes/referee';
import * as publicRoutes from '../routes/public';



const router = express.Router();

function GRUPY_WALK_dodajGrupe(res: express.Response, nazwa: string, kategoria_id: number): Promise<object> {
    return new Promise<object>((resolve, reject) => {
        try {
            GRUPY_WALK.validator({ nazwa: nazwa, kategoria_id: kategoria_id });
        } catch (err: any) {
            ClientError.notAcceptable(res, err.message);
            reject();
            return;
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
                nazwa: nazwa,
                kategoria_id: kategoria_id
            };
            socketIO.default.getIO().emit("addGroup", grupa);
            resolve(grupa);
        });
    });
}

function WALKI_dodajWalke(res: express.Response, stanowisko_id: number, nastepna_walka_id: number, grupa_id: number): Promise<object> {
    return new Promise<object>((resolve, reject) => {
        try {
            WALKI.validator({ stanowisko_id: stanowisko_id, nastepna_walka_id: nastepna_walka_id, grupa_id: grupa_id });
        } catch (err: any) {
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
                czas_zakonczenia: null,
                grupa_id: grupa_id,
                kategoria_id: (results as any)[2][0].kategoria_id,
                nastepna_walka_id: nastepna_walka_id === 0 ? null : nastepna_walka_id,
                nazwa_grupy: (results as any)[2][0].nazwa_grupy,
                nazwa_kategorii: (results as any)[2][0].nazwa_kategorii,
                nazwa_stanowiska: (results as any)[2][0].nazwa_stanowiska,
                robot1_id: null,
                robot1_nazwa: null,
                robot1_uuid: null,
                robot2_id: null,
                robot2_nazwa: null,
                robot2_uuid: null,
                stanowisko_id: stanowisko_id,
                walka_id: (results as any)[2][0].walka_id,
                wygrane_rundy_robot1: null,
                wygrane_rundy_robot2: null,

            };
            socketIO.default.getIO().emit("addFight", walka);
            resolve(walka);
        });
    });
}

function WALKI_dodajWalkeOrazRoboty(res: express.Response, stanowisko_id: number, grupa_id: number, robot1_uuid: string, robot2_uuid: string): Promise<object> {
    return new Promise<object>((resolve, reject) => {
        try {
            WALKI.validator({ stanowisko_id: stanowisko_id, grupa_id: grupa_id});
            ROBOTY.validator({robot_uuid: robot1_uuid})
            ROBOTY.validator({robot_uuid: robot2_uuid})
        } catch (err: any) {
            ClientError.notAcceptable(res, err.message);
            reject();
        }

        db.query("CALL `WALKI_dodajWalkeOrazRoboty(A)`(?,?,@p2,?,?);", [robot1_uuid, robot2_uuid, grupa_id, stanowisko_id], (err, results, fields) => {
            if (err?.sqlState === '45000') {
                ClientError.badRequest(res, err.sqlMessage);
                reject();
                return;
            } else if (err) {
                ServerError.internalServerError(res, err.sqlMessage);
                reject();
                return;
            }
        
            const walka = results[results.length - 2][0];
            socketIO.default.getIO().emit("addFightAndRobots", walka);
            resolve(walka);
        });
    });
}

router.post('/addGroup', (req, res, next) => {

    const body = req?.body;
    const nazwa = body?.nazwa;
    const kategoria_id = Number(body?.kategoria_id);
    try {
        GRUPY_WALK.validator({ nazwa: nazwa, kategoria_id: kategoria_id });
    } catch (err: any) {
        ClientError.notAcceptable(res, err.message);
        return;
    }

    GRUPY_WALK_dodajGrupe(res, nazwa, kategoria_id).catch(() => {
        return;
    }).then((result) => {
        const grupa = {
            grupa_id: (result as any).grupa_id,
            nazwa: nazwa,
            kategoria_id: kategoria_id
        }
        Success.OK(res, grupa);
    });
});

router.delete('/deleteGroup', (req, res, next) => {

    const body = req?.body;
    const grupa_id = Number(body?.grupa_id);
    try {
        GRUPY_WALK.validator({ grupa_id: grupa_id });
    } catch (err: any) {
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

router.put('/addRobotRejection', (req, res, next) => {

    const body = req?.body;
    const robot_uuid = body?.robot_uuid;
    const powod_odrzucenia = body?.powod_odrzucenia;

    try {
        ROBOTY.validator({ robot_uuid: robot_uuid, powod_odrzucenia: powod_odrzucenia});
    } catch (err: any) {
        ClientError.notAcceptable(res, err.message);
        return;
    }

    db.query("CALL `ROBOTY_dodajPowodOdrzucenia(A)`(?, ?);", [robot_uuid, powod_odrzucenia == 'null' ? null : powod_odrzucenia], (err, results, fields) => {
        if (err?.sqlState === '45000') {
            ClientError.badRequest(res, err.sqlMessage);
            return;
        } else if (err) {
            ServerError.internalServerError(res, err.sqlMessage);
            return;
        }
        const robot = results[0][0];
        socketIO.default.getIO().to(`robots/${robot_uuid}`).to("referee").to("admin").emit("robots/addRobotRejection", robot);
        Success.OK(res, robot);
    });
});

router.put('/changeUserType', (req, res, next) => {

    const body = req?.body;
    const uzytkownik_uuid = body?.uzytkownik_uuid;
    const uzytkownik_typ = Number(body?.uzytkownik_typ);

    try {
        UZYTKOWNICY.validator({ uzytkownik_uuid: uzytkownik_uuid, uzytkownik_typ: uzytkownik_typ});
    } catch (err: any) {
        ClientError.notAcceptable(res, err.message);
        return;
    }

    db.query("CALL `UZYTKOWNICY_zmienTypUzytkownika(A)`(?, ?);", [uzytkownik_uuid, uzytkownik_typ], (err, results, fields) => {
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

router.post('/addFight', (req, res, next) => {

    const body = req?.body;
    const stanowisko_id = Number(body?.stanowisko_id);
    const nastepna_walka_id = Number(body?.nastepna_walka_id);
    const grupa_id = Number(body?.grupa_id);

    try {
        WALKI.validator({ stanowisko_id: stanowisko_id, nastepna_walka_id: nastepna_walka_id, grupa_id: grupa_id });
    } catch (err: any) {
        ClientError.notAcceptable(res, err.message);
        return;
    }

    WALKI_dodajWalke(res, stanowisko_id, nastepna_walka_id, grupa_id).catch(() => {
        return;
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
        ROBOTY.validator({ robot_uuid: robot1_uuid });
        ROBOTY.validator({ robot_uuid: robot2_uuid });
        WALKI.validator({ stanowisko_id: stanowisko_id, grupa_id: grupa_id });
    } catch (err: any) {
        ClientError.notAcceptable(res, err.message);
        return;
    }

    WALKI_dodajWalkeOrazRoboty(res, stanowisko_id, grupa_id, robot1_uuid, robot2_uuid).catch(() => {
        return;
    }).then((result) => {
        Success.OK(res, result as object);
    });
});

router.post('/addRobotToFight', (req, res, next) => {

    const body = req?.body;
    const walka_id = Number(body?.walka_id);
    const robot_uuid = body?.robot_uuid;

    try {
        WALKI.validator({ walka_id: walka_id });
        ROBOTY.validator({ robot_uuid: robot_uuid });
    } catch (err: any) {
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
        WALKI.validator({ walka_id: walka_id });
    } catch (err: any) {
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
        const response = results[0][0];
        socketIO.default.getIO().emit("deleteTimeResult", response);
        Success.OK(res, response);
    });
});

interface WalkaNaStosie {
    poziom: number;
    walka_id: number;
}

router.post('/createGroupsFromCategory', async (req, res, next) => {

    const body = req?.body;
    const kategoria_id = Number(body?.kategoria_id);
    const stanowiskaLista: Array<number> = body?.stanowiskaLista; //lista ID (jednocześnie ilość grup 2,4,8, lub 16)
    const iloscDoFinalu = Number(body?.iloscDoFinalu);
    const opcjaTworzenia = body.opcjaTworzenia == null ? null : Number(body.opcjaTworzenia); //null - drzewko finałowe + eliminacje, 0 - tylko eliminacje (ustawione), 1 - drzewko finałowe (puste) 
    const nazwyGrup = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"]
    var wiadomoscZwrotna = '';
    try {
        KATEGORIE.validator({ kategoria_id: kategoria_id });
        KATEGORIE.validator({ kategoria_id: iloscDoFinalu });
        if (stanowiskaLista.length === 0) {
            throw new Error('stanowiskaLista jest pusta');
        }
        if (iloscDoFinalu > 16) {
            throw new Error('Ilość do finału jest zbyt duża');
        }
    } catch (err: any) {
        ClientError.notAcceptable(res, err.message);
        return;
    }

    let blad = false;
    //sprawdzenie czy to jest kategoria walki
    await publicRoutes.KATEGORIE_czyToKategoriaWalki(res, kategoria_id).then(czyToKategoriaWalki => {
        if ((czyToKategoriaWalki as any).pCzyToKategoriaWalki !== 1) {
            blad = true;
            ClientError.methodNotAllowed(res, `Kategoria ${kategoria_id} nie jest kategorią walki`);
            return;
        }
    }).catch(() => {
        blad = true;
        return;
    });

    
    if (blad) return;
    
    // sprawdzenie stanowiska pod względem kategorii
    for (let index = 0; index < stanowiskaLista.length; index++) {
        const stanowiskoId = stanowiskaLista[index];
        try {
            STANOWISKA.validator({ stanowisko_id: stanowiskoId })
        } catch (err: any) {
            blad = true;
            ClientError.notAcceptable(res, err.message);
            break;
        }
        
        const czyMa = (await referee.STANOWISKA_czyStanowiskoMaKategorie(res, stanowiskoId, kategoria_id) as any).pCzyMa;
        if (czyMa !== 1) {
            blad = true;
            ClientError.failedDependency(res, `Stanowisko ${stanowiskoId} nie ma przypisanej kategorii ${kategoria_id}`)
            break;
        }
    }
    
    
    if (blad) return;
    
    
    //pobranie robotow do ustawienia
    let roboty = await new Promise<Array<any>>((resolve, reject) => {
        db.query(`SELECT DISTINCT robot_uuid FROM ROBOTY
        LEFT JOIN KATEGORIE_ROBOTA
        ON ROBOTY.robot_id = KATEGORIE_ROBOTA.robot_id
        WHERE ROBOTY.czy_dotarl = 1 AND ROBOTY.powod_odrzucenia IS NULL AND KATEGORIE_ROBOTA.kategoria_id = ?`, [kategoria_id], (err, results, fields) => {
            if (err?.sqlState === '45000') {
                ClientError.badRequest(res, err.sqlMessage);
                reject();
                return;
            } else if (err) {
                ServerError.internalServerError(res, err.sqlMessage);
                reject();
                return;
            }
            resolve(results.map((element: { robot_uuid: any; }) => {
                return element.robot_uuid;
            }));
        });
    })
    
    //sprawdzenie czy ilość stanowisk <= ilość do finalu <= ilość robotów
    if (stanowiskaLista.length > iloscDoFinalu) {
        ClientError.badRequest(res, `Ilość do finału jest mniejsza niż ilość stanowisk (${iloscDoFinalu} - ilość do finału < ${stanowiskaLista.length} - stanowiska)`)
        return;
    }
    if (iloscDoFinalu > roboty.length) {
        ClientError.badRequest(res, `Ilość robotów jest mniejsza niż ilość do finału (${roboty.length} - roboty < ${iloscDoFinalu} - ilość do finału)`)
        return;
    }
    const pog = roboty.length/stanowiskaLista.length;
    if ( pog < 3 && opcjaTworzenia != 1 ) {
        ClientError.badRequest(res, `Ilość robotów w grupie elimiacyjnej jest zbyt mała (${pog.toPrecision(1)} - w grupie, ${roboty.length} - ogółem). Zmniejsz liczbę stanowisk (grup) lub przełącz tryb tworzenia na 'tylko finał'.`)
        return;
    }
    // if (iloscDoFinalu > (roboty.length/2)) {
    //     ClientError.badRequest(res, `Ilość robotów jest zbyt mała aby eliminacje miały sens (${roboty.length} - roboty, ${iloscDoFinalu} - ilość do finału). Zmniejsz ilość do finału.`)
    //     return;
    // }
    
    //sprawdzenie czy ilosc do finalu, ilosc stanowisk 2^n
    if (iloscDoFinalu !== 1 && iloscDoFinalu !== 2 && iloscDoFinalu !== 4 && iloscDoFinalu !== 8 && iloscDoFinalu !== 16 && iloscDoFinalu !== 32 && iloscDoFinalu !== 64 && iloscDoFinalu !== 128) {
        ClientError.badRequest(res, 'Ilość do finału nie jest równa 2^n')
        return;
    }
    if (stanowiskaLista.length !== 1 && stanowiskaLista.length !== 2 && stanowiskaLista.length !== 4 && stanowiskaLista.length !== 8 && stanowiskaLista.length !== 16 && stanowiskaLista.length !== 32 && stanowiskaLista.length !== 64 && stanowiskaLista.length !== 128) {
        ClientError.badRequest(res, 'Ilość stanowisk nie jest równa 2^n')
        return;
    }
    
    
    const kategoria_nazwa = await new Promise<string>((resolve, reject) => {
        db.query(`SELECT KATEGORIE.nazwa FROM KATEGORIE WHERE KATEGORIE.kategoria_id = ?`, [kategoria_id], (err, results, fields) => {
            if (err?.sqlState === '45000') {
                ClientError.badRequest(res, err.sqlMessage);
                reject();
                return;
            } else if (err) {
                ServerError.internalServerError(res, err.sqlMessage);
                reject();
                return;
            }
            resolve((results[0] as any).nazwa);
        });
    })
    
    if(opcjaTworzenia == null || opcjaTworzenia == 1) {
        
        //DRZEWKO FINAŁU
        //utwórz grupe finałową
        if (iloscDoFinalu !== 1) {
            const grupaFinalowaId = (await GRUPY_WALK_dodajGrupe(res, `FINAŁ - ${kategoria_nazwa}`, kategoria_id) as any).grupa_id;
            //rozpocznij od walki szczytowej, zejdź do podstawy gdzie ilość walk/2 = ilosć do finału
            const iloscWalk = iloscDoFinalu / 2;
            const maxDeep = Math.log2(iloscWalk) - 1;
            
            //rozłóż stanowiska tak, aby rozłożyć walki równomiernie na każde z nich
            let stanowiska = [...stanowiskaLista].sort((a, b) => a + b);
        
            if (stanowiska.length < iloscWalk) {
                for (let i = 0; i < (iloscWalk / stanowiska.length); i++) {
                    stanowiska = stanowiska.concat(stanowiska);
                }
            }            
            const maxDeepStanowiska = Math.log2(iloscWalk) - 1;
            const initial_length = iloscWalk * 2 - 1;
            let actual_length = initial_length;
            let offset = 0;
            let do_wybrania = new Array(initial_length).fill(stanowiskaLista.length > 1 ? 0 : stanowiskaLista[0]);
            if(stanowiskaLista.length > 0) {
                for (let i = 0; i <= maxDeepStanowiska + 1; i++) {
                    let pula = [...stanowiska];
                    if (i == maxDeepStanowiska + 1) {
                        while (do_wybrania.findIndex(b => b === 0) > 0) {
                            do_wybrania[do_wybrania.findIndex(b => b === 0)] = pula.pop();
                        }
                    } else {
                        let o = offset;
                        for (let j = 0; j < Math.pow(2, i); j++) {
                            if (j % 2 === 0) {
                                o += j / 2
                            }
                            let s = j * actual_length
                            do_wybrania[o + s] = pula.pop();
                        }
                        actual_length = (actual_length - 1) / 2;
                        offset += 1;
                    }
                }
                
            } 
            
            do_wybrania = do_wybrania.reverse();
            
            let topWalkaId = (await WALKI_dodajWalke(res, do_wybrania.pop() as number, 0, grupaFinalowaId) as any).walka_id as number;
            let stosWalk: Array<WalkaNaStosie> = [{ poziom: 0, walka_id: topWalkaId }, { poziom: 0, walka_id: topWalkaId }];
            while (stosWalk.length !== 0 && do_wybrania.length !== 0) {
                try {                    
                    let nadrzednaWalka = stosWalk.pop() as WalkaNaStosie;
                    let nastepnaWalka = (await WALKI_dodajWalke(res, do_wybrania.pop() as number, nadrzednaWalka.walka_id, grupaFinalowaId) as any).walka_id;
                    if (nadrzednaWalka.poziom < maxDeep) {
                        stosWalk.push({ poziom: nadrzednaWalka.poziom + 1, walka_id: nastepnaWalka })
                        stosWalk.push({ poziom: nadrzednaWalka.poziom + 1, walka_id: nastepnaWalka })
                    }
                } catch (error) {  
                }
                
            }
            wiadomoscZwrotna += `Utworzono drzewko finałowe dla ${iloscDoFinalu} robotów, składające się z ${iloscWalk} walk rozłożonych przez ${maxDeep+1} szczeble. `
        }
    }

    if(opcjaTworzenia == null || opcjaTworzenia == 0) {

        //ELIMINACJE
        //wymieszaj roboty
        var currentIndex = roboty.length,  randomIndex;
        while (currentIndex != 0) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;
            [roboty[currentIndex], roboty[randomIndex]] = [roboty[randomIndex], roboty[currentIndex]];
        }
    
        //podziel roboty na grupy (losowo), ilością równe ilości stanowisk
        const iloscGrup = stanowiskaLista.length;
        let nowa: Array<Array<string>> = Array.from(Array(iloscGrup), () => []);
        for (let j = 0; j < roboty.length; j++) {
            nowa[j%iloscGrup].push(roboty[j])
        }
        const liczbaRobotow = roboty.length;
        roboty = nowa;

        //utwórz grupę eliminacyjną + literka
        for (let index = 0; index < iloscGrup; index++) {
            const nazwa = `ELIMINACJE gr. ${nazwyGrup[index]} - ${kategoria_nazwa}`;
            const robotyWGrupie = roboty[index] as Array<string>;
            try {
                GRUPY_WALK.validator({nazwa: nazwa})
            } catch (err: any) {
                blad = true;
                ClientError.notAcceptable(res, err.message);
                break;
            }
    
            const grupaEliminacyjnaId = (await GRUPY_WALK_dodajGrupe(res, nazwa, kategoria_id) as any).grupa_id;
    
            //w każdej grupie ustaw roboty, przeciwko sobie
            for (let x = 0; x < robotyWGrupie.length; x++) {
                for(let c = x + 1; c < robotyWGrupie.length; c++) {
                    await WALKI_dodajWalkeOrazRoboty(res, stanowiskaLista[index], grupaEliminacyjnaId, robotyWGrupie[x], robotyWGrupie[c]).catch(() => {
                        blad = true;
                        return;
                    });
                    if(blad) break;
                }
            }
        }

        wiadomoscZwrotna += (`Utworzono ${iloscGrup} grup eliminacyjncyh o liczności ${(liczbaRobotow/iloscGrup)%1 > 0 ? (Math.floor((liczbaRobotow/iloscGrup)) + '-'
        + (Math.floor((liczbaRobotow/iloscGrup))+1))  : (liczbaRobotow/iloscGrup)} robotów, z których każdej wyłoni się ${iloscDoFinalu/iloscGrup} finalistów.`)

    }

    if (blad) return;
    Success.OK(res, wiadomoscZwrotna);
});

export default router;