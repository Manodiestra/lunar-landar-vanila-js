let previousTimeStamp = performance.now();
let startTime = JSON.parse(JSON.stringify(previousTimeStamp));
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

// Get images to render
// let sprite = Graphics.Texture({
//   image: 'image/path.jpsomething',
//   center: { x : 100, y : 100 },
//   width: squareSize.x - 20,
//   height: squareSize.y - 20,
//   rotation: 0,
//   moveRate: 200,            // pixels per second
//   rotateRate: 3.14159    // Radians per second
// }, spriteLocation);


function makeScoreBoard() {
  console.log('MAKE BOARD');
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
function update(timeElapsed) {
  if (!gameOver) {
    screenTimeValue.innerText = Math.floor(
      (performance.now() - startTime) / 1000) + ' sec';
  }
}
function render() {
  scoreDisplay.innerText = fuel;
  let ctx = canvas.getContext("2d");
  let img = new Image();
  img.src = 'assets/moon_space.jpeg';
  ctx.drawImage(img, 1, 1);
  // Graphics.clear();
  // drawSprite();
}
function gameLoop() {
  timeStamp = performance.now();
  if (!gameLoaded) {
    // initial game settup
    makeScoreBoard();
  }
  let elapsedTime = timeStamp - previousTimeStamp;
  previousTimeStamp = timeStamp;
  //handleInput(elapsedTime);
  update(elapsedTime);
  render();

  if (!gameLoaded) {
    gameLoaded = true;
  }
  requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);
