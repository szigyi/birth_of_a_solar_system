const Mover = (name, earthMass, location, velocity, acceleration) => {
  location = location || createVector(0, 0)
  velocity = velocity || createVector(0, 0)
  acceleration = acceleration || createVector(0, 0)
  let visualSize;
  if (earthMass > 100)
    visualSize = 0.0002
  else
    visualSize = 10

  return ({
    name: () => name,
    location: () => location,
    mass: () => earthMass,

    applyForce: (force) => {
      force.div(earthMass)
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
      ellipse(location.x, location.y, earthMass * visualSize, earthMass * visualSize)
      if (visualDebugEnabled) {
        stroke(0, 0, 255)
        const visualVelocity = p5.Vector.add(location, p5.Vector.mult(velocity, 100))
        line(location.x, location.y, visualVelocity.x, visualVelocity.y)
        stroke(255, 0, 0)
        const visualAcceleration = p5.Vector.add(location, p5.Vector.mult(acceleration, 1000))
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
          const scaledR = r * compactingScale
          debug('AU:', scaledR)
          const force = gravity * ((m1 * m2) / (scaledR * scaledR))
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
    // SolarApp.checkEdges(bodies)
  }
}

// TODO should follow real time positions... fetch real positions
function startingLocation(au, angle) {
  const centre = width / 2
  const distance = centre - auToDistance(au)
  return createVector(distance, height / 2)
}

// angular velocity
// TODO: Learn more about angular velocity
function startingVelocity(kms) {
  const scaled = kms * 0.01
  return createVector(scaled / 2, scaled / 2)
}

function auToDistance(au) {
  return au * 200
}

let bodies;
let gravity;
const compactingScale = 6000 // TODO why compacting scale is not the same as AU to distance conversion's scale?
// Doesn't it mean that the relative distance is now far from the reality as planets can be
// closer to the Sun but gravity will not effect them the same way?
// TODO planet's location that is used to calculate the forces, should be independent from drawing location!!!
// TODO translate real location to drawing location on the fly instead of scale it during construction

let visualDebugEnabled = true
let debugEnabled = false
let updatePhysics = false

function setup() {
  createCanvas(1400, 800);
  gravity = 9.8
  bodies = [
    Mover('Sun', 333000, startingLocation(0, 0)),
    Mover('Mercury', 0.055, startingLocation(0.4), startingVelocity(47.36)),
    Mover('Venus', 0.815, startingLocation(0.7), startingVelocity(35.2)),
    Mover('Earth', 1, startingLocation(1), startingVelocity(29.78)),
    Mover('Mars', 0.107, startingLocation(1.5), startingVelocity(24))
  ]
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
