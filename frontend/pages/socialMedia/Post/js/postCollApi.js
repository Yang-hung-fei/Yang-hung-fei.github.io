import config from "../../../../../ipconfig";
const hostUrl = config.url;
const userColltUrl = hostUrl + "user/social/collection";
const userToken = ""

//user create post collection
async function createPostColl(postId) {
    let params = new URLSearchParams({
        postId: postId
    });
    return fetch(userColltUrl + params.toString(), {
        method: "POST",
        headers: {
            Authorization_M: userToken,
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

//user delete post collection
async function deletePostColl(postCollectId) {
    return fetch(userColltUrl + `${postCollectId}`, {
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

//user query post collections
async function queryPostColl() {
    return fetch(userColltUrl + "/posts", {
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

// 建立貼文收藏分類`
async function createPostColltag(categoryReq) {
    return fetch(userColltUrl + "/tags", {
        method: "POST",
        headers: {
            Authorization_M: userToken,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(categoryReq),
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

// 刪除貼文收藏分類 
async function deletePostColltag(pctId) {
    return fetch(userColltUrl + `/tags/${pctId}`, {
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

// 修改貼文收藏分類標籤
async function editPostColltag(categoryReq, pctId) {
    return fetch(userColltUrl + `/tags/${pctId}`, {
        method: "PUT",
        headers: {
            Authorization_M: userToken,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(categoryReq),
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

// 查詢貼文收藏分類 
async function queryPostColltags() {
    return fetch(userColltUrl + "/tags", {
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

// 使用分類標籤查詢收藏內容 
async function queryCollBytag(pctId) {
    return fetch(userColltUrl + `/tags/${pctId}`, {
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

//將收藏貼文加入分類標籤(收藏一律加入在預設分類標籤)
async function addPostCollByTag(pcId, postTagReq) {
    return fetch(userColltUrl + `/${pcId}/tags`, {
        method: "POST",
        headers: {
            Authorization_M: userToken,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(postTagReq),
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

export { createPostColl, deletePostColl, queryPostColl, createPostColltag, deletePostColltag, editPostColltag, queryPostColltags, queryCollBytag, addPostCollByTag }