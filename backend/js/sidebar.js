import config from "/ipconfig.js";
import { createSidebarListMenu } from "/backend/js/sidebarMenu.js";
import { showHomepageBoard } from "../pages/manageManager/js/showHomepageBoard.js";
import { getManagerAuthority } from "../pages/manageManager/js/getManagerAuthority.js";

document.addEventListener("DOMContentLoaded", async function () {
  let token = localStorage.getItem("Authorization_M");
  let manager = await getManagerAuthority(token);

  //backend index.html show managerAccount name
  const managerAccount = manager.message.managerAccount;
  $("#accountShow").html(managerAccount);

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

  showSidebarListMenu(manager);
  showHomepageBoard(token);
});

async function fetchManagerData(token) {
  return fetch(config.url + "/manager/profile", {
    headers: {
      Authorization_M: token,
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });
}

async function showSidebarListMenu(manager) {
  try {
    if (manager) {
      let managerAuthories = manager.message.managerAuthoritiesList;
      let sidebarLinks = [];
      console.log(managerAuthories);

      // 加载roles.json文件
      let rolesResponse = await fetch("/backend/json/roles.json");
      let roles = await rolesResponse.json();

      // 循环处理每个角色
      roles.forEach((role) => {
        // 检查当前角色是否在用户的权限列表中
        console.log("test");
        if (managerAuthories.includes(role.role)) {
          // 加载对应角色的菜单文件
          fetch("/backend/json/" + role.file)
            .then((response) => response.json())
            .then((roleMenus) => {
              // 根据菜单数据生成链接
              createSidebarListMenu(roleMenus);              
            })
            .catch((error) => {
              console.error("Error fetching role menu:", error);
            });
        }
      });
    }
  } catch (error) {
    console.error("Error:", error);
  }
}
