export class POTWIERDZENIA{

    potwierdzenie_id?: number | undefined;
    uzytkownik_id?: number | undefined;
    kod?: number | undefined;
    czy_na_telefon?: number | undefined;
    data_waznosci?: Date | undefined;

    static validator(body: POTWIERDZENIA = {potwierdzenie_id: undefined, uzytkownik_id: undefined, kod: undefined, czy_na_telefon: undefined, data_waznosci: undefined}): void  {
        if ((typeof body.potwierdzenie_id !== "number" || body.potwierdzenie_id.toString().length > 7 || isNaN(body.potwierdzenie_id)) && typeof body.potwierdzenie_id !== "undefined") {
            throw new Error('POTWIERDZENIA.potwierdzenie_id is not valid');
        }
        if ((typeof body.uzytkownik_id !== "number" || body.uzytkownik_id.toString().length > 6 || isNaN(body.uzytkownik_id)) && typeof body.uzytkownik_id !== "undefined") {
            throw new Error('POTWIERDZENIA.uzytkownik_id is not valid');
        }
        if ((typeof body.kod !== "number" || body.kod.toString().length > 6 || isNaN(body.kod)) && typeof body.kod !== "undefined") {
            throw new Error('POTWIERDZENIA.kod is not valid');
        }
        if ((typeof body.czy_na_telefon !== "number" || body.czy_na_telefon.toString().length > 1 || isNaN(body.czy_na_telefon)) && typeof body.czy_na_telefon !== "undefined") {
            throw new Error('POTWIERDZENIA.czy_na_telefon is not valid');
        }
        if (typeof body.data_waznosci !== "string" && typeof body.data_waznosci !== "undefined") {
            throw new Error('POTWIERDZENIA.data_waznosci is not valid');
        }
    }
}