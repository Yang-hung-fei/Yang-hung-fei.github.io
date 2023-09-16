import config from "/ipconfig.js";
import { checkPassword } from "/frontend/pages/user/js/checkInput.js";
import { swalThenFadeOut } from "/frontend/pages/user/js/localLogin.js";

$(window).on("load", () => {
  const token = localStorage.getItem("Authorization_M");

  if (token) {
    window.location.href = "/backend/index.html";
  } else {
    $("#managerLogin").on("click", async (event) => {
      event.preventDefault(); // 阻止表單的預設行為
      var accountText = $("#account").val();
      var password = $("#password").val();

      if (accountText === "" || password === "") {
        swal("請輸入帳號及密碼。");
        return;
      }

      var passwordError = checkPassword(password);

      if (passwordError) {
        swalThenFadeOut(passwordError);
        return; // 如果有錯誤，中斷程式碼執行
      }

       //機器人驗證
      // 取得 reCAPTCHA 驗證的回應 token
      var response = grecaptcha.getResponse();

      // 檢查回應是否為空，表示未通過驗證
      if (response.length === 0){
        swal("失敗", "請通過機器人驗證", "error");
        return;
      }

      // 顯示 fetch 前的燈箱
      $("div.overlay").fadeIn();

      try {
        await ManagerLogin(accountText, password);

        // 在 ManagerLogin 完成後，關閉燈箱
        $("div.overlay").fadeOut();
      } catch (error) {
        console.error("Error:", error);
        $("div.overlay").fadeOut();
      }
    });
  }
});

async function ManagerLogin(account, password) {
  const data = {
    managerAccount: account,
    managerPassword: password,
  };
  console.log(data);
  const response = await fetch(config.url + "/manager/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const responseData = await response.json();

  var code = responseData.code;
  console.log(responseData);
  if (code === 200) {
    var token = responseData.message;
    localStorage.setItem("Authorization_M", token);
    if (!token) {
      await swalThenFadeOut("登入錯誤，請聯繫管理員。");
    }
    window.location.href = "/backend/index.html";
  } else if (code === 400) {
    console.log("Code 400 response:", responseData.message);
    await swalThenFadeOut("帳號未註冊。");
  } else if (code === 401) {
    console.log("Code 401 response:", responseData.message);
    await swalThenFadeOut("密碼錯誤。");
  } else {
    console.log("Unknown response code:", responseData.code);
  }
}
