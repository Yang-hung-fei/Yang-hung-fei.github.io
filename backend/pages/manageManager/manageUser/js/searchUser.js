import config from "/ipconfig.js";

// 等待页面加载完毕后执行以下代码
$(window).on("load", () => {
  searchUsers();
});

$(document).ready(function () {
  listenPageLink();
  listenOrderBy();
  listenSearchInput();
});

// -------------------DataListener-------------------

function listenPageLink() {
  $(".page-link").on("click", () => {
    for (let i = 0; i < this.length; i++) {
      this[i].addEventListener("click", () => {
        currentPage = i + 1;
        searchURL({ page: currentPage });
      });
    }
  });
}

function listenSearchInput() {
  var inputElement = $("#search");
  inputElement.keypress(function (event) {
    if (event.which === 13) {
      searchURL({ search: inputElement.value });
    }
  });
}

function listenOrderBy() {
  $(".orderBy").on("click", (event) => {
    const newOrderBy = $(event.currentTarget).attr("dataId");
    toggleSortOrder(newOrderBy);
  });

  $(".sort").on("click", (event) => {
    event.stopPropagation();
    const newOrderBy = $(event.currentTarget)
      .closest(".orderBy")
      .attr("dataId");
    toggleSortOrder(newOrderBy);
  });
}

function toggleSortOrder(orderBy) {
  const currentOrderBy = currentSearchURL.searchParams.get("orderBy");
  const currentSort = currentSearchURL.searchParams.get("sort");
  const newSort =
    orderBy === currentOrderBy
      ? currentSort === "asc"
        ? "desc"
        : "asc"
      : "asc";
  searchURL({ orderBy, sort: newSort });
}

// -------------------Fetch-------------------

let currentSearchURL;
function searchURL({
  orderBy = "USER_NAME",
  page = 1,
  size = 5,
  sort = "asc",
} = {}) {
  // 构建请求 URL，包括请求参数
  const search_inputed = document.getElementById("search").value;
  const page_selected = page; // 使用传递的参数值或默认值
  const itemsPerPage = size; // 使用传递的参数值或默认值
  const orderBy_selected = orderBy; // 使用传递的参数值或默认值
  const sort_selected = sort; // 使用传递的参数值或默认值

  console.log("search_inputed:", search_inputed);
  console.log("page_selected:", page_selected);
  console.log("itemsPerPage:", itemsPerPage);
  console.log("orderBy_selected:", orderBy_selected);
  console.log("sort_selected:", sort_selected);

  const url = new URL(config.url + "/manager/users");
  url.searchParams.append("search", search_inputed);
  url.searchParams.append("page", page_selected);
  url.searchParams.append("size", itemsPerPage);
  url.searchParams.append("orderBy", orderBy_selected);
  url.searchParams.append("sort", sort_selected);

  currentSearchURL = url;
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
