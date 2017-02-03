import dfaManipulation from './dfa-manipulation'

export function getCurrentManipulation (currentVisualizer) {
    switch (currentVisualizer) {
        case 'DFA':
        return dfaManipulation
    }

    return () => false
}