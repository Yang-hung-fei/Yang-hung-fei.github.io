import config from "../../../../ipconfig.js";

// localStorage.setItem("Authorization_M", "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxIiwiZXhwIjoxNjk0NjgwMzQ3fQ.zAe7mBf5Bcg00KiYAdKk05pmviYQSzh1Nh0S0PqtD1k");
// let token = localStorage.getItem("Authorization_M");
let token = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxIiwiZXhwIjoxNjk0NjgwMzQ3fQ.zAe7mBf5Bcg00KiYAdKk05pmviYQSzh1Nh0S0PqtD1k";

const mainUrl = config.url;
const picRoteUrl = "/manager/homepageManage";
const updatePicRoteUrl = mainUrl + picRoteUrl;
const getRotePicUrl = mainUrl + picRoteUrl;
const getAllRotePicUrl = mainUrl + picRoteUrl + "/getAllRotePic";

// ------------------------- 頁面載入  ------------------------- //
window.addEventListener('load', function () {
    getAllRotePic();
});


// ------------------------- 事件驅動  ------------------------- //

const editModal = document.getElementById('editRotePic');
editModal.addEventListener('show.bs.modal', async function (e) {
    //當使用者點擊按鈕
    let button = e.relatedTarget;
    let picNo = button.getAttribute('picNo');
    //fetch獲取資料
    let fetchData = await getRotePicDetails(picNo);
    document.getElementById('picNo').value = fetchData.picNo;
    document.getElementById('picLocateUrl').value = fetchData.picLocateUrl;
    document.getElementById('picRotStatus').value = fetchData.picRotStatus;
    document.getElementById('picRotStart').value = fetchData.picRotStart;
    document.getElementById('picRotEnd').value = fetchData.picRotEnd;

    /*
        // 定義函數格式化日期時間
        function formatDateTime(date) {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0'); // 月份從0開始，需要加1，並且補齊兩位
            const day = String(date.getDate()).padStart(2, '0');
            const hours = String(date.getHours()).padStart(2, '0');
            const minutes = String(date.getMinutes()).padStart(2, '0');
            const seconds = String(date.getSeconds()).padStart(2, '0');
    
            return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
        }
    
        // 使用 Date 對象將時間戳轉換為日期和時間
        let updateTime = new Date(fetchData.updateTime);
        document.getElementById('updateTime').value = formatDateTime(updateTime);
    
        console.log("fetchData.updateTime:", fetchData.updateTime);
        console.log("updateTime:", updateTime);
    */
    let status = document.getElementById('picRotStart');
    if (fetchData.picRotStart == 1) {
        status.value = "上架中";
    } else {
        status.value = "已下架";
    }

    document.getElementById('editForm').addEventListener('submit', async function (e) {
        e.preventDefault();
        let picNo = document.getElementById('picNo').value;
        let picLocateUrl = document.getElementById('picLocateUrl').value;

        let picRotStatus = document.getElementById('picRotStatus').value;
        let picRotStart = document.getElementById('picRotStart').value;
        let picRotEnd = document.getElementById('picRotEnd').value;


        // 圖片轉換成字串
        let pic = document.getElementById('pic').value;
        // 處理圖片轉換成字串
        let picInput = document.getElementById('pic');
        picInput.value = fetchData.pic;
        picInput.addEventListener('change', () => {
            pic = picInput.value;
        });

        // 處理時間格式
        //    let newUpdateTime = updateTime.toString().replace("T", " ");
        let updateData = {
            "picNo": picNo,
            "picLocateUrl": picLocateUrl,
            "picRotStatus": picRotStatus,
            "picRotStart": picRotStart,
            "picRotEnd": picRotEnd,
            "pic": null,
        };
        let updateResult = await updateRotePic(picNo, updateData);
        console.log(updateResult);

    });




    // 在需要關閉模態的地方，例如更新成功後
    if (updateResult != null) {
        //   editModal.;
    }
});






// ------------------------- 更新  ------------------------- //
async function updateRotePic(picNo, updateData) {

    return fetch(updateRotePicUrl + `/${picNo}`, {
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


// ------------------------- 查詢單一Rote pic  ------------------------- //
async function getOneRotePic(picNo) {
    return fetch(getRotePicUrl + `/${picNo}`, {
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



// ------------------------- 查詢all Rote pic  ------------------------- //
function getAllRotePic() {

    fetch(getAllRotePicUrl, {
        method: "GET",
        headers: {
            "Authorization_M": token
        }
    })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            let RotePicPageData = data.message;
            let pageData = {
                //目前所在頁數(預設為0)
                curentPage: RotePicPageData.currentPageNumber + 1,
                //一頁有幾筆資料
                pageSize: RotePicPageData.pageSize,
                totalPage: RotePicPageData.totalPage,
                fetchData: RotePicPageData,
            }
            return pageData;

        }).then(pageData => {
            //create table data and pagination
            createDataTable(pageData);
        })
    // .catch(err => {
    //     console.error(err.message);
    // });
}


// ------------------------- 建立分頁  ------------------------- //
// 更新資料表格和分頁
function createDataTable(data) {
    // // 選擇分頁元素
    let table = document.querySelector("#table");
    let tbody = document.getElementById("dataTableList");
    let pagination = document.querySelector(".pagination");
    console.log(pagination);
    // 清空tbody表格
    tbody.innerHTML = "";
    let dataList = '';
    let fetchData = data.fetchData;



    // 建立資料表格
    fetchData.forEach(dataDetails => {
        console.log(dataDetails.picNo);
        // 建立資料
        dataList += `
               <tr>
               <td>${dataDetails.picNo}</td>
               <td>${dataDetails.picLocateUrl}</td>
               <td>${dataDetails.picRotStatus}</td>
               <td>${dataDetails.picRotStart == 1 ? "上架中" : "已下架"}</td>
               <td>${dataDetails.updateTime}</td>

               <td><button class="btn btn-primary" type="button"
               style="background: #325aab;border-style: none;color: #f1ecd1; width: 60px; height: 30px; font-size: 14px;"
               onclick="editRotePicByPicNo(${dataDetails.picNo})">修改</button>
               </td>
               <td>
               <button class="btn btn-danger" type="button"
               style="background: #f44336; border-style: none; color: #ffffff; width: 60px; height: 30px; font-size: 14px;"
               onclick="deleteRotePicByPicNo(${dataDetails.picNo})">刪除</button>
               </td>
               
               
               </tr>`;

    });
    tbody.innerHTML = dataList;

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
