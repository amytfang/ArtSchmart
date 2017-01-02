const Util = {
  getRandomSubarray(array, size) {
    const shuffled  = array.slice(0);
    let i = array.length;
    let min = i - size;
    while (i-- > min) {
      let index = Math.floor((i + 1) * Math.random());
      let temp = shuffled[index];
      shuffled[index] = shuffled[i];
      shuffled[i] = temp;
    }
    return shuffled.slice(min);
  },

  includedCoords(pos, radius) {
    const x = pos[0];
    const y = pos[1];
    let coordinates = [[x, y]];

    for (let i = radius; i > 0; i--) {
      coordinates = coordinates.concat(Util.checkBounds(
        [[x + i, y],
        [x - i, y],
        [x, y + i],
        [x, y - 1]]
      ));
    }

    for (let j = radius; j > 0; j--) {
      if ((j * j) + (j * j) <= (radius * radius)) {
        coordinates = coordinates.concat(Util.checkBounds(
          [[x + j, y + j],
          [x - j, y + j],
          [x + j, y - j],
          [x - j, y - j]]
        ));
      }
    }

    for (let k = 1; k < radius; k++) {
      for (let l = 1; l < radius; l++) {
        if (k === l) continue;
        if ((k * k) + (l * l) <= (radius * radius)) {
          coordinates = coordinates.concat(Util.checkBounds(
            [[x + k, y + l],
            [x - k, y + l],
            [x + k, y - l],
            [x - k, y - l]]
          ));
        }
      }
    }
    return coordinates;
  },

  checkBounds(coordinates) {
    let result = [];
    coordinates.forEach((coord) => {
      if (coord[0] >= 0 && coord[0] < 900 &&
        coord[1] >= 0 && coord[1] < 600) {
        result.push(coord);
      }
    });
    return result;
  }
};

module.exports = Util;
