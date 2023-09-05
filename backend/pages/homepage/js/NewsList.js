import config from "../../../../ipconfig.js";

localStorage.setItem("Authorization_M", "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxIiwiZXhwIjoxNjk0MTkzMjY3fQ.SzSM7havg7wzQTzchWnxWWSQd46CMoPskSWhPXdLjaw");


// <!--網頁載入後執行-->
document.addEventListener("DOMContentLoaded", function () {
    const newsList = document.getElementById("newsList");
    let token = localStorage.getItem("Authorization_M");
    window.addEventListener("click", function (event) {
        event.preventDefault(); // 阻止表單的預設行為        

        var newsTitle = $("#newsTitle").val();
        var newsCont = $("#newsCont").val();
        var newsStatus = $("#newsStatus").val();
        var pic = $("#pic").val();

        const data = {
            newsTitle: newsTitle,
            newsCont: newsCont
            //newsStatus: newsStatus

        };
    });

    $(document).ready(function () {
        $('#example').DataTable({
            "data": newsList,
            "lengthMenu": [3, 5, 10, 20, 50, 100],
            "searching": true,
            "paging": true,
            "ordering": true,
            "columns": [
                // 配置每列的数据来源
                { "data": "newsNo" },
                { "data": "newsTitle" },
                { "data": "updateTime" },

            ],

        });
    });



    fetch(config.url + "/manager/homepageManage/getAllNews")
        .then((response) => response.json())
        .then((data) => {

            $('#example').DataTable({
                "data": data,
                "lengthMenu": [3, 5, 10, 20, 50, 100],
                "searching": true,
                "paging": true,
                "ordering": true,
                "columns": [
                    { "data": "newsNo" },
                    { "data": "newsTitle" },
                    { "data": "updateTime" },

                ],
                "language": {
                    "processing": "處理中...",
                    "loadingRecords": "載入中...",
                    "lengthMenu": "顯示 _MENU_ 筆結果",
                    "zeroRecords": "沒有符合的結果",
                    "info": "顯示第 _START_ 至 _END_ 筆結果，共<font color=red> _TOTAL_ </font>筆",
                    "infoEmpty": "顯示第 0 至 0 筆結果，共 0 筆",
                    "infoFiltered": "(從 _MAX_ 筆結果中過濾)",
                    "infoPostFix": "",
                    "search": "搜尋:",
                    "paginate": {
                        "first": "第一頁",
                        "previous": "上一頁",
                        "next": "下一頁",
                        "last": "最後一頁"
                    },
                    "aria": {
                        "sortAscending": ": 升冪排列",
                        "sortDescending": ": 降冪排列"
                    }
                }
            });
        })
        .catch((error) => {
            console.error("error occured while get newsList：", error);
        });



    // 使用 Fetch API 從資料庫獲取最新消息數據
    fetch(config.url + "/manager/homepageManage/getNews", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization_M": token,
        },
        body: JSON.stringify(data),
    })
        .then((response) => response.json())
        .then((data) => {
            // 遍歷最新消息數據並創建消息列表項目
            data.forEach((news) => {
                const listItem = document.createElement("li");

                // 創建標題元素
                const titleElement = document.createElement("h2");
                titleElement.textContent = news.title;

                // 創建內容元素
                const contentElement = document.createElement("p");
                contentElement.textContent = news.content;

                // 將標題和內容元素添加到列表項目
                listItem.appendChild(titleElement);
                listItem.appendChild(contentElement);

                // 將列表項目添加到消息列表
                newsList.appendChild(listItem);
            });
        })
        .catch((error) => {
            console.error("獲取最新消息時出錯：", error);
        });



});









