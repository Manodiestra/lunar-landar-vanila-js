let Graphics = (function() {
  let canvas = document.getElementById('canvas');
  let context = canvas.getContext('2d');
  
  // Place a 'clear' function on the Canvas prototype, this makes it a part
  // of the canvas, rather than making a function that calls and does it.
  CanvasRenderingContext2D.prototype.clear = function() {
    this.save();
    this.setTransform(1, 0, 0, 1, 0, 0);
    this.clearRect(0, 0, canvas.width, canvas.height);
    this.restore();
  };
  // Public function that allows the client code to clear the canvas.
  function clear() {
    context.clear();
  }

  function drawRectangle(spec) {
    context.save();
    context.translate(
      spec.x + spec.width / 2,
      spec.y + spec.height / 2);
    context.rotate(spec.rotation);
    context.translate(
      -(spec.x + spec.width / 2),
      -(spec.y + spec.height / 2));

    context.fillStyle = spec.fillStyle;
    context.fillRect(spec.x, spec.y, spec.width, spec.height);

    context.strokeStyle = spec.strokeStyle;
    context.strokeRect(spec.x, spec.y, spec.width, spec.height);

    context.restore();
  }

  function Texture(spec) {
    let that = {};
    let ready = false;
    let image = new Image();
    let c_x = spec.center.x;
    let c_y = spec.center.y;
    let height = spec.height;
    let width = spec.width;

    // Load the image, set the ready flag once it is loaded so that
    // rendering can begin.
    image.onload = function() { 
      ready = true;
    };
    image.src = spec.image;
    that.setCenter = function(x, y) {
      c_x = x;
      c_y = y;
    }
    that.setDims = function(w, h) {
      width = w;
      height = h;
    }
    that.draw = function() {
      if (ready) {
        context.save();
        context.translate(spec.center.x, spec.center.y);
        context.rotate(spec.rotation);
        context.translate(-spec.center.x, -spec.center.y);
        context.drawImage(
          image,
          c_x - width/2, 
          c_y - height/2,
          width,
          height
        );
        context.restore();
      }
    };
    return that;
  }

  return {
    drawRectangle: drawRectangle,
    Texture: Texture,
    clear: clear
  };
})();
