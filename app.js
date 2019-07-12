const five = require('johnny-five');
const board = new five.Board();

board.on('ready', () => {
  const leds = [
    new five.Led(3),
    new five.Led(5),
    new five.Led(7),
    new five.Led(9),
  ];

  const btns = [
    new five.Button(2),
    new five.Button(4),
    new five.Button(6),
    new five.Button(8),
  ];
});