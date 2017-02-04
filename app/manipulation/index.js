import dfaManipulation from './dfa-manipulation'
import nfaManipulation from './nfa-manipulation'

export function getCurrentManipulation (currentVisualizer) {
    switch (currentVisualizer) {
        case 'DFA':
        return dfaManipulation
        case 'NFA':
        return nfaManipulation
    }

    return () => false
}