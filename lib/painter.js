const Pixel = require('./pixel');
const Util = require('./util');

class Painter {
  constructor() {
    this.canvasStyle = "none";
    this.canvasClarity = 3;

    this.brushStyle = "none";
    this.brushClarity = 3;
    this.brushSize = 30;
  }

  addPainting(painting) {
    this.painting = painting;
  }

  createPixelArray() {
    this.colorsArray = this.painting.imageData.data;
    this.width = this.painting.imageData.width;
    this.height = this.painting.imageData.height;
    this.pixelMap = [];
    for (let i = 0; i < this.colorsArray.length; i += 4) {
      const x = Math.floor((i % (this.width * 4)) / 4);
      const y = Math.floor(i / (this.width * 4));
      const r = this.colorsArray[i];
      const g = this.colorsArray[i + 1];
      const b = this.colorsArray[i + 2];
      const a = this.colorsArray[i + 3];
      this.pixelMap.push(new Pixel([x, y], r, g, b, a));
    }
  }

  updateCanvasClarity(value) {
    this.canvasClarity = value;
    if (this.canvasStyle !== "none") this.renderPainting();
  }

  updateCanvasStyle(style) {
    this.canvasStyle = style;
    if (this.canvasStyle !== "none") {
      this.renderPainting();
    } else {
      this.painting.resetImage();
    }
  }

  updateBrushSize(size) {
    this.brushSize = size * 10;
  }

  renderPainting() {
    this.painting.resetImage();
    if (this.canvasStyle === "impressionism") this.makeImpression();
    if (this.canvasStyle === "point-grid") this.makeGridPoint();
    if (this.canvasStyle === "point-rand") this.makeRandPoint();
  }

  makeImpression(fullImage = true) {
    const pixelCount = 100000 / this.canvasClarity;
    const pixelSample = Util.getRandomSubarray(this.pixelMap, pixelCount);
    pixelSample.forEach((pixel) => {
      this.drawCurve(pixel, this.canvasClarity);
    });
  }

  makeRandPoint() {
    const ctx = this.painting.ctx;
    const pixelCount = 100000 / this.canvasClarity;
    const pixelSample = Util.getRandomSubarray(this.pixelMap, pixelCount);
    pixelSample.forEach((pixel) => {
      this.drawCircle(pixel, this.canvasClarity);
    });
  }

  makeGridPoint() {
    const ctx = this.painting.ctx;
    ctx.clearRect(0, 0, 900, 600);
    const spacing = this.canvasClarity * 4;
    for (let i = (900 % spacing === 0) ? spacing / 2 : 0; i < 900; i += spacing) {
      for (let j = (600 % spacing === 0) ? spacing / 2 : 0; j < 600; j += spacing) {
        let index = (i + j * this.width);
        this.drawCircle(this.pixelMap[index], this.canvasClarity, false);
      }
    }
  }

  draw(pos) {
    const pixelArea = Util.includedCoords(pos, this.brushSize);
    const pixelSample = Util.getRandomSubarray(pixelArea, pixelArea.length * .5);
    if (this.brushStyle === "dots"){
      pixelSample.forEach((pixel) => {
        let index = (pixel[0] + pixel[1] * this.width);
        this.drawCircle(this.pixelMap[index], this.brushClarity);
      });
    } else if (this.brushStyle === "brushstrokes") {
      pixelSample.forEach((pixel) => {
        let index = (pixel[0] + pixel[1] * this.width);
        this.drawCurve(this.pixelMap[index], this.brushClarity);
      });
    }
  }

  drawCircle(pixel, clarity, shift = true) {
    const posX = shift ? pixel.newPos[0] : pixel.pos[0];
    const posY = shift ? pixel.newPos[1] : pixel.pos[1];
    const ctx = this.painting.ctx;

    ctx.beginPath();
    ctx.arc(posX, posY, clarity * 2, 0, 2 * Math.PI);
    ctx.fillStyle=`rgba(${pixel.r}, ${pixel.g}, ${pixel.b}, ${pixel.a})`;
    ctx.fill();
  }

  drawCurve(pixel, clarity) {
    const posX = pixel.newPos[0];
    const posY = pixel.newPos[1];
    const ctx = this.painting.ctx;
    const width = Math.random() * clarity * 6;
    const height = Math.random() * clarity * 6;

    ctx.beginPath();
    ctx.moveTo(posX, posY);
    ctx.quadraticCurveTo(posX - width, posY, posX, posY + height);

    ctx.fillStyle = `rgba(${pixel.r}, ${pixel.g}, ${pixel.b}, ${pixel.a})`;
    ctx.fill();
    ctx.closePath();
  }

}

module.exports = Painter;
