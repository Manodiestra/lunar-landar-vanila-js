// ------------------------------------------------------------------
// This is the graphics rendering code for the game.
// ------------------------------------------------------------------
MyGame.graphics = (function() {
  'use strict';
  const thrustForce = 1.75;
  const gravity = .75;
  let canvas = document.getElementById('canvas');
  let context = canvas.getContext('2d');
  let backgroundImage = new Image();
  backgroundImage.src = '/home/mano/school/cs5410/hw3/assets/moon_space.jpeg';
  context.drawImage(backgroundImage, 1, 1);
  // Clear function
  CanvasRenderingContext2D.prototype.clear = function() {
    this.save();
    this.setTransform(1, 0, 0, 1, 0, 0);
    this.clearRect(0, 0, canvas.width, canvas.height);
    this.restore();
  };
  //------------------------------------------------------------------
  // Public function that allows the client code to clear the canvas.
  //------------------------------------------------------------------
  function clear() {
    context.clear();
  }
  // Background image
  function BackgroundImage(spec) {
    let that = {};
    let ready = false;
    let image = new Image();
    image.onload = function() {
      ready = true;
    }
    image.src = spec.image;
    that.draw = function() {
      if (ready) {
        context.save();
        context.drawImage(
          image, 
          spec.start_x, 
          spec.start_y,
        );
        context.restore();
      }
    };
    return that;
  }
  function drawLine(spec) {
    context.beginPath();
    context.lineWidth = spec.width;
    context.strokeStyle = spec.strokeStyle;
    context.moveTo(spec.begin_x, spec.begin_y);
    context.lineTo(spec.end_x, spec.end_y);
    context.closePath();
    context.stroke();
    console.log('DONE DRAWING', spec);
  }
  // Texture object
  function Texture(spec) {
    let that = {};
    let ready = false;
    let image = new Image();
    image.onload = function() { 
      ready = true;
    };
    image.src = spec.image;
    that.rotateRight = function(elapsedTime) {
      spec.rotation += spec.rotateRate * (elapsedTime / 1000);
    };
    that.rotateLeft = function(elapsedTime) {
      spec.rotation -= spec.rotateRate * (elapsedTime / 1000);
    };
    that.horizontalMove = function(elapsedTime) {
      spec.center.x += spec.moveRate 
        * (elapsedTime / 1000) * spec.horizontalVector;
    };
    that.verticalMove = function(elapsedTime) {
      spec.center.y -= spec.moveRate 
        * (elapsedTime / 1000) * spec.verticalVector;
    };
    that.thrust = function(elapsedTime) {
      spec.useFuel(elapsedTime / 1000 * 5);
      spec.verticalVector += (elapsedTime / 1000) 
        * thrustForce * Math.cos(spec.rotation);
      spec.horizontalVector += (elapsedTime / 1000) 
        * thrustForce * Math.sin(spec.rotation);
    }
    that.gravity = function(elapsedTime) {
      spec.verticalVector -= (elapsedTime / 1000)
        * gravity;
    }
    that.getCenter = function() {
      return JSON.parse(JSON.stringify(spec.center));
    }
    that.getVerticalVector = function() {
      return JSON.parse(JSON.stringify(spec.verticalVector));
    }
    that.getHorizontalVector = function() {
      return JSON.parse(JSON.stringify(spec.horizontalVector));
    }
    that.getRotation = function() {
      return JSON.parse(JSON.stringify(spec.rotation));
    }
    that.draw = function() {
      if (ready) {
        context.save();
        context.translate(spec.center.x, spec.center.y);
        context.rotate(spec.rotation);
        context.translate(-spec.center.x, -spec.center.y);
        context.drawImage(
          image, 
          spec.center.x - spec.width/2, 
          spec.center.y - spec.height/2,
          spec.width, spec.height
        );
        context.restore();
      }
    };
    return that;
  }
  return {
    clear,
    Texture,
    BackgroundImage,
    drawLine,
  };
}());

