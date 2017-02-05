import Modal from '../core/modal'
import NFA from '../automata/nfa'
import { runAutomaton } from '../utils'
import { defaultShape, defaultColor, finalColor, initShape,
         stateFormUrl } from '../constants'

export default (alphabet, { nodes, edges }) => {
    const modal = new Modal('.modal')
    const nfa = new NFA(alphabet)
    let initId

    $('#run-btn').click(e => runAutomaton(nfa))

    return {
        addNode: (nodeData, cb) => {
            modal.loadForm(stateFormUrl, 
            { name: 'stateForm', vals: { stateName: '', makeInitial: false, isFinal: false } },
            ({ stateName, isFinal, makeInitial }) => {
                try {
                    nfa.addState(stateName, isFinal)
                    nodeData.shape = defaultShape

                    if (makeInitial) {
                        if (initId)
                            nodes.update({ id: initId, shape: defaultShape })
                        initId = nodeData.id
                        nodeData.shape = initShape
                        nfa.setInitialState(stateName)
                    }
                    if (isFinal)
                        nodeData.color = finalColor

                    nodeData.label = stateName
                    cb(nodeData)
                } catch (e) {
                    alert(e.message)
                    cb(null)
                } finally {
                    console.log(nfa)
                }
            })
        },
        editNode: (nodeData, cb) => {
            const state = nodeData.label

            modal.loadForm(stateFormUrl,
            { name: 'stateForm', vals: { stateName: state, 
              makeInitial: nfa.stateIsInitial(state), isFinal: nfa.stateIsFinal(state) } 
            }, ({ stateName, makeInitial, isFinal }) => {
                try {
                    nfa.editState(nodeData.label, stateName)
                    nodeData.shape = defaultShape

                    const wasFinal = nfa.stateIsFinal(stateName)

                    if (wasFinal && !isFinal)
                        nfa.removeFinal(stateName)
                    else if (!wasFinal && isFinal)
                        nfa.addFinal(stateName)

                    if (makeInitial) {
                        if (initId)
                            nodes.update({ id: initId, shape: defaultShape })
                        initId = nodeData.id
                        nodeData.shape = initShape
                        nfa.setInitialState(stateName)
                    }

                    nodeData.label = stateName
                    nodeData.color = isFinal ? finalColor : defaultColor
                    cb(nodeData)
                } catch (e) {
                    alert(e.message)
                    cb(null)
                } finally {
                    console.log(nfa)
                }
            }, () => {cb(null)})
        },
        deleteNode: (nodeData, cb) => {
            if (confirm('Are you sure you want to delete this state?')) {
                const node = nodes.get(nodeData.nodes[0])
                nfa.removeState(node.label)
                cb(nodeData)
            } else
                cb(null)
            console.log(nfa)
        },
        addEdge: (nodeData, cb) => {
            try {
                const from = nodes.get(nodeData.from).label
                const to   = nodes.get(nodeData.to).label
                const a    = prompt('Enter transition input', "")

                if (!a) {
                    cb(null)
                    return
                }

                nfa.addTransition(from, a, to)
                nodeData.label = a
                cb(nodeData)
            } catch (e) {
                alert(e.message)
            }
            console.log(nfa.states)
        },
        editEdge: (nodeData, cb) => {
            const from = nodes.get(nodeData.from).label
            const to   = nodes.get(nodeData.to).label
            const original = edges.get(nodeData.id)
            const o_from = nodes.get(original.from).label
            const o_to   = nodes.get(original.to).label
            try {
                nfa.editTransition(o_from, nodeData.label, o_to, { from, to })
                cb(nodeData)
            } catch (e) {
                alert(e.message)
                cb(null)
            }
            console.log(nfa.states)
        },
        deleteEdge: (nodeData, cb) => {
            if (confirm('Are you sure you want to delete this edge?')) {
                const edge = edges.get(nodeData.edges[0])
                const from = nodes.get(edge.from).label
                const to   = nodes.get(edge.to).label
                nfa.removeTransition(from, edge.label, to)
                cb(nodeData)
            } else
                cb(null)
            console.log(nfa.states)
        }
    }

}