import config from '../../../../../ipconfig.js';
const hostUrl = config.url;
const acUrl = hostUrl + "/user/activity";
const userToken = "";

// get hot activities
async function getHotActivities() {
    return fetch(acUrl + "/hot", {
        method: "GET",
        headers: {
            Authorization_M: userToken,
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

// keywoard search
async function searchActivity(activityContent) {
    let params = new URLSearchParams({
        activityContent: activityContent
    });
    return fetch(acUrl + "/search" + params.toString(), {
        method: "GET",
        headers: {
            Authorization_M: userToken,
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

// get activity details
async function getActivityDetails(activityId) {

    return fetch(acUrl + `/${activityId}`, {
        method: "GET",
        headers: {
            Authorization_M: userToken,
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
            Authorization_M: userToken,
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
            Authorization_M: userToken,
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
    let joinUrl = page === undefined ? acUrl + "/joinList" : acUrl + "/joinList" + params.toString();
    return fetch(joinUrl, {
        method: "GET",
        headers: {
            Authorization_M: userToken,
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

export { getHotActivities, searchActivity, getActivityDetails, joinActivity, leaveActivity, getUerJoinDetails };