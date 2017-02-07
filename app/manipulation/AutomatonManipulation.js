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

        this.buildFromAutomaton(automaton)
    }
    addNode(nodeData, cb) {
        this.modal.loadForm(stateFormUrl, { name: 'stateForm', 
        vals: { stateName: '', makeInitial: false, isFinal: false } },
        data => {
            try {
                this.addnode(nodeData.id, data.stateName, 
                             data.makeInitial, data.isFinal)
                cb(nodeData)
            } catch (e) {
                alert(e.message)
                cb(null)
            } finally {
                console.log(this.automaton)
            }
        })
    }
    addnode(id, stateName, makeInitial, isFinal) {
        this.automaton.addState(stateName, isFinal)

        if (makeInitial) 
            this.automaton.setInitialState(stateName)

        this.updateStateNode(id, stateName, makeInitial, isFinal)
    }
    editNode(nodeData, cb) {
        const state = nodeData.label
        this.modal.loadForm(stateFormUrl, { name: 'stateForm', 
        vals: { stateName: state, makeInitial: this.automaton.stateIsInitial(state), 
                isFinal: this.automaton.stateIsFinal(state) }  }, 
        data => {
            try {
                cb(this.editnode(nodeData.id, state, data.stateName, 
                                 data.makeInitial, data.isFinal))
            } catch (e) {
                alert(e.message)
                cb(null)
            } finally {
                console.log(this.automaton)
            }
        }, () => { cb(null) })
    }
    editnode(id, oldName, newName, makeInitial, isFinal) {
        this.automaton.editState(oldName, newName)

        const wasFinal = this.automaton.stateIsFinal(newName)

        if (!isFinal && wasFinal)
            this.automaton.removeFinal(newName)
        else if (isFinal && !wasFinal)
            this.automaton.addFinal(newName)

        if (makeInitial)
            this.automaton.setInitialState(newName)
        else if (this.automaton.stateIsInitial(newName))
            this.automaton.clearInitialState()

        return this.updateStateNode(id, newName, makeInitial, isFinal)
    }
    deleteNode(nodeData, cb) {
        if (confirm('Are you sure you want to delete this state?')) {
            const node = this.nodes.get(nodeData.nodes[0])

            if (this.automaton.stateIsInitial(node.label))
                this.initId = null

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
    updateStateNode(id, name, makeInitial, isFinal) {
        const nodeData = { id, label: name, shape: defaultShape }

        if (makeInitial) {
            if (this.initId)
                this.nodes.update({ id: this.initId, shape: defaultShape })

            this.initId = id
            nodeData.shape = initShape
        }

        nodeData.color = isFinal ? finalColor : defaultColor

        this.nodes.update(nodeData)
        return nodeData
    }
    clear() {
        this.automaton = null
        this.clearUI()
    }
    clearUI() {
        this.initId = null
        this.nodes.clear()
        this.edges.clear()
    }
    // TODO: Modificar Alphabet Table
    removeFromAlphabet(a) {
        this.automaton.removeFromAlphabet(a)
        this.removeAllEdgesWithChar(a)
    }
    removeAllTransitionsWithChar(a) {
        this.automaton.removeAllTransitionsWithChar(a)
        this.removeAllEdgesWithChar(a)
    }
    removeAllEdgesWithChar(a) {
        const edges = this.edges.get({ filter: e => e.label === a })

        for (const edge of edges)
            this.edges.remove(edge.id)
    }
    // TODO: Update Alphabet Table
    buildFromAutomaton(automaton) {
        if (!automaton) return
        
        this.clearUI()

        for (const state of automaton.states) {
            const id = this.nodes.add({ label: state.name })[0]
            this.updateStateNode(id, state.name, automaton.stateIsInitial(state.name),
                                 automaton.stateIsFinal(state.name))
        }
        for (const state of automaton.states)
            for (const t of state.transitions) {
                const from = this.nodes.get({ filter: n => n.label === t.from })[0].id
                const to   = this.nodes.get({ filter: n => n.label === t.to })[0].id
                this.edges.add({ from, label: t.a, to })
            }
        
        this.automaton.setFromAutomaton(automaton)
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