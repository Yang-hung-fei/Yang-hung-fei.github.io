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
        if (userPic_base64) {
          console.dir(responseData);
          let user_el = document.getElementById("user");
          var userPic_el = document.createElement("img");
          userPic_el.src = "data:image/png;base64," + userPic_base64;
          userPic_el.style.width = "100%";
          userPic_el.style.height = "100%";
          userPic_el.style.borderRadius = "100%";
          user_el.appendChild(userPic_el);

          let userIcon_el = document.getElementById("userIcon");
          userIcon_el.style.display = "none";
        }
      }
    })
    .catch((error) => {
      // 处理捕获的错误，包括网络错误等
      console.error("Fetch error:", error);
    });
});
