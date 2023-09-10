
//Header Token
const token = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIzIiwiZXhwIjoxNjk0NjkwNDE4fQ.mQVsYsxqDbXVSEEcZV1vjnoJqhZjoZ8KB6SY9YhLZQQ";

window.addEventListener("load", () => {
    const productListContainer = document.getElementById("PdCollectTable").getElementsByTagName('tbody')[0];

    fetch(config.url + "/manager/getallProduct", {
        method: "GET",
        headers: {
            Authorization_M: token,
            "Content-Type": "application/json"
        }
    })
        .then(response => response.json())
        .then(data => {
            if (data.code === 200) {
                renderProductList(data.message);
            }
        });

    function renderProductList(products) {
        for (const product of products) {
            const newRow = productListContainer.insertRow();

            // 商品編號
            const pdNoCell = newRow.insertCell(0);
            pdNoCell.textContent = product.pdNo;

            // 商品名稱
            const pdNameCell = newRow.insertCell(1);
            pdNameCell.textContent = product.pdName;

            // 商品價格
            const pdPriceCell = newRow.insertCell(2);
            pdPriceCell.textContent = product.pdPrice;

            // 商品狀態
            const pdStatusCell = newRow.insertCell(3);
            pdStatusCell.textContent = product.pdStatus === 0 ? '上架中' : '已下架';

            // 操作按钮
            const actionsCell = newRow.insertCell(4);
            const saveButton = document.createElement('button');
            saveButton.textContent = 'Save';
            actionsCell.appendChild(saveButton);

            saveButton.addEventListener('click', () => {
                const pdNo = product.pdNo; // 获取商品编号
                const newStatus = toggleProductStatus(product.pdStatus); // 切换商品状态
                updateProductStatus(pdNo, newStatus); // 调用更新商品状态的函数，传递商品编号和新状态
                // 可以在界面上更新商品状态的显示，比如切换图标或文本
                updateProductStatusDisplay(product.pdNo, newStatus);
            });

            function updateProductStatus(pdNo, newStatus) {
                // 构建更新商品状态的请求
                const updateStatusRequest = {
                    pdNo: pdNo, // 商品编号
                    pdStatus: newStatus // 新的商品状态
                };
            
                fetch(config.url + "/manager/updateProductStatus", {
                    method: "PUT", // 使用正确的 HTTP 方法
                    headers: {
                        Authorization_M: token, // 使用正确的 Authorization 头部
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(updateStatusRequest) // 将请求体转换为 JSON 字符串
                })
                .then(response => response.json())
                .then(data => {
                    if (data.code === 200) {
                        // 更新状态成功，可以执行其他操作或显示成功消息
                        console.log("商品狀態更新成功");
                    } else {
                        // 更新状态失败，处理错误情况
                        console.error("商品狀態更新失敗");
                    }
                })
                .catch(error => {
                    // 请求发生错误，处理错误情况
                    console.error("請求更新商品狀態時發生錯誤:", error);
                });
            }
            

        }
    }
});
