import options from './options'

global.jQuery = require('jquery')
require('bootstrap')

const nodes = new vis.DataSet([])

// create an array with edges
const edges = new vis.DataSet([])

// create a network
const container = document.getElementById('app')

// provide the data in the vis format
const data = { nodes, edges }

// initialize your network!
const network = new vis.Network(container, data, options(data))