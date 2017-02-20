import AutomatonManipulation from './AutomatonManipulation'
import NFA from '../automata/nfa'
import NFAe from '../automata/nfa-e'
import { epsilon } from '../constants'
import parser from '../core/regular-expression'

export default class NFAManipulation extends AutomatonManipulation {
    constructor(automaton = null, data) {
        super(automaton, data)

        $('.opt.nfa').show()
        $('#todfa-btn').off('click')
        $('#todfa-btn').click(e => this.toDFA())
        $('#tonfae-btn').off('click')
        $('#tonfae-btn').click(e => this.toNFAeClicked())
        $('#epsilon-toggle').change(this.onEpsilonToggleChange.bind(this))
        $('input[name="regexStr"]').keypress(e => { if (e.which === 13) $('#tonfae-btn').click() })
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

        this.buildFromAutomaton(dfa)
    }
    toNFAeClicked() {
        if (!$('#epsilon-toggle').is(':checked'))
            $('#epsilon-toggle').click()
        
        try {
            this.toNFAe()
        } catch (e) {
            $('#epsilon-toggle').click()
            alert(e.message)
        }
    }
    toNFAe() {
        const regex = $('input[name="regexStr"]').val()
        const tree = parser.parse(regex)
        this.automaton.buildFromExpressionTree(tree)
        this.buildFromAutomaton(this.automaton)
    }
    onEpsilonToggleChange(e) {
        const { checked } = e.target

        let newAutomaton = checked ?  new NFAe([]) : new NFA([])

        newAutomaton.setFromAutomaton(this.automaton)
        this.automaton = newAutomaton

        if (!checked)
            this.removeAllTransitionsWithChar(epsilon)
    }
}