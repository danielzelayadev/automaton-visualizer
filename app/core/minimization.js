let automaton = null

export function minimize(aut) {
    if (!aut) return

    automaton = aut.clone()

    const minTable = createMinimizationTable()
    let entries = Object.keys(minTable)
    let oldEntryLength = entries.length

    while (true) {
        fillTable(minTable, entries)

        console.log(minTable)

        entries = entries.filter(entry => 
            Object.values(minTable[entry]).filter(v => v === null).length > 0)

        if (!entries.length)
            break
        if (oldEntryLength === entries.length) {
            fillTable(minTable, entries, true)
            break
        }

        oldEntryLength = entries.length
    }

    console.log(minTable)

    return getAutomatonFromMinTable(minTable)
}

function fillTable(minTable, entries, val) {
    entries.map(entry => {
        const states = Object.keys(minTable[entry])
        states.map(state => {
            if (minTable[entry][state] === null)
                minTable[entry][state] = val ? val :
                    areEqual(automaton.getState(entry), 
                        automaton.getState(state), minTable)
        })
    })
}

function createMinimizationTable() {
    return automaton.states.reduce((table, state, index, states) => {
        const colIsFinal = automaton.stateIsFinal(state.name)
        
        if (index !== states.length - 1)
            table[state.name] = states
                .filter((s, i) => i > index)
                .reduce((equality, _state) => {
                    const rowIsFinal = automaton.stateIsFinal(_state.name)
                    const isFinal = (colIsFinal && !rowIsFinal) || (!colIsFinal && rowIsFinal)
                    equality[_state.name] = isFinal ? false : null
                    return equality
                }, {})
        return table
    }, {})
}

function areEqual(stateA, stateB, table) {
    const eqs = []

    for (const a of automaton.alphabet) {
        const toStateA = stateA.transitions.filter(t => t.a === a).map(t => t.to)[0]
        const toStateB = stateB.transitions.filter(t => t.a === a).map(t => t.to)[0]

        if ((!toStateA && toStateB) || (toStateA && !toStateB))
            return false

        if (toStateA === toStateB) {
            eqs.push(true)
            continue
        }
        
        const indexA = Object.keys(table).findIndex(e => e === toStateA)
        const indexB = Object.keys(table).findIndex(e => e === toStateB)

        const res = (indexA < indexB || indexB < 0) && indexA >= 0 ?
                    table[toStateA][toStateB] :
                    table[toStateB][toStateA]
        
        if (res === false)
            return res
        
        eqs.push(res)
    }

    return eqs.filter(e => e === null).length > 0 ? null : true
}

function getAutomatonFromMinTable(table) {
    const DFA = require('../automata/dfa').default
    const aut = new DFA(automaton.alphabet)
    const entries = Object.keys(table)

    const eqSets = getAllEquivalenceSets(table)
    const jointStates = eqSets.reduce((js, es) => [ ...js, ...es.states ], [])

    console.log(eqSets)

    if (!eqSets.length) return

    eqSets.map(({ states, name }, i) => aut.addState(name, 
        states.filter(s => automaton.stateIsFinal(s.name)).length > 0))

    const initSet = eqSets
        .filter(({ states }) => states
            .filter(s => automaton.stateIsInitial(s.name)).length > 0)[0]

    if (initSet)
        aut.setInitialState(initSet.name)
    else {
        const State = require('../automata/automaton').State
        aut.states = [ new State(automaton.initialState),
                        ...aut.states ]
        aut.setInitialState(automaton.initialState)
        if (automaton.stateIsFinal(automaton.initialState))
            aut.addFinal(automaton.initialState)
    }

    stateTrans(aut, 0, eqSets, jointStates)

    return aut
}

function stateTrans(aut, stateIndex, eqSets, jointStates) {
    if (stateIndex < 0 || stateIndex >= aut.states.length)
        return

    const state = aut.states[stateIndex]
    const eqSet = eqSets.filter(es => es.name === state.name)[0]

    console.log(state.name)

    for (const a of aut.alphabet) {
        const trans = eqSet ?
            eqSet.states.reduce((t, s) => [ ...t, 
            ...automaton.getState(s.name).transitions.filter(t => t.a === a) ], []) :
            automaton.getState(state.name).transitions.filter(t => t.a === a)
        
        if (!trans.length) continue

        const toStates = [ ...new Set(trans.map(t => t.to)) ]
        const jointState = toStates.reduce((js, ts) => {
            return js ? js : jointStates.filter(_js => _js.name === ts).length > 0
        }, false)

        let name = toStates.sort().join("")

        console.log(toStates, name)

        if (!aut.stateExists(name))
            if (!jointState)
                aut.addState(name, automaton.stateIsFinal(name))
            else
                name = eqSets
                    .filter(es => es.states
                        .filter(s => toStates
                            .filter(ts => s.name === ts).length > 0).length > 0)[0].name

        aut.addTransition(state.name, a, name)
    }

    stateTrans(aut, ++stateIndex, eqSets, jointStates)
}

function getAllEquivalenceSets(table) {
    const entries     = Object.keys(table)
    const doneEntries = []
    const equivalenceSets = []
    
    for (const entry of entries) {
        if (doneEntries.findIndex(de => de === entry) >= 0)
            continue

        const eqSet = getEquivalenceSet(table, entry)

        if (eqSet.states.length === 1) continue

        eqSet.states.map(s => doneEntries.push(s.name))
        equivalenceSets.push(eqSet)
    }

    return equivalenceSets
}

function getEquivalenceSet(table, entry, set = { states: [ automaton.getState(entry) ], name: entry }) {
    if (!table[entry])
        return set

    const states = Object.keys(table[entry])

    for (const state of states)
        if (table[entry][state])
            return getEquivalenceSet(table, state, 
            { states: [ ...set.states, automaton.getState(state) ], 
                name: `${set.name}${state}`})
    
    return set
}