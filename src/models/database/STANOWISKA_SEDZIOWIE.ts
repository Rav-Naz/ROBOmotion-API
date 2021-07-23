export class STANOWISKA_SEDZIOWIE{

    stanowiska_sedziowie_id?: number | undefined;
    stanowisko_id?: number | undefined;
    uzytkownik_id?: number | undefined;


    static validator(body: STANOWISKA_SEDZIOWIE = {stanowiska_sedziowie_id: undefined, stanowisko_id: undefined, uzytkownik_id: undefined}): void  {
        if ((typeof body.stanowiska_sedziowie_id !== "number" || body.stanowiska_sedziowie_id.toString().length > 3) && typeof body.stanowiska_sedziowie_id !== "undefined") {
            throw new Error('STANOWISKA_SEDZIOWIE.stanowiska_sedziowie_id is not valid');
        }
        if ((typeof body.stanowisko_id !== "number" || body.stanowisko_id.toString().length > 3) && typeof body.stanowisko_id !== "undefined") {
            throw new Error('STANOWISKA_SEDZIOWIE.stanowisko_id is not valid');
        }
        if ((typeof body.uzytkownik_id !== "number" || body.uzytkownik_id.toString().length > 6) && typeof body.uzytkownik_id !== "undefined") {
            throw new Error('STANOWISKA_SEDZIOWIE.uzytkownik_id is not valid');
        }
    }
}