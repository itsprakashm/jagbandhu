var padding = {top:20, right:40, bottom:0, left:0},
            w = 370 - padding.left - padding.right,
            h = 370 - padding.top  - padding.bottom,
            r = Math.min(w, h)/2,
            rotation = 0,
            oldrotation = 0,
            picked = 10000000,
            oldpick = [],
            color = d3.scale.category20();//category20c()
            //randomNumbers = getRandomNumbers();
        //http://osric.com/bingo-card-generator/?title=HTML+and+CSS+BINGO!&words=padding%2Cfont-family%2Ccolor%2Cfont-weight%2Cfont-size%2Cbackground-color%2Cnesting%2Cbottom%2Csans-serif%2Cperiod%2Cpound+sign%2C%EF%B9%A4body%EF%B9%A5%2C%EF%B9%A4ul%EF%B9%A5%2C%EF%B9%A4h1%EF%B9%A5%2Cmargin%2C%3C++%3E%2C{+}%2C%EF%B9%A4p%EF%B9%A5%2C%EF%B9%A4!DOCTYPE+html%EF%B9%A5%2C%EF%B9%A4head%EF%B9%A5%2Ccolon%2C%EF%B9%A4style%EF%B9%A5%2C.html%2CHTML%2CCSS%2CJavaScript%2Cborder&freespace=true&freespaceValue=Web+Design+Master&freespaceRandom=false&width=5&height=5&number=35#results
        var data = [
                    {"label":"5% Discount",  "value":5,  "question":""}, // padding
                    {"label":"8% Discount",  "value":8,  "question":""}, //font-family
                    {"label":"12% Discount",  "value":12,  "question":""}, //color
                    {"label":"16% Discount",  "value":16,  "question":""}, //font-weight
                    {"label":"20% Discount",  "value":20,  "question":""}, //font-size
                    {"label":"No Discount",  "value":0,  "question":""} //background-color
                    
        ];
        var svg = d3.select('#chart')
            .append("svg")
            .data([data])
            .attr("width",  w + padding.left + padding.right)
            .attr("height", h + padding.top + padding.bottom);
        var container = svg.append("g")
            .attr("class", "chartholder")
            .attr("transform", "translate(" + (w/2 + padding.left) + "," + (h/2 + padding.top) + ")");
        var vis = container
            .append("g");
            
        var pie = d3.layout.pie().sort(null).value(function(d){return 1;});
        // declare an arc generator function
        var arc = d3.svg.arc().outerRadius(r);
        // select paths, use arc generator to draw
        var arcs = vis.selectAll("g.slice")
            .data(pie)
            .enter()
            .append("g")
            .attr("class", "slice");
            
        arcs.append("path")
            .attr("fill", function(d, i){ return color(i); })
            .attr("d", function (d) { return arc(d); });
        // add the text
        arcs.append("text").attr("transform", function(d){
                d.innerRadius = 0;
                d.outerRadius = r;
                d.angle = (d.startAngle + d.endAngle)/2;
                return "rotate(" + (d.angle * 180 / Math.PI - 90) + ")translate(" + (d.outerRadius - 5) +")";
            })
            .attr("text-anchor", "end")
            .html( function(d, i) {
                return data[i].label;
            });
        container.on("click", spin);
        var SelectedItem ='';
        function spin(d){
            
            container.on("click", null);
            wheel.play();
            //all slices have been seen, all done
            console.log("OldPick: " + oldpick.length, "Data length: " + data.length);
            if(oldpick.length == data.length){
                console.log("done");
                container.on("click", null);
                return;
            }
            var  ps       = 360/data.length,
                 pieslice = Math.round(1440/data.length),
                 rng      = Math.floor((Math.random() * 1440) + 360);
                
            rotation = (Math.round(rng / ps) * ps);
            
            picked = Math.round(data.length - (rotation % 360)/ps);
            picked = picked >= data.length ? (picked % data.length) : picked;
            if(oldpick.indexOf(picked) !== -1){
                d3.select(this).call(spin);
                return;
            } else {
                //oldpick.push(picked);
            }
           
            rotation += 90 - Math.round(ps/2);
            vis.transition()
                .duration(5000)
                .attrTween("transform", rotTween)
                .each("end", function(){
                    //mark question as seen
                    // d3.select(".slice:nth-child(" + (picked + 1) + ") path")
                    //     .attr("fill", "#111");
                    //populate question
                    
                    oldrotation = rotation;
              
                    /* Get the result value from object "data" */
                    console.log(data[picked].value);
                    SelectedItem=data[picked].value;
              
                    /* Comment the below line for restrict spin to sngle time */
                    container.on("click", spin);
                });
                setTimeout(function () {
                    
                    if(SelectedItem==0){
                        swal(
                            "Opps",
                            "Better Luck Next Time",
                            "error"
                          );
                    }else{
                        applause.play();
                        swal(
                            "Congratulations",
                            "You Won The " + SelectedItem + "% Discount.",
                            "success"
                          );
                    }
                    
                  }, 5500);
        }
        
        //make arrow
        svg.append("g")
            .attr("transform", "translate(" + (w + 0 + 16) + "," + ((h/2)+padding.top) + ")")
            .append("path")
            .attr("d", "M-" + (r*.15) + ",0L0," + (r*.05) + "L0,-" + (r*.05) + "Z")
            .style({"fill":"black"});
        //draw spin circle
        container.append("circle")
            .attr("cx", 0)
            .attr("cy", 0)
            .attr("r", 30)
            .style({"fill":"gray","cursor":"pointer"});
        //spin text
        container.append("text")
            .attr("x", 0)
            .attr("y", 4)
            .attr("text-anchor", "middle")
            .text("SPIN")
            .style({"font-weight":"bold", "font-size":"16px","color":"white"});
        
        
        function rotTween(to) {
          var i = d3.interpolate(oldrotation % 360, rotation);
          return function(t) {
            return "rotate(" + i(t) + ")";
          };
        }
        