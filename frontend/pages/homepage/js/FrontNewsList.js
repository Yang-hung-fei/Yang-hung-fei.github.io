import config from '../../../../ipconfig.js';

const homepageUrl = config.url;
const userToken = "";

// ------------------------- 頁面載入  ------------------------- //
window.addEventListener('load', function () {
    getNews();
});

const editModal = document.getElementById('getNews');
editModal.addEventListener('show.bs.modal', async function (e) {

    const newsNo = e.relatedTarget.dataset.newsNo;

let fetchData = await getNewsDetails(newsNo);
    document.getElementById('newsNo').value = fetchData.newsNo;
    document.getElementById('newsTitle').value = fetchData.newsTitle;
    document.getElementById('newsCont').value = fetchData.newsCont;
    document.getElementById('newsStatus').value = fetchData.newsStatus;


// get news
async function getNews() {
    return fetch(homepageUrl + "", {
        method: "GET",
        headers: {
            "Authorization": userToken,
            "Content-Type": "application/json"
        },
    })
        .then(res => {
            return res.json();
        }).then(data => {
            console.log(data);
            if (data && data.newsStatus === 1) {
                // 如果newsStatus === 1，則取回
                return data;
            } else {
                // 如果newsStatus不等於1，返回null
                return null;
            }
        }).then(data => {
            createDataTable(data);
        })
/*
        .catch(err => {
            console.error(err.message);
        });
        */
}

// ------------------------- 建立分頁  ------------------------- //
// 更新資料表格和分頁
function createDataTable(data) {
    // // 選擇分頁元素
    let table = document.querySelector("#table");
    let tbody = document.getElementById("dataTableList");
   
    // 清空tbody表格
    tbody.innerHTML = "";
    let dataList = '';
    let fetchData = data.fetchData;



    // 建立資料表格
    fetchData.forEach(dataDetails => {
        console.log(dataDetails.newsNo);
        // 建立資料
        dataList += `
               <tr>
               <td>${dataDetails.newsTitle}</td>
               <td>${dataDetails.updateTime}</td>
               </tr>`;

    });
    tbody.innerHTML = dataList;
}

});

// get newsCont
async function getNewsCont(newsNo) {

    return fetch(homepageUrl + `/${newsNo}`, {
        method: "GET",
        headers: {
            "Authorization": userToken,
            "Content-Type": "application/json"
        },
    })
        .then(res => {
            return res.json();
        }).then(data => {
            return data;
        })
        .catch(err => {
            console.error(err.message);
        });
}



export { getNews, getNewsCont };