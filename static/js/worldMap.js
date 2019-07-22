function createWorldMap(selected_year)
      {
        var element = document.getElementsByTagName("svg");
        if(element) d3.select("svg").remove();
        var format = d3.format(",");

        var tip = d3.tip()
                    .attr('class','d3-tip')
                    .offset([-10,0])
                    .html(function(d){
                      return "<strong>Country: </strong><span class='details'>"+ d.properties.name +"<br></span>"+"<strong>Rank: </strong><span class='details'>" + format(d.rank)+"</span>"; 
                    })        

        var margin = {top: 0, right: 0, bottom: 0, left:0},
                      width = 860 - margin.left - margin.right;
                      height = 900 - margin.top - margin.bottom;
        
        var padding = 20;

        var color = d3.scaleThreshold()
        .domain([15,30,45,60,75,90,105,120,135])
        .range(["rgb(247,251,255)", "rgb(222,235,247)", "rgb(198,219,239)", "rgb(158,202,225)", "rgb(107,174,214)", "rgb(66,146,198)","rgb(33,113,181)","rgb(8,81,156)","rgb(8,48,107)","rgb(3,19,43)"]);

        var path = d3.geoPath();

        var svg = d3.select("#worldMap")
                    .append("svg")
                    .attr("width",600)
                    .attr("height",490)
                    .attr("transform", "translate(-50,-100)")
                    .append("g")
                    .attr("class","map")
                    .attr("transform", "translate(130,-120)");
                    

         var projection = d3.geoMercator()
                            .scale(90)
                            .translate([width/2, height/1.5]);
         var path = d3.geoPath().projection(projection);
         svg.call(tip);
         queue()
          .defer(d3.json, "/static/json/world_countries.json")
          .defer(d3.tsv, "/static/json/world_ranking_"+selected_year+".tsv")
          .await(createMap);

          function createMap(error, data, rank) {
          var rankById = {};
          for(var r in rank){
              if(rank[r]['rank']== undefined){
                  delete rank[r];
              }
          }
          rank.forEach(function(d) {rankById[d.id] = +d.rank; });
          data.features.forEach(function(d) { 
           d.rank = rankById[d.id];});
          
            
            
          svg.append("g")
              .attr("class", "countries")
            .selectAll("path")
              .data(data.features)
            .enter().append("path")
              .attr("d", path)
              .style("fill", function(d) { return color(rankById[d.id]); })
              .style('stroke', 'white')
              .style('stroke-width', 1.5)
              .style("opacity",0.8)
              .attr("transform", "translate(-300,-150)")
              // tooltips
                .style("stroke","white")
                .style('stroke-width', 0.3)
                .on('mouseover',function(d){                    
                  if(d.rank>0){
                    tip.show(d);  
                    d3.select(this)
                    .style("opacity", 1)
                    .style("stroke","white")
                    .style("stroke-width",3);
                  }
                  
                  
                })
                .on('mouseout', function(d){                                    
                    tip.hide(d);
                    d3.select(this)
                      .style("opacity", 0.8)
                      .style("stroke","white")
                      .style("stroke-width",0.3);                  
                })
                .on('click',function(d){
                  if(d.rank>0){
                    createBarChart(d,selected_year);  
                    createRegionCrimeStatsChart(d,selected_year);
                  }                                                        
                });

          svg.append("path")
              .datum(topojson.mesh(data.features, function(a, b) { return a.id !== b.id; }))
               // .datum(topojson.mesh(data.features, function(a, b) { return a !== b; }))
              .attr("class", "names")
              .attr("d", path);
        }
      }