import config from "../../ipconfig.js";
$(window).on("load", () => {
  const token = localStorage.getItem("Authorization_U");

  fetch(config.url + "/user/profile", {
    method: "GET",
    headers: {
      "Authorization_U": token,
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
  window.location.href = "http://localhost:5500/frontend/pages/user/login.html";
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
  //TODO: 相機按鈕置換圖片
  let userName_el = document.getElementById("userName");
  userName_el.textContent = data.userName;
  let userNickName_el = document.getElementById("userNickName");
  userNickName_el.textContent = data.userNickName;
  let userPic_base64 = data.userPic;
  let userPic_el = document.getElementById("userPic");
  userPic_el.src = "data:image/png;base64," + userPic_base64;
  let pointnumber_el = document.getElementById("pointnumber");
  pointnumber_el.textContent = data.userPoint;

  //其他資料
  let userGender_el = document.getElementById("userGender");
  let userBirthday_el = document.getElementById("userBirthday");
  let userPhone_el = document.getElementById("userPhone");

  //地址
  let userAddress = data.userAddress;
  let citySelect = document.getElementById("city");
  let areaSelect = document.getElementById("area");
  let addressInput = document.getElementById("userAddress");
  const match = userAddress.match(/^(.*?[縣市]|.*?[市區鎮鄉])+(.*)$/);
  if (match) {
    const cityText = match[1].trim();
    const areaText = match[2].trim();
    // 设置城市和区域下拉框的选项
    citySelect.value = cityText;
    areaSelect.value = areaText;
    // 设置用户地址输入框的值
    addressInput.value = userAddress
      .replace(cityText, "")
      .replace(areaText, "")
      .trim();
  } else {
    // 无法匹配地址格式时的处理
    console.error("无法匹配地址格式");
  }

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
