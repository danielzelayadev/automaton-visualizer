import Automata, { State, Transition } from './automata'
import { UnknownCharError, UnknownStateError, DeterminismError } from '../errors'

export default class DFA extends Automata {
	constructor(name, alphabet) { super(name, alphabet) }
	addState (name, isFinal) {
		this.states.push(new State(name, isFinal))
	}
	setInitialState(name) {
		this.states = this.states.map(e => {
			if (e.name === name)
				e.isInitial = true
			else if (e.isInitial)
				e.isInitial = false
			return e
		})
	}
	setFinal (stateName, isFinal) {
		this.states.map(e => {
			if (e.name === stateName)
				e.isFinal = isFinal
			return e
		})
	}
	addTransition (from, a, to) {
		const fs = this.states.filter(e => e.name === from)[0]
		const ts = this.states.filter(e => e.name === to)[0]

		if (!fs)
			throw new UnknownStateError(from)
		if (!ts)
			throw new UnknownStateError(to)
		if (!this.alphabet.filter(e => e === a).length)
			throw new UnknownCharError(a)
		if (!this.transitionIsDeterministic(fs, a))
			throw new DeterminismError(from, a)

		this.states = this.states.map(e => {
			if (e.name === from)
				e.transitions.push(new Transition(from, a, to))
			return e
		})
	}
	removeTransition (from, a) {
		this.states = this.states.map(e => {
			if (e.name === from)
				e.transitions = e.transitions.filter(t => t.a !== a)
			return e
		})
	}
	editTransition (from, to, a) {
		this.states = this.states.map(e => {
			if (e.name === from)
				e.transitions = e.transitions.map(t => {
					if (t.a === a)
						t.to = to
					return t
				})
			return e
		})
	}
	transitionIsDeterministic(from, a) {
		return !from.transitions.filter(e => e.a === a)[0]
	}
	getState (name) {
		return this.states.filter(e => e.name === name)[0]
	}
	editState (_name, { name, isFinal }) {
		this.states = this.states.map(e => {
			if (e.name === _name) {
				e.name    = name
				e.isFinal = isFinal
			}

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
	run (w) {
		let currState = this.states.filter(e => e.isInitial)[0]

		if (!currState)
			throw "No initial state has been set."

		for (let a of w) {
			const t = currState.transitions.filter(e => e.a === a)[0]

			if (!t)
				return false

			currState = this.states.filter(e => e.name === t.to)[0]
		}

		return currState.isFinal
	}
}