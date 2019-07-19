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
  
  joystick.on('change', handleJoystickChange);

  function handleJoystickChange() {
    if(this.x > .1) {
      if(servoAngle < 180) {
        servoAngle += 180 / 50;
      }
    } else if(this.x < -.1) {
      if(servoAngle > 0) {
        servoAngle -= 180 / 50;
      }
    }

    if(servoAngle > 180) servoAngle = 180;
    if(servoAngle < 0) servoAngle = 0;

    console.log(this.x, servoAngle)
    servo.to(servoAngle);
  }
});