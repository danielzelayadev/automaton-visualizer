import Modal from '../core/modal'
import DFA from '../automata/dfa'
import { runAutomaton } from '../utils'
import { defaultShape, defaultColor, finalColor, initShape,
         stateFormUrl } from '../constants'

export default (alphabet, { nodes, edges }) => {
    const modal = new Modal('.modal')
    const dfa = new DFA(alphabet)
    let initId

    $('#run-btn').click(e => runAutomaton(dfa))

    return {
        addNode: (nodeData, cb) => {
            modal.loadForm(stateFormUrl, 
            { name: 'stateForm', vals: { stateName: '', makeInitial: false, isFinal: false } },
            ({ stateName, isFinal, makeInitial }) => {
                try {
                    dfa.addState(stateName, isFinal)
                    nodeData.shape = defaultShape

                    if (makeInitial) {
                        if (initId)
                            nodes.update({ id: initId, shape: defaultShape })
                        initId = nodeData.id
                        nodeData.shape = initShape
                        dfa.setInitialState(stateName)
                    }
                    if (isFinal)
                        nodeData.color = finalColor

                    nodeData.label = stateName
                    cb(nodeData)
                } catch (e) {
                    alert(e.message)
                    cb(null)
                } finally {
                    console.log(dfa)
                }
            })
        },
        editNode: (nodeData, cb) => {
            const state = nodeData.label

            modal.loadForm(stateFormUrl,
            { name: 'stateForm', vals: { stateName: state, 
              makeInitial: dfa.stateIsInitial(state), isFinal: dfa.stateIsFinal(state) } 
            }, ({ stateName, makeInitial, isFinal }) => {
                try {
                    dfa.editState(nodeData.label, stateName)
                    nodeData.shape = defaultShape

                    const wasFinal = dfa.stateIsFinal(stateName)

                    if (wasFinal && !isFinal)
                        dfa.removeFinal(stateName)
                    else if (!wasFinal && isFinal)
                        dfa.addFinal(stateName)

                    if (makeInitial) {
                        if (initId)
                            nodes.update({ id: initId, shape: defaultShape })
                        initId = nodeData.id
                        nodeData.shape = initShape
                        dfa.setInitialState(stateName)
                    }

                    nodeData.label = stateName
                    nodeData.color = isFinal ? finalColor : defaultColor
                    cb(nodeData)
                } catch (e) {
                    alert(e.message)
                    cb(null)
                } finally {
                    console.log(dfa)
                }
            }, () => {cb(null)})
        },
        deleteNode: (nodeData, cb) => {
            if (confirm('Are you sure you want to delete this state?')) {
                const node = nodes.get(nodeData.nodes[0])
                dfa.removeState(node.label)
                cb(nodeData)
            } else
                cb(null)
            console.log(dfa)
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

                dfa.addTransition(from, a, to)
                nodeData.label = a
                cb(nodeData)
            } catch (e) {
                alert(e.message)
            }
            console.log(dfa.states)
        },
        editEdge: (nodeData, cb) => {
            const from = nodes.get(nodeData.from).label
            const to   = nodes.get(nodeData.to).label
            const original = edges.get(nodeData.id)
            const o_from = nodes.get(original.from).label
            try {
                dfa.editTransition(o_from, nodeData.label, { from, to })
                cb(nodeData)
            } catch (e) {
                alert(e.message)
                cb(null)
            }
            console.log(dfa.states)
        },
        deleteEdge: (nodeData, cb) => {
            if (confirm('Are you sure you want to delete this edge?')) {
                const edge = edges.get(nodeData.edges[0])
                const from = nodes.get(edge.from).label
                dfa.removeTransition(from, edge.label)
                cb(nodeData)
            } else
                cb(null)
            console.log(dfa.states)
        }
    }

}