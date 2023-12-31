import config from '../../../../../ipconfig.js';
const hostUrl = config.url;
const chatUrl = hostUrl + "/user/activity/chatroom";
const userToken = localStorage.getItem("Authorization_U");
// get chat list by roomId
async function getChatList(roomId, page) {
    let newUrl;
    let params = new URLSearchParams({
        page: page
    });
    if (page == undefined) {
        newUrl = chatUrl + `/${roomId}`;
    } else {
        newUrl = chatUrl + `/${roomId}?` + params.toString();
    }
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
            return data;
        })
        .catch(err => {
            console.error(err.message);
        });
}

// get online user
async function getOnlinUser(roomId) {
    return fetch(chatUrl + `/${roomId}/onlineUsers`, {
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

// get user room list
async function getUserRoomList() {
    return fetch(chatUrl + "/roomList", {
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


export { getChatList, getOnlinUser, getUserRoomList };