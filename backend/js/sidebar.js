import config from "../../ipconfig.js";
import { showSidebarListMenu } from "/backend/js/sidebarMenu.js";
import { showHomepageBoard } from "../pages/manageManager/js/showHomepageBoard.js";

document.addEventListener("DOMContentLoaded", async function () {
  try {
    const token = localStorage.getItem("Authorization_M");

    if (token) {
      await fetchManagerData(token)
        .then(response => response.json()) // 解析响应数据为 JSON 格式
        .then(data => {
          if (data.code === 200) {
            console.log(data);
          }
        })
        .catch(error => {
          // 处理捕获的错误，包括网络错误等
          console.error("Fetch error:", error);
        });
    } else {
      window.location.href = "/backend/login.html";
    }
  } catch (error) {
    console.error("Error:", error);
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
