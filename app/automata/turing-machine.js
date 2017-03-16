import DFA from './dfa'
import Tape from './tape'
import { InvalidTransition } from '../errors'

export default class TuringMachine extends DFA {
    charInAlphabet(a) {
        const { input } = this.parseTransitionData(a)
        return this.alphabet.filter(e => e === input).length > 0 
    }
    parseTransitionData(str) {
        const [ input, right ] = str.split('/')
        const [ replaceValue, moveDirection ] = right.split('')

        if (!right || !replaceValue || !moveDirection)
            throw new InvalidTransition(str)

        return { input, replaceValue, moveDirection }
    }
    transitionMatches(a, b) {
        const symbolA = a.length > 1 ? this.parseTransitionData(a).input : a
        const symbolB = b.length > 1 ? this.parseTransitionData(b).input : b
        return symbolA === symbolB
    }
    nextStateFromTrans(t) {
        const { replaceValue, moveDirection } = this.parseTransitionData(t.a)
        this.tape.update(replaceValue, moveDirection)
        return this.getState(t.to)
    }
    runInit(w) {
        this.tape = new Tape(w.split(''))
    }
    clone() {
        const a = new TuringMachine([])
        a.setFromAutomaton(this)
        return a
    }
}