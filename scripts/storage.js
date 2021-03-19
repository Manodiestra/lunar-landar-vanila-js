MyGame.storage = (
  function () {
    'use strict';
    let highScores = {};
    let keyConfig = {};
    let storedScores = localStorage.getItem('MyGame.highScores');
    let storedKeyConfig = localStorage.getItem('MyGame.keyConfig');
    let scoreBoard = document.getElementById('leaderBoard');
    let thrustDisplay = document.getElementById('thrustDisplay');
    if (thrustDisplay !== null) {
      thrustDisplay.onclick = thrustListen;
    }
    let rotateLeftDisplay = document.getElementById('rotateLeftDisplay');
    if (rotateLeftDisplay !== null) {
      rotateLeftDisplay.onclick = rotateLeftListen;
    }
    let rotateRightDisplay = document.getElementById('rotateRightDisplay');
    if (rotateRightDisplay !== null) {
      rotateRightDisplay.onclick = rotateRightListen;
    }
    let thrust = false;
    let rotateLeft = false;
    let rotateRight = false;
    if (storedScores !== null) {
      highScores = JSON.parse(storedScores);
    }
    if (storedKeyConfig !== null) {
      keyConfig = JSON.parse(storedKeyConfig);
    }
    else {
      keyConfig = {
        'thrust': 'w',
        'rotateLeft': 'q',
        'rotateRight': 'e',
      }
    }
    function thrustListen() {
      showKeys();
      thrustDisplay.innerHTML = "<h2>Press a key...</h2>";
      thrust = true;
      rotateLeft = false;
      rotateRight = false;
    }
    function rotateLeftListen() {
      showKeys();
      rotateLeftDisplay.innerHTML = "<h2>Press a key...</h2>";
      rotateLeft = true;
      thrust = false;
      rotateRight = false;
    }
    function rotateRightListen() {
      showKeys();
      rotateRightDisplay.innerHTML = "<h2>Press a key...</h2>";
      rotateRight = true;
      thrust = false;
      rotateLeft = false;
    }
    function setKey(key, element, command) {
      element.innerHTML = key;
      keyConfig[command] = key;
      localStorage['MyGame.keyConfig'] = JSON.stringify(keyConfig);
    }
    function getKey(command) {
      return keyConfig[command];
    }
    document.addEventListener('keydown', function(event) {
      if (thrust) {
        setKey(event.key, thrustDisplay, 'thrust');
      }
      else if (rotateLeft) {
        setKey(event.key, rotateLeftDisplay, 'rotateLeft');
      }
      else if (rotateRight) {
        setKey(event.key, rotateRightDisplay, 'rotateRight');
      }
      thrust = false;
      rotateLeft = false;
      rotateRight = false;
      showKeys();
    });
    function showKeys() {
      if (thrustDisplay !== null) {
        thrustDisplay.innerHTML = "<h2>" + keyConfig['thrust'] + "</h2>";
        rotateLeftDisplay.innerHTML = "<h2>" + keyConfig['rotateLeft'] + "</h2>";
        rotateRightDisplay.innerHTML = "<h2>" + keyConfig['rotateRight'] + "</h2>";
      }
    }
    function addScore(score, player) {
      let randomNum = Math.floor(Math.random() * 10000);
      let key = score + '-' + randomNum;
      let value = {
        score: score,
        player: player,
      }
      highScores[key] = value;
      localStorage['MyGame.highScores'] = JSON.stringify(highScores);
    }
    function removeScore(key) {
      delete highScores[key];
      localStorage['MyGame.highScores'] = JSON.stringify(highScores);
    }
    function clear() {
      localStorage.clear();
    }
    function reportScores() {
      console.log('SCORE REPORT');
      scoreBoard.innerHTML = null;
      let scoreKeys = Object.keys(highScores);
      scoreKeys.sort(function(a, b) {
        // Key structure is like this:
        // "scorevalue-randomFourDigits"
        let b_0 = Number(b.split('-')[0]);
        let a_0 = Number(a.split('-')[0]);
        return b_0 - a_0
      });
      let number = Object.keys(highScores).length;
      if (number > 5) {
        number = 5;
      }
      for (let i = 0; i < number; i++) {
        scoreBoard.innerHTML += '<h3 class="valueStyle">'
          + highScores[scoreKeys[i]].player + ' . . . '
          + highScores[scoreKeys[i]].score + '</h3>';
      }
      scoreBoard.scrollTop = scoreBoard.scrollHeight;
    }

    return {
      addScore,
      removeScore,
      reportScores,
      clear,
      showKeys,
      getKey,
    };
  }()
);
