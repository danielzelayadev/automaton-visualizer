import NFAe from './nfa-e'
import { epsilon } from '../constants'

export default class PDA extends NFAe {
    clone() {
        const a = new PDA([])
        a.setFromAutomaton(this)
        return a
    }
}