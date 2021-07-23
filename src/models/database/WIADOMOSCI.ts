export class WIADOMOSCI{

    wiadomosc_id?: number | undefined;
    uzytkownik_id?: number | undefined;
    tresc?: string | undefined;
    czy_wyslane?: Boolean | undefined;
    czas_nadania?: Date | undefined;
    czas_wyslania?: Date | null| undefined;


    static validator(body: WIADOMOSCI = {wiadomosc_id: undefined, uzytkownik_id: undefined, czas_nadania: undefined, czas_wyslania: undefined, czy_wyslane: undefined, tresc: undefined}): void  {
        if ((typeof body.wiadomosc_id !== "number" || body.wiadomosc_id.toString().length > 10) && typeof body.wiadomosc_id !== "undefined") {
            throw new Error('WIADOMOSCI.wiadomosc_id is not valid');
        }
        if ((typeof body.uzytkownik_id !== "number" || body.uzytkownik_id.toString().length > 6) && typeof body.uzytkownik_id !== "undefined") {
            throw new Error('WIADOMOSCI.uzytkownik_id is not valid');
        }
        if ((typeof body.tresc !== "string" || body.tresc.length > 500) && typeof body.tresc !== "undefined") {
            throw new Error('WIADOMOSCI.tresc is not valid');
        }
        if (typeof body.czy_wyslane !== "boolean" && typeof body.czy_wyslane !== "undefined") {
            throw new Error('WIADOMOSCI.czy_wyslane is not valid');
        }
        if (typeof body.czas_nadania !== "string" && typeof body.czas_nadania !== "undefined") {
            throw new Error('WIADOMOSCI.czas_nadania is not valid');
        }
        if (typeof body.czas_wyslania !== "string" && typeof body.czas_wyslania !== "undefined" && typeof body.czas_wyslania !== "object" ) {
            throw new Error('WIADOMOSCI.czas_wyslania is not valid');
        }
    }
}