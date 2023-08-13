import config from '../../../../ipconfig.js';
$(window).on("load", () => {
  $("#login").on("click", function () {
    $("div.overlay").fadeIn();

    var data = {
      email: $('#email').val(),
      password: $('#password').val()
    };

    console.log(data);

    fetch(config.url + "/user/login", {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data)
    })
      .then(response => {
        if (!response.ok) {
          // 处理错误情况，例如 400 错误
          console.log("Request error:", response.statusText);
        }
        return response.json();
      })
      .then(data => {
        // 处理成功响应数据
        console.log(data);
      })
      .catch(error => {
        // 处理捕获的错误
        console.error("Fetch error:", error);
      });


    // const xhr = new XMLHttpRequest();
    // xhr.post(config.url + "/user/login", true);
    // xhr.setRequestHeader("Content-Type", "application/json");

    // xhr.onreadystatechange = function() {
    //   if (xhr.readyState === XMLHttpRequest.DONE) {
    //     if (xhr.status === 200) {
    //       const response = JSON.parse(xhr.responseText);
    //       console.log(response.message); // 印出回傳的訊息或處理其他操作
    //     } else {
    //       console.log("登入失敗");
    //     }
    //     $("div.overlay").fadeOut(); // 登入處理完成後隱藏overlay
    //   }
    // };

    // xhr.send(JSON.stringify(loginData));
  });
});
