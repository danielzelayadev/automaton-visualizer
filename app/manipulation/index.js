import DFAManipulation    from './DFAManipulation'
import NFAManipulation    from './NFAManipulation'
import PDAManipulation    from './PDAManipulation'
import TuringManipulation from './TuringManipulation'
import DFA            from '../automata/dfa'
import NFA            from '../automata/nfa'
import NFAe           from '../automata/nfa-e'
import PDA            from '../automata/pda'
import TuringMachine  from '../automata/turing-machine'

export function getCurrentManipulation (currentVisualizer, alphabet, data) {
    switch (currentVisualizer) {
        case 'DFA':
            return new DFAManipulation(new DFA(alphabet), data)
        case 'NFA':
            const checked = $('#epsilon-toggle').is(':checked')
            return new NFAManipulation(checked ? new NFAe(alphabet) : new NFA(alphabet), data)
        case 'PDA':
            return new PDAManipulation(new PDA(alphabet), data)
        case 'TM':
            return new TuringManipulation(new TuringMachine(alphabet), data)
    }

    return false
}