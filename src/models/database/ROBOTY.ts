export class ROBOTY{

    robot_id?: number | undefined;
    robot_uuid?: string | undefined;
    nazwa?: string | undefined;
    czy_dotarl?: number | undefined;
    link_do_dokumentacji?: string | undefined;
    link_do_filmiku?: string | undefined;

    static validator(body: ROBOTY = {robot_id: undefined, robot_uuid: undefined, nazwa: undefined, czy_dotarl: undefined}): void  {
        if ((typeof body.robot_id !== "number" || body.robot_id.toString().length > 6 || isNaN(body.robot_id)) && typeof body.robot_id !== "undefined") {
            throw new Error('ROBOTY.robot_id is not valid');
        }
        if ((typeof body.robot_uuid !== "string" || body.robot_uuid.length != 36) && typeof body.robot_uuid !== "undefined") {
            throw new Error('ROBOTY.robot_uuid is not valid');
        }
        if ((typeof body.nazwa !== "string" || body.nazwa.length > 40 || body.nazwa.length < 2) && typeof body.nazwa !== "undefined") {
            throw new Error('ROBOTY.nazwa is not valid');
        }
        if ((typeof body.czy_dotarl !== "number" || body.czy_dotarl.toString().length > 1 || isNaN(body.czy_dotarl)) && typeof body.czy_dotarl !== "undefined") {
            throw new Error('ROBOTY.czy_dotarl is not valid');
        }
        if ((typeof body.link_do_dokumentacji !== "string" || body.link_do_dokumentacji.length > 250 || body.link_do_dokumentacji.length < 1) && typeof body.link_do_dokumentacji !== "undefined") {
            throw new Error('ROBOTY.link_do_dokumentacji is not valid');
        }
        if ((typeof body.link_do_filmiku !== "string" || body.link_do_filmiku.length > 500 || body.link_do_filmiku.length < 1) && typeof body.link_do_filmiku !== "undefined") {
            throw new Error('ROBOTY.link_do_filmiku is not valid');
        }
    }
}