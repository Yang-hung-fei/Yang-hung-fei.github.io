import { searchActivity } from "./callApi.js";
// ------------------------- 建立活動清單  ------------------------- //

async function createList(data) {
    let active = document.querySelector("#activityList");
    active.innerHTML = "";
    let dataList = '';
    let fetchData = await data.fetchData;
    // 建立資料表格
    if (fetchData.length !== 0) {
        fetchData.forEach(dataDetails => {
            // 建立資料
            dataList += `
            <div class="card mt-2">
            <div class="row g-0">
                <!--card內容-->
                <div class="col-md-5">
                    <img src="../Activity/img/activity.jpeg" class="card-img img-fluid rounded-start">
                </div>
                <div class="col-md-7 card-body d-flex flex-column">
                    <div class="h-100">
                        <h5 class="card-title">${dataDetails.title}</h5>
                        <p class="card-text text-truncate ">
                        ${dataDetails.content}
                        </p>
                        <p class="card-text text-end">
                            <strong>活動狀態: ${dataDetails.status == 0 ? "執行中" : "已取消"}</strong>
                            <strong>活動時間: ${dataDetails.activityTime}</strong>
                        </p>
                        <p class="card-text  text-end">
                            <a href="#" data-id="${dataDetails.activityId}" id="checkDetails" class="btn btn-primary">查看活動資訊</a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
            `;

        });
    } else {
        dataList = `
        <div class="row">
            <div class="card mt-2 text-center">
                <!--card內容-->
                <div class="col-md-12 card-body">
                   
                        <h3 class="card-title">沒有此筆資料</h3>
                        <p class="card-text">
                            <strong>請重新輸入搜尋內容</strong>
                        </p>
                   
                </div>
            </div>
        </div>
            `;
    }
    active.innerHTML = dataList;
    // d-flex flex-column
}
// ------------------------- 建立活動分頁  ------------------------- //
async function createPagination(data) {
    let pagination = document.querySelector(".pagination");
    console.log(pagination);
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
// ------------------------- 建立熱門活動  ------------------------- //
async function createHotList(data) {
    let hotActive = document.querySelector("#hotActivities");
    hotActive.innerHTML = "";
    let dataList = '';
    let fetchData = await data.message;
    let circleNum = 1;
    // 建立資料表格
    if (fetchData !== undefined) {
        fetchData.forEach(dataDetails => {
            // 建立資料
            dataList += `
            <a href="#" class="list-group-item list-group-item-action" data-id="${dataDetails.activityId}" id="checkHot">
                <div class="d-flex w-100 justify-content-between">
                        <h5> <i class="bi bi-${circleNum}-circle"></i>   ${dataDetails.title}</h5>
                        <small>活動日期 ${dataDetails.activityTime}</small>
                 </div>
            </a>
            `;
            circleNum++;
        });
        hotActive.innerHTML = dataList;
    }


}


// ------------------------- 建立活動關鍵字搜尋  ------------------------- //
// list 和 page都不一樣
async function createSearchPagination(searchContent, data) {
    let hotPagination = document.querySelector('#hotPagination');
    //建立分頁 -清空分頁
    hotPagination.innerHTML = "";

    let pagination = document.createElement("ul");
    pagination.classList.add('pagination');
    pagination.classList.add('justify-content-center');
    hotPagination.append(pagination);
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
    //改變關鍵字搜尋分頁
    pagination.addEventListener('click', async (event) => {
        let page = await event.target.getAttribute('data-page');
        await searchActivity(searchContent, page);
    });
}





export { createList, createPagination, createHotList, createSearchPagination };
// //查詢單一活動資訊監聽
// const queryAcs = document.querySelectorAll('#queryBtn');
// queryAcs.forEach((queryAc) => {
//     queryAc.addEventListener('click', async function (e) {
//         // 使用 dataset 屬性獲取 data-id 的值
//         let dataId = this.dataset.id;
//         //fetch獲取資料
//         await showViewModal(dataId);

//     });
// });