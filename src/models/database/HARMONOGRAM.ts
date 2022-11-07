export class HARMONOGRAM {

    harmonogram_id?: number | undefined;
    nazwa?: string | undefined;
    godzina_rozpoczecia?: Date | null | undefined;
    interwal?: number | undefined;
    kolumny?: number | undefined;
    wiersze?: number | undefined;
    komorki?: string | null | undefined;
    czy_aktywny?: number | undefined;


    static validator(body: HARMONOGRAM = { harmonogram_id: undefined, kolumny: undefined, wiersze: undefined, interwal: undefined, komorki: undefined, godzina_rozpoczecia: undefined, nazwa: undefined }): void {
        if ((typeof body.harmonogram_id !== "number" || body.harmonogram_id.toString().length > 5 || isNaN(body.harmonogram_id)) && typeof body.harmonogram_id !== "undefined") {
            throw new Error('HARMONOGRAM.harmonogram_id is not valid');
        }
        if ((typeof body.nazwa !== "string" || body.nazwa.length > 100) && typeof body.nazwa !== "undefined") {
            throw new Error('HARMONOGRAM.nazwa is not valid');
        }
        if (typeof body.godzina_rozpoczecia !== "string" && typeof body.godzina_rozpoczecia !== "undefined" && typeof body.godzina_rozpoczecia !== "object") {
            throw new Error('HARMONOGRAM.godzina_rozpoczecia is not valid');
        }
        if ((typeof body.interwal !== "number" || body.interwal.toString().length > 11 || isNaN(body.interwal)) && typeof body.interwal !== "undefined" && typeof body.interwal !== "object") {
            throw new Error('HARMONOGRAM.interwal is not valid');
        }
        if ((typeof body.kolumny !== "number" || body.kolumny.toString().length > 11 || isNaN(body.kolumny)) && typeof body.kolumny !== "undefined" && typeof body.kolumny !== "object") {
            throw new Error('HARMONOGRAM.kolumny is not valid');
        }
        if ((typeof body.wiersze !== "number" || body.wiersze.toString().length > 11 || isNaN(body.wiersze)) && typeof body.wiersze !== "undefined" && typeof body.wiersze !== "object") {
            throw new Error('HARMONOGRAM.wiersze is not valid');
        }
        if ((typeof body.komorki !== "string") && typeof body.komorki !== "undefined") {
            throw new Error('HARMONOGRAM.komorki is not valid');
        }
        if ((typeof body.czy_aktywny !== "number" || body.czy_aktywny.toString().length > 1 || isNaN(body.czy_aktywny)) && typeof body.czy_aktywny !== "undefined") {
            throw new Error('HARMONOGRAM.czy_aktywny is not valid');
        }
    }
}