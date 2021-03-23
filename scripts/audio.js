MyGame.audio = (function() {
  function Sound(spec) {
    let sound = new Audio();
    // sound.addEventListener('canplay', function() {
    //   console.log(spec.name, ' is ready to play');
    // });
    // sound.addEventListener('play', function() {
    //   console.log(spec.name, ' started playing');
    // });
    // sound.addEventListener('pause', function() {
    //   console.log(spec.name, ' paused');
    // });
    // sound.addEventListener('canplaythrough', function() {
    //   console.log(spec.name, ' can play through');
    // });
    // sound.addEventListener('progress', function() {
    //   console.log(spec.name, ' progress in loading');
    // });
    // sound.addEventListener('timeupdate', function() {
    //   console.log(spec.name, ' time update: ', this.currentTime);
    // });
    // addEventListener('ended', function() {
    //   console.log(spec.name, ' ended');
    // });
    sound.src = spec.src;
    return sound;
  }
  function playSound(whichSound, label, idButton, idStatus) {
    MyGame.sounds[whichSound].addEventListener('ended', function() {
      elementButton.onclick = function() { playSound(whichSound, label, idButton, idStatus); };
    });
    elementButton.onclick = function() { pauseSound(whichSound, label, idButton, idStatus); };
    MyGame.sounds[whichSound].play();
  }
  return {
    Sound,
  };
}());