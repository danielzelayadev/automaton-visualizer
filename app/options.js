import { getCurrentManipulation } from './manipulation'

export default {
    edges: {
        arrows: {
            to:     { enabled: true,  scaleFactor: 1, type: 'arrow' },
            middle: { enabled: false, scaleFactor: 1, type: 'arrow' },
            from:   { enabled: false, scaleFactor: 1, type: 'arrow' }
        },
        font: {
            align: 'top'
        }
    },
    physics: {
        enabled: true
    },
    interaction: {
        hover: true
    },
    manipulation: getCurrentManipulation('DFA')()
}