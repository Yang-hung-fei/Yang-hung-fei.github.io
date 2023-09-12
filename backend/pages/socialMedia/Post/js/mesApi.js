import config from "../../../../../ipconfig.js";
const hostUrl = config.url;
const messageReportUrl = hostUrl + "/manager/social/report";
const managerToken = ""
// get all activities
async function getAllActivities(page) {
    let params = new URLSearchParams({
        page: page
    });
    let newUrl = `${(page === undefined || null) ? acUrl + "/all" : acUrl + '/all?' + params.toString()}`;
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
            createList(pageData);
            createPagination(pageData);
            return pageData;
        })
        .catch(err => {
            console.error(err.message);
        });
}