import config from "../../../../ipconfig.js";
// import { searchRotePic } from "./searchRotePic.js";


// localStorage.setItem("Authorization_M", "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxIiwiZXhwIjoxNjk0NjgwMzQ3fQ.zAe7mBf5Bcg00KiYAdKk05pmviYQSzh1Nh0S0PqtD1k");
// let token = localStorage.getItem("Authorization_M");
let token = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxIiwiZXhwIjoxNjk1MTEyMTY5fQ.sxUdslcIhLls03FW7kMolgBZkDTTeg5i0mGdxVDwkiA";

const mainUrl = config.url;
const picRoteUrl = "/manager/homepageManage";
const updateRotePicUrl = mainUrl + picRoteUrl + "/editRotePicByPicNo";
const getRotePicUrl = mainUrl + picRoteUrl;
const getAllRotePicUrl = getRotePicUrl + "/getRotePic";
const deleteRotePicUrl = getRotePicUrl + "/deleteRotePicByPicNo";
// const getOneRotePicUrl = getRotePicUrl + "/getOneRotePic";

// ------------------------- 頁面載入  ------------------------- //
window.addEventListener('load', function () {
    getAllRotePic();
});

// ------------------------- 建立分頁  ------------------------- //
// 更新資料表格和分頁
function createDataTable(data) {
    // // 選擇分頁元素

    let tbody = document.getElementById("dataTableList");
    let pagination = document.querySelector(".pagination");
    //  console.log(pagination);
    // 清空tbody表格
    tbody.innerHTML = "";
    let dataList = '';
    let fetchData = data.fetchData;



    // 建立資料表格
    fetchData.forEach(dataDetails => {
        // 建立資料
        dataList += `
               <tr>
               <td name="picNo">${dataDetails.picNo}</td>
               <td style="width:250px; ">${dataDetails.picLocateUrl}</td>
               <td style="width:200px;height:200px; "> <img style="object-fit: contain; width:200px;height:200px;" src="data:image/*;base64,${dataDetails.pic}" alt="" class="" style="width:100%;height:100%;"></td>
               <td>${dataDetails.picRotStatus == 1 ? "上架中" : "已下架"}</td>
               <td>${dataDetails.picRotStart}</td>             
               <td>${dataDetails.picRotEnd}</td>

               <td><button class="btn btn-primary modify" type="button" data-id="${dataDetails.picNo}"  id="editBtn"
               style="background: #325aab;border-style: none;color: #f1ecd1; width: 60px; height: 30px; font-size: 14px;"
               >修改</button>
               </td>
               <td>
               <button class="delete" type="button" data-id="${dataDetails.picNo}" id="deleteBtn"
               style="background: #f44336; border-style: none; color: #ffffff; width: 60px; height: 30px; font-size: 14px">刪除</button>
               </td>
               </tr>`;

    });
    tbody.innerHTML = dataList;

    //=================delete==========

    const deleteBtns = document.querySelectorAll("#deleteBtn");
    deleteBtns.forEach((btn) => {
        btn.addEventListener('click', async function (e) {
            let dataId = this.dataset.id;
            await openDeleteModal(dataId);

        })
    })

    //=================

    const modifyBtns = document.querySelectorAll("#editBtn");

    modifyBtns.forEach((btn) => {
        btn.addEventListener("click", async function (e) {
            let dataId = this.dataset.id;
            console.log(dataId);
            await openEditModal(dataId);
        });
    });





    // //建立分頁 -清空分頁
    // pagination.innerHTML = "";
    // // 總頁數
    // let totalPages = data.totalPage;
    // let currentPage = data.curentPage;

    // // 創建分頁頁碼
    // for (let i = 1; i <= totalPages; i++) {
    //     const pageItem = document.createElement("li");
    //     pageItem.classList.add("page-item");
    //     if (i === currentPage) {
    //         pageItem.classList.add("active");
    //     }
    //     const pageLink = document.createElement("a");
    //     pageLink.classList.add("page-link");
    //     pageLink.href = `${i}`;
    //     pageLink.textContent = i;
    //     pageItem.appendChild(pageLink);
    //     pagination.appendChild(pageItem);
    // }

}




// ----------------------------------------- Modal ----------------------------------------- //

async function openDeleteModal(picNo) {
    let modalWrap = null;
    modalWrap = document.createElement('div');
    modalWrap.innerHTML = `
    <div class="modal fade" tabindex="-1">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h4 class="modal-title">刪除輪播圖</h4>
                <button type="button" class="close" data-bs-dismiss="modal" aria-hidden="true">&times;</button>
            </div>
            <div class="modal-body">
                <p>確定要刪除此輪播圖??</p>
                <p class="text-danger"><small>取消後資料不會復原喔!!!</small></p>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-default" data-bs-dismiss="modal">返回</button>
                <a herf="#" type="button" id="deleteRotePic" data-id=${picNo}
                    class="btn btn-danger">確認刪除
                </a>
            </div>
        </div>
    </div>
</div>`;
    document.body.append(modalWrap);

    let modal = new bootstrap.Modal(modalWrap.querySelector('.modal'));
    modal.show();


    const deleteBtn = document.querySelectorAll('#deleteRotePic');

    deleteBtn.forEach(button => {
        button.addEventListener('click', async function (e) {
            // 在這個事件處理程序中，獲取要刪除的元素的信息，然後執行刪除操作
            const picNo = e.target.getAttribute('data-id'); // 使用了data-newsNo屬性來存輪播圖編號
            // 調用刪除函數
            let deleteResult = await deleteRotePic(picNo);

            if (deleteResult.code === 200) {
                Swal.fire(
                    {
                        title: '刪除成功',
                        icon: 'success',
                        confirmButtonText: '了解', //　按鈕顯示文字
                    }
                ).then((result) => {
                    if (result.isConfirmed) {
                        // 選取具有 "page-item active" 類別的元素
                        getAllRotePic();
                    }
                })
            } else {
                Swal.fire(
                    {
                        title: '刪除失敗',
                        icon: 'error',
                        confirmButtonText: '了解', //　按鈕顯示文字
                    }
                );
            }
            modal.hide();

        });
    });



}

//========================================

async function openEditModal(picNo) {
    let id = await picNo;
    let modalWrap = null;
    modalWrap = document.createElement('div');
    let dataList = await getOneRotePic(id);
    let imageData = await getOneRotePic(picNo);
    let data = dataList.message;
    let image = imageData.message;
    // <option selected>${data.newsStatus === 1 ? "上架" : "下架"}</option>
    // <option value="0">下架</option>
    // <option value="1">上架</option>
    let selectOption;
    if (data.picRotStatus === 1) {
        selectOption = `
        <option value="1">上架</option>
        <option value="0">下架</option>
        `}
    else {
        selectOption = `
            <option value="0">下架</option>
            <option value="1">上架</option>
            `}


    if (selectOption !== undefined) {
        modalWrap.innerHTML = `
    <div class="modal fade" tabindex="-1">
    <div class="modal-dialog">
        <div class="modal-content">
            <form id="editForm">
                <div class="modal-header">
                    <h4 class="modal-title">修改輪播圖</h4>
                    <button type="button" class="close" data-bs-dismiss="modal" aria-hidden="true">
                        x
                    </button>
                </div>
                <div class="modal-body">
                    <div class="form-group">
                        <label for="picNo">輪播圖編號</label>
                        <input type="text" class="form-control" name="picNo" id="picNo" value="${data.picNo}" readonly="readonly">
                    </div>
                    <div class="form-group">
                        <label for="picLocateUrl">URL</label>
                        <input type="text" class="form-control"
                            name="picLocateUrl" id="picLocateUrl" value="${data.picLocateUrl}">
                    </div>
                    <div class="form-group">
                        <label for="picRotStatus">上架狀態</label>
                        <select class="form-select"
                                style="margin-right: 20px; display: inline-block;width: 350px;border-color: #a2b6df;">
                               ${selectOption}
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="picRotStart">輪播圖起始時間</label>
                        <input type="date" class="form-control" placeholder="選擇日期..."
                            name="picRotStart" id="picRotStart" value="${data.picRotStart}">
                    </div>
                    <div class="form-group">
                    <label for="picRotEnd">輪播圖結束時間</label>
                    <input type="date" class="form-control" placeholder="選擇日期..."
                        name="picRotEnd" id="picRotEnd" value="${data.picRotEnd}">
                </div>
                    <div class="form-group">
                        <label for="pic">輪播圖片</label>
                            <input type="file" class="form-control" name="pic" id="pic">
                        <div class="mt-3">
                            <img id="imageOutput" src="data:image/*;base64,${image.pic}" alt="此編號沒有照片" class="img-fluid"><br>
                         </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="close btn btn-default" data-bs-dismiss="modal">返回</button>
                    <a herf="#" type="sumbit" id="editConfirm" class="btn btn-success" >確認修改</a>
                </div>
            </form>
        </div>
    </div>
</div>  
`;

    }

    document.body.append(modalWrap);

    let modal = new bootstrap.Modal(modalWrap.querySelector('.modal'));
    modal.show();


    let picLocateUrl;
    let pic;
    let picRotStatus;
    let picRotStart;
    let picRotEnd;

    let updateData = {
        "picNo": picNo,
        "picLocateUrl": picLocateUrl,
        "pic": pic,
        "picRotStatus": picRotStatus,
        "picRotStart": picRotStart,
        "picRotEnd": picRotEnd

    }
    updateData.picLocateUrl = data.picLocateUrl;
    updateData.pic = data.pic;
    updateData.picRotStatus = data.picRotStatus;
    updateData.picRotStart = data.picRotStart;
    updateData.picRotEnd = data.picRotEnd;



    const picLocateUrls = document.querySelectorAll("#picLocateUrl");
    picLocateUrls.forEach((picLocateUrl) => {
        picLocateUrl.addEventListener('input', (e) => {
            let userInput = e.target.value;
            updateData.picLocateUrl = userInput;
        })
    })


    const picRotStarts = document.querySelectorAll("#picRotStart");
    picRotStarts.forEach((picRotStart) => {
        picRotStart.addEventListener('input', (e) => {
            let userInput = e.target.value;
            updateData.picRotStart = userInput;

        })
    });

    //處理圖片
    const imgOputs = document.querySelectorAll('#imageOutput');
    var picInputs = document.querySelectorAll('#pic');
    picInputs.forEach((picInput) => {
        //預設為之前的圖片

        picInput.addEventListener('change', (e) => {
            let file = e.target.files[0];
            if (file) {

                toBase64(file).then((reslut) => {
                    //轉換成base64字串傳輸資料(這邊要解析格式)
                    let base64String = (reslut.split(',')[1]);
                    //建立預覽圖
                    imgOputs.forEach((imgOput) => {
                        imgOput.src = reslut;
                    })
                    updateData.pic = base64String;
                }).catch(error => {
                    console.log(error);
                });
            }
        });
    })

    const toBase64 = file => new Promise((resolve, reject) => {
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });

    const picRotEnds = document.querySelectorAll("#picRotEnd");
    picRotEnds.forEach((picRotEnd) => {
        picRotEnd.addEventListener('input', (e) => {
            let userInput = e.target.value;
            updateData.picRotEnd = userInput;
        })
    })

    const selectOptions = document.querySelectorAll(".form-select");
    selectOptions.forEach((selectOption) => {
        selectOption.addEventListener('change', (e) => {
            let userInput = e.target.value;
            updateData.picRotStatus = userInput;
        })
    })



    const editConfirmBtns = document.querySelectorAll("#editConfirm");
    editConfirmBtns.forEach((editConfirm) => {
        editConfirm.addEventListener('click', async function (e) {
            console.log(updateData);
            // let formData = objectToFormData(updateData);
            let updateResult = await updateRotePic(updateData);

            if (updateResult.code === 200) {
                Swal.fire(
                    {
                        title: updateResult.message,
                        icon: 'success',
                        confirmButtonText: '了解', //　按鈕顯示文字
                    }
                ).then((result) => {
                    if (result.isConfirmed) {
                        // 選取具有 "page-item active" 類別的元素
                        getAllRotePic();
                    }
                })
            } else {
                Swal.fire(
                    {
                        title: updateResult.message,
                        icon: 'error',
                        confirmButtonText: '了解', //　按鈕顯示文字
                    }
                );
            }
            modal.hide();
        })
    })


}



// ----------------------------------------- Modal 結束----------------------------------------- //



// ----------------------------------------- api ----------------------------------------- //


// ------------------------- 刪除  ------------------------- //
async function deleteRotePic(picNo) {
    return fetch(deleteRotePicUrl + `?picNo=${picNo}`, {
        method: "DELETE",
        headers: {
            "Authorization_M": token
        }
    })
        .then(response => response.json())
        .then(data => {
            return data;
        })
        .catch(err => {
            console.error(err.message);
        });
}





// ------------------------- 更新  ------------------------- //
async function updateRotePic(updateData) {
    return fetch(updateRotePicUrl, {
        method: "PUT",
        headers: {
            Authorization_M: token,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(updateData)
    })
        .then(res => {
            return res.json();
        }).then(data => {
            return data;
        })
        .catch(err => {
            console.log(err.message);
        });
}


// // ------------------------- 查詢單一Rote pic  ------------------------- //

async function getOneRotePic(picNo) {
    let params = new URLSearchParams({
        picNo: picNo
    });
    return fetch(getRotePicUrl + "/getOneRotePic?" + params.toString(), {
        method: "GET",
        headers: {
            Authorization_M: token,
            "Content-Type": "application/json"
        },
    })
        .then(res => {
            return res.json();
        }).then(data => {
            return data;
        })
        .catch(err => {
            console.error(err.message);
        });
}



// ------------------------- 查詢all Rote pic  ------------------------- //
function getAllRotePic() {

    fetch(getAllRotePicUrl, {
        method: "GET",
        headers: {
            "Authorization_M": token,
            "Content-Type": "application/json"
        }
    })
        .then(response => response.json())
        .then(data => {
            let RotePicPageData = data.message;
            let pageData = {
                //目前所在頁數(預設為0)
                curentPage: RotePicPageData.currentPageNumber + 1,
                //一頁有幾筆資料
                pageSize: RotePicPageData.pageSize,
                totalPage: RotePicPageData.totalPage,
                fetchData: RotePicPageData,
            }
            return pageData;

        }).then(pageData => {
            //create table data and pagination
            createDataTable(pageData);
        })
    // .catch(err => {
    //     console.error(err.message);
    // });
}

// ----------------------------------------- api ----------------------------------------- //



