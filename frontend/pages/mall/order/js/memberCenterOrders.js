import config from "../../../../../ipconfig.js";
let dataTable; // 將 dataTable 定義在函數之外
let selectedRow;
//Header Token
const token = localStorage.getItem("Authorization_U");

// 在頁面載入時調用此函數
document.addEventListener('DOMContentLoaded', function () {
     // 使用 DataTable 初始化函數
    fetchUserOrders();
});


// 發送GET請求查詢全部訂單數據
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
            console.log(orders);
            const formattedData = orders.map(order => [
                order.ordNo,
                order.ordCreate, // 訂單日期
                order.orderAmount, // 實付金額
                order.recipientName, // 收件人姓名
                order.recipientPh, // 收件人電話
                order.ordStatus, // 訂單狀態
                order.ordPayStatus, // 付款狀態
                order.paymentUrl, //paymentUrl
                order.paymentMethod
            ]);
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
                        title: '成立時間',
                        targets: 1,
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
                                const searchButton = '<a href="#" class="btn-link find-icon"><i class="fa fa-search"></i></a>';
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
                                const paymentButton = '<a href="#" class="btn-link payMoney-icon" id="buttonContainer"><i class="fa-solid fa-money-bill"></i></a>';
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
                    },
                    {
                        title: '', // 空字串，因為這個欄位不會顯示標題
                        data: null,
                        visible: false,
                        render: function (data, type, row) {
                            if (type === 'display') {
                                // 在這裡處理這個欄位的渲染邏輯
                                return row[7]; // 因為新增了一個 paymentUrl 欄位，所以這裡用索引 7 取得
                            }
                            return null;
                        }
                    },
                    {
                        title: '', // 空字串，因為這個欄位不會顯示標題
                        data: null,
                        visible: false,
                        render: function (data, type, row) {
                            if (type === 'display') {
                                // 在這裡處理這個欄位的渲染邏輯
                                return row[8]; // 因為新增了一個 paymentMethod 欄位，所以這裡用索引 8 取得
                            }
                            return null;
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
                        targets: [0, 1, 2],
                        createdCell: function (td, cellData, rowData, row, col) {
                            $(td).css('width', '11%')
                        },
                    },
                    {
                        targets: [3, 4],
                        createdCell: function (td, cellData, rowData, row, col) {
                            $(td).css('width', '10%')
                        },
                    },
                    {
                        targets: [7, 8, 9],
                        createdCell: function (td, cellData, rowData, row, col) {
                            $(td).css('width', '9%')
                        },
                    },
                    {
                        targets:[6],
                        createdCell: function (td, cellData, rowData, row, col) {
                            if (cellData === 0) {
                                $(td).css('backgroundColor', '#FFB5B5');
                            }
                            
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
                const ordNo = rowData[0]; // 訂單編號在第一列
                const ordPayStatus = rowData[6];
                
                if(ordPayStatus === 0){
                    // 在這裡處理刪除操作，你可以使用rowData中的數據
                    const requestData = {
                        ordNo: ordNo,
                        ordStatus: 6 // 狀態設為6,代表會員取消訂單
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
                            // 點擊確定 刪除!
                            deleteOrder(requestData, selectedRow);
                        }
                    });
                }else{
                    Swal.fire({
                        title: '無法刪除',
                        text: '此訂單已付款完成，無法刪除，若要刪除請聯絡管理員',
                        icon: 'error',
                        confirmButtonColor: '#3085d6',
                        confirmButtonText: '了解'
                    });
                }
                

            });

            // 監聽查詢訂單的點擊事件
            $('#OrdersTable tbody').on('click', 'a.find-icon',function (e) {
                e.preventDefault();
                const rowData = dataTable.row($(this).closest('tr')).data();
                const ordNo = rowData[0];
                getOrderDetailByOrdNo(ordNo);
            });

            // 監聽訂單付款的點擊事件
            $('#OrdersTable tbody').on('click', 'a.payMoney-icon', function (e) {
                e.preventDefault();
                const rowData = dataTable.row($(this).closest('tr')).data();
                const ordNo = rowData[0];
                const ordPrice=rowData[2];
                const paymentUrl=rowData[7];
                const paymentMethod=rowData[8];
                
                // 檢查付款狀態是否為 1（已付款）
                if (paymentUrl) {
                    // 直接跳轉至相應的 URL
                    window.location.href = paymentUrl;
                } else {
                    // 檢查付款狀態是否為 1（已付款）
                    if (rowData[6] === 1) {
                        Swal.fire({
                            title: '無法執行付款操作',
                            text: '該訂單已付款，無法再次執行付款操作。',
                            icon: 'warning',
                            confirmButtonText: '確定'
                        });
                    } else {
                        // 付款操作
                        checkIsPay(ordNo, ordPrice,paymentMethod);
                    }
                }
                
            })

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
            //dataTable.row(selectedRow).remove(); // 從 DataTable 中移除並重新繪製
            dataTable.row(selectedRow).remove().draw(false);
            fetchUserOrders();
        } else {
            Swal.fire('刪除失敗!');
        }
    })
    .catch(error => {
        // 捕获网络请求错误
        console.error('Network error:', error);
    });
}

// 查詢訂單詳情
function getOrderDetailByOrdNo(ordNo) {
    fetch(config.url + "/user/order/" + ordNo, {
        method: "GET",
        headers: {
            'Authorization_U': token,
            'Content-Type': 'application/json'
        },
    })
    .then(response => response.json())
    .then(data => {
        // 處理api
        if (data.code === 200) {
            
            const orderDetail = data.message;
            console.log("訂單詳情:", orderDetail);

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
            <div class="row d-flex justify-content-center" style="color: black;">
                <div>
                    <p><strong>本張訂單編號:</strong> <span id="ordNo">No. ${orderDetail[0].ordNo}</span></p>
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
                    <p><strong>訂單付款時間:</strong> <span id="ordFinish">${formattedOrdFinish}</span></p>
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
                title: "訂單詳情",
                html:htmlString,
                width: 600,
                padding: '3em',
                // color: '#FFE6D9',
                background: "url(images/orderBackGround.png)",
                backdrop: `
                  rgba(255, 238, 221, 0.5)
                  no-repeat
                `
              })
            // 在这里可以将详细信息显示给用户或执行其他操作
        } else {
            console.error("獲取訂單訊息失敗:", data);
        }
    })
}


function getFormattedDate() {
    const now = new Date();
    const oneWeekLater = new Date(now.getTime() + (7 * 24 * 60 * 60 * 1000));

    const year = oneWeekLater.getFullYear();
    const month = String(oneWeekLater.getMonth() + 1).padStart(2, '0');
    const day = String(oneWeekLater.getDate()).padStart(2, '0');
    const hours = String(oneWeekLater.getHours()).padStart(2, '0');
    const minutes = String(oneWeekLater.getMinutes()).padStart(2, '0');
    const seconds = String(oneWeekLater.getSeconds()).padStart(2, '0');

    return `${year}${month}${day}${hours}${minutes}${seconds}`;
}



// 訂單付款(API_1 paymentCreateOrder [建立交易])
function payForOrder(ordNo,ordPrice,paymentMethod) {

    const formattedDate = getFormattedDate();
    
     fetch(config.url + "/user/order/" + ordNo, {
        method: "GET",
        headers: {
            'Authorization_U': token,
            'Content-Type': 'application/json'
        },
    })
    .then(response => response.json())
    .then(data => {
        // 處理api
        if (data.code === 200) {
            
            const orderDetail = data.message;
            const orderDetailList=orderDetail[0].detailList;

            // 將 orderDetailList 映射成 includeItemList
       const includeItemList = orderDetailList.map(item => {
        return {
            "itemName": item.pdName,
            "itemQuantity": item.qty
        };
    });

    let headers;

    if (paymentMethod === 0) {
        headers = {
            "key": "593833005619", 
            "secret": "Ln95pHin6gFE2ev3qXff",
            "merchantCode": "ME10679778",
            "Content-paymentCancelOrderType": "application/json",
            "User-Agent": "FONTIKCET_SYSTEM",
            "X-ignore": "true"
        };
    } else if (paymentMethod === 1) {
        headers = {
            "key": "852689534957",
            "secret": "FzGBjuHatXDjY5eHxec7",
            "merchantCode": "ME10679778",
            "Content-paymentCancelOrderType": "application/json",
            "User-Agent": "FONTIKCET_SYSTEM",
            "X-ignore": "true"
        };
    }


    fetch("https://cors-anywhere.herokuapp.com/https://test-api.fonpay.tw/api/payment/paymentCreateOrder", {
        method: "POST",
        headers: headers,
        body:JSON.stringify( {
             "request":{
                "note":"Test",
               "paymentNo":ordNo,
               "legacyId":"TS1234567",
               "totalPrice":ordPrice,
               "paymentDueDate":`${formattedDate}`,
               "itemName":`${ordNo}`,
                "memberName":"memberNo12",
               "includeItemList":includeItemList,
            //    "callbackUrl"
            },
                "basic": {
                  "appVersion": "0.9",
                  "os": "IOS",
                  "appName": "POSTMAN",
                  "latitude": 24.777678,
                  "clientIp": "61.216.102.83",
                  "lang": "zh_TW",
                  "deviceId": "123456789",
                  "longitude": 121.043175
                }
        })
    }).then(response => response.json())
        .then(res => {
            console.log(res);
           if(res.response.errorCode==0){
            const paymentTransactionId =res.result.payment.paymentTransactionId;
            const paymentUrl =res.result.payment.paymentUrl;
            saveFonPayId(ordNo,paymentTransactionId,paymentUrl);
           }else{
            Swal.fire({
                icon: "error",
                title: res.response.msg
            });
            fetchUserOrders();
           }
            // var newWindow = window.open();
            // newWindow.document.write(res.message); // 插入表單 HTML 內容
            // newWindow.document.close();
            
            
        })
        .catch(error => {
            console.error("Error fetching form:", error);
        });
            
        } else {
            console.error("獲取訂單訊息失敗:", data);
        }
    });

       
}


//saveFonPayId
function saveFonPayId(ordNo,paymentTransactionId,paymentUrl) {
    fetch(config.url+`/user/saveFonPayId/${ordNo}`, {
        method: "PUT",
        headers: {
            "Authorization_U": token,  // 在標頭中帶入 Token
            "Content-Type": "application/json"   // 如果需要，指定內容類型
        },
        body: JSON.stringify({
            "paymentTransactionId":`${paymentTransactionId}`,
            "paymentUrl":`${paymentUrl}`
        })
    }).then(response => response.json())
        .then(res => {
            if (res.code != 200){
                Swal.fire({
                    icon: "error",
                    title: res.message
                });
                
            }else{
                fetchUserOrders();
                window.location.href = paymentUrl;
            }

        })
        .catch(error => {
            console.error("Error fetching form:", error);
        });
}


//確認是否完成付款
function checkIsPay(ordNo,ordPrice,paymentMethod) {
    fetch(config.url+"/user/productMall/order?orderId="+ordNo, {
        method: "GET",
        headers: {
            "Authorization_U": token,  // 在標頭中帶入 Token
            "Content-Type": "application/json"   // 如果需要，指定內容類型
        }
    }).then(response => response.json())
        .then(res => {
            console.log(res);
            if (res.code != 200)
                swal(res.message);
            if (res.message == "isPay") {
                // button.disabled = true;
                console.log(123);
                alert("完成付款");
                // button.textContent = "完成付款"; // 修改按鈕文字為 "完成付款"
                return true;
            }else if(res.message == "unPay"){
                payForOrder(ordNo,ordPrice,paymentMethod);
            }

        })
        .catch(error => {
            console.error("Error fetching form:", error);
        });
        return false;
}