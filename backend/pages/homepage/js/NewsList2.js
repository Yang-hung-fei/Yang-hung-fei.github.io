import config from "../../../../ipconfig.js";

localStorage.setItem("Authorization_M", "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxIiwiZXhwIjoxNjk0MTkzMjY3fQ.SzSM7havg7wzQTzchWnxWWSQd46CMoPskSWhPXdLjaw");


document.addEventListener("DOMContentLoaded", function () {
    fetchnewsList();
});
// 在 DOM 元素載入完成後觸發，呼叫 fetchNewsList 函數
// async 函數 fetchNewsList 使用了 fetch API 從指定的 URL(controller對應的) 取得news列表資料。
// 等待 fetch 完成並將回應轉換為 JSON 格式
async function fetchnewsList() {
    try {
        const response = await fetch(config.url + "/manager/homepageManage/getNews");
                
        if (!response.ok) {
            throw new Error(`Network response was not ok (status: ${response.status})`);
        }
        
        const newsList = await response.json();
        console.log(newsList);

        // 這兩行將xx列表的 <tbody> 元素選取並清空，以便重新插入新的xx資料
        const dataTableList = document.getElementById("dataTableList");
        dataTableList.innerHTML = "";

        // forEach 迴圈遍歷 NewsList 中的每一個物件，並為每個創建一個新的 <tr> 元素
        // 接著使用 innerHTML 將該 <tr> 元素的 HTML 內容填充為表格的每一列
        // 最後，將這個新創建的 <tr> 元素附加到 <tbody> 中
        // news是一個函數的參數，它表示在 NewsList 陣列中的每個元素。在這個情境下 news 代表了xx列表中的每個xx物件
        newsList.forEach(news => {
            const row = document.createElement("tr");
            // 只取出List<newsPicture>中的第一個 newsPic 物件測試
            const np = news.newsPic[0];
            // 可以看出pp的資料有undefined以及NewsPic物件及其底下的屬性newsPic(存圖片的屬性)
            console.log(np);
            let base64Image;
            if (np !== null && np !== undefined) {

                base64Image = np.newsPic;
            }

            // const base64Image = arrayBufferToBase64(news.newsPic[0].newsPic); // 將 byte[] 轉換成 Base64

            function arrayBufferToBase64(arrayBuffer) {
                var binary = '';
                var bytes = new Uint8Array(arrayBuffer);
                var len = bytes.byteLength;
                for (var i = 0; i < len; i++) {
                    binary += String.fromCharCode(bytes[i]);
                }
                return window.btoa(binary);
            }


            row.innerHTML = `
                <td style="width: 10px;text-align: center; vertical-align: middle;">${news.newsNo}</td>
                <td style="width: 20px;text-align: center;vertical-align: middle;">${news.newsTitle}</td>
                <td style="width: 20px;text-align: center;vertical-align: middle;">${statusMapping.get(news.newsStatus)}</td>
                <td style="width: 30px;text-align: center;vertical-align: middle;">
                <button class="btn btn-outline-success" onclick="redirectToDetailPage(${news.newsAdd})">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pen" viewBox="0 0 16 16">
                        <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001zm-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708l-1.585-1.585z"/>
                    </svg>
                </button>
                <button class="btn btn-primary" type="button"
                    style="background: #6b8df3;border-style: none;color: #f1ecd1; width: 60px; height: 30px; font-size: 14px;"
                    onclick="editNewsByNewsNo(${news.newsNo})">修改</button>
                <button class="btn btn-danger" type="button"
                    style="background: #f44336; border-style: none; color: #ffffff; width: 60px; height: 30px; font-size: 14px;"
                    onclick="deleteNewsByNewsNo(${news.newsNo})">刪除</button>
                </td>
                <td style="width: 30px;text-align: center; vertical-align: middle;">${news.updateTime}</td>    
            `;

            //<td style="width: 70px;text-align: center;"><img src="data:image/jpeg;base64,${base64Image}" alt="商品照片" width="100" height="100"></td> 
            dataTableList.appendChild(row);
        });

    } catch (error) {
        console.error("Error fetching news list:", error);
    }
}


// statusMapping 是一個 Map，將狀態碼映射到對應的狀態文字
const statusMapping = new Map([
    [0, '下架'],
    [1, '上架'],
]);

// redirectToDetailPage 函數接受一個活動 ID，根據該 ID 創建新的頁面 URL，並將瀏覽器的位置改為該 URL，從而導航到詳細內容頁面
// activityEdit.html?newsNo=${newsNo} 是一個動態生成的 URL 字串，用於將參數 newsNo 插入到 URL 中，以便導航到指定的詳細內容頁面
// <!--按修改鈕會根據newsNo跳轉到詳細內容頁面，並將資料映射到相關欄位上-->
function redirectToDetailPage(newsNo) {
    var newsPageUrl = `newsList.html?newsNo=${newsNo}`;
    window.location.href = newsPageUrl;
}
