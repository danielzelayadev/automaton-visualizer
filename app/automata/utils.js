import { Transition } from './automaton'

export function recursiveTransitionsFirst (a, b) {
	const aIsRecursive = a.from === a.to
	const bIsRecursive = b.from === b.to

	if (aIsRecursive && bIsRecursive) 
		return 0

	return aIsRecursive ? -1 : 1
}

export function pipeTransitions (trans) {
	const destinies = [ ...new Set(trans.map(t => t.to)) ]

	return destinies.reduce((a, c) => {
		const newTrans = trans
			.filter(t => t.to === c)
			.reduce((ac, cu) => {
				ac.from = cu.from
				ac.to   = cu.to
				ac.a    += ac.a.length ? '+' + cu.a : cu.a
				return ac
			}, new Transition('', '', ''))
		return [ ...a, newTrans ]
	}, [])
}