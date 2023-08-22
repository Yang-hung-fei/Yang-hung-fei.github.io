import config from "../../ipconfig.js";
$(window).on("load", () => {
  var token = localStorage.getItem("Authorization_U");

  fetch(config.url + "/user/profile", {
    method: "GET",
    headers: {
      Authorization_U: token,
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((responseData) => {
      var code = responseData.code;
      if (code === 200) {
        let userPic_base64 = responseData.message.userPic;
        console.log(responseData);
        console.log(userPic_base64);
        let user_el = document.getElementById("user");
        user_el.style.background =
          "url('data:image/png;base64," + userPic_base64 + "') !important";
      }
    })
    .catch((error) => {
      // 处理捕获的错误，包括网络错误等
      console.error("Fetch error:", error);
    });
});
