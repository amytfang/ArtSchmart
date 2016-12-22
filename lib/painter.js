const Pixel = require('./pixel');
const Util = require('./util');

class Painter {
  constructor() {
    this.level = 2;
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

  blurImage() {
    const sampleSize = this.painting.imageData.width * this.painting.imageData.height / 2;
    const pixelSample = Util.getRandomSubarray(this.pixelMap, 50000);
    pixelSample.forEach((pixel) => {
      this.drawCircle(pixel);
    });
  }


  drawCircle(pixel) {
    const posX = pixel.newPos[0];
    const posY = pixel.newPos[1];
    const ctx = this.painting.ctx;

    ctx.beginPath();
    ctx.arc(posX, posY, this.level, 0, 2 * Math.PI);
    ctx.fillStyle=`rgba(${pixel.r}, ${pixel.g}, ${pixel.b}, ${pixel.a})`;
    ctx.fill();
  }

  // drawOval() {
  //   // const posX = pixel.newPos[0];
  //   // const posY = pixel.newPos[1];
  //   const ctx = this.painting.ctx;
  //   // const width = Math.random() * 50;
  //   // const height = Math.random() * 50;
  //
  //   const width = this.level * 2;
  //   const height = this.level * 4;
  //
  //   ctx.beginPath();
  //   ctx.moveTo(200, 200);
  //   ctx.quadraticCurveTo(200 - );
  //
  //   // ctx.arc(100, 100, 5, 0, 2 * Math.PI);
  //   ctx.fill();
  //   ctx.closePath();
  // }

}

module.exports = Painter;
