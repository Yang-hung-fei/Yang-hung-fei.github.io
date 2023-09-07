$(document).ready(function () {
  var $lightboxOverlay = $("#lightboxOverlay");
  var $editLightBox = $("#editLightBox");
  var $addLightBox = $("#addLightBox");

  // 點擊lightboxOverlay或<span>元素都會關閉燈箱
  $lightboxOverlay.click(function () {
    closeModal();
  });

  // 點擊<span>元素也會關閉燈箱
  $(".close").click(function () {
    closeModal();
  });

  $("#Add_completeButton").click(function () {
    closeModal();
  });

  function closeModal() {
    $editLightBox.hide();
    $addLightBox.hide();
    $lightboxOverlay.hide();
  }
});
