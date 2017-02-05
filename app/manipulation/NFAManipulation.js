import AutomatonManipulation from './AutomatonManipulation'

export default class NFAManipulation extends AutomatonManipulation {
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
}