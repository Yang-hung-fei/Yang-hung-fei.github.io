import config from "../../ipconfig.js";
$(window).on("load", () => {
  const token = localStorage.getItem("Authorization_U");

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
    createProfile(userInfo);
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
  window.location.href = "/frontend/pages/user/login.html";
}

function createProfile(data) {
  var userInfoDiv = document.getElementById("user-info");
  var editInfoDiv = document.getElementById("edit-info");
  var userInfo = data;

  //TODO: 檢查使用者資料的輸入格式
  //TODO: 儲存按鈕，儲存user-info的資料到edit-info，並傳到api
  //TODO: 燈箱：顯示修改成功

  //名字
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
  let genderText = data.userGender;
  if (!genderText) {
    // 没有数据，将默认选项设置为"-"
    userGender_el.selectedIndex = 0; // 设置为"-"选项的索引
    userGender_el.disabled = true; // 禁用下拉框
  } else {
    // 有数据，根据数据设置选中的选项
    for (var i = 0; i < userGender_el.options.length; i++) {
      if (userGender_el.options[i].textContent === genderText) {
        userGender_el.selectedIndex = i;
        break; // 找到匹配选项后退出循环
      }
    }
  }
  let userBirthday_el = document.getElementById("userBirthday");
  var userBirthdayText = new Date(data.userBirthday);
  var options = { year: "numeric", month: "2-digit", day: "2-digit" };
  var dateString = userBirthdayText.toLocaleString("zh-TW", options);
  var parts = dateString.split("/");
  var formattedDate = parts[0] + "-" + parts[1] + "-" + parts[2];
  userBirthday_el.value = formattedDate;
  let userPhone_el = document.getElementById("userPhone");
  userPhone_el.value = data.userPhone;

  //地址
  const userAddressData = data.userAddress;
  addressShow(userAddressData);

  //TODO: 名稱欄位，顯示和編輯交換顯示
  //TODO: enter儲存，還有切換儲存按鈕svg
}

function addressShow(userAddress) {
  var userAddressInput = ""; // 默认值为空字符串
  if (userAddress) {
    var cityMatch = userAddress.match(/^.{1,3}/);
    var areaMatch = userAddress.match(/^.{4,6}/);
    var userAddressInput = userAddress.substring(6);
  }

  const city_el = document.getElementById("city");
  const area_el = document.getElementById("area");
  const inputAddress_el = document.getElementById("userAddress");
  inputAddress_el.value = userAddressInput;

  // 第一层選單
  fetch(
    "https://raw.githubusercontent.com/donma/TaiwanAddressCityAreaRoadChineseEnglishJSON/master/CityCountyData.json"
  )
    .then((response) => response.json())
    .then((data) => {
      for (const key in data) {
        if (data.hasOwnProperty(key)) {
          const option = document.createElement("option");
          option.value = key;
          option.textContent = data[key].CityName;
          city_el.appendChild(option);
        }
      }

      // 遍历所有选项，设置目标选项为默认选中
      for (const option of city_el.options) {
        if (option.textContent === cityMatch[0]) {
          option.selected = true;
          break; // 停止遍历，因为已经找到目标选项
        }
      }

      // 在第一层选择后，手动触发第二层选择的处理逻辑
      areaSelectHandler();
    })
    .catch((error) => {
      console.error("Error:", error);
    });

  // 第二層選擇
  function areaSelectHandler() {
    const cityvalue = city_el.value;
    area_el.innerHTML = "";
    area_el.style.display = "inline";

    fetch(
      "https://raw.githubusercontent.com/donma/TaiwanAddressCityAreaRoadChineseEnglishJSON/master/CityCountyData.json"
    )
      .then((response) => response.json())
      .then((data) => {
        const eachval = data[cityvalue].AreaList; // 鄉鎮
        for (const key in eachval) {
          if (eachval.hasOwnProperty(key)) {
            const option = document.createElement("option");
            option.value = key;
            option.textContent = eachval[key].AreaName;
            area_el.appendChild(option);
          }
        }
        // 遍历所有选项，设置目标选项为默认选中
        for (const option of area_el.options) {
          if (option.textContent === areaMatch[0]) {
            option.selected = true;
            break; // 停止遍历，因为已经找到目标选项
          }
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  // 在第一层选择发生改变时调用第二层选择的处理逻辑
  city_el.addEventListener("change", areaSelectHandler);
}

function edit() {
  var editButton = document.getElementById("edit-button");

  editButton.addEventListener("click", function () {
    editButton.style.display = "none";
    saveButton.style.display = "block";
  });

  editButton.addEventListener("click", function () {
    var inputFields = editInfoDiv.querySelectorAll("input");
    for (var i = 0; i < inputFields.length; i++) {
      var key = Object.keys(userInfo)[i];
      var inputValue = inputFields[i].value;
      userInfo[key] = inputValue;
    }

    editButton.style.display = "inline";
    saveButton.style.display = "none";
    cancelButton.style.display = "none";

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
