import $ from 'jquery'
import DFA from './automata/dfa'

const modal = $('#mdl')
const dfa = new DFA('Hell Yeah', ['0','1'])

export default function ({ nodes, edges }) {
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
                    $('#modal-accept').click(e => {
                        try {
                            const stateName   = $('#state-name').val()
                            const isFinal     = $('#is-final').is(":checked")
                            const makeInitial = $('#make-initial').is(":checked")

                            dfa.addState(stateName, isFinal)

                            if (makeInitial)
                                dfa.setInitialState(stateName)

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
                    $('#modal-accept').click(e => {
                        try {
                            const name        = snTb.val()
                            const isFinal     = finalCb.is(":checked")
                            const makeInitial = initCb.is(":checked")

                            dfa.editState(nodeData.label, { name, isFinal })

                            if (makeInitial)
                                dfa.setInitialState(name)

                            nodeData.label = name
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
                cb(nodeData)
            },
            addEdge: (nodeData, cb) => {
                try {
                    const from = nodes.get(nodeData.from).label
                    const to   = nodes.get(nodeData.to).label
                    const a    = prompt('Enter transition input', "")
                    dfa.addTransition(from, a, to)
                    nodeData.label = a
                    cb(nodeData)
                } catch (e) {
                    alert(e.message)
                }
            },
            editEdge: (nodeData, cb) => {
                cb(nodeData)
            },
            deleteEdge: (nodeData, cb) => {
                cb(nodeData)
            }
        }
    }
}