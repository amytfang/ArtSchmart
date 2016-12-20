## Art Schmart

### Functionality & MVP  

Art Schmart is an image manipulation program that enables users to create Impressionistic versions of their own photos.

With Art Schmart, users will be able to:

- [ ] Manipulate a preselected image
- [ ] Upload and view their own photos
- [ ] Select how "Impressionistic" (a.k.a. blurry) the photos will be
- [ ] View the changes to their photos in real-time

In addition, this project will include:

- [ ] An About modal describing the background and how to use the tool
- [ ] A production README

### Wireframes

This app will consist of a single screen with the photo canvas, image settings, and nav links to the Github, my LinkedIn, and the About modal.  Image settings will include a slider to set the "Impressionistic" level of the image.  Additionally, a drop-down will be added to the settings to toggle between different art styles (again, see Bonus Features).

![wireframes]()

### Architecture and Technologies

This project will be implemented with the following technologies:

- Vanilla JavaScript for overall structure,
- `HTML5 Canvas` for DOM manipulation and rendering,
- Webpack to bundle and serve up the various scripts.

In addition to the webpack entry file, there will be three scripts involved in this project:

`canvas.js`: this script will handle the logic for creating and updating the necessary canvas elements and rendering them to the DOM.

`painter.js`: this script will handle the logic behind the scenes.  A `Painter` object will hold the `styleType`, a `level`, and a 2D array of `Pixel`s representing the image.  `painter.js` will be responsible for the selection of random `Pixel`s, creating a random blur radius based on the `level`, and updating the `Pixel` array appropriately.

`pixel.js`: this lightweight script will hold the constructor and update functions for `Pixel` objects and  will maintain instances variables for `position`, `originalColor`, and `updatedColor`.

### Implementation Timeline

**Day 1**: Setup all necessary Node modules, including getting webpack up and running.  Create `webpack.config.js` as well as `package.json`.  Write a basic entry file and the bare bones of all 3 scripts outlined above.  Goals for the day:

- Get a green bundle with `webpack`
- Connect the `Painter` object to the `Canvas` object and the `Pixel` object
- Get familiar enough with `HTML Canvas` tools to upload photos into `Canvas` and create `Pixel` objects from the data of individual image pixels

**Day 2**: Complete the connection between the `Pixel` objects and rendering on the DOM and start developing the image manipulation algorithm.  Goals for the day:

- Complete the `pixel.js` module (constructor, update functions)
- Render a manipulated photo to the `Canvas`
- Create function to manipulate a number of `Pixel` based on circular area
- Create algorithm for selecting random `Pixel`s and creating random blur radii

**Day 3**: Complete algorithm.  Build out functions that handle different levels and determine the settings per level.  Incorporate the `painter.js` logic into the `canvas.js` rendering.  Goals for the day:

- Export an `Canvas` object with correct type and handling logic
- Have a functional grid on the `Canvas` frontend that correctly handles changes in level


**Day 4**: Install the controls for the user to interact with the canvas.  Style the frontend, making it polished and professional.  Goals for the day:

- Create controls for image settings
- Have a styled `Canvas`, nice looking controls and title


### Bonus features

There are many directions this image manipulation tool could eventually go.  Some anticipated updates are:

- [ ] Add options for Pointillism and other art styles
- [ ] Allow users to choose different types of algorithms and blur shapes
