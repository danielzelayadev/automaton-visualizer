export default class Automata {
	alphabet = []
	states   = []
	constructor (name, alphabet) { 
		this.name = name 
		this.alphabet = alphabet
	}
	addState (name) {}
	addTransition (from, a, to) {}
	removeTransition (from, a) {}
}

export class State {
	isInitial   = false
	isFinal     = false
	transitions = []
	constructor (name, isFinal) {
		this.name    = name
		this.isFinal = isFinal
	}
}

export class Transition {
	constructor (from, a, to) {
		this.from = from
		this.a = a
		this.to = to
	}
}