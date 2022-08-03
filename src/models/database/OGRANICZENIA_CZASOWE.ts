export class OGRANICZENIA_CZASOWE {

    ograniczenia_czasowe_id?: number | undefined;
    nazwa?: string | undefined;
    data_rozpoczecia?: Date | undefined;
    data_zakonczenia?: Date | undefined;

    static validator(body: OGRANICZENIA_CZASOWE = {ograniczenia_czasowe_id: undefined, nazwa: undefined, data_rozpoczecia: undefined, data_zakonczenia: undefined}): void  {
        if ((typeof body.ograniczenia_czasowe_id !== "number" || body.ograniczenia_czasowe_id.toString().length > 5 || isNaN(body.ograniczenia_czasowe_id)) && typeof body.ograniczenia_czasowe_id !== "undefined") {
            throw new Error('OGRANICZENIA_CZASOWE.ograniczenia_czasowe_id is not valid');
        }
        if ((typeof body.nazwa !== "string" || body.nazwa.toString().length > 100) && typeof body.nazwa !== "undefined") {
            throw new Error('OGRANICZENIA_CZASOWE.nazwa is not valid');
        }
        if (typeof body.data_rozpoczecia !== "string" && typeof body.data_rozpoczecia !== "undefined") {
            throw new Error('OGRANICZENIA_CZASOWE.data_rozpoczecia is not valid');
        }
        if (typeof body.data_zakonczenia !== "string" && typeof body.data_zakonczenia !== "undefined") {
            throw new Error('OGRANICZENIA_CZASOWE.data_zakonczenia is not valid');
        }
    }
}