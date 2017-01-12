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

	  const src = "demo_images/demo-image-1.jpg";
	  // const src = "https://s3.amazonaws.com/artschmart-demo-images/coastline.jpg";
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

	  const reset = document.getElementById('reset-button');
	  reset.addEventListener("click", (e) => {
	    painting.resetImage();
	    document.getElementById('image-form').reset();
	  });

	  const download = document.getElementById('download-button');
	  download.addEventListener("click", (e) => {
	    let dataURL = canvas.toDataURL("image/png");
	    window.location.href = dataURL;
	  });

	  const demos = document.getElementsByClassName('demo-images');
	  for (let i = 0; i < demos.length; i++) {
	    demos[i].addEventListener("click", (e) => {
	      let imageURL = `demo_images/${e.target.name}.jpg`;
	      painting.updateImage(imageURL, ctx);
	      document.getElementById('image-form').reset();
	    });
	  }

	  const canvasMenu = document.getElementById('image-dropdown');
	  canvasMenu.addEventListener("change", (e) => {
	    const style = e.target.value;
	    painter.updateCanvasStyle(style);
	  });

	  const canvasSlider = document.getElementById('image-slider');
	  canvasSlider.addEventListener("change", (e) => {
	    const value = e.target.value;
	    painter.updateCanvasClarity(value);
	  });

	  const brushMenu = document.getElementById('brush-dropdown');
	  brushMenu.addEventListener("change", (e) => {
	    const style = e.target.value;
	    painter.brushStyle = style;
	    if (style !== "none") {
	      canvas.classList.add("brush-mode");
	    } else {
	      canvas.classList.remove("brush-mode");
	    }
	  });

	  const brushClaritySlider = document.getElementById('brush-clarity-slider');
	  brushClaritySlider.addEventListener("change", (e) => {
	    const value = e.target.value;
	    painter.brushClarity = value;
	  });

	  const brushSizeSlider = document.getElementById('brush-size-slider');
	  brushSizeSlider.addEventListener("change", (e) => {
	    const value = e.target.value;
	    painter.updateBrushSize(value);
	  });

	  canvas.addEventListener("mousedown", (e) => {
	    changeImage(e);
	    canvas.addEventListener("mousemove", changeImage);
	  });

	  canvas.addEventListener("mouseup", (e) => {
	    canvas.removeEventListener("mousemove", changeImage);
	  });

	  function changeImage(e) {
	    const rect = canvas.getBoundingClientRect();
	    const x = Math.floor(e.clientX - rect.left);
	    const y = Math.floor(e.clientY - rect.top);
	    painter.draw([x, y]);
	  }
	});


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	const Pixel = __webpack_require__(2);
	const Util = __webpack_require__(3);

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
	      if (coord[0] >= 0 && coord[0] < 900 &&
	        coord[1] >= 0 && coord[1] < 600) {
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