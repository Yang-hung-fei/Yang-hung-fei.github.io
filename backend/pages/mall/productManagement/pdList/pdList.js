import config from "../../../../../ipconfig.js";

const token = localStorage.getItem("Authorization_M");
let table;
let currentPdNo;
let currentPdPicNo;
let currentPdOrderList;


//監聽modal
let updateModalEl = new bootstrap.Modal(document.getElementById('updateModal'));



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
                        const detailButton = `<button type="button" class="custom-btn btn-3 update" id="update"><span style="color: #4F4F4F;"><strong>修改</strong></span></button>`;
                        return detailButton;
                    }
                    return data;
                }
            }


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
    $('#PdCollectTable tbody').on('click', 'button.up-button', (event) => {


        const pdNo = $(event.currentTarget).attr('data-pdno');
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
            }
        })

    });

    $('#PdCollectTable tbody').on('click', 'button.down-button', (event) => {
        const pdNo = $(event.currentTarget).attr('data-pdno');
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
                updateProductStatus(pdNo, 1); // 0 表示下架状态
            }
        })

    });

    //監聽修改按鈕
    $('#PdCollectTable tbody').on('click', '#update', function (e) {
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
            if (data.code === 200) {
                // 更新状态成功
                Swal.fire(
                    '成功!',
                    `${data.message}`,
                    'success'
                )
                fetchAndBuildTable(); //重載入

            } else {
                Swal.fire(
                    '失敗!',
                    `${data.message}`,
                    'error'
                )
            }
        })
        .catch(error => {
            console.error('請求更新時發生錯誤:', error);
        });

}


const pdNameEl = document.querySelector('#pdName');
const pdDescriptionEl = document.querySelector('#pdDescription');
const pdPriceEl = document.querySelector('#pdPrice');
const pdStatusEl = document.querySelector('#pdStatus');
const pdPicEl = document.querySelector('#pdPic');
//顯示商品詳情modal
function updatePd(pdNo) {
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
                const pdDetail = data.message;
                fillDataInModal(pdDetail);
            } else {
                Swal.fire("獲取失敗:" + data);
            }
        })
        .catch(error => {
            Swal.fire("錯誤:" + error);
        });
}



// 填入数据到 Modal
function fillDataInModal(pdDetail) {

    let pdPicDiv = document.getElementById('pdPicDiv');
    pdPicDiv.innerHTML = '';
    const arrayLength = pdDetail.base64Image.length;

    for (let i = 0; i < arrayLength; i++) {
        const imageContainer = document.createElement("div");
        const pdPicNo = pdDetail.pdPicNo[i]; // 获取 pdPicNo
        const pdOrderList = pdDetail.pdOrderList[i]; // 获取 pdOrderList

        imageContainer.classList.add("image-container");
        imageContainer.style.maxWidth = "200px";
        imageContainer.style.width = "100%";
        imageContainer.style.zIndex = '0';
        imageContainer.style.position = 'relative';
        imageContainer.setAttribute("attrPicId", pdPicNo);
        imageContainer.setAttribute("attrPicOrder", pdOrderList);

        //建叉叉
        const closeButton = document.createElement("span");
        closeButton.classList.add("close-button");
        closeButton.innerHTML = `<i class="fa-solid fa-circle-xmark" style="font-size: 20px;color: black;"></i>`;
        closeButton.style.zIndex = "1";
        closeButton.style.position = "absolute";
        closeButton.style.top = "0";
        closeButton.style.right = "0";

        // 根据 pdOrderList 值来决定是否显示删除按钮
        if (pdOrderList == 1) {
            closeButton.style.display = "none"; // 如果 pdOrderList 不等于 1，隐藏删除按钮
        }

        closeButton.addEventListener("click", function () {
            // 获取要删除的图片的唯一标识符，比如 pdPicNo
            const pdPicNo = imageContainer.getAttribute("attrPicId");
            const picData = new FormData();
            picData.append("pdPicNo", pdPicNo);


            // 发送删除请求到后端
            fetch(config.url + "/manager/deletePic?pdPicNo=" + pdPicNo, {
                method: 'POST',
                headers: {
                    'Authorization_M': token,
                },
                body: picData
            })
                .then(response => response.json())
                .then(data => {
                    if (data.code === 200) {
                        // 删除成功后，从 DOM 中删除图片容器
                        imageContainer.remove();
                    } else {
                        // 删除失败的处理逻辑
                        Swal.fire(data.message);
                    }
                })
                .catch(error => {
                    console.error('刪除商品圖片時發生錯誤:', error);
                });
        });

        const img = document.createElement("img");
        img.src = `data:image/png;base64,${pdDetail.base64Image[i]}`;
        img.style.maxWidth = "200px";
        img.style.width = "100%";
        img.style.objectFit = "cover";
        img.style.position = "relative";
        img.style.marginTop = "5px";

        imageContainer.appendChild(closeButton);
        // imageContainer.appendChild(editButton); // 添加修改按钮
        // imageContainer.appendChild(fileInput); // 添加上传文件的输入框
        imageContainer.appendChild(img);

        pdPicDiv.appendChild(imageContainer);

        
        

        // //創建更換圖片按鈕
        // const editButton = document.createElement("button");
        // editButton.type = "button";
        // editButton.className = "custom-btn btn-3 edit-button";
        // editButton.textContent = "更換";
        // editButton.style.backgroundColor = "rgb(112, 109, 109)"; // 设置按钮颜色
        // editButton.style.color = "white"; // 设置字体颜色

        // // 创建上传文件的输入框
        // const fileInput = document.createElement("input");
        // fileInput.type = "pdPic";
        // fileInput.style.display = "none"; // 隐藏输入框

        // // 添加修改按钮的点击事件处理程序
        // editButton.addEventListener("click", function () {
        //     // 当点击修改按钮时触发上传文件的输入框
        //     fileInput.click();
        // });

        // // 添加上传文件的输入框的 change 事件处理程序
        // fileInput.addEventListener("change", function () {
        //     const newImage = fileInput.files[0]; // 获取用户选择的新图片

        //     // 检查是否选择了文件
        //     if (newImage) {
        //         // 创建 FormData 对象，用于将新图片发送到后端
        //         const formData = new FormData();
        //         formData.append("pdNo", currentPdNo);
        //         formData.append("pdPicNo", currentPdPicNo);
        //         formData.append("pdOrderList", currentPdOrderList);
        //         formData.append("pdPic", newImage);

        //         // 发送新图片到后端
        //         fetch(config.url + "/manager/changePic", {
        //             method: 'PUT',
        //             headers: {
        //                 'Authorization_M': token,
        //             },
        //             body: formData
        //         })
        //             .then(response => response.json())
        //             .then(data => {
        //                 if (data.code === 200) {
        //                     // 更新成功后，刷新商品图片
        //                     updatePd(currentPdNo);
        //                 } else {
        //                     Swal.fire(data.message);
        //                 }
        //             })
        //             .catch(error => {
        //                 console.error('上传商品图片时发生错误:', error);
        //             });
        //     }
        // });

        
    }

    //新增商品圖片
    const newPic = document.getElementById("newPic");
    newPic.removeEventListener("change", previewPic); // 刪除舊事件監聽器
    // newPic.addEventListener("change", previewPic);
    newPic.addEventListener("change", () => {
        // let pre = document.getElementById("previewPic")
        // pre.hidden = false;
        previewPic();

    });


    // 新增預覽圖片的函數
    function previewPic() {
        const preview = document.getElementById("previewPic");
        const pic = document.getElementById("newPic");
        const file = pic.files[0];

        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                preview.style.display = 'block';
                preview.src = e.target.result;
            };
            reader.readAsDataURL(file);
        } else {
            preview.style.display = 'none';
        }
    }

    // 確認按鈕
    const commitBtn = document.getElementById("commitBtn");

    // 確認修改
    commitBtn.addEventListener("click", () => {
        addPic();
    });

    function addPic() {
        // const pdNo = currentPdNo;
        // const pdPicNo = currentPdPicNo;
        // const pdOrderList = currentPdOrderList;

        const picData = new FormData();
        picData.append("pdNo", currentPdNo);
        picData.append("pdPicNo", currentPdPicNo);
        picData.append("pdOrderList", currentPdOrderList);
        console.log(picData);
        
        const selectedFile = newPic.files[0];
        if (selectedFile) {
            picData.append(`pdPic`, selectedFile);
        }
        fetch(config.url + "/manager/createPic", {
            method: "POST",
            body: picData,
            headers: {
                Authorization_M: token,
            },
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.code === 200) {
                    Swal.fire({
                        icon: "success",
                        title: "新增成功",
                        text: data.message,
                    });
                    clearForm();
                } else {
                    Swal.fire({
                        icon: "error",
                        title: "新增失敗",
                        text: data.message,
                    });
                }
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    }

    pdNameEl.value = pdDetail.pdName;
    pdDescriptionEl.value = pdDetail.pdDescription;
    pdPriceEl.value = pdDetail.pdPrice;
    pdStatusEl.value = pdDetail.pdStatus;
}




// 監聽管理員送出修改資訊
const confirmUpdateEl = document.querySelector('#confirmUpdate');
confirmUpdateEl.addEventListener("click", async function (params) {
    const pdNo = currentPdNo; // 根据你的逻辑获取 PdNo
    const pdName = pdNameEl.value;
    const pdDescription = pdDescriptionEl.value;
    const pdPrice = pdPriceEl.value;
    const pdStatus = pdStatusEl.value;
    const pdPic = pdPicEl.value;

    //傳給後端的json
    const requestData = new FormData();

    requestData.append("pdNo", currentPdNo);
    requestData.append("pdName", pdNameEl.value);
    requestData.append("pdDescription", pdDescriptionEl.value);
    requestData.append("pdPrice", pdPriceEl.value);
    requestData.append("pdStatus", pdStatusEl.value);
    requestData.append("pdPic", pdPicEl.value);
    // const requestData = {
    //     pdNo: pdNo,
    //     pdName: pdName,
    //     pdDescription: pdDescription,
    //     pdPrice: pdPrice,
    //     pdStatus: pdStatus,
    //     pdPic: pdPic
    // };

    // console.log(requestData);

    await fetch(config.url + "/manager/updateProduct", {
        method: 'PUT',
        headers: {
            'Authorization_M': token,
            // 'Content-Type': 'application/json'
        },
        body: requestData
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

