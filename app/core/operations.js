import NFA from '../automata/nfa'

export function union(a, b) {
    const aut = joinAutomata(a, b)
    return aut
}

function joinAutomata(a, b) {
    if (!a && !b) return
    if (!a) return b
    if (!b) return a
    
    const aut = new NFA([ ...new Set([ ...a.alphabet, ...b.alphabet ]) ])
    const currStates = [ a.getState(a.initialState), b.getState(b.initialState) ]
    const initStateName = joinStateNames(currStates[0], currStates[1])

    aut.addState(initStateName, false)
    aut.setInitialState(initStateName)

    return joinAut(aut, ...currStates, a, b)
}

function joinAut(aut, currStateA, currStateB, a, b) {
    for (const symbol of aut.alphabet) {
        const transitionsA = currStateA ? currStateA.transitions.filter(t => t.a === symbol) : []
        const transitionsB = currStateB ? currStateB.transitions.filter(t => t.a === symbol) : []

        if (!transitionsA.length && !transitionsB.length) continue
        
        const toStateA = transitionsA.map(t => a.getState(t.to))[0]
        const toStateB = transitionsB.map(t => b.getState(t.to))[0]

        const stateName = joinStateNames(toStateA, toStateB)

        if (!aut.stateExists(stateName)) {
            aut.addState(stateName, false)
            aut = joinAut(aut, toStateA, toStateB, a, b)
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