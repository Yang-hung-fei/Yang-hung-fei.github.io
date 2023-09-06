import config from "../../../../../ipconfig.js";
const hostUrl = config.url;
const AcUrl = "/manager/activity";
const createAcUrl = hostUrl + AcUrl;
const updateAcUrl = hostUrl + AcUrl;
const cancelAcurl = hostUrl + AcUrl + "/cancel";
const getAcDetailsUrl = hostUrl + AcUrl;
const getAllAcUrl = hostUrl + AcUrl + "/all";
const activityManToken = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI0IiwiZXhwIjoxNjk0MzY5OTU0fQ.Rhi4c1HV8uIB5w_nCajIFnrn8EdBfUOeR5UwlGB3N0U";
// ------------------------- 頁面載入  ------------------------- //
window.addEventListener('load', function () {
    getAllAc();
});
// ------------------------- crud api  ------------------------- //
// createAc();
// cancelAc();
// updateAc();
// getAcDetails();
// getAllAc();

// ------------------------- 事件驅動  ------------------------- //
//改變分頁
const pagination = document.querySelector(".pagination");
pagination.addEventListener('click', async (event) => {
    let page = await event.target.getAttribute('data-page');
    await getAllAc(page);
})

//修改活動
const editModal = document.getElementById('editActivity');
editModal.addEventListener('show.bs.modal', async function (e) {
    //當使用者點擊按鈕
    let button = e.relatedTarget;
    let activityId = button.getAttribute('data-id');
    //fetch獲取資料
    let fetchData = await getAcDetails(activityId);
    document.getElementById('title').value = fetchData.title;
    document.getElementById('activityTime').value = fetchData.activityTime;
    document.getElementById('activityImg').value = fetchData.activityPicture;
    document.getElementById('activityContent').value = fetchData.content;
    document.getElementById('startTime').value = fetchData.startTime;
    document.getElementById('endTime').value = fetchData.endTime;
    document.getElementById('peopleCount').value = fetchData.peopleCount;
    document.getElementById('enterLimit').value = fetchData.enrollLimit;
    let status = document.getElementById('status');
    if (fetchData.status == 0) {
        status.value = "執行中";
    } else {
        status.value = "已取消"
    }
});

// document.getElementById('editForm').
editModal.addEventListener('submit', async function (e) {
    let button = e.target;
    console.log(button);
    let activityId = button.getAttribute('data-id');
    e.preventDefault();
    // let activityId = document.getElementById('activityId').value;
    let title = document.getElementById('title').value;
    let activityTime = document.getElementById('activityTime').value;
    let activityContent = document.getElementById('activityContent').value;
    let startTime = document.getElementById('startTime').value;
    let endTime = document.getElementById('endTime').value;
    let enrollLimit = document.getElementById('enterLimit').value;
    //處理圖片轉換成字串
    let activityImg = document.getElementById('activityImg').value;
    // 處理時間格式
    let newAcTime = activityTime.toString().replace("T", " ");
    let updateData = {
        "title": title,
        "content": activityContent,
        "startTime": startTime.toString(),
        "endTime": endTime.toString(),
        "activityTime": newAcTime + ":00",
        "activityPicture": null,
        "enrollLimit": enrollLimit
    };
    let updateResult = await updateAc(activityId, updateData);
    console.log(updateResult);
    if (updateResult != null) {
        //關閉modal
        editModal.classList.remove('show');
        editModal.
            editModal.addEventListener('show.bs.modal')
        // editModal.style.display = 'none';

        // let modalBackdrop = document.querySelector('.modal-backdrop');
        // if (modalBackdrop) {
        //     modalBackdrop.parentNode.removeChild(modalBackdrop);
        // }
    }
});


editModal.addEventListener('hide.bs.modal', async function (e) {
    //當使用者點擊按鈕
    let button = e.relatedTarget;
    let activityId = button.getAttribute('data-id');
    console.log(activityId);

})



// editModal.hidden = true;
// // editModal.style.display = 'none';
// // 移除body上的modal-open類別
// document.body.classList.remove('modal-open');
// // 移除帶有modal - backdrop類別的元素
// let modalBackdrop = document.querySelector('.modal-backdrop');
// if (modalBackdrop) {
//     // modalBackdrop.style.display = 'none';
//     console.log(modalBackdrop.checkVisibility());
//     // console.log(modalBackdrop.getAttribute('class'));
//     // modalBackdrop.setAttribute('class', 'modal fade');
// }


// editModal.getAttribute('class');
// editModal.setAttribute('class', 'modal fade');


// const addModal = document.getElementById('addActivity');





// ------------------------- 建立活動  ------------------------- //
function createAc() {
    let postData = {
        "title": "活動建立測試",
        "content": "測試第28次",
        "startTime": "2023-08-29",
        "endTime": "2023-09-19",
        "activityTime": "2023-09-12 09:30:00",
        "enrollLimit": 40
    };

    fetch(createAcUrl, {
        method: "POST",
        headers: {
            Authorization_M: activityManToken,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(postData),
    })
        .then(res => {
            return res.json();
        }).then(data => {
            console.log(data.message);
        })
        .catch(err => {
            console.error(err.message);
        });
}


// ------------------------- 取消活動  ------------------------- //
function cancelAc() {
    let activityId = 28;
    fetch(cancelAcurl + `/${activityId}`, {
        method: "PUT",
        headers: {
            Authorization_M: activityManToken,
            "Content-Type": "application/json",
        },
    })
        .then(res => {
            return res.json();
        }).then(data => {
            return data.message;
        })
        .catch(err => {
            console.log(err.message);
        });
}



// ------------------------- 更新活動  ------------------------- //
async function updateAc(activityId, updateData) {

    return fetch(updateAcUrl + `/${activityId}`, {
        method: "PUT",
        headers: {
            Authorization_M: activityManToken,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData)
    })
        .then(res => {
            return res.json();
        }).then(data => {
            return data.message;
        })
        .catch(err => {
            console.log(err.message);
        });
}

// ------------------------- 查詢單一活動  ------------------------- //
async function getAcDetails(activityId) {
    return fetch(getAcDetailsUrl + `/${activityId}`, {
        method: "GET",
        headers: {
            Authorization_M: activityManToken,
            "Content-Type": "application/json"
        },
    })
        .then(res => {
            return res.json();
        }).then(data => {
            return data.message;
        })
        .catch(err => {
            console.error(err.message);
        });
}



// ------------------------- 查詢活動  ------------------------- //
async function getAllAc(page) {
    let params = new URLSearchParams({
        page: page
    });
    let newUrl = `${page === undefined ? getAllAcUrl : getAllAcUrl + '?' + params.toString()}`;

    console.log(newUrl);
    return fetch(newUrl, {
        method: "GET",
        headers: {
            Authorization_M: activityManToken,
            "Content-Type": "application/json"
        },
    })
        .then(res => {
            return res.json();
        }).then(data => {
            let activityPageData = data.message;
            let pageData = {
                //目前所在頁數(預設為0)
                curentPage: activityPageData.currentPageNumber,
                //一頁有幾筆資料
                pageSize: activityPageData.pageSize,
                totalPage: activityPageData.totalPage,
                fetchData: activityPageData.resList,
            }
            return pageData;

        }).then(pageData => {
            //create table data and pagination
            createDataTable(pageData);
            createPagination(pageData);
        })
        .catch(err => {
            console.error(err.message);
        });
}




// ------------------------- 建立分頁  ------------------------- //
// 更新資料表格和分頁
function createDataTable(data) {
    // // 選擇分頁元素
    let table = document.querySelector("#table");
    let tbody = table.querySelector("tbody");
    // 清空tbody表格
    tbody.innerHTML = "";
    let dataList = '';
    let fetchData = data.fetchData;
    // 建立資料表格
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
               <td><a href="#editActivity" class="edit" data-bs-toggle="modal" data-id="${dataDetails.activityId}"><i class="bi bi-pencil-square"></i>
               </td>
               <td><a href="#cancelActivity" class="cancel" data-bs-toggle="modal" data-id="${dataDetails.activityId}"><i
                           class="bi bi-trash3-fill"></i>
               </td>
               <td><a href="#queryActivity" class="query" data-bs-toggle="modal" data-id="${dataDetails.activityId}"><i class="bi bi-eye-fill"></i>
               </td>
               </tr>`;

    });
    tbody.innerHTML = dataList;
}

function createPagination(data) {
    let pagination = document.querySelector(".pagination");
    //建立分頁 -清空分頁
    pagination.innerHTML = "";
    // 總頁數
    let totalPages = data.totalPage;
    //預設為1
    let currentPage = data.curentPage;

    // 創建分頁頁碼
    for (let i = 1; i <= totalPages; i++) {
        const pageItem = document.createElement("li");
        pageItem.classList.add("page-item");
        if (i === currentPage + 1) {
            pageItem.classList.add("active");
        }
        const pageLink = document.createElement("a");
        pageLink.classList.add("page-link");
        pageLink.href = "#";
        pageLink.textContent = i;
        pageLink.setAttribute('data-page', i - 1);
        pageItem.appendChild(pageLink);
        pagination.appendChild(pageItem);

    }
}


// ------------------------- 改變分頁  ------------------------- //
//https://www.youtube.com/watch?v=oGzVgN70wg0&t=123s
//https://www.youtube.com/watch?v=v9zewquUR_0
//https://www.youtube.com/watch?v=EaRrmOtPYTM&list=PLyuRouwmQCjnEupVi5lpP6VrLg-eO-Zcp
//https://www.youtube.com/watch?v=ccX3ApO4qz8&t=1400s
//https://openhome.cc/zh-tw/javascript/script/module/
//page
//https://github.com/saam-khatri/Dynamic-pagination/blob/main/js/main.js
//https://www.youtube.com/watch?v=Q3bu6nlcSZQ
