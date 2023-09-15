import config from "/ipconfig.js";

$(window).on("load", () => {
  searchmanagers(updateSearchParams());
});

$(document).ready(function () {
  listenPageLink();
  listenItemsPerPage();
  listenSearchInput();
});

let token = localStorage.getItem("Authorization_M");

//-------------------燈箱的顯示、隱藏-------------------

var $lightboxOverlay = $("#lightboxOverlay");
var $editLightBox = $("#editLightBox");
var $addLightBox = $("#addLightBox");

$(document).on("click", "#lightboxOverlay", function () {
  $editLightBox.empty();
  $addLightBox.hide();
  $lightboxOverlay.hide();
  $("#setManagerAccount").val("");
  $("#setManagerPassword").val("");
  $(".progressbar li:not(:first-child)").removeClass("active");
});

$(document).on("click", ".close", function () {
  $editLightBox.empty();
  $addLightBox.hide();
  $lightboxOverlay.hide();
});

$(document).on("click", "#Edit_updateAuthoritiesButton", function () {
  $editLightBox.empty();
  $addLightBox.hide();
  $lightboxOverlay.hide();
});

$(document).on("click", "#Edit_updateDataButton", function () {
  $editLightBox.empty();
  $addLightBox.hide();
  $lightboxOverlay.hide();
});

$(document).on("click", "#Add_completeButton", function () {
  location.reload();
});

// 關閉燈箱後回到第一步驟
$(document).on("click", "#mainAddManagerButton", function () {
  $("#addLightBox").removeClass("d-none").show();
  $("#addLightBox").find("input").val("");
  $("#step1Content").removeClass("d-none");
  $("#step2Content").addClass("d-none");
  $("#step3Content").addClass("d-none");
  $("#completionPage").addClass("d-none");
  $lightboxOverlay.show();
});

// -------------------DataListener-------------------

function listenPageLink() {
  $("body").on("click", "a.page-link", function (event) {
    event.preventDefault();
    const page = $(this).text();
    console.log("Link clicked:", page);
    updateSearchParams({ page: page });
  });
}

function listenItemsPerPage() {
  $("#page").on("change", function () {
    const selectedValue = $(this).val();
    updateSearchParams({ size: selectedValue });
  });
}

function listenSearchInput() {
  var inputElement = $("#search");
  inputElement.keypress(function (event) {
    if (event.which === 13) {
      updateSearchParams({ search: inputElement.value });
    }
  });

  $("#button-search").on("click", () => {
    updateSearchParams({ search: inputElement.value });
  });
}

$("#Add_addManagerButton").on("click", () => {
  addManager();
});

$("#Add_UpdateManagerData").on("click", () => {
  addManagerSet();
});

$("#Add_UpdateManagerAuthorities").on("click", () => {
  addManagerAuthorities();
});

// -------------------查詢與更新管理員-------------------

let currentSearchParams = {
  page: 1,
  size: 5,
};

let currentSearchURL;
// 生成查詢網址，並以此搜尋管理員
function performSearch() {
  const search_inputed = document.getElementById("search").value;
  const { page, size } = currentSearchParams;

  console.log("search_inputed:", search_inputed);
  console.log("page_selected:", page);
  console.log("itemsPerPage:", size);

  const url = new URL(config.url + "/manager/manageManager");
  url.searchParams.append("search", search_inputed);
  url.searchParams.append("page", page);
  url.searchParams.append("size", size);

  currentSearchURL = url;
  searchmanagers(currentSearchURL);
}

// 更新搜索参数的函数，並重新查詢管理員
function updateSearchParams(newParams) {
  currentSearchParams = { ...currentSearchParams, ...newParams };
  performSearch();
}

function searchmanagers(currentSearchURL) {
  try {
    if (currentSearchURL) {
      // 检查 currentSearchURL 是否存在
      const response = fetch(currentSearchURL.toString(), {
        method: "GET",
        headers: {
          Authorization_M: token,
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((managerData) => {
          var code = managerData.code;
          if (code === 200) {
            // 生成按鈕及表格
            createPageButtons(managerData.message);
            createResultTable(managerData.message);
          } else {
            // 处理响应错误
          }
        })
        .catch((error) => {
          console.error("Error:", error);
          // 输出服务器返回的文本
          if (error instanceof Response) {
            error.text().then((text) => {
              console.error("Server response:", text);
            });
          }
        });
    } else {
      console.error("currentSearchURL is undefined or null");
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

// 根據查詢結果的頁數，建立分頁按鈕
function createPageButtons(response) {
  const paginationElements = document.getElementsByClassName("pagination");
  const responsePageTotal = response.total;
  const responsePageSize = response.size;
  let html = "";

  // 如果頁數小於一，建立一頁
  if (responsePageTotal <= responsePageSize) {
    html += `
      <li class="page-item">
        <a class="page-link" href="#">1</a>
      </li>
    `;
    // 遍歷建立的分頁連結，並且帶入遞增數字
    for (let i = 0; i < paginationElements.length; i++) {
      paginationElements[i].innerHTML = html;
    }
    return;
  }

  // 計算總頁數
  const totalPages = Math.ceil(responsePageTotal / responsePageSize);

  // 定義回到最前頁的結構
  html += `
    <li class="page-item">
      <a class="page-link" href="#" aria-label="Previous">
        <span aria-hidden="true">&laquo;</span>
      </a>
    </li>
  `;
  // 根據頁數建立分頁按紐
  for (let i = 1; i <= totalPages; i++) {
    html += `
      <li class="page-item">
        <a class="page-link" href="#">${i}</a>
      </li>
    `;
  }
  // 遍歷建立的分頁連結，並且帶入遞增數字
  for (let i = 0; i < paginationElements.length; i++) {
    paginationElements[i].innerHTML = html;
  }
}

// 用以防止動態生成按鈕的冒泡
let editButtonHandler = null;
let editTogglingCheckboxHandler = null;
// 根據查詢結果建立表格
function createResultTable(response) {
  console.log(response);
  const resultTable_el = document.getElementById("resultTable");
  let seachTableHTML = ``;
  // 分別儲存回傳數據的資料，用於更新管理員資料時帶入資料
  const managerData = response.body;
  let theManagerAccount;
  let managerAccountValue;
  let managerPasswordValue;
  let managerStateValue;
  let updateManagerDataJson;
  let selectedAuthorities = [];

  // 遍歷回傳數據中所有的管理員，並每人建立一筆表格資料
  managerData.forEach((manager) => {
    const managerAccount = manager.managerAccount;
    const managerCreated = manager.managerCreated;
    const managerState = manager.managerState === "開啟" ? "checked" : ``;
    //更新當前管理員資料到全域變數
    theManagerAccount = managerAccount;
    managerAccountValue = managerAccount;
    managerPasswordValue = "";
    managerStateValue = managerState === "checked" ? 1 : 0;

    // 定義單筆資料的結構
    seachTableHTML += `
    <tr style="height: 10px;">
      <td class="text-left">${managerAccount}</td>
      <td class="text-left">${managerCreated}</td>
      <td class="text-center">
        <div class="form-check form-switch">
          <input
            class="form-check-input"
            type="checkbox"
            id="flexSwitchCheckDefault"
            data-managerAccount="${managerAccount}" data-managerCreated="${managerCreated}" data-managerState="${managerState}" 
            ${managerState}
          />
        </div>
      </td>
      <td>
        <buttom class="btn btn-link btn-sm editBtn" style="width: 100%;" data-managerAccount="${managerAccount}" data-managerCreated="${managerCreated}" data-managerState="${managerState}" 
          >編輯</buttom
        >
      </td>
    </tr>
    `;
  });

  // 将html添加到结果表格中
  resultTable_el.innerHTML = seachTableHTML;

  // 監聽表格
  const parentElement = document.querySelector("table");
  parentElement.addEventListener("click", function (event) {
    // 監聽表格中的編輯按鈕點擊事件
    if (editButtonHandler === null) {
      editButtonHandler = function (event) {
        if (event.target.classList.contains("editBtn")) {
          // 处理编辑按钮点击事件的代码
          const managerAccount = event.target.getAttribute(
            "data-managerAccount"
          );
          const managerState = event.target.getAttribute("data-managerState");

          // 解绑事件处理程序
          document.removeEventListener("click", editButtonHandler);

          // 重新绑定点击编辑按钮的事件处理程序
          createResultTable(response);

          // 顯示燈箱容器，並動態生成當前管理員的編輯燈箱
          $("#lightboxOverlay").css("display", "flex");
          createEditLightBox(managerAccount, managerState);

          //儲存當前管理員帳號
          theManagerAccount = managerAccount;
          managerAccountValue = managerAccount;

          // 调用checkAuthorities，并提供一个回调函数来处理已勾选的选项数组
          checkAuthorities(managerAccount, function (selectedAuthorities) {
            console.log(selectedAuthorities);
            console.log(`編輯的managerAccount是：${managerAccount}`);
          });
          //建立checkbox監聽器
          const checkboxes = document.querySelectorAll(
            '#editLightBox input[type="checkbox"]'
          );
          console.log("Number of checkboxes found:", checkboxes.length);
          checkboxListener(checkboxes);

          // 绑定点击编辑按钮的事件处理程序
          document.addEventListener("click", editButtonHandler);
        }
      };

      document.addEventListener("click", editButtonHandler);
    }

    // 監聽表格中的狀態開關
    if (editTogglingCheckboxHandler === null) {
      editTogglingCheckboxHandler = function (event) {
        if (event.target.classList.contains("form-check-input")) {
          // 处理编辑按钮点击事件的代码
          const managerAccount = event.target.getAttribute(
            "data-managerAccount"
          );

          // 解绑事件处理程序
          document.removeEventListener("click", editTogglingCheckboxHandler);

          // 重新绑定点击编辑按钮的事件处理程序
          createResultTable(response);

          // 儲存當前管理員帳號
          theManagerAccount = managerAccount;
          // 儲存checkbox監聽狀態到管理員狀態
          if (event.target.checked) {
            managerAccountValue = "1";
          } else {
            managerAccountValue = "0";
          }

          console.log(theManagerAccount, managerAccountValue);
          // 送出修改的資料
          const elements = {
            orgManagerAccount: theManagerAccount,
            managerAccount: theManagerAccount,
            managerPassword: "",
            managerState: managerAccountValue,
          };
          const jsonData = JSON.stringify(elements);
          updateManagerData(jsonData);
          searchmanagers(currentSearchURL);

          // 绑定点击编辑按钮的事件处理程序
          document.addEventListener("click", editTogglingCheckboxHandler);
        }
      };

      document.addEventListener("click", editTogglingCheckboxHandler);
    }
  });

  // 總之先集結 jsonData，在沒有設定密碼時也能更新
  jsonData(
    theManagerAccount,
    managerAccountValue,
    managerPasswordValue,
    managerStateValue
  );
  //更新管理員時，監聽使用者輸入的管理員資料
  $(document).on("input", "#newManagerAccount", function () {
    const newManagerAccountValue = $(this).val();
    managerAccountValue = newManagerAccountValue;
    console.log("New Manager Account Value:", managerAccountValue);
    jsonData(
      theManagerAccount,
      managerAccountValue,
      managerPasswordValue,
      managerStateValue
    );
  });
  $(document).on("input", "#newManagerPassword", function () {
    const newManagerPassword = $(this).val();
    managerPasswordValue = newManagerPassword;
    console.log("New Manager Account Value:", managerPasswordValue);
    jsonData(
      theManagerAccount,
      managerAccountValue,
      managerPasswordValue,
      managerStateValue
    );
  });
  $(document).on("input", "#newManagerState", function () {
    const newManagerStateChecked = $(this).prop("checked");
    const newManagerState = newManagerStateChecked ? 1 : 0;
    managerStateValue = newManagerState;
    console.log("New Manager State Value:", managerStateValue);
    jsonData(
      theManagerAccount,
      managerAccountValue,
      managerPasswordValue,
      managerStateValue
    );
  });
  // 監聽用戶勾選的管理員權限
  function checkboxListener(checkboxes) {
    checkboxes.forEach((checkbox) => {
      checkbox.addEventListener("change", () => {
        selectedAuthorities = [];
        checkboxes.forEach((cb) => {
          if (cb.checked) {
            const authorityText = cb.nextElementSibling.textContent.trim();
            if (authorityText !== "") {
              selectedAuthorities.push(authorityText);
            }
          }
        });
        console.log(selectedAuthorities);
      });
    });
  }

  //根據使用者輸入轉存為JSON，之後更新管理員用
  function jsonData(
    theManagerAccount,
    managerAccountValue,
    managerPasswordValue,
    managerStateValue
  ) {
    const elements = {
      orgManagerAccount: theManagerAccount,
      managerAccount: managerAccountValue,
      managerPassword: managerPasswordValue,
      managerState: managerStateValue,
    };
    const jsonData = JSON.stringify(elements);
    updateManagerDataJson = jsonData;
    console.log(updateManagerDataJson);
  }

  // 集結更新權限的 JSON (帳號 + 權限陣列)
  function jsonAuthrities(account, authorities) {
    const jsonObject = {
      account: account,
      authorities: authorities,
    };
    const jsonString = JSON.stringify(jsonObject);
    console.log(jsonString);
    return jsonString;
  }

  //送出修改的管理員資料及權限
  $(document).on("click", "#Edit_updateDataButton", function () {
    updateManagerData(updateManagerDataJson);
    const updateAuthritiesJson = jsonAuthrities(
      theManagerAccount,
      selectedAuthorities
    );
    updateAuthorities(updateAuthritiesJson);
  });
}

function updateManagerData(jsonData) {
  console.log(jsonData);
  fetch(config.url + "/manager/manageManager", {
    method: "PUT",
    headers: {
      Authorization_M: token,
      "Content-Type": "application/json",
    },
    body: jsonData,
  })
    .then((response) => response.json())
    .then((response) => {
      if (!response.ok) {
        console.log(response);
      }
      return response;
    })
    .then((data) => {
      if (data.code === 200) {
        // TODO: 新增成功提示 (修改管理員資料)
        searchmanagers(currentSearchURL);
      }
    })
    .catch((error) => {
      console.error("There was a problem with the fetch operation:", error);
    });
}

// 更新既有管理員的權限
function updateAuthorities(updateAuthritiesJson) {
  console.log(updateAuthritiesJson);
  return new Promise((resolve, reject) => {
    console.log(updateAuthritiesJson);
    fetch(config.url + "/manager/manageManager/authorities", {
      method: "PUT",
      headers: {
        Authorization_M: token,
        "Content-Type": "application/json",
      },
      body: updateAuthritiesJson,
    })
      .then((response) => response.json())
      .then((response) => {
        if (response.code === 200) {
          // TODO: 增加成功提示
          console.log(response);
          searchmanagers(currentSearchURL);
          resolve(response);
        } else {
          // 失敗情況
          console.log(response);
          reject(response);
        }
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
        reject(error);
      });
  });
}

// 自動勾選要編輯的管理員的既有權限
function checkAuthorities(account, callback) {
  let selectedAuthorities = [];
  const url = new URL(config.url + "/manager/manageManager/authorities");
  url.searchParams.append("managerAccount", account);

  // 查詢要編輯的管理員的權限，並且勾選既有權限
  fetch(url.toString(), {
    method: "GET",
    headers: {
      Authorization_M: token,
      "Content-Type": "application/x-www-form-urlencoded",
    },
  })
    .then((response) => response.json())
    .then((responseData) => {
      var code = responseData.code;
      if (code === 200) {
        const checkboxes = document.querySelectorAll(
          '#editLightBox input[type="checkbox"]'
        );
        const jsonData = responseData.message.managerAuthoritiesList;
        jsonData.forEach((label) => {
          // 查找匹配的標籤並自動勾選
          const matchingCheckbox = Array.from(checkboxes).find((checkbox) => {
            const checkboxLabel =
              checkbox.nextElementSibling.textContent.trim();
            return label === checkboxLabel;
          });
          if (matchingCheckbox) {
            matchingCheckbox.checked = true;
            selectedAuthorities.push(label); // 儲存到陣列
          }
        });
        callback(selectedAuthorities); // 回調以勾選的陣列
      }
    })
    .catch((error) => {
      console.error("Fetch error:", error);
    });
}

// 建立編輯管理員的燈箱
function createEditLightBox(account, state) {
  const editLightBox_el = document.getElementById("editLightBox");
  let editLightBoxHTML = ``;

  editLightBoxHTML = `
    <div class="card px-3 py-4" style="margin-bottom: 0">
    <section class="container">
      <header
        style="
          display: flex;
          justify-content: space-between;
          align-items: top;
          margin-bottom: 20px;
        "
      >
        <h3 style="margin: 0">${account}</h3>
        <span class="close cursor" id="closeEditLightBox">&times;</span>
      </header>
      <main style="display: flex">
        <section style="flex: 1">
          <header
            style="
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-bottom: 15px;
            "
          >
            <h5 class="card-title mb-0">管理員資料</h5>
          </header>
          <div id="Edit_editingManagerData">
            <div
              style="
                display: flex;
                align-items: center;
                margin-bottom: 15px;
                display: none;
              "
            >
              <label
                class="form-label"
                style="
                  flex-shrink: 1;
                  margin: 0;
                  white-space: nowrap;
                  font-size: 15px;
                "
                >帳號：</label
              >
              <input id="orgManagerAccount" type="text" class="form-control form-control-sm" value="${account}" onfocus="javascript:if(this.value=="${account}")this.value=""";/>
            </div>
            <div
              style="
                display: flex;
                align-items: center;
                margin-bottom: 15px;
              "
            >
              <label
                class="form-label"
                style="
                  flex-shrink: 1;
                  margin: 0;
                  white-space: nowrap;
                  font-size: 15px;
                "
                >帳號：</label
              >
              <input id="newManagerAccount" type="text" class="form-control form-control-sm" value="${account}" onfocus="javascript:if(this.value=="${account}")this.value=""";/>
            </div>
            <div
              style="
                display: flex;
                align-items: center;
                margin-bottom: 15px;
              "
            >
              <label
                class="form-label"
                style="
                  flex-shrink: 1;
                  margin: 0;
                  white-space: nowrap;
                  font-size: 15px;
                "
                >密碼：</label
              >
              <input id="newManagerPassword" type="text" class="form-control form-control-sm" />
            </div>
            <div class="checkbox_item citem_3" style="display: flex">
              <label
                class="form-label"
                style="
                  flex-shrink: 1;
                  margin: 0;
                  white-space: nowrap;
                  font-size: 15px;
                "
                >狀態：</label
              >
              <label
                class="checkbox_wrap"
                style="margin: auto; width: 180px; border-radius: 5px"
              >
                <input
                  id="newManagerState"
                  type="checkbox"
                  name="checkbox"
                  class="checkbox_inp"
                  ${state}
                />
                <span class="checkbox_mark"></span>
              </label>
            </div>
          </div>
        </section>
        <div class="vr mx-3"></div>
        <section style="flex: 1">
          <header
            style="
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-bottom: 15px;
            "
          >
            <h5 class="card-title mb-0">管理員權限</h5>
          </header>
          <div
            id="Edit_managerAuthorities"
            class="custom-control custom-checkbox"
          >
            <div
              id="Edit_editingAuthorities"
              style="display: flex; gap: 30px"
            >
              <div class="left">
                <div class="checkbox d-none">
                  <input
                    type="checkbox"
                    class="custom-control-input"
                    id="Edit_editingCheckManageManager"
                    disabled
                  />
                  <label
                    class="custom-control-label"
                    for="Edit_editingCheckManageManager"
                    >管理員管理</label
                  >
                </div>
                <div class="checkbox">
                  <input
                    type="checkbox"
                    class="custom-control-input"
                    id="Edit_editingCheckHomepage"
                  />
                  <label
                    class="custom-control-label"
                    for="Edit_editingCheckHomepage"
                    >首頁管理</label
                  >
                </div>
                <div class="checkbox">
                  <input
                    type="checkbox"
                    class="custom-control-input"
                    id="Edit_editingCheckManageUser"
                  />
                  <label
                    class="custom-control-label"
                    for="Edit_editingCheckManageUser"
                    >會員管理</label
                  >
                </div>
                <div class="checkbox">
                  <input
                    type="checkbox"
                    class="custom-control-input"
                    id="Edit_editingCheckMall"
                  />
                  <label
                    class="custom-control-label"
                    for="Edit_editingCheckMall"
                    >商品管理</label
                  >
                </div>
              </div>
              <div class="right">
                <div class="checkbox">
                  <input
                    type="checkbox"
                    class="custom-control-input"
                    id="Edit_editingCheckPetgroomerManager"
                  />
                  <label
                    class="custom-control-label"
                    for="Edit_editingCheckPetgroomerManager"
                    >美容師管理</label
                  >
                </div>
                <div class="checkbox">
                  <input
                    type="checkbox"
                    class="custom-control-input"
                    id="Edit_editingCheckpgPersonalManagement"
                  />
                  <label
                    class="custom-control-label"
                    for="Edit_editingCheckpgPersonalManagement"
                    >美容師個人管理</label
                  >
                </div>
                <div class="checkbox">
                  <input
                    type="checkbox"
                    class="custom-control-input"
                    id="Edit_editingCheckSocialMedia"
                  />
                  <label
                    class="custom-control-label"
                    for="Edit_editingCheckSocialMedia"
                    >社群管理</label
                  >
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </section>
    <div
      class="btnContain mt-4 mb-2"
      style="display: flex; justify-content: space-around; margin-left: 36px; margin-right: 36px;"
    >
      <button
        class="btn btn-sm btn-outline-secondary"
        style="width: 180px"
        id="Edit_updateDataButton"
      >
        儲存
      </button>
    </div>
  </div>
  `;

  editLightBox_el.innerHTML = editLightBoxHTML;
}

// -------------------新增管理員-------------------

//Step 1: 新增管理員 - 點擊「新增 (管理員) 按鈕後」
function addManager() {
  // 取得輸入值
  const newSetManagerAccount = $("#setManagerAccount").val();
  const newSetManagerPassword = $("#setManagerPassword").val();

  // 輸入判斷
  if (!newSetManagerAccount) {
    alert("請填寫帳號。");
    return;
  } else if (!/^[a-zA-Z0-9]{6,}$/.test(newSetManagerAccount)) {
    alert("請填寫 6 個以上的英文或數字。");
    return;
  }

  // 建立請求
  const requestOptions = {
    method: "POST",
    headers: {
      Authorization_M: token,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      managerAccount: newSetManagerAccount,
      managerPassword: newSetManagerPassword,
    }),
  };
  console.log(requestOptions);

  // 送出新增管理員的請求
  fetch(config.url + "/manager/manageManager", requestOptions)
    .then((response) => response.json())
    .then((data) => {
      // 將回傳 message 取代警告提示的空白
      const addManagerCompleteNotice = $("#addManagerCompleteNotice");
      addManagerCompleteNotice.text(data.message);
      if (data.code === 200) {
        // 將提示顏色設為 black
        addManagerCompleteNotice.css("color", "black");
        //將資料帶帶入 Step2 input
        $("#orgManagerAccount").val(newSetManagerAccount);
        $("#newManagerAccount").val(newSetManagerAccount);
        $("#newManagerPassword").val(newSetManagerPassword);
        // 隱藏「新增 (管理員)」按鈕，顯示「下一步 (to Step 2)」
        $("#Add_addManagerButton").addClass("d-none");
        $("#Add_addedManagerNextButton").removeClass("d-none");
        // 隱藏 Step 1，顯示 Step 2，並更新步驟進度條
        $("#Add_addedManagerNextButton").on("click", function () {
          $("#step2Content").removeClass("d-none");
          $("#step1Content").addClass("d-none");
          updateProgressBar();
        });
      } else if (data.code === 400) {
        // 更換警告顏色為 red
        addManagerCompleteNotice.css("color", "red");
      } else if (data.code === 401) {
        errorAuth();
      }
      // 顯示提示
      addManagerCompleteNotice.removeClass("invisible");
    })
    .catch((error) => {
      console.error("There was a problem with the fetch operation:", error);
    });
}

// Step 2: 開啟或關閉管理員狀態
function addManagerSet() {
  const newSetManagerAccount = $("#newManagerAccount").val();
  const newSetManagerPassword = $("#newManagerPassword").val();
  const state = $("#newManagerState").prop("checked") ? 1 : 0;
  // 設置「新增的管理員」的狀態
  const requestOptions = {
    method: "PUT",
    headers: {
      Authorization_M: token,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      orgManagerAccount: newSetManagerAccount,
      managerAccount: newSetManagerAccount,
      managerPassword: newSetManagerPassword,
      managerState: state,
    }),
  };

  console.log(requestOptions); // 確保在這裡打印選項，應該包含正確的帳號和密碼

  // 送出請求
  fetch(config.url + "/manager/manageManager", requestOptions)
    .then((response) => response.json())
    .then((data) => {
      // 將回傳 message 取代提示的空白字元
      const setManagerCompleteNotice = $("#setManagerCompleteNotice");
      setManagerCompleteNotice.text(data.message);
      if (data.code === 200) {
        // 將提示顏色設為 black
        setManagerCompleteNotice.css("color", "black");
        // 隱藏「設置 (管理員狀態)」按鈕，顯示「下一步 (to step 3)」按鈕
        $("#Add_UpdateManagerData").addClass("d-none");
        $("#Add_UpdateManagerNextButton").removeClass("d-none");
        // 隱藏 Step 2，顯示 Step 3，並更新步驟進度條
        $("#Add_UpdateManagerNextButton").on("click", function () {
          $("#step3Content").removeClass("d-none");
          $("#step2Content").addClass("d-none");
          updateProgressBar();
        });
      } else if (data.code === 400) {
        // 將錯誤提示顏色設為 red
        setManagerCompleteNotice.css("color", "red");
      } else if (data.code === 401) {
        errorAuth();
      }
      // 顯示提示
      setManagerCompleteNotice.removeClass("invisible");
    })
    .catch((error) => {
      console.error("There was a problem with the fetch operation:", error);
    });
}

// Step 3: 更新新增的管理員的權限
//遍歷「新增的管理員」的權限 checkboxes
let selectAddAuthorities = [];
const checkboxes = document.querySelectorAll(
  '#Add_managerAuthorities input[type="checkbox"]'
);
console.log("Number of checkboxes found:", checkboxes.length);
checkboxes.forEach((checkbox) => {
  checkbox.addEventListener("change", () => {
    selectAddAuthorities = [];
    checkboxes.forEach((cb) => {
      if (cb.checked) {
        const authorityText = cb.nextElementSibling.textContent.trim();
        if (authorityText !== "") {
          selectAddAuthorities.push(authorityText);
        }
      }
    });
    console.log(selectAddAuthorities);
  });
});

async function addManagerAuthorities() {
  const newSetManagerAccount = $("#setManagerAccount").val();
  const addManagerAuthorities = jsonAuthrities(
    newSetManagerAccount,
    selectAddAuthorities
  );
  const response = await updateAuthorities(addManagerAuthorities);

  const setManagerAuthoritiesCompleteNotice = $(
    "#setManagerAuthoritiesCompleteNotice"
  );

  if (response.code === 200) {
    // 將提示顏色設置為 black
    setManagerAuthoritiesCompleteNotice.css("color", "black");
    setManagerAuthoritiesCompleteNotice.text(
      response.message === "更新完成" ? "設置成功" : response.message
    );
    setManagerAuthoritiesCompleteNotice.removeClass("invisible");
    // 隱藏「設置 (管理員權限)」按鈕，顯示「下一步」按鈕
    $("#Add_UpdateManagerAuthorities").addClass("d-none");
    $("#addCompleteButton").removeClass("d-none");
    //  隱藏 Step 3，顯示 complete page (點擊「設置」，之後點擊「下一步」)
    $("#addCompleteButton").on("click", function () {
      $("#step3Content").addClass("d-none");
      $("#completionPage").removeClass("d-none");
    });
  } else if (response.code === 400) {
    // 將提示顏色設置為 red
    setManagerAuthoritiesCompleteNotice.css("color", "red");
  } else if (response.code === 401) {
    errorAuth();
  }

  // 集結更新權限的 JSON (帳號 + 權限陣列)
  function jsonAuthrities(account, authorities) {
    const jsonObject = {
      account: account,
      authorities: authorities,
    };
    const jsonString = JSON.stringify(jsonObject);
    console.log(jsonString);
    return jsonString;
  }
}

// 401 警告
// TODO: 自訂燈箱？
function errorAuth() {
  swal({
    title: "哎呀🤭",
    text: "您尚未登入，請重新登入",
    icon: "error",
  }).then(() => {
    localStorage.removeItem("Authorization_M");
    window.location.href = "/backend/login.html"; // 跳轉後台登入頁
  });
}

// -------------------步驟進度條-------------------

// 根據 step container 更新當前頁面變數 currentStep，用以 updateProgressBar()
const stepContainers = document.querySelectorAll(".step-content");
let currentStep = 0;
stepContainers.forEach((container) => {
  const prevButton = container.querySelector(".prevButton");
  const nextButton = container.querySelector(".nextButton");

  if (nextButton) {
    nextButton.addEventListener("click", () => {
      if (currentStep < stepContainers.length - 1) {
        currentStep++;
      }
    });
  }

  if (prevButton) {
    prevButton.addEventListener("click", () => {
      if (currentStep > 0) {
        currentStep--;
      }
    });
  }
});

// 更新步驟進度條
function updateProgressBar() {
  stepContainers.forEach((stepContainer, stepIndex) => {
    const progressBar = stepContainer.parentNode.querySelector(".progressbar");
    if (progressBar) {
      const steps = progressBar.querySelectorAll("li");
      steps.forEach((step, index) => {
        if (index <= currentStep) {
          step.classList.add("active");
        } else {
          step.classList.remove("active");
        }
      });
    }
  });
}
