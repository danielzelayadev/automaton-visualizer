import Automaton, { State, Transition } from './automaton'
import DFA from './dfa'
import { UnknownCharError, UnknownStateError, 
	     DeterminismError, NoInitialStateError,
		 DuplicateStateError, DuplicateTransitionError } from '../errors'

export default class NFA extends Automaton {
	addTransition (from, a, to) {
		const fs = this.getState(from)
		const ts = this.getState(to)

		if (!fs)
			throw new UnknownStateError(from)
		if (!ts)
			throw new UnknownStateError(to)
		if (!this.charInAlphabet(a))
			throw new UnknownCharError(a)
        if (this.stateHasTransition(from, a, to))
            throw new DuplicateTransitionError({ from, a, to })

		this.states = this.states.map(e => {
			if (e.name === from)
				e.transitions = [ ...e.transitions, new Transition(from, a, to) ]
			return e
		})
	}
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
	stateHasTransition(from, a, to) {
		return this.getState(from).transitions.filter(t => t.a === a && t.to === to)[0]
	}
	run (w) {
		if (!this.initialState)
			throw new NoInitialStateError()

		let currStates = [ this.getState(this.initialState) ]

		for (let a of w) {
			const transitions = currStates.reduce((accum, curr) => {
                return [ ...accum, ...curr.transitions.filter(t => t.a === a) ]
            }, [])

			if (transitions.length === 0)
				return false

			currStates = transitions.map(t => this.getState(t.to))
		}

		return this.hasFinalState(currStates)
	}
	toDFA() {
		if (!this.initialState)
			throw new NoInitialStateError()

		const dfa = new DFA(this.alphabet)

		let currStates = [ this.getState(this.initialState) ]

		const stateName = this.joinStateNames(currStates)

		dfa.addState(stateName, this.stateIsFinal(this.initialState))
		dfa.setInitialState(stateName)

		return this.todfa(dfa, currStates)
	}
	todfa(dfa, currStates) {
		for (const a of this.alphabet) {
			const transitions = currStates.reduce((accum, curr) => {
				return [ ...accum, ...curr.transitions.filter(t => t.a === a) ]
			}, [])

			if (!transitions.length) continue

			const toStates = transitions.map(t => this.getState(t.to))

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
		return states.reduce((accum, curr) => `${accum}${accum.length ? ',' : ''}${curr.name}`, "")
	}
	hasFinalState(states) {
		return states.reduce((accum, curr) => accum ? true : 
            this.stateIsFinal(curr.name), false)
	}
}