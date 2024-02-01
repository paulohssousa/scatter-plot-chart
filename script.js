import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

const apiUrl = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json"

const json = await d3.json(apiUrl)

const width = 960;
const height = 540;
const marginTop = 20;
const marginRight = 25;
const marginBottom = 35;
const marginLeft = 60;

const parseDate = d3.timeParse("%Y")
const parseTime = d3.timeParse("%M:%S")
const formatTime = d3.timeFormat("%M:%S")

const minX = parseDate(d3.min(json, d => d.Year) - 1)
const maxX = parseDate(d3.max(json, d => d.Year) + 1)

const minY = d3.min(json, d => parseTime(d.Time));
const maxY = d3.max(json, d => parseTime(d.Time));

const xScale = d3.scaleTime()
                 .domain([minX, maxX])
                 .range([marginLeft, width - marginRight])

const yScale = d3.scaleTime()
                 .domain([maxY, minY])
                 .range([height - marginBottom, marginTop])

const svg = d3.create("svg")
              .attr("viewBox", `0 0 ${width} ${height}`)
              .attr("preserveAspectRatio", "xMinYMin meet")

const xAxis = d3.axisBottom(xScale)

const yAxis = d3.axisLeft(yScale)
                .tickFormat(formatTime)
                
d3.select("#graph")
  .append("h1")
  .attr("id", "title")
  .text("Doping in Professional Bicycle Racing")
  
d3.select("#graph")
  .append("h2")
  .attr("id", "subtitle")
  .text("35 Fastest times up Alpe d'Huez")

// x-axis
svg.append("g")
   .attr("transform", `translate(0, ${height - marginBottom})`)
   .attr("id", "x-axis")
   .call(xAxis)

//y-axis
svg.append("g")
   .attr("transform", `translate(${marginLeft}, 0)`)
   .attr("id", "y-axis")
   .call(yAxis)

svg.append("text")
   .attr("x", -height/2)
   .attr("y", 15)
   .attr("text-anchor", "middle")
   .attr("transform", `rotate(270)`)
   .text("Times in Minutes")

const rectWidth = 15

//legend
const legend = svg.append("g")
                  .attr("id", "legend")

legend
   .append("g")
   .classed("legend-label", true)
   .append("text")
   .attr("x", width - 30)
   .attr("y", height/2)
   .attr("text-anchor", "end")
   .text("Riders with doping allegations")
   
legend
   .append("g")
   .classed("legend-label", true)
   .append("text")
   .attr("x", width - 30)
   .attr("y", height/2 - 20)
   .attr("text-anchor", "end")
   .text("No doping allegations")

svg.selectAll(".legend-label")
   .append("rect")
   .attr("x", width - 20)
   .attr("y", (d, i) => height/2 + i*20 - 2*rectWidth)
   .attr("width", rectWidth)
   .attr("height", rectWidth)
   .attr("fill",(d, i) => i ? "#bf0d28" : "#d68418")

// dots
svg.selectAll("circle")
   .data(json)
   .enter()
   .append("circle")
   .classed("dot", true)
   .attr("cx", d => xScale(parseDate(d.Year)))
   .attr("cy", d => yScale(parseTime(d.Time)))
   .attr("data-xvalue", d => parseDate(d.Year))
   .attr("data-yvalue", d => parseTime(d.Time).toUTCString())
   .attr("r", 6)
   .attr("stroke", "black")
   .attr("fill", d => d.Doping === "" ? "#d68418" : "#bf0d28")

//tooltip
const tooltip = d3.select("#graph")
                  .append("div")
                  .attr("id", "tooltip")
                  .style("opacity", 0)

svg.selectAll(".dot")
   .on("mouseover", (event, datum) => {
      tooltip
         .html(() => {
            return `<div>${datum.Name}; ${datum.Nationality}</div>
                    <div>Year: ${datum.Year}, Time: ${datum.Time}</div>
                    <div>${datum.Doping}</div>`
         })
         .attr("data-year", parseDate(datum.Year))
         .style("top", `${event.pageY - 70}px`)
         .style("left", `${event.pageX + 10}px`)
         .style("opacity", 0.9)
   })
   .on("mouseout", (event, datum) => {
      tooltip
         .style("opacity", 0)
         .html("")
   })

graph.append(svg.node());
