import options from './options'
import { getSetFromString } from './utils'
import { getCurrentManipulation } from './manipulation'

const nodes = new vis.DataSet([])
const edges = new vis.DataSet([])

const select   = $('select')
const resetBtn = $('#reset-btn')

let currentVisualizer = 'DFA'

select.material_select()
select.change(onVisualizerChange)
resetBtn.click(e => start(prompt('Please enter alphabet string: ')))

// resetBtn.click()

function start(alphabetStr) {
    if (!alphabetStr)
        return

    const alphabet = getSetFromString(alphabetStr)

    $('#alphabet .collection-item').remove()

    for (let a of alphabet)
        $('#alphabet').append(`<li class="collection-item">${a}</li>`)

    $('#title').text(currentVisualizer)

    nodes.clear()
    edges.clear()
    new vis.Network(document.getElementById('app'), { nodes, edges}, 
                    options(getCurrentManipulation(
                        currentVisualizer, alphabet, { nodes, edges })))
}

function onVisualizerChange() {
    const visSelection = $('select option:selected').text()
    if (currentVisualizer !== visSelection) {
        currentVisualizer = visSelection
        resetBtn.click()
    }
}