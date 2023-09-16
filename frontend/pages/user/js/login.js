import config from "../../../../ipconfig.js";
import { backToRedirectUrl } from "../../../js/backToRedirectUrl.js";

window.addEventListener("load", function() {
  const token = localStorage.getItem("Authorization_U");

  if (token) {
    window.location.href = "/frontend/pages/memberCentre/memberCentre.html";
  } else {
    document.getElementById("localLogin").addEventListener("click", async function(event) {
      event.preventDefault(); // 阻止表單的預設行為
      var emailText = document.getElementById("email").value;
      var password = document.getElementById("password").value;

      if (emailText === "" || password === "") {
        swal("請輸入信箱及密碼。");
        return;
      }

      var emailError = checkEmail(emailText);
      var passwordError = checkPassword(password);

      if (emailError || passwordError) {
        swalThenFadeOut(emailError || passwordError);
        return; // 如果有錯誤，中斷程式碼執行
      }

      // 機器人驗證
      // 取得 reCAPTCHA 驗證的回應 token
      var response = grecaptcha.getResponse();

      // 檢查回應是否為空，表示未通過驗證
      if (response.length === 0) {
        swal("失敗", "請通過機器人驗證", "error");
        return;
      }

      // 顯示 fetch 前的燈箱
      document.querySelector("div.overlay").style.display = "block";

      try {
        await localLogin(emailText, password);

        // 在 localLogin 完成後，關閉燈箱
        document.querySelector("div.overlay").style.display = "none";
      } catch (error) {
        console.error("Error:", error);
        document.querySelector("div.overlay").style.display = "none";
      }
    });
  }

  function checkPassword(password) {
    if (password.length < 6) {
      return "密碼長度不足。";
    }
    return null; // No error
  }

  async function localLogin(email, password) {
    const data = {
      email: email,
      password: password,
    };

    const response = await fetch(config.url + "/user/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const responseData = await response.json();

    var code = responseData.code;

    if (code === 200) {
      var token = responseData.message;
      localStorage.setItem("Authorization_U", token);
      if (token) {
        backToRedirectUrl();
      } else {
        await swalThenFadeOut("登入錯誤，請聯繫客服。");
      }
    } else if (code === 400) {
      console.log("Code 400 response:", data.message);
      await swalThenFadeOut("帳號未註冊，或密碼錯誤。");
    } else {
      console.log("Unknown response code:", data.code);
    }
  }

  async function swalThenFadeOut(message) {
    await swal({
      text: message,
      onAfterClose: function() {
        console.log("afterclose");
        document.querySelector("div.overlay").style.display = "none";
      },
      buttons: {
        confirm: {
          text: "確認",
          value: true,
          visible: true,
          className: "",
          closeModal: true,
        },
      },
    });
  }

  const passwordInput = document.getElementById("password");
  const showPasswordToggle = document.getElementById("showPasswordToggle");

  showPasswordToggle.addEventListener("click", function() {
    if (passwordInput.type === "password") {
      passwordInput.type = "text";
      showPasswordToggle.classList.remove("fa-eye-slash");
      showPasswordToggle.classList.add("fa-eye");
    } else {
      passwordInput.type = "password";
      showPasswordToggle.classList.remove("fa-eye");
      showPasswordToggle.classList.add("fa-eye-slash");
    }
  });

  document.getElementById("email").addEventListener("change", function() {
    validateEmail();
  });

  document.getElementById("password").addEventListener("change", function() {
    checkPasswordLength();
  });

  function validateEmail() {
    const emailInput = document.getElementById("email");
    const emailError = document.getElementById("emailError");
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

    if (!emailPattern.test(emailInput.value)) {
      emailError.textContent = "輸入的信箱無效";
    } else {
      emailError.textContent = "";
    }
  }

  function checkPasswordLength() {
    var passwordInput = document.getElementById("password");
    var passwordError = document.getElementById("passwordError");
    var password = passwordInput.value;

    if (password.length >= 6) {
      // 清除錯誤訊息，如果之前有顯示的話
      passwordError.textContent = "";
    } else {
      // 顯示錯誤訊息
      passwordError.textContent = "密碼長度至少需 6 個字";
    }
  }
});

export function checkEmail(emailText) {
  // Check email format
  var emailRegex =
    /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$/;

  if (!emailText.match(emailRegex)) {
    return "Email 格式不正確。";
  }
  return null; // No error
}