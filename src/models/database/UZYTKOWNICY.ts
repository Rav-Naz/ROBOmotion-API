export class UZYTKOWNICY{

    uzytkownik_id?: number | undefined;
    uzytkownik_uuid?: string | undefined;
    uzytkownik_typ?: number | undefined;
    imie?: string | undefined;
    nazwisko?: string | undefined;
    numer_telefonu?: string | null | undefined;
    email?: string | undefined;
    haslo?: string | undefined;
    kod_pocztowy?: string | null | undefined;
    data_rejestracji?: Date | undefined;
    czy_potwierdzony_email?: Boolean | undefined;
    czy_potwierdzony_numer_telefonu?: Boolean | undefined;


    static validator(body: UZYTKOWNICY = {uzytkownik_id: undefined, uzytkownik_uuid: undefined, uzytkownik_typ: undefined, imie: undefined, nazwisko: undefined, numer_telefonu: undefined, email: undefined, haslo: undefined, czy_potwierdzony_email: undefined, czy_potwierdzony_numer_telefonu: undefined, data_rejestracji: undefined, kod_pocztowy: undefined}): void  {
        if ((typeof body.uzytkownik_id !== "number" || body.uzytkownik_id.toString().length > 6) && typeof body.uzytkownik_id !== "undefined") {
            throw new Error('UZYTKOWNICY.uzytkownik_id is not valid');
        }
        if ((typeof body.uzytkownik_uuid !== "string" || body.uzytkownik_uuid.length != 36) && typeof body.uzytkownik_uuid !== "undefined") {
            throw new Error('UZYTKOWNICY.uzytkownik_uuid is not valid');
        }
        if ((typeof body.uzytkownik_typ !== "number" || body.uzytkownik_typ.toString().length > 1) && typeof body.uzytkownik_typ !== "undefined") {
            throw new Error('UZYTKOWNICY.uzytkownik_typ is not valid');
        }
        if ((typeof body.imie !== "string" || body.imie.length > 40) && typeof body.imie !== "undefined") {
            throw new Error('UZYTKOWNICY.imie is not valid');
        }
        if ((typeof body.nazwisko !== "string" || body.nazwisko.length > 40) && typeof body.nazwisko !== "undefined") {
            throw new Error('UZYTKOWNICY.nazwisko is not valid');
        }
        if ((typeof body.numer_telefonu !== "string" || body.numer_telefonu.length > 15) && typeof body.numer_telefonu !== "undefined" && typeof body.kod_pocztowy !== "object") {
            throw new Error('UZYTKOWNICY.numer_telefonu is not valid');
        }
        if ((typeof body.email !== "string" || body.email.length > 100) && typeof body.email !== "undefined") {
            throw new Error('UZYTKOWNICY.email is not valid');
        }
        if ((typeof body.haslo !== "string" || body.haslo.length > 64) && typeof body.haslo !== "undefined") {
            throw new Error('UZYTKOWNICY.haslo is not valid');
        }
        if ((typeof body.kod_pocztowy !== "string" || body.kod_pocztowy.length > 6) && typeof body.kod_pocztowy !== "undefined" && typeof body.kod_pocztowy !== "object") {
            throw new Error('UZYTKOWNICY.kod_pocztowy is not valid');
        }
        if (typeof body.data_rejestracji !== "string" && typeof body.data_rejestracji !== "undefined") {
            throw new Error('UZYTKOWNICY.kod_pocztowy is not valid');
        }
        if (typeof body.czy_potwierdzony_email !== "boolean" && typeof body.czy_potwierdzony_email !== "undefined") {
            throw new Error('UZYTKOWNICY.czy_potwierdzony_email is not valid');
        }
        if (typeof body.czy_potwierdzony_numer_telefonu !== "boolean" && typeof body.czy_potwierdzony_numer_telefonu !== "undefined") {
            throw new Error('UZYTKOWNICY.czy_potwierdzony_numer_telefonu is not valid');
        }
    }
}