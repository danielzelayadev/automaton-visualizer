import NFAManipulation from './NFAManipulation'
import PDA from '../automata/pda'

export default class PDAManipulation extends NFAManipulation {
    constructor(automaton, data) {
        super(automaton, data)

        $('.opt').hide()
    }
}