const five = require('johnny-five');
const board = new five.Board();

board.on('ready', () => {
  const btn1 = new five.Button(2);
  const btn2 = new five.Button(7);
  const btn3 = new five.Button(8);
  const led = new five.Led(12);

  const rand = randomNumber(1, 3);

  flashXTimes(rand, led, 250);

  btn1.on('down', () => checkIfPressedCorrectBtn(1, rand, led));
  btn2.on('down', () => checkIfPressedCorrectBtn(2, rand, led));
  btn3.on('down', () => checkIfPressedCorrectBtn(3, rand, led));
});

function randomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

const checkIfPressedCorrectBtn = (index, number, led) => (index === number) && flashXTimes(3, led, 100);

function flashXTimes(number, led, time) {
  let current = 1;
  
  const interval = setInterval(() => {
    if(current % 2 == 1) led.on();
    else if(current % 2 == 0) led.off();

    if(current / 2 == number) clearInterval(interval);
    current++;
  }, time);
}