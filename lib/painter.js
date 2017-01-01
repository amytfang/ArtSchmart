const Pixel = require('./pixel');
const Util = require('./util');

class Painter {
  constructor() {
    this.level = 3;
    this.style = "none";
    this.brush = false;
    this.brushWidth = 30;
  }

  addPainting(painting) {
    this.painting = painting;
  }

  createPixelArray() {
    const imageData = this.painting.imageData.data;
    const imageWidth = this.painting.imageData.width;
    this.pixelMap = [];
    for (let i = 0; i < imageData.length; i += 4) {
      const x = Math.floor((i % (imageWidth * 4)) / 4);
      const y = Math.floor(i / (imageWidth * 4));
      const r = imageData[i];
      const g = imageData[i + 1];
      const b = imageData[i + 2];
      const a = imageData[i + 3];
      this.pixelMap.push(new Pixel([x, y], r, g, b, a));
    }
  }

  updateLevel(level) {
    this.level = level;
    if (this.style !== "none") this.renderPainting();
  }

  updateStyle(style) {
    this.style = style;
    if (this.style !== "none") {
      this.renderPainting();
    } else {
      this.painting.resetImage();
    }
  }

  renderPainting() {
    this.painting.resetImage();
    if (this.style === "impressionism") this.makeImpression();
    if (this.style === "pointillism") this.makePoint();
  }

  makeImpression(fullImage = true) {
    const pixelCount = 100000 / this.level;
    const pixelSample = Util.getRandomSubarray(this.pixelMap, pixelCount);
    pixelSample.forEach((pixel) => {
      this.drawCurve(pixel);
    });
  }

  makePoint() {
    const ctx = this.painting.ctx;
    ctx.clearRect(0, 0, 900, 600);
    const spacing = this.level * 4;
    for (let i = 0; i < 900; i += spacing) {
      for (let j = 0; j < 600; j += spacing) {
        let index = (i + j * this.painting.imageData.width);
        this.drawCircle(this.pixelMap[index]);
      }
    }
  }

  draw(pos) {
    const pixelArea = Util.includedCoords(pos, this.brushWidth);
    const ctx = this.painting.ctx;
    if (this.style === "pointillism"){
      ctx.beginPath();
      ctx.arc(pos[0], pos[1], this.brushWidth, 0, 2 * Math.PI);
      ctx.fillStyle = "white";
      ctx.fill();
      const spacing = this.level * 4;

      pixelArea.forEach((pixel) => {
        if (pixel[0] % spacing === 0 && pixel[1] % spacing === 0) {
          let index = (pixel[0] + pixel[1] * this.painting.imageData.width);
          this.drawCircle(this.pixelMap[index]);
        }
      });
    } else if (this.style === "impressionism") {
      const pixelSample = Util.getRandomSubarray(pixelArea, pixelArea.length / 4);
      pixelSample.forEach((pixel) => {
        let index = (pixel[0] + pixel[1] * this.painting.imageData.width);
        this.drawCurve(this.pixelMap[index]);
      });
    }
  }

  drawCircle(pixel) {
    const posX = pixel.pos[0];
    const posY = pixel.pos[1];
    const ctx = this.painting.ctx;

    ctx.beginPath();
    ctx.arc(posX, posY, this.level * 2 - 1, 0, 2 * Math.PI);
    ctx.fillStyle=`rgba(${pixel.r}, ${pixel.g}, ${pixel.b}, ${pixel.a})`;
    ctx.fill();
  }

  drawCurve(pixel) {
    const posX = pixel.newPos[0];
    const posY = pixel.newPos[1];
    const ctx = this.painting.ctx;
    const width = Math.random() * this.level * 6;
    const height = Math.random() * this.level * 6;

    ctx.beginPath();
    ctx.moveTo(posX, posY);
    ctx.quadraticCurveTo(posX - width, posY, posX, posY + height);

    ctx.fillStyle = `rgba(${pixel.r}, ${pixel.g}, ${pixel.b}, ${pixel.a})`;
    ctx.fill();
    ctx.closePath();
  }

}

module.exports = Painter;
