import Automaton, { State, Transition } from './automaton'
import { UnknownCharError, UnknownStateError, 
	     DeterminismError, NoInitialStateError,
		 DuplicateStateError } from '../errors'

export default class DFA extends Automaton {
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
	extraTransitionValidations (from, a, to) {
		if (!this.transitionIsDeterministic(this.getState(from), a))
			throw new DeterminismError(from, a)
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