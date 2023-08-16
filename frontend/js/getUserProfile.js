import config from "../../ipconfig.js";
$(window).on("load", () => {
  // localStorage.setItem(
  //   "Authorization_U",
  //   "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIyIiwiZXhwIjoxNjkyNDE0ODA4fQ.xgbQEGdz-bbT69kj0gpTXo_PVVs47NlApRdPqIsBUAs"
  // );
  const token = localStorage.getItem("Authorization_U");

  console.log("token: " + token);
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
      var action = responseActions[code] || responseActions.default;
      action(responseData);
    })
    .catch((error) => {
      // 处理捕获的错误，包括网络错误等
      console.error("Fetch error:", error);
    });
});

var responseActions = {
  200: function (data) {
    var userInfo = data.message;
    console.log(userInfo);
    createProfileEditor(userInfo);
  },
  401: function () {
    console.log("code 401: Unauthorized.");
    revomeTokenThenLogin();
  },
  default: function (data) {
    console.log("Unknown response code:", data.code);
  },
};

function revomeTokenThenLogin() {
  localStorage.removeItem("Authorization_U");
  window.location.href = config.url + "login.html";
}

function createProfileEditor(data) {
  var userInfoDiv = document.getElementById("user-info");
  var editInfoDiv = document.getElementById("edit-info");
  var userInfo = data;

  //TODO: edit-info 顯示隱藏的資料欄位
  //TODO: 檢查使用者資料的輸入格式
  //TODO: 儲存按鈕，儲存user-info的資料到edit-info，並傳到api
  //TODO: 燈箱：顯示修改成功

  //名字
  let userName_el = document.getElementById("userName");
  userName_el.textContent = data.userName;
  let userNickName_el = document.getElementById("userNickName");
  userNickName_el.textContent = data.userNickName;
  let userPic_base64 = data.userPic;
  var blob = new Blob([userPic_base64], { type: "image/jpeg" });
  var imageUrl = URL.createObjectURL(blob);
  let userPic_el = document.getElementById("userPic");
  userPic_el.src = imageUrl;

  var imgElement = document.createElement("img");
  imgElement.src = imageUrl;

  document.body.appendChild(imgElement); // 将图片添加到页面中

  for (var key in userInfo) {
    var label = document.createElement("label");
    label.textContent = key + ": ";
    var span = document.createElement("span");
    span.textContent = userInfo[key];
    var br = document.createElement("br");

    userInfoDiv.appendChild(label);
    userInfoDiv.appendChild(span);
    userInfoDiv.appendChild(br);

    var input = document.createElement("input");
    input.type = "text";
    input.value = userInfo[key];
    editInfoDiv.appendChild(input);
    editInfoDiv.appendChild(document.createElement("br")); // Add <br> after each input
  }

  //TODO: 名稱欄位，顯示和編輯交換顯示
  //TODO: enter儲存，還有切換儲存按鈕svg
  //TODO: 將 userPic的base64轉為圖片

  var editButton = document.getElementById("edit-button");
  var saveButton = document.getElementById("save-button");
  var cancelButton = document.getElementById("cancel-button");

  editButton.addEventListener("click", function () {
    editButton.style.display = "none";
    saveButton.style.display = "inline";
    cancelButton.style.display = "inline";

    userInfoDiv.style.display = "none";
    editInfoDiv.style.display = "block";
  });

  saveButton.addEventListener("click", function () {
    var inputFields = editInfoDiv.querySelectorAll("input");
    for (var i = 0; i < inputFields.length; i++) {
      var key = Object.keys(userInfo)[i];
      var inputValue = inputFields[i].value;
      userInfo[key] = inputValue;
    }

    editButton.style.display = "inline";
    saveButton.style.display = "none";
    cancelButton.style.display = "none";

    userInfoDiv.style.display = "block";
    editInfoDiv.style.display = "none";

    // 更新顯示資訊
    for (var key in userInfo) {
      var span = userInfoDiv.querySelector("span");
      span.textContent = userInfo[key];
    }
  });

  cancelButton.addEventListener("click", function () {
    editButton.style.display = "inline";
    saveButton.style.display = "none";
    cancelButton.style.display = "none";

    userInfoDiv.style.display = "block";
    editInfoDiv.style.display = "none";
  });
}
