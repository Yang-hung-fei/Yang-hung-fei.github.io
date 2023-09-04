import config from "../../../../../ipconfig.js";
const hostUrl = config.url;
const AcUrl = "/manager/activity";
const activityId = "1";
const createAcUrl = hostUrl + AcUrl;
const updateAcUrl = hostUrl + AcUrl + "/" + activityId;
const cancelAcurl = hostUrl + AcUrl + "/cancel/" + activityId;
const getAcDetailsUrl = hostUrl + AcUrl + "/" + activityId;
const getAllAcUrl = hostUrl + AcUrl + "/all";
const activityManToken = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI0IiwiZXhwIjoxNjk0MDA2OTU2fQ.6mu7dwpu36S8JctWsYJpHxMrbHBGY4TGPND4EXH4098";


//建立活動



//取消活動


// function createAc(){
//     fetch(createAcUrl)
// }
//更新活動

//查詢活動列表

function getAllAc() {

    fetch(getAllAcUrl, {
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
                curentPage: activityPageData.currentPageNumber + 1,
                //一頁有幾筆資料
                pageSize: activityPageData.pageSize,
                totalPage: activityPageData.totalPage,
                fetchData: activityPageData.resList,
            }
            return pageData;

        }).then(pageData => {
            //create table data and pagination
            createDataTable(pageData);
        })
        .catch(err => {
            console.error(err.message);
        });
}

getAllAc();
//https://www.youtube.com/watch?v=oGzVgN70wg0&t=123s&ab_channel=SteveGriffith-Prof3ssorSt3v3
//查詢單一活動資訊




/************************ 建立分頁************************/

// 更新資料表格和分頁
function createDataTable(data) {
    // // 選擇分頁元素
    let table = document.querySelector("#table");
    let tbody = table.querySelector("tbody");
    let pagination = document.querySelector(".pagination");
    console.log(pagination);
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
               <td><a href="#editActivity" class="edit" data-bs-toggle="modal"><i class="bi bi-pencil-square"></i>
               </td>
               <td><a href="#cancelActivity" class="cancel" data-bs-toggle="modal"><i
                           class="bi bi-trash3-fill"></i>
               </td>
               <td><a href="#queryActivity" class="query" data-bs-toggle="modal"><i class="bi bi-eye-fill"></i>
               </td>
               </tr>`;

    });
    tbody.innerHTML = dataList;
    console.log(tbody);

    //建立分頁 -清空分頁
    pagination.innerHTML = "";
    // 總頁數
    let totalPages = data.totalPage;
    let currentPage = data.curentPage;

    // 創建分頁頁碼
    for (let i = 1; i <= totalPages; i++) {
        const pageItem = document.createElement("li");
        pageItem.classList.add("page-item");
        if (i === currentPage) {
            pageItem.classList.add("active");
        }
        const pageLink = document.createElement("a");
        pageLink.classList.add("page-link");
        pageLink.href = `${i}`;
        pageLink.textContent = i;
        pageItem.appendChild(pageLink);
        pagination.appendChild(pageItem);
    }

}
/************************ 建立分頁************************/
