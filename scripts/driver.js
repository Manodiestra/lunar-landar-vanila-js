MyGame.main = (function(graphics, input) {
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
  let scoreBoard = document.getElementById('leaderBoard');
  let allScores = [82, 22];
  let fuelDisplay = document.getElementById('fuelValue');
  let gameOver = false;

  function makeScoreBoard() {
    scoreBoard.innerHTML = null;
    allScores.sort(function(a, b){return b-a});
    let number = allScores.length;
    if (number > 5) {
      number = 5;
    }
    for (let i = 0; i < number; i++) {
      scoreBoard.innerHTML += "<h3 class='valueStyle'>" + allScores[i] + "</h3>";
    }
  }

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
      makeScoreBoard();
    }
    let elapsedTime = time - lastTimeStamp;
    lastTimeStamp = time;
    processInput(elapsedTime);
    update(elapsedTime);
    render();
    if (!gameLoaded) {
      gameLoaded = true;
    }
    requestAnimationFrame(gameLoop);
  };
  // Create the keyboard input handler
  myKeyboard.registerCommand('w', lander.thrust);
  myKeyboard.registerCommand('q', lander.rotateLeft);
  myKeyboard.registerCommand('e', lander.rotateRight);
  // INICIATE!
  requestAnimationFrame(gameLoop);
}(MyGame.graphics, MyGame.input));
