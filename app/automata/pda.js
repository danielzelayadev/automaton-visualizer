import { Transition } from './automaton'
import NFAe from './nfa-e'
import { epsilon, stackConst } from '../constants'
import { UnknownCharError, UnknownStateError, 
         DuplicateTransitionError, InvalidPDATransition,
         NoInitialStateError } from '../errors'

export default class PDA extends NFAe {
    charInAlphabet(a) {
        const { input } = this.parseTransitionData(a)
        return input === epsilon ? true :
               this.alphabet.filter(e => e === input).length > 0 
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
        return this.getESnapClosure({ state: this.getInitialState(), stack: [ stackConst ] })
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
        return data.input === symbol && (data.popValue === epsilon || data.popValue === stack[stack.length - 1])
    }
    getETransitions(snap) {
        return snap.state.transitions
            .filter(t => this.transitionMatches(t.a, epsilon, snap.stack))
    }
    getESnaps(snap) {
        return this.getETransitions(snap).map(t => this.newSnap(t.to, snap, t.a))
    }
    getESnapClosure(snap) {
        return this.getesnapclosure(snap, [snap])
    }
    getesnapclosure(snap, readySnaps) {
        let eSnaps = this.getESnaps(snap)

        for (const s of eSnaps)
            if (!this.snapIncluded(readySnaps, s))
                readySnaps = [ ...readySnaps, ...this.getesnapclosure(s, [ ...readySnaps, s ]) ]
        
        return [ ...new Set(readySnaps) ]
    }
    newSnap(stateName, oldSnap, a) {
        return {
            state: this.getState(stateName),
            stack: this.modStack(oldSnap.stack, a)
        }
    }
    snapEquals(snapA, snapB) {
        return snapA.state.name === snapB.state.name && 
               snapA.stack[snapA.stack.length - 1] === snapB.stack[snapB.stack.length - 1]
    }
    snapIncluded(snapList, snap) {
        return snapList.filter(s => this.snapEquals(s, snap)).length > 0
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