const five = require("johnny-five");

const board = new five.Board();

board.on('ready', () => {
  const joystick = new five.Joystick({
    pins: [
      'A0',
      'A1'
    ]
  });

  const servo = new five.Servo(10);

  servo.center();
  
  let servoAngle = 0;
  
  joystick.on('data', handleJoystickChange);

  function handleJoystickChange() {
    if(this.x > .1) {
      if(servoAngle < 179) {
        servoAngle += 179 / 50;
      }
    } else if(this.x < -.1) {
      if(servoAngle > 1) {
        servoAngle -= 179 / 50;
      }
    }

    if(servoAngle > 180) servoAngle = 179;
    if(servoAngle < 0) servoAngle = 1;

    console.log(this.x, servoAngle)
    servo.to(servoAngle);
  }
});