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