export class WALKI {

    walka_id?: number | undefined;
    robot1_id?: number | null | undefined;
    robot2_id?: number | null | undefined;
    wygrane_rundy_robot1?: number | null | undefined;
    wygrane_rundy_robot2?: number | null | undefined;
    czas_zakonczenia?: Date | null | undefined;
    stanowisko_id?: number | undefined;
    nastepna_walka_id?: number | null | undefined;
    grupa_id?: number | undefined;


    static validator(body: WALKI = { walka_id: undefined, robot1_id: undefined, robot2_id: undefined, wygrane_rundy_robot1: undefined, wygrane_rundy_robot2: undefined, czas_zakonczenia: undefined, grupa_id: undefined, nastepna_walka_id: undefined, stanowisko_id: undefined }): void {
        if ((typeof body.walka_id !== "number" || body.walka_id.toString().length > 7 || isNaN(body.walka_id)) && typeof body.walka_id !== "undefined") {
            throw new Error('WALKI.walka_id is not valid');
        }
        if ((typeof body.robot1_id !== "number" || body.robot1_id.toString().length > 6 || isNaN(body.robot1_id)) && typeof body.robot1_id !== "undefined" && typeof body.robot1_id !== "object") {
            throw new Error('WALKI.robot1_id is not valid');
        }
        if ((typeof body.robot2_id !== "number" || body.robot2_id.toString().length > 6 || isNaN(body.robot2_id)) && typeof body.robot2_id !== "undefined" && typeof body.robot2_id !== "object") {
            throw new Error('WALKI.robot2_id is not valid');
        }
        if ((typeof body.wygrane_rundy_robot1 !== "number" || body.wygrane_rundy_robot1.toString().length > 2 || isNaN(body.wygrane_rundy_robot1)) && typeof body.wygrane_rundy_robot1 !== "undefined" && typeof body.wygrane_rundy_robot1 !== "object") {
            throw new Error('WALKI.wygrane_rundy_robot1 is not valid');
        }
        if ((typeof body.wygrane_rundy_robot2 !== "number" || body.wygrane_rundy_robot2.toString().length > 2 || isNaN(body.wygrane_rundy_robot2)) && typeof body.wygrane_rundy_robot2 !== "undefined" && typeof body.wygrane_rundy_robot2 !== "object") {
            throw new Error('WALKI.wygrane_rundy_robot2 is not valid');
        }
        if (typeof body.czas_zakonczenia !== "string" && typeof body.czas_zakonczenia !== "undefined" && typeof body.czas_zakonczenia !== "object") {
            throw new Error('WALKI.czas_zakonczenia is not valid');
        }
        if ((typeof body.stanowisko_id !== "number" || body.stanowisko_id.toString().length > 3 || isNaN(body.stanowisko_id)) && typeof body.stanowisko_id !== "undefined") {
            throw new Error('WALKI.stanowisko_id is not valid');
        }
        if ((typeof body.nastepna_walka_id !== "number" || body.nastepna_walka_id.toString().length > 7 || isNaN(body.nastepna_walka_id)) && typeof body.nastepna_walka_id !== "undefined" && typeof body.nastepna_walka_id !== "object") {
            throw new Error('WALKI.nastepna_walka_id is not valid');
        }
        if ((typeof body.grupa_id !== "number" || body.grupa_id.toString().length > 3 || isNaN(body.grupa_id)) && typeof body.grupa_id !== "undefined") {
            throw new Error('WALKI.grupa_id is not valid');
        }


    }
}