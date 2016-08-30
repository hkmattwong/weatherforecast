console.log("System starting test")


var request = require("request")

//test get the default weather function
request.get({url:'https://assignment2-mattwong.c9users.io:8081/getweather', }, function optionalCallback(err, httpResponse, body) {
  if (err) {
    return console.error('Create account failed:', err);
  }
  console.log('Create account successful!');
});

//test search the default weather function
request.get({url:'https://assignment2-mattwong.c9users.io:8081/search', loc:'Hong Kong'}, function optionalCallback(err, httpResponse, body) {
  if (err) {
    return console.error('Search failed:', err);
  }
  console.log(body);
});

//check the register function
request.get({url:'https://assignment2-mattwong.c9users.io:8081/insert', user: 'user',password:'123123',name: 'user',email:'abc@gmail.com',age:'18'}, function optionalCallback(err, httpResponse, body) {
  if (err) {
    return console.error('Create account failed:', err);
  }
  console.log('Create account successful!');
});

// test the login function
request.get({url:'https://assignment2-mattwong.c9users.io:8081/checklogin', user: 'user',password:'123123'}, function optionalCallback(err, httpResponse, body) {
  if (err) {
    return console.error('Login failed:', err);
  }
  console.log(body);
});
// test the add favourite item function
request.get({url:'https://assignment2-mattwong.c9users.io:8081/add', user: 'user',loc:'Hong Kong'}, function optionalCallback(err, httpResponse, body) {
  if (err) {
    return console.error('Create favourite failed:', err);
  }
  console.log(body);
});

//test the get favourite list function
request.get({url:'https://assignment2-mattwong.c9users.io:8081/getfav', user: 'user'}, function optionalCallback(err, httpResponse, body) {
  if (err) {
    return console.error('Get favourite data failed:', err);
  }
  console.log(body);
});
console.log("End the testing.")
