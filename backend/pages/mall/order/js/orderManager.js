import config from "../../../../../ipconfig.js";
// let table = new DataTable('#OrdersManTable');
const token = localStorage.getItem("Authorization_M");
// const token = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxIiwiZXhwIjoxNjk0MzM2MzcwfQ.toLrUWNi2xj2zX9GPiXz9-iTij_KctBPcDiRbIb81wE";
let table;
let currentOrdNo; // 儲存當前的 ordNo
//監聽modal
let updateModalEl = new bootstrap.Modal(document.getElementById('updateModal'));

//一進頁面渲染
window.addEventListener("load", function () {
    fetchAndBuildTable();
})
//動態取出訂單
function fetchAndBuildTable() {
    ///manager/getAllOrders?page=0&rows=3
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
                            return '<span style="background-color: #E8FFC4;">訂單取消</span>';
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
                            if (type === "display") {
                                let cellStyle = ''; // 初始化单元格样式
                    
                                if (data === 0) {
                                    cellStyle = 'background-color: #FFD2D2;'; // 未付款
                                }
                    
                                // 使用 style 属性设置单元格样式
                                return '<span style="' + cellStyle + '">' + (data === 0 ? '未付款' : (data === 1 ? '已付款' : '未知狀態')) + '</span>';
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
                        const detailButton = '<button class="custom-btn btn-3 findDetail"><span style="color: #4F4F4F;"><strong>明細</strong></span></button>';
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
                        const detailButton = '<button type="button" class="custom-btn btn-3 update"><span style="color: #4F4F4F;"><strong>修改</strong></span></button>';
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
                        const detailButton = '<button class="custom-btn btn-11 delete">刪除<div class="dot"></div></button>';
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
                }
            ]
        });


    //監聽明細按鈕
    $('#OrdersManTable tbody').on('click', 'button.custom-btn.findDetail', function (e) {
        e.preventDefault();
        // 获取所选行的数据
        const rowData = table.row($(this).closest('tr')).data();
        console.log(rowData.ordNo);
        getOrderDetailByOrdNo(rowData.ordNo);
    });

    //監聽修改按鈕
    $('#OrdersManTable tbody').on('click', 'button.custom-btn.update', function (e) {
        e.preventDefault();

        updateModalEl.show();
        // 获取所选行的数据
        const rowData = table.row($(this).closest('tr')).data();
        currentOrdNo = rowData.ordNo;
        updateOrder(rowData.ordNo);
    });

    // 監聽刪除按鈕
    $('#OrdersManTable tbody').on('click', 'button.custom-btn.delete', function (e) {
        e.preventDefault();
        // 获取所选行的数据
        const rowData = table.row($(this).closest('tr')).data();
        // 在这里执行删除操作，可以使用rowData中的数据
        deleteOrder(rowData.ordNo, rowData.ordStatus, this);
    });
}


//查看訂單詳情fetch
function getOrderDetailByOrdNo(ordNo) {
    fetch(config.url + "/manager/getOrders/" + ordNo, {
        method: "GET",
        headers: {
            'Authorization_M': token,
            'Content-Type': 'application/json'
        },
    })
    .then(response => response.json())
    .then(data => {
        // 處理api
        if (data.code === 200) {
            
            const orderDetail = data.message;
            // console.log("訂單詳情:", orderDetail);

           // 假設 orderDetail[0].ordFinish 是包含日期和時間的陣列
            const ordFinishArray = orderDetail[0].ordFinish;
            // 依次取出陣列中的年、月、日、時、分
            const year = ordFinishArray[0];
            const month = ordFinishArray[1];
            const day = ordFinishArray[2];
            const hour = ordFinishArray[3];
            const minute = ordFinishArray[4];
            
            // 使用 JavaScript 的 Date 類別建立日期物件
            const ordFinishDate = new Date(year, month - 1, day, hour, minute);
            let formattedOrdFinish;
            // 使用 Date 物件的方法取得格式化的日期和時間
            if(year == 1970){
                formattedOrdFinish = "此訂單尚未完成付款";
            }else{
                formattedOrdFinish = ordFinishDate.toLocaleString();
            }

            //定義訂單狀態
            const ordStatusMap = {
                0 : "未出貨",
                1 : "已出貨",
                2 : "已到貨",
                3 : "退貨申請",
                4 : "退貨成功",
                5 : "訂單完成",
                6 : "訂單取消"
            }
            const orderStatus = ordStatusMap[orderDetail[0].ordStatus];
            //定義付款狀態
            const ordPayStatusMap = {
                0 : "未付款",
                1 : "已付款"
            }
            const orderPayStatus = ordPayStatusMap[orderDetail[0].ordPayStatus];
            //定義取貨方式
            const ordPickMap ={
                0 : "店面取貨",
                1 : "超商取貨",
                2 : "宅配到府"
            }
            const orderPick = ordPickMap[orderDetail[0].ordPick];
            //定義評價狀態
            const evaluateStatusMap = {
                0 : "未評價",
                1 : "已評價"
            }
            const orderEvaluateStatus = evaluateStatusMap[orderDetail[0].evaluateStatus];
            let htmlString = `
            <br><br><br>
            <div class="row d-flex justify-content-center" style="color: black;">
                <div>
                    <p style="color: #EA7500;"><strong>本張訂單編號: <span id="ordNo">No. ${orderDetail[0].ordNo}</span></strong></p>
                    <p><strong>訂單狀態:</strong> <span id="ordStatus">${orderStatus}</span></p>
                    <p><strong>付款狀態:</strong> <span id="ordPayStatus">${orderPayStatus}</span></p>
                    <p><strong>取貨方式:</strong> <span id="ordPick">${orderPick}</span></p>
                    <p><strong>商品總金額:</strong> <span id="totalAmount">${orderDetail[0].totalAmount} 元</span></p>
                    <p><strong>本張訂單使用點數:</strong> <span id="userPoint">${orderDetail[0].userPoint} 點</span></p>
                    <p><strong>運費:</strong> <span id="ordFee">${orderDetail[0].ordFee} 元</span></p>
                    <p><strong>實付金額:</strong> <span id="orderAmount">${orderDetail[0].orderAmount} 元</span></p>
                    <p><strong>收件人姓名:</strong> <span id="recipientName">${orderDetail[0].recipientName}</span></p>
                    <p><strong>收件地址:</strong> <span id="recipientAddress">${orderDetail[0].recipientAddress}</span></p>
                    <p><strong>收件人電話:</strong> <span id="recipientPh">${orderDetail[0].recipientPh}</span></p>
                    <p><strong>評價狀態:</strong> <span id="evaluateStatus">${orderEvaluateStatus}</span></p>
                    <p><strong>訂單完成時間:</strong> <span id="ordFinish">${formattedOrdFinish}</span></p>
                </div>
                `;

            // 填充訂單詳細清單
            htmlString += `<h4 style="color: #AD5A5A;"><strong>購買商品清單</strong></h4>`;
            htmlString += `<table border="1">
                <tr  style="justify-content: center;">
                    <th>商品名稱</th>
                    <th>數量</th>
                    <th>價格</th>
                </tr>`;

            orderDetail[0].detailList.forEach((item) => {
            htmlString += `
                <tr style="justify-content: center;">
                    <td>${item.pdName}</td>
                    <td>${item.qty}</td>
                    <td>${item.price} 元</td>
                </tr>`;
            });
            
            htmlString += `</table>`;

            Swal.fire({
                title: "",
                html:htmlString,
                width: 600,
                padding: '3em',
                // color: '#FFE6D9',
                background: "url(images/backOrder.png)",
                backdrop: `
                  rgba(236, 236, 255, 0.2)
                  no-repeat
                `
              })
            // 在这里可以将详细信息显示给用户或执行其他操作
        } else {
            console.error("獲取訂單訊息失敗:", data);
        }
    })
}


const recipientNameEl = document.querySelector('#recipientName');
const recipientAddressEl = document.querySelector('#recipientAddress');
const recipientPhoneEL = document.querySelector('#recipientPhone');
const orderStatusEL = document.querySelector('#orderStatus');
//查詢訂單詳情賦值到modal
function updateOrder(ordNo) {
    fetch(config.url + "/manager/getOrders/" + ordNo, {
        method: "GET",
        headers: {
            'Authorization_M': token,
            'Content-Type': 'application/json'
        },
    })
    .then(response => response.json())
    .then(data => {
        // 在这里处理从后端获取的订单详细信息
        if (data.code === 200) {
            const orderDetail = data.message[0]; // 取第一個
            fillDataInModal(orderDetail);
        } else {
            Swal.fire("獲取失敗:" + data);
            console.error('获取订单详细信息失败:', data);
        }
    })
    .catch(error => {
        Swal.fire("錯誤:" + error);
    });
}

// 把詳細資訊填到modal中
function fillDataInModal(orderDetail) {
    recipientNameEl.value = orderDetail.recipientName;
    recipientAddressEl.value = orderDetail.recipientAddress;
    recipientPhoneEL.value = orderDetail.recipientPh;
    orderStatusEL.value = orderDetail.ordStatus;
    //console.log(orderDetail);
    // 如果需要更新模态框的标题，可以在这里更新
    // const modalTitleEl = document.querySelector('.modal-title');
    // modalTitleEl.textContent = '修改订单'; // 根据需求更新标题
}

// 監聽管理員送出修改資訊
const confirmUpdateEl = document.querySelector('#confirmUpdate');
confirmUpdateEl.addEventListener("click", function (params) {
    const ordNo = currentOrdNo; // 根据你的逻辑获取 ordNo
    const recipientName = recipientNameEl.value;
    const recipientAddress = recipientAddressEl.value;
    const recipientPhone = recipientPhoneEL.value;
    const orderStatus = orderStatusEL.value;

    //傳給後端的json
    const requestData = {
        ordNo: ordNo, 
        ordStatus: orderStatus,
        recipientName: recipientName,
        recipientAddress: recipientAddress,
        recipientPh: recipientPhone
    };

    fetch(config.url + "/manager/patchOrders", {
        method: 'PATCH',
        headers: {
            'Authorization_M': token,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
    })
    .then(response => response.json())
    .then(data => {
        // 处理后端返回的数据
        if (data.code === 200) {
            // 更新前端页面上的订单信息，这里可以根据需要刷新整个表格或仅更新某一行
            // 更新成功的处理逻辑
            Swal.fire(data.message);
            updateDataTableWithNewData();
        } else {
            // 更新失败的处理逻辑
            Swal.fire(data.message);
        }
    })
    .catch(error => {
        console.error('Error updating order:', error);
    });

    // 关闭模态框
    $('#updateModal').modal('hide');
})

// 在成功更新后调用此函数
function updateDataTableWithNewData() {
    // 清除旧的 DataTable
    table.clear().draw();
    fetchAndBuildTable();
    // 添加新的数据到 DataTable
    // table.rows.add(newData).draw();
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


