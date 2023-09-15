import config from "/ipconfig.js";
import { createSidebarListMenu } from "/backend/js/sidebarMenu.js";
import { getManagerSelfAuthority } from "/backend/pages/manageManager/manageManager/js/getManagerSelfAuthority.js";

document.addEventListener("DOMContentLoaded", async function () {
  // main header 顯示管理員帳號
  let token = localStorage.getItem("Authorization_M");
  let manager = await getManagerSelfAuthority(token);
  const managerAccount = manager.message.managerAccount;
  $("#accountShow").html(managerAccount);

  // 未登入管理員帳號，則跳轉到登入頁
  try {
    if (token) {
      await fetchManagerData(token)
        .then((response) => response.json())
        .then((data) => {
          if (data.code === 200) {
            console.log(data);
          }
        })
        .catch((error) => {
          console.error("Fetch error:", error);
        });
    } else {
      window.location.href = "/backend/login.html";
    }
  } catch (error) {
    console.error("Error:", error);
    window.location.href = "/backend/login.html";
  }
  // 已登入的管理員，依照權限顯示可用 sidebar links
  showSidebarManageBackendLinkes(manager);
  showSidebarListMenu(manager);
});

// 取得管理員自身資訊
async function fetchManagerData(token) {
  return fetch(config.url + "/manager/profile", {
    headers: {
      Authorization_M: token,
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });
}

// 根據管理員的「後台管理權限」，顯示可用連結在 sidebar
async function showSidebarManageBackendLinkes(manager) {
  // 权限数组
  let Authorities = manager.message.managerAuthoritiesList;
  console.log("Authorities: " + Authorities);

  // 根據權限，將要產生的連結名稱存入權限連結陣列
  var permissions = [];
  Authorities.forEach((permission) => {
    if (permission === "首頁管理") {
      permissions.push("輪播圖管理");
      permissions.push("最新消息管理");
    } else if (permission === "管理員管理") {
      permissions.push("管理員管理");
    } else if (permission === "會員管理") {
      permissions.push("會員帳號查詢");
    }
  });
  // 反轉權限陣列
  permissions.reverse();
  console.log("functions: " + permissions);

  // 設定用以生成及遍歷的權限連結
  var permissionslinkes = [
    {
      name: "輪播圖管理",
      icon: "sliders",
      link: "/backend/pages/homepage/homepagePicRoteList.html",
    },
    {
      name: "最新消息管理",
      icon: "sliders",
      link: "/backend/pages/homepage/homepageNewsList.html",
    },
    {
      name: "管理員管理",
      icon: "user",
      link: "/backend/pages/manageManager/manageManager/manageManager.html",
    },
    {
      name: "會員帳號查詢",
      icon: "log-in",
      link: "/backend/pages/manageManager/manageUser/manageUser.html",
    },
  ];

  // 抓取父標籤，遍歷陣列後放入生成的連結
  const sidebarLinksContainer = document.querySelector(".function ul");
  sidebarLinksContainer.innerHTML = "";

  permissions.forEach((permission) => {
    const permissionData = permissionslinkes.find(
      (link) => link.name === permission
    );
    if (permissionData) {
      const linkHTML = `
        <li class="sidebar-item">
          <a class="sidebar-link function-link" href="${permissionData.link}">
            <i class="align-middle" data-feather="${permissionData.icon}"></i>
            <span class="align-middle">${permission}</span>
          </a>
        </li>
      `;
      sidebarLinksContainer.innerHTML += linkHTML;
    }
  });

  // 現在您需要觸發Feather圖標庫以渲染圖標
  feather.replace();
}

async function showSidebarListMenu(manager) {
  // 根據管理員的其它權限，加載 json，顯示在 sidebar
  try {
    if (manager) {
      let managerAuthories = manager.message.managerAuthoritiesList;
      console.log(managerAuthories);

      // 加载roles.json文件
      let rolesResponse = await fetch("/backend/json/roles.json");
      let roles = await rolesResponse.json();

      // 循环处理每个角色
      for (const role of roles) {
        // 检查当前角色是否在用户的权限列表中
        if (managerAuthories.includes(role.role)) {
          try {
            // 加载对应角色的菜单文件
            const response = await fetch("/backend/json/" + role.file);
            const roleMenus = await response.json();
            // console.log(roleMenus);
            // 根据菜单数据生成链接
            createSidebarListMenu(roleMenus);
          } catch (error) {
            console.error("Error fetching role menu:", error);
          }
        }
      }
    }
  } catch (error) {
    console.error("Error:", error);
  }

  $("#sidebarLinks").append(
    '<div id="sidebar-margin" style="height: 50px;"></div>'
  );
}
