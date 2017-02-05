export function getSetFromString (str) {
    return str.split('').filter((c, i, a) => i === a.indexOf(c))
}
