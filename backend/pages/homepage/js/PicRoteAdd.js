import config from "../../../../ipconfig.js";

//把選擇檔案按鈕和預覽圖片連結
localStorage.setItem("Authorization_M", "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxIiwiZXhwIjoxNjkzOTgwNzc3fQ.2tiXKDGkG1CBEOdl1tnjQokBizDRdPVK6cXDbqDrO24");
window.addEventListener("load", function () {
    var picInput = document.getElementById("pic");
    var previewRotePic = document.getElementById("previewRotePic");

    picInput.addEventListener("change", function (e) {

        var file = e.target.files[0];

        if (file) {
            var reader = new FileReader();
            reader.onload = function (event) {
                previewRotePic.src = event.target.result;
            };
            reader.readAsDataURL(file);
        } else {
            previewRotePic.src = "";
        }
    });
});


document.addEventListener("DOMContentLoaded", function () {
   
    let token = localStorage.getItem("Authorization_M");
    var btnsendRotePic = document.getElementById("sendRotePic");
    btnsendRotePic.addEventListener("click", function (event) {
        event.preventDefault(); // 阻止表單的預設行為        

        // 創建 FormData 對象並將表單數據添加到其中
        const formData = new FormData(addRotePic);

        var picLocateUrl = $("#picLocateUrl").val();
        var pic = $("#pic").val();
        var startDate = $("#startDate").val();
        var endDate = $("#endDate").val();

        // 檢查表單數據是否為空
        if (picLocateUrl === "" || pic === "") {
            alert("請填入資料！");
            return;
        } else {
            //  alert("資料已送出");
        }

        const data = {
            picLocateUrl: picLocateUrl,
            pic: pic,
            startDate: startDate,
            endDate: endDate
            //newsStatus: newsStatus

        };


        // 使用 fetch API 發起 AJAX 請求 新增輪播圖
        fetch(config.url + "/manager/homepageManage/addRotePic", {
            method: "POST",
            headers: {
            //    "Content-Type": "multipart/form-data",
                "Authorization_M": token
            },
            body: formData,
        })
            .then((response) => response.json())
            .then((responseData) => {
                var code = responseData.code;

                console.log(responseData);
                console.log(data);

                if (picLocateUrl === "") {
                    alert("請填入跳轉URL！");
                    return;
                }

                if (code === 200) {
                    
                    //    var token = responseData.message;
                    localStorage.setItem("Authorization_M", token);
                    //    console.log(token);
                    if (token) {
                        console.log("token存在");


                    } else {
                        console.log("Code 200???");

                    }
                    //   alert('xxx存檔成功!');
                   

                } else {
                    alert('存檔失敗');
                }
            });
    });
});