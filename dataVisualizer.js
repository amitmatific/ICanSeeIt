// set the dimensions and margins of the graph
var margin = {top: 10, right: 40, bottom: 30, left: 30},
    width = 1200 - margin.left - margin.right,
    height = 700 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svG = d3.select("#scatter_area")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")")
    .attr("font-size", 10)
    .attr("font-family", "sans-serif")
    .attr("text-anchor", "middle");

var selectedSource = "web";
var data = null;
var doc = this;

var selectSource = function(source) {
    clearVisualization();
    visualize(doc.data, source.value);
};

var clearVisualization = function () {
    
};

var data = fetch("data.json")
    .then(function(response) {return response.json()} )
    .then(function(data) {
        return data;
    })
    .then(function(data) {
        doc.data = data.data;
        visualize(data.data, selectedSource);
    });

var visualize = function(data, selectedSource) {
    // X scale and Axis
    var xPosition = d3.scaleLinear()
        .domain([0, 100])         // This is the min and the max of the data: 0 to 100 if percentages
        .range([0, width]);       // This is the corresponding value I want in Pixel
    svG
        .append('g')
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(xPosition));

// X scale and Axis
    var yPosition = d3.scaleLinear()
        .domain([0, 100])         // This is the min and the max of the data: 0 to 100 if percentages
        .range([height, 0]);       // This is the corresponding value I want in Pixel
    svG
        .append('g')
        .call(d3.axisLeft(yPosition));

    var color = d3.scaleSequential()
        .domain([0, 100])
        .interpolator(d3.interpolateRainbow);

    var opacity = d3.scaleLinear()
        .domain([0,100])
        .range([0.3, 1]);

    var border = function(d) {
        return d.source[selectedSource]["finishRate"] > 30 ? 0 : 4;
    };

// Add 3 dots for 0, 50 and 100%
    let element = svG
        .selectAll("whatever")
        .data(data);
    var elemEnter = element.enter()
        .append("g");
    elemEnter
        .append("circle")
        .attr("cx", function(d){
            return xPosition(d.source[selectedSource]["finishRate"])
        })
        .attr("cy", function(d){
            return yPosition(d.source[selectedSource]["noSubmitRate"])
        })
        .attr("r", function(d){ return d.source[selectedSource]["userCount"]/1000 })
        .attr("fill", d => color(d.source[selectedSource]["noSubmitRate"]))
        .attr("opacity", d => opacity(d.source[selectedSource]["finishRate"]))
        .style("stroke", "red")
        .style("stroke-width", function(d){ return border(d)});
    
    elemEnter.append("text")
        .attr("x", function(d){ return xPosition(d.source.web.finishRate) })
        .attr("y", function(d){ return yPosition(d.source.web.noSubmitRate) })
        .text(function(d){return d.episodeName});

    elemEnter.append("svg:title")
        .attr("x", function(d){ return xPosition(d.source.web.finishRate) })
        .attr("y", function(d){ return yPosition(d.source.web.noSubmitRate) })
        .text(function(d){return d.episodeName});
};

