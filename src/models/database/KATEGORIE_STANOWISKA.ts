export class KATEGORIE_STANOWISKA{

    kategoria_stanowiska_id?: number | undefined;
    stanowisko_id?: number | undefined;
    kategoria_id?: number | undefined;

    static validator(body: KATEGORIE_STANOWISKA = {kategoria_stanowiska_id: undefined, stanowisko_id: undefined, kategoria_id: undefined}): void  {
        if ((typeof body.kategoria_stanowiska_id !== "number" || body.kategoria_stanowiska_id.toString().length > 7) && typeof body.kategoria_stanowiska_id !== "undefined") {
            throw new Error('KATEGORIE_STANOWISKA.kategoria_robota_id is not valid');
        }
        if ((typeof body.stanowisko_id !== "number" || body.stanowisko_id.toString().length > 3) && typeof body.stanowisko_id !== "undefined") {
            throw new Error('KATEGORIE_STANOWISKA.stanowisko_id is not valid');
        }
        if ((typeof body.kategoria_id !== "number" || body.kategoria_id.toString().length > 3) && typeof body.kategoria_id !== "undefined") {
            throw new Error('KATEGORIE_STANOWISKA.kategoria_id is not valid');
        }
    }
}