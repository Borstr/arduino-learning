const express = require('express');
const socketIO = require('socket.io');
const five = require("johnny-five");

const board = new five.Board();
const app = express();

app.set('view engine', 'ejs');

app.get('/', (req, res) => res.render('pages/index'));

app.listen(8080, () => console.log('Server Listening on port 8080.'));