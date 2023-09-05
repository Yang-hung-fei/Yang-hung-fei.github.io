import config from "../../../../ipconfig.js";

//=======POST

$("#submit").on("click", () => {
  let theuserData = getSignUpData();

  fetch(config.url + "/user/signUp", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(theuserData),
  })
    .then((response) => response.json())
    .then((responseData) => {
      var code = responseData.code;
      console.log(theuserData);
      if (code === 200) {
        console.log("code", code, ":", responseData.message);

        const delayTime = 5000; // 5秒 // 設定延遲時間（毫秒）
        swal("註冊成功", `將在 ${delayTime / 1000} 秒後跳至登入頁面。`, "success"); // 顯示註冊成功的提示框
        const countdownElement = document.querySelector(".swal-text"); // 取得文字內的元素
        let countdown = Math.ceil(delayTime / 1000); // 開始倒數
        const countdownInterval = setInterval(() => {
          countdown--;
          countdownElement.textContent = `將在 ${countdown} 秒後跳至首頁。`;

          if (countdown <= 0) {
            clearInterval(countdownInterval);
            // 跳轉至首頁
            window.location.href =
              "/frontend/pages/user/login.html";
          }
        }, 1000); // 每秒更新一次倒數

        return;
      } else if (code === 500) {
        console.log("code", code, ":", responseData.message);
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      // 输出服务器返回的文本
      if (error instanceof Response) {
        error.text().then((text) => {
          console.error("Server response:", text);
        });
      }
    });
});

function getSignUpData() {
  var userName_el = document.getElementById("username").value;
  var userNickName_el = document.getElementById("nickname").value;
  var gender_el = document
    .querySelector("#gender + span span span span")
    .getAttribute("title");
  // var birthday_el = document.getElementById("birthday").value; // 获取输入框中的日期字符串，例如 "21/08/2023"

  // // 将日期字符串分割成日、月和年
  // var parts = birthday_el.split("/");
  // var day = parseInt(parts[0]);
  // var month = parseInt(parts[1]);
  // var year = parseInt(parts[2]);

  // // 创建新的日期对象（注意月份减去 1）
  // var newDate = new Date(year, month - 1, day);

  // // 获取年、月、日的字符串形式
  // var yyyy = newDate.getFullYear();
  // var mm = (newDate.getMonth() + 1).toString().padStart(2, "0"); // 月份需要加1，然后保证两位数格式
  // var dd = newDate.getDate().toString().padStart(2, "0"); // 日期保证两位数格式

  // // 组合成目标格式的字符串
  // var formattedDate = yyyy + "-" + mm + "-" + dd;

  var email_el = document.getElementById("email").value;
  var phone_el = document.getElementById("phone").value;
  var password_el = document.getElementById("password").value;

  //---------地址
  var city_el =
    document.getElementById("city").options[
      parseInt(document.getElementById("city").value) + 1
    ].text;
  var area_el =
    document.getElementById("area").options[
      document.getElementById("area").value
    ].text;
  var address_el = document.getElementById("address_input").value;
  var fullAddress = city_el + area_el + address_el;
  //^^^^^^^^^^地址

  var chaptcha_el = document.getElementById("chatcha_code").value;

  //=======JSON

  var userData = {};

  userData.captcha = chaptcha_el;
  userData.userAddress = fullAddress;
  userData.userEmail = email_el;
  if (gender_el === "女性") {
    userData.userGender = 0;
  } else if (gender_el === "男性") {
    userData.userGender = 1;
  } else {
    userData.userGender = 2;
  }
  userData.userName = userName_el;
  userData.userNickName = userNickName_el;
  userData.userPassword = password_el;
  userData.userPhone = phone_el;
  //   userData.userBirthday = formattedDate;

  return userData;
}
