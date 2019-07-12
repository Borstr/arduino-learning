const five = require('johnny-five');
const board = new five.Board();

board.on('ready', () => {
  const digit = new five.Led.Digits({
    pins: {
      data: 2,
      clock: 3,
      cs: 4
    }
  });

  digit.print(1)
});