var express = require('express');
var app = express();
var SerialPort = require('serialport');


app.use(express.static(__dirname + '/'));

app.listen('3000' , () => {
  console.log('working on http://localhost:3000');
});
