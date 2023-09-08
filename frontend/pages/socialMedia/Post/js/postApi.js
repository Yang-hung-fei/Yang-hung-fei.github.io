import config from "../../../../../ipconfig";
const hostUrl = config.url;
const userPostUrl = hostUrl + "/user/social/post";
const userToken = ""

//create post
async function createPost(postData) {
    return fetch(userPostUrl, {
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


//edit post content
async function editPost(postId, putData) {
    return fetch(userPostUrl + `/${postId}`, {
        method: "PUT",
        headers: {
            Authorization_M: userToken,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(putData),
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

//delete post 
async function deletePost(postId) {
    return fetch(userPostUrl + `/${postId}`, {
        method: "DELETE",
        headers: {
            Authorization_M: userToken,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(putData),
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

//display all post 
async function getAllPost() {
    return fetch(userPostUrl + "/all", {
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

//get post details
async function getPostDetails(postId) {
    return fetch(userPostUrl + `/${postId}`, {
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

//upload post files (待處理)
async function uploadPostFiles(postId) {
    return fetch(userPostUrl + `/${postId}/upload`, {
        method: "POST",
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

//get post files (待處理)
async function getPostFiles(postId) {
    return fetch(userPostUrl + `/${postId}/files`, {
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

// get file

// get movie


// create post tags
async function createPostTags(postId, postTags) {
    return fetch(userPostUrl + `/${postId}/tags`, {
        method: "GET",
        headers: {
            Authorization_M: userToken,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(postTags),
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

// delete post tags
async function deletePostTags(postId, deletePostTags) {
    return fetch(userPostUrl + `/${postId}/tags`, {
        method: "DELETE",
        headers: {
            Authorization_M: userToken,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(deletePostTags),
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

// get post tags
async function getPostTags(postId) {
    return fetch(userPostUrl + `/${postId}/tags`, {
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

// get posts by tag name
async function getPostsByTagName(tagName) {
    let params = new URLSearchParams({
        tagName: tagName
    });
    return fetch(userPostUrl + "/posts" + params.toString(), {
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

export { createPost, editPost, deletePost, getAllPost, getPostDetails, uploadPostFiles, getPostFiles, createPostTags, deletePostTags, getPostTags, getPostsByTagName }