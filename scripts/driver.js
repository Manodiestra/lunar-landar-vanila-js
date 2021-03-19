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
    width: 80,
    height: 80,
    rotation: 0,
    moveRate: 200,            // pixels per second
    rotateRate: 3.14159,    // Radians per second
    verticalVector: 0,
    horizontalVector: 0,
  });
  // Process the registered input handlers here.
  function processInput(elapsedTime) {
    if (!gameOver) {
      myKeyboard.update(elapsedTime);
    }
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
      fuelDisplay.innerText = fuel;
      lander.gravity(elapsedTime);
      lander.horizontalMove(elapsedTime);
      lander.verticalMove(elapsedTime);
    }
  }
  // Render function
  function render() {
    graphics.clear();
    backDrop.draw();
    lander.draw();
  }
  // the Game Loop
  function gameLoop(time) {
    if (!gameLoaded) {
      // initial game settup
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
  myKeyboard.registerCommand(storage.getKey('thrust'), lander.thrust);
  myKeyboard.registerCommand(storage.getKey('rotateLeft'), lander.rotateLeft);
  myKeyboard.registerCommand(storage.getKey('rotateRight'), lander.rotateRight);
  // INICIATE!
  requestAnimationFrame(gameLoop);
}(MyGame.graphics, MyGame.input, MyGame.storage));
