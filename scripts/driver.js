MyGame.main = (function(graphics, input, storage) {
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
  let gameOver = false;

  let myKeyboard = input.Keyboard();

  let backDrop = graphics.BackgroundImage({
    image: 'assets/moon_space.jpeg',
    start_x: 1,
    start_y: 1,
  })
  let lander = graphics.Texture({
    image: 'assets/lander.png',
    center: {x: 100, y: 100},
    width: 50,
    height: 50,
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
  function generateTerrain() {
    console.log('GENERATE TERRAIN');
  }
  function drawTerrain() {
    // do this stuff
  }
  // Update function
  function update(elapsedTime) {
    if (lander.getCenter().x <= 0 || lander.getCenter().x >= canvas.width
      || lander.getCenter().y <= 0 || lander.getCenter().y >= canvas.height) {
      gameOver = true;
    }
    if (!gameOver) {
      screenTimeValue.innerText = Math.floor(
        (performance.now() - startTime) / 1000) + ' sec';
      fuelDisplay.innerText = fuel.toFixed(1);
      if (fuel <= 15) {
        fuelDisplay.classList.add('redText');
      }
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
      lander.gravity(elapsedTime);
      lander.horizontalMove(elapsedTime);
      lander.verticalMove(elapsedTime);
    }
  }
  // Render function
  function render() {
    graphics.clear();
    backDrop.draw();
    drawTerrain();
    lander.draw();
  }
  // the Game Loop
  function gameLoop(time) {
    if (!gameLoaded) {
      // initial game settup
      generateTerrain();
      storage.reportScores();
    }
    let elapsedTime = time - lastTimeStamp;
    lastTimeStamp = time;
    processInput(elapsedTime);
    update(elapsedTime);
    render();
    if (!gameLoaded) {
      gameLoaded = true;
    }
    if (!gameOver) {
      requestAnimationFrame(gameLoop);
    }
  };
  // Create the keyboard input handler
  myKeyboard.registerCommand(
    storage.getKey('thrust'),
    function(elapsedTime) {if (fuel >= 0) {
      lander.thrust(elapsedTime * Number(difficulty));
    }}
  );
  //myKeyboard.registerCommand('a', MyTexture.moveLeft);
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
}(MyGame.graphics, MyGame.input, MyGame.storage));
