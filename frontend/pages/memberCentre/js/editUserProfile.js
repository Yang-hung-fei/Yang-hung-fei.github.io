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

$(document).ready(function () {
  //監聽輸入欄位
  const token = localStorage.getItem("Authorization_U");

  function sendData() {
    const formData = new FormData();
    const userName = document.getElementById("inputNameEdit");
    const userNickName = document.getElementById("inputNickNameEdit");
    //TODO: 處理地址
    const city = document.getElementById("city");
    const area = document.getElementById("area");
    const addressDetail = document.getElementById("userAddress");
    const userAddress = document.getElementById("userAddress");
    const userPhone = document.getElementById("userPhone");
    const userBirthday = document.getElementById("userBirthday");
    const userGender = document.getElementById("userGender");
    const userPic = document.getElementById("fileInput");

    // 获取表单数据并执行 fetch
    const cityValue = city.options[city.selectedIndex].text.trim() || null;
    const areaValue = area.options[area.selectedIndex].text.trim() || null;
    const userGenderValue =
      userGender.options[userGender.selectedIndex].text.trim() || null;

    const userNameValue = userName.value.trim() || null;
    const userNickNameValue = userNickName.value.trim() || null;
    const addressDetailValue = userAddress.value.trim() || null;
    const userPhoneValue = userPhone.value.trim() || null;
    const userBirthdayValue = userBirthday.value.trim() || null;
    //TODO: 如果沒有上傳圖片，就抓取原本的圖片。
    const userPicFile = userPic.files[0];
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

    if (userPicFile instanceof Blob) {
      const reader = new FileReader();
      reader.readAsDataURL(userPicFile);
      reader.onload = function (event) {
        const formData = new FormData();
        formData.append("userName", userNameValue);
        formData.append("userNickName", userNickNameValue);
        formData.append("userAddress", userAddressValue);
        formData.append("userPhone", userPhoneValue);
        formData.append("userBirthday", userBirthdayValue);
        formData.append("userGender", userGenderValue);
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
              Swal.fire({
                icon: "success",
                title: "修改成功",
                text: data.message,
              });
            } else {
              console.log(data);
              Swal.fire({
                icon: "error",
                title: "修改失敗",
                text: data.message,
              });
            }
          });
      };
    } else {
      // 处理文件不是有效Blob对象的情况，这里可以根据需求执行其他操作
      swal("請選擇有效的文件。");
    }
  }

  // 获取所有包含 .save 类的按钮元素
  const saveButtons = document.querySelectorAll(".save");
  // 为每个按钮添加点击事件侦听器
  saveButtons.forEach((button) => {
    button.addEventListener("click", sendData); // 点击按钮时触发 sendData 函数
  });
});
