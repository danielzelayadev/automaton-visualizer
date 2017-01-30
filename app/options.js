import $ from 'jquery'
import DFA from './automata/dfa'

const modal = $('#mdl')
let dfa, initId

const defaultShape = 'ellipse'
const initShape    = 'diamond'
const finalColor   = '#F44242'
const defaultColor = '#97C2FC'

$('#run-btn').click(e => {
    try {
        alert(dfa.run(prompt('Enter string to evaluate', '')) ? 'Valid String.' : 'Invalid String.')
    } catch (e) {
        alert(e.message)
    }
})

function getAlphabetFromInput (input) {
    return input.split('').filter((c, i, a) => i === a.indexOf(c))
}

function start(nodes, edges) {
    const alphabetInput = prompt('Please enter alphabet string', '')

    if (!alphabetInput)
        return

    initId = undefined
    nodes.clear()
    edges.clear()
    dfa = new DFA('Hell Yeah', getAlphabetFromInput(alphabetInput))
}

export default function ({ nodes, edges }) {
    $('#clear-btn').click(e => {
        initId = undefined
        nodes.clear()
        edges.clear()
        dfa.clear()
    })

    $('#reset-btn').click(e => start(nodes, edges))

    start(nodes, edges)

    return {
        edges: {
            arrows: {
                to:     { enabled: true,  scaleFactor: 1, type: 'arrow' },
                middle: { enabled: false, scaleFactor: 1, type: 'arrow' },
                from:   { enabled: false, scaleFactor: 1, type: 'arrow' }
            },
            font: {
                align: 'top'
            }
        },
        physics: {
            enabled: true
        },
        interaction: {
            hover: true
        },
        manipulation: {
            addNode: (nodeData, cb) => {
                modal.load('./app/modals/state.html', () => {
                    modal.modal('show')
                    $('form').keypress(e => { if (e.keyCode === 13) e.preventDefault() })
                    $('#modal-accept').click(e => {
                        try {
                            const stateName   = $('#state-name').val()
                            const isFinal     = $('#is-final').is(":checked")
                            const makeInitial = $('#make-initial').is(":checked")

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
                        } finally {
                            modal.modal('hide')
                            console.log(dfa)
                        }
                    })
                })
            },
            editNode: (nodeData, cb) => {
                modal.load('./app/modals/state.html', () => {
                    const snTb    = $('#state-name')
                    const finalCb = $('#is-final')
                    const initCb  = $('#make-initial')
                    const state   = dfa.getState(nodeData.label)

                    snTb.focus()

                    snTb.val(nodeData.label)
                    finalCb.attr('checked', state.isFinal)
                    initCb.attr('checked', state.isInitial)

                    modal.modal('show')
                    $('form').keypress(e => { if (e.keyCode === 13) e.preventDefault() })
                    $('#modal-accept').click(e => {
                        try {
                            const name        = snTb.val()
                            const isFinal     = finalCb.is(":checked")
                            const makeInitial = initCb.is(":checked")

                            dfa.editState(nodeData.label, { name, isFinal })
                            nodeData.shape = defaultShape
                            
                            if (makeInitial) {
                                if (initId)
                                    nodes.update({ id: initId, shape: defaultShape })
                                initId = nodeData.id
                                nodeData.shape = initShape
                                dfa.setInitialState(name)
                            } else if (state.isInitial)
                                dfa.setInitialState()

                            nodeData.label = name
                            nodeData.color = isFinal ? finalColor : defaultColor
                            cb(nodeData)
                        } catch (e) {
                            alert(e.message)
                        } finally {
                            modal.modal('hide')
                            console.log(dfa)
                        }
                    })
                    
                    modal.on('hide.bs.modal', e => cb(null))
                })
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
}