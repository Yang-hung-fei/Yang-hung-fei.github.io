import config from '../../../../../ipconfig.js';
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
            //建立分頁
            let totalPage = activityPageData.totalPage;
            //一頁有幾筆資料
            let pageSize = activityPageData.pageSize;
            //目前所在頁數(預設為0)
            let curentPage = activityPageData.currentPageNumber + 1;
            let acitivityData = activityPageData.resList;

        })
        .catch(err => {
            console.error(err.message);
        })
}

getAllAc();
//https://www.youtube.com/watch?v=oGzVgN70wg0&t=123s&ab_channel=SteveGriffith-Prof3ssorSt3v3
//查詢單一活動資訊



// query string 
/************************ 建立分頁************************/
const pageData = {
    curentPage: 1,
    pageSize: 10,
    totalPage: 2,
    fetchData: []
}


// 選擇分頁元素
const tbody = document.querySelector("tbody");
const pagination = document.getElementById("pagination");

// 更新資料表格和分頁
function createDataTable(data) {
    // 清空tbody表格
    tbody.innerHTML = "";
    let fetchData = data.fetchData;
    // 建立資料表格
    for (let i = 0; i < fetchData.length; i++) {
        //拿到Fetch資料
        let dataDetails = fetchData[i];
        // 建立資料清單列
        let row = document.createElement("tr");
        // 建立資料
        row.innerHTML = 
        tbody.appendChild("");

        // <td>活動Id</td>
        // <td>活動主題</td>
        // <td>活動內容</td>
        // <td>活動時間</td>
        // <td>活動限制人數</td>
        // <td>目前報名人數</td>
        // <td>報名開始時間</td>
        // <td>報名結束時間</td>
        // <td>活動狀態</td>
        // <td><a href="#editActivity" class="edit" data-bs-toggle="modal"><i class="bi bi-pencil-square"></i>
        // </td>
        // <td><a href="#cancelActivity" class="cancel" data-bs-toggle="modal"><i
        //             class="bi bi-trash3-fill"></i>
        // </td>
        // <td><a href="#queryActivity" class="query" data-bs-toggle="modal"><i class="bi bi-eye-fill"></i>
        // </td>


        tbody.appendChild(row);
    }

    // 清空分頁控制
    pagination.innerHTML = "";

    // 計算總頁數
    const totalPages = Math.ceil(data.length / itemsPerPage);

    // 創建分頁頁碼
    for (let i = 1; i <= totalPages; i++) {
        const pageItem = document.createElement("li");
        pageItem.classList.add("page-item");
        if (i === currentPage) {
            pageItem.classList.add("active");
        }
        const pageLink = document.createElement("a");
        pageLink.classList.add("page-link");
        pageLink.href = "#";
        pageLink.textContent = i;
        pageLink.addEventListener("click", () => {
            currentPage = i;
            updateTable();
        });
        pageItem.appendChild(pageLink);
        pagination.appendChild(pageItem);
    }
}

// 初始化頁面
updateTable();

/************************ 建立分頁************************/