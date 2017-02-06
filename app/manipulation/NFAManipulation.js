import AutomatonManipulation from './AutomatonManipulation'
import NFA from '../automata/nfa'
import NFAe from '../automata/nfa-e'
import { epsilon } from '../constants'

export default class NFAManipulation extends AutomatonManipulation {
    constructor(automaton = null, data) {
        super(automaton, data)

        $('.opt.nfa').show()
        $('#convert-btn').off('click')
        $('#convert-btn').click(e => this.toDFA())
        $('#epsilon-toggle').change(this.onEpsilonToggleChange.bind(this))
    }
    editEdge(nodeData, cb) {
        const from     = this.nodes.get(nodeData.from).label
        const to       = this.nodes.get(nodeData.to).label
        const original = this.edges.get(nodeData.id)
        const o_from   = this.nodes.get(original.from).label
        const o_to     = this.nodes.get(original.to).label
        try {
            this.automaton.editTransition(o_from, nodeData.label, o_to, { from, to })
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
            const to   = this.nodes.get(edge.to).label
            this.automaton.removeTransition(from, edge.label, to)
            cb(nodeData)
        } else
            cb(null)
        console.log(this.automaton.states)
    }
    toDFA() {
        let dfa

        try {
            dfa = this.automaton.toDFA()
        } catch (e) {
            alert(e.message)
            return
        }

        this.clear()

        for (const state of dfa.states) {
            const id = this.nodes.add({ label: state.name })[0]
            this.updateStateNode(id, state.name, dfa.stateIsInitial(state.name),
                                 dfa.stateIsFinal(state.name))
        }
        for (const state of dfa.states)
            for (const t of state.transitions) {
                const from = this.nodes.get({ filter: n => n.label === t.from })[0].id
                const to   = this.nodes.get({ filter: n => n.label === t.to })[0].id
                this.edges.add({ from, label: t.a, to })
            }
        
        this.automaton = new NFA([])
        this.automaton.setFromAutomaton(dfa)
    }
    onEpsilonToggleChange(e) {
        const { checked } = e.target

        let newAutomaton = checked ?  new NFAe([]) : new NFA([])

        newAutomaton.setFromAutomaton(this.automaton)
        this.automaton = newAutomaton

        if (!checked)
            this.removeFromAlphabet(epsilon)
    }
}