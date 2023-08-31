import config from "../../../../ipconfig.js";
import { backToRedirectUrl } from "../../../js/backToRedirectUrl.js";

$(window).on("load", () => {
  const token = localStorage.getItem("Authorization_U");

  if (token) {
    window.location.href = "/frontend/pages/memberCentre/memberCentre.html";
  } else {
    $("#localLogin").on("click", async (event) => {
      event.preventDefault(); // 阻止表單的預設行為
      var emailText = $("#email").val();
      var password = $("#password").val();

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

      // 顯示 fetch 前的燈箱
      $("div.overlay").fadeIn();

      try {
        await localLogin(emailText, password);

        // 在 localLogin 完成後，關閉燈箱
        $("div.overlay").fadeOut();
      } catch (error) {
        console.error("Error:", error);
        $("div.overlay").fadeOut();
      }
    });
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
    onAfterClose: () => {
      console.log("afterclose");
      $("div.overlay").fadeOut();
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


const passwordInput = document.getElementById('password');
const showPasswordToggle = document.getElementById('showPasswordToggle');

showPasswordToggle.addEventListener('click', () => {  
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text'; 
        showPasswordToggle.classList.remove('fa-eye-slash');
        showPasswordToggle.classList.add('fa-eye');
    } else {
        passwordInput.type = 'password'; 
        showPasswordToggle.classList.remove('fa-eye');
        showPasswordToggle.classList.add('fa-eye-slash');
    }
});
$("#email").on("change",(event)=>{ 
  validateEmail();
})
$("#password").on("change",(event)=>{ 
  checkPasswordLength();
})

function validateEmail() {
  const emailInput = document.getElementById('email');
  const emailError = document.getElementById('emailError');
  const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

  if (!emailPattern.test(emailInput.value)) {
      emailError.textContent = '輸入的信箱無效';
  } else {
      emailError.textContent = '';
  }
}

function checkPasswordLength() {
  var passwordInput = document.getElementById('password');
  var passwordError = document.getElementById('passwordError');
  var password = passwordInput.value;

  if (password.length >= 6) {
    // 清除錯誤訊息，如果之前有顯示的話
    passwordError.textContent = '';
  } else {
    // 顯示錯誤訊息
    passwordError.textContent = '密碼長度至少需 6 個字';
  }
}
