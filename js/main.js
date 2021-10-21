const Mover = (name, mass, x, y) => {
  let location = createVector(x, y)
  let velocity = createVector(0, 0)
  let acceleration = createVector(0, 0)

  return ({
    name: () => name,
    location: () => location,
    mass: () => mass,

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
      ellipse(location.x, location.y, mass * 1000, mass * 1000)
      if (visualDebugEnabled) {
        stroke(0, 0, 255)
        const visualVelocity = p5.Vector.add(location, p5.Vector.mult(velocity, 100))
        line(location.x, location.y, visualVelocity.x, visualVelocity.y)
        stroke(255, 0, 0)
        const visualAcceleration = p5.Vector.add(location, p5.Vector.mult(acceleration, 5000))
        line(location.x, location.y, visualAcceleration.x, visualAcceleration.y)
      }
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
      } else if (location.y < 0) {
        velocity.y *= -1
        location.y = 0
      }
    }
  })
};

const SolarApp = {
  update: (bodies) => bodies.forEach(body => body.update()),
  display: (bodies) => bodies.forEach(body => body.display()),
  checkEdges: (bodies) => bodies.forEach(body => body.checkEdges()),
  applyGravity: (gravity, bodies) => {
    bodies.forEach(body => {
      bodies.forEach(effectedBody => {
        if (body.name !== effectedBody.name) {
          const m1 = body.mass()
          const m2 = effectedBody.mass()
          debug('m1:', m1)
          debug('m2:', m2)
          const r = body.location().dist(effectedBody.location())
          debug('r:', r)
          const force = gravity * ((m1 * m2) / (r * r))
          debug('force:', force)
          const vectorForce = p5.Vector.sub(body.location(), effectedBody.location()).mult(force)
          debug('vectorForce:', vectorForce)
          effectedBody.applyForce(vectorForce)
        }
      })
    })
  },

  draw: (gravity, bodies, updatePhysics) => {
    if (updatePhysics) SolarApp.applyGravity(gravity, bodies)

    SolarApp.display(bodies)

    if (updatePhysics) SolarApp.update(bodies)
    SolarApp.checkEdges(bodies)
  }
}

let bodies;
let gravity;

let visualDebugEnabled = true
let debugEnabled = false
let updatePhysics = false

function setup() {
  createCanvas(800, 800);
  gravity = 9.8
  bodies = [Mover('Sun', 0.01, 50, 20), Mover('Earth', 0.05, 260, 260)]
}

function draw() {
  background(220);

  SolarApp.draw(gravity, bodies, updatePhysics)
}

function keyPressed() {
  if (keyCode === 32) {        // spacebar
    updatePhysics = !updatePhysics;
  } else if (keyCode === 68) { // char d
    debugEnabled = !debugEnabled
  } else if (keyCode === 86) { // char v
    visualDebugEnabled = !visualDebugEnabled
  }
}
