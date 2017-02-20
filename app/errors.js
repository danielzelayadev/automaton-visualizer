export class UnknownCharError extends Error {
    constructor(unknownChar) {
        super(`Character '${unknownChar}' is not a part of the alphabet.`)
    }
}

export class UnknownStateError extends Error {
    constructor(stateName) {
        super(`State '${stateName}' doesn't exist in the automata.`)
    }
}

export class DeterminismError extends Error {
    constructor(state, a) {
        super(`State '${state}' already has a transition with character '${a}'.`)
    }
}

export class NoInitialStateError extends Error {
    constructor() {
        super('No initial state has been set.')
    }
}

export class DuplicateStateError extends Error {
    constructor(name) {
        super(`State '${name}' already exists.`)
    }
}

export class DuplicateTransitionError extends Error {
    constructor({ from, a, to }) {
        super(`A transition from state '${from}' with char '${a}' to state '${to}' already exists.`)
    }
}

export class NoFinalStatesError extends Error {
    constructor() {
        super('No final states have been defined.')
    }
}