import config from "/ipconfig.js";

// 等待页面加载完毕后执行以下代码
$(window).on("load", () => {
  searchmanagers(searchURL());
});

$(document).ready(function () {
  listenPageLink();
  listenItemsPerPage();
  listenSearchInput();
});

// -------------------DataListener-------------------

function listenPageLink() {
  const pageLinks = $(".pagination .page-link");

  pageLinks.on("click", function () {
    const pageIndex = $(this).parent().index();
    const pageCount = pageLinks.length - 3; // 减去首个和最后两个箭头按钮
    let currentPage;

    if (pageIndex === 0) {
      currentPage = 1; // 第一个 .page-link 设置为1
    } else if (pageIndex === pageCount + 2) {
      currentPage = pageCount; // 最后一个 .page-link 设置为 pageCount
    } else {
      currentPage = pageIndex;
    }

    // 执行你的其他操作，例如更新 URL
    searchURL({ page: currentPage });
  });
}

function listenItemsPerPage() {
  $("#page").on("change", function () {
    const selectedValue = $(this).val();
    searchURL({ size: selectedValue });
  });
}

function listenSearchInput() {
  var inputElement = $("#search");
  inputElement.keypress(function (event) {
    if (event.which === 13) {
      searchURL({ search: inputElement.value });
    }
  });

  $("#button-search").on("click", () => {
    searchURL({ search: inputElement.value });
  });
}

// -------------------Fetch-------------------

let currentSearchURL;
function searchURL({ page = 1, size = 5 } = {}) {
  // 构建请求 URL，包括请求参数
  const search_inputed = document.getElementById("search").value;
  const page_selected = page; // 使用传递的参数值或默认值
  const itemsPerPage = size; // 使用传递的参数值或默认值

  console.log("search_inputed:", search_inputed);
  console.log("page_selected:", page_selected);
  console.log("itemsPerPage:", itemsPerPage);

  const url = new URL(config.url + "/manager/manageManager");
  url.searchParams.append("search", search_inputed);
  url.searchParams.append("page", page_selected);
  url.searchParams.append("size", itemsPerPage);

  currentSearchURL = url;
  searchmanagers(currentSearchURL);
}

function searchmanagers(currentSearchURL) {
  let token = localStorage.getItem("Authorization_M");
  // deleteTableContent();

  // 发送 HTTP GET 请求
  try {
    const response = fetch(currentSearchURL.toString(), {
      method: "GET",
      headers: {
        Authorization_M: token,
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((managerData) => {
        // 处理服务器响应数据
        var code = managerData.code;
        if (code === 200) {
          // 成功处理响应
          createPageButtons(managerData.message);
          createResultTable(managerData.message);
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

function createPageButtons(response) {
  const paginationElements = document.getElementsByClassName("pagination");
  const responsePageSize = response.page;
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

  // Loop through all pagination elements and set their innerHTML
  for (let i = 0; i < paginationElements.length; i++) {
    paginationElements[i].innerHTML = html;
  }
}

function createResultTable(response) {
  const resultTable_el = document.getElementById("resultTable");
  let html = ``;
  const managerData = response.body;

  // 遍历managerData数组
  managerData.forEach((manager) => {
    const managerAccount = manager.managerAccount;
    const managerCreated = manager.managerCreated;
    const managerState = manager.managerState === "開啟" ? "checked" : ``;

    // 创建表格行并添加到html中
    html += `
    <tr style="height: 10px;">
      <td class="text-left">${managerAccount}</td>
      <td class="text-left">${managerCreated}</td>
      <td class="text-center">
        <div class="form-check form-switch">
          <input
            class="form-check-input"
            type="checkbox"
            id="flexSwitchCheckDefault"
            ${managerState}
          />
        </div>
      </td>
      <td>
        <buttom class="btn btn-link btn-sm" style="width: 100%"
          >編輯</buttom
        >
      </td>
    </tr>
    `;
  });

  // 将html添加到结果表格中
  resultTable_el.innerHTML = html;
}
