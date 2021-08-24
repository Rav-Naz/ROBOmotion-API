export class KATEGORIE {

    kategoria_id?: number | undefined;
    nazwa?: string | undefined;
    rodzaj?: number | undefined;

    static validator(body: KATEGORIE = {kategoria_id: undefined, nazwa: undefined, rodzaj: undefined}): void  {
        if ((typeof body.kategoria_id !== "number" || body.kategoria_id.toString().length > 3 || isNaN(body.kategoria_id)) && typeof body.kategoria_id !== "undefined") {
            throw new Error('KATEGORIE.kategoria_id is not valid');
        }
        if ((typeof body.nazwa !== "string" || body.nazwa.toString().length > 50) && typeof body.nazwa !== "undefined") {
            throw new Error('KATEGORIE.nazwa is not valid');
        }
        if ((typeof body.rodzaj !== "number" || body.rodzaj.toString().length > 1) && typeof body.rodzaj !== "undefined") {
            throw new Error('KATEGORIE.rodzaj is not valid');
        }
    }
}