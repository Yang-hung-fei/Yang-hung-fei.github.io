import config from "../../../../ipconfig.js";
import { backToRedirectUrl } from "../../../js/backToRedirectUrl.js";
$(window).on("load", () => {
  $("#localLogin").on("click", () => {
    $("div.overlay").fadeIn();

    const data = {
      email: $("#email").val(),
      password: $("#password").val(),
    };

    fetch(config.url + "/user/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((responseData) => {
        var code = responseData.code;
        var action = responseActions[code] || responseActions.default;
        action(responseData);
      })
      .catch((error) => {
        console.error("Fetch error");
      });
  });
});

var responseActions = {
  200: function (data) {
    var token = data.message;
    localStorage.setItem("Authorization_U", token);
    console.log("Authorization_U:", token);
    if (token) {
      backToRedirectUrl(); 
    } else {
      console.log("Code 200: No stored Authorization_U found.");
      //TODO: 顯示燈箱(登入錯誤，請聯繫客服信箱 & 跳回首頁按鈕)
    }
  },
  400: function () {
    console.log("Code 400 response:", data.message);
    //TODO: 顯示燈箱(密碼錯誤 & 忘記密碼按鈕)
  },
  default: function (data) {
    console.log("Unknown response code:", data.code);
  },
};

