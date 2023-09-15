import config from '../../../../ipconfig.js';

const hostUrl = config.url;
const homepageManageUrl = "/manager/homepageManage";
const token = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxIiwiZXhwIjoxNjk0OTM3MDY0fQ.gvRrlefI0HBr9nnjzkG9cTbqG6CmjbWBqCXNFgrIiiY";


async function onLoad() {

    const urlParams = new URL(document.location).searchParams;
    const newsNo = urlParams.get('newsNo');
    let fetchData = await getNewsCont(newsNo);
    let data = fetchData.message;
    document.getElementById('newsContent').innerHTML = "";
    let dataList = ` 
     
        <p>${data.newsTitle}</p>
        <p>${data.updateTime}</p>
        <p>${data.newsCont}</p>
        `;
    document.getElementById('newsContent').innerHTML = dataList;

}

// ------------------------- 頁面載入  ------------------------- //
window.addEventListener('DOMContentLoaded', onLoad);


// get newsCont
async function getNewsCont(newsNo) {
    let params = new URLSearchParams({
        newsNo: newsNo
    });
    return fetch(hostUrl + homepageManageUrl + "/getOneNews?" + params.toString(), {
        method: "GET",
        headers: {
            Authorization_M: token,
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