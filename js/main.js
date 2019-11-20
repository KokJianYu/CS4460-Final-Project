function clearVisualization() {
    d3.select('#vis').selectAll("*").remove()
}

/**
 * Currently, try to keep width and height to 600 each.
 * @param {*} xScale 
 * @param {*} yScale 
 * @param {*} width 
 * @param {*} height 
 */
function createSvgWithAxis(xScale, yScale, width, height) {
    
    var vis = d3.select('#vis')
    
    var offset = 50
    var svg = vis.append('svg')
        .attr("width", width+offset+20)
        .attr("height", height+offset+20)
        .attr("class", "table")
    svg.append('g').attr('transform', `translate(${offset}, ${offset})`).call(d3.axisLeft(yScale))
    svg.append('g').attr('transform', `translate(${offset}, ${height + offset})`).call(d3.axisBottom(xScale))
    return svg
}

function exampleDrawTable() {
    var width = 600
    var height = 600
    var yScale = d3.scaleLinear()
    .domain([0, 100])
    .range([height, 0]);
    var xScale = d3.scaleLinear()
    .domain([0, 100])         // This is what is written on the Axis: from 0 to 100
    .range([0, width]);

    var svg = createSvgWithAxis(xScale, yScale, width, height)
    // TODO: Add data
}

exampleDrawTable()

// setup scroll functionality
var scroll = scroller()
.container(d3.select('#graphic'));

// setup event handling
scroll.on('active', function (index) {
    // highlight current step text
    d3.selectAll('.step')
        .style('opacity', function (d, i) { return i === index ? 1 : 0.1; });
    
    // TODO: Display the correct graphs here.
    console.log('active')
    console.log(index)
});

scroll.on('progress', function (index, progress) {
    // Might be useful if you need to progress through the graph as you scroll.
    console.log("progress")
    console.log(index)
    console.log(progress)
});

// pass in .step selection as the steps
scroll(d3.selectAll('.step'));