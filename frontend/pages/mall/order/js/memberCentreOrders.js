import config from "../../../../../ipconfig.js";

let dataTable; // 將 dataTable 定義在函數之外
let selectedRow;
//Header Token
//const token = localStorage.getItem("Authorization_U");
const token = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI0IiwiZXhwIjoxNjk0MTgwMzU2fQ.7B-Vmv6G_IOfZjiB0x5T4omKhNSbjYOAm30nbfVMZIk";

// 在頁面載入時調用此函數
document.addEventListener('DOMContentLoaded', function () {
     // 使用 DataTable 初始化函數

    fetchUserOrders();
});


// 發送GET請求獲取訂單數據
function fetchUserOrders() {
    fetch(config.url + "/user/getUserOrders", {
        method: "GET",
        headers: {
            Authorization_U: token,
            "Content-Type": "application/json"
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.message) {
            const orders = data.message;
            // 整理數據為DataTable可識別的格式
            
            const formattedData = orders.map(order => [
                order.ordNo,
                order.ordCreate, // 假設你的訂單數據包含訂單日期
                order.orderAmount, // 假設你的訂單數據包含實付金額
                order.recipientName, // 假設你的訂單數據包含收件人姓名
                order.recipientPh, // 假設你的訂單數據包含收件人電話
                order.ordStatus, // 假設你的訂單數據包含訂單狀態
                order.ordPayStatus // 假設你的訂單數據包含付款狀態
                // 這些應該根據你的API響應的實際數據結構進行調整
                
            ]);
            console.log(formattedData);
            // 初始化或重新初始化DataTable
            if (dataTable) {
                dataTable.clear().destroy();
            }            
            
            // 初始化DataTable
            dataTable = $('#OrdersTable').DataTable({
                // "scrollX": true, // 启用水平滚动条
                "lengthMenu": [[5, 10, 15, 20, -1], [5, 10, 15, 20, "全部"]],
                "processing": true,
                "destroy": true,
                "autoWidth": false
                , responsive: {
                    breakpoints: [                        //設定五種螢幕尺寸的type
                        { name: 'desktop', width: Infinity },
                        { name: 'tablet-l', width: 1024 },//原本是768~1024不含768
                        { name: 'tablet-p', width: 767 },//
                        { name: 'mobile-l', width: 480 },
                        { name: 'mobile-p', width: 320 },
                        { name: 'none', width: 100 }     //隱藏
                    ]
                },
                data: formattedData,
                columns: [
                    { 
                        title: '訂單編號'
                    },
                    {
                        title: '訂單成立時間',
                        targets: 1,
                        render: function (data, type, row) {
                            if (type === 'display' || type === 'filter') {
                                // 將數組轉換為 Date 對象
                                const date = new Date(data[0], data[1] - 1, data[2], data[3], data[4], data[5]);
            
                                // 使用 Date 對象格式化日期，包括時、分和秒
                                const formattedDate = `${date.getFullYear()}年${(date.getMonth() + 1).toString().padStart(2, '0')}月
                                ${date.getDate().toString().padStart(2, '0')}日<br>${date.getHours().toString().padStart(2, '0')}
                                時${date.getMinutes().toString().padStart(2, '0')}分${date.getSeconds().toString().padStart(2, '0')}秒`;

                                return formattedDate;
                            }
                    
                            // 其他情況返回原始日期數據
                            return data;
                        }
                    },
                    { title: '實付金額' },
                    { title: '收件人姓名' },
                    { title: '收件人電話' },
                    { 
                        title: '訂單狀態',
                        targets: 5,
                        render: function (data, type, row) {
                            if(type === "display"){
                                if(data === 0){
                                    return "未出貨";
                                }else if(data === 1){
                                    return "已出貨";
                                }else if(data === 2){
                                    return "已到貨";
                                }else if(data === 3){
                                    return "退貨申請";
                                }else if(data === 4){
                                    return "退貨成功";
                                }else if(data === 5){
                                    return "訂單完成";
                                }else if(data === 6){
                                    return "訂單取消";
                                }else{
                                    return "未知狀態";
                                }
                            }
                            return data;
                        } 
                    },
                    {
                        title: '付款狀態',
                        targets: 6,
                        render: function (data, type, row) {
                            if (type === 'display') {
                                if (data === 0) {
                                    return '未付款';
                                } else if (data === 1) {
                                    return '已付款';
                                } else {
                                    return '未知狀態'; // 可以處理其他可能的狀態值
                                }
                            }
                            return data;
                        }
                    },
                    {
                        title: '明細',
                        data: null, // 这里我们使用 null，因为这一列不需要从数据源中获取数据
                        render: function (data, type, row) {
                            if (type === 'display') {
                                // 创建查询按钮元素
                                const searchButton = '<a href="#" class="btn-link"><i class="fa fa-search"></i></a>';
                                return searchButton;
                            }
                            return data; // 其他情况返回原始数据
                        }
                    },
                    {
                        title: '付款',
                        data: null, // 这里我们使用 null，因为这一列不需要从数据源中获取数据
                        render: function (data, type, row) {
                            if (type === 'display') {
                                // 创建支付按钮元素
                                const paymentButton = '<a href="#" class="btn-link"><i class="fa-solid fa-money-bill"></i></a>';
                                return paymentButton;
                            }
                            return data; // 其他情况返回原始数据
                        }
                    },
                    {
                        title: '刪除',
                        data: null, // 这里我们使用 null，因为这一列不需要从数据源中获取数据
                        render: function (data, type, row) {
                            if (type === 'display') {
                                // 创建删除按钮元素
                                const deleteButton = '<a href="#" class="btn-link delete-icon"><i class="fa fa-times"></i></a>';
                                return deleteButton;
                            }
                            return data; // 其他情况返回原始数据
                        }
                    }
                ],
                language: {      // 語言設定
                    "url": "//cdn.datatables.net/plug-ins/1.13.6/i18n/zh-HANT.json"
                },
                columnDefs:[
                    {
                        targets: '_all',
                        className: 'text-center'              
                    },
                    {
                        targets: [3, 4],
                        createdCell: function (td, cellData, rowData, row, col) {
                            $(td).css('width', '12%')
                        },
                    },
                    {
                        targets: [7, 8, 9],
                        createdCell: function (td, cellData, rowData, row, col) {
                            $(td).css('width', '9%')
                        },
                    }
                ]
                
                
                // 可以設置其他DataTable選項
            });

             // 監聽刪除按鈕的點擊事件
            $('#OrdersTable tbody').on('click', 'a.delete-icon', function (e) {
                e.preventDefault();
                selectedRow = dataTable.row($(this).closest('tr')).data();
                const rowData = dataTable.row($(this).closest('tr')).data();
                const ordNo = rowData[0]; // 假设订单号在第一列
                // 在這裡處理刪除操作，你可以使用rowData中的數據
                // 构建要发送到后端的数据对象
                const requestData = {
                    ordNo: ordNo,
                    ordStatus: 6 // 设置订单状态为6，您可以根据需要修改
                };

                Swal.fire({
                    title: '請確認',
                    text: '您確定要刪除這筆訂單嗎!?',
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#d33',
                    cancelButtonColor: '#3085d6',
                    confirmButtonText: '確定刪除'
                }).then((result) => {
                    if (result.isConfirmed) {
                        // 用户点击了"確定刪除"按钮，执行删除操作
                        deleteOrder(requestData, selectedRow);
                    }
                });

                // 執行刪除訂單的相關操作，可以使用fetch或其他方法
                // 記得要在這裡執行訂單刪除的操作
            });

        } else {
            console.error("Failed to fetch user orders:", data);
        }
    })
    .catch(error => {
        console.error("Error fetching user orders:", error);
    });
}

// 刪除訂單deleteOrder
function deleteOrder(requestData, selectedRow) {
    fetch(config.url + "/user/updateUserOrders", {
        method: 'PATCH',
        headers: {
            'Authorization_U': token,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
    })
    .then(response => {
        if (response.ok) {
            Swal.fire('刪除成功!');
            dataTable.row(selectedRow).remove().draw(); // 從DataTable中删除行
            // location.reload();
        } else {
            Swal.fire('刪除失敗!');
        }
    })
    .catch(error => {
        // 捕获网络请求错误
        console.error('Network error:', error);
    });
}

