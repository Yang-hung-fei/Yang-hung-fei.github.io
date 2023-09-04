import config from "/ipconfig.js";

// 等待页面加载完毕后执行以下代码
$(window).on("load", () => {
  searchUsers({ orderBy: "USER_NAME", page: 1, size: 5, sort: "asc" });
});

$(document).ready(function () {
  listenPageLink();
  listenOrderBy();
  listenSearchInput();
});

// -------------------DataListener-------------------

function listenPageLink() {
  $(".page-link").on("click", () => {
    // Add click event listeners to the page links
    for (let i = 0; i < this.length; i++) {
      this[i].addEventListener("click", () => {
        currentPage = i + 1; // Adjust for 1-based index
        return currentPage;
      });
    }
  });
}

function listenSearchInput() {
  var inputElement = $("#search");
  // 监听输入框的键盘按键事件
  inputElement.keypress(function (event) {
    // 判断按下的键是否是Enter键，其键码为13
    if (event.which === 13) {
      // 在这里执行你的操作，例如触发表单提交或执行搜索等
      // 这里只是一个示例，你可以根据实际需求来处理
    }
  });
}

function listenOrderBy() {
  $(".orderBy").on("click", () => {
    toggleSortOrder();
  });
}

let sortOrder = {}; // 用对象来保存不同排序条件的排序顺序
function toggleSortOrder(orderId) {
  if (!sortOrder[orderId]) {
    sortOrder[orderId] = "asc"; // 如果排序顺序不存在，设置为升序
  } else {
    sortOrder[orderId] = sortOrder[orderId] === "asc" ? "desc" : "asc"; // 切换排序顺序
  }

  // 根据排序顺序修改 SVG 图标（你需要根据实际图标路径数据来设置）
  const orderElement = document.getElementById(orderId);
  orderElement.innerHTML =
    sortOrder[orderId] === "asc"
      ? '<svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 320 512"><!-- 升序图标路径数据 --></svg>'
      : '<svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 320 512"><!-- 降序图标路径数据 --></svg>';

  // 在这里添加排序逻辑，根据当前排序条件和排序顺序对表格数据进行排序
  // 例如，可以使用数组的 sort 方法来排序表格数据

  // 排序完成后，更新表格内容
}

// -------------------Fetch-------------------

function searchURL() {
  // 构建请求 URL，包括请求参数
  const search_inputed = document.getElementById("search").value;
  const page_selected = listenPageLink(); // 當前頁碼
  const itemsPerPage = 5; // 每頁顯示的項目數
  const orderBy_selected = listenOrderBy();
  const sort_selected = "asc";

  const url = new URL(config.url + "/manager/users");
  url.searchParams.append("search", search_inputed);
  url.searchParams.append("page", page_selected);
  url.searchParams.append("size", itemsPerPage);
  url.searchParams.append("orderBy", orderBy_selected);
  url.searchParams.append("sort", sort_selected);

  return url;
}

function searchUsers() {
  let token = localStorage.getItem("Authorization_M");
  // deleteTableContent();

  // 发送 HTTP GET 请求
  try {
    const response = fetch(searchURL().toString(), {
      method: "GET",
      headers: {
        Authorization_M: token,
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((responseData) => {
        // 处理服务器响应数据
        var code = responseData.code;
        console.log(responseData);
        if (code === 200) {
          // 成功处理响应
          creatPageButton(responseData.message.size);
          creatResultTable();
        } else {
          // 处理响应错误
        }
      })
      .catch((error) => {
        // 捕获 HTTP 请求或处理响应的错误
        console.error("Error:", error);
        // 输出服务器返回的文本
        if (error instanceof Response) {
          error.text().then((text) => {
            console.error("Server response:", text);
          });
        }
      });
  } catch (error) {
    // 捕获代码块内部的错误
    console.error("Error:", error);
  }
}

// -------------------HTML-------------------

function creatPageButton(responsePageSize) {
  const paginationEl = document.getElementsByClassName("pagination");
  let html = "";

  // Create the "Previous" button
  html += `
    <li class="page-item">
      <a class="page-link" href="#" aria-label="Previous">
        <span aria-hidden="true">&laquo;</span>
      </a>
    </li>
  `;

  for (let i = 1; i <= responsePageSize; i++) {
    html += `
      <li class="page-item">
        <a class="page-link" href="#">${i}</a>
      </li>
    `;
  }

  // Create the "Next" button
  html += `
    <li class="page-item">
      <a class="page-link" href="#" aria-label="Next">
        <span aria-hidden="true">&raquo;</span>
      </a>
    </li>
  `;

  paginationEl.innerHTML = html;
}

function creatResultTable() {
  // 获取分页和内容元素
  const resultTable_el = document.getElementById("resultTable");
}

function deleteTableContent() {
  const tableContainer = document.getElementById("resultTable");
  if (tableContainer) {
    // 逐个删除子元素，直到容器为空
    while (tableContainer.firstChild) {
      tableContainer.removeChild(tableContainer.firstChild);
    }
  }
}
