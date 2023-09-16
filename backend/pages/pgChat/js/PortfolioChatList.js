import config from "../../../../ipconfig.js";

//把選擇檔案按鈕和預覽圖片連結

window.addEventListener("load", function () {
    //Header Token
    const token = localStorage.getItem("Authorization_M");
    // const token = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxIiwiZXhwIjoxNjk1Mjc4Mzc0fQ.vEejC8CitkKzc5vCD24-539wuwtbyJIdshniKCfSlO8";
    fetchPortfolio();
    //撈使用者/美容師資料(token要改)
    function fetchPortfolio() {
        const param = {
            pgId: 1,
        }
        fetch(config.url + "/chat/userList", {
            method: "POST",
            headers: {
                Authorization_U: token,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(param),
        })
            .then(response => response.json())
            .then(data => {
                console.log('fetchPortfolio ' + data.total);
                console.log('fetchPortfolio ' + data.rs);
                const portfolios = data.rs;
                $("#content").empty();
                var choices = "";
                $.each(portfolios, function (n, value) {
                    var choice = '<tr><td>' + value.userId + '</td><td>' + value.userName + '</td><td>' + value.userNickName + '</td>'
                        + '<td>' + value.userGenderName + '</td><td>' + value.userEmail + '</td><td>' + value.userPhone + '</td>'
                        + '<td><button onclick="chatClick(this)" class="btn btn-danger" data-url="' + value.userId + '">回复</button></td></tr>';
                    choices += choice;
                });
                $("#content").append(choices);
                $("#page").html(data.page);
            });
    }

});


