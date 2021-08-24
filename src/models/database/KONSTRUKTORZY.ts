export class KONSTRUKTORZY{

    konstruktor_id?: number | undefined;
    uzytkownik_id?: number | undefined;
    robot_id?: number | undefined;

    static validator(body: KONSTRUKTORZY = {konstruktor_id: undefined, uzytkownik_id: undefined, robot_id: undefined}): void  {
        if ((typeof body.konstruktor_id !== "number" || body.konstruktor_id.toString().length > 8 || isNaN(body.konstruktor_id)) && typeof body.konstruktor_id !== "undefined") {
            throw new Error('KONSTRUKTORZY.konstruktor_id is not valid');
        }
        if ((typeof body.uzytkownik_id !== "number" || body.uzytkownik_id.toString().length > 6 || isNaN(body.uzytkownik_id)) && typeof body.uzytkownik_id !== "undefined") {
            throw new Error('KONSTRUKTORZY.uzytkownik_id is not valid');
        }
        if ((typeof body.robot_id !== "number" || body.robot_id.toString().length > 6 || isNaN(body.robot_id)) && typeof body.robot_id !== "undefined") {
            throw new Error('KONSTRUKTORZY.robot_id is not valid');
        }
    }
}