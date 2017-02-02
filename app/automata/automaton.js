import { UnknownStateError, DuplicateStateError } from '../errors'

export default class Automaton {
	states = []
	alphabet = []
	initialState = null
	finalStates = []
	constructor(alphabet = []) {
		this.alphabet = alphabet
	}
	setInitialState(name) {
		if (!this.stateExists(name))
			throw new UnknownStateError(name)
		this.initialState = name
	}
	addState (name, isFinal) {
		if (this.stateExists(name)) throw new DuplicateStateError(name)

		this.states = [ ...this.states, new State(name) ]

		if (isFinal)
			this.finalStates = [ ...this.finalStates, name ]
	}
	editState (oldName, newName) {
		if (oldName !== newName && this.stateExists(newName)) 
			throw new DuplicateStateError(newName)
		
		this.states = this.states.map(e => {
			if (e.name === oldName)
				e.name = newName
			return e
		})
	}
	removeState (name) {
		this.states = this.states.filter(e => e.name !== name)
		this.states = this.states.map(e => {
			e.transitions = e.transitions.filter(t => t.from !== name && t.to !== name)
			return e
		})
	}
	getState (name) {
		return this.states.filter(e => e.name === name)[0]
	}
	addFinal (name) {
		if (!this.stateExists(name))
			throw new UnknownStateError(name)
		this.finalStates = [ ...this.finalStates, name ]
	}
	removeFinal (name) {
		this.finalStates = this.finalStates.filter(e => e.name !== name)
	}
	stateIsFinal (name) {
		return this.finalStates.filter(s => s === name)[0]
	}
	stateExists (name) {
		return this.states.filter(s => s.name === name)[0]
	}
	charInAlphabet (a) {
		return this.alphabet.filter(e => e === a)[0]
	}
}

export class State {
	transitions = []
	constructor (name) {
		this.name = name
	}
}

export class Transition {
	constructor (from, a, to) {
		this.from = from
		this.a = a
		this.to = to
	}
}