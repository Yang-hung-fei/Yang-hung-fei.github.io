// 獲取遮罩元素和燈箱元素
var lightboxOverlay = document.getElementById("lightboxOverlay");
// 添加遮罩點擊事件監聽器
lightboxOverlay.addEventListener("click", function () {
  closeModal(); // 這是通用的關閉燈箱函數，可以根據需要進一步改進
});

//---------listenLightBox---------

var editLightBox = document.getElementById("editLightBox");

// 添加遮罩點擊事件監聽器
lightboxOverlay.addEventListener("click", function () {
  closeModal(); // 這是關閉燈箱的函數，請確保你已經定義了這個函數
});

//---------action---------

// 關閉燈箱的函數
function closeModal() {
  editLightBox.style.display = "none"; // 關閉燈箱
  lightboxOverlay.style.display = "none"; // 隱藏遮罩
}

function openModal() {
  editLightBox.style.display = "block"; // 顯示燈箱
  lightboxOverlay.style.display = "block"; // 顯示遮罩
}
