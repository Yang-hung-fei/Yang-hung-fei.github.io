import config from "../../../../ipconfig.js";

$("#editPasswordBtn").on("click", function () {
  $("#firstPassword").val("");
  $("#secondPassword").val("");
  $("#DBPasseord").css("display", "none");
  $("#resetPassword").css("display", "block");
});

$("#resetPasswordBtn").on("click", function () {
  checkResetPassword();

  $("#resetPassword").css("display", "none");

  const token = localStorage.getItem("Authorization_U");

  const firstPassword = document.getElementById("firstPassword");
  const secondPassword = document.getElementById("secondPassword");

  const newPassword = firstPassword.value;

  const formData = new URLSearchParams();
  formData.append("key1", "value1"); // Replace with your actual key-value pairs
  formData.append("key2", "value2");
  formData.append("userPassword", newPassword);

  fetch(config.url + "/user/password", {
    method: "PUT",
    headers: {
      Authorization_U: token,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: formData.toString(), // Encode the parameters as a string
  })
    .then((response) => response.json())
    .then((responseData) => {
      var code = responseData.code;
      if (code === 200) {
        swal("修改成功", "", "success");
      } else if (code === 401) errorAuth();
    })
    .catch((error) => {
      // 处理捕获的错误，包括网络错误等
      console.error("Fetch error:", error);
    });

  $("#DBPasseord").css("display", "block");

  function errorAuth() {
    swal({
      title: "哎呀🤭",
      text: "您尚未登入，請重新登入",
      icon: "error",
    }).then((value) => {
      localStorage.removeItem("Authorization_U");
      window.location.href = "/frontend/pages/user/login.html"; // 替换为你要跳转的页面地址
    });
  }
});

function checkResetPassword() {
  const firstPassword = document.getElementById("firstPassword");
  const secondPassword = document.getElementById("secondPassword");

  const newPassword = firstPassword.value;
  const confirmPassword = secondPassword.value;

  if (newPassword.length < 6) {
    swal("密碼必須為至少6位數的英文數字。");
    cleanInput();
    return;
  }

  if (newPassword !== confirmPassword) {
    swal("兩次輸入的密碼不一致。");
    cleanInput();
    return;
  }

  // 使用正则表达式来检查密码是否只包含英文字母和数字
  const passwordPattern = /^[A-Za-z0-9]+$/;
  if (!passwordPattern.test(newPassword)) {
    swal("密碼只能包含英文字母或數字。");
    cleanInput();
    return;
  }
}

function cleanInput() {
  firstPassword.value = "";
  secondPassword.value = "";
}
