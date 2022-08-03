export class JEDZENIE {

    jedzenie_id?: number | undefined;
    nazwa?: string | undefined;

    static validator(body: JEDZENIE = {jedzenie_id: undefined, nazwa: undefined}): void  {
        if ((typeof body.jedzenie_id !== "number" || body.jedzenie_id.toString().length > 11 || isNaN(body.jedzenie_id)) && typeof body.jedzenie_id !== "undefined") {
            throw new Error('JEDZENIE.jedzenie_id is not valid');
        }
        if ((typeof body.nazwa !== "string" || body.nazwa.toString().length > 50) && typeof body.nazwa !== "undefined") {
            throw new Error('JEDZENIE.nazwa is not valid');
        }
    }
}