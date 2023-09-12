import config from '../../../../ipconfig.js';

const homepageUrl = config.url;
const token = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxIiwiZXhwIjoxNjk0NjgwMzQ3fQ.zAe7mBf5Bcg00KiYAdKk05pmviYQSzh1Nh0S0PqtD1k";

// ------------------------- 頁面載入  ------------------------- //
window.addEventListener('load', function () {
    getNews();
});

// const editModal = document.getElementById('getNews');
// editModal.addEventListener('show.bs.modal', async function (e) {

//     const newsNo = e.relatedTarget.dataset.newsNo;

//     let fetchData = await getNewsDetails(newsNo);
//     document.getElementById('newsNo').value = fetchData.newsNo;
//     document.getElementById('newsTitle').value = fetchData.newsTitle;
//     document.getElementById('newsCont').value = fetchData.newsCont;
//     document.getElementById('newsStatus').value = fetchData.newsStatus;

// })


// ------------------------- 建立分頁  ------------------------- //
// 更新資料表格和分頁
function createDataTable(data) {
    // // 選擇分頁元素
    let table = document.querySelector("#table");
    let tbody = document.getElementById("dataTableList");

    // 清空tbody表格
    tbody.innerHTML = "";
    let dataList = '';
    let fetchData = data;



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
    console.log(dataList);
    tbody.innerHTML = dataList;
}



// get newsCont
async function getNewsCont(newsNo) {

    return fetch(homepageUrl + `/${newsNo}`, {
        method: "GET",
        headers: {
            "Authorization": token,
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

async function getNews() {
    return fetch(homepageUrl + "", {
        method: "GET",
        headers: {
            "Authorization": token,
            "Content-Type": "application/json"
        },
    })
        .then(res => {
            return res.json();
        }).then(data => {
            console.log(data.message);
            let dataList = [];
            let data = data.message;
            data.forEach((e) => {
                if (e.newsStatus === 1) {
                    dataList.push(e);
                }
            });
            console.log(dataList);
            return dataList;
        }).then(data => {
            createDataTable(data);
        });
}


export { getNews, getNewsCont };