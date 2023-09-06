import config from "../../../../../ipconfig.js";
// let table = new DataTable('#OrdersManTable');
const token = localStorage.getItem("Authorization_U");
// const token = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxIiwiZXhwIjoxNjk0MzM2MzcwfQ.toLrUWNi2xj2zX9GPiXz9-iTij_KctBPcDiRbIb81wE";
let table;
//一進頁面渲染
window.addEventListener("load", function () {
    fetchAndBuildTable();
})
//動態取出訂單
function fetchAndBuildTable() {
    fetch(config.url + `/manager/getAllOrders`, {
        method: "GET",
        headers: {
            Authorization_M: token, // 使用Manager Token
            "Content-Type": "application/json"
        }
    })
        .then(response => response.json())
        .then(data => {
            if (data.code === 200) {
                const newData = data.message;
                buildTable(newData);
            } else if (data.code === 401) {
                Swal.fire({
                    icon: "error",
                    title: "無權限",
                    text: `身分${data.message}`
                });
            } else {
                Swal.fire({
                    icon: "error",
                    title: "訂單獲取失敗，請重新載入",
                    text: data.message
                });
            }
        });
}

//動態填表格
function buildTable(newData) {
      

    table = $("#OrdersManTable").DataTable({
            id: "OrdersManTable",
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
            data: newData,
            columns: [
            {
                data: "ordNo",
            },
            {
                data: "userName",
            },
            {
                data: "ordCreate",
                targets: 2,
                        render: function (data, type, row) {
                            if (type === 'display' || type === 'filter') {
                                // 將數組轉換為 Date 對象
                                const date = new Date(data[0], data[1] - 1, data[2], data[3], data[4], data[5]);
            
                                // 使用 Date 對象格式化日期，包括時、分和秒
                                const formattedDate = `${date.getFullYear()}/${(date.getMonth() + 1).toString().padStart(2, '0')}/` +
                                                      `${date.getDate().toString().padStart(2, '0')}<br>` +
                                                      `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:` +
                                                      `${date.getSeconds().toString().padStart(2, '0')}`;

                                return formattedDate;
                            }
                    
                            // 其他情況返回原始日期數據
                            return data;
                        }
            },
            {
                data: "orderAmount",
            },
            {
                data: "recipientName",
            },
            {
                data: "recipientPh",
            },
            {
                data: "ordStatus",
                targets:6,
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
                data: "ordPayStatus",
                targets: 7,
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
                data: null, // 明細按钮列
                targets: 8,
                render: function (data, type, row) {
                    if (type === 'display') {
                        // 创建明細按钮元素
                        const detailButton = '<button class="custom-btn btn-3"><span style="color: #4F4F4F;"><strong>明細</strong></span></button>';
                        return detailButton;
                    }
                    return data;
                }
            },
            {
                data: null, //修改按钮列
                targets: 9,
                render: function (data, type, row) {
                    if (type === 'display') {
                        // 创建明細按钮元素
                        //const detailButton = '<button class="custom-btn btn-14">修改</button>';
                        const detailButton = '<button class="custom-btn btn-3"><span><strong>修改</strong></span></button>';
                        return detailButton;
                    }
                    return data;
                }
            },
            {
                data: null, //刪除按钮列
                targets: 10,
                render: function (data, type, row) {
                    if (type === 'display') {
                        // 创建明細按钮元素
                        const detailButton = '<button class="custom-btn btn-11">刪除<div class="dot"></div></button>';
                        return detailButton;
                    }
                    return data;
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
                        targets:[6],
                        createdCell: function (td, cellData, rowData, row, col) {
                            if (cellData == 6) {
                                $(td).css('backgroundColor', '#FFB5B5');
                            }
                            
                        },
                    }
                ]
        });


    // 監聽刪除按鈕
    $('#OrdersManTable tbody').on('click', 'button.custom-btn.btn-11', function (e) {
        e.preventDefault();
        // 获取所选行的数据
        const rowData = table.row($(this).closest('tr')).data();
        // 在这里执行删除操作，可以使用rowData中的数据
        deleteOrder(rowData.ordNo, rowData.ordStatus, this);
    });
}

//刪除訂單fetch
function deleteOrder(ordNo, ordStatus, clickedButton) {

    Swal.fire({
        title: '確認刪除',
        text: '您確定要刪除這筆訂單嗎?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: '確定刪除'
    }).then((result) => {
        if (result.isConfirmed) {
            // 用户点击了"確定刪除"按钮，执行删除操作
            if (ordStatus === 6) {
                
                fetch(config.url + `/manager/deleteOrders/${ordNo}`, {
                    method: 'DELETE',
                    headers: {
                        Authorization_M: token,
                        'Content-Type': 'application/json'
                    }
                })
                .then(response => {
                    if (response.ok) {
                        // 请求成功，处理响应
                        return response.json();
                    } else {
                        throw new Error('刪除失敗');
                    }
                })
                .then(data => {
                    // 删除成功后的处理逻辑
                    Swal.fire(data.message);
                    table.row($(clickedButton).closest('tr')).remove().draw();
                    
                })
                .catch(error => {
                    // 捕获网络请求错误或处理响应中的错误
                    console.error('刪除失敗:', error);
                });
            } else {
                // 订单状态不是6，无法删除
                Swal.fire({
                    icon: 'error',
                    title: '非取消訂單無法刪除'
                });
            }
        }
    });

}