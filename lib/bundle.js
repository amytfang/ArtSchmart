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
	const Painting = __webpack_require__(3);

	document.addEventListener("DOMContentLoaded", () => {
	  const canvas = document.getElementById('image-canvas');
	  canvas.height = Painting.HEIGHT;
	  canvas.width = Painting.WIDTH;
	  const ctx = canvas.getContext('2d');

	  const src = "https://s3.amazonaws.com/artschmart-demo-images/coastline.jpg";
	  const painting = new Painting(src, ctx);
	  const painter = new Painter(painting);

	  const imageInput = document.getElementById('file-input');
	  imageInput.addEventListener("change", () => {
	    const file = document.getElementById('file-input').files[0];
	    const reader = new FileReader();
	    reader.onload = (e) => {
	      let imageURL = e.target.result;
	      painting.updateImage(imageURL, ctx);
	      painter.updatePainting(painting);
	    };

	    reader.readAsDataURL(file);
	  });

	  new Painter(src, ctx);
	});


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	const Pixel = __webpack_require__(2);

	class Painter {
	  constructor(painting) {
	    this.painting = painting;
	  }






	}

	module.exports = Painter;


/***/ },
/* 2 */
/***/ function(module, exports) {

	class Pixel {
	  constructor(options) {
	    this.position = options.position;
	    this.color = options.color;
	  }

	  shift() {
	    
	  }
	}

	module.exports = Pixel;


/***/ },
/* 3 */
/***/ function(module, exports) {

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


/***/ }
/******/ ]);