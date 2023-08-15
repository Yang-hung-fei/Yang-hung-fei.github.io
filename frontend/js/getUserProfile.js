import config from "../../ipconfig";
$(window).on("load", () => {
  $("#login").on("click", function () {
    fetch(config.url + "/user/profile", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
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
  })
})

var responseActions = {
  200: function (data) {
    //TODO: 取得會員資料，並顯示
    var userInfo = data.message;
    console.log(userInfo);
    createProfileEditor();
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

function createProfileEditor() {
  var userInfoDiv = document.getElementById("user-info");
  var editInfoDiv = document.getElementById("edit-info");

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
