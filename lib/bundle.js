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

	  makeImpression() {
	    const pixelCount = 100000 / this.level;
	    const pixelSample = Util.getRandomSubarray(this.pixelMap, pixelCount);
	    pixelSample.forEach((pixel) => {
	      let toggle = Math.random();
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