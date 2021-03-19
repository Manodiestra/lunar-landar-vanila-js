MyGame.storage = (
  function () {
    'use strict';
    let highScores = {};
    let keyConfig = {};
    let storedScores = localStorage.getItem('MyGame.highScores');
    let storedKeyConfig = localStorage.getItem('MyGame.keyConfig');
    let scoreBoard = document.getElementById('leaderBoard');
    let thrustDisplay = document.getElementById('thrustDisplay');
    let rotateLeftDisplay = document.getElementById('rotateLeftDisplay');
    let rotateRightDisplay = document.getElementById('rotateRightDisplay');
    let thrust = false;
    let rotateLeft = false;
    let rotateRight = false;
    if (storedScores !== null) {
      highScores = JSON.parse(storedScores);
    }
    if (storedKeyConfig !== null) {
      keyConfig = JSON.parse(storedKeyConfig);
    }
    function setKey(key, element, command) {
      element.innerHTML = key;
      keyConfig[command] = key;
      localStorage['MyGame.keyConfig'] = JSON.stringify(keyConfig);
    }
    function thrustListen() {
      thrust = true;
      let rotateLeft = false;
      let rotateRight = false;
    }
    function rotateLeftListen() {
      rotateLeft = true;
      let thrust = false;
      let rotateRight = false;
    }
    function rotateRightListen() {
      rotateRight = true;
      let thrust = false;
      let rotateLeft = false;
    }
    document.addEventListener('keydown', function(event) {
      let thrust = false;
      let rotateLeft = false;
      let rotateRight = false;
      console.log('EVENT', event);
      if (thrust) {
        setKey(event.key, thrustDisplay, 'thrust');
      }
      else if (rotateLeft) {
        setKey(event.key, rotateLeftDisplay, 'rotateLeft');
      }
      else if (rotateRight) {
        setKey(event.key, rotateRightDisplay, 'rotateRight');
      }
    });
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
    };
  }()
);
