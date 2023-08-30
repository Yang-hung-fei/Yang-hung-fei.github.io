export function backToRedirectUrl() {
  const redirectUrl = localStorage.getItem("redirectUrl"); // 获取存储的重定向 URL
  if (redirectUrl) {
    localStorage.removeItem("redirectUrl"); // 從 localStorage 刪除已使用的 redirectUrl
    window.location.href = redirectUrl; // 如果有重定向 URL，使用它进行导航，否则导航回默认页面
  } else {
    window.location.href = "/frontend/index.html"; // 替换为默认页面 URL
  }
}
