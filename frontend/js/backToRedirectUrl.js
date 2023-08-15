import config from '../../ipconfig.js';
export function backToRedirectUrl(){
    const redirectUrl = localStorage.getItem("redirectUrl"); // 获取存储的重定向 URL
              if (redirectUrl) {
                window.location.href = redirectUrl; // 如果有重定向 URL，使用它进行导航，否则导航回默认页面
              } else {
                window.location.href = config.url + "/frontend/index.html";  // 替换为默认页面 URL
              }
}