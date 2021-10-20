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

function applyGravity(gravity, bodies) {
  bodies.forEach(body => {
    bodies.forEach(effectedBody => {
      if (body.name !== effectedBody.name) {
        const m1 = body.mass()
        const m2 = effectedBody.mass()
        // console.log('m1:', m1)
        // console.log('m2:', m2)
        const r = body.location().dist(effectedBody.location())
        // console.log('r:', r)
        const force = gravity * ((m1 * m2) / (r * r))
        // console.log('force:', force)
        const vectorForce = p5.Vector.sub(body.location(), effectedBody.location()).mult(force)
        // console.log('vectorForce:', vectorForce)
        effectedBody.applyForce(vectorForce)
      }
    })
  })
}

function update(bodies) {
  bodies.forEach(body => body.update())
}

function display(bodies) {
  bodies.forEach(body => body.display())
}

function checkEdges(bodies) {
  bodies.forEach(body => body.checkEdges())
}


let bodies;
let gravity;

function setup() {
  createCanvas(800, 800);
  gravity = 9.8
  bodies = [Mover('Sun', 0.01, 50, 20), Mover('Earth', 0.05, 260, 260)]
}

function draw() {
  background(220);

  applyGravity(gravity, bodies)
  update(bodies)
  display(bodies)
  checkEdges(bodies)
}
