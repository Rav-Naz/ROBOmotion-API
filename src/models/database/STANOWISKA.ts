export class STANOWISKA{

    stanowisko_id?: number | undefined;
    nazwa?: string | undefined;


    static validator(body: STANOWISKA = {stanowisko_id: undefined, nazwa: undefined}): void  {
        if ((typeof body.stanowisko_id !== "number" || body.stanowisko_id.toString().length > 3) && typeof body.stanowisko_id !== "undefined") {
            throw new Error('STANOWISKA.stanowisko_id is not valid');
        }
        if ((typeof body.nazwa !== "string" || body.nazwa.length > 50) && typeof body.nazwa !== "undefined") {
            throw new Error('STANOWISKA.nazwa is not valid');
        }
    }
}