export class AKTYWNE_WALKI_I_PRZEJAZDY {

    aktywne_walki_i_przejazdy_id?: number | undefined;
    stanowisko_id?: number | undefined;
    kategoria_id?: number | undefined;
    ring_arena?: number | null | undefined;
    robot1_id?: number | undefined;
    robot2_id?: number | null | undefined;
    czas_rozpoczecia?: Date | null | undefined;


    static validator(body: AKTYWNE_WALKI_I_PRZEJAZDY = { aktywne_walki_i_przejazdy_id: undefined, kategoria_id: undefined, ring_arena: undefined, stanowisko_id: undefined, czas_rozpoczecia: undefined }): void {
        if ((typeof body.aktywne_walki_i_przejazdy_id !== "number" || body.aktywne_walki_i_przejazdy_id.toString().length > 10 || isNaN(body.aktywne_walki_i_przejazdy_id)) && typeof body.aktywne_walki_i_przejazdy_id !== "undefined") {
            throw new Error('AKTYWNE_WALKI_I_PRZEJAZDY.aktywne_walki_i_przejazdy_id is not valid');
        }
        if ((typeof body.stanowisko_id !== "number" || body.stanowisko_id.toString().length > 10 || isNaN(body.stanowisko_id)) && typeof body.stanowisko_id !== "undefined" && typeof body.stanowisko_id !== "object") {
            throw new Error('AKTYWNE_WALKI_I_PRZEJAZDY.stanowisko_id is not valid');
        }
        if ((typeof body.kategoria_id !== "number" || body.kategoria_id.toString().length > 10 || isNaN(body.kategoria_id)) && typeof body.kategoria_id !== "undefined" && typeof body.kategoria_id !== "object") {
            throw new Error('AKTYWNE_WALKI_I_PRZEJAZDY.kategoria_id is not valid');
        }
        if ((typeof body.ring_arena !== "number" || body.ring_arena.toString().length > 10 || isNaN(body.ring_arena)) && typeof body.ring_arena !== "undefined" && typeof body.ring_arena !== "object") {
            throw new Error('AKTYWNE_WALKI_I_PRZEJAZDY.ring_arena is not valid');
        }
        if ((typeof body.robot1_id !== "number" || body.robot1_id.toString().length > 10 || isNaN(body.robot1_id)) && typeof body.robot1_id !== "undefined" && typeof body.robot1_id !== "object") {
            throw new Error('AKTYWNE_WALKI_I_PRZEJAZDY.robot1_id is not valid');
        }
        if ((typeof body.robot2_id !== "number" || body.robot2_id.toString().length > 10 || isNaN(body.robot2_id)) && typeof body.robot2_id !== "undefined" && typeof body.robot2_id !== "object") {
            throw new Error('AKTYWNE_WALKI_I_PRZEJAZDY.robot2_id is not valid');
        }
        if (typeof body.czas_rozpoczecia !== "string" && typeof body.czas_rozpoczecia !== "undefined" && typeof body.czas_rozpoczecia !== "object") {
            throw new Error('AKTYWNE_WALKI_I_PRZEJAZDY.czas_rozpoczecia is not valid');
        }
    }
}