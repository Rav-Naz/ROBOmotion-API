
var ile_osob_na_wydarzeniu: number = 0;

export default {
    setIleOsobNaWydarzeniu(ile: number) : number {
        ile_osob_na_wydarzeniu = ile;
        return ile;
    },
    addOne() : number {
        ile_osob_na_wydarzeniu += 1;
        return ile_osob_na_wydarzeniu;
    },
    removeOne() : number {
        if (ile_osob_na_wydarzeniu > 0) ile_osob_na_wydarzeniu -= 1;
        return ile_osob_na_wydarzeniu;
    },
    getIleOsobNaWydarzeniu() : number {
        return ile_osob_na_wydarzeniu;
    },

}
