import config from "../../../../ipconfig.js";

//把選擇檔案按鈕和預覽圖片連結

window.addEventListener("load", function () {
    //Header Token
    const token = localStorage.getItem("Authorization_M");
    // const token ="eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxIiwiZXhwIjoxNjk1MjYwNjc1fQ.4ToUiSpkly8LBCWw8-dJktGqPEjoW6T4mlDM-Xru9Dk";
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
                    var choice = '<tr><td>' + value.porId + '</td><td>' + value.pgName + '</td><td>' + value.porTitle + '</td>'
                        + '<td><div style="width: 200px;height: 200px;border-radius: 10px;border: 2px dashed #a2b6df;display: flex;justify-content: center;align-items: center;margin-top: 5px;">'
                        // + '<span>預覽圖</span>'
                        + ' <img src="data:image/jpeg;base64,' + value.porPic + '" alt="預覽圖" style="max-width: 100%; max-height: 100%;">'
                        + '</div></td>'
                        + '<td>' + value.porText + '</td><td>' + value.porUpload + '</td>'
                        + '<td><button type="button" onclick="portfolioUpdate(this)" class="btn btn-default" data-url="' + value.porId + '">编辑</button></td>'
                        + '<td><button type="button" onclick="portfolioDelete(this)" class="btn btn-danger" data-url="' + value.porId + '">删除</button></td></tr>';
                    choices += choice;
                });
                $("#content").append(choices);
                $("#page").html(data.page);
            });
    }

});



