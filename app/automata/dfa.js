import Automaton, { Transition } from './automaton'
import { UnknownCharError, UnknownStateError, 
	     DeterminismError, NoInitialStateError,
		 DuplicateStateError, NoFinalStatesError } from '../errors'
import { pipeTransitions, recursiveTransitionsFirst } from './utils'
import { epsilon } from '../constants'

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
	toRegex() {
		if (!this.initialState)
			throw new NoInitialStateError()
		if (!this.finalStates.length)
			throw new NoFinalStatesError()

		const clone = new DFA([])
		clone.setFromAutomaton(this)
		clone.charInAlphabet = c => true
		clone.extraTransitionValidations = () => {}

		const uniqueStateId = new Date().getTime()

		const transitionsToInitial = clone.getTransitionsTo(clone.initialState)

		if (transitionsToInitial.length > 0) {
			const newInitStateName = 'q0' + uniqueStateId
			clone.addState(newInitStateName, false)
			clone.addTransition(newInitStateName, epsilon, clone.initialState)
			clone.setInitialState(newInitStateName)
		}

		if (clone.finalStates.length > 1 ||
		    (clone.finalStates.length === 1 &&
			clone.getState(clone.finalStates[0]).transitions.length > 0)) {

			const newFinalStateName = 'fs' + uniqueStateId
			clone.addState(newFinalStateName, false)

			for (const fs of clone.finalStates) {
				clone.addTransition(fs, epsilon, newFinalStateName)
				clone.removeFinal(fs)
			}

			clone.addFinal(newFinalStateName)
		}

		const normalStates = clone.states
			.filter(({name}) => 
				(!clone.stateIsInitial(name) && !clone.stateIsFinal(name)))

		// let i = 1

		for (const ns of normalStates) {
			const transitionsToNs   = clone.getTransitionsTo(ns.name).filter(t => t.from !== ns.name)
			const transitionsFromNs = pipeTransitions(ns.transitions).sort(recursiveTransitionsFirst)

			// console.log(`${i}`)

			for (const transTo of transitionsToNs) {
				const newTrans = new Transition(transTo.from, transTo.a, '')

				if (newTrans.a === epsilon) newTrans.a = ''

				for (const transFrom of transitionsFromNs) {
					const isRecursive = transFrom.from === transFrom.to

					if (transFrom.a === epsilon) transFrom.a = ''

					if (isRecursive) 
						newTrans.a += transFrom.a.length > 1 ? `(${transFrom.a})*` : `${transFrom.a}*`
					else {
						let a = transFrom.a.includes('+') ? `(${transFrom.a})` : transFrom.a
						clone.addTransition(newTrans.from, `${newTrans.a}${a}`, transFrom.to)
					}

					// console.log([ ...clone.states ].map(s => s.transitions))
				}

				// console.log(`ABOUT TO REMOVE TRANSITION: From State: ${transTo.from} === Symbol: ${transTo.a}`)
				clone.states = clone.states.map(e => {
					if (e.name === transTo.from)
						e.transitions = e.transitions.filter(t => !(t.a === transTo.a && t.to === transTo.to))
					return e
				})
			}

			// clone.removeState(ns.name)
			// i++
		}

		return pipeTransitions(clone.states[0].transitions)[0].a
	}
}