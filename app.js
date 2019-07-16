const express = require('express');
const socketIO = require('socket.io');
const five = require("johnny-five");

const board = new five.Board();
const app = express();

app.set('view engine', 'ejs');

app.get('/', (req, res) => res.render('pages/index'));

board.on('ready', () => {
  const ledState = {
    red: false,
    blue: false,
    green: false,
    yellow: false
  }
  
  const ledRed = five.Led(7);
  const ledBlue = five.Led(6);
  const ledYellow = five.Led(5);
  const ledGreen = five.Led(8);
  
  app.get('/led/:type', (req, res) => {
    console.log(req.params.type)
    switch(req.params.type) {
      case 'blue': switchLed(ledBlue, ledState, 'blue'); res.send('ok'); break;
      case 'red': switchLed(ledRed, ledState, 'red'); res.send('ok'); break;
      case 'green': switchLed(ledGreen, ledState, 'green'); res.send('ok'); break;
      case 'yellow': switchLed(ledYellow, ledState, 'yellow'); res.send('ok'); break;
    }
  });
});

const switchLed = (led, state, field) => {
  if(state[field]) led.off();
  else led.on();

  state[field] = !state[field];
}

app.listen(8080, () => console.log('Server Listening on port 8080.'));