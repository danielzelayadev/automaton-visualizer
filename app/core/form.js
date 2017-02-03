export default class Form {
    inputs = []
    constructor(name, vals = {}) {
        this.form = $(`form[name="${name}"]`)
        this.setValues(vals)
        this.form.keypress(e => {
            if (e.which === 13)
                e.preventDefault()
        })
    }
    setValues(vals) {
        this.inputs = []
        for (let key in vals) {
            let input = this.form.find(`input[name="${key}"]`)
            let value = vals[key]
            
            if (input.attr('type') === 'checkbox')
                input.attr('checked', value)
            else
                input.val(value)

            this.inputs = [ ...this.inputs, input ]
        }
    }
    getValues() {
        return this.inputs.reduce((accum, curr) => {
            accum[curr.attr('name')] = curr.attr('type') === 'checkbox' ? 
                                       curr.is(':checked') : curr.val()
            return accum
        }, {})
    }
}