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
  const degrees = {
    ground: 0,
    middle: 90
  }
  
  const {
    btns,
    led,
    middleJointServo,
    groundJointServo,
    middleRotatorServo,
    joystick
  } = devices(five);

  // Handling servos with joystick
  const handleJoystickChange = (
    middleJointServo, 
    groundJointServo, 
    middleRotatorServo,
    x,
    y
  ) => {
    const rotate180DegServo = () => {
      if(x > .8 && degrees.middle <= 160) {
        degrees.middle = degrees.middle + 1;
        middleJointServo.to(degrees.middle);
      }
      if(x < -.8 && degrees.middle >= 90) {
        degrees.middle = degrees.middle - 1;
        middleJointServo.to(degrees.middle);
      }
      if(y > .8 && degrees.ground <= 100) {
        degrees.ground = degrees.ground + 1;
        groundJointServo.to(degrees.ground);
      }
      if(y < -.8 && degrees.ground >= 0) {
        degrees.ground = degrees.ground - 1;
        groundJointServo.to(degrees.ground);
      }
    }
    
    const rotate360DegServo = () => {
      if(x > .2) middleRotatorServo.cw(x);

      if(x < -.2) middleRotatorServo.ccw(-x);

      if(x < .1 && x > -.1) middleRotatorServo.stop();
    }
    
    if(controls.servoControl === 'joint') rotate180DegServo();
    else rotate360DegServo();
  }

  joystick.on('data', function() {
    handleJoystickChange(
      middleJointServo,
      groundJointServo,
      middleRotatorServo,
      this.x,
      this.y
    );
  });

  btns[0].on('down', () => switchToJointServos(controls));
  btns[1].on('down', () => switchToRotatorServos(controls));
  btns[2].on('down', () => switchMemorizingMovement(controls));
  btns[3].on('down', () => switchRecreatingMovement(controls));
});

//Buttons
function switchToJointServos(controls) {
  if(controls.isControllable) {
    controls.servoControl = 'joint';
    console.log('joint')
  }
}

function switchToRotatorServos(controls) {
  if(controls.isControllable) {
    controls.servoControl = 'rotator';
    console.log('rotator')
  }
}

function switchMemorizingMovement(controls) {
  if(controls.isControllable) {
    controls.isMemorizing = true;
    controls.isReplaying = false;
    controls.isControllable = true;
  }
}

function switchRecreatingMovement(controls) {
  if(!controls.isReplaying) {
    controls.isMemorizing = false;
    controls.isReplaying = true;
    controls.isControllable = false;
  } else {
    controls.isMemorizing = false;
    controls.isReplaying = false;
    controls.isControllable = true;
  }
}

// LED
function blinkCode(code) {

}