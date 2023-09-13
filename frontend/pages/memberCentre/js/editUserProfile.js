import config from "/ipconfig.js";

//----------------按鈕顯示/隱藏效果----------------
document.addEventListener("DOMContentLoaded", function () {
  document
    .getElementById("editNameButton")
    .addEventListener("click", function () {
      document.getElementById("showNameContain").style.display = "none";
      document.getElementById("editNameContain").style.display = "block";
    });

  document
    .getElementById("saveNameButton")
    .addEventListener("click", function () {
      // 在這裡添加儲存名稱的程式碼
      document.getElementById("editNameContain").style.display = "none";
      document.getElementById("showNameContain").style.display = "block";

      // 在這裡添加fetch名稱的程式碼
    });

  document
    .getElementById("editNickNameButton")
    .addEventListener("click", function () {
      document.getElementById("showNickNameContain").style.display = "none";
      document.querySelector(".editNickNameContanin").style.display = "block";
    });

  document
    .getElementById("saveNickNameButton")
    .addEventListener("click", function () {
      // 在這裡添加儲存暱稱的程式碼
      document.querySelector(".editNickNameContanin").style.display = "none";
      document.getElementById("showNickNameContain").style.display = "block";

      // 在這裡添加fetch暱稱的程式碼
    });
});

//----------------送出FormData----------------

$(document).ready(function () {
  //監聽輸入欄位
  const token = localStorage.getItem("Authorization_U");

  // 要送出的資料
  function saveData() {
    const userName = document.getElementById("inputNameEdit");
    const userNickName = document.getElementById("inputNickNameEdit");
    const city = document.getElementById("city");
    const area = document.getElementById("area");
    const userAddress = document.getElementById("userAddress");
    const userPhone = document.getElementById("userPhone");
    const userBirthday = document.getElementById("userBirthday");
    const userGender = document.getElementById("userGender");
    const userPic = document.getElementById("fileInput");

    // 获取表单数据并执行 fetch
    const cityValue = city.options[city.selectedIndex].text.trim() || null;
    const areaValue = area.options[area.selectedIndex].text.trim() || null;
    const userGenderValue =
      userGender.options[userGender.selectedIndex].text.trim() === "男性"
        ? 1
        : userGender.options[userGender.selectedIndex].text.trim() === "女性"
        ? 0
        : userGender.options[userGender.selectedIndex].text.trim() ===
          "尚未設定"
        ? 2
        : null;

    const userNameValue = userName.value.trim() || null;
    const userNickNameValue = userNickName.value.trim() || null;
    const addressDetailValue = userAddress.value.trim() || null;
    const userPhoneValue = userPhone.value.trim() || null;
    const userBirthdayValue = userBirthday.value.trim() || null;
    const userPicFile = userPic.files[0] || null;
    // 檢查圖片大小
    const maxSizeInBytes = 3145728; // 3MB
    if (userPicFile && userPicFile.size > maxSizeInBytes) {
      // 文件超过限制大小，显示错误消息并清除文件输入框
      alert("文件大小超過限制（最大3MB）。請選擇較小的文件。");
      userPic.value = ""; // 清除文件输入框的值
    }

    const userAddressValue = `${cityValue}${areaValue}${addressDetailValue}`;

    // 检查必填字段是否为空
    if (!userNameValue || !userNickNameValue) {
      swal("請填寫名稱。");
      return; // 阻止继续执行
    }

    if (!userPhoneValue) {
      const phoneNotice = $("#phoneNotice");
      phoneNotice.text("請輸入電話號碼。");
      phoneNotice.css("visibility", "visible");
      if (!userAddress.value) {
        $("#addressNotice").css("visibility", "visible");
        return;
      } else {
        $("#addressNotice").css("visibility", "hidden");
      }
      return;
    } else {
      const phoneRegex = /^\d{10}$/;
      if (!phoneRegex.test(userPhoneValue)) {
        const phoneNotice = $("#phoneNotice");
        phoneNotice.text("電話號碼必須是 10 位數字。");
        phoneNotice.css("visibility", "visible");
        if (!userAddress.value) {
          $("#addressNotice").css("visibility", "visible");
          return;
        } else {
          $("#addressNotice").css("visibility", "hidden");
        }
        return;
      } else {
        $("#phoneNotice").css("visibility", "hidden");
      }
    }

    if (!userAddress.value) {
      $("#addressNotice").css("visibility", "visible");
      return;
    } else {
      $("#addressNotice").css("visibility", "hidden");
    }

    if (!userPhoneValue && !userAddress.value) {
      $("#phoneNotice").css("visibility", "visible");
      $("#addressNotice").css("visibility", "visible");
      return;
    }

    //送出資料，以數據為參數
    sendData(
      userNameValue,
      userNickNameValue,
      userAddressValue,
      userPhoneValue,
      userBirthdayValue,
      userGenderValue,
      userPicFile
    );
  }

  function sendData(
    userNameValue,
    userNickNameValue,
    userAddressValue,
    userPhoneValue,
    userBirthdayValue,
    userGenderValue,
    userPicFile
  ) {
    //建立formdata文件，並將參數加入文件
    const formData = new FormData();
    formData.append("userName", userNameValue);
    formData.append("userNickName", userNickNameValue);
    formData.append("userAddress", userAddressValue);
    formData.append("userGender", userGenderValue);
    if (userPhoneValue !== null) formData.append("userPhone", userPhoneValue);
    if (userBirthdayValue !== null)
      formData.append("userBirthday", userBirthdayValue);
    if (userPicFile !== null) {
    }
    formData.append("userPic", userPicFile);

    console.log(formData.get("userName"));
    console.log(formData.get("userNickName"));
    console.log(formData.get("userAddress"));
    console.log(formData.get("userPhone"));
    console.log(formData.get("userBirthday"));
    console.log(formData.get("userGender"));
    console.log(formData.get("userPic"));

    fetch(config.url + "/user/profile", {
      method: "POST",
      headers: {
        Authorization_U: token,
      },
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.code === 200) {
          console.log(data);
          swal("修改成功", "", "success");
        } else if (data.code === 401) {
          errorAuth();
        } else {
          console.log(data);
          swal("修改失败");
        }
      });
  }

  //監聽按鈕
  $("#saveNameButton").on("click", function () {
    saveData();
  });
  $("#saveNickNameButton").on("click", function () {
    saveData();
  });
  $("#edit-button").on("click", function () {
    saveData();
  });
  // 上傳圖片就送出
  fileInput.addEventListener("change", function () {
    saveData();
  });

  function errorAuth() {
    swal({
      title: "哎呀🤭",
      text: "您尚未登入，請重新登入",
      icon: "error",
    }).then((value) => {
      localStorage.removeItem("Authorization_U");
      window.location.href = "/frontend/pages/user/login.html"; // 替换为你要跳转的页面地址
    });
  }
});
