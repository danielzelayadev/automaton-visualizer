import AutomatonManipulation from './AutomatonManipulation'
import DFA from '../automata/dfa'

export default class DFAManipulation extends AutomatonManipulation {
    constructor(automaton, data) {
        super(automaton, data)

        $('.opt.dfa').show()
    }
    editEdge(nodeData, cb) {
        const from     = this.nodes.get(nodeData.from).label
        const to       = this.nodes.get(nodeData.to).label
        const original = this.edges.get(nodeData.id)
        const o_from   = this.nodes.get(original.from).label
        try {
            this.automaton.editTransition(o_from, nodeData.label, { from, to })
            cb(nodeData)
        } catch (e) {
            alert(e.message)
            cb(null)
        }
        console.log(this.automaton.states)
    }
    deleteEdge(nodeData, cb) {
        if (confirm('Are you sure you want to delete this edge?')) {
            const edge = this.edges.get(nodeData.edges[0])
            const from = this.nodes.get(edge.from).label
            this.automaton.removeTransition(from, edge.label)
            cb(nodeData)
        } else
            cb(null)
        console.log(this.automaton.states)
    }
    cloneAutomaton(aut) {
        const a = new DFA([])
        a.setFromAutomaton(aut)
        return a
    }
}