import { showEditModal } from "./editModal.js";
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
            // 建立資料
            dataList += `
               <tr>
               <td>${dataDetails.activityId}</td>
               <td>${dataDetails.title}</td>
               <td>${dataDetails.content}</td>
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
               <td><button class="queryBtn" id="queryBtn" data-id="${dataDetails.activityId}"><i class="bi bi-eye-fill"></i></button>
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
            console.log("show your modal");
            await showEditModal(dataId);

        });
    })
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


export { createDataTable, createPagination };