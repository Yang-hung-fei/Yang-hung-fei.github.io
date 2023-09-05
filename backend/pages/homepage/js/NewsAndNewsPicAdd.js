import config from "../../../../ipconfig.js";

//把選擇檔案按鈕和預覽圖片連結
localStorage.setItem("Authorization_M", "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxIiwiZXhwIjoxNjkzOTgwNzc3fQ.2tiXKDGkG1CBEOdl1tnjQokBizDRdPVK6cXDbqDrO24");
window.addEventListener("load", function () {
    var picInput = document.getElementById("pic");
    var previewPic = document.getElementById("previewPic");

    picInput.addEventListener("change", function (e) {

        var file = e.target.files[0];

        if (file) {
            var reader = new FileReader();
            reader.onload = function (event) {
                previewPic.src = event.target.result;
            };
            reader.readAsDataURL(file);
        } else {
            previewPic.src = "";
        }
    });
});


document.addEventListener("DOMContentLoaded", function () {
    let token = localStorage.getItem("Authorization_M");
    var btnsendNews = document.getElementById("sendNews");
    btnsendNews.addEventListener("click", function (event) {
        event.preventDefault(); // 阻止表單的預設行為        

        var newsTitle = $("#newsTitle").val();
        var newsCont = $("#newsCont").val();
        var newsStatus = $("#newsStatus").val();
        var pic = $("#pic").val();

        // 檢查表單數據是否為空
        if (newsTitle === "" || newsCont === "") {
            alert("請填入資料！");
            return;
        } else {
            //  alert("資料已送出");
        }

        const data = {
            newsTitle: newsTitle,
            newsCont: newsCont
            //newsStatus: newsStatus

        };



        // 使用 fetch API 發起 AJAX 請求 新增最新消息(不含圖片)
        fetch(config.url + "/manager/homepageManage/addNews", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization_M": token
            },
            body: JSON.stringify(data),
        })
            .then((response) => response.json())
            .then((responseData) => {
                var code = responseData.code;
                
               
                if (code === 200) {

             //    var token = responseData.message;
                    localStorage.setItem("Authorization_M", token);
                //    console.log(token);
                    if (token) {
                        console.log("token存在"); 


                    } else {
                        console.log("Code 200???");

                    }
                 //   alert('最新消息文字存檔成功!');

                    
                                    
                    if (pic != null) {

                        var addNewsAndNewsPic = document.getElementById("addNewsAndNewsPic");
                        console.log(addNewsAndNewsPic);
                  //      alert(config.url + "/manager/homepageManage/addNewsPic");
                        addNewsAndNewsPic.addEventListener("click", function (event) {
               console.log("aaa");
                            event.preventDefault(); // 阻止表單的預設提交行為

                            // 創建 FormData 對象並將表單數據添加到其中
                            const formData = new FormData(addNewsAndNewsPic);
                           
                       //   alert(config.url + "/manager/homepageManage/addNewsPic");

                            //使用 fetch API 發起 AJAX 請求 新增最新消息圖片
                            fetch(config.url + `/manager/homepageManage/addNewsPic`,{
                        //      ?newsNo=${??}&pic=${$("#pic")[0].files[0]}
                       //     `, {
                                method: "POST",
                                headers: {
                                    "Content-Type": "multipart/form-data",
                                    "Authorization_M": token
                                },
                                body: formData,
                                
                            }) 
                                .then((response) => response.json())
                                
                                .then((responseData) => {
                                    
                                    var code = responseData.code;
                                 
                                   
                                    if (code === 201) {
                      
                                        alert('存檔成功!');
                                        location.reload();
                                    } else {
                                        alert(message ?? '圖片存檔失敗');
                                    } console.log("aaa");
                                });
                                

                        });

                    } else { alert('本次不帶入圖片') };

                } else {
                    alert('存檔失敗');
                }
            });
    });
});