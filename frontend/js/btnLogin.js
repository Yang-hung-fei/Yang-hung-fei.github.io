import config from '../../ipconfig.js';
export function btnLogin() {
    // 获取当前页面的 URL
    const currentPageUrl = window.location.href;

    // 将当前页面的 URL 存储在本地存储中
    localStorage.setItem("redirectUrl", currentPageUrl);

    window.location.href = config.url + "login.html";
}