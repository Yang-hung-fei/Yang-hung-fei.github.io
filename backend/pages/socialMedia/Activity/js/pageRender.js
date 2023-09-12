import { showEditModal } from "./editModal.js";
import { showCancelModal } from "./cancelModal.js";
import { getAcByStatus } from "./callApi.js";
// ------------------------- 建立分頁  ------------------------- //
// 更新資料表格和分頁
async function createDataTable(data) {
    // // 選擇分頁元素
    let table = document.querySelector("#table");
    let tbody = table.querySelector("tbody");
    // 清空tbody表格
    tbody.innerHTML = "";
    let dataList = '';
    let fetchData = await data.fetchData;
    // 建立資料表格
    if (fetchData !== undefined) {
        fetchData.forEach(dataDetails => {
            //文字截斷
            let content = dataDetails.content;
            let truncateContent = content.substr(0, 10);
            // 建立資料
            dataList += `
               <tr>
               <td>${dataDetails.activityId}</td>
               <td>${dataDetails.title}</td>
               <td>${truncateContent}...</td>
               <td>${dataDetails.activityTime}</td>
               <td>${dataDetails.enrollLimit}</td>
               <td>${dataDetails.peopleCount}</td>
               <td>${dataDetails.startTime}</td>
               <td>${dataDetails.endTime}</td>
               <td>${dataDetails.status == 0 ? "執行中" : "已取消"}</td>
               <td>
               <button class="editBtn" id="editBtn"  data-id="${dataDetails.activityId}"><i class="bi bi-pencil-square"></i></button>
               </td>
               <td>
               <button class="cancelBtn" id="cancelBtn" data-id="${dataDetails.activityId}"><i class="bi bi-trash3-fill"></i></button>
               </td>
               </tr>`;

        });
        tbody.innerHTML = dataList;
    }
    //更新活動監聽
    const editActivities = document.querySelectorAll('#editBtn');
    editActivities.forEach((editActivity) => {
        editActivity.addEventListener('click', async function (e) {
            // 使用 dataset 屬性獲取 data-id 的值
            let dataId = this.dataset.id;
            //fetch獲取資料
            await showEditModal(dataId);

        });
    });

    //取消活動監聽
    const cancelActivities = document.querySelectorAll('#cancelBtn');
    cancelActivities.forEach((cancelAc) => {
        cancelAc.addEventListener('click', async function (e) {
            // 使用 dataset 屬性獲取 data-id 的值
            let dataId = this.dataset.id;
            //fetch獲取資料
            await showCancelModal(dataId);

        });
    });

}
async function createPagination(data) {
    let pagination = document.querySelector(".pagination");
    //建立分頁 -清空分頁
    pagination.innerHTML = "";
    // 總頁數
    let totalPages = await data.totalPage;
    //預設為1
    let currentPage = await data.curentPage;

    // 創建分頁頁碼
    for (let i = 1; i <= totalPages; i++) {
        const pageItem = document.createElement("li");
        pageItem.classList.add("page-item");
        if (i === currentPage + 1) {
            pageItem.classList.add("active");
        }
        const pageLink = document.createElement("button");
        pageLink.classList.add("page-link");
        pageLink.textContent = i;
        pageLink.setAttribute('data-page', i - 1);
        pageItem.appendChild(pageLink);
        pagination.appendChild(pageItem);
    }
}

// ------------------------- 建立活動狀態搜尋  ------------------------- //
// page為不同btn
async function createStatusPagination(status, data) {
    let statusPagination = document.querySelector('#statusPagination');
    //建立分頁 -清空分頁
    statusPagination.innerHTML = "";

    let pagination = document.createElement("ul");
    pagination.classList.add('pagination');
    pagination.classList.add('justify-content-center');
    statusPagination.append(pagination);
    // 總頁數
    let totalPages = await data.totalPage;
    //預設為1
    let currentPage = await data.curentPage;

    // 創建分頁頁碼
    for (let i = 1; i <= totalPages; i++) {
        const pageItem = document.createElement("li");
        pageItem.classList.add("page-item");
        if (i === currentPage + 1) {
            pageItem.classList.add("active");
        }
        const pageLink = document.createElement("button");
        pageLink.classList.add("page-link");
        pageLink.textContent = i;
        pageLink.setAttribute('data-page', i - 1);
        pageItem.appendChild(pageLink);
        pagination.appendChild(pageItem);

    }
    //改變活動狀態搜尋分頁
    pagination.addEventListener('click', async (event) => {
        let page = await event.target.getAttribute('data-page');
        await getAcByStatus(status, page);
    });
}


export { createDataTable, createPagination, createStatusPagination };