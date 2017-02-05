import Form from '../core/form'

export default class Modal {
    constructor(selector = '') {
        this.mdl = $(selector)
        this.mdl.modal()
    }
    loadForm(url = '', form = { name: '', vals: {} }, onSubmit = v => {}, onCancel = () => {}) {
        this.mdl.load(url, () => {
            form = new Form(form.name, form.vals)

            this.mdl.modal({ dismissible: false })
            this.mdl.modal('open')
            this.mdl.off('keypress')
            this.mdl.keypress(e => this.closeOnEnter(e.which, '#submit'))
            this.mdl.find('#submit').click(e => onSubmit(form.getValues()))
            this.mdl.find('#cancel').click(e => onCancel())

            form.inputs[0].focus()
        })
    }
    closeOnEnter (key, closeId) {
        if (key === 13) 
            this.mdl.find(closeId).click()
    }
}