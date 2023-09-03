export class KOMUNIKATY {

    komunikat_id?: number | undefined;
    tresc?: string | undefined;
    link?: string | undefined;
    waga?: number | undefined;

    static validator(body: KOMUNIKATY = { komunikat_id: undefined, tresc: undefined, link: undefined, waga: undefined }): void {
        if ((typeof body.komunikat_id !== "number" || body.komunikat_id.toString().length > 3 || isNaN(body.komunikat_id)) && typeof body.komunikat_id !== "undefined") {
            throw new Error('KOMUNIKATY.komunikat_id is not valid');
        }
        if ((typeof body.tresc !== "string" || body.tresc.toString().length > 4095) && typeof body.tresc !== "undefined") {
            throw new Error('KOMUNIKATY.tresc is not valid');
        }
        if ((typeof body.link !== "string" || body.link.toString().length > 2047) && typeof body.link !== "undefined") {
            throw new Error('KOMUNIKATY.link is not valid');
        }
        if ((typeof body.waga !== "number" || body.waga.toString().length > 1) && typeof body.waga !== "undefined") {
            throw new Error('KOMUNIKATY.waga is not valid');
        }
    }
}