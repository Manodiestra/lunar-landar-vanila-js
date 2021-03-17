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
      console.log("<h3 class='valueStyle'>" + allScores[i] + "</h3>");
      scoreBoard.innerHTML += "<h3 class='valueStyle'>" + allScores[i] + "</h3>";
    }
  }

  let myKeyboard = input.Keyboard();
  let lander = graphics.Texture( {
    image : 'assets/lander.png',
    center : { x : 100, y : 100 },
    width : 80, height : 80,
    rotation : 0,
    moveRate : 200,            // pixels per second
    rotateRate : 3.14159    // Radians per second
  });
  // Process the registered input handlers here.
  function processInput(elapsedTime) {
    myKeyboard.update(elapsedTime);
  }
  // Update function
  function update(elapsedTime) {
    if (!gameOver) {
      screenTimeValue.innerText = Math.floor(
        (performance.now() - startTime) / 1000) + ' sec';
    }
  }
  // Render function
  function render() {
    graphics.clear();
    lander.draw();
  }
  // the Game Loop
  function gameLoop(time) {
    let elapsedTime = time - lastTimeStamp;
    lastTimeStamp = time;
    processInput(elapsedTime);
    update(elapsedTime);
    render();
    requestAnimationFrame(gameLoop);
  };
  // Create the keyboard input handler
  myKeyboard.registerCommand('a', lander.moveLeft);
  myKeyboard.registerCommand('d', lander.moveRight);
  myKeyboard.registerCommand('w', lander.moveUp);
  myKeyboard.registerCommand('s', lander.moveDown);
  myKeyboard.registerCommand('q', lander.rotateLeft);
  myKeyboard.registerCommand('e', lander.rotateRight);
  // INICIATE!
  requestAnimationFrame(gameLoop);
}(MyGame.graphics, MyGame.input));
