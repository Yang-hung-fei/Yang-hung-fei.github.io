import { createList, createPagination, createHotList, createSearchPagination } from './pageRender.js';
import config from '../../../../../ipconfig.js';
const hostUrl = config.url;
const acUrl = hostUrl + "/user/activity";
const userToken = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI0IiwiZXhwIjoxNjk0NjMwNjMwfQ.n7GVmpW_Bp7lv0ymXgu6DYOrNEV26JbidvipXJTabbA";

// get hot activities
async function getHotActivities() {
    return fetch(acUrl + "/hot", {
        method: "GET",
        headers: {
            Authorization_U: userToken,
            "Content-Type": "application/json"
        },
    })
        .then(res => {
            return res.json();
        }).then(data => {
            createHotList(data)
            return data;
        })
        .catch(err => {
            console.error(err.message);
        });
}


// get all activities
async function getAllActivities(page) {
    let params = new URLSearchParams({
        page: page
    });
    let newUrl = `${(page === undefined || null) ? acUrl + "/all" : acUrl + '/all?' + params.toString()}`;
    return fetch(newUrl, {
        method: "GET",
        headers: {
            Authorization_U: userToken,
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
// keywoard search
async function searchActivity(activityContent, page) {
    let params
    if (page === undefined) {
        params = new URLSearchParams({
            activityContent: activityContent
        });
    } else {
        params = new URLSearchParams({
            activityContent: activityContent,
            page: page
        });
    }
    return fetch(acUrl + "/search?" + params.toString(), {
        method: "GET",
        headers: {
            Authorization_U: userToken,
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
            //不一樣的pagination
            createSearchPagination(activityContent, pageData);
            return pageData;
        })
        .catch(err => {
            console.error(err.message);
        });
}

// get activity details
async function getActivityDetails(activityId) {

    return fetch(acUrl + `/${activityId}`, {
        method: "GET",
        headers: {
            Authorization_U: userToken,
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

// join activity
async function joinActivity(joinReq) {

    return fetch(acUrl + "/join", {
        method: "POST",
        headers: {
            Authorization_U: userToken,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(joinReq)
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

// leave activity
async function leaveActivity(joinReq) {

    return fetch(acUrl + "/leave", {
        method: "PUT",
        headers: {
            Authorization_U: userToken,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(joinReq)
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

// get Join Details
async function getUerJoinDetails(page) {
    let params = new URLSearchParams({
        page: page
    });
    let joinUrl = page === undefined ? acUrl + "/joinList" : acUrl + "/joinList?" + params.toString();
    return fetch(joinUrl, {
        method: "GET",
        headers: {
            Authorization_U: userToken,
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

export { getHotActivities, searchActivity, getActivityDetails, joinActivity, leaveActivity, getUerJoinDetails, getAllActivities };