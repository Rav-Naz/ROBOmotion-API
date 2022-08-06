
var timeConstraintsList: Array<TimeConstraint> = [];
export default {
    addToTimeConstraints(timeConstraint: TimeConstraint) {
        timeConstraintsList.push(timeConstraint);
    },
    getTimeConstraint(nazwa: String) : TimeConstraint | undefined {
        return timeConstraintsList.find((timeC) => timeC.nazwa == nazwa);
    }
}

export interface TimeConstraint {
    nazwa: String,
    data_rozpoczecia: Date,
    data_zakonczenia: Date
}