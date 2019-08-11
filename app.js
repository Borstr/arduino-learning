const five = require("johnny-five");
const board = new five.Board();
const devices = require('./devices');

board.on('ready', function() {
  const {
    btns,
    led,
    middleJointServo,
    groundJointServo,
    rotatorServo,
    joystick
  } = devices(five);


});



function memorizeMovement() {

}

function recreateMovement() {

}