var express = require('express');
var level = require('level');
const socketIO = require('socket.io');
var app = express();

var SerialPort = require('serialport');

let db = level('./database/test3');

app.use(express.static(process.cwd() + '/'));

const server = app.listen('3000' , () => {
  console.log('working on http://localhost:3000');
});

// open socket communication
const io = socketIO(server);

io.on('connection', (socket) => {

  console.log('user connected');

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });

  //pega os dados retroativos do ticker
  socket.on('get_history', (ticks) => {
    // 720 ticks é o equivalente a 1 hora de cotacoes
    // 180 é 15 minutos
    let iterator = db.iterator({limit: ticks, reverse: false});
    // inicia um loop temporal com 100 milisegundos
    // isso para dar tempo do socket enviar os dados ao client
    let interval_history = setInterval(() => {

      iterator.next((err, key, value) => {
        if (value != undefined) {
          let obj = JSON.parse(value);
          io.emit('ticker_history', obj);
          //console.log(obj);
        }
        else {
          iterator.end(()=>{});
          clearInterval(interval_history);
          io.emit('ticker_history_end');
        }
      });

    }, 100);
  });

});


// abre a porta serial do Arduino
const path = "/dev/ttyUSB0";


const port = new SerialPort(path, {
  baudRate: 9600
});

// Switches the port into "flowing mode"
port.on('open', function (data) {
  console.log('Serial port opened with success');
});

// Open errors will be emitted as an error event
port.on('error', function(err) {
  console.log(err.message)
});

// Switches the port into "flowing mode"
port.on('data', function (data) {

  strData = data.toString('utf8');

  let obj = {};
  obj.cycle = parseInt(strData);
  obj.timestamp = Date.now();
  let value = JSON.stringify(obj);

  // salva o obj no levelDB
  db.put(obj.timestamp, value, function (err) {
    if (err) return console.log('Ooops!', err);
  });

  // faz o broadcast desse obj para todos os sockets conectados
  io.sockets.emit('ticker', obj);

  console.log(obj);

});
