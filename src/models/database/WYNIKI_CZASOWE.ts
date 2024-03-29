export class WYNIKI_CZASOWE {

    wynik_id?: number | undefined;
    robot_id?: number | undefined;
    czas_przejazdu?: number | undefined;
    czas_zakonczenia?: Date | undefined;
    stanowisko_id?: number | undefined;
    kategoria_id?: number | undefined;
    uwagi?: string | null | undefined;


    static validator(body: WYNIKI_CZASOWE = { wynik_id: undefined, czas_przejazdu: undefined, kategoria_id: undefined, czas_zakonczenia: undefined, robot_id: undefined, stanowisko_id: undefined }): void {
        if ((typeof body.wynik_id !== "number" || body.wynik_id.toString().length > 7 || isNaN(body.wynik_id)) && typeof body.wynik_id !== "undefined") {
            throw new Error('WYNIKI_CZASOWE.wynik_id is not valid');
        }
        if ((typeof body.robot_id !== "number" || body.robot_id.toString().length > 6 || isNaN(body.robot_id)) && typeof body.robot_id !== "undefined") {
            throw new Error('WYNIKI_CZASOWE.robot_id is not valid');
        }
        if ((typeof body.czas_przejazdu !== "number" || body.czas_przejazdu.toString().length > 7 || isNaN(body.czas_przejazdu)) && typeof body.czas_przejazdu !== "undefined") {
            throw new Error('WYNIKI_CZASOWE.czas_przejazdu is not valid');
        }
        if (typeof body.czas_zakonczenia !== "string" && typeof body.czas_zakonczenia !== "undefined") {
            throw new Error('WYNIKI_CZASOWE.czas_zakonczenia is not valid');
        }
        if ((typeof body.stanowisko_id !== "number" || body.stanowisko_id.toString().length > 3 || isNaN(body.stanowisko_id)) && typeof body.stanowisko_id !== "undefined") {
            throw new Error('WYNIKI_CZASOWE.stanowisko_id is not valid');
        }
        if ((typeof body.kategoria_id !== "number" || body.kategoria_id.toString().length > 3 || isNaN(body.kategoria_id)) && typeof body.kategoria_id !== "undefined") {
            throw new Error('WYNIKI_CZASOWE.kategoria_id is not valid');
        }
        if ((typeof body.uwagi !== "string" || body.uwagi.length > 500) && typeof body.uwagi !== "undefined" && typeof body.uwagi !== "object") {
            throw new Error('WYNIKI_CZASOWE.uwagi is not valid');
        }
    }
}