import config from "../../../../../ipconfig.js";

const token = localStorage.getItem("Authorization_M");
let table;
let currentPdNo;



//一進頁面渲染
window.addEventListener("load", function () {
    fetchAndBuildTable();
})

//動態取出訂單
function fetchAndBuildTable() {
    fetch(config.url + `/manager/getallProduct`, {
        method: "GET",
        headers: {
            Authorization_M: token, // 使用Manager Token
            "Content-Type": "application/json"
        }
    })
        .then(response => response.json())
        .then(data => {
            console.log(data);
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
                    title: "商品獲取失敗，請重新載入",
                    text: data.message
                });
            }
        });
}

//動態填表格
function buildTable(newData) {

    table = $("#PdCollectTable").DataTable({
        id: "PdCollectTable",
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
                data: "pdNo",
            },
            {
                data: "pdName",
            },
            {
                data: "pdPrice",
            },
            {
                data: "pdStatus",
                targets: 3,
                render: function (data, type, row) {
                    // 修改动态生成按钮的代码
                    if (type === "display") {
                        // 创建一个按钮容器
                        const buttonsContainer = document.createElement("div");
                        buttonsContainer.className = "status-buttons";

                        // 创建上架按钮
                        const upButton = document.createElement("button");
                        upButton.type = "button";
                        upButton.className = "custom-btn btn-3 update up-button";
                        upButton.textContent = "上架";
                        upButton.setAttribute("data-pdno", row.pdNo);

                        // 创建下架按钮
                        const downButton = document.createElement("button");
                        downButton.type = "button";
                        downButton.className = "custom-btn btn-3 update down-button";
                        downButton.textContent = "下架";
                        downButton.setAttribute("data-pdno", row.pdNo);

                        // 根据商品状态设置按钮颜色
                        if (data === 0) {
                            upButton.style.backgroundColor = "rgb(246, 255, 119)";
                            downButton.style.backgroundColor = "rgb(175, 175, 175)";
                        } else if (data === 1) {
                            upButton.style.backgroundColor = "rgb(175, 175, 175)";
                            downButton.style.backgroundColor = "rgb(246, 255, 119)";
                        } else {
                            // 未知状态，可以根据需求设置默认样式
                            upButton.style.backgroundColor = "gray";
                            downButton.style.backgroundColor = "gray";
                        }

                        // 添加按钮到按钮容器
                        buttonsContainer.appendChild(upButton);
                        buttonsContainer.appendChild(downButton);

                        // 返回按钮容器的 HTML 作为渲染结果
                        return buttonsContainer.outerHTML;
                    }

                    return data;
                }
            },
            {
                data: null,  //修改
                targets: 4,
                render: function (data, type, row) {
                    if (type === 'display') {
                        // 創建修改按鈕元素
                        const detailButton = '<button type="button" class="custom-btn btn-3 update"><span style="color: #4F4F4F;"><strong>修改</strong></span></button>';
                        return detailButton;
                    }
                    return data;
                }
            },


        ],
        language: {      // 語言設定
            "url": "//cdn.datatables.net/plug-ins/1.13.6/i18n/zh-HANT.json"
        },
        columnDefs: [
            {
                targets: '_all',
                className: 'text-center'
            }
        ]

    });

    // 动态添加按钮点击事件监听器
    $('#PdCollectTable tbody').on('click', 'button.up-button', function () {
        const pdNo = $(this).data('pdNo'); // 获取按钮上的pdno属性值

        Swal.fire({
            title: '確認?',
            text: "是否確定要上架!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: '確認'
        }).then((result) => {
            if (result.isConfirmed) {
                updateProductStatus(pdNo, 0); // 0 表示上架状态
                Swal.fire(
                    '成功!',
                    '修改成功!!!',
                    'success'
                )
            }
        })

    });

    $('#PdCollectTable tbody').on('click', 'button.down-button', function () {
        const pdNo = $(this).data('pdNo'); // 获取按钮上的pdno属性值

        Swal.fire({
            title: '確認?',
            text: "是否確定要下架!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: '確認'
        }).then((result) => {
            if (result.isConfirmed) {
                updateProductStatus(pdNo, 1); // 0 表示上架状态
                Swal.fire(
                    '成功!',
                    '修改成功!!!',
                    'success'
                )
            }
        })

    });

    //監聽修改按鈕
    $('#PdCollectTable tbody').on('click', 'button.custom-btn.update', function (e) {
        e.preventDefault();

        updateModalEl.show();
        // 获取所选行的数据
        const rowData = table.row($(this).closest('tr')).data();
        currentPdNo = rowData.pdNo;
        updatePd(rowData.pdNo);
    });

}


// 更新商品状态的函数
function updateProductStatus(pdNo, newStatus) {
    const updateStatusRequest = {
        pdNo: pdNo,
        pdStatus: newStatus
    };

    fetch(config.url + `/manager/updateOneProductStatus`, {
        method: 'PUT',
        headers: {
            Authorization_M: token,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(updateStatusRequest)
    })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            if (data.code === 200) {
                // 更新状态成功
                console.log('商品狀態更新成功');
                // 这里可以根据需要刷新数据表格等
                console.log(data);
                fetchAndBuildTable(); //重載入

            } else {
                console.error('商品狀態更新失敗');
            }
        })
        .catch(error => {
            console.error('請求更新時發生錯誤:', error);
        });


    // const pdNo = document.getElementById('pdNo');
    // const pdName = document.getElementById('pdName');
    // const pdDescription = document.getElementById('Description');
    // const pdPrice = document.getElementById('pdPrice');
    // const pdStatus = document.getElementById('pdStatus');
    // const pdPic = document.getElementById('pdPic');

    const pdNameEl = document.querySelector('#pdName');
    const pdDescriptionEl = document.querySelector('#pdDescription');
    const pdPriceEl = document.querySelector('#pdPrice');
    const pdStatusEL = document.querySelector('#pdStatus');
    const pdPicEL = document.querySelector('#pdPic');

    //顯示商品詳情modal
    function update(pdNo) {
        fetch(config.url + "/manager/getProduct?pdNo=" + pdNo, {
            method: "GET",
            headers: {
                'Authorization_M': token,
                'Content-Type': 'application/json'
            },
        })
            .then(response => response.json())
            .then(data => {
                if (data.code === 200) {
                    const pdDetail = data.message[0]; // 取第一個
                    fillDataInModal(pdDetail);
                } else {
                    Swal.fire("獲取失敗:" + data);
                    console.error('獲取商品詳細訊息失敗:', data);
                }
            })
            .catch(error => {
                Swal.fire("錯誤:" + error);
            });
    }

    //填入資料到Modal
    function fillDataInModal(pdDetail) {
        pdNameEl.value = pdDetail.pdName;
        pdDescriptionEl.value = pdDetail.pdDescription;
        pdPriceEl.value = pdDetail.pdPrice;
        pdStatusEL.value = pdDetail.pdStatus;
        pdPicEL.value = pdDetail.pdPic;
    }

    // 監聽管理員送出修改資訊
    const confirmUpdateEl = document.querySelector('#confirmUpdate');
    confirmUpdateEl.addEventListener("click", function (params) {
        const ordNo = currentPdNo; // 根据你的逻辑获取 PdNo
        const recipientName = recipientNameEl.value;
        const recipientAddress = recipientAddressEl.value;
        const recipientPhone = recipientPhoneEL.value;
        const orderStatus = orderStatusEL.value;



    }