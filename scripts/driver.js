MyGame.main = (
function(graphics, input, storage, audio, systems, renderer) {
  'use strict';
  let startTime = performance.now();
  let lastTimeStamp = JSON.parse(JSON.stringify(startTime));
  let gameLoaded = false;
  const canvas = document.getElementById('canvas');
  const gameDifficulty = {
    '1': 1,
    '2': 2,
  };
  let selectedDifficulty = '1';
  let difficulty = gameDifficulty[selectedDifficulty];
  let fuel = 100;
  let screenTimeValue = document.getElementById('timeValue');
  let fuelDisplay = document.getElementById('fuelValue');
  let velocityDisplay = document.getElementById('velocityValue');
  let angleDisplay = document.getElementById('angleValue');
  let gameOver = false;
  let gameOverCountdown = 3000;
  let terrainData = [];
  let buf = 16;
  let renderThrustParticles = false;

  let explode_sound;
  let trumpet_sound;
  let thrust_sound;

  let myKeyboard = input.Keyboard();

  // Explosion fire object settup
  let particlesFire = systems.ParticleSystem({
      center: { x: 300, y: 300 },
      size: { mean: 10, stdev: 4 },
      speed: { mean: 200, stdev: 25 },
      lifetime: { mean: 1, stdev: .2 }
    },
    graphics
  );
  let renderFire = renderer.ParticleSystem(
    particlesFire,
    graphics,
    './assets/fire.png'
  );
  let particlesThrust = systems.ParticleSystem({
      center: { x: 300, y: 300 },
      size: { mean: 5, stdev: 2 },
      speed: { mean: 200, stdev: 25 },
      lifetime: { mean: .3, stdev: .2 }
    },
    graphics
  );
  let renderThrust = renderer.ParticleSystem(
    particlesThrust,
    graphics,
    './assets/fire.png'
  );
  let backDrop = graphics.BackgroundImage({
    image: 'assets/moon_space.jpeg',
    start_x: 1,
    start_y: 1,
  })
  let lander = graphics.Texture({
    image: 'assets/red_lander.png',
    center: {x: 100, y: 100},
    width: 30,
    height: 30,
    rotation: 0,
    moveRate: 200,          // pixels per second
    rotateRate: 3.14159,    // Radians per second
    verticalVector: 0,
    horizontalVector: 0,
    useFuel: function(elapsedTime) {
      fuel -= elapsedTime;
    }
  });
  // Process the registered input handlers here.
  function processInput(elapsedTime) {
    if (!gameOver) {
      myKeyboard.update(elapsedTime);
    }
  }
  function recursiveGenerate(leftPoint, rightPoint) {
    // Base case
    if (rightPoint.hori - leftPoint.hori <= 20) {
      return [leftPoint, rightPoint];
    }
    let s = 1;
    let u = 0, v = 0;
    while(u === 0) u = Math.random(); //Converting [0,1) to (0,1)
    while(v === 0) v = Math.random();
    let g = Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
    let r = s * g * Math.abs(rightPoint.hori - leftPoint.hori);
    let y = (leftPoint.vert + rightPoint.vert) / 2 + r;
    if (y < 300) {
      y = y + 200;
    }
    if (y > 990) {
      y = y - 70;
    }
    let midPoint = {
      vert: y,
      hori: Math.round(leftPoint.hori + ((rightPoint.hori - leftPoint.hori) / 2)),
    }
    return recursiveGenerate(leftPoint, midPoint)
     .concat(recursiveGenerate(midPoint, rightPoint));
  }
  function generateTerrain() {
    let width = canvas.width;
    let height = canvas.height;
    let midHeight = Math.floor(height / 2);
    let leftPoint = {
      vert: Math.round(Math.random() * midHeight + midHeight),
      hori: 0,
    }
    let rightPoint = {
      vert: Math.round(Math.random() * midHeight + midHeight),
      hori: width,
    }
    let zoneWidth = width / (7 * difficulty);
    let zone1Height = Math.round(height * Math.random() / 2 + height / 2);
    let zone1Width = Math.round(width * (3/10) * Math.random() + width / 10);
    let startZone1 = {
      vert: zone1Height,
      hori: zone1Width,
    }
    let endZone1 = {
      vert: zone1Height,
      hori: zone1Width + zoneWidth,
    }
    let zone2Height = Math.round(height * Math.random() / 2 + height / 2);
    let zone2Width = Math.round(width * (4/10) * Math.random() + width * (5 / 10));
    let startZone2 = {
      vert: zone2Height,
      hori: zone2Width,
    }
    let endZone2 = {
      vert: zone2Height,
      hori: zone2Width + zoneWidth,
    }
    terrainData.push(recursiveGenerate(leftPoint, startZone1));
    terrainData.push([startZone1, endZone1]);
    terrainData.push(recursiveGenerate(endZone1, startZone2));
    terrainData.push([startZone2, endZone2]);
    terrainData.push(recursiveGenerate(endZone2, rightPoint));
  }
  function drawTerrain() {
    for (let c = 0; c < terrainData.length; c++) {
      let segments = terrainData[c];
      for (let i = 0; i < segments.length - 1; i++) {
        let seg = segments[i];
        let newLine = {};
        newLine.begin_x = seg.hori;
        newLine.begin_y = seg.vert;
        newLine.end_x = segments[i + 1].hori;
        newLine.end_y = segments[i + 1].vert;
        newLine.width = 4;
        newLine.strokeStyle = 'rgba(255, 0, 0, 1)';
        graphics.drawLine(newLine);
      }
    }
  }
  function loadAudio() {
    // Reference: https://soundbible.com/1986-Bomb-Exploding.html
    explode_sound = audio.Sound({
      src: './assets/Bomb_Exploding.mp3',
      name: 'Explosion',
    });
    // Reference: https://soundbible.com/1498-Rocket.html
    thrust_sound = audio.Sound({
      src: './assets/Rocket.mp3',
      name: 'Thrust',
    });
    // Reference: https://soundbible.com/1823-Winning-Triumphal-Fanfare.html
    trumpet_sound = audio.Sound({
      src: './assets/Short_triumpet.mp3',
      name: 'Victory'
    });
  }
  function youDied(elapsedTime) {
    gameOver = true;
    explode_sound.play();
    particlesFire.update(elapsedTime);
  }
  function allGreen() {
    return velocityDisplay.classList.contains('greenText')
      && angleDisplay.classList.contains('greenText');
  }
  // Update function
  function update(elapsedTime) {
    let newCenter = lander.getCenter();
    particlesFire.setCenter(newCenter.x, newCenter.y);
    particlesThrust.setCenter(newCenter.x, newCenter.y);
    let rotationRadians = lander.getRotation();
    let yRad = Math.abs(rotationRadians / Math.PI);
    let yFir = 0;
    let ySec = 0;
    if (yRad < .5) {
      yFir = yRad;
      ySec = 1 - yRad;
    }
    else {
      yFir = yRad * -1;
      ySec = -1 + yRad;
    }
    let xFir = -.5;
    let xSec = .5;
    let xRad = (rotationRadians / Math.PI);
    if (Math.abs(xRad > .5)) {
      xFir += xRad;
      xSec += xRad;
    }
    else {
      xFir += xRad + .5;
      xSec += xRad - .5;
    }
    console.log('ROT', xFir.toFixed(2), xSec.toFixed(2));
    particlesThrust.setBounds({
      x: {
        first: -.5,
        second: .5,
      },
      y: {
        first: yFir,
        second: ySec,
      },
    });
    particlesThrust.update(elapsedTime);
    // Check for out of bounds
    if (
      lander.getCenter().x - buf <= 0 || lander.getCenter().x + buf >= canvas.width
      || lander.getCenter().y - buf <= 0 || lander.getCenter().y + buf >= canvas.height
    ) {
      youDied(elapsedTime);
    }
    // Check for landing on a stage 1
    else if (
      lander.getCenter().x >= terrainData[1][0].hori
      && lander.getCenter().x <= terrainData[1][1].hori
      && lander.getCenter().y + buf >= terrainData[1][0].vert
      && allGreen()
    ) {
      gameOver = true;
      trumpet_sound.play();
    }
    // Crash into stage 1
    else if (
      lander.getCenter().x >= terrainData[1][0].hori
      && lander.getCenter().x <= terrainData[1][1].hori
      && lander.getCenter().y + buf >= terrainData[1][0].vert
      && !allGreen()
    ) {
      youDied(elapsedTime);
    }
    // Check for landing on a stage 2
    else if (
      lander.getCenter().x >= terrainData[3][0].hori
      && lander.getCenter().x <= terrainData[3][1].hori
      && lander.getCenter().y + buf >= terrainData[3][0].vert
      && allGreen()
    ) {
      gameOver = true;
      trumpet_sound.play();
    }
    // Crash into stage 2
    else if (
      lander.getCenter().x >= terrainData[3][0].hori
      && lander.getCenter().x <= terrainData[3][1].hori
      && lander.getCenter().y + buf >= terrainData[3][0].vert
      && !allGreen()
    ) {
      youDied(elapsedTime);
    }
    if (!gameOver) {
      screenTimeValue.innerText = Math.floor(
        (performance.now() - startTime) / 1000) + ' sec';
      // Fuel calculations
      if (fuel < 0) {
        fuel = 0;
      }
      fuelDisplay.innerText = fuel.toFixed(1);
      if (fuel <= 15) {
        fuelDisplay.classList.add('redText');
      }
      if (fuel <= 0) {
        fuelDisplay.classList.remove('redText');
        fuelDisplay.classList.add('whiteText');
      }
      // Velocity calculations
      let velocity = Math.sqrt(
        lander.getVerticalVector() ** 2
        + lander.getHorizontalVector() ** 2
      ) * 3;
      velocityDisplay.innerText = velocity.toFixed(1);
      if (velocity <= 2) {
        velocityDisplay.classList.add('greenText');
        velocityDisplay.classList.remove('redText');
      }
      else {
        velocityDisplay.classList.remove('greenText');
        velocityDisplay.classList.add('redText');
      }
      // Angle Calculations
      let rotation = Math.abs(
        ((lander.getRotation() % (Math.PI * 2)) * 180 / Math.PI).toFixed(1)
      );
      angleDisplay.innerText = rotation + ' DEG';
      if (rotation <= 5 || rotation >= 355) {
        angleDisplay.classList.add('greenText');
        angleDisplay.classList.remove('redText');
      }
      else {
        angleDisplay.classList.remove('greenText');
        angleDisplay.classList.add('redText');
      }
      // Track lander movement
      lander.gravity(elapsedTime);
      lander.horizontalMove(elapsedTime);
      lander.verticalMove(elapsedTime);
    }
    else {
      if (gameOverCountdown > 0) {
        gameOverCountdown -= elapsedTime;
      }
    }
  }
  // Render function
  function render() {
    graphics.clear();
    backDrop.draw();
    drawTerrain();
    if (renderThrustParticles) {
      renderThrust.render();
    }
    lander.draw();
    if (gameOver) {
      renderFire.render();
    }
  }
  // the Game Loop
  function gameLoop(time) {
    if (!gameLoaded) {
      // initial game settup
      generateTerrain();
      storage.reportScores();
      loadAudio();
      gameLoaded = true;
    }
    let elapsedTime = time - lastTimeStamp;
    lastTimeStamp = time;
    processInput(elapsedTime);
    update(elapsedTime);
    render();
    if (gameOverCountdown > 0) {
      requestAnimationFrame(gameLoop);
    }
  };
  // Create the keyboard input handler
  myKeyboard.registerCommand(
    storage.getKey('thrust'),
    (elapsedTime) => {
      if (fuel > 0) {
        lander.thrust(elapsedTime * Number(difficulty));
        thrust_sound.play();
        //if (myKeyboard.)
        setTimeout(() => {thrust_sound.pause();}, 600);
        renderThrustParticles = true;
        setTimeout(() => {renderThrustParticles = false;}, 600);
      }
    }
  );
  myKeyboard.registerCommand(
    storage.getKey('rotateLeft'),
    lander.rotateLeft
  );
  myKeyboard.registerCommand(
    storage.getKey('rotateRight'),
    lander.rotateRight
  );
  // INICIATE!
  requestAnimationFrame(gameLoop);
}(MyGame.graphics, MyGame.input, MyGame.storage, 
  MyGame.audio, MyGame.systems, MyGame.render));
