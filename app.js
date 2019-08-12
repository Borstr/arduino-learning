const five = require("johnny-five");
const board = new five.Board();
const devices = require('./devices');
const {
  memorizing,
  replaying,
  jointServos,
  rotatorServos
} = require('./codes');

board.on('ready', function() {
  const controls = {
    servoControl: 'joint',
    isMemorizing: false,
    isReplaying: false,
    isControllable: true
  }
  const servoDegrees = {
    ground: 0,
    middle: 90
  }

  const servoTurns = {
    ground: {
      direction: '',
      time: 0
    },
    middle: {
      direction: '',
      time: 0
    }
  }

  let servosMemory = [];
  
  const {
    btns,
    led,
    middleJointServo,
    groundJointServo,
    middleRotatorServo,
    joystick
  } = devices(five);

  joystick.on('data', function() {
    handleJoystickChange(
      middleJointServo,
      groundJointServo,
      middleRotatorServo,
      servoDegrees,
      servoTurns,
      this.x,
      this.y
    );
  });

  btns[0].on('down', () => switchToJointServos(controls));
  btns[1].on('down', () => switchToRotatorServos(controls));
  btns[2].on('down', () => switchToMemorizingMovement(controls, led, servoDegrees, servosMemory));
  btns[3].on('down', () => switchToRecreatingMovement(controls, led));
});

// Handling servos with joystick
function handleJoystickChange(
  middleJointServo, 
  groundJointServo, 
  middleRotatorServo,
  servoDegrees,
  servoTurns,
  x,
  y
) {
  if(controls.servoControl === 'joint') rotate180DegServo();
  else rotate360DegServo();
  
  function rotate180DegServo() {
    if(x > .8 && servoDegrees.middle <= 160) {
      servoDegrees.middle = servoDegrees.middle + 1;
      middleJointServo.to(servoDegrees.middle, .1);
    }

    if(x < -.8 && servoDegrees.middle >= 90) {
      servoDegrees.middle = servoDegrees.middle - 1;
      middleJointServo.to(servoDegrees.middle, .1);
    }

    if(y > .8 && servoDegrees.ground <= 100) {
      servoDegrees.ground = servoDegrees.ground + 1;
      groundJointServo.to(servoDegrees.ground, .1);
    }

    if(y < -.8 && servoDegrees.ground >= 0) {
      servoDegrees.ground = servoDegrees.ground - 1;
      groundJointServo.to(servoDegrees.ground, .1);
    }
  }
  
  function rotate360DegServo() {
    const startTime = new Date();
    
    if(x > .2) {
      middleRotatorServo.cw(x);
      servoTurns.middle.direction = 'cw';
    }

    if(x < -.2) {
      middleRotatorServo.ccw(-x);
      servoTurns.middle.direction = 'ccw';
    }

    if(x < .1 && x > -.1) middleRotatorServo.stop();

    const endTime = new Date();

    servoTurns.middle.time = endTime - startTime;
  }
}

//Buttons
function switchToJointServos(controls) {
  if(controls.isControllable) controls.servoControl = 'joint';
}

function switchToRotatorServos(controls) {
  if(controls.isControllable) controls.servoControl = 'rotator';
}

function switchToMemorizingMovement(
  controls, 
  led, 
  { 
    ground,
    middle
  }, 
  {
    middle: middleRotatorServo
  }
) {
  if(controls.isControllable) {
    controls.isMemorizing = true;
    controls.isReplaying = false;
    led.blink(300);

    servosMemory.push({
      groundJointServo: {
        degrees: ground,
        time: ground * .1
      },
      middleJointServo: {
        degrees: middle,
        time: middle * .1
      },
      middleRotatorServo
    });
  }
}

function switchToRecreatingMovement(controls, led) {
  if(!controls.isReplaying) {
    controls.isMemorizing = false;
    controls.isReplaying = true;
    controls.isControllable = false;
    led.on();
  } else {
    controls.isMemorizing = false;
    controls.isReplaying = false;
    controls.isControllable = true;
    led.off();
  }
}