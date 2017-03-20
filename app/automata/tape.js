export const RIGHT = 'R', LEFT = 'L', NONE = '.', BLANK = 'B'

export default class Tape {
    constructor(input) {
        this.contents = [ BLANK, ...input.split(''), BLANK ]
        this.head = this.contents.length > 2 ? 1 : 0
    }
    update(replaceValue, moveDirection) {
        this.contents[this.head] = replaceValue
        this.move(moveDirection)
    }
    move(direction) {
        if (direction === NONE)
            return
            
        if (direction === RIGHT)
            this.head++
        else if (direction === LEFT)
            this.head--
        
        if (this.head < 0)
            this.head = 0
        else if (this.head >= this.contents.length)
            this.head = this.contents.length - 1
    }
    getCurr() {
        return this.contents[this.head]
    }
}