var lightboxOverlay = document.getElementById("lightboxOverlay");
var editLightBox = document.getElementById("editLightBox");
var addLightBox = document.getElementById("addLightBox");

lightboxOverlay.addEventListener("click", function () {
  closeModal();
});

function closeModal() {
  editLightBox.style.display = "none";
  addLightBox.style.display = "none";
  lightboxOverlay.style.display = "none";
}
