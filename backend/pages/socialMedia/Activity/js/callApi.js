import config from "../../../../../ipconfig.js";
import { createDataTable, createStatusPagination, createPagination } from "./pageRender.js"
const hostUrl = config.url;
const AcUrl = "/manager/activity";
const createAcUrl = hostUrl + AcUrl;
const updateAcUrl = hostUrl + AcUrl;
const cancelAcurl = hostUrl + AcUrl + "/cancel";
const getAcDetailsUrl = hostUrl + AcUrl;
const getAllAcUrl = hostUrl + AcUrl + "/all";
const getAcByStatusUrl = hostUrl + AcUrl + "/status"
const activityManToken = localStorage.getItem("Authorization_M");

// ------------------------- 建立活動  ------------------------- //
async function createAc(postData) {
    return fetch(createAcUrl, {
        method: "POST",
        headers: {
            Authorization_M: activityManToken,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(postData),
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


// ------------------------- 取消活動  ------------------------- //
async function cancelAc(activityId) {
    return fetch(cancelAcurl + `/${activityId}`, {
        method: "PUT",
        headers: {
            Authorization_M: activityManToken,
            "Content-Type": "application/json",
        },
    })
        .then(res => {
            return res.json();
        }).then(data => {
            return data;
        })
        .catch(err => {
            console.log(err.message);
        });
}



// ------------------------- 更新活動  ------------------------- //
async function updateAc(activityId, updateData) {

    return fetch(updateAcUrl + `/${activityId}`, {
        method: "PUT",
        headers: {
            Authorization_M: activityManToken,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData)
    })
        .then(res => {
            return res.json();
        }).then(data => {
            return data;
        })
        .catch(err => {
            console.log(err.message);
        });
}

// ------------------------- 查詢單一活動  ------------------------- //
async function getAcDetails(activityId) {
    return fetch(getAcDetailsUrl + `/${activityId}`, {
        method: "GET",
        headers: {
            Authorization_M: activityManToken,
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



// ------------------------- 查詢活動  ------------------------- //
async function getAllAc(page) {
    let params = new URLSearchParams({
        page: page
    });
    let newUrl = `${page == undefined || null ? getAllAcUrl : getAllAcUrl + '?' + params.toString()}`;
    return fetch(newUrl, {
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
                curentPage: activityPageData.currentPageNumber,
                //一頁有幾筆資料
                pageSize: activityPageData.pageSize,
                totalPage: activityPageData.totalPage,
                fetchData: activityPageData.resList,
            }
            return pageData;

        }).then(pageData => {
            //create table data and pagination
            createDataTable(pageData);
            createPagination(pageData);
            return pageData;
        })
        .catch(err => {
            console.error(err.message);
        });
}

// ------------------------- 查詢活動狀態  ------------------------- //
async function getAcByStatus(status, page) {
    let statusParams = new URLSearchParams({
        status: status
    });
    let params = new URLSearchParams({
        page: page,
        status: status
    });
    let newUrl = `${page == undefined || null ? getAcByStatusUrl + '?' + statusParams.toString() : getAcByStatusUrl + '?' + params.toString()}`;
    return fetch(newUrl, {
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
                curentPage: activityPageData.currentPageNumber,
                //一頁有幾筆資料
                pageSize: activityPageData.pageSize,
                totalPage: activityPageData.totalPage,
                fetchData: activityPageData.resList,
            }
            return pageData;

        }).then(pageData => {
            //create table data and pagination
            createDataTable(pageData);
            createStatusPagination(status, pageData);
        })
        .catch(err => {
            console.error(err.message);
        });
}

export { createAc, cancelAc, updateAc, getAcDetails, getAllAc, getAcByStatus };

