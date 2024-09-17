export class UZYTKOWNICY {

    uzytkownik_id?: number | undefined;
    uzytkownik_uuid?: string | undefined;
    uzytkownik_kod?: string | null | undefined;
    uzytkownik_typ?: number | undefined;
    imie?: string | undefined;
    nazwisko?: string | undefined;
    numer_telefonu?: string | undefined;
    email?: string | undefined;
    haslo?: string | undefined;
    kod_pocztowy?: string | undefined;
    data_rejestracji?: Date | undefined;
    preferowane_jedzenie?: number | null | undefined;
    rozmiar_koszulki?: number | null | undefined;
    czy_odebral_starterpack?: number | undefined;
    czy_opiekun?: number | undefined;
    czy_potwierdzony_email?: number | undefined;
    czy_potwierdzony_numer_telefonu?: number | undefined;
    wiek?: number | undefined;


    static validator(body: UZYTKOWNICY = { uzytkownik_id: undefined, uzytkownik_uuid: undefined, uzytkownik_typ: undefined, imie: undefined, nazwisko: undefined, numer_telefonu: undefined, email: undefined, haslo: undefined, czy_potwierdzony_email: undefined, czy_potwierdzony_numer_telefonu: undefined, data_rejestracji: undefined, kod_pocztowy: undefined }): void {
        if ((typeof body.uzytkownik_id !== "number" || body.uzytkownik_id.toString().length > 6 || isNaN(body.uzytkownik_id)) && typeof body.uzytkownik_id !== "undefined") {
            throw new Error('UZYTKOWNICY.uzytkownik_id is not valid');
        }
        if ((typeof body.uzytkownik_uuid !== "string" || body.uzytkownik_uuid.length != 36) && typeof body.uzytkownik_uuid !== "undefined") {
            throw new Error('UZYTKOWNICY.uzytkownik_uuid is not valid');
        }
        if ((typeof body.uzytkownik_kod !== "string" || body.uzytkownik_kod.length > 12) && typeof body.uzytkownik_kod !== "undefined") {
            throw new Error('UZYTKOWNICY.uzytkownik_kod  is not valid');
        }
        if ((typeof body.uzytkownik_typ !== "number" || body.uzytkownik_typ.toString().length > 1 || isNaN(body.uzytkownik_typ)) && typeof body.uzytkownik_typ !== "undefined") {
            throw new Error('UZYTKOWNICY.uzytkownik_typ is not valid');
        }
        if ((typeof body.imie !== "string" || body.imie.length > 40 || body.imie.length < 2) && typeof body.imie !== "undefined") {
            throw new Error('UZYTKOWNICY.imie is not valid');
        }
        if ((typeof body.nazwisko !== "string" || body.nazwisko.length > 40 || body.nazwisko.length < 2) && typeof body.nazwisko !== "undefined") {
            throw new Error('UZYTKOWNICY.nazwisko is not valid');
        }
        if ((typeof body.numer_telefonu !== "string" || body.numer_telefonu.length > 20 || body.numer_telefonu.length < 7) && typeof body.numer_telefonu !== "undefined") {
            throw new Error('UZYTKOWNICY.numer_telefonu is not valid');
        }
        const emailRegexp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
        if ((typeof body.email !== "string" || body.email.length > 100 || body.email.length < 2 || !emailRegexp.test(body.email)) && typeof body.email !== "undefined") {
            throw new Error('UZYTKOWNICY.email is not valid');
        }
        if ((typeof body.haslo !== "string" || body.haslo.length > 64 || body.haslo.length < 6) && typeof body.haslo !== "undefined") {
            throw new Error('UZYTKOWNICY.haslo is not valid');
        }
        if ((typeof body.kod_pocztowy !== "string" || body.kod_pocztowy.length > 8 || body.kod_pocztowy.length < 2) && typeof body.kod_pocztowy !== "undefined") {
            throw new Error('UZYTKOWNICY.kod_pocztowy is not valid');
        }
        if (typeof body.data_rejestracji !== "string" && typeof body.data_rejestracji !== "undefined") {
            throw new Error('UZYTKOWNICY.data_rejestracji is not valid');
        }
        if ((typeof body.preferowane_jedzenie !== "number" || body.preferowane_jedzenie.toString().length > 2 || isNaN(body.preferowane_jedzenie)) && typeof body.preferowane_jedzenie !== "undefined" && typeof body.preferowane_jedzenie !== "object") {
            throw new Error('UZYTKOWNICY.preferowane_jedzenie is not valid');
        }
        if ((typeof body.wiek !== "number" || body.wiek.toString().length > 3 || isNaN(body.wiek)) && typeof body.wiek !== "undefined" && typeof body.wiek !== "object") {
            throw new Error('UZYTKOWNICY.wiek is not valid');
        }
        if ((typeof body.rozmiar_koszulki !== "number" || body.rozmiar_koszulki.toString().length > 2 || isNaN(body.rozmiar_koszulki)) && typeof body.rozmiar_koszulki !== "undefined" && typeof body.rozmiar_koszulki !== "object") {
            throw new Error('UZYTKOWNICY.rozmiar_koszulki is not valid');
        }
        if ((typeof body.czy_odebral_starterpack !== "number" || body.czy_odebral_starterpack.toString().length > 2 || isNaN(body.czy_odebral_starterpack)) && typeof body.czy_odebral_starterpack !== "undefined" && typeof body.czy_odebral_starterpack !== "object") {
            throw new Error('UZYTKOWNICY.czy_odebral_starterpack is not valid');
        }
        if ((typeof body.czy_opiekun !== "number" || body.czy_opiekun.toString().length > 2 || isNaN(body.czy_opiekun)) && typeof body.czy_opiekun !== "undefined" && typeof body.czy_opiekun !== "object") {
            throw new Error('UZYTKOWNICY.czy_opiekun is not valid');
        }
        if ((typeof body.czy_potwierdzony_email !== "number" || body.czy_potwierdzony_email.toString().length > 1 || isNaN(body.czy_potwierdzony_email)) && typeof body.czy_potwierdzony_email !== "undefined") {
            throw new Error('UZYTKOWNICY.czy_potwierdzony_email is not valid');
        }
        if ((typeof body.czy_potwierdzony_numer_telefonu !== "number" || body.czy_potwierdzony_numer_telefonu.toString().length > 1 || isNaN(body.czy_potwierdzony_numer_telefonu)) && typeof body.czy_potwierdzony_numer_telefonu !== "undefined") {
            throw new Error('UZYTKOWNICY.czy_potwierdzony_numer_telefonu is not valid');
        }
    }
}