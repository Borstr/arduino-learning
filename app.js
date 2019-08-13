const five = require("johnny-five");
const board = new five.Board();
const devices = require('./devices');

const SERVO_DEGREE_TIME = .1;
let middleRotatorStart, middleRotatorEnd;

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
      controls,
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

  btns[2].on('down', () => switchToMemorizingMovement(
    servosMemory,
    controls, 
    led, 
    servoDegrees, 
    servoTurns
  ));

  btns[3].on('down', () => switchToRecreatingMovement(
    controls, 
    led,
    servosMemory,
    middleJointServo,
    groundJointServo,
    middleRotatorServo
  ));
});

// Handling servos with joystick
function handleJoystickChange(
  controls,
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
      middleJointServo.to(servoDegrees.middle, SERVO_DEGREE_TIME);
    }

    if(x < -.8 && servoDegrees.middle >= 90) {
      servoDegrees.middle = servoDegrees.middle - 1;
      middleJointServo.to(servoDegrees.middle, SERVO_DEGREE_TIME);
    }

    if(y > .8 && servoDegrees.ground <= 100) {
      servoDegrees.ground = servoDegrees.ground + 1;
      groundJointServo.to(servoDegrees.ground, SERVO_DEGREE_TIME);
    }

    if(y < -.8 && servoDegrees.ground >= 0) {
      servoDegrees.ground = servoDegrees.ground - 1;
      groundJointServo.to(servoDegrees.ground, SERVO_DEGREE_TIME);
    }
  }
  
  function rotate360DegServo() {
    if((x > .2 || x < -.2) && middleRotatorStart == 0) {
      middleRotatorStart = new Date();
    }

    if(x > .2) {
      middleRotatorServo.cw(.5);
      servoTurns.middle.direction = 'cw';
    }

    if(x < -.2) {
      middleRotatorServo.ccw(.5);
      servoTurns.middle.direction = 'ccw';
    }

    if(x < .1 && x > -.1 && middleRotatorStart != 0) {
      middleRotatorServo.stop();
      middleRotatorEnd = new Date();
      servoTurns.middle.time = middleRotatorEnd - middleRotatorStart;
      middleRotatorStart = 0;
    }
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
  servosMemory,
  controls, 
  led, 
  { 
    ground,
    middle
  }, 
  rotatorTurns
) {
  if(controls.isControllable) {
    controls.isMemorizing = true;
    controls.isReplaying = false;
    led.blink(300);

    servosMemory.push({
      groundJointServo: {
        degrees: ground,
        time: ground * SERVO_DEGREE_TIME
      },
      middleJointServo: {
        degrees: middle,
        time: middle * SERVO_DEGREE_TIME
      },
      middleRotatorServo: {
        ...rotatorTurns.middle
      }
    });

    rotatorTurns.middle = {
      direction: '',
      time: 0
    };

    rotatorTurns.ground = {
      direction: '',
      time: 0
    };
  }
}

function switchToRecreatingMovement(
  controls, 
  led, 
  servosMemory, 
  middleJointServo,
  groundJointServo,
  middleRotatorServo
) {
  if(!controls.isReplaying) {
    controls.isMemorizing = false;
    controls.isReplaying = true;
    controls.isControllable = false;

    recreateMovement(
      controls,
      servosMemory, 
      middleJointServo, 
      groundJointServo, 
      middleRotatorServo,
      -1
    );

    led.on();
  } else {
    controls.isMemorizing = false;
    controls.isReplaying = false;
    controls.isControllable = true;
    led.off();
  }
}

function recreateMovement(
  controls,
  servosMemory, 
  middleJointServo, 
  groundJointServo, 
  middleRotatorServo,
  index
) {
  let oldIndex;
  let timeout = 1000;

  if(index == -1) oldIndex = 0;
  else oldIndex = index;
  
  ++index;
  if(index === servosMemory.length) index = 0;

  if(
    servosMemory[oldIndex].groundJointServo.degrees != servosMemory[index].groundJointServo.degrees 
    || index == 0
  ) {
    groundJointServo.to(servosMemory[index].groundJointServo.degrees, SERVO_DEGREE_TIME);
  }

  if(
    servosMemory[oldIndex].middleJointServo.degrees != servosMemory[index].middleJointServo.degrees 
    || index == 0
  ) {
    middleJointServo.to(servosMemory[index].middleJointServo.degrees, SERVO_DEGREE_TIME);
  }

  if(servosMemory[index].middleRotatorServo.time != 0) {
    if(!timeout || servosMemory[index].middleRotatorServo.time > timeout) {
      timeout = servosMemory[index].middleRotatorServo.time + 1000;
    }
    
    if(servosMemory[index].middleRotatorServo.direction == 'cw') {
      middleRotatorServo.cw(.5);
    } else if(servosMemory[index].middleRotatorServo.direction == 'ccw') {
      middleRotatorServo.ccw(.5);
    }

    setTimeout(() => {
      middleRotatorServo.stop();
    }, servosMemory[index].middleRotatorServo.time);
  }
  
  if(controls.isReplaying) {
    setTimeout(() => {
      recreateMovement(controls,
        servosMemory, 
        middleJointServo, 
        groundJointServo, 
        middleRotatorServo,
        index
      );
    }, timeout);
  }
}