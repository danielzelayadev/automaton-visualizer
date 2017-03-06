import AutomatonManipulation from './AutomatonManipulation'
import PDA from '../automata/pda'

export default class PDAManipulation extends AutomatonManipulation {
    constructor(automaton, data) {
        super(automaton, data)

        $('.opt').hide()
    }
    editEdge(nodeData, cb) {}
    deleteEdge(nodeData, cb) {}
}