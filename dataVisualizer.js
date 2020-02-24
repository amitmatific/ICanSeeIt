// set the dimensions and margins of the graph
var margin = {top: 10, right: 40, bottom: 30, left: 30};
var width = 1200 - margin.left - margin.right;
var height = 600 - margin.top - margin.bottom;

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
    TransitionTo(doc.data, source.value);
};

var data = fetch("episode.json")
    .then(function(response) {return response.json()} )
    .then(function(data) {
        return data;
    })
    .then(function(data) {
        doc.data = data.data;
        visualize(data.data, selectedSource);
    });

// X scale and Axis
var xPosition = d3.scaleLinear()
    .domain([0, 100])         // This is the min and the max of the data: 0 to 100 if percentages
    .range([0, width]);       // This is the corresponding value I want in Pixel

// X scale and Axis
var yPosition = d3.scaleLinear()
    .domain([0, 100])         // This is the min and the max of the data: 0 to 100 if percentages
    .range([height, 0]);       // This is the corresponding value I want in Pixel

    var color = d3.scaleLinear()
        .domain([100, 25, 15, 10, 5, 0])
        .range(['#d73027',
            '#f46d43',
            '#fdae61',
            '#fee08b',
            '#a6d96a',
            '#66bd63'])
        .interpolate(d3.interpolateHcl);

var opacity = d3.scaleLinear()
    .domain([0,100])
    .range([0.3, 1]);

var border = function(d, selectedSource) {
    return d.source[selectedSource]["finishRate"] > 30 ? 0 : 4;
};

var episodeText = function (d) {
    if (d.source[selectedSource]["userCount"] > 500) {
        return d.episodeName.substring(0, 6)
    } else {
        return "";
    }
};

var strokeWidth = function(d) {
    if (selectedSource === "total") {
        return border(d)
    } else {
        return 0;
    }
};

var TransitionTo = function (data, selectedSource) {
    let element = svG
        .selectAll("circle")
        .data(data);
    element
        .transition()
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
        .style("stroke-width", d => strokeWidth(d));

    svG.selectAll("text")
        .remove();
    var elements = svG
        .selectAll("Whatever")
        .data(data);
    elements
        .enter()
        .append("text")
        .attr("x", function(d){ return xPosition(d.source[selectedSource]["finishRate"]) })
        .attr("y", function(d){ return yPosition(d.source[selectedSource]["noSubmitRate"]) })
        .text(function(d){ return episodeText(d)});

    elements.append("title")
        .attr("x", function(d){ return xPosition(d.source[selectedSource]["finishRate"]) })
        .attr("y", function(d){ return yPosition(d.source[selectedSource]["noSubmitRate"]) })
        .text(function(d){return d.episodeName});

    // var texts = svG
    //     .selectAll("text")
    //     .data(data);
    // texts
    //     .transition()
    //     .attr("x", function(d){ return xPosition(d.source[selectedSource]["finishRate"]) })
    //     .attr("y", function(d){ return yPosition(d.source[selectedSource]["noSubmitRate"]) });
    //
    // var titles = svG
    //     .selectAll("title")
    //     .data(data);
    // titles
    //     .transition()
    //     .attr("x", function(d){ return xPosition(d.source[selectedSource]["finishRate"]) })
    //     .attr("y", function(d){ return yPosition(d.source[selectedSource]["noSubmitRate"]) });



};

var visualize = function(data, selectedSource) {


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
        .style("stroke-width", d => strokeWidth(d));
    
    elemEnter.append("text")
        .attr("x", function(d){ return xPosition(d.source[selectedSource]["finishRate"]) })
        .attr("y", function(d){ return yPosition(d.source[selectedSource]["noSubmitRate"]) })
        .text(function(d){ return episodeText(d)});

    elemEnter.append("title")
        .attr("x", function(d){ return xPosition(d.source[selectedSource]["finishRate"]) })
        .attr("y", function(d){ return yPosition(d.source[selectedSource]["noSubmitRate"]) })
        .text(function(d){return d.episodeName});
};

