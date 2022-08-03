export class ILE_OSOB_NA_WYDARZENIU {

    ile_osob_na_wydarzeniu_id?: number | undefined;
    ilosc_osob?: number | undefined;
    czas_sprawdzenia?: Date | undefined;

    static validator(body: ILE_OSOB_NA_WYDARZENIU = {ile_osob_na_wydarzeniu_id: undefined, ilosc_osob: undefined, czas_sprawdzenia: undefined}): void  {
        if ((typeof body.ile_osob_na_wydarzeniu_id !== "number" || body.ile_osob_na_wydarzeniu_id.toString().length > 5 || isNaN(body.ile_osob_na_wydarzeniu_id)) && typeof body.ile_osob_na_wydarzeniu_id !== "undefined") {
            throw new Error('ILE_OSOB_NA_WYDARZENIU.ile_osob_na_wydarzeniu_id is not valid');
        }
        if ((typeof body.ilosc_osob !== "number" || body.ilosc_osob.toString().length > 8 || isNaN(body.ilosc_osob)) && typeof body.ilosc_osob !== "undefined") {
            throw new Error('ILE_OSOB_NA_WYDARZENIU.ilosc_osob is not valid');
        }
        if (typeof body.czas_sprawdzenia !== "string" && typeof body.czas_sprawdzenia !== "undefined") {
            throw new Error('ILE_OSOB_NA_WYDARZENIU.czas_sprawdzenia is not valid');
        }
    }
}