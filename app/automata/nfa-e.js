import NFA from './nfa'
import { epsilon } from '../constants'

export default class NFAe extends NFA  {
    charInAlphabet (a) {
        return a === epsilon ? true :
               this.alphabet.filter(e => e === a).length > 0        
    }
    getConversionStartStates() {
        return this.getEClosure(this.initialState)
    }
    getRunStartStates() {
        const initState = this.getState(this.initialState)
		let epsilonStates = this.getTransitionsFor([initState], epsilon)
				            .map(t => this.getState(t.to))
		return [ initState, ...epsilonStates ]
	}
    getTransitionsFor(states, a) {
        let trans = states.reduce((accum, curr) => [ ...accum, 
            ...curr.transitions.filter(t => (t.a === a)) ], [])
        
        const toStates = trans.map(t => t.to)

        for (const ts of toStates)
            trans = [ ...trans, 
            ...this.getEClosure(ts).reduce((a, c) => 
                [ ...a, ...this.getETransitions(c.name) ], []) ]

        return [ ...new Set(trans) ]
    }
    getETransitions(state) {
        return this.getState(state).transitions.filter(t => t.a === epsilon)
    }
    getEStates(state) {
        return this.getETransitions(state).map(t => this.getState(t.to))
    }
    getEClosure(state) {
        return [ this.getState(state), ...this.geteclosure(state) ]
    }
    geteclosure(state) {
        let eStates = this.getEStates(state)

        for (const s of eStates)
            eStates = [ ...eStates, ...this.geteclosure(s.name) ]
        
        return eStates
    }
}