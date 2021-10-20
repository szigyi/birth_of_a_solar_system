const Mover = (locationParam, velocityParam, accelerationParam, massParam) => {
  let location = locationParam
  let velocity = velocityParam
  let acceleration = accelerationParam
  let mass = massParam

  return ({
    location: () => location,

    applyForce: (force) => {
      force.div(mass)
      acceleration.add(force)
    },

    update: () => {
      velocity.add(acceleration)
      location.add(velocity)
      acceleration.mult(0)
    },

    display: () => {
      stroke(0)
      fill(175)
      ellipse(location.x, location.y, mass * 16, mass * 16)
    },

    checkEdges: () => {
      if (location.x > width) {
        location.x = width;
        velocity.x *= -1;
      } else if (location.x < 0) {
        velocity.x *= -1;
        location.x = 0;
      }

      if (location.y > height) {
        velocity.y *= -1;
        location.y = height;
      }
    }
  })
};


let v1;
let wind;
let gravity;

function setup() {
  createCanvas(400, 400);
  v1 = Mover(createVector(0, 10), createVector(0, 0), createVector(0, 0), 1)
  wind = createVector(0.01, 0)
  gravity = createVector(0, 0.1)
}

function draw() {
  background(220);

  v1.applyForce(wind)
  v1.applyForce(gravity)
  v1.update()
  v1.display()
  v1.checkEdges()
}
