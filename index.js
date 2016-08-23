var express = require("express");
var app=express();
var fs = require('fs');
app.use('/', express.static(__dirname + '/'));
	var nano = require("nano")("http://127.0.0.1:5984");
	var test_db = nano.db.use("assignment");

	app.get('/insert', function(req, res){
		
	var data = {
		username:req.param('user'),
		password:req.param('password'),
		name:req.param('name'),
		email:req.param('email'),
		age:req.param('age')
	};
	test_db.insert(data,null, function(err,body){
		if(!err){
			console.log('Insert completed');
			return res.redirect('./login.html');
		}else{
			console.log(err);
		}
	})
});
app.get('/login', function(req, res){
	test_db.view('weather', 'weather', function(err, body){
		
		if(!err){
			var rows = body.rows;
			console.log(rows);
			res.setHeader('Content-Type', 'application/json');
			return res.send(rows);
		}
			console.log(err);
			return res.send(err);
		}
	);
});
app.get('/add', function(req, res){
	var request = require("request")
    var loc = req.param("loc");
	var url = 'http://api.openweathermap.org/data/2.5/forecast/daily?q='+loc+'&mode=json&units=metric&cnt=9&APPID=31538fe27dd36887159b09eb67838b37';

request({
    url: url,
    json: true
}, function (error, response, body) {

    if (!error && response.statusCode === 200) {
		var data = {
		uid: req.param("name"),
		loc: req.param("loc")
	};
	test_db.insert(data,null, function(err,body){
		if(!err){
			console.log('Insert completed');
		}else{
			console.log(err);
		}
	})

    }
})
});
app.get('/getweather', function(req, res){
	test_db.view('weather', 'weather', function(err, body){
		if(!err){
			var rows = body.rows;
			//console.log(rows);
			res.setHeader('Content-Type', 'application/json');
			return res.send(rows);
		}
			console.log(err);
			return res.send(err);
		}
	);
});
app.get('/remove', function(req, res){
	test_db.destroy(req.param("id"), req.param("rev"), function(err, body, header) {
		if (!err) {
			console.log("Successfully deleted doc", req.param("id"));
		}
	});
});
app.get('/getfav', function(req, res){
	test_db.view('weather', 'weather', function(err, body){
		if(!err){
			var rows = body.rows;

			//console.log(rows);
			res.setHeader('Content-Type', 'application/json');
			
			return res.send(rows);
		}
			console.log(err);
			return res.send(err);
		}
	);
});
app.get('/search', function(req, res){
	var request = require("request")
    var loc = req.param("loc");
	var url = 'http://api.openweathermap.org/data/2.5/forecast/daily?q='+loc+'&mode=json&units=metric&cnt=8&APPID=31538fe27dd36887159b09eb67838b37';

request({
    url: url,
    json: true
}, function (error, response, body) {

    if (!error && response.statusCode === 200) {
	for(var i = 0; i<8; i++) {
		var data = {
		name:body.city.name,
		datetime:body.list[i].dt,
		day:body.list[i].temp.day,
		min:body.list[i].temp.min,
		max:body.list[i].temp.max,
		night:body.list[i].temp.night,
		eve:body.list[i].temp.eve,
		morn:body.list[i].temp.morn,
		pressure:body.list[i].pressure,
		humidity:body.list[i].humidity,
		main:body.list[i].weather[0].main,
		desc:body.list[i].weather[0].description
	};
	test_db.insert(data,null, function(err,body){
		if(!err){
			console.log('Insert completed');
		}else{
			console.log(err);
		}
	})
		}
		res.setHeader('Content-Type', 'application/json');
		return res.send('{"status":"success"}');
    }
})
});
var request = require("request")

var url = 'http://api.openweathermap.org/data/2.5/forecast/daily?q=Hong%20Kong&mode=json&units=metric&cnt=8&APPID=31538fe27dd36887159b09eb67838b37';

request({
    url: url,
    json: true
}, function (error, response, body) {

    if (!error && response.statusCode === 200) {
	for(var i = 0; i<8; i++) {
       /* console.log(body.city.name) 
		console.log(body.list[i].dt)
		console.log(body.list[i].temp.day)
		console.log(body.list[i].temp.min)
		console.log(body.list[i].temp.max)
		console.log(body.list[i].temp.night)
		console.log(body.list[i].temp.eve)
		console.log(body.list[i].temp.morn)
		console.log(body.list[i].pressure)
		console.log(body.list[i].humidity)
		console.log(body.list[i].weather[0].main)
		console.log(body.list[i].weather[0].description)
		*/
		var data = {
		name:body.city.name,
		datetime:body.list[i].dt,
		day:body.list[i].temp.day,
		min:body.list[i].temp.min,
		max:body.list[i].temp.max,
		night:body.list[i].temp.night,
		eve:body.list[i].temp.eve,
		morn:body.list[i].temp.morn,
		pressure:body.list[i].pressure,
		humidity:body.list[i].humidity,
		main:body.list[i].weather[0].main,
		desc:body.list[i].weather[0].description
	};
	test_db.insert(data,null, function(err,body){
		if(!err){
			console.log('Insert completed');
		}else{
			console.log(err);
		}
	})
		}
    }
})
app.listen(8000);