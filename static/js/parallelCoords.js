 function regionCrimeStatsChart(attributes)
{
    if(d3.select('#regionCrimeStats svg')) d3.select('#regionCrimeStats svg').remove();
    data = [];
      chart_data = JSON.parse(attributes.chart_data);
      for(var i=0;i<chart_data.length;i++){                  
        data.push(chart_data[i]);
      }
    var margin = {top: 30, right: 40, bottom: 20, left: 200},
    width = 1360 - margin.left - margin.right,
    height = 800 - margin.top - margin.bottom;
      dimHeight = 400;
      rangeArray = [];
      len = data.length;
      for(var i=0;i<len;i++){        
        if(i==len-1){
          rangeArray.push(Math.round(dimHeight));            
        }else{
          rangeArray.push(Math.round((i*dimHeight)/len)); 
        }
        
      }
      rangeArray.push(dimHeight);
      console.log(rangeArray);
var dimensions = [
  {
    name: "countries",
    scale: d3.scaleOrdinal().range(rangeArray),
    type: "string"
  },
  {
    name: "pf_ss_homicide",
    scale: d3.scaleLinear().range([0, dimHeight]),
    type: "number"
  },
  {
    name: "pf_ss_disappearances_disap",
    scale: d3.scaleLinear().range([dimHeight, 0]),
    type: "number"
  },
  {
    name: "pf_ss_disappearances_violent",
    scale: d3.scaleLinear().range([dimHeight, 0]),
    type: "number"
  },
  {
    name: "pf_ss_disappearances_organized",
    scale: d3.scaleLinear().range([dimHeight, 0]),
    type: "number"
  },
  {
    name: "pf_ss_disappearances_fatalities",
    scale: d3.scaleLinear().range([dimHeight, 0]),
    type: "number"
  },
  {
    name: "pf_ss_disappearances_injuries",
    scale: d3.scaleLinear().range([dimHeight, 0]),
    type: "number"
  },
  {
    name: "pf_rol",
    scale: d3.scaleLinear().range([dimHeight, 0]),
    type: "number"
  },
];

var x = d3.scaleOrdinal()
    .domain(dimensions.map(function(d) {return d.name; }))
    .range([0,width/8, width/4,3*(width/8),width/2,5*(width/8),6*(width/8),7*(width/8),width]);
    
var line = d3.line()
    .defined(function(d) { return !isNaN(d[1]); });

var yAxis = d3.axisLeft()
    // .orient("left");


var svg = d3.select("#regionCrimeStats").append("svg")
    .attr("width", width + margin.left + margin.right)
    // .attr("height", height + margin.top + margin.bottom)
    .attr("height", 625)
  .append("g")
    .attr("transform", "translate(" + 140 + "," + margin.left + ")");

 dim = svg.selectAll(".dimension")
        .data(dimensions)
    .enter().append("g")
        .attr("transform", function(d) {return "translate(" + x(d.name) + ")"; });

     
    

  dimensions.forEach(function(dimension) {
    dimension.scale.domain(dimension.type === "number"
        ? d3.extent(data, function(d) { return +d[dimension.name]; })        
        : data.map(function(d) { return d[dimension.name]; }).sort());
        // : $.map(function(d){ return d[dimension.name];}).sort());
        // jQuery.map(data,function(d){})

  });

  svg.append("g")
      .attr("class", "background")
    .selectAll("path")
      .data(data)
    .enter().append("path")
      .attr("d", draw);

  svg.append("g")
      .attr("class", "foreground")
    .selectAll("path")
      .data(data)
    .enter().append("path")
      .attr("d", draw);

  dim.append("g")
      .attr("class", "axis")
    .each(function(d) {d3.select(this).call(yAxis.scale(d.scale)); })
    .append("text")
      .attr("class","title")
      .attr("text-anchor", "start")      
      .attr("y", -9)
      .text(function(d) { return attributeJson[d.name]; });

  var ordinal_labels = svg.selectAll(".axis text")
      .on("mouseover", mouseover)
      .on("mouseout", mouseout);

  var projection = svg.selectAll(".background path,.foreground path")
      .on("mouseover", mouseover)
      .on("mouseout", mouseout);

  function mouseover(d) {
    svg.classed("active", true);

    if (typeof d === "string") {
      projection.classed("inactive", function(p) { return p.name !== d; });
      projection.filter(function(p) { return p.name === d; }).each(moveToFront);
      ordinal_labels.classed("inactive", function(p) { return p !== d; });
      ordinal_labels.filter(function(p) { return p === d; }).each(moveToFront);
    } else {
      projection.classed("inactive", function(p) { return p !== d; });
      projection.filter(function(p) { return p === d; }).each(moveToFront);
      ordinal_labels.classed("inactive", function(p) { return p !== d.name; });
      ordinal_labels.filter(function(p) { return p === d.name; }).each(moveToFront);
    }
  }

  function mouseout(d) {
    svg.classed("active", false);
    projection.classed("inactive", false);
    ordinal_labels.classed("inactive", false);
  }

  function moveToFront() {
    this.parentNode.appendChild(this);
  }


function draw(d) {    
  return line(dimensions.map(function(dimension) {
    //   console.log(dimension.scale(d[dimension.name]));
    return [x(dimension.name), dimension.scale(d[dimension.name])];
  }));
}
}