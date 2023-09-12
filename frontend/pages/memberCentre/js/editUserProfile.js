import { profile_els } from "/frontend/js/getUserProfile.js";
import config from "/ipconfig.js";

//----------------修改名稱----------------
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

//----------------JSON----------------

// 将所有元素存储在一个对象中
const elements = profile_els();
elements.userName = document.getElementById("inputNameEdit");
elements.userNickName = document.getElementById("inputNickNameEdit");
let userData = {};

// 监听所有元素的变化
Object.keys(elements).forEach((key) => {
  const element = elements[key];

  // 添加事件监听器，当元素的值变化时触发
  element.addEventListener("input", () => {
    // 创建一个空的 JSON 对象，用于存储元素值
    const json = {};

    // 遍历所有元素，将它们的值添加到 JSON 对象中
    Object.keys(elements).forEach((elementKey) => {
      if (elements[elementKey].tagName === "SELECT") {
        // 如果是下拉式选择菜单，获取选中选项的文字内容
        json[elementKey] =
          elements[elementKey].options[elements[elementKey].selectedIndex].text;
      } else {
        // 否则获取元素的值
        json[elementKey] = elements[elementKey].value;
      }
    });

    json.userAddress = `${json.city}${json.area}${json.userAddress}`;
    // 删除 city、area 和 userAddress 属性
    delete json.city;
    delete json.area;

    // 删除 pointnumber 属性
    delete json.pointnumber;

    // 转换 date 到 timestamp
    const date = new Date(json.userBirthday);
    const userBirthday = date.getTime();
    json.userBirthday = userBirthday;

    // 将 json 对象合并到 userData 对象中
    Object.assign(userData, json);

    const jsonData = JSON.stringify(userData);
    console.log(userData);
  });
});

//----------------照片----------------

$(document).ready(function () {
  $("#userPicEdit").on("click", () => {
    console.log(111);
  });
});

// 在事件处理程序之前定义 reader
const reader = new FileReader();

// 当用户选择文件时触发事件
fileInput.addEventListener("change", (event) => {
  const selectedFile = event.target.files[0];
  if (selectedFile) {
    reader.onload = (e) => {
      const base64Image = e.target.result; // 获取 Base64 编码的图像数据

      // 更新用户图像元素的 src 属性
      const userPicImage = document.getElementById("userPic");
      userPicImage.src = base64Image;

      // 更新 userData 对象中的 userPic 属性
      userData.userPic = base64Image;

      // 将 userData 转换为 JSON 字符串
      const userDataJSON = JSON.stringify(userData);

      // 可以在此处将 userDataJSON 发送到服务器或进行其他操作
      console.log(userDataJSON);
    };
    reader.readAsDataURL(selectedFile);
  }
});

//----------------fetch----------------
// 創建一個新的FormData對象
const formData = new FormData();

// 將JSON數據添加為form-data的字段
for (const key in userData) {
  if (userData.hasOwnProperty(key)) {
    formData.append(key, userData[key]);
  }
}

const saveButtons = document.querySelectorAll(".save");
saveButtons.forEach((button) => {
  button.addEventListener("click", () => {
    sentEditedData(formData); // 调用发送 API 请求的函数
  });
});

function sentEditedData(formData) {
  console.log("userData before sending:", formData);
  const token = localStorage.getItem("Authorization_U");

  fetch(config.url + "/user/profile", {
    method: "POST",
    headers: {
      Authorization_U: token,
      "Content-Type": "application/json",
    },
    body: formData,
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      if (data.code === 200) {
        console.log("code", code, ":", data.message);
        swal("修改成功", "", "success");
      } else {
        console.log("code", code, ":", data.message);
        swal("修改失敗", "請確認資料格式");
      }
    })
    .catch((error) => {
      console.error("Fetch error:", error);
    });
}
