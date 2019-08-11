module.exports = function(five) {
  const btns = [
    new five.Button(2),
    new five.Button(7),
    new five.Button(8),
    new five.Button(12)
  ];
  
  const led = new five.Led(13);
  
  const middleJointServo = new five.Servo({
    pin: 3,
    range: [ 90, 160 ],
    startAt: 90
  });
  
  const groundJointServo = new five.Servo({
    pin: 4,
    range: [ 0, 100 ],
    startAt: 0
  });
  
  const rotatorServo = new five.Servo.Continuous({
    pin: 6,
    deadband: [73, 95]
  });
  
  var joystick = new five.Joystick({ pins: ["A0", "A1"] });

  return {
    btns,
    led,
    middleJointServo,
    groundJointServo,
    rotatorServo,
    joystick
  }
}