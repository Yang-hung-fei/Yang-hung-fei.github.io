import config from "/ipconfig.js";
import { createSidebarListMenu } from "/backend/js/sidebarMenu.js";
import { showHomepageBoard } from "../pages/manageManager/js/showHomepageBoard.js";
import { getManagerAuthority } from "../pages/manageManager/js/getManagerAuthority.js";

document.addEventListener("DOMContentLoaded", async function () {
  let token = localStorage.getItem("Authorization_M");

  try {
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

  showSidebarListMenu(token);
  showHomepageBoard(token);
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

async function showSidebarListMenu(token) {
  try {
    const manager = await getManagerAuthority(token);
    
    if (manager) {
      const managerAccount = manager.message.managerAccount;
      const managerAuthories = manager.message.managerAuthoritiesList;
      console.log(managerAccount, managerAuthories, manager);
      
      // 先從 roles.json 中獲取會員擁有的角色
      fetch("/backend/json/roles.json")
        .then((response) => response.json())
        .then((roles) => {
          console.log(roles);
          // 循環處理每個角色
          roles.forEach((role) => {
            if (true) {
              // TODO: 管理員管理、會員管理、首頁管理
            } else {
              const roleMenuFilePath = role.file;

              // 使用該文件路徑 fetch 對應的菜單資料
              fetch("/backend/json/" + roleMenuFilePath)
                .then((response) => response.json())
                .then((roleMenus) => {
                  // 根據菜單資料創建連結或其他操作
                  console.log(roleMenus);
                })
                .catch((error) => {
                  console.error("Error fetching role menu:", error);
                });
            }
          });
        })
        .catch((error) => console.error("Error fetching roles:", error));
    }
  } catch (error) {
    console.error("Error:", error);
  }
}
