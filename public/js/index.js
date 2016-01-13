$(function(){
  
});

  $('.wrap').on('click', function(){
    var chk = $('.slctn').is(':visible') ? true : false;
    if(chk){
      $('.slctn').hide();
    }else {
      $('.slctn').show();
    }
  });

  /* for single selection */
  // $('.slctn').on('click', '.chk', function(){
  //   $self = $(this);
  //   $self.siblings().closest('input[type = checkbox]').removeAttr('checked');
  //   $('#y-option').val($self.next().html());
  //   console.log($self.html());
  // });

  /* for multiple selections */
  var store = [];
  $('.slctn').on('click', '.chk', function(){
    $self = $(this);
    if($self.is(':checked')){
      store.push($self.next().html());
      $('#y-option').val($self.next().html());
    }else{
      var x = store.indexOf($self.next().html());
      store.splice(x,1);
      $('#y-option').val('');
    }
  });

  var startDate,
      endDate,
      y,
      data = {},
      flag;
  $('.submit').on('click', function(){
    if($('.focus')){
      $('.focus').empty();
    }

    data.startDate = $("#datepicker-start").val();
    data.endDate = $("#datepicker-end").val();
    data.y = store;

    $.ajax({
      url: '/fetchData',
      data : {data : data},
      cache: 'false',
      success: function(data){

        var margin = {top: 10, right: 10, bottom: 100, left: 40},
            margin2 = {top: 230, right: 10, bottom: 20, left: 40},
            width = 500 - margin.left - margin.right,
            height = 300 - margin.top - margin.bottom;

        var parseDate = d3.time.format("%b %Y").parse;

        var color = ["#27ae60","#B3A681"];

        /* scale x and y for axis */
        var x = d3.time.scale().range([0, 800]), /* it can be from 0 to width */
            y = d3.scale.linear().range([height,0]);
        /* add x, y from above to svg axis */
        var xAxis = d3.svg.axis().scale(x).orient("bottom"),
            yAxis = d3.svg.axis().scale(y).orient("left");

        // var zoom = d3.behavior.zoom()
        // .x(x)
        // .y(y)
        // .scaleExtent([0, 2])
        // .on("zoom", zoomed);  

        /* append svg to the body of the page setting height and width */
        var svg = d3.select("body").append("svg")
            // .call(zoom)
            .attr("width", width + margin.left + margin.right + 500)
            .attr("height", height + margin.top + margin.bottom + 100);
        /* define container i.e. "g" to hold svg data */
        var focus = svg.append("g")
            .attr("class", "focus")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        var count = $.map(JSON.parse(data), function(value, index) {
            return [value];
        });

        for(var j=0; j<count.length; j++){
          var chk = count[j];
          chk.forEach(function(d) {
            d.date = parseDate(d.date);
            d.price = d.price;
          });
        }

        /*domain defines min and max parameters to cover with intervals & range defines from where to 
        start and where to end. */
        x.domain(d3.extent(count[0].map(function(d) { return d.date; })));
        y.domain([0, d3.max(count[0].map(function(d) { return d.price; }))]);   

        focus.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);

        focus.append("g")
            .attr("class", "y axis")
            .call(yAxis);
   
        /* get the data */
        
        // var count = JSON.parse(data);
        for(var i=0; i<count.length; i++){
          /* define line drawing based on the data passed */
          var data = count[i];
          var line = d3.svg.line()
            .interpolate("monotone")
            .x(function(d) { return x(d.date); })
            .y(function(d) { return y(d.price); });

          /* append x-axis, y-axis and line to the svg */
          focus.append("path")
              .datum(data)
              .attr("class", "line")
              .attr("stroke", color[i])
              .attr("d", line);
        
          var statisticData = calcMeanSdVar(data);
          var meanData = [{date: data[0].date, price: statisticData.mean}, 
                          {date: data[data.length - 1].date, price: statisticData.mean}];
          var lineStatistic = d3.svg.line()            
              .x(function(d) { return x(d.date); })
              .y(function(d) { return y(d.price); });

          focus.append('path')
            .datum(meanData)
            .attr("class", "meanline")
            .attr("d", lineStatistic );


          var sdMinData = [{date: data[0].date, price: statisticData.mean - statisticData.deviation}, 
                           {date: data[data.length - 1].date, price: statisticData.mean - statisticData.deviation}];

          focus.append('path')
            .datum(sdMinData)
            .attr("class", "sdline min")
            .attr("d", lineStatistic )
            .attr("stroke", color[i] );

          var sdMaxData = [{date: data[0].date, price: statisticData.mean + statisticData.deviation}, 
                           {date: data[data.length - 1].date, price: statisticData.mean + statisticData.deviation}];

          focus.append('path')
            .datum(sdMaxData)
            .attr("class", "sdline max")
            .attr("d", lineStatistic )
            .attr("stroke", color[i]);    
          function calcMeanSdVar(values) {
            var r = {mean: 0, variance: 0, deviation: 0}, t = values.length;
            for(var m, s = 0, l = t; l--; s += parseInt(values[l].price));
            for(m = r.mean = s / t, l = t, s = 0; l--; s += Math.pow(parseInt(values[l].price) - m, 2));
            return r.deviation = Math.sqrt(r.variance = s / t), r;
          }
        }
        // function zoomed() {
        //   svg.select(".x.axis").call(xAxis);
        //   svg.select(".y.axis").call(yAxis);   
        //   svg.selectAll('path.line').attr('d', line);  
        // }       
      },
      error: function(error){
        console.log(error);
      }
    });
  });

