var express = require("express");
var app=express();
var fs = require('fs');
app.use('/', express.static(__dirname + '/'));
	var nano = require("nano")("https://assignment2-mattwong.c9users.io:8080/"); //cloud 9 couchdb setting
	var test_db = nano.db.use("assignment");   //dbname

// for register function
	app.get('/insert', function(req, res){
		
	var data = {
		username:req.param('user'),
		password:req.param('password'),
		name:req.param('name'),
		email:req.param('email'),
		age:req.param('age')
	};
	var num = new Date().getTime()+''
	test_db.insert(data,num,function(err,body){        //insert data to the db
		if(!err){
			console.log('Insert a new Account completed');
			return res.redirect('../login.html');
		}else{
			console.log(err);
		}
	})
});

//for get all login data function
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

// for add favourite item function
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
	var num = new Date().getTime()+''
	test_db.insert(data,num,function(err,body){
		if(!err){
			console.log('Insert favourite completed');
		}else{
			console.log(err);
		}
	})

    }
})
});

//get the latest weather information from couchdb
app.get('/getweather', function(req, res){
	var result = [];
	var result2 = [];
	test_db.view('weather', 'weather', function(err, body){
		if(!err){

			var i=0;
			var rows = body.rows;
			var count=rows.length;
			while (i<9){
			var item = JSON.parse(JSON.stringify(rows[count-1]));
				if(item.value.datetime!=null){
					result.push(rows[count-1]);
					i++;
				}
				count--;
			}
			 if (i == 9) {
			 	result.sort(function (a, b) {
			 if (a.value.datetime > b.value.datetime) {
				  return 1;
				  }
				if (a.value.datetime < b.value.datetime) {
					 return -1;
				 }
			 // a must be equal to b
				 return 0;
			});
			 //	for (var a=0;a<result.length;a++){
			//		result2.push(result[a]);
			 //	}
				res.setHeader('Content-Type', 'application/json');
				return 	res.send(JSON.stringify(result));
			 }
		}
			console.log(err);
			return res.send(err);
		}
	);
});

//remove the favourite item
app.get('/remove', function(req, res){
	test_db.destroy(req.param("id"), req.param("rev"), function(err, body, header) {
		if (!err) {
			console.log("Successfully deleted doc", req.param("id"));
		}
	});
});

//check login
app.get('/checklogin', function(req, res){
	test_db.view('weather', 'weather', function(err, body){
		if(!err){

			var i=0;
			var rows = body.rows;
			var count=rows.length;
			while (count<0){
			var item = JSON.parse(JSON.stringify(rows[count-1]));
				if(item.value.username!=null && item.value.username == req.param('user') && item.value.password == req.param('pass')){
					i++;
				}
				count--;
			}
			res.setHeader('Content-Type', 'application/json');
			if (count<0){
			 if (i == 1) {
				res.json({"result": true});
                res.send();
			 }else{
			 	res.json({"result": false});
                res.send();
			 }
			}
		}
			console.log(err);
			return res.send(err);
		}
	);
});

// get favourite list
app.get('/getfav', function(req, res){
	var result = [];
	test_db.view('weather', 'weather', function(err, body){
		if(!err){

			var rows = body.rows;
			var count=rows.length;
			while (count>0){
			var item = JSON.parse(JSON.stringify(rows[count-1]));
				if(item.value.loc!=null && item.value.uid == req.param('user')){
					result.push(rows[count-1]);
				}
				count--;
			}
			 if (count==0) {
				res.setHeader('Content-Type', 'application/json');
				return 	res.send(JSON.stringify(result));
			 }
		}
			console.log(err);
			return res.send(err);
		}
	);
});

//search the item
app.get('/search', function(req, res){
	var request = require("request")
    var loc = req.param("loc");
	var url = 'http://api.openweathermap.org/data/2.5/forecast/daily?q='+loc+'&mode=json&units=metric&cnt=8&APPID=31538fe27dd36887159b09eb67838b37'; // API link

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
		var num = new Date().getTime()+''+i
	test_db.insert(data,num,function(err,body){
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

//start run, insert default data to the database
var request = require("request")

var url = 'http://api.openweathermap.org/data/2.5/forecast/daily?q=Hong%20Kong&mode=json&units=metric&cnt=8&APPID=31538fe27dd36887159b09eb67838b37';  // API link

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
		var num = new Date().getTime()+''
	test_db.insert(data,num,function(err,body){
		if(!err){
			console.log('Insert completed');
		}else{
			console.log(err);
		}
	})
		}
    }
})
app.listen(8081);  // listen the port