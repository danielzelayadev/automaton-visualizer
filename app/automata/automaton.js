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
	clear() {
		this.states = []
		this.alphabet = []
		this.initialState = null
		this.finalStates = []
	}
	clearInitialState() {
		this.initialState = null
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

		this.finalStates.map(s => {
			if (s === oldName)
				return newName
			return s
		})

		if (this.initialState === oldName)
			this.initialState = newName
	}
	removeState (name) {
		if (!this.stateExists(name))
			throw new UnknownStateError(name)

		this.states = this.states.filter(e => e.name !== name)
		
		this.states = this.states.map(e => {
			e.transitions = e.transitions.filter(t => t.from !== name && t.to !== name)
			return e
		})

		this.removeFinal(name)

		if (name === this.initialState) this.initialState = null
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
		this.finalStates = this.finalStates.filter(e => e !== name)
	}
	stateIsFinal (name) {
		return this.finalStates.filter(s => s === name).length > 0
	}
	stateIsInitial (name) {
		return this.initialState === name
	}
	stateExists (name) {
		return this.states.filter(s => s.name === name).length > 0
	}
	charInAlphabet (a) {
		return this.alphabet.filter(e => e === a).length > 0
	}
	addToAlphabet (a) {
		this.alphabet = [ ...this.alphabet, a ]
	}
	removeFromAlphabet (a) {
		this.alphabet = this.alphabet.filter(c => c !== a)
		this.removeAllTransitionsWithChar(a)
	}
	setFromAutomaton(a) {
		this.alphabet = [ ...a.alphabet ]
		this.states = this.getClonedStates(a.states)
        this.initialState = a.initialState
        this.finalStates = [...a.finalStates]
	}
	getClonedStates(states) {
		return states.map(s => {
			const newState = new State(s.name)
			newState.transitions = s.transitions
				.map(({ from, a, to }) => new Transition(from, a, to))
			return newState
		})
	}
	removeAllTransitionsWithChar(a) {
		for (const s of this.states)
			s.transitions = s.transitions.filter(t => t.a !== a)
	}
	getTransitionsTo(to) {
		let transitions = []

		for (const s of this.states)
			transitions = [ ...transitions, ...s.transitions.filter(t => t.to === to) ]

		return transitions
	}
	addTransition (from, a, to) {
		const fs = this.getState(from)
		const ts = this.getState(to)

		if (!fs)
			throw new UnknownStateError(from)
		if (!ts)
			throw new UnknownStateError(to)
		if (!this.charInAlphabet(a))
			throw new UnknownCharError(a)

		this.extraTransitionValidations(from, a, to)

		this.states = this.states.map(e => {
			if (e.name === from)
				e.transitions = [ ...e.transitions, new Transition(from, a, to) ]
			return e
		})
	}
	stateHasTransitionWithChar(state, a) {
		if (typeof state === String)
			state = this.getState(state)
		return state.transitions.filter(t => t.a === a).length > 0
	}
	editTransition(){}
	removeTransition(){}
	extraTransitionValidations(from, a, to){}
	run(){}
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