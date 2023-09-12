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

//-------------------active-------------------
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
  $editLightBox.empty();
  $addLightBox.hide();
  $lightboxOverlay.hide();
});

let token = localStorage.getItem("Authorization_M");

$(document).on("click", "#mainAddManagerButton", function () {
  $("#addLightBox").removeClass("d-none").show();
  $("#addLightBox").find("input").val("");
  $("#step1Content").removeClass("d-none");
  $("#step2Content").addClass("d-none");
  $("#step3Content").addClass("d-none");
  $lightboxOverlay.show();
});

// -------------------DataListener-------------------

function listenPageLink() {
  $("body").on("click", "a.page-link", function (event) {
    event.preventDefault();
    const page = $(this).text();
    console.log("Link clicked:", page);
    searchURL({ page: page });
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

$("#Add_addManagerButton").on("click", () => {
  addManager();
});

$("#Add_UpdateManagerData").on("click", () => {
  addManagerSet();
});

$("#Add_UpdateManagerAuthorities").on("click", () => {
  addManagerAuthorities();
});

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

function addManager() {
  const newSetManagerAccount = $("#setManagerAccount").val();
  const newSetManagerPassword = $("#setManagerPassword").val();
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

  fetch(config.url + "/manager/manageManager", requestOptions)
    .then((response) => response.json())
    .then((data) => {
      $("#addManagerCompleteNotice").text(data.message);
      if (data.code === 200) {
        console.log("inv");
        //Step2 input Data
        $("#orgManagerAccount").val(newSetManagerAccount);
        $("#newManagerAccount").val(newSetManagerAccount);
        $("#newManagerPassword").val(newSetManagerPassword);
        $("#Add_addManagerButton").addClass("d-none");
        $("#Add_addedManagerNextButton").removeClass("d-none");
        $("#Add_addManagerButton").on("click", function () {
          const newSetManagerAccount = $("#newManagerAccount").val(); // 重新获取值
          const newSetManagerPassword = $("#newManagerPassword").val(); // 重新获取值
          addManagerSet(newSetManagerAccount, newSetManagerPassword);
        });
        $("#Add_addedManagerNextButton").on("click", function () {
          $("#step2Content").removeClass("d-none");
          $("#step1Content").addClass("d-none");
          updateProgressBar();
        });
      } else if (data.code === 400) {
        $("#addManagerCompleteNotice").css("color", "red");
      } else if (data.code === 401) {
        errorAuth();
      }
      $("#addManagerCompleteNotice").removeClass("invisible");
    })
    .catch((error) => {
      console.error("There was a problem with the fetch operation:", error);
    });
}

function addManagerSet(account, password) {
  $("#Add_UpdateManagerData").off("click"); // 先取消绑定之前的点击事件

  $("#Add_UpdateManagerData").on("click", function () {
    const newSetManagerAccount = $("#newManagerAccount").val();
    const newSetManagerPassword = $("#newManagerPassword").val();
    performAddManagerSet(newSetManagerAccount, newSetManagerPassword);
  });

  function performAddManagerSet(account, password) {
    const state = $("#newManagerState").prop("checked") ? 1 : 0;
    const requestOptions = {
      method: "PUT",
      headers: {
        Authorization_M: token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        orgManagerAccount: account,
        managerAccount: account,
        managerPassword: password,
        managerState: state,
      }),
    };

    console.log(requestOptions); // 确保在这里打印选项，应该包含正确的帐号和密码

    fetch(config.url + "/manager/manageManager", requestOptions)
      .then((response) => response.json())
      .then((data) => {
        $("#setManagerCompleteNotice").text(data.message);
        if (data.code === 200) {
          $("#Add_UpdateManagerData").addClass("d-none");
          $("#Add_UpdateManagerNextButton").removeClass("d-none");
          $("#Add_UpdateManagerNextButton").on("click", function () {
            $("#step3Content").removeClass("d-none");
            $("#step2Content").addClass("d-none");
            updateProgressBar();
          });
        } else if (data.code === 400) {
          $("#setManagerCompleteNotice").css("color", "red");
        } else if (data.code === 401) {
          errorAuth();
        }
        $("#setManagerCompleteNotice").removeClass("invisible");
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  }
}

let selectAddAuthorities = [];
async function addManagerAuthorities() {
  try {
    console.log("addManagerAuthorities called");
    const checkboxes = document.querySelectorAll(
      '#Add_managerAuthorities input[type="checkbox"]'
    );
    console.log("Number of checkboxes found:", checkboxes.length);

    // 为每个复选框元素添加事件监听器
    checkboxes.forEach((checkbox) => {
      checkbox.addEventListener("change", () => {
        // 清空选定选项数组
        selectAddAuthorities = [];

        // 遍历所有复选框，将勾选的复选框的标签文本添加到选定选项数组中
        checkboxes.forEach((cb) => {
          if (cb.checked) {
            const authorityText = cb.nextElementSibling.textContent.trim();
            if (authorityText !== "") {
              selectAddAuthorities.push(authorityText);
            }
          }
        });

        // 打印选定的JSON数据
        console.log(selectAddAuthorities);
      });
    });

    // 帶入新增的管理員帳號, 權限陣列
    const newSetManagerAccount = $("#setManagerAccount").val();
    const response = await updateAuthorities(
      newSetManagerAccount,
      selectAddAuthorities
    );

    $("#setManagerAuthoritiesCompleteNotice").removeClass("invisible");
    if (response.code === 200) {
      $("#Add_UpdateManagerAuthorities").on("click", function () {
        $("#addCompleteButton").on("click", function () {
          $("#step3Content").addClass("d-none");
          $("#completionPage").removeClass("d-none");
        });
      });
    } else if (response.code === 400) {
      $("#setManagerAuthoritiesCompleteNotice").css("color", "red");
    } else if (response.code === 401) {
      errorAuth();
    }
    $("#setManagerAuthoritiesCompleteNotice").text(response.message);
  } catch (error) {
    console.error("An error occurred:", error);
  }
}

function errorAuth() {
  swal({
    title: "哎呀🤭",
    text: "您尚未登入，請重新登入",
    icon: "error",
  }).then(() => {
    localStorage.removeItem("Authorization_U");
    window.location.href = "/backend/login.html"; // 替换为你要跳转的页面地址
  });
}

// -------------------HTML-------------------

function createPageButtons(response) {
  const paginationElements = document.getElementsByClassName("pagination");
  const responsePageTotal = response.total;
  const responsePageSize = response.size;
  let html = "";

  // 如果总数据条数小于等于每页显示的数据条数，仍然显示一个分页按钮
  if (responsePageTotal <= responsePageSize) {
    html += `
      <li class="page-item">
        <a class="page-link" href="#">1</a>
      </li>
    `;

    // Loop through all pagination elements and set their innerHTML
    for (let i = 0; i < paginationElements.length; i++) {
      paginationElements[i].innerHTML = html;
    }
    return;
  }

  // 计算总页数
  const totalPages = Math.ceil(responsePageTotal / responsePageSize);

  // Create the "Previous" button
  html += `
    <li class="page-item">
      <a class="page-link" href="#" aria-label="Previous">
        <span aria-hidden="true">&laquo;</span>
      </a>
    </li>
  `;

  for (let i = 1; i <= totalPages; i++) {
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

let selectedAuthorities = [];
function createResultTable(response) {
  console.log(response);
  const resultTable_el = document.getElementById("resultTable");
  let seachTableHTML = ``;
  const managerData = response.body;
  let theManagerAccount;
  let managerAccountValue;
  let managerPasswordValue;
  let managerStateValue;
  let updateManagerDataJson;
  let selectedAuthorities = [];

  // 遍历managerData数组
  managerData.forEach((manager) => {
    const managerAccount = manager.managerAccount;
    const managerCreated = manager.managerCreated;
    const managerState = manager.managerState === "開啟" ? "checked" : ``;
    //更新管理員資料
    theManagerAccount = managerAccount;
    managerAccountValue = managerAccount;
    managerPasswordValue = "";
    managerStateValue = managerState === "checked" ? 1 : 0;

    // 创建表格行并添加到html中
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
            ${managerState} disabled
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

  // 監聽表格中的編輯按鈕點擊事件
  const parentElement = document.querySelector("table");
  parentElement.addEventListener("click", function (event) {
    if (event.target.classList.contains("editBtn")) {
      const managerAccount = event.target.getAttribute("data-managerAccount");
      const managerState = event.target.getAttribute("data-managerState");
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
    }
  });

  //監聽使用者輸入的管理員資料
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
  // 监听用户勾选的管理员权限
  function checkboxListener(checkboxes) {
    checkboxes.forEach((checkbox) => {
      checkbox.addEventListener("change", () => {
        // 清空选定选项数组
        selectedAuthorities = [];

        // 遍历所有复选框，将勾选的复选框的标签文本添加到选定选项数组中
        checkboxes.forEach((cb) => {
          if (cb.checked) {
            const authorityText = cb.nextElementSibling.textContent.trim();
            if (authorityText !== "") {
              selectedAuthorities.push(authorityText);
            }
          }
        });

        // 打印选定的JSON数据
        console.log(selectedAuthorities);
      });
    });
  }

  //根據使用者輸入轉存為JSON
  function jsonData(
    theManagerAccount,
    managerAccountValue,
    managerPasswordValue,
    managerStateValue
  ) {
    // 转JSON
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
  });
  $(document).on("click", "#Edit_updateAuthoritiesButton", function () {
    const updateAuthritiesJson = jsonAuthrities(
      theManagerAccount,
      selectedAuthorities
    );
    updateAuthorities(updateAuthritiesJson);
  });
}

function updateManagerData(jsonData) {
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
        console.log("save");
      }
    })
    .catch((error) => {
      // 处理请求失败或异常情况
      console.error("There was a problem with the fetch operation:", error);
    });
}

function updateAuthorities(updateAuthritiesJson) {
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
      .then((data) => {
        if (data.code === 200) {
          console.log("save");
          console.log(data);
          resolve(data);
        } else {
          console.log(data.code);
          console.log(data);
          reject(data);
        }
      })
      .catch((error) => {
        // 处理请求失败或异常情况
        console.error("There was a problem with the fetch operation:", error);
        reject(error);
      });
  });
}

function checkAuthorities(account, callback) {
  // 创建一个空的已勾選选项数组
  let selectedAuthorities = [];

  // 构建请求 URL，包括查询参数
  const url = new URL(config.url + "/manager/manageManager/authorities");
  url.searchParams.append("managerAccount", account);

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
          // 查找与标签匹配的复选框
          const matchingCheckbox = Array.from(checkboxes).find((checkbox) => {
            const checkboxLabel =
              checkbox.nextElementSibling.textContent.trim();
            return label === checkboxLabel;
          });

          // 如果找到匹配的复选框，勾选它
          if (matchingCheckbox) {
            matchingCheckbox.checked = true;
            // 将已勾选的选项添加到已勾选选项数组中
            selectedAuthorities.push(label);
          }
        });

        // 在这里回调传递已勾选的陣列
        callback(selectedAuthorities);
      }
    })
    .catch((error) => {
      // 处理捕获的错误，包括网络错误等
      console.error("Fetch error:", error);
    });
}

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
        儲存資料
      </button>
      <button
        class="btn btn-sm btn-outline-secondary"
        style="width: 180px"
        id="Edit_updateAuthoritiesButton"
      >
        儲存權限
      </button>
    </div>
  </div>
  `;

  editLightBox_el.innerHTML = editLightBoxHTML;
}

// -------------------步驟-------------------
const stepContainers = document.querySelectorAll(".step-content");
let currentStep = 0;

stepContainers.forEach((container) => {
  const prevButton = container.querySelector(".prevButton");
  const nextButton = container.querySelector(".nextButton");
  const fetchButton = container.querySelector(".fetch");

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
        // 显示上一个步骤
        currentStep--;
      }
    });
  }
});

function updateProgressBar() {
  stepContainers.forEach((stepContainer, stepIndex) => {
    // 更新進度條
    const progressBar = stepContainer.parentNode.querySelector(".progressbar");
    if (progressBar) {
      const steps = progressBar.querySelectorAll("li");

      // 根據當前步驟索引更新進度條
      steps.forEach((step, index) => {
        if (index <= currentStep) {
          step.classList.add("active");
        } else {
          step.classList.remove("active");
        }
      });
    }

    // 更新步驟內容的顯示/隱藏
    if (stepIndex === currentStep) {
      stepContainer.classList.remove("d-none"); // 使用classList.remove隐藏
      stepContainer.classList.add("active");
    } else {
      stepContainer.classList.remove("active");
      stepContainer.classList.add("d-none"); // 使用classList.add显示
    }
  });
}
