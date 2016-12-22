class Pixel {
  constructor(pos, r, g, b, a) {
    this.pos = pos;
    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a;
    this.shift();
  }

  shift() {
    const xRand = Math.floor(Math.random() * 20) - 10;
    const yRand = Math.floor(Math.random() * 20) - 10;
    this.newPos = [this.pos[0] + xRand, this.pos[1] + yRand];
  }
}

module.exports = Pixel;
