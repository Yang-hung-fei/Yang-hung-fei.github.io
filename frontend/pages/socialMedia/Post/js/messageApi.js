import config from "../../../../../ipconfig.js";
const hostUrl = config.url;
const userMesUrl = hostUrl + "/user/social/post";
const userToken = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI0IiwiZXhwIjoxNjk0NjMwNjMwfQ.n7GVmpW_Bp7lv0ymXgu6DYOrNEV26JbidvipXJTabbA";

// create message
async function createMessage(postId, messageData) {
    return fetch(userMesUrl + `${postId}/message`, {
        method: "POST",
        headers: {
            Authorization_M: userToken,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(messageData),
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

// edit message
async function editMessage(messageId, messageData) {
    return fetch(userMesUrl + `/message/${messageId}`, {
        method: "PUT",
        headers: {
            Authorization_M: userToken,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(messageData),
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

//delete message
async function deleteMessage(messageId) {
    return fetch(userMesUrl + `/message/${messageId}`, {
        method: "DELETE",
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

//get one message details
async function getMessage(messageId) {
    return fetch(userMesUrl + `/message/${messageId}`, {
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

//get messages by postId 
async function getMessagesByPostId(postId) {
    return fetch(userMesUrl + `/${postId}/messages`, {
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

export { createMessage, editMessage, deleteMessage, getMessage, getMessagesByPostId }
