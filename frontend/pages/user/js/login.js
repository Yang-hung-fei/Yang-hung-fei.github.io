import config from '../../../../ipconfig.js';
import { backToRedirectUrl } from '../../../js/backToRedirectUrl.js';
$(window).on("load", () => {
  $("#login").on("click", function () {
    $("div.overlay").fadeIn();

    var data = {
      email: $('#email').val(),
      password: $('#password').val()
    };

    fetch(config.url + "/user/login", {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data)
    })
      .then(response => response.json())
      .then(data => {
        switch (data.code) {
          case 200:
            const token = data.message;
            // 处理成功响应数据
            localStorage.setItem("Authorization_U", token); //將 token 存入 local storage
            console.log("Authorization_U:", token);
            if (token) {
              // 进行使用存储的 token 的操作
              console.log("Stored Authorization_U:", token);
              backToRedirectUrl();//跳回原頁
            } else {
              // 没有存储的 token，可能需要用户登录或其他处理
              console.log("No stored Authorization_U found.");
              //TODO: 顯示燈箱(登入錯誤，請聯繫客服信箱 & 跳回首頁按鈕)
            }
            break;
          case 400:
            // 处理 code 为 400 的情况
            console.log("Code 400 response:", data.message);
            //TODO: 顯示燈箱(密碼錯誤 & 忘記密碼按鈕)
            break;
          default:
            console.log("Unknown response code:", data.code);
        }
      })
      .catch(error => {
        // 处理捕获的错误，包括网络错误等
        console.error("Fetch error:", error);
      });
  });
});
