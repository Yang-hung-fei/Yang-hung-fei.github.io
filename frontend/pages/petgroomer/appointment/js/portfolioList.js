import config from "../../../../../ipconfig.js";
//把選擇檔案按鈕和預覽圖片連結
window.addEventListener("load", function () {
    //Header Token
    const token = localStorage.getItem("Authorization_U");
    // const token = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIyIiwiZXhwIjoxNjk1MjY3NTA0fQ.eyebKq0cYuoRhp77ZCqkV2upWprznyah8RHgPEPhZds";
    fetchPortfolio();
    //撈使用者/美容師資料(token要改)
    function fetchPortfolio() {
        const param = {
            currentPage: 1,
            pageSize: 10
        }
        fetch(config.url + "/portfolio/list", {
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
                    if (value.collect === '0') {
                        var choice = '<div class="col-md-4">' +
                            '<div class="border rounded p-3 position-relative" style="height:500px;">' +
                            '<img src="data:image/jpeg;base64,' + value.porPic + '" class="img-1"  style="width: 100%; height: 300px; max-height: 322.66px;margin-bottom:10px;">' +
                            '<h4>' + value.porTitle + '</h4>' +
                            '<h5>美容師：' + value.pgName + '</h4>' +
                            '<p>' + value.porText + '</p>' +
                            '<div style="float:right;font-size:25px;margin-right:20px;"><button onclick="chatClick(this)" class="btn btn-default" data-url="' + value.pgId + '"><i class="bi bi-chat-dots"></i></button>' +
                            '<button onclick="addCollect(this)" class="btn btn-default" data-url="' + value.porId + '"><i class="bi bi-heart"></i></button></div>' +
                            '</div></div>';
                        choices += choice;
                    }
                    if (value.collect === '1') {
                        var choice = '<div class="col-md-4">' +
                            '<div class="border rounded p-3 position-relative" style="height:500px;">' +
                            '<img src="data:image/jpeg;base64,' + value.porPic + '" class="img-1"  style="width: 100%; height: 300px; max-height: 322.66px;margin-bottom:10px;">' +
                            '<h4>' + value.porTitle + '</h4>' +
                            '<h5>美容师：' + value.pgName + '</h4>' +
                            '<p>' + value.porText + '</p>' +
                            '<div style="float:right;font-size:25px;margin-right:20px;"><button onclick="chatClick(this)" class="btn btn-default" data-url="' + value.pgId + '"><i class="bi bi-chat-dots"></i></button>' +
                            '<button onclick="deleteCollect(this)" class="btn btn-default" data-url="' + value.porId + '"><i class="bi bi-heart-fill"></i></button></div>' +
                            '</div></div>';
                        choices += choice;
                    }
                });
                $("#content").append(choices);
                $("#page").html(data.page);
            });
        }});