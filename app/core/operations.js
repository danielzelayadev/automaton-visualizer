import NFA from '../automata/nfa'

export function union(a, b) {
    return joinAutomata(a, b, determineUnionFinalState)
}

export function intersection(a, b) {
    return joinAutomata(a, b, determineIntersectionFinalState)
}

function determineUnionFinalState(stateA, stateB, autA, autB) {
    return (stateA && autA.stateIsFinal(stateA.name)) || 
           (stateB && autB.stateIsFinal(stateB.name))
}

function determineIntersectionFinalState(stateA, stateB, autA, autB) {
    return (stateA && autA.stateIsFinal(stateA.name)) &&
           (stateB && autB.stateIsFinal(stateB.name))
}

function joinAutomata(a, b, determineFinal) {
    if (!a && !b) return
    if (!a) return b
    if (!b) return a
    
    const aut = new NFA([ ...new Set([ ...a.alphabet, ...b.alphabet ]) ])
    const currStates = [ a.getState(a.initialState), b.getState(b.initialState) ]
    const initStateName = joinStateNames(currStates[0], currStates[1])

    aut.addState(initStateName, determineFinal(...currStates, a, b))
    aut.setInitialState(initStateName)

    return joinAut(aut, ...currStates, a, b, determineFinal)
}

function joinAut(aut, currStateA, currStateB, a, b, determineFinal) {
    for (const symbol of aut.alphabet) {
        const transitionsA = currStateA ? currStateA.transitions.filter(t => t.a === symbol) : []
        const transitionsB = currStateB ? currStateB.transitions.filter(t => t.a === symbol) : []

        if (!transitionsA.length && !transitionsB.length) continue
        
        const toStateA = transitionsA.map(t => a.getState(t.to))[0]
        const toStateB = transitionsB.map(t => b.getState(t.to))[0]

        const stateName = joinStateNames(toStateA, toStateB)

        if (!aut.stateExists(stateName)) {
            aut.addState(stateName, determineFinal(toStateA, toStateB, a, b))
            aut = joinAut(aut, toStateA, toStateB, a, b, determineFinal)
        }

        aut.addTransition(joinStateNames(currStateA, currStateB), symbol, stateName)
    }

    return aut
}

function joinStateNames(stateA, stateB) {
    const A = stateA ? `${stateA.name}(A)` : ''
    const B = stateB ? `${stateB.name}(B)` : ''
    return `{ ${A}${A.length && B.length ? ',' : ''}${B} }`
}