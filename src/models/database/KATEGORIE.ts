export class KATEGORIE {

    kategoria_id?: number | undefined;
    nazwa?: string | undefined;

    static validator(body: KATEGORIE = {kategoria_id: undefined, nazwa: undefined}): void  {
        if ((typeof body.kategoria_id !== "number" || body.kategoria_id.toString().length > 3) && typeof body.kategoria_id !== "undefined") {
            throw new Error('KATEGORIE.kategoria_id is not valid');
        }
        if ((typeof body.nazwa !== "string" || body.nazwa.toString().length > 50) && typeof body.nazwa !== "undefined") {
            throw new Error('KATEGORIE.nazwa is not valid');
        }
    }
}