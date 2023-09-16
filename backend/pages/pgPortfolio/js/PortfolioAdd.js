import config from "../../../../ipconfig.js";

//把選擇檔案按鈕和預覽圖片連結

window.addEventListener("load", function () {

    const token = localStorage.getItem("Authorization_M");
    // const token ="eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxIiwiZXhwIjoxNjk1MjYwNjc1fQ.4ToUiSpkly8LBCWw8-dJktGqPEjoW6T4mlDM-Xru9Dk";
    console.log("portfolio insert " + config.url + "/portfolio/insert");
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

    console.log("portfolio insert " + config.url + "/portfolio/insert");
    
    var portfolioAdd = document.getElementById("portfolioAdd");
    portfolioAdd.addEventListener("click", function (event) {
        event.preventDefault(); // 阻止表單的預設行為        

        var newsTitle = $("#newsTitle").val();
        var newsCont = $("#newsCont").val();
        var pic = $("#pic").val();
        // 檢查表單數據是否為空
        if (newsTitle === "" || newsCont === "") {
            alert("请填写标题和内容！");
            return;
        }
        const data = {
            pgId: 1,
            porTitle: newsTitle,
            porText: newsCont
        };
        console.log("portfolio insert " + config.url + "/portfolio/insert");
        console.log("portfolio insert " + JSON.stringify(data));
        // 使用 fetch API 發起 AJAX 請求 新增最新消息(不含圖片)
        fetch(config.url + "/portfolio/insert", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization_M": token
            },
            body: JSON.stringify(data),
        })
            .then((response) => response.json())
            .then((responseData) => {
                console.log("portfolio message " + responseData.message);
                console.log("portfolio code " + responseData.message);
                var porId = responseData.data;
                var code = responseData.code;
                if (code === 200) {
                    //    var token = responseData.message;
                    
                    //    console.log(token);
                    if (token) {
                        console.log("token存在");
                    } else {
                        console.log("Code 200???");
                    }
                    //   alert('最新消息文字存檔成功!');
                    if (pic != null) {
                        console.log("portfolio pic " + porId);
                        // var addPortfolioPic = document.getElementById("addPortfolioPic");
                        // console.log(addPortfolioPic);
                        // addPortfolioPic.addEventListener("submit", function (event) {
                        console.log("aaa");
                        // event.preventDefault(); // 阻止表單的預設提交行為
                        // 創建 FormData 對象並將表單數據添加到其中
                        // const formData = new FormData(addPortfolioPic);
                        const formdata = new FormData();
                        console.log("portfolio piPicture " + $("#pic").get(0).files[0]);
                        formdata.append('piPicture', $("#pic").get(0).files[0]);
                        formdata.append("porId", porId);
                        console.log("portfolio pic config " + config.url + "/portfolio/addNewsPic");
                        //使用 fetch API 發起 AJAX 請求 新增最新消息圖片
                        fetch(config.url + "/portfolio/addNewsPic", {
                            method: "POST",
                            headers: {
                                "Authorization_M": token
                            },
                            body: formdata,
                        })
                            .then((response) => response.json())
                            .then((responseData) => {
                                var code = responseData.code;
                                if (code === 200) {
                                    alert('存檔成功!');
                                    window.location.href = "/backend/pages/pgPortfolio/homepagePortfolioList.html";
                                } else {
                                    alert(responseData.code ?? '圖片存檔失敗');
                                } console.log("aaa");
                            });
                        // });
                    } else { alert('本次不帶入圖片') };
                } else {
                    alert('存檔失敗');
                }
            });
    });
});