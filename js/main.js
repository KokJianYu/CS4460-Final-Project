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
 * @param {*} chartOffset array consisting of the offset of the chart from the svg. index 0 is x offset, 1 is y offset. 
 * @param {*} xRegionOffset the offset of the x axis from the y axis. (if 0, origin will be at axis intersection)
 * @param {*} chartClass the class you wish to assign to the chart.
 */
function createChartWithAxis(xScale, yScale, width, height, chartOffset=[50,50], xRegionOffset=0, chartClass="chart") {
    
    var chart = svg.append('g')
        .attr("width", width)
        .attr("height", height)
        .attr("class", chartClass)
    if (yScale != null){
        chart.append('g').attr('transform', `translate(${chartOffset[0]}, ${chartOffset[1]})`).call(d3.axisLeft(yScale))
    }
    if (xScale != null) {
        chart.append('g').attr('transform', `translate(${xRegionOffset + chartOffset[0]}, ${height + chartOffset[1]})`).call(d3.axisBottom(xScale))
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
        var chartOffset = [50, 50]
        // xRegionOffset move the xAxis in the +x direction by offset.
        // set this to a value > 0 if you do not want origin of chart to be at the intersection of axis.
        var xRegionOffset = 20

        var chart = createChartWithAxis(xScale, yScale, width, height, chartOffset, xRegionOffset)  
        // Create chart title
        chart.append('text')
        .attr('class', 'title')
        .attr('x', width / 2 + chartOffset[0] + xRegionOffset)
        .attr('y', 30)
        .text('Number of deaths per year');

        // Create bars for the chart
        chart.selectAll('rect')
		.data(deathsByYear)
        .enter()
        .append("rect")
        .attr("x", function (d) { return xRegionOffset + chartOffset[0] + xScale(d.key) - 5 })
        .attr("y", yScale(0) + chartOffset[1])
        .attr("width", "10")
        .style("fill", "green")
        .transition()
        .duration(800)
        .delay(100)
		.attr("height", function (d) {
            return yScale(0) - yScale(d.value)
		})
        .attr("y", function (d) { return yScale(d.value) + chartOffset[1] })
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

function drawHeatMapTypeOfInjuries(){
    d3.csv(AIRCRAFT_DATA_PATH, function(data){

        // Aggregate Total_Fatal_Injuries from incidents with the same year.
        var injuriesByYear = d3.nest()
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
            total_fatal_injuries = d3.sum(v, function (d) { return d.Total_Fatal_Injuries });
            total_serious_injuries = d3.sum(v, function (d) { return d.Total_Serious_Injuries });
            total_uninjured = d3.sum(v, function (d) { return d.Total_Uninjured });
            return_dict = {
                "Total_Fatal_Injuries":total_fatal_injuries,
                "Total_Serious_Injuries":total_serious_injuries,
                "Total_Uninjured":total_uninjured,
            }
            return return_dict
        })
        .entries(data);

        // Collect the keys to be used to create x axis
        keys = []
        injuriesByYear.forEach(element => {
            keys.push(element.key)
        })
        keys.sort()

        // Set height and width to be 90% of SVG. 
        // Chart WILL get hidden if height and width above 700px
        // Can be fixed by adjusting SVG size. 
        height = STAGE_HEIGHT * 0.9 - 300
        width = STAGE_WIDTH * 0.9 - 100
        
        // chartOffset is used to move the chart from its creation point. (moves both x and y position by offset)
        // purpose is to prevent axis from getting hidden due to being outside SVG bounding box.
        var chartOffset = [150, 100]
        // xRegionOffset move the xAxis in the +x direction by offset.
        // set this to a value > 0 if you do not want origin of chart to be at the intersection of axis.
        var xRegionOffset = 0

        // Technically, the max value of yScale should be retrieved from the dataset. 
        // But I hard coded it here as this is only for demonstration purpose
        var yScale = d3.scaleBand()
        .domain(["Total_Fatal_Injuries", "Total_Serious_Injuries", "Total_Uninjured"])
        .range([height, 0])
        .padding(0.1);
        var xScale = d3.scaleBand()
        .domain(keys)
        .range([0, width])
        .padding(0.1);  
        console.log(injuriesByYear)

        var myColor = d3.scaleLinear()
        .range(["#FFFFDD", "#3E9583", "#1F2D86"])
        .domain([1,4000, 8000])


        var chart = createChartWithAxis(xScale, yScale, width, height, chartOffset, xRegionOffset)  
        // Create chart title
        chart.append('text')
        .attr('class', 'title')
        .attr('x', width / 2 + chartOffset[0] + xRegionOffset)
        .attr('y', 30)
        .text('Types of Injuries per year');

        chart.selectAll()
        .data(injuriesByYear)
        .enter()
        .append("rect")
        .attr("x", function (d) { return xRegionOffset + chartOffset[0]})
        .attr("y", function(d) { return yScale("Total_Fatal_Injuries") + chartOffset[1] })
        .style("fill", function(d) { return myColor(d.value["Total_Fatal_Injuries"])} )
        .transition()
            .duration(800)
            .delay(100)
        .attr("x", function (d) { return xRegionOffset + chartOffset[0] + xScale(d.key)})
        .attr("width", xScale.bandwidth() )
        .attr("height", yScale.bandwidth() )
        chart.selectAll()
        .data(injuriesByYear)
        .enter()
        .append("rect")
        .attr("x", function (d) { return xRegionOffset + chartOffset[0]})
        .attr("y", function(d) { return yScale("Total_Serious_Injuries") + chartOffset[1] })
        .style("fill", function(d) { return myColor(d.value["Total_Serious_Injuries"])} )
        .transition()
            .duration(800)
            .delay(100)
        .attr("x", function (d) { return xRegionOffset + chartOffset[0] + xScale(d.key)})
        .attr("width", xScale.bandwidth() )
        .attr("height", yScale.bandwidth() )
        chart.selectAll()
        .data(injuriesByYear)
        .enter()
        .append("rect")
        .attr("x", function (d) { return xRegionOffset + chartOffset[0]})
        .attr("y", function(d) { return yScale("Total_Uninjured") + chartOffset[1]})
        .style("fill", function(d) { return myColor(d.value["Total_Uninjured"])} )
        .transition()
            .duration(800)
            .delay(100)
        .attr("x", function (d) { return xRegionOffset + chartOffset[0] + xScale(d.key)})
        .attr("width", xScale.bandwidth() )
        .attr("height", yScale.bandwidth() )

        var defs = svg.append("defs");
        var linearGradient = defs.append("linearGradient")
        .attr("id", "linear-gradient");
        linearGradient
        .attr("x1", "0%")
        .attr("y1", "0%")
        .attr("x2", "100%")
        .attr("y2", "0%");
        //Set the color for the start (0%)
        linearGradient.append("stop")
        .attr("offset", "0%")
        .attr("stop-color", "#FFFFDD"); //light blue

        linearGradient.append("stop")
        .attr("offset", "50%")
        .attr("stop-color", "#3E9583"); //light blue
        //Set the color for the end (100%)
        linearGradient.append("stop")
        .attr("offset", "100%")
        .attr("stop-color", "#1F2D86"); //dark blue

        
        var legendWrapper = svg.append("g")
            .attr("id", "legend_wrapper")
            .attr('transform', `translate(${width/2 + chartOffset[0]}, ${height + chartOffset[1] + 60})`)
            // .attr("x", width/2 + chartOffset[0] - 150)
            // .attr("y", height + chartOffset[1] + 60)
        
        legendWrapper.append("text")
        .style("text-anchor", "middle")
        .text("Number of Occurrence")

        legendWrapper.append("rect")
        .attr("width", 300)
        .attr("height", 10)
        .attr("x", -150)
        .attr("y", 10)
        .style("fill", "url(#linear-gradient)");
        
        //Define x-axis
        var xAxis = d3.scaleLinear()
        .domain([0, 8000])
        .range([0, 300]);
        
        //Set up X axis
        legendWrapper.append("g")
        .attr("class", "heatmap")
        .attr("transform", "translate("+ (-150) +"," + (20) + ")")
        .call(d3.axisBottom(xAxis));
    });
        
}

function drawHeatMapTypeOfInjuriesAxisInverted(){
    d3.csv(AIRCRAFT_DATA_PATH, function(data){

        // Aggregate Total_Fatal_Injuries from incidents with the same year.
        var injuriesByYear = d3.nest()
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
            total_fatal_injuries = d3.sum(v, function (d) { return d.Total_Fatal_Injuries });
            total_serious_injuries = d3.sum(v, function (d) { return d.Total_Serious_Injuries });
            total_uninjured = d3.sum(v, function (d) { return d.Total_Uninjured });
            return_dict = {
                "Total_Fatal_Injuries":total_fatal_injuries,
                "Total_Serious_Injuries":total_serious_injuries,
                "Total_Uninjured":total_uninjured,
            }
            return return_dict
        })
        .entries(data);

        // Collect the keys to be used to create x axis
        keys = []
        injuriesByYear.forEach(element => {
            keys.push(element.key)
        })
        keys.sort()

        // Set height and width to be 90% of SVG. 
        // Chart WILL get hidden if height and width above 700px
        // Can be fixed by adjusting SVG size. 
        height = STAGE_HEIGHT * 0.9 - 100
        width = STAGE_WIDTH * 0.9 - 200
        
        // chartOffset is used to move the chart from its creation point. (moves both x and y position by offset)
        // purpose is to prevent axis from getting hidden due to being outside SVG bounding box.
        var chartOffset = [150, 50]
        // xRegionOffset move the xAxis in the +x direction by offset.
        // set this to a value > 0 if you do not want origin of chart to be at the intersection of axis.
        var xRegionOffset = 0

        // Technically, the max value of yScale should be retrieved from the dataset. 
        // But I hard coded it here as this is only for demonstration purpose
        var xScale = d3.scaleBand()
        .domain(["Total_Fatal_Injuries", "Total_Serious_Injuries", "Total_Uninjured"])
        .range([0, width])
        .padding(0.1);
        var yScale = d3.scaleBand()
        .domain(keys)
        .range([height, 0])
        .padding(0.1);  

        var myColor = d3.scaleLinear()
        .range(["#a2fafa", "#0c00ad"])
        .domain([1,8000])


        var chart = createChartWithAxis(xScale, yScale, width, height, chartOffset, xRegionOffset)  
        // Create chart title
        chart.append('text')
        .attr('class', 'title')
        .attr('x', width / 2 + chartOffset[0] + xRegionOffset)
        .attr('y', 30)
        .text('Types of Injuries per year');

        chart.selectAll()
        .data(injuriesByYear)
        .enter()
        .append("rect")
        .attr("y", function (d) { return xRegionOffset + chartOffset[1] + yScale(d.key)})
        .attr("x", function(d) { return xScale("Total_Fatal_Injuries") + chartOffset[0] })
        .attr("width", xScale.bandwidth() )
        .attr("height", yScale.bandwidth() )
        .style("fill", function(d) { return myColor(d.value["Total_Fatal_Injuries"])} );
        chart.selectAll()
        .data(injuriesByYear)
        .enter()
        .append("rect")
        .attr("y", function (d) { return xRegionOffset + chartOffset[1] + yScale(d.key)})
        .attr("x", function(d) { return xScale("Total_Serious_Injuries") + chartOffset[0] })
        .attr("width", xScale.bandwidth() )
        .attr("height", yScale.bandwidth() )
        .style("fill", function(d) { return myColor(d.value["Total_Serious_Injuries"])} );
        chart.selectAll()
        .data(injuriesByYear)
        .enter()
        .append("rect")
        .attr("y", function (d) { return xRegionOffset + chartOffset[1] + yScale(d.key)})
        .attr("x", function(d) { return xScale("Total_Uninjured") + chartOffset[0]})
        .attr("width", xScale.bandwidth() )
        .attr("height", yScale.bandwidth() )
        .style("fill", function(d) { return myColor(d.value["Total_Uninjured"])} )

        var defs = svg.append("defs");
        var linearGradient = defs.append("linearGradient")
        .attr("id", "linear-gradient");
        linearGradient
        .attr("x1", "0%")
        .attr("y1", "0%")
        .attr("x2", "100%")
        .attr("y2", "0%");
        //Set the color for the start (0%)
        linearGradient.append("stop")
        .attr("offset", "0%")
        .attr("stop-color", "#a2fafa"); //light blue

        //Set the color for the end (100%)
        linearGradient.append("stop")
        .attr("offset", "100%")
        .attr("stop-color", "#0c00ad"); //dark blue

        
        var legendWrapper = svg.append("g")
            .attr("id", "legend_wrapper")
            .attr('transform', `translate(${width/2 + chartOffset[0]}, ${height + chartOffset[1] + 60})`)
            // .attr("x", width/2 + chartOffset[0] - 150)
            // .attr("y", height + chartOffset[1] + 60)
        
        legendWrapper.append("text")
        .style("text-anchor", "middle")
        .text("Number of Occurrence")

        legendWrapper.append("rect")
        .attr("width", 300)
        .attr("height", 10)
        .attr("x", -150)
        .attr("y", 10)
        .style("fill", "url(#linear-gradient)");
        
        //Define x-axis
        var xAxis = d3.scaleLinear()
        .domain([0, 8000])
        .range([0, 300]);
        
        //Set up X axis
        legendWrapper.append("g")
        .attr("class", "heatmap")
        .attr("transform", "translate("+ (-150) +"," + (20) + ")")
        .call(d3.axisBottom(xAxis));
    }); 
}

function drawGraph3() {
    d3.csv(AIRCRAFT_DATA_PATH, function(data){

        // Aggregate Total_Fatal_Injuries from incidents with the same year.
        var incidentsByMakeAndModel = d3.nest()
		.key(function (d) { 
            k = d.Make + " " +d.Model
            return k
        })
		.rollup(function (v) {
			return d3.sum(v, function (d) {
				return 1
			}
			);
		})
        .entries(data);

        // Collect the keys to be used to create x axis
        keys = []
        incidentsByMakeAndModel = incidentsByMakeAndModel.sort(function(a,b) { return +a.value - +b.value })
        incidentsByMakeAndModel.forEach(element => {
            keys.push(element.key)
        })

        // Set height and width to be 90% of SVG. 
        // Chart WILL get hidden if height and width above 700px
        // Can be fixed by adjusting SVG size. 
        height = STAGE_HEIGHT * 0.9
        width = STAGE_WIDTH * 0.8
        
        // Technically, the max value of yScale should be retrieved from the dataset. 
        // But I hard coded it here as this is only for demonstration purpose
        var xScale = d3.scaleLinear()
        .domain([0, 650])
        .range([0, width]);
        var yScale = d3.scaleOrdinal()
        .domain(keys)
        .range(d3.range(0, height, height / keys.length));
        // chartOffset is used to move the chart from its creation point. (moves both x and y position by offset)
        // purpose is to prevent axis from getting hidden due to being outside SVG bounding box.
        var chartOffset = [150, 50]
        // xRegionOffset move the xAxis in the +x direction by offset.
        // set this to a value > 0 if you do not want origin of chart to be at the intersection of axis.
        var xRegionOffset = 10

        var chart = createChartWithAxis(xScale, yScale, width, height, chartOffset, xRegionOffset)  
        // Create chart title
        chart.append('text')
        .attr('class', 'title')
        .attr('x', width / 2 + chartOffset[0] + xRegionOffset)
        .attr('y', 30)
        .text('Number of Incidents');

        // Create bars for the chart
        chart.selectAll('rect')
		.data(incidentsByMakeAndModel)
        .enter()
        .append("rect")
        .attr("y", function (d) { return chartOffset[1] + yScale(d.key) - 5 })
        .attr("x", xScale(0) + chartOffset[0] + xRegionOffset)
		.attr("height", 10)
        .style("fill", "green")
        .transition()
        .duration(800)
        .delay(100)
        .attr("width", function (d) {
            return xScale(d.value) - xScale(0)
		})
    })

}

function drawGraph3Breakdown() {
    d3.csv(AIRCRAFT_DATA_PATH, function(data){

        // Aggregate Total_Fatal_Injuries from incidents with the same year.
        var incidentsByMakeAndModel = d3.nest()
        .key(function(d) {
            return d.Injury_Severity.split("(")[0]
        })
		.key(function (d) { 
            var k = d.Make + " " +d.Model
            return k
        })
		.rollup(function (v) {
			return d3.sum(v, function (d) {
				return 1
			}
			);
		})
        // Collect the keys to be used to create x axis
        .entries(data);
        
        // Set height and width to be 90% of SVG. 
        // Chart WILL get hidden if height and width above 700px
        // Can be fixed by adjusting SVG size. 
        height = STAGE_HEIGHT * 0.2
        width = STAGE_WIDTH * 0.8

        svg.append('text')
            .attr('class', 'title')
            .attr('x', width / 2 + 150 + 0)
            .attr('y', 30)
            .text('Number of incidents');
        
        svg.append('text')
            .attr('class', 'title')
            .attr('x', width / 2 + 150 + 0)
            .attr('y', 30+40)
            .text('by Airplanes Make and Model');
            

        headers = ["Fatal", "Non-Fatal", "Incidents"]

        var colorScale = d3.scaleOrdinal()
        .range(["red","orange", "green"])
        .domain([0,1,2])

        for(i = 0; i < 3; i++)
        {
            console.log(i)
            keys = []
            processed_data = incidentsByMakeAndModel[i].values
            console.log(incidentsByMakeAndModel)  
            processed_data = processed_data.sort(function(a,b) { return +a.value - +b.value })
            processed_data = processed_data.slice(processed_data.length-10, processed_data.length)
            processed_data.forEach(element => {
                keys.push(element.key)
            })
        
            
            
            // Technically, the max value of yScale should be retrieved from the dataset. 
            // But I hard coded it here as this is only for demonstration purpose
            var xScale = d3.scaleLinear()
            .domain([0, 650])
            .range([0, width]);
            var yScale = d3.scaleOrdinal()
            .domain(keys)
            .range(d3.range(0, height, height / keys.length));
            // chartOffset is used to move the chart from its creation point. (moves both x and y position by offset)
            // purpose is to prevent axis from getting hidden due to being outside SVG bounding box.
            var chartOffset = [150, 110 + (height+75)*i]
            // xRegionOffset move the xAxis in the +x direction by offset.
            // set this to a value > 0 if you do not want origin of chart to be at the intersection of axis.
            var xRegionOffset = 10

            var chart = createChartWithAxis(xScale, yScale, width, height, chartOffset, xRegionOffset)  
            // Create chart title
            chart.append('text')
            .attr('class', 'small_header')
            .attr('x', width / 2 + chartOffset[0] + xRegionOffset)
            .attr('y', chartOffset[1])
            .text(headers[i]);

            // Create bars for the chart
            chart.selectAll('rect')
            .data(processed_data)
            .enter()
            .append("rect")
            .attr("y", function (d) { return chartOffset[1] + yScale(d.key) - 5 })
            .attr("x", xScale(0) + chartOffset[0] + xRegionOffset)
            .attr("height", 10)
            .style("fill", colorScale(i))
            .transition()
            .duration(800)
            .delay(100)
            .attr("width", function (d) {
                return xScale(d.value) - xScale(0)
            })
            console.log(processed_data)
        }

    })
}

function drawGraph4() {
    d3.csv(AIRCRAFT_DATA_PATH, function(data){

        // Aggregate Total_Fatal_Injuries from incidents with the same year.
        var incidentsByYear = d3.nest()
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
				return 1
			}
			);
		})
        .entries(data);

        // Collect the keys to be used to create x axis
        keys = []
        incidentsByYear.forEach(element => {
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
        .domain([0, 150])
        .range([height, 0]);
        var xScale = d3.scaleOrdinal()
        .domain(keys)
        .range(d3.range(0, width, width / keys.length));
        
        // chartOffset is used to move the chart from its creation point. (moves both x and y position by offset)
        // purpose is to prevent axis from getting hidden due to being outside SVG bounding box.
        var chartOffset = [50, 50]
        // xRegionOffset move the xAxis in the +x direction by offset.
        // set this to a value > 0 if you do not want origin of chart to be at the intersection of axis.
        var xRegionOffset = 20

        var chart = createChartWithAxis(xScale, yScale, width, height, chartOffset, xRegionOffset)  
        // Create chart title
        chart.append('text')
        .attr('class', 'title')
        .attr('x', width / 2 + chartOffset[0] + xRegionOffset)
        .attr('y', 30)
        .text('Number of Incidents per year');

        // Create bars for the chart
        chart.selectAll('rect')
		.data(incidentsByYear)
        .enter()
        .append("rect")
        .attr("x", function (d) { return xRegionOffset + chartOffset[0] + xScale(d.key) - 5 })
        .attr("y", yScale(0) + chartOffset[1])
        .attr("width", "10")
        .style("fill", "green")
        .transition()
        .duration(800)
        .delay(100)
		.attr("height", function (d) {
            return yScale(0) - yScale(d.value)
		})
        .attr("y", function (d) { return yScale(d.value) + chartOffset[1] })
    })
}

function drawGraph1() {

    d3.csv(AIRCRAFT_DATA_PATH, function(data){

        // Aggregate Total_Fatal_Injuries from incidents with the same year.
        var incidentsByYear = d3.nest()
		.key(function (d) { 
            year = d.Event_Date.split("/")[2]; 
            if (year.length == 2) {
                if (parseInt(year) > 50) {
                    year = "19"+year
                } else {
                    year = "20"+year
                }
            }
            return year >= 2011
        })
        .key(function (d) { 
            return d.Injury_Severity.split("(")[0]
        })
		.rollup(function (v) {
			return d3.sum(v, function (d) {
				return 1
			}
			);
		})
        .entries(data);

        // Collect the keys to be used to create x axis
        keys = []
        var data_all = []
        incidentsByYear.forEach(element => {
            if (element.key == "true") {
                data_all = element
            }
        })
        var data = []
        data_all.values.forEach(element => {
            if (element.key != "Unavailable") {  
                data.push({
                    "key": element.key, 
                    "value": element.value
                })
            } 
        })

        // Set height and width to be 90% of SVG. 
        // Chart WILL get hidden if height and width above 700px
        // Can be fixed by adjusting SVG size. 
        var height = STAGE_HEIGHT * 0.9
        var width = STAGE_WIDTH * 0.9
        var radius = Math.min(width, height) / 2;

        var color = d3.scaleOrdinal()
            .range(["#98abc5", "#8a89a6", "#7b6888"]);

        var arc = d3.arc()
            .outerRadius(radius - 10)
            .innerRadius(0);

        var labelArc = d3.arc()
            .outerRadius(radius - 150)
            .innerRadius(radius - 150);

        var pie = d3.pie()
            .sort(null)
            .value(function(d) { return d.value; });

        
        // chartOffset is used to move the chart from its creation point. (moves both x and y position by offset)
        // purpose is to prevent axis from getting hidden due to being outside SVG bounding box.
        var chartOffset = [50, 70]
        // xRegionOffset move the xAxis in the +x direction by offset.
        // set this to a value > 0 if you do not want origin of chart to be at the intersection of axis.
        var xRegionOffset = 20

        var chart = createChartWithAxis(null, null, width, height)  

        chart.append('text')
        .attr('class', 'title')
        .attr('x', width / 2 + chartOffset[0] + xRegionOffset)
        .attr('y', 30)
        .text('Incident classification');

        chart.append('text')
        .attr('class', 'title')
        .attr('x', width / 2 + chartOffset[0] + xRegionOffset)
        .attr('y', 30+30)
        .text('from 2011 to 2016');
        

        var g = chart.selectAll(".arc")
            .data(pie(data))
        .enter().append("g")
            .attr("class", "arc")
            .attr("transform", "translate("+ (width/2 + chartOffset[0]) +", "+(height/2 + chartOffset[1])+")" );

        g.append("path")
        .attr("d", arc)
        .style("fill", function(d) { return color(d.data.value); });

        g.append("text")
        .attr("transform", function(d) { return "translate(" +labelArc.centroid(d)+ ")"; })
        .attr("dy", ".35em")
        .attr("dx", "-1em")
        .text(function(d) { return d.data.key; });

        g.append("text")
        .attr("transform", function(d) { return "translate(" +labelArc.centroid(d)+ ")"; })
        .attr("dy", "1.3em")
        .attr("dx", "-0.4em")
        .text(function(d) { return "("+d.data.value+")"; });
    })
}

/**
 * This function returns an array containing functions
 * that creates visualization to be displayed at specific step index
 */
function initializeStepsPlotsArray() {
    var plots = [
        showTitle, 
        drawGraph1,
        drawHeatMapTypeOfInjuries,
        drawGraph3Breakdown,
        drawGraph4,
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