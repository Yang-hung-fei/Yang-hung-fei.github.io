function editUserName(){
    //TODO: enter可以儲存
}

function editUserNickName(){
    //TODO: enter可以儲存

}

function editUserPic(){

}

function editOthersData(){
    
}

function sentEditedData(){
    const token = localStorage.getItem("Authorization_U");
    const newUserData = getEditedData();

    fetch(config.url + "/user/profile", {
        method: "POST",
        headers: {
            Authorization_U: token
        },
        body: JSON.stringify(newUserData)
    })
        .then(response => response.json())
        .then(data => {
            if (data.code === 200) {
                console.log("code", code, ":", data.message);
                swal("修改成功", "", "success");
            } else {
                console.log("code", code, ":", data.message);
                swal("修改失敗", "請確認資料格式");
            }
        })
        .catch((error) => {
          // 处理捕获的错误，包括网络错误等
          console.error("Fetch error:", error);
        });
}

function getEditedData(){

}