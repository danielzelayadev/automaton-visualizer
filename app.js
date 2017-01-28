import DFA from './dfa'
import expect from 'expect'

const a = new DFA("Super X", [ "0", "1" ])

a.addState("q0", false)
a.addState("q1", false)
a.addState("q2", false)
a.addState("q3", true)

a.setInitialState("q0")

a.addTransition("q0", "0", "q1")
a.addTransition("q0", "1", "q0")

a.addTransition("q1", "0", "q2")
a.addTransition("q1", "1", "q0")

a.addTransition("q2", "0", "q3")
a.addTransition("q2", "1", "q0")

a.addTransition("q3", "0", "q3")
a.addTransition("q3", "1", "q3")

expect(a.run("hbjdfbejwebj")).toBe(false)
expect(a.run("01010101")).toBe(false)
expect(a.run("000")).toBe(true)
expect(a.run("111")).toBe(false)
expect(a.run("1110")).toBe(false)
expect(a.run("111000")).toBe(true)

console.log(a)