var w = 800,
    h = 400,
    padding = 25;

var datasett = [
    [10, 10],
    [20, 50],
    [30, 120],
    [40, 80],
    [50, 90],
    [60, 50],
    [70, 70],
    [80, 90],
    [90, 150],
    [100, 50],
    [110, 40],
    [120, 70],
    [130, 20],
    [140, 40],
    [200, 30]
];
var getDataset = [document.getElementsByClassName('hold_data')[0].dataset.info];
var dataset = JSON.parse(getDataset[0]);
console.log(dataset);
// console.log(typeof JSON.parse(dataset));
/*create svg element*/
var svg = d3.select('#container')
    .append('svg')
    .attr('width', w)
    .attr('height', h)
    .attr('id', 'chart');

/*x scale*/
var xScale = d3.scale.linear()
    .domain([0, d3.max(dataset, function(d) {
        return d[0];
    })])
    .range([padding, w - padding]);

/*y scale*/
var yScale = d3.scale.linear()
    .domain([0, d3.max(dataset, function(d) {
        return d[1];
    })])
    .range([h - padding, padding]);

/*x axis*/
var xAxis = d3.svg.axis()
    .scale(xScale)
    .orient('bottom');

/*append x axis*/
svg.append('g')
    .attr({
        'class': 'xaxis',
        'transform': 'translate(0,' + (h - padding) + ')'
    })
    .call(xAxis);

/*y axis*/
var yAxis = d3.svg.axis()
    .scale(yScale)
    .orient('left');

/*append y axis*/
svg.append('g')
    .attr({
        'class': 'yaxis',
        'transform': 'translate(' + padding + ',0)'
    })
    .call(yAxis);

/*define line*/
var lines = d3.svg.line()
    .x(function(d) {
        return xScale(d[0])
    })
    .y(function(d) {
        return yScale(d[1])
    })
    .interpolate('monotone');

/*append line*/
var path = svg.append('path')
    .attr({
        'd': lines(dataset),
        'fill': 'none',
        'class': 'lineChart'
    });

/*get length*/
var length = svg.select('.lineChart').node().getTotalLength();
console.log(length);
/*animate line chart*/
svg.select('.lineChart')
    .attr("stroke-dasharray", length + " " +length)
    .attr("stroke-dashoffset", 800)
    .transition()
    .delay(function(d) {
        return dataset.length * 100;
    })
    .duration(4000)
    .attr("stroke-dashoffset", 0);

/*add points*/
// var points = svg.selectAll('circle')
//     .data(dataset)
//     .enter()
//     .append('circle');

/*point attributes*/
// points.attr('cy', 0)
//     .style('opacity', 0)
//     .transition()
//     .duration(3000)
//     .ease('elastic')
//     .delay(function(d, i) {
//         return i * 100;
//     })
//     .attr({
//         'cx': function(d) {
//             return xScale(d[0]);
//         },
//         'cy': function(d) {
//             return yScale(d[1]);
//         },
//         'r': 7,
//         'class': 'datapoint',
//         'id': function(d, i) {
//             return i;
//         }
//     })
//     .style('opacity', 1);