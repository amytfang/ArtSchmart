/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	const Painter = __webpack_require__(1);
	const Painting = __webpack_require__(4);

	document.addEventListener("DOMContentLoaded", () => {
	  const canvas = document.getElementById('image-canvas');
	  canvas.height = Painting.HEIGHT;
	  canvas.width = Painting.WIDTH;
	  const ctx = canvas.getContext('2d');

	  // const src = "demo_images/demo-image-1.jpg";
	  const src = "https://s3.amazonaws.com/artschmart-demo-images/coastline.jpg";
	  const painter = new Painter();
	  const painting = new Painting(src, ctx, painter);
	  painter.addPainting(painting);

	  const imageInput = document.getElementById('file-input');
	  imageInput.addEventListener("change", () => {
	    const file = document.getElementById('file-input').files[0];
	    const reader = new FileReader();
	    reader.onload = (e) => {
	      let imageURL = e.target.result;
	      painting.updateImage(imageURL, ctx);
	      document.getElementById('image-form').reset();
	    };
	    reader.readAsDataURL(file);
	  });

	  const imageSlider = document.getElementById('image-slider');
	  imageSlider.addEventListener("change", (e) => {
	    const value = e.target.value;
	    painter.updateLevel(value);
	  });

	  const imageMenu = document.getElementById('image-dropdown');
	  imageMenu.addEventListener("change", (e) => {
	    const style = e.target.value;
	    painter.updateStyle(style);
	  });

	  const demos = document.getElementsByClassName('demo-images');
	  for (let i = 0; i < demos.length; i++) {
	    demos[i].addEventListener("click", (e) => {
	      let imageURL = `demo_images/${e.target.name}.jpg`;
	      painting.updateImage(imageURL, ctx);
	      document.getElementById('image-form').reset();
	    });
	  }

	  canvas.addEventListener("click", (e) => {
	    const rect = canvas.getBoundingClientRect();
	    const x = e.clientX - rect.left;
	    const y = e.clientY - rect.top;
	    painter.draw([x, y]);
	  });
	});


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	const Pixel = __webpack_require__(2);
	const Util = __webpack_require__(3);

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


/***/ },
/* 2 */
/***/ function(module, exports) {

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


/***/ },
/* 3 */
/***/ function(module, exports) {

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
	      if (coord[0] >= 0 && coord[0] <= 900 &&
	        coord[1] >= 0 && coord[1] <= 600) {
	        result.push(coord);
	      }
	    });
	    return result;
	  }
	};

	module.exports = Util;


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	const Painter = __webpack_require__(1);

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


/***/ }
/******/ ]);