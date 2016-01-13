var express = require('express');
var router = express.Router();
var d3 = require('d3');
var connection = require('../db');

var home = {
	/* render landing page */
	init: function(req, res){
		res.render('index');
		// connection.query('SELECT * from first LIMIT 2', function(err, rows, fields) {
		// 	// connection.end();
		// 	if(!err){
		// 		console.log('The solution is: ', rows);
		// 		res.render('index');
		// 	}else{
		// 		console.log('Error while performing Query.');
		// 	}
		//   });
	},
	/* pass data to render graphs through D3.js 
	*  @params : req.query.data
			@req.query.data -> start date(optional)
							-> end date(optional)
							-> y (expected) to get the user selection to draw graph for
								 a particular data-set or data-sets.
	*/
	fetchData: function(req, res){
		var inData = req.query.data,
			data = [];

		var dataset = [
			{date: 'Jan 2000', price: 50.3},
			{date: 'Feb 2000', price: 35.6},
			{date: 'Mar 2000', price: 28.4},
			{date: 'Apr 2000', price: 23.3},
			{date: 'May 2000', price: 29.7},
			{date: 'Jun 2000', price: 32.4},
			{date: 'Jul 2000', price: 37.9},
			{date: 'Aug 2000', price: 35.2},
			{date: 'Sep 2000', price: 34.3},
			{date: 'Oct 2000', price: 32.5},
			{date: 'Nov 2000', price: 36.7},
			{date: 'Dec 2000', price: 33.6}
		];
		if(inData.y.length < 2 && inData.y[0] == 'Sales List'){
			console.log(dataset);
			data = [dataset];
		}else if(inData.y.length < 2 && inData.y[0] == 'Recent Orders'){
			console.log(dataset.length);
			for(var i=0; i< dataset.length; i++){
				dataset[i].price += 10;
			}
			console.log(dataset);
			data = [dataset];
		}else if(inData.y.length > 1){
			var data = [];
			for(var i = 0; i < inData.y.length; i++){
				data[i] = [];
				for(var j = 0; j < dataset.length; j++){
					var temp = undefined;

					temp = Object.create(dataset[j]);
					temp.price += i*10+10;
					temp.date = temp.__proto__['date'];

					data[i].push(temp);
				}
			}
			console.log(data);
		} 
	    res.send(JSON.stringify(data));        
	}
}
module.exports = home;
