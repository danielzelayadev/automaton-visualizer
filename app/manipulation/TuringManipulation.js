import DFAManipulation from './DFAManipulation'

export default class TuringManipulation extends DFAManipulation {
    constructor(automaton, data) {
        super(automaton, data)
        $('.opt').hide()
    }
}
