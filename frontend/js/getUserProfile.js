import config from "/ipconfig.js";

$(window).on("load", () => {
  getUserProfile();
});

export function getUserProfile() {
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
}

var responseActions = {
  200: function (data) {
    var userInfo = data.message;
    console.log(userInfo);
    if (userInfo.identityProvider === "Local") {
      $("#userPasswordDiv").css("display", "flex");
    } else {
      $("#userPasswordDiv").css("display", "none");
    }
    showDBuserProfile(userInfo);
  },
  401: function () {
    console.log("code 401: Unauthorized.");
    errorAuth();
    setTimeout(revomeTokenThenLogin(), 1000);
  },
  default: function (data) {
    console.log("Unknown response code:", data.code);
  },
};

function errorAuth() {
  swal({
    title: "哎呀🤭",
    text: "您尚未登入，請重新登入",
    icon: "error",
  }).then(() => {
    localStorage.removeItem("Authorization_U");
    window.location.href = "/backend/login.html"; // 替换为你要跳转的页面地址
  });
}

function revomeTokenThenLogin() {
  localStorage.removeItem("Authorization_U");
  window.location.href = "/frontend/pages/user/login.html";
}

export function profile_els() {
  const elements = {
    userName: document.getElementById("userName"),
    userNickName: document.getElementById("userNickName"),
    userPic: document.getElementById("userPic"),
    pointnumber: document.getElementById("pointnumber"),
    userGender: document.getElementById("userGender"),
    userBirthday: document.getElementById("userBirthday"),
    userPhone: document.getElementById("userPhone"),
    city: document.getElementById("city"),
    area: document.getElementById("area"),
    userAddress: document.getElementById("userAddress"),
    // ... 可以添加其他需要的元素
  };

  return elements;
}

// 在showDBuserProfile函数中使用profile_els函数来获取元素
function showDBuserProfile(data) {
  var elements = profile_els(); // 获取所有元素

  // 设置元素内容
  elements.userName.textContent = data.userName;
  elements.userNickName.textContent = data.userNickName;
  let userPic_base64 = data.userPic;
  elements.userPic.src = "data:image/png;base64," + userPic_base64;
  elements.pointnumber.textContent = data.userPoint;
  elements.userBirthday.textContent = data.userBirthday;

  // 其他操作，如设置下拉框选项等
  elements.userPhone.value = data.userPhone;
  let genderText = data.userGender;
  if (!genderText) {
    // 没有数据，将默认选项设置为"-"
    elements.userGender.selectedIndex = 0; // 设置为"-"选项的索引
    elements.userGender.disabled = true; // 禁用下拉框
  } else {
    // 有数据，根据数据设置选中的选项
    for (var i = 0; i < elements.userGender.options.length; i++) {
      if (elements.userGender.options[i].textContent === genderText) {
        elements.userGender.selectedIndex = i;
        break; // 找到匹配选项后退出循环
      }
    }
  }

  if (data.userBirthday !== null) {
    var userBirthdayText = new Date(data.userBirthday);
    var options = { year: "numeric", month: "2-digit", day: "2-digit" };
    var dateString = userBirthdayText.toLocaleString("zh-TW", options);
    var parts = dateString.split("/");
    var formattedDate = parts[0] + "-" + parts[1] + "-" + parts[2];
    elements.userBirthday.value = formattedDate;
  }

  // 地址
  const userAddressData = data.userAddress;
  addressShow(userAddressData, elements);

  // TODO: 名稱欄位，顯示和編輯交換顯示
  // TODO: enter儲存，還有切換儲存按鈕svg
}

function addressShow(userAddress) {
  var userAddressInput = ""; // 默认值为空字符串
  if (userAddress) {
    var matchResult = userAddress.match(/^(.{1,3})(.{3,3})/);
    if (matchResult) {
      var cityMatch = matchResult[1]; // 匹配的前1到3个字符
      var areaMatch = matchResult[2]; // 匹配的第4到6个字符
      userAddressInput = userAddress.substring(6);
    }
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
        if (option.textContent === cityMatch) {
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

  // 在第一层选择发生改变时调用第二层选择的处理逻辑
  city_el.addEventListener("change", function () {
    console.log("City Changed"); // 检查城市选择是否触发事件
    areaSelectHandler();
  });

  // 第二層選擇
  function areaSelectHandler() {
    const cityvalue = city_el.value;
    area_el.innerHTML = "";
    area_el.style.display = "inline";

    // 异步加载区域选项
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
          if (option.textContent === areaMatch) {
            option.selected = true;
            break; // 停止遍历，因为已经找到目标选项
          }
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }
}
