import config from "../../../../ipconfig.js";

//把選擇檔案按鈕和預覽圖片連結

window.addEventListener("load", function () {
    //Header Token
    const token = localStorage.getItem("Authorization_M");
    // const token = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxIiwiZXhwIjoxNjk1Mjc4Mzc0fQ.vEejC8CitkKzc5vCD24-539wuwtbyJIdshniKCfSlO8"
    fetchPortfolio();
    //撈使用者/美容師資料(token要改)
    function fetchPortfolio() {
        const param = {
            pgId: 1,
            userId: 1
        }
        fetch(config.url + "/chat/list", {
            method: "POST",
            headers: {
                Authorization_U: token,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(param),
        })
            .then(response => response.json())
            .then(data => {
                console.log(JSON.stringify(data));
                const chatList = data.rs;
                $("#chatContent").empty();
                var choices = "";
                var choice1 = '<div style="background-color:white;width:600px;height:298px;border:0.5px solid grey;"><div style="overflow-y:scroll;width:100%;height:100%;">';
                choices += choice1;
                $.each(chatList, function (n, value) {
                    if (value.chatStatus === '1') {
                        var choice =
                            '<div style="margin-top:20px; display: flex; justify-content: flex-end;">' +
                            '<div style="display:flex;">' +
                            '<div>' +
                            '<div style="color:grey;text-align:right;margin-right:10px;font-size:13px;">' + value.pgName + '</div>' +
                            '<div style="font-size:13px;background-color:#eaeaea;padding:10px;">' + value.chatText + '</div>' +
                            '</div>' +
                            '<div style="margin-right:5px;"> <img src="./img/1_PG.png" style="width: 30px; height: 30px; border-radius: 50%;"></div>' +
                            '</div>' +
                            '</div>';
                        choices += choice;
                    }
                    if (value.chatStatus === '2') {
                        var choice = '<div style="display: flex; justify-content: flex-start;">' +
                            '<div style="display:flex;margin-left:5px;">' +
                            '<div style="margin-right:5px;"> <img src="./img/1_PG.png" style="width: 30px; height: 30px; border-radius: 50%;"></div>' +
                            '<div style="font-size:13px;">' +
                            '<div style="color:grey;text-align:left;">用户 ' + value.userName + '</div>' +
                            '<div style="background-color:#eaeaea;padding:10px;margin-top:2px;">' + value.chatText + '</div>' +
                            '</div>' +
                            '</div>' +
                            '</div>';
                        choices += choice;
                    }
                });
                $("#chatContent").append(choices);
                $("#chatContent").append('</div></div>');
            });
    }

});


