export class UPRAWNIENIA {

    uprawnienie_id?: number | undefined;
    nazwa?: string | undefined;

    static validator(body: UPRAWNIENIA = {uprawnienie_id: undefined, nazwa: undefined}): void  {
        if ((typeof body.uprawnienie_id !== "number" || body.uprawnienie_id.toString().length > 2 || isNaN(body.uprawnienie_id)) && typeof body.uprawnienie_id !== "undefined") {
            throw new Error('UPRAWNIENIA.uprawnienie_id is not valid');
        }
        if ((typeof body.nazwa !== "string" || body.nazwa.toString().length > 100) && typeof body.nazwa !== "undefined") {
            throw new Error('UPRAWNIENIA.nazwa is not valid');
        }
    }
}