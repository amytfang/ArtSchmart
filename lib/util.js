const Util = {
  getRandomSubarray(array, size) {
    const shuffled  = array.slice(0);
    let i = array.length;
    while (i--) {
      let index = Math.floor((i + 1) * Math.random());
      let temp = shuffled[index];
      shuffled[index] = shuffled[i];
      shuffled[i] = temp;
    }
    return shuffled.slice(0, size);
  }
};

module.exports = Util;
