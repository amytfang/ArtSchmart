const Painter = require('./painter');
const Painting = require('./painting');

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
