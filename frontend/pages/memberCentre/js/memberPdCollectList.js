import config from "../../../../ipconfig.js";

//Header Token
// const token = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIzIiwiZXhwIjoxNjk0NjkwNDE4fQ.mQVsYsxqDbXVSEEcZV1vjnoJqhZjoZ8KB6SY9YhLZQQ";
const token = localStorage.getItem("Authorization_U");

let dataTable; // 將 dataTable 定義在函數之外

// 在頁面載入時調用此函數
document.addEventListener('DOMContentLoaded', function () {
    // 使用 DataTable 初始化函數
    fetchProductCollectList();
});


// 發送GET請求獲取訂單數據
function fetchProductCollectList() {
    fetch(config.url + "/user/productcollectlist", {   
        method: "GET",
        headers: {
            Authorization_U: token,
            "Content-Type": "application/json"
        }
    })
        .then(response => response.json())
        .then(data => {
            if (data.message) {
                const productList  = data.message;
                // 整理數據為DataTable可識別的格式

                // 初始化或重新初始化 DataTable
                if (dataTable) {
                    dataTable.clear().destroy();
                }

                  // 格式化数据为 DataTable 
                  const formattedData = productList.map(product => [
                    `<img src="data:image/png;base64,${product.base64Image}" alt="${product.pdName}" width="50">`,
                    product.pdName,
                    product.pdPrice,
                    `<button data-product-id="${product.pdNo}" class="btn btn-danger delete-btn">删除</button>`
                ]);
                
               
                // 初始化DataTable
                dataTable = $('#PdCollectTable').DataTable({
                    data: formattedData,
                    columns: [
                        { title: '商品圖片' },
                        { title: '商品名稱' },
                        { title: '商品價格' },
                        { title: '刪除' }
                    ],
                    language: {
                        "url": "//cdn.datatables.net/plug-ins/1.13.6/i18n/zh-HANT.json"
                    }
                });

                // 监听删除按钮的点击事件
                $('#PdCollectTable tbody').on('click', 'button.delete-btn', function () {
                    const productId = $(this).data('product-id');
                    deleteProductFromCollect(productId);
                });
            } else {
                console.error("Failed to fetch product collect list:", data);
            }
        })
        .catch(error => {
            console.error("Error fetching product collect list:", error);
        });
    }
    
    // 删除商品收藏
    function deleteProductFromCollect(productId) {
        fetch(config.url + `/user/deleteproductcollect?pdNo=${productId}`, {  
            method: 'DELETE',
            headers: {
                'Authorization_U': token,
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            if (response.ok) {
                // 删除成功，刷新表格
                fetchProductCollectList();
                Swal.fire({
                    position: 'top-center',
                    icon: 'success',
                    title: "刪除成功!",
                    showConfirmButton: false,
                    timer: 1500
                });
            } else {
                Swal.fire({
                    icon: '錯誤',
                    title: "刪除失敗!",
                    text: data.message,
                });
            }
        })
        .catch(error => {
            console.error('Network error:', error);
        });
    }