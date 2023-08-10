$(window).on("load", () => { 
  $("#login").on("click", function () { 
    $("div.overlay").fadeIn();
    // 在這裡加入您的Ajax請求或其他登入處理
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const loginData = { "email": email, "password": password };

    const xhr = new XMLHttpRequest();
    xhr.open("POST", "https://example.com/login", true);
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.onreadystatechange = function() {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.responseText);
          console.log(response.message); // 印出回傳的訊息或處理其他操作
        } else {
          console.log("登入失敗");
        }
        $("div.overlay").fadeOut(); // 登入處理完成後隱藏overlay
      }
    };

    xhr.send(JSON.stringify(loginData));
  });
});
