import NFAe from '../automata/nfa-e'
import { epsilon } from '../constants'

let ctr = 0

export default function evaluateExpression (exp) {
    ctr = 0
    return evaluate(exp)
}

function evaluate (exp) {
    let aut = new NFAe([])
   
    if (exp.name === 'pipe') {
        const left  = evaluate(exp.left)
        const right = evaluate(exp.right)

        aut.alphabet = [ ...new Set([ ...left.alphabet, ...right.alphabet ]) ]

        aut.addState(`q${ctr++}`, false)
        aut.states = [ aut.states[0], ...left.states, ...right.states ]
        aut.addState(`q${ctr++}`)
        
        aut.addTransition(aut.states[0].name, epsilon, left.states[0].name)
        aut.addTransition(aut.states[0].name, epsilon, right.states[0].name)
        aut.addTransition(left.states[left.states.length - 1].name, epsilon, 
                          aut.states[aut.states.length - 1].name)
        aut.addTransition(right.states[right.states.length - 1].name, epsilon, 
                          aut.states[aut.states.length - 1].name)
    } else if (exp.name === 'concat') {
        const left  = evaluate(exp.left)
        const right = evaluate(exp.right)

        aut.alphabet = [ ...new Set([ ...left.alphabet, ...right.alphabet ]) ]

        aut.states = [  ...left.states, ...right.states ]
        
        aut.addTransition(left.states[left.states.length - 1].name, epsilon, right.states[0].name)
    } else if (exp.name === 'kleene') {
        const expression = evaluate(exp.expression)

        aut.alphabet = [ ...new Set([ ...expression.alphabet ]) ]

        aut.addState(`q${ctr++}`, false)
        aut.states = [ aut.states[0], ...expression.states ]
        aut.addState(`q${ctr++}`)
        
        aut.addTransition(aut.states[0].name, epsilon, expression.states[0].name)
        aut.addTransition(aut.states[0].name, epsilon, aut.states[aut.states.length - 1].name)
        aut.addTransition(expression.states[expression.states.length - 1].name, epsilon, 
                          aut.states[aut.states.length - 1].name)
        aut.addTransition(expression.states[expression.states.length - 1].name, epsilon, 
                          expression.states[0].name)
    } else if (exp.name === 'character') {
        aut.addToAlphabet(exp.value)
        aut.addState(`q${ctr++}`, false)
        aut.addState(`q${ctr++}`, false)
        aut.addTransition(aut.states[0].name, exp.value, aut.states[1].name)
    }

    return aut
}