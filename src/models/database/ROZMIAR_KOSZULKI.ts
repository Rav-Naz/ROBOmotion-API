export class ROZMIAR_KOSZULKI {

    ograniczenia_czasowe_id?: number | undefined;
    rozmiar?: string | undefined;

    static validator(body: ROZMIAR_KOSZULKI = {ograniczenia_czasowe_id: undefined, rozmiar: undefined}): void  {
        if ((typeof body.ograniczenia_czasowe_id !== "number" || body.ograniczenia_czasowe_id.toString().length > 5 || isNaN(body.ograniczenia_czasowe_id)) && typeof body.ograniczenia_czasowe_id !== "undefined") {
            throw new Error('ROZMIAR_KOSZULKI.ograniczenia_czasowe_id is not valid');
        }
        if ((typeof body.rozmiar !== "string" || body.rozmiar.toString().length > 10) && typeof body.rozmiar !== "undefined") {
            throw new Error('ROZMIAR_KOSZULKI.rozmiar is not valid');
        }
    }
}