const five = require("johnny-five");

const board = new five.Board();

board.on('ready', () => {
  let isStarted = false;
  let timings = [];
  let start;

  const startBtn = new five.Button(7);
  const startLed = new five.Led(8);
  
  const leds = [
    new five.Led(10),
    new five.Led(11),
    new five.Led(12),
    new five.Led(13)
  ];

  const timingBtns = [
    new five.Button(2),
    new five.Button(3),
    new five.Button(4),
    new five.Button(5)
  ];

  timingBtns.map((btn, index) => btn.on('down', () => handleTimingButtonDown(index)));
  timingBtns.map((btn, index) => btn.on('up', () => handleTimingButtonUp(index)));

  startBtn.on('down', handleStartBtnDown);
  
  function handleStartBtnDown() {
    if(!isStarted) {
      startLed.on();
    } else {
      startLed.off();
      recreate();
    }

    isStarted = !isStarted;
  }

  function handleTimingButtonDown(index) {
    if(isStarted) {
      if(timings[timings.length - 1] && timings[timings.length - 1].index !== 'break' && start) {
        leds[index].on();

        timings.push({
          index: 'break',
          time: new Date() - start
        });

        start = new Date();
      } else {
        start = new Date();
        leds[index].on();
      }
    }
  }

  function handleTimingButtonUp(index) {
    if(isStarted) {
      const currTime = new Date();
      
      timings.push({ 
        index,
        time: currTime - start
      });
  
      start = currTime;
      leds[index].off();
    }
  }

  function recreate() {    
    try {
      const { index, time } = timings[0];
      
      if(index != 'break') {
        leds[index].on();
      
        setTimeout(() => {
          leds[index].off();
          timings.shift();
          recreate();
        }, time);
      } else {
        setTimeout(() => {
          timings.shift();
          recreate();
        }, time);
      }
    } catch {
      for(let i = 0; i < 3; i++) {
        const j = i;
        
        setTimeout(() => {
          startLed.on();
          setTimeout(() => startLed.off(), 250 * j + 125);
        }, 250 * j);
      }
    }
  }
});