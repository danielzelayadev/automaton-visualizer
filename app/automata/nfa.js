import Automaton from './automaton'
import DFA from './dfa'
import { UnknownCharError, UnknownStateError, 
	     DeterminismError, NoInitialStateError,
		 DuplicateStateError, DuplicateTransitionError } from '../errors'

export default class NFA extends Automaton {
	removeTransition (from, a, to) {
		this.states = this.states.map(e => {
			if (e.name === from)
				e.transitions = e.transitions.filter(t => !(t.a === a && t.to === to))
			return e
		})
	}
	editTransition (_from, a, _to, { from, to }) {
		this.states = this.states.map(e => {
			if (e.name === _from)
				if (e.name !== from)
					e.transitions = e.transitions.filter(t => !(t.a === a && t.to === _to))
				else
					e.transitions = e.transitions.map(t => { 
						if (t.a === a && t.to === _to) {
							if (this.stateHasTransition(from, a, to))
								throw new DuplicateTransitionError({ from, a, to })
							t.to = to 
						}
						return t
					})
			else if (e.name === from)
				this.addTransition(e.name, a, to)	
			return e
		})
	}
	extraTransitionValidations(from, a, to) {
        if (this.stateHasTransition(from, a, to))
            throw new DuplicateTransitionError({ from, a, to })
	}
	stateHasTransition(from, a, to) {
		return this.getState(from).transitions.filter(t => t.a === a && t.to === to)[0]
	}
	run (w) {
		if (!this.initialState)
			throw new NoInitialStateError()

		let currStates = this.getRunStartStates()
		
		for (let a of w) {
			const transitions = this.getTransitionsFor(currStates, a)

			if (!transitions.length)
				return false

			currStates = transitions.map(t => this.getState(t.to))
		}

		return this.hasFinalState(currStates)
	}
	getConversionStartStates() {
		return [ this.getState(this.initialState) ]
    }
	getRunStartStates() {
		return [ this.getState(this.initialState) ]
	}
	getTransitionsFor(states, a) {
		return states.reduce((accum, curr) => 
		[ ...accum, ...curr.transitions.filter(t => t.a === a) ], [])
	}
	toDFA() {
		if (!this.initialState)
			throw new NoInitialStateError()

		const dfa = new DFA(this.alphabet)

		let currStates = this.getConversionStartStates()

		const stateName = this.joinStateNames(currStates)

		dfa.addState(stateName, this.hasFinalState(currStates))
		dfa.setInitialState(stateName)

		return this.todfa(dfa, currStates)
	}
	todfa(dfa, currStates) {
		for (const a of this.alphabet) {
			const transitions = this.getTransitionsFor(currStates, a)

			if (!transitions.length) continue

			const toStates = [ ...new Set(transitions.map(t => this.getState(t.to))) ]

			const stateName = this.joinStateNames(toStates)

			if (!dfa.stateExists(stateName)) {
				dfa.addState(stateName, this.hasFinalState(toStates))
				dfa = this.todfa(dfa, toStates)
			}

			dfa.addTransition(this.joinStateNames(currStates), a, stateName)
		}

		return dfa
	}
	joinStateNames(states) {
		const stateNames = states.map(s => s.name)
		return stateNames.sort().reduce((accum, curr) => `${accum}${accum.length ? ',' : ''}${curr}`, "")
	}
	hasFinalState(states) {
		return states.reduce((accum, curr) => accum ? true : 
            this.stateIsFinal(curr.name), false)
	}
	toRegex() {
		return this.toDFA().toRegex()
	}
	clone() {
		const a = new NFA([])
		a.setFromAutomaton(this)
		return a
	}
	minimize() {
		return this.toDFA().minimize()
	}
}