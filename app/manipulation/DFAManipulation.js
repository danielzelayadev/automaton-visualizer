import AutomatonManipulation from './AutomatonManipulation'

export default class DFAManipulation extends AutomatonManipulation {
    constructor(automaton, data) {
        super(automaton, data)

        $('.opt.dfa').show()
		$('#toregex-btn').off('click')
        $('#toregex-btn').click(e => this.toRegex())
        $('#regex-result').text('---')
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
    toRegex() {
        try {
            $('#regex-result').text(this.automaton.toRegex())
        } catch (e) {
            alert(e.message)
        }
    }
}