import DFAManipulation from './DFAManipulation'
import NFAManipulation from './NFAManipulation'
import DFA  from '../automata/dfa'
import NFA  from '../automata/nfa'
import NFAe from '../automata/nfa-e'

export function getCurrentManipulation (currentVisualizer, alphabet, data) {
    switch (currentVisualizer) {
        case 'DFA':
            return new DFAManipulation(new DFA(alphabet), data)
        case 'NFA':
            const checked = $('#epsilon-toggle').is(':checked')
            return new NFAManipulation(checked ? new NFAe(alphabet) : new NFA(alphabet), data)
    }

    return false
}