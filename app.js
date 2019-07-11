const five = require('johnny-five');
const board = new five.Board();

board.on('ready', () => {
  const servo = five.Servo(10);
  const btn1 = five.Button(2);
  const btn2 = five.Button(7);

  let degree = 0;
  servo.to(0);

  btn1.on('hold', () => (degree != 0) && servo.to(--degree));
  btn2.on('hold', () => (degree != 180) && servo.to(++degree));
});