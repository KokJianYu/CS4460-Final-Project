function test() {
    var vis = d3.select('#vis')
    var g = vis.append('svg')
    console.log(vis)
}

test()
console.log("hello")
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