export function getSetFromString (str) {
    return str.split('').filter((c, i, a) => i === a.indexOf(c))
}

export function runAutomaton (automaton) {
    if (!automaton) return
    try {
        alert(automaton.run($('[name="testStr"]').val()) ? "Valid String!" : "Invalid String!")
    } catch (e) {
        alert(e.message)
    }
}