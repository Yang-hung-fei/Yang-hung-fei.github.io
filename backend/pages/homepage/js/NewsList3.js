import config from "../../../../../ipconfig.js";

localStorage.setItem("Authorization_M", "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxIiwiZXhwIjoxNjk0MTkzMjY3fQ.SzSM7havg7wzQTzchWnxWWSQd46CMoPskSWhPXdLjaw");
let token = localStorage.getItem("Authorization_M");

const mainUrl = config.url;
const newsUrl = "/manager/homepageManage";
const updateNewsUrl = mainUrl + newsUrl;
const getNewsDetailsUrl = mainUrl + newsUrl;
const getAllNewsUrl = mainUrl + newsUrl + "/getAllNews";

// ------------------------- 頁面載入  ------------------------- //
window.addEventListener('load', function () {
    getAllNews();
});


// ------------------------- 事件驅動  ------------------------- //

const editModal = document.getElementById('editNews');
editModal.addEventListener('show.bs.modal', async function (e) {
    //當使用者點擊按鈕
    let button = e.relatedTarget;
    let newsNo = button.getAttribute('newsNo');
    //fetch獲取資料
    let fetchData = await getNewsDetails(newsNo);
    document.getElementById('newsNo').value = fetchData.newsNo;
    document.getElementById('newsTitle').value = fetchData.newsTitle;
    document.getElementById('newsCont').value = fetchData.newsCont;
    document.getElementById('newsStatus').value = fetchData.newsStatus;
    document.getElementById('updateTime').value = fetchData.updateTime;

    let status = document.getElementById('newsStatus');
    if (fetchData.newsStatus == 1) {
        status.value = "上架中";
    } else {
        status.value = "已下架"
    }

    document.getElementById('editForm').addEventListener('submit', async function (e) {
        e.preventDefault();
        let newsNo = document.getElementById('newsNo').value;
        let newsTitle = document.getElementById('newsTitle').value;
        let newsCont = document.getElementById('newsCont').value;
        let newsStatus = document.getElementById('newsStatus').value;
        let updateTime = document.getElementById('updateTime').value;

        //處理圖片轉換成字串
     //   let newsPic = document.getElementById('newsPic').value;

        let updateData = {
            "newsNo": newsNo,
            "newsTitle": newsTitle,
            "newsCont": newsCont,
            "newsStatus": newsStatus,
            "updateTime": updateTime + ":00",
            "newsPic": null,

        };
        let updateResult = await updateNews(newsNo, updateData);
        console.log(updateResult);

        // 在需要關閉模態的地方，例如更新成功後
        if (updateResult != null) {
            //   editModal.;
        }
    });
});





// ------------------------- 更新  ------------------------- //
async function updateNews(newsNo, updateData) {

    return fetch(updateNewsUrl + `/${newsNo}`, {
        method: "PUT",
        headers: {
            Authorization_M: token,
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


// ------------------------- 查詢單一news  ------------------------- //
async function getOneNews(newsNo) {
    return fetch(getNewsDetailsUrl + `/${newsNo}`, {
        method: "GET",
        headers: {
            "Authorization_M": token,
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



// ------------------------- 查詢all news  ------------------------- //
function getAllNews() {

    fetch(getAllNewsUrl, {
        method: "GET",
        headers: {
            "Authorization_M": token,
            "Content-Type": "application/json"
        },
    })
        .then(res => {
            return res.json();
        }).then(data => {
            let newsPageData = data.message;
            let pageData = {
                //目前所在頁數(預設為0)
                curentPage: newsPageData.currentPageNumber + 1,
                //一頁有幾筆資料
                pageSize: newsPageData.pageSize,
                totalPage: newsPageData.totalPage,
                fetchData: newsPageData.resList,
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


// ------------------------- 建立分頁  ------------------------- //
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
               <td>${dataDetails.newsNo}</td>
               <td>${dataDetails.newsTitle}</td>
               <td>${dataDetails.newsCont}</td>
               <td>${dataDetails.newsStatus == 1 ? "執行中" : "已取消"}</td>
               <td>${dataDetails.updateTime}</td>

               <td><button class="btn btn-primary" type="button"
               style="background: #6b8df3;border-style: none;color: #f1ecd1; width: 60px; height: 30px; font-size: 14px;"
               onclick="editNewsByNewsNo(${news.newsNo})">修改</button>
               </td>
               <td>
               <button class="btn btn-danger" type="button"
               style="background: #f44336; border-style: none; color: #ffffff; width: 60px; height: 30px; font-size: 14px;"
               onclick="deleteNewsByNewsNo(${news.newsNo})">刪除</button>
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
