import config from '../../../../../ipconfig.js';
const hostUrl = config.url;
const chatUrl = hostUrl + "/manager/activity/chatroom";
const managerToken = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxIiwiZXhwIjoxNjk0OTAwNjUzfQ.Qu0xIqa_UDrF5HE0VZ92NkqnupIg53OV7mKT5kWo0e0";

// get chat list by roomId
async function getChatList(roomId) {
    return fetch(chatUrl + `/${roomId}`, {
        method: "GET",
        headers: {
            Authorization_M: managerToken,
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

// get all room list
async function getAllRoomList() {

    return fetch(chatUrl + "/roomList", {
        method: "GET",
        headers: {
            Authorization_M: managerToken,
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


export { getChatList, getAllRoomList }