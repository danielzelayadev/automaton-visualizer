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
	constructor (name) {
		this.name = name
	}
}

export class Transition {
	constructor (from, a, to) {
		this.from = from
		this.a = a
		this.to = to
	}
}