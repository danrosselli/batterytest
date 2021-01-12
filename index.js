var express = require('express');
var app = express();
var level = require('level');
//var socketIO require('socket.io');

var SerialPort = require('serialport');

let db = level('./database');

app.use(express.static(__dirname + '/'));

app.listen('3000' , () => {
  console.log('working on http://localhost:3000');
});

// abre a porta serial do Arduino
const path = "/dev/ttyUSB0";
const port = new SerialPort(path, {
  baudRate: 9600
});

// Switches the port into "flowing mode"
port.on('open', function (data) {
  console.log('Serial port opened with success');
})

// Switches the port into "flowing mode"
port.on('data', function (data) {

  strData = data.toString('utf8');

  let obj = {};
  obj.cycle = strData;
  obj.timestamp = Date.now();
  let value = JSON.stringify(obj);

  // salva o obj no levelDB
  db.put(obj.timestamp, value, function (err) {
    if (err) return console.log('Ooops!', err);
  });

  console.log(str);

})
