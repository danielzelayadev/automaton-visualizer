export default {
    edges: {
        arrows: {
            to:     { enabled: true,  scaleFactor: 1, type: 'arrow' },
            middle: { enabled: false, scaleFactor: 1, type: 'arrow' },
            from:   { enabled: false, scaleFactor: 1, type: 'arrow' }
        }
    },
    physics: {
        enabled: true
    },
    interaction: {
        hover: true
    },
    manipulation: {
        addNode: (nodeData, cb) => {
            console.log('Hey!')
            cb(nodeData)
        },
        editNode: (nodeData, cb) => {
            nodeData.label = prompt('Please enter new label', "")
            cb(nodeData)
        },
        addEdge: (nodeData, cb) => {
            nodeData.label = prompt('Please enter new label', "")
            cb(nodeData)
        }
    }
}