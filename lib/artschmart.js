const Painter = require('./painter');
const Painting = require('./painting');

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
    };

    reader.readAsDataURL(file);
  });

  canvas.addEventListener("click", () => {
    painter.blurImage();
  });

});
