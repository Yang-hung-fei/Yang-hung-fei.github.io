import config from "../../../../../ipconfig.js";
const hostUrl = config.url;
const postReportUrl = hostUrl + "/manager/social/report";
const managerToken = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIzIiwiZXhwIjoxNjk0NDEwMjMyfQ.VY0ctjroAS7CBFnoM_pXurVmU1S6yUV2GW81iAK1MBY";


// get all post report lists
async function getAllPostReport(page, status) {
    let newUrl;
    if ((page && status) === undefined) {
        newUrl = postReportUrl + "/posts";

    } else if (page === undefined && status !== undefined) {
        let params = new URLSearchParams({
            status: status
        });
        newUrl = `${postReportUrl + "/posts" + params.toString()}`;

    } else if (page !== undefined && status === undefined) {
        let params = new URLSearchParams({
            page: page
        });
        newUrl = `${postReportUrl + "/posts" + params.toString()}`;
    }

    return fetch(newUrl, {
        method: "GET",
        headers: {
            Authorization_M: managerToken,
            "Content-Type": "application/json"
        },
    })
        .then(res => {
            return res.json();
        }).then(data => {
            let resultData = data.message;
            let pageData = {
                //目前所在頁數(預設為0)
                curentPage: resultData.currentPageNumber,
                //一頁有幾筆資料
                pageSize: resultData.pageSize,
                totalPage: resultData.totalPage,
                fetchData: resultData.resList,
            }
            return pageData;
        }).then(pageData => {
            //create table data and pagination
            // createList(pageData);
            // createPagination(pageData);
            return pageData;
        })
        .catch(err => {
            console.error(err.message);
        });
}


export { getAllPostReport };