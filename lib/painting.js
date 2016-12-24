const Painter = require('./painter.js');

class Painting {
  constructor(src, ctx, painter) {
    this.src = src;
    this.ctx = ctx;
    this.painter = painter;
    this.renderImage();
  }

  renderImage() {
    this.ctx.clearRect(0, 0, Painting.WIDTH = 900, Painting.HEIGHT);
    let image = new Image();
    image.src = this.src;
    image.crossOrigin = "Anonymous";

    image.onload = () => {
      this.ctx.drawImage(
        image,
        0, 0, image.width, image.height,
        0, 0, Painting.WIDTH, Painting.HEIGHT
      );
      this.imageData = this.ctx.getImageData(
        0, 0, Painting.WIDTH, Painting.HEIGHT);
      this.painter.createPixelArray(this.imageData);
    };
  }

  updateImage(imageURL) {
    this.src = imageURL;
    this.renderImage();
  }

  resetImage() {
    this.ctx.putImageData(this.imageData, 0, 0);
  }
}

Painting.HEIGHT = 600;
Painting.WIDTH = 900;

module.exports = Painting;
