import config from "/ipconfig.js";
import { backToRedirectUrl } from "/frontend/js/backToRedirectUrl.js";

export async function localLogin(email, password) {
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

  export async function swalThenFadeOut(message) {
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
  