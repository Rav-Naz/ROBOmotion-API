export class ROBOTY{

    robot_id?: number | undefined;
    robot_uuid?: string | undefined;
    nazwa?: string | undefined;
    czy_dotarl?: number | undefined;

    static validator(body: ROBOTY = {robot_id: undefined, robot_uuid: undefined, nazwa: undefined, czy_dotarl: undefined}): void  {
        if ((typeof body.robot_id !== "number" || body.robot_id.toString().length > 6) && typeof body.robot_id !== "undefined") {
            throw new Error('ROBOTY.robot_id is not valid');
        }
        if ((typeof body.robot_uuid !== "string" || body.robot_uuid.length != 36) && typeof body.robot_uuid !== "undefined") {
            throw new Error('ROBOTY.robot_uuid is not valid');
        }
        if ((typeof body.nazwa !== "string" || body.nazwa.length > 40 || body.nazwa.length < 2) && typeof body.nazwa !== "undefined") {
            throw new Error('ROBOTY.nazwa is not valid');
        }
        if ((typeof body.czy_dotarl !== "number" || body.czy_dotarl.toString().length > 1) && typeof body.czy_dotarl !== "undefined") {
            throw new Error('ROBOTY.czy_dotarl is not valid');
        }
    }
}