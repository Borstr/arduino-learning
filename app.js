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
  const {
    btns,
    led,
    middleJointServo,
    groundJointServo,
    middleRotatorServo,
    joystick
  } = devices(five);


});

// Handling servos with joystick
function handleJoystickChange() {
  
}

function rotate180DegServo() {

}

function rotate360DegServo() {

}

//Buttons
function switchToJointServos() {
  
}

function switchToRotatorServos() {

}

function switchMemorizeMovement() {

}

function recreateMovement() {

}

// LED
function blinkCode(code) {

}