import config from "../../ipconfig.js";
import { creatSidebarListMenu } from "/backend/js/sidebarMenu.js";
import { showHomepageBoard } from "../pages/manageManager/js/showHomepageBoard.js";

document.addEventListener("DOMContentLoaded", async function () {
  try {
    const token = localStorage.getItem("Authorization_M");

    if (token) {
      await fetchManagerData(token)
        .then((response) => response.json()) // 解析响应数据为 JSON 格式
        .then((data) => {
          if (data.code === 200) {
            console.log(data);
          }
        })
        .catch((error) => {
          // 处理捕获的错误，包括网络错误等
          console.error("Fetch error:", error);
        });
    } else {
      window.location.href = "/backend/login.html";
    }
  } catch (error) {
    console.error("Error:", error);
    window.location.href = "/backend/login.html";
  }

  showSidebarListMenu();
  showHomepageBoard();
});

async function fetchManagerData(token) {
  return fetch(config.url + "/manager/profile", {
    headers: {
      Authorization_M: token,
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });
  // showSidebarListMenu();
}

function showSidebarListMenu() {
    // 先從 roles.json 中獲取會員擁有的角色
    fetch("/backend/json/roles.json")
      .then((response) => response.json())
      .then((roles) => {
        // 循環處理每個角色
        roles.forEach((role) => {
          const roleMenuFilePath = role.file;
  
          // 使用該文件路徑 fetch 對應的菜單資料
          fetch("/backend/json/" + roleMenuFilePath)
            .then((response) => response.json())
            .then((roleMenus) => {
              // 根據菜單資料創建連結或其他操作
              creatSidebarListMenu(roleMenus);
            })
            .catch((error) =>
              console.error("Error fetching role menu:", error)
            );
        });
      })
      .catch((error) => console.error("Error fetching roles:", error));
  }
