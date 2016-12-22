const Painter = require('./painter');
const Painting = require('./painting');

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
