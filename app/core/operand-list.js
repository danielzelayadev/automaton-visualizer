export default class OperandList {
    selector = ''
    removePrefix = 'operandRemove'
    operands = []
    ctr = 0
    constructor(selector) { 
        this.selector = selector 
        this.clear()
    }
    addOperand(name, automaton) {
        this.operands = [ ...this.operands, { id: this.ctr, name, automaton } ]

        $(this.selector).append(`
        <li id="${this.ctr}" class="collection-item">
            <div>
                ${name}
                <a href="#" class="secondary-content" id="${this.removePrefix}${this.ctr}">
                    <i class="material-icons">delete</i>
                </a>
            </div>
        </li>`)

        $(`#${this.removePrefix}${this.ctr++}`)
            .off('click')
            .click(this.removeOperand.bind(this))
    }
    removeOperand(e) {
        const li = e.currentTarget.closest('li')
        const id = li.id

        this.operands = this.operands.filter(o => o.id != id)
        
        li.remove()
    }
    clear() {
        $(`${this.selector} .collection-item`).remove()
        this.operands = []
        this.ctr = 0
    }
    reduce(operation) {
        return this.operands.map(o => o.automaton).reduce(operation, null)
    }
}