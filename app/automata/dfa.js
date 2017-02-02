import Automaton, { State, Transition } from './automaton'
import { UnknownCharError, UnknownStateError, 
	     DeterminismError, NoInitialStateError,
		 DuplicateStateError } from '../errors'

export default class DFA extends Automaton {
	addTransition (from, a, to) {
		const fs = this.getState(from)
		const ts = this.getState(to)

		if (!fs)
			throw new UnknownStateError(from)
		if (!ts)
			throw new UnknownStateError(to)
		if (!this.charInAlphabet(a))
			throw new UnknownCharError(a)
		if (!this.transitionIsDeterministic(fs, a))
			throw new DeterminismError(from, a)

		this.states = this.states.map(e => {
			if (e.name === from)
				e.transitions = [ ...e.transitions, new Transition(from, a, to) ]
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
	editTransition (_from, a, { from, to }) {
		this.states = this.states.map(e => {
			if (e.name === _from)
				if (e.name !== from)
					e.transitions = e.transitions.filter(t => t.a !== a)
				else
					e.transitions = e.transitions.map(t => { 
						if (t.a === a) 
							t.to = to 
						return t
					})
			else if (e.name === from)
				this.addTransition(e.name, a, to)	
			return e
		})
	}
	transitionIsDeterministic(from, a) {
		return !from.transitions.filter(e => e.a === a)[0]
	}
	run (w) {
		if (!this.initialState)
			throw new NoInitialStateError()

		let currState = this.getState(this.initialState)

		for (let a of w) {
			const t = currState.transitions.filter(e => e.a === a)[0]

			if (!t)
				return false

			currState = this.states.filter(e => e.name === t.to)[0]
		}

		return this.stateIsFinal(currState.name)
	}
}