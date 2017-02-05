import Modal from '../core/modal'
import { defaultShape, defaultColor, finalColor, initShape,
         stateFormUrl } from '../constants'

export default class AutomatonManipulation {
    modal = new Modal('.modal')
    initId = null
    constructor(automaton = null, { nodes, edges }) {
        this.automaton = automaton
        this.nodes = nodes
        this.edges = edges
        $('#run-btn').off('click')
        $('#run-btn').click(e => this.runAutomaton())
    }
    addNode(nodeData, cb) {
        this.modal.loadForm(stateFormUrl, 
        { name: 'stateForm', vals: { stateName: '', makeInitial: false, isFinal: false } },
        ({ stateName, isFinal, makeInitial }) => {
            try {
                this.automaton.addState(stateName, isFinal)
                nodeData.shape = defaultShape

                if (makeInitial) {
                    if (this.initId)
                        this.nodes.update({ id: this.initId, shape: defaultShape })
                    this.initId = nodeData.id
                    nodeData.shape = initShape
                    this.automaton.setInitialState(stateName)
                }
                if (isFinal)
                    nodeData.color = finalColor

                nodeData.label = stateName
                cb(nodeData)
            } catch (e) {
                alert(e.message)
                cb(null)
            } finally {
                console.log(this.automaton)
            }
        })
    }
    editNode(nodeData, cb) {
        const state = nodeData.label

        this.modal.loadForm(stateFormUrl,
        { name: 'stateForm', vals: { stateName: state, 
            makeInitial: this.automaton.stateIsInitial(state), isFinal: this.automaton.stateIsFinal(state) } 
        }, ({ stateName, makeInitial, isFinal }) => {
            try {
                this.automaton.editState(nodeData.label, stateName)
                nodeData.shape = defaultShape

                const wasFinal = this.automaton.stateIsFinal(stateName)

                if (!isFinal && wasFinal)
                    this.automaton.removeFinal(stateName)
                else if (isFinal && !wasFinal)
                    this.automaton.addFinal(stateName)

                if (makeInitial) {
                    if (this.initId)
                        this.nodes.update({ id: this.initId, shape: defaultShape })
                    this.initId = nodeData.id
                    nodeData.shape = initShape
                    this.automaton.setInitialState(stateName)
                } else if (this.automaton.stateIsInitial(stateName))
                    this.automaton.clearInitialState()

                nodeData.label = stateName
                nodeData.color = isFinal ? finalColor : defaultColor
                cb(nodeData)
            } catch (e) {
                alert(e.message)
                cb(null)
            } finally {
                console.log(this.automaton)
            }
        }, () => {cb(null)})
    }
    deleteNode(nodeData, cb) {
        if (confirm('Are you sure you want to delete this state?')) {
            const node = this.nodes.get(nodeData.nodes[0])
            this.automaton.removeState(node.label)
            cb(nodeData)
        } else
            cb(null)
        console.log(this.automaton)
    }
    addEdge(nodeData, cb) {
        try {
            const from = this.nodes.get(nodeData.from).label
            const to   = this.nodes.get(nodeData.to).label
            const a    = prompt('Enter transition input', "")

            if (!a) {
                cb(null)
                return
            }

            this.automaton.addTransition(from, a, to)
            nodeData.label = a
            cb(nodeData)
        } catch (e) {
            alert(e.message)
        }
        console.log(this.automaton.states)
    }
    runAutomaton() {
        if (!this.automaton) return
        try {
            alert(this.automaton.run($('[name="testStr"]').val()) ? "Valid String!" : "Invalid String!")
        } catch (e) {
            alert(e.message)
        }
    }
}