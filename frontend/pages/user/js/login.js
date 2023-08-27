import config from "../../../../ipconfig.js";
import { backToRedirectUrl } from "../../../js/backToRedirectUrl.js";

$("#localLogin").on("click", (event) => {
  event.preventDefault(); // 阻止表單的預設行為

  var emailText = $("#email").val();
  var password = $("#password").val();

  if (emailText === "" || password === "") {
    //TODO: 沒有填入資料的話，就提示輸入資料
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

  // 資料正確，才顯示燈箱
  localLogin(emailText, password);
});

export function checkEmail(emailText) {
  // Check email format
  var emailRegex =
    /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$/;

  if (!emailText.match(emailRegex)) {
    return "Invalid email format";
  }
  return null; // No error
}

function checkPassword(password) {
  if (password.length < 6) {
    return "Password should be at least 6 characters long";
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
          console.log("Code 200: No stored Authorization_U found.");
          // TODO: 顯示燈箱(登入錯誤，請聯繫客服信箱 & 跳回首頁按鈕)
        }
      } else if (code === 400) {
        console.log("Code 400 response:", data.message);
        // TODO: 顯示燈箱(密碼錯誤 & 忘記密碼按鈕)
      } else {
        console.log("Unknown response code:", data.code);
      }
    })
    .catch((error) => {
      console.error("Fetch error:", error);
      // TODO: 顯示燈箱(網路錯誤，請稍後再試)
    });
}
