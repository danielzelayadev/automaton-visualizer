export const RIGHT = 'R', LEFT = 'L', NONE = '.'

export default class Tape {
    head = 0
    constructor(contents) {
        this.contents = contents
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
}