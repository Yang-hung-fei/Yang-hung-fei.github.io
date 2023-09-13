import config from "/ipconfig.js";
import base64Data from "/frontend/pages/memberCentre/js/userPicture";
import { profile_els } from "/frontend/js/getUserProfile.js";

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

// //監聽輸入欄位
// const token = localStorage.getItem("Authorization_U");
// const userName = document.getElementById("inputNameEdit");
// const userNickName = document.getElementById("inputNickNameEdit");
// //TODO: 處理地址
// const city = document.getElementById("city");
// const area = document.getElementById("area");
// const addressDetail = document.getElementById("userAddress");
// const userAddress = city + area + addressDetail;
// const userPhone = document.getElementById("userPhone");
// const userBirthday = document.getElementById("userBirthday");
// const userGender = document.getElementById("userGender");
// const userPic = base64Data;

const formData = new FormData();
const elements = profile_els();
elements.userName = document.getElementById("inputNameEdit");
elements.userNickName = document.getElementById("inputNickNameEdit");
elements.userPic = document.getElementById("fileInput");
Object.keys(elements).forEach((key) => {
  const element = elements[key];

  // 添加事件监听器，当元素的值变化时触发
  element.addEventListener("input", () => {
    if (element.tagName === "SELECT") {
      // 如果是下拉式选择菜单，获取选中选项的值并添加到formData
      const selectedOption = element.options[element.selectedIndex];
      formData.append(key, selectedOption.value);
    } else {
      // 否则获取元素的值并添加到formData
      formData.append(key, element.value);
    }

    // 处理 userAddress
    formData.set(
      "userAddress",
      `${elements.city.value}${elements.area.value}${elements.userAddress.value}`
    );

    // 删除不需要的属性（如果有的话）
    const keysToDelete = ["city", "area", "pointnumber"];
    keysToDelete.forEach((keyToDelete) => {
      formData.delete(keyToDelete);
    });

    console.log(formData);
  });
});

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
      Swal.fire({
        icon: "success",
        title: "修改成功",
        text: data.message,
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "修改失敗",
        text: data.message,
      });
    }
  });
