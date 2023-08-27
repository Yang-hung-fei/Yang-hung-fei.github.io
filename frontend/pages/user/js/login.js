import config from "../../../../ipconfig.js";
import { backToRedirectUrl } from "../../../js/backToRedirectUrl.js";

$(window).on("load", () => {
  const token = localStorage.getItem("Authorization_U");

  if (token) {
    window.location.href = "/frontend/pages/memberCentre/memberCentre.html";
  } else {
    $("#localLogin").on("click", (event) => {
      event.preventDefault(); // 阻止表單的預設行為
      var emailText = $("#email").val();
      var password = $("#password").val();

      if (emailText === "" || password === "") {
        swal("請輸入信箱及密碼。");
        return;
      }

      var emailError = checkEmail(emailText);
      var passwordError = checkPassword(password);

      if (emailError) {
        alert(emailError);
        return;
      }

      if (passwordError) {
        alert(passwordError);
        return;
      }

      localLogin(emailText, password);
    });
  }
});

export function checkEmail(emailText) {
  // Check email format
  var emailRegex =
    /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$/;

  if (!emailText.match(emailRegex)) {
    swal("請輸入信箱格式。");
  }
  return null; // No error
}

function checkPassword(password) {
  if (password.length < 6) {
    swal("請確認密碼，須至少6個英文或數字。");
  }
  return null; // No error
}

function localLogin(email, password) {
  $("div.overlay").fadeIn();

  const data = {
    email: email,
    password: password,
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

      if (code === 200) {
        var token = responseData.message;
        localStorage.setItem("Authorization_U", token);
        if (token) {
          backToRedirectUrl();
        } else {
          swal({
            text: "登入錯誤，請聯繫客服信箱。",
            onAfterClose: () => {
              console.log("afterclose");
              $("div.overlay").fadeOut(); // 在swal关闭后关闭燈箱
              setTimeout(function () {
                window.location.href = "/frontend/index.html";
              }, 1000);
            },
          });
        }
      } else if (code === 400) {
        console.log("Code 400 response:", data.message);
        swal("密碼錯誤");
        $("div.overlay").fadeOut();
      } else {
        console.log("Unknown response code:", data.code);
      }
    })
    .catch((error) => {
      console.error("Fetch error:", error);
      swal("網路錯誤，請稍後再試。");
      $("div.overlay").fadeOut();
    });
}
