// @TODO: YOUR CODE HERE!
var svgWidth = 960;
var svgHeight = 500;

// Define the chart's margins as an object
var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};



// Define dimensions of the chart area
var chartWidth = svgWidth - margin.left - margin.right;
var chartHeight = svgHeight - margin.top - margin.bottom;
// Select body, append SVG area to it, and set its dimensions
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append a group area, then set its margins
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);
  
var chosenXAxis = "poverty";
var chosenYAxis = "healthcare"

function xScale(healthData, chosenXAxis) {
  // create scales
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(healthData, d => d[chosenXAxis]) * 0.8,
      d3.max(healthData, d => d[chosenXAxis]) * 1.2
    ])
    .range([0, chartWidth]);

  return xLinearScale;

}
function yScale(healthData, chosenYAxis) {
  // create scales
  var yLinearScale = d3.scaleLinear()
    .domain([d3.min(healthData, d => d[chosenYAxis]) * 0.8,
      d3.max(healthData, d => d[chosenYAxis]) * 1.2
    ])
    .range([0, chartWidth]);

  return yLinearScale;

}

// function used for updating xAxis var upon click on axis label
function renderAxes(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);

  xAxis.transition()
    .duration(1000)
    .call(bottomAxis);

  return xAxis;
}
function renderAxes(newYScale, yAxis) {
  var leftAxis = d3.axisLeft(newYScale);

  yAxis.transition()
    .duration(1000)
    .call(leftAxis);

  return yAxis;
}

function renderCircles(circlesGroup, newXScale, chosenXAxis) {

  circlesGroup.transition()
    .duration(1000)
    .attr("cx", d => newXScale(d[chosenXAxis]));

  return circlesGroup;
}

function updateToolTip(chosenXAxis, circlesGroup) {

  if (chosenXAxis === "poverty") {
    var label = "In Poverty (%)";
  }
  else {
    var label = "Age";
  }

  var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([80, -60])
    .html(function(d) {
      return (`${d.poverty}<br>${label} ${d[chosenXAxis]}`);
    });

  circlesGroup.call(toolTip);

  circlesGroup.on("mouseover", function(data) {
    toolTip.show(data);
  })
    // onmouseout event
    .on("mouseout", function(data, index) {
      toolTip.hide(data);
    });

  return circlesGroup;
}

// Load data from forcepoints.csv
d3.csv("./assets/data/data.csv").then(function(healthData) {
  console.log("I am here.");
  // if (err) throw err;
    // Print the forceData
    console.log(healthData);
    // Format the date and cast the force value to a number
  healthData.forEach(function(data) {
    data.poverty = +data.poverty;
    data.healthcare = +data.healthcare;
    data.smokes = +data.smokes;
    data.age = +data.age;
  });

  var xLinearScale = xScale(healthData, chosenXAxis);

  var yLinearScale = d3.scaleLinear()
    .domain([0, d3.max(healthData, d => d.healthcare)])
    .range([chartHeight, 0]);

  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  var xAxis = chartGroup.append("g")
    .classed("x-axis", true)
    .attr("transform", `translate(0, ${chartHeight})`)
    .call(bottomAxis);

  chartGroup.append("g")
    .call(leftAxis);

  var circlesGroup = chartGroup.selectAll("circle")
    .data(healthData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d[chosenXAxis]))
    .attr("cy", d => yLinearScale(d.healthcare))
    .attr("r", 20)
    .attr("fill", "pink")
    .attr("opacity", ".5");

  var labelsGroup = chartGroup.append("g")
    .attr("transform", `translate(${chartWidth / 2}, ${chartHeight + 20})`);

  var povertyLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 20)
    .attr("value", "poverty") // value to grab for event listener
    .classed("active", true)
    .text("In Poverty (%)");

  var ageLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 40)
    .attr("value", "age") // value to grab for event listener
    .classed("inactive", true)
    .text("Age");

  chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - (chartHeight / 2))
    .attr("dy", "1em")
    .classed("axis-text", true)
    .text("Lacks Healthcare (%)");

  var circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

  labelsGroup.selectAll("text")
    .on("click", function() {
      // get value of selection
      var value = d3.select(this).attr("value");
      if (value !== chosenXAxis) {

        // replaces chosenXAxis with value
        chosenXAxis = value;

        xLinearScale = xScale(healthData, chosenXAxis);

        // updates x axis with transition
        xAxis = renderAxes(xLinearScale, xAxis);

        // updates circles with new x values
        circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis);

        // updates tooltips with new info
        circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

        // changes classes to change bold text
        if (chosenXAxis === "poverty") {
          ageLabel
            .classed("active", true)
            .classed("inactive", false);
          povertyLabel
            .classed("active", false)
            .classed("inactive", true);
        }
        else {
          ageLabel
            .classed("active", false)
            .classed("inactive", true);
          povertyLabel
            .classed("active", true)
            .classed("inactive", false);
        }
      }
    });
});







  //   var xLinearScale = d3.scaleLinear()
  //       .domain([0, d3.max(healthData, d => d.poverty)])
  //       .range([0, chartWidth]);
  //   var xxLinearScale = d3.scaleLinear()
  //       .domain([0, d3.max(healthData, d => d.age)])
  //       .range([0, chartWidth]);

  //   var yLinearScale = d3.scaleLinear()
  //       .domain([0, d3.max(healthData, d => d.healthcare)])
  //       .range([chartHeight, 0]);
  //   var yyLinearScale = d3.scaleLinear()
  //       .domain([0, d3.max(healthData, d => d.smokes)])
  //       .range([chartHeight, 0]);
    
    
  //   var bottomAxis = d3.axisBottom(xLinearScale);
  //   var bottomAxis2 = d3.axisBottom(xxLinearScale);
  //   var leftAxis = d3.axisLeft(yLinearScale);
  //   var leftAxis2 = d3.axisLeft(yyLinearScale);

  //   chartGroup.append("g")
  //     .attr("transform", `translate(0, ${chartHeight})`)
  //     .call(bottomAxis);

  //   chartGroup.append("g")
  //     .call(leftAxis);

  //     chartGroup.append("g")
  //     .attr("transform", `translate(0, ${chartHeight})`)
  //     .call(bottomAxis2);

  //   chartGroup.append("g")
  //     .call(leftAxis2);

  //     var circlesGroup = chartGroup.selectAll("circle")
  //     .data(healthData)
  //     .enter()
  //     .append("circle")
  //     .attr("cx", d => xLinearScale(d.poverty))
  //     .attr("cy", d => yLinearScale(d.healthcare))
  //   //   .attr("cx", d => xxLinearScale(d.smokes))
  //   //   .attr("cy", d => yyLinearScale(d.age))
  //     .attr("r", "15")
  //     .attr("fill", "pink")
  //     .attr("opacity", ".5");

  //   chartGroup.append("text")
  //       .attr("transform", "rotate(-90)")
  //       .attr("y", 0 - margin.left + 40)
  //       .attr("x", 0 - (chartHeight / 2))
  //       .attr("dy", "1em")
  //       .attr("class", "axisText")
  //       .text("Lacks Healthcare");

  //   chartGroup.append("text")
  //       .attr("transform", `translate(${chartWidth / 2}, ${chartHeight + margin.top + 30})`)
  //       .attr("class", "axisText")
  //       .text("In Poverty");
  // });