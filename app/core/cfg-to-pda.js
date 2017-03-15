import PDA from '../automata/pda'
import { epsilon, stackConst } from '../constants'

const arrow = '->'
const initState = 'q0', loopState = 'qloop', endState = 'qf'

export function cfg2pda(cfg) {
    const pda = new PDA([])
    const productions = parseGrammar(cfg)

    initPDA(pda, productions[0])

    productions.map(p => productionToTransition(pda, p))

    const variables = productions.map(p => p.left)
    const terminals = productions.reduce((a, c) => getTerminals(a, c, variables), [])

    pda.alphabet = terminals

    terminals.map(t => terminalToTransition(pda, t))

    return pda
}

function initPDA(pda, firstProd) {
    pda.addState(initState, false)
    pda.addState(loopState, false)
    pda.addState(endState, true)

    pda.addTransition(initState, `${epsilon},${epsilon}/${firstProd.left},${stackConst}`, loopState)
    pda.addTransition(loopState, `${epsilon},${stackConst}/${epsilon}`, endState)

    pda.setInitialState(initState)
}

function productionToTransition(pda, prod) {
    const right = prod.right.split('').join(',')
    pda.addTransition(loopState, `${epsilon},${prod.left}/${right}`, loopState)
}

function terminalToTransition(pda, terminal) {
    pda.addTransition(loopState, `${terminal},${terminal}/${epsilon}`, loopState)
}

function getTerminals(terminals, prod, variables) {
    return [ ...terminals, ...new Set(prod.right.split('')
        .filter(c => isTerminal(c, variables))) ]
}

function isTerminal(c, variables) {
    return c !== epsilon && !variables.filter(v => v === c).length
}

function parseGrammar(cfg) {
    return cfg.split('\n').map(parseProduction)
}

function parseProduction(line) {
    const left = line[0]
    const indexOfRight = line.indexOf(arrow) + arrow.length + 1
    const right = line.substr(indexOfRight)
    return { left, right }
}