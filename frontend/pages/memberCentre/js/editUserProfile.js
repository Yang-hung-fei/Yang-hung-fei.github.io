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
    if (
      !userNameValue ||
      !userNickNameValue ||
      !userAddressValue ||
      !userPhoneValue
    ) {
      swal("必填字段不能為空。");
      return; // 阻止继续执行
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

    console.log(formData.get("userName"));
    console.log(formData.get("userNickName"));
    console.log(formData.get("userAddress"));
    console.log(formData.get("userPhone"));
    console.log(formData.get("userBirthday"));
    console.log(formData.get("userGender"));
    console.log(formData.get("userPic"));

    //如果有圖片參數，就加入圖片，否則抓取原圖
    if (userPicFile) {
      formData.append("userPic", userPicFile);
      saveData(formData);
    } else {
      const fileInput_el = document.getElementById("fileInput");
      const userPic_el = document.getElementById("userPic");

      //獲取使用者原圖
      fileInput_el.addEventListener("change", function () {
        const base64Data = userPic_el.src.split(",")[1]; // 从 userPic 图像标签中获取 base64 数据
        const contentType = "image/jpg"; // 指定的图像类型
        const blob = base64toBlob(base64Data, contentType); // 创建 Blob 对象
        const fileName = "custom_image.jpg"; // 创建一个自定义的文件对象，指定文件名稱
        const selectedFile = new File([blob], fileName, { type: contentType });
        formData.append("userPic", selectedFile);
        saveData(formData);
      });
    }

    function saveData(formData) {
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
          } else {
            console.log(data);
            swal("修改失败");
          }
        });
    }
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

  // 将 base64 数据转换为 Blob 对象
  function base64toBlob(base64Data, contentType) {
    const byteCharacters = atob(base64Data);
    const byteArrays = [];
    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
      const slice = byteCharacters.slice(offset, offset + 512);
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
    const blob = new Blob(byteArrays, { type: contentType });
    return blob;
  }
});
