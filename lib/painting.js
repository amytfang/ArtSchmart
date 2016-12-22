class Painting {
  constructor(src, ctx) {
    this.src = src;
    this.ctx = ctx;
    this.renderImage();
  }

  renderImage() {
    let image = new Image();
    image.src = this.src;
    image.crossOrigin = "Anonymous";

    image.onload = () => {
      this.ctx.drawImage(image, 0, 0);
      this.imageData = this.ctx.getImageData(0, 0, 900, 600);
    };
  }
}

Painting.HEIGHT = 600;
Painting.WIDTH = 900;

module.exports = Painting;
