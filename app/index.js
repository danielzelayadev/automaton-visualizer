import options from './options'
import { getCurrentManipulation } from './manipulation'

const nodes = new vis.DataSet([])
const edges = new vis.DataSet([])

const select   = $('select')
const resetBtn = $('#reset-btn')
const testStr  = $('input[name="testStr"]')

const alphabetPromptText = 'Please enter alphabet string: '

let currentVisualizer = 'DFA'

select.material_select()
select.change(onVisualizerChange)
resetBtn.click(e => start(prompt(alphabetPromptText)))
testStr.keypress(e => clickRunBtn(e.which))

start('01')

function start(alphabetStr) {
    if (!alphabetStr)
        return

    const alphabet = [ ...new Set(alphabetStr.split('')) ]

    $('.opt').hide()

    $('#title').text(currentVisualizer)

    nodes.clear()
    edges.clear()
    new vis.Network(document.getElementById('app'), { nodes, edges}, 
                    options(getCurrentManipulation(
                        currentVisualizer, alphabet, { nodes, edges })))
}

function onVisualizerChange() {
    const visSelection = select.val()
    if (currentVisualizer !== visSelection) {
        let alphabetStr = prompt(alphabetPromptText)

        if (!alphabetStr) {
            select.val(currentVisualizer)
            return
        }

        currentVisualizer = visSelection
        start(alphabetStr)
    }
}

function clickRunBtn(key) {
    if (key === 13)
        $('#run-btn').click()
}