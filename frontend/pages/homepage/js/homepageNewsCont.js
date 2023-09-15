import config from '../../../../ipconfig.js';

const hostUrl = config.url;
const homepageUrl = "/customer/homePage";


async function onLoad() {

    const urlParams = new URL(document.location).searchParams;
    const newsNo = urlParams.get('newsNo');
    let fetchData = await getNewsCont(newsNo);
    let data = fetchData.message;
    document.getElementById('newsContent').innerHTML = ""; 
    let dataList = ` 

        <p>${data.newsTitle}</p>
        <p>${dateConvert(data.updateTime)}</p>
        <p>${data.newsCont}</p>
        `;
    document.getElementById('newsContent').innerHTML = dataList;

}
function dateConvert(timestamp) {
    // 使用Date物件來轉換timestamp為日期
    const date = new Date(timestamp);

    // 使用Date物件的方法取得年、月和日
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // 月份是從0開始計算的，所以要加1
    const day = String(date.getDate()).padStart(2, '0');

    // 將年、月、日組合成格式化的日期字串
    const formattedDate = `${year}-${month}-${day}`

    return formattedDate;


}
// ------------------------- 頁面載入  ------------------------- //
window.addEventListener('DOMContentLoaded', onLoad);


// get newsCont
async function getNewsCont(newsNo) {
    let params = new URLSearchParams({
        newsNo: newsNo
    });
    return fetch(hostUrl + homepageUrl + "/getOneNews?" + params.toString(), {
        method: "GET",
        headers: {

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