import { Transition } from './automaton'
import NFAe from './nfa-e'
import { epsilon, stackConst } from '../constants'
import { UnknownCharError, UnknownStateError, 
         DuplicateTransitionError, InvalidPDATransition,
         NoInitialStateError } from '../errors'

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
        if (data.push)
            data.pushValues.map(pv => {
                if (pv !== stackConst && !this.charInAlphabet(pv))
                    throw new UnknownCharError(pv)
            })

		this.states = this.states.map(e => {
			if (e.name === from)
				e.transitions = [ ...e.transitions, new Transition(from, a, to) ]
			return e
		})
    }
    parseTransitionData(str) {
        const [ first, last ] = str.split('/')
        const [ input, popValue ] = first.split(',')
        const pushValues = last.split(',').reverse()
        const push = pushValues.indexOf(epsilon) < 0

        if (!input || !popValue || !pushValues)
            throw new InvalidPDATransition(str)

        return { input, popValue, pushValues, push }
    }
    getInitRunSnaps(w) {
        const initSnap = { state: this.getInitialState(), w, stack: [ stackConst ] }
        const epsilonSnaps = this.getSnapsFor([initSnap], epsilon)
        return [ initSnap, ...epsilonSnaps ]
    }
    getSnapsFor(snaps, symbol) {
        let toSnaps = snaps.reduce((accum, snap) => {
            const newSnaps = snap.state.transitions
                .filter(t => this.transitionMatches(t.a, symbol, snap.stack))
                    .map(t => this.newSnap(t.to, snap, t.a))
            return [ ...accum, ...newSnaps ]
        }, [])

        toSnaps = toSnaps.reduce((accum, snap) => 
            [ ...accum, ...this.getESnapClosure(snap) ], toSnaps)

        return [ ...new Set(toSnaps) ]
    }
    modStack(stack, a) {
        let newStack = [ ...stack ]

        const { popValue, push, pushValues } = this.parseTransitionData(a)

        if (popValue !== epsilon)
            newStack.pop()

        if (push)
            pushValues.map(pv => newStack.push(pv))

        return newStack
    }
    transitionMatches(a, symbol, stack) {
        const data = this.parseTransitionData(a)
        return data.input === symbol && data.popValue === stack[stack.length - 1]
    }
    getETransitions(snap) {
        return snap.state.transitions
            .filter(t => this.transitionMatches(t.a, epsilon, snap.stack))
    }
    getESnaps(snap) {
        return this.getETransitions(snap).map(t => this.newSnap(t.to, snap, t.a))
    }
    getESnapClosure(snap) {
        return [ snap, ...this.getesnapclosure(snap) ]
    }
    getesnapclosure(snap) {
        let eSnaps = this.getESnaps(snap)

        for (const s of eSnaps)
            eSnaps = [ ...eSnaps, ...this.getesnapclosure(s) ]
        
        return eSnaps
    }
    newSnap(stateName, oldSnap, a) {
        return {
            state: this.getState(stateName),
            w: oldSnap.w.substr(1),
            stack: this.modStack(oldSnap.stack, a)
        }
    }
    run(w) {
        if (!this.initialState)
			throw new NoInitialStateError()
            
        let snaps = this.getInitRunSnaps(w)
       
        for (let a of w)
            if (!snaps.length)
                return false
            else
                snaps = this.getSnapsFor(snaps, a)

        return this.hasFinalState(snaps.map(s => s.state))
    }
    clone() {
        const a = new PDA([])
        a.setFromAutomaton(this)
        return a
    }
}