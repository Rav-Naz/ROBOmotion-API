export class KATEGORIE_ROBOTA {

    kategoria_robota_id?: number | undefined;
    robot_id?: number | undefined;
    kategoria_id?: number | undefined;

    static validator(body: KATEGORIE_ROBOTA = {kategoria_robota_id: undefined, robot_id: undefined, kategoria_id: undefined}): void  {
        if ((typeof body.kategoria_robota_id !== "number" || body.kategoria_robota_id.toString().length > 7) && typeof body.kategoria_robota_id !== "undefined") {
            throw new Error('KATEGORIE_ROBOTA.kategoria_robota_id is not valid');
        }
        if ((typeof body.robot_id !== "number" || body.robot_id.toString().length > 6) && typeof body.robot_id !== "undefined") {
            throw new Error('KATEGORIE_ROBOTA.robot_id is not valid');
        }
        if ((typeof body.kategoria_id !== "number" || body.kategoria_id.toString().length > 3) && typeof body.kategoria_id !== "undefined") {
            throw new Error('KATEGORIE_ROBOTA.kategoria_id is not valid');
        }
    }
}