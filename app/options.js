export default m => ({
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
        enabled: true,
        solver: 'repulsion',
        repulsion: {
            springLength: 140
        }
    },
    interaction: {
        hover: true
    },
    manipulation: {
        addNode: m.addNode.bind(m),
        editNode: m.editNode.bind(m),
        deleteNode: m.deleteNode.bind(m),
        addEdge: m.addEdge.bind(m),
        editEdge: m.editEdge.bind(m),
        deleteEdge: m.deleteEdge.bind(m)
    }
})