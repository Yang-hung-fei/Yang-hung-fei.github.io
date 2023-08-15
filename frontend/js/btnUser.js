import config from "../../ipconfig.js";
export function btnUser() {
  localStorage.getItem("Authorization_U", token); //取得 local storage 中的 token
  console.log("Authorization_U:", token);
  if (token) {
    window.location.href = config.url + "../pages/memberCentre/memberCentre.html"; // 進入會員中心
  } else {
    //預設跳轉網址
    const currentPageUrl = window.location.href; // 获取当前页面的 URL
    localStorage.setItem("redirectUrl", currentPageUrl); // 将当前页面的 URL 存储在本地存储中
    window.location.href = config.url + "login.html"; // 進入登入頁面
  }
}
