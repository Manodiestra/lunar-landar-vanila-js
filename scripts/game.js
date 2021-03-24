//------------------------------------------------------------------
// This provides the "game" code.
//------------------------------------------------------------------
MyGame.main = (function (systems, renderer, graphics) {
  'use strict';
  let lastTimeStamp = performance.now();
  // Define a sample particle system to demonstrate its capabilities
  let particlesFire = systems.ParticleSystem({
      center: { x: 300, y: 300 },
      size: { mean: 10, stdev: 4 },
      speed: { mean: 50, stdev: 25 },
      lifetime: { mean: 4, stdev: 1 }
    },
    graphics
  );
  let renderFire = renderer.ParticleSystem(particlesFire, graphics, 'assets/fire.png');
  // Update the particles
  function update(elapsedTime) {
    // Tell the existing particles to update themselves
    particlesFire.update(elapsedTime);
  }
  // Render the particles
  function render() {
    graphics.clear();
    renderFire.render();
  }
  // This is the Game Loop function!
  function gameLoop(time) {
    let elapsedTime = (time - lastTimeStamp);
    update(elapsedTime);
    lastTimeStamp = time;
    render();
    requestAnimationFrame(gameLoop);
  };
  requestAnimationFrame(gameLoop);
}(MyGame.systems, MyGame.render, MyGame.graphics));
