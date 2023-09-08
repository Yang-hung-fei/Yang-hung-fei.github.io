import config from "../../../../../ipconfig.js";
const hostUrl = config.url;
const userMesUrl = hostUrl + "/user/social/post";

// create message
async function createMessage(postId, messageData) {
    return fetch(userPostUrl + `${postId}/message`, {
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
    return fetch(userPostUrl + `/message/${messageId}`, {
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
    return fetch(userPostUrl + `/message/${messageId}`, {
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
    return fetch(userPostUrl + `/message/${messageId}`, {
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
    return fetch(userPostUrl + `/${postId}/messages`, {
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
