import DFAManipulation from './DFAManipulation'
import NFAManipulation from './NFAManipulation'
import DFA from '../automata/dfa'
import NFA from '../automata/nfa'

export function getCurrentManipulation (currentVisualizer, alphabet, data) {
    switch (currentVisualizer) {
        case 'DFA':
        return new DFAManipulation(new DFA(alphabet), data)
        case 'NFA':
        return new NFAManipulation(new NFA(alphabet), data)
    }

    return false
}