import { checkEmail, checkPassword } from "/frontend/pages/user/js/checkInput.js";
import { localLogin } from "/frontend/pages/user/js/localLogin.js";

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