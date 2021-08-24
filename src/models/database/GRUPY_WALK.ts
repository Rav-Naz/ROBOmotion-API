export class GRUPY_WALK {

    grupa_id?: number | undefined;
    kategoria_id?: number | undefined;
    nazwa?: string | undefined;

    static validator(body: GRUPY_WALK = {grupa_id: undefined, kategoria_id: undefined, nazwa: undefined}): void  {
        if ((typeof body.grupa_id !== "number" || body.grupa_id.toString().length > 3 || isNaN(body.grupa_id)) && typeof body.grupa_id !== "undefined") {
            throw new Error('GRUPY_WALK.grupa_id is not valid');
        }
        if ((typeof body.kategoria_id !== "number" || body.kategoria_id.toString().length > 3 || isNaN(body.kategoria_id)) && typeof body.kategoria_id !== "undefined") {
            throw new Error('GRUPY_WALK.kategoria_id is not valid');
        }
        if ((typeof body.nazwa !== "string" || body.nazwa.toString().length > 50) && typeof body.nazwa !== "undefined") {
            throw new Error('GRUPY_WALK.nazwa is not valid');
        }
    }
}