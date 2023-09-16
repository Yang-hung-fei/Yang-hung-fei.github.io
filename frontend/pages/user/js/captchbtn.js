import config from "../../../../ipconfig.js";
import { checkEmail } from "./login.js";

$("#chptcha_btn").on("click", () => {
  var emailText = document.getElementById("email").value;
  var emailError = checkEmail(emailText);

  if (emailError) {
    swal("信箱格式錯誤。");
    return;
  }
  const formData = new URLSearchParams();
  formData.append("email", emailText);

  checkAccountAndRequestCaptcha(config.url, formData);
});

function checkAccountAndRequestCaptcha(baseUrl, formData) {
  fetch(baseUrl + "/user/checkAccountIsSignUp", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: formData.toString(),
  })
    .then((response) => response.json())
    .then((responseData) => {
      var code = responseData.code;
      if (code === 200) {
        sendCaptchaRequest(baseUrl, formData);
      } else {
        swal("此信箱已註冊，請檢查信箱地址。");
      }
    })
    .catch((error) => console.error("Error:", error));
}

function sendCaptchaRequest(baseUrl, formData) {
  fetch(baseUrl + "/user/generateCaptcha", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: formData.toString(),
  })
    .then((response) => response.json())
    .then((responseData) => {
      console.log("Response Data:", responseData); // Add this line
      var code = responseData.code;
      if (code === 200) {
        const btn_getchptcha = document.getElementById("chptcha_btn");
        btn_getchptcha.disabled = true;
        btn_getchptcha.classList.remove("btn--green");
        
        let countDown = 60;
        let intervalId;
        countDown = 60;
        intervalId = setInterval(() => {
          countDown--;
          if (countDown >= 0) {
            btn_getchptcha.innerText = "重新取得驗證碼 (" + countDown + " 秒)";
          } else {
            clearInterval(intervalId);
            btn_getchptcha.innerText = "產生驗證碼";
            btn_getchptcha.disabled = false;
          }
        }, 1000); // 1秒
      } else if (code === 400) {
        swal(responseData.message);
      }
    })
    .catch((error) => console.error("Error:", error));
}
