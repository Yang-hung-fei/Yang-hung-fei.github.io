import config from "../../../../ipconfig.js";
// import { editNewsByNewsNo } from "./editNewsByNewsNo.js";


let token = localStorage.getItem("Authorization_M");
const mainUrl = config.url;
const newsUrl = "/manager/homepageManage";
const updateNewsUrl = mainUrl + newsUrl + "/editNews";
const getAllNewsUrl = mainUrl + newsUrl + "/getAllNews";
const deleteNewsUrl = mainUrl + newsUrl + "/deleteNewsByNewsNo";



// ----------------------------------------- 頁面載入 ----------------------------------------- //
window.addEventListener('load', function () {
    getAllNews();

});


// ----------------------------------------- 建立分頁 -----------------------------------------//
// 更新資料表格和分頁
function createDataTable(data) {
    // // 選擇分頁元素
    let tbody = document.getElementById("dataTableList");
    let pagination = document.querySelector(".pagination");
    // 清空tbody表格
    tbody.innerHTML = "";
    let dataList = '';
    // 建立資料表格
    data.forEach(dataDetails => {
        // 建立資料
        dataList += `
               <tr>
               <td>${dataDetails.newsNo}</td>
               <td>${dataDetails.newsTitle}</td>
               <td>${dataDetails.newsCont}</td>
               <td>${dataDetails.newsStatus == 1 ? "上架中" : "已下架"}</td>
               <td>${dataDetails.updateTime}</td>

               <td><button class="modify" type="button" data-id="${dataDetails.newsNo}" id="editBtn"
               style="background: #325aab;border-style: none;color: #f1ecd1; width: 60px; height: 30px; font-size: 14px;">
               修改</button>
               </td>
               <td>
               <button class="delete" type="button" data-id="${dataDetails.newsNo}" id="deleteBtn"
               style="background: #f44336; border-style: none; color: #ffffff; width: 60px; height: 30px; font-size: 14px">刪除</button>
               </td>
               </tr>`;

    });
    tbody.innerHTML = dataList;

    const deleteBtns = document.querySelectorAll("#deleteBtn");
    deleteBtns.forEach((btn) => {
        btn.addEventListener('click', async function (e) {
            let dataId = this.dataset.id;
            await openDeleteModal(dataId);

        })
    })


    const modifyBtns = document.querySelectorAll("#editBtn");

    modifyBtns.forEach((btn) => {
        btn.addEventListener("click", async function (e) {
            let dataId = this.dataset.id;
            await openEditModal(dataId);
        });
    });



}

async function createPagination(data) {
    let pagination = document.querySelector(".pagination");
    //建立分頁 -清空分頁
    pagination.innerHTML = "";
    // 總頁數
    let totalPages = await data.totalPage;
    //預設為1
    let currentPage = await data.curentPage;

    // 創建分頁頁碼
    for (let i = 1; i <= totalPages; i++) {
        const pageItem = document.createElement("li");
        pageItem.classList.add("page-item");
        if (i === currentPage + 1) {
            pageItem.classList.add("active");
        }
        const pageLink = document.createElement("button");
        pageLink.classList.add("page-link");
        pageLink.textContent = i;
        pageLink.setAttribute('data-page', i - 1);
        pageItem.appendChild(pageLink);
        pagination.appendChild(pageItem);
    }
}


// ----------------------------------------- Modal ----------------------------------------- //


async function openDeleteModal(newsNo) {
    let modalWrap = null;
    modalWrap = document.createElement('div');
    modalWrap.innerHTML = `
    <div class="modal fade" tabindex="-1">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h4 class="modal-title">刪除最新消息</h4>
                <button type="button" class="close" data-bs-dismiss="modal" aria-hidden="true">&times;</button>
            </div>
            <div class="modal-body">
                <p>確定要刪除此最新消息??</p>
                <p class="text-danger"><small>取消後資料不會復原喔!!!</small></p>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-default" data-bs-dismiss="modal">返回</button>
                <a herf="#" type="button" id="deleteNews" data-id=${newsNo}
                    class="btn btn-danger">確認刪除
                </a>
            </div>
        </div>
    </div>
</div>`;
    document.body.append(modalWrap);

    let modal = new bootstrap.Modal(modalWrap.querySelector('.modal'));
    modal.show();


    const deleteBtn = document.querySelectorAll('#deleteNews');

    deleteBtn.forEach(button => {
        button.addEventListener('click', async function (e) {
            // 在這個事件處理程序中，你可以獲取要刪除的元素的信息，然後執行刪除操作
            const newsNo = e.target.getAttribute('data-id'); // 假設你使用了data-newsNo屬性來存儲新聞編號
            // 調用刪除函數
            let deleteResult = await deleteNews(newsNo);

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
                        getAllNews();
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
//=====================================================================
function dateConvert(timestamp) {
    // 使用Date物件來轉換timestamp為日期
    const date = new Date(timestamp);

    // 使用Date物件的方法取得年、月和日
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // 月份是從0開始計算的，所以要加1
    const day = String(date.getDate()).padStart(2, '0');

    // 將年、月、日組合成格式化的日期字串
    const formattedDate = `${year}-${month}-${day}`

    return formattedDate;


}

async function openEditModal(newsNo) {
    let id = await newsNo;
    let modalWrap = null;
    modalWrap = document.createElement('div');
    let dataList = await getOneNews(id);
    let imageData = await getOneNewsPic(newsNo);
    let data = dataList.message;
    let image = imageData.message;
    console.log(image);
    console.log(data);
    // <option selected>${data.newsStatus === 1 ? "上架" : "下架"}</option>
    // <option value="0">下架</option>
    // <option value="1">上架</option>
    let selectOption;
    if (data.newsStatus === 1) {
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
                    <h4 class="modal-title">修改消息</h4>
                    <button type="button" class="close" data-bs-dismiss="modal" aria-hidden="true">
                        x
                    </button>
                </div>
                <div class="modal-body">
                    <div class="form-group">
                        <label for="newsNo">消息編號</label>
                        <input type="text" class="form-control" name="newsNo" id="newsNo" value="${data.newsNo}" readonly="readonly">
                    </div>
                    <div class="form-group">
                        <label for="newsTitle">消息標題</label>
                        <input type="text" class="form-control"
                            name="newsTitle" id="newsTitle" value="${data.newsTitle}">
                    </div>
                    <div class="form-group">
                        <label for="newsCont">消息內容</label>
                        <textarea style="height: 150px" class="form-control" name="newsCont" id="newsCont"
                            >${data.newsCont}</textarea>
                    </div>
                    <div class="form-group">
                        <label for="newsStatus">上架狀態</label>
                        <select class="form-select"
                                style="margin-right: 20px; display: inline-block;width: 350px;border-color: #a2b6df;">
                               ${selectOption}
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="updateTime">更新日期</label>
                        <p>${dateConvert(data.updateTime)}</p>
                    </div>
                    <div class="form-group">
                        <label for="newsPic">消息圖片</label>
                            <input type="file" class="form-control" name="newsPic" id="newsPic">
                        <div class="mt-3">
                            <img id="imageOutput" src="data:image/*;base64,${image.newsPic}" alt="此消息沒有照片" class="img-fluid"><br>
                         </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="close btn btn-default" data-bs-dismiss="modal">返回</button>
                    <a herf="#" type="button" id="editConfirm" class="btn btn-success" >確認修改</a>
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


   

    let updateData = {
        "newsNo": newsNo,
        "newsTitle": data.newsTitle,
        "newsCont": data.newsCont,
        "newsStatus": data.newsStatus,
        "newsPic": data.newsPic

    } 
    console.log("data news Pic"+data.newsPic);

    const newsTitles = document.querySelectorAll("#newsTitle");

    newsTitles.forEach((newsTitle) => {
        newsTitle.addEventListener('input', (e) => {
            let userInput = e.target.value;
            alert(userInput);
            updateData.newsTitle = userInput;
            console.log(updateData);
        })
    })

    const newsConts = document.querySelectorAll("#newsCont");
    newsConts.forEach((newsCont) => {
        newsCont.addEventListener('input', (e) => {
            let userInput = e.target.value;
            updateData.newsCont = userInput;
            console.log(updateData);
        })
    })

    const selectOptions = document.querySelectorAll(".form-select");
    selectOptions.forEach((selectOption) => {
        selectOption.addEventListener('change', (e) => {
            let userInput = e.target.value;
            updateData.newsStatus = userInput;
            console.log(updateData);
        })
    })

    //處理圖片
    const imgOputs = document.querySelectorAll('#imageOutput');
    var picInputs = document.querySelectorAll('#newsPic');
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
                    updateData.newsPic = base64String;
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

     

    const editConfirmBtns = document.querySelectorAll("#editConfirm");
    editConfirmBtns.forEach((editConfirm) => {
        editConfirm.addEventListener('click', async function (e) {
            let updateResult = await updateNews(updateData); 
        
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
                        getAllNews();
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

// ----------------------------------------- Modal ----------------------------------------- //



// ----------------------------------------- api ----------------------------------------- //

// ------------------------- 刪除  ------------------------- //
async function deleteNews(newsNo) {
    return fetch(deleteNewsUrl + `?newsNo=${newsNo}`, {
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
async function updateNews(updateData) {
    console.log("updateData Pic :"+updateData.newsPic);
    return fetch(updateNewsUrl, {
        method: "PUT",
        headers: {
            Authorization_M: token,
            "Content-Type": "application/json",
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
// =================================================== //


// ------------------------- 查詢單一news  ------------------------- //

// get newsCont
async function getOneNews(newsNo) {
    let params = new URLSearchParams({
        newsNo: newsNo
    });
    return fetch(mainUrl + newsUrl + "/getOneNews?" + params.toString(), {
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

// ------------------------- 查詢all news  ------------------------- //
function getAllNews() {

    fetch(getAllNewsUrl, {
        method: "GET",
        headers: {
            "Authorization_M": token
        }
    })
        .then(response => response.json())
        .then(data => {
            let newsPageData = data.message;
            return newsPageData;
        }).then(pageData => {
            //create table data and pagination
            createDataTable(pageData);

        })
        .catch(err => {
            console.error(err.message);
        });
}

// ------------------------- 查詢單一newsPic  ------------------------- //

// get one newsPic
async function getOneNewsPic(newsNo) {
    let params = new URLSearchParams({
        newsNo: newsNo
    });
    return fetch(mainUrl + newsUrl + "/getOneNewsPic?" + params.toString(), {
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




// ----------------------------------------- api ----------------------------------------- //









