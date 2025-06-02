// Prevent dragging of all anchor tags and images
document.addEventListener("DOMContentLoaded", function () {
  // Prevent drag for links
  const links = document.querySelectorAll("a");
  links.forEach(link => {
    link.setAttribute("draggable", "false");
    link.addEventListener("dragstart", function (e) {
      e.preventDefault();
    });
  });

  // Prevent drag for images
  const images = document.querySelectorAll("img");
  images.forEach(img => {
    img.setAttribute("draggable", "false");
    img.addEventListener("dragstart", function (e) {
      e.preventDefault();
    });
  });

  // Extra safety: prevent dropping items anywhere in the document
  document.addEventListener("dragover", function (e) {
    e.preventDefault();
  });

  document.addEventListener("drop", function (e) {
    e.preventDefault();
  });
});