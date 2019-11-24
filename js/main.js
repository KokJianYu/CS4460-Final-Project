// Initialize constants
const STAGE_WIDTH = 700
const STAGE_HEIGHT = 700
const AIRCRAFT_DATA_PATH = "data/aircraft_incidents.csv"

//svg that will contain the visualizations
var svg = d3.select('#vis')
    .append('svg')
    .attr("width", STAGE_WIDTH)
    .attr("height", STAGE_HEIGHT)
    .attr("id", "stage")

function clearVisualization() {
    d3.select('#stage').selectAll("*").remove()
}

/**
 * This function displays the title/beginning of this presentation
 */
function showTitle() {
    // count openvis title
    g = svg.append('g')

    g.append('text')
    .attr('class', 'title')
    .attr('x', STAGE_WIDTH / 2)
    .attr('y', STAGE_HEIGHT / 3)
    .text('CS4460');

    // console.log(d3.select(".text"))

    g.append('text')
    .attr('class', 'subtitle')
    .attr('x', STAGE_WIDTH / 2)
    .attr('y', STAGE_HEIGHT / 3 + (STAGE_HEIGHT / 5))
    .text('ScrollyTelling of Airplane Incidents!');
}

/**
 * Creates a group element to be used to plot the visualization.
 * @param {*} xScale the xScale to create the x axis with (d3.scaleLinear or d3.scaleOrdinal)
 * @param {*} yScale the yScale to create the x axis with (d3.scaleLinear or d3.scaleOrdinal)
 * @param {*} width the width of the chart (recommended to be 600)
 * @param {*} height the height of the chart (recommended to be 600)
 * @param {*} chartOffset the offset of the chart from the svg 
 * @param {*} xRegionOffset the offset of the x axis from the y axis. (if 0, origin will be at axis intersection)
 */
function createChartWithAxis(xScale, yScale, width, height, chartOffset=50, xRegionOffset=0) {
    
    var chart = svg.append('g')
        .attr("width", width)
        .attr("height", height)
        .attr("class", "chart")
    if (yScale != null){
        chart.append('g').attr('transform', `translate(${chartOffset}, ${chartOffset})`).call(d3.axisLeft(yScale))
    }
    if (xScale != null) {
        chart.append('g').attr('transform', `translate(${xRegionOffset + chartOffset}, ${height + chartOffset})`).call(d3.axisBottom(xScale))
    }
    return chart
}

// ################################### EXAMPLE FUNCTIONS! REMOVE WHEN DONE ###################################
/**
 * This function plots deaths per year
 * Refer to this to see how to draw a plot with dataset.
 */
function exampleDrawChart() {
    d3.csv(AIRCRAFT_DATA_PATH, function(data){

        // Aggregate Total_Fatal_Injuries from incidents with the same year.
        var deathsByYear = d3.nest()
		.key(function (d) { 
            year = d.Event_Date.split("/")[2]; 
            if (year.length == 2) {
                if (parseInt(year) > 50) {
                    year = "19"+year
                } else {
                    year = "20"+year
                }
            }
            return year
        })
		.rollup(function (v) {
			return d3.sum(v, function (d) {
				return d.Total_Fatal_Injuries
			}
			);
		})
        .entries(data);

        // Collect the keys to be used to create x axis
        keys = []
        deathsByYear.forEach(element => {
            keys.push(element.key)
        })
        keys.sort()

        // Set height and width to be 90% of SVG. 
        // Chart WILL get hidden if height and width above 700px
        // Can be fixed by adjusting SVG size. 
        height = STAGE_HEIGHT * 0.9
        width = STAGE_WIDTH * 0.9
        
        // Technically, the max value of yScale should be retrieved from the dataset. 
        // But I hard coded it here as this is only for demonstration purpose
        var yScale = d3.scaleLinear()
        .domain([0, 1000])
        .range([height, 0]);
        var xScale = d3.scaleOrdinal()
        .domain(keys)
        .range(d3.range(0, width, width / keys.length));
        
        // chartOffset is used to move the chart from its creation point. (moves both x and y position by offset)
        // purpose is to prevent axis from getting hidden due to being outside SVG bounding box.
        var chartOffset = 50
        // xRegionOffset move the xAxis in the +x direction by offset.
        // set this to a value > 0 if you do not want origin of chart to be at the intersection of axis.
        var xRegionOffset = 20

        var chart = createChartWithAxis(xScale, yScale, width, height, chartOffset, xRegionOffset)  
        // Create chart title
        chart.append('text')
        .attr('class', 'title')
        .attr('x', width / 2 + chartOffset + xRegionOffset)
        .attr('y', height / 20)
        .text('Number of deaths per year');

        // Create bars for the chart
        chart.selectAll('rect')
		.data(deathsByYear)
        .enter()
        .append("rect")
        .attr("x", function (d) { return xRegionOffset + chartOffset + xScale(d.key) - 5 })
        .attr("y", yScale(0) + chartOffset)
        .attr("width", "10")
        .style("fill", "green")
        .transition()
        .duration(800)
        .delay(100)
		.attr("height", function (d) {
            return yScale(0) - yScale(d.value)
		})
        .attr("y", function (d) { return yScale(d.value) + chartOffset })
    })

}

function exampleDrawOnlyYaxis() {
    height = STAGE_HEIGHT * 0.9
    width = STAGE_WIDTH * 0.9
    var yScale = d3.scaleLinear()
    .domain([0, 100])
    .range([height, 0]);

    var chart = createChartWithAxis(null, yScale, width, height)
    // TODO: Add data
}

function exampleDrawOnlyXaxis() {
    height = STAGE_HEIGHT * 0.9
    width = STAGE_WIDTH * 0.9
    var xScale = d3.scaleLinear()
    .domain([0, 100])
    .range([0, width]);

    var chart = createChartWithAxis(xScale, null, width, height)
    // TODO: Add data
}
// ################################### END OF EXAMPLE FUNCTIONS ###################################

/**
 * This function returns an array containing functions
 * that creates visualization to be displayed at specific step index
 */
function initializeStepsPlotsArray() {
    var plots = [
        showTitle, 
        exampleDrawChart,
        exampleDrawOnlyYaxis,
        exampleDrawOnlyXaxis
    ]
    return plots
}

plots = initializeStepsPlotsArray()

// setup scroll functionality
var scroll = scroller()
.container(d3.select('#graphic'));

// setup event handling
scroll.on('active', function (index) {
    clearVisualization()
    // highlight current step text
    d3.selectAll('.step')
        .style('opacity', function (d, i) { return i === index ? 1 : 0.1; });

    plots[index]()

});

scroll.on('progress', function (index, progress) {
    // Might be useful if you need to progress through the graph as you scroll.
    console.log("progress")
    console.log(index)
    console.log(progress)
});

// pass in .step selection as the steps
scroll(d3.selectAll('.step'));