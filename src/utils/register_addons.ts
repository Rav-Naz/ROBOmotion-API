
var rozmiaryKoszulek: Array<string> = [];
var rodzajeJedzenia: Array<string> = [];
export default {
    addJedzenie(jedzenie: string) {
        rodzajeJedzenia.push(jedzenie);
    },
    addRozmiarKoszulki(rozmiar_koszulki: string) {
        rozmiaryKoszulek.push(rozmiar_koszulki);
    },
    getJedzenie() : Array<string> | undefined {
        return rodzajeJedzenia;
    },
    getRozmiaryKoszulek() : Array<string> | undefined {
        return rozmiaryKoszulek;
    },
}
