const five = require('johnny-five');
const board = new five.Board();

board.on('ready', () => {
  let sequence = generateSequence(4);
  let btnsClickedOrder = [];
  
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

  for(let i = 0; i < 4; i++) btns[i].on('down', () => saveBtnClicks(i, btnsClickedOrder, sequence, leds))

  turnOnLeds(leds, sequence);
});

const saveBtnClicks = (index, btnsClickedOrder, sequence, leds) => {
  btnsClickedOrder.push(index);

  checkIfPressedCorrectBtns(sequence, btnsClickedOrder, leds);
}

const generateSequence = length => {
  const sequence = [];
  
  for(let i = 0; i < length; i++) sequence.push(rand(0, 3));

  return sequence;
}

const checkIfPressedCorrectBtns = (sequence, btnsClicked, leds) => {
  for(let i = 0; i < btnsClicked.length; i++) if(sequence[i] != btnsClicked[i]) return showLoss(leds);

  if(sequence.length == btnsClicked.length) return showVictory(leds);
}

const showVictory = leds => {
  const newLeds = [...leds, ...leds];
  let j;
  
  newLeds.map((led, i) => {
    j = i;
    
    setTimeout(() => {
      led.on();
      setTimeout(() => led.off(), 100);
    }, 100 * i);
  });

  setTimeout(() => leds.map(led => led.on()), 100 * j + 200);
  setTimeout(() => leds.map(led => led.off()), 100 * j + 400);
}

const showLoss = leds => {
  leds.map(led => {
    led.on();
    setTimeout(() => led.off(), 1000);
  });
}

const turnOnLeds = (leds, sequence) => sequence.map((index, i) => {
  setTimeout(() => {
    leds[index].on();
    setTimeout(() => leds[index].off(), 300);
  }, 500 * i);
});

const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;