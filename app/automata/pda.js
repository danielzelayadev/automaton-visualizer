import { Transition } from './automaton'
import NFAe from './nfa-e'
import { epsilon } from '../constants'
import { UnknownCharError, UnknownStateError, 
         DuplicateTransitionError, InvalidPDATransition } from '../errors'

export default class PDA extends NFAe {
    addTransition(from, a, to) {
        const fs   = this.getState(from)
		const ts   = this.getState(to)
        const data = this.parseTransitionData(a)

		if (!fs)
			throw new UnknownStateError(from)
		if (!ts)
			throw new UnknownStateError(to)
		if (!this.charInAlphabet(data.input))
			throw new UnknownCharError(data.input)
        if (this.stateHasTransition(from, a, to))
            throw new DuplicateTransitionError({ from, a, to })

		this.states = this.states.map(e => {
			if (e.name === from)
				e.transitions = [ ...e.transitions, new Transition(from, a, to) ]
			return e
		})
    }
    parseTransitionData(str) {
        const [ first, last ] = str.split('/')
        const [ input, top ] = first.split(',')
        const action = top === last ? 'none' : (last === epsilon ? 'pop' : 'push')

        if (!input || !top || !action)
            throw new InvalidPDATransition(str)

        return { input, top, action }
    }
    run() {
        
    }
    clone() {
        const a = new PDA([])
        a.setFromAutomaton(this)
        return a
    }
}