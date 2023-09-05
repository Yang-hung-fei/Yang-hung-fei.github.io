document.addEventListener("DOMContentLoaded", function () {
  const userButton = document.getElementById("user");
  userButton.addEventListener("click", btnUser);
});

export function btnUser() {
  const token = localStorage.getItem("Authorization_U"); //取得 local storage 中的 token
  console.log("Authorization_U:", token);
  if (token) {
    window.location.href =
      "/frontend/pages/memberCentre/memberCentre.html"; // 進入會員中心
  } else {
    //預設跳轉網址
    const currentPageUrl = window.location.href; // 获取当前页面的 URL
    localStorage.setItem("redirectUrl", currentPageUrl); // 将当前页面的 URL 存储在本地存储中
    window.location.href = "/frontend/pages/user/login.html"; // 進入登入頁面
  }
}