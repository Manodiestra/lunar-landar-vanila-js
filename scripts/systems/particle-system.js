MyGame.systems.ParticleSystem = function(spec) {
  'use strict';
  let nextName = 1;       // Unique identifier for the next particle
  let particles = {};
  let origin = {
    x: spec.center.x,
    y: spec.center.y,
  }
  let bounds = {
    x: {
      first: -1,
      second: 1,
    },
    y: {
      first: -1,
      second: 1,
    },
  };
  // This creates one new particle
  function create() {
    let size = Random.nextGaussian(spec.size.mean, spec.size.stdev);
    let direction = Random.nextCircleVector();
    if (direction.x < bounds.x.first) {
      direction.x = direction.x + 1;
    }
    if (direction.x > bounds.x.second) {
      direction.x = direction.x - 1;
    }
    if (direction.y < bounds.y.first) {
      direction.y = direction.y + 1;
    }
    if (direction.y > bounds.y.second) {
      direction.y = direction.y - 1;
    }
    let p = {
      center: { x: origin.x, y: origin.y },
      size: { x: size, y: size},  // Making square particles
      direction: direction,
      speed: Random.nextGaussian(spec.speed.mean, spec.speed.stdev), // pixels per second
      rotation: 0,
      lifetime: Random.nextGaussian(spec.lifetime.mean, spec.lifetime.stdev),    // How long the particle should live, in seconds
      alive: 0    // How long the particle has been alive, in seconds
    };
    return p;
  }
  // Update the state of all particles.  This includes removing any that have exceeded their lifetime.
  function update(elapsedTime) {
    let removeMe = [];
    // We work with time in seconds, elapsedTime comes in as milliseconds
    elapsedTime = elapsedTime / 1000;
    Object.getOwnPropertyNames(particles).forEach(function(value, index, array) {
      let particle = particles[value];
      // Update how long it has been alive
      particle.alive += elapsedTime;
      // Update its center
      particle.center.x += (elapsedTime * particle.speed * particle.direction.x);
      particle.center.y += (elapsedTime * particle.speed * particle.direction.y);
      // Rotate proportional to its speed
      particle.rotation += particle.speed / 500;
      // If the lifetime has expired, identify it for removal
      if (particle.alive > particle.lifetime) {
        removeMe.push(value);
      }
    });
    // Remove all of the expired particles
    for (let particle = 0; particle < removeMe.length; particle++) {
      delete particles[removeMe[particle]];
    }
    removeMe.length = 0;
    // Generate some new particles
    for (let particle = 0; particle < 10; particle++) {
      // Assign a unique name to each particle
      particles[nextName++] = create();
    }
  }
  function setCenter(x, y) {
    origin.x = x;
    origin.y = y;
  }
  function setBounds(newBounds) {
    bounds = {
      x: {
        first: newBounds.x.first,
        second: newBounds.x.second,
      },
      y: {
        first: newBounds.y.first,
        second: newBounds.y.second,
      },
    }
  }
  return {
    update,
    setCenter,
    setBounds,
    get particles() { return particles; }
  };
}
