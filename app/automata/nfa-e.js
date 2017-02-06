import NFA from './nfa'
import { epsilon } from '../constants'

export default class NFAe extends NFA {
    constructor(alphabet) {
        super(alphabet)
        this.alphabet = [ ...this.alphabet, epsilon ]
    }
    getStartStates() {
        const initState = this.getState(this.initialState)
		let epsilonStates = this.getTransitionsFor([initState], epsilon)
				            .map(t => this.getState(t.to))
		return [ initState, ...epsilonStates ]
	}
    getTransitionsFor(states, a) {
        return states.reduce((accum, curr) => [ ...accum, 
        ...curr.transitions.filter(t => (t.a === a || t.a === epsilon)) ], 
        [])
    }
    hasFinalState(states) {
        const hasFinal = s => s.reduce((accum, curr) => accum ? true : 
                              this.stateIsFinal(curr.name), false)
                              
        if (!hasFinal(states)) {
            states = this.getTransitionsFor(states, epsilon)
                     .map(t => this.getState(t.to))
            
            return hasFinal(states)
        }

        return true
    }
    setFromAutomaton(a) {
        this.alphabet = [ ...a.alphabet, epsilon ]
		this.states = [...a.states]
        this.initialState = a.initialState
        this.finalStates = [...a.finalStates]
    }
}