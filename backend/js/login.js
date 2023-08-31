import config from "/ipconfig.js";
import { checkEmail } from "/frontend/pages/user/js/login.js";
import { checkPassword } from "/frontend/pages/user/js/login.js";
import { swalThenFadeOut } from "/frontend/pages/user/js/login.js";

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
          swal("請輸入信箱及密碼。");
          return;
        }
  
        var accountError = checkEmail(accountText);
        var passwordError = checkPassword(password);
  
        if (accountError || passwordError) {
          swalThenFadeOut(accountError || passwordError);
          return; // 如果有錯誤，中斷程式碼執行
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
      account: account,
      password: password,
    };
  
    const response = await fetch(config.url + "/manager/login", {
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
      localStorage.setItem("Authorization_M", token);
      if (!token) {
        await swalThenFadeOut("登入錯誤，請聯繫管理員。");
      }
    } else if (code === 400) {
      console.log("Code 400 response:", data.message);
      await swalThenFadeOut("帳號未註冊，或密碼錯誤。");
    } else {
      console.log("Unknown response code:", data.code);
    }
  }
  
