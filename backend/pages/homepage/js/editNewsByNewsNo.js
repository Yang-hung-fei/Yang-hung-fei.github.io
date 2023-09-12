
// import { getAllNews, getOneNews, updateNews } from "./NewsList.js";
// import { createDataTable, createPagination } from "./NewsList.js";

//修改news
async function editNewsByNewsNo(newsNo) {
    let id = await newsNo;
    let fetchData = await getAllNews(id);
    let modalWrap = null;
    // if (modalWrap != null) {
    //     modalWrap.remove();
    // }
    modalWrap = document.createElement('div');
    modalWrap.innerHTML = `
<div class="modal fade" tabindex="-1">
    <div class="modal-dialog">
        <div class="modal-content">
            <form id="editNews">
                <div class="modal-header">
                    <h4 class="modal-title">修改最新消息</h4>
                    <button type="button" class="close" data-bs-dismiss="modal" aria-hidden="true">
                        x
                    </button>
                </div>
                <div class="modal-body">
                    <div class="form-group">
                        <label for="title">消息標題</label>
                        <input type="text" class="form-control" name="newsTitle" id="newsTitle" value="${fetchData.newsTitle}">
                    </div>
                    <div class="form-group">
                        <label for="title">消息編號</label>
                        <input type="text" class="form-control" name="newsNo" id="newsNo" value="${fetchData.newsNo}">
                    </div>
                    <div class="form-group">
                        <label for="newsCont">消息內容</label>
                        <input type="datetime-local" class="form-control" placeholder="選擇日期..."
                            name="newsCont" id="newsCont" value="${fetchData.newsCont}">
                    </div>
                    <div class="form-group">
                        <label for="pic">消息圖片</label>
                            <input type="file" class="form-control" name="pic" id="pic">
                        <div class="mt-3">
                            <img id="imageOutput" src="data:image/*;base64,${fetchData.pic}" alt="此消息沒有照片" class="img-fluid"><br>
                         </div>
                    </div>
                    <div class="form-group">
                        <label for="status">消息狀態</label>
                        <input type="text" name="status" id="status" class="form-control"
                            readonly="readonly" value="${fetchData.newsStatus === 0 ? "下架" : "上架"}">
                    </div>
                    <div class="form-group">
                        <label for="updateTime">報名開始時間</label>
                        <input class="form-control" name="updateTime" id="updateTime" type="date"
                            placeholder="選擇日期.." value="${fetchData.updateTime}">
                    </div>
                    
                    
                </div>
                <div class="modal-footer">
                    <button type="button" class="close btn btn-default" data-bs-dismiss="modal">返回</button>
                    <a herf="#" type="submit" id="editComfirm" onclick = "editData()" class="btn btn-success" >確認修改</a>
                </div>
            </form>
        </div>
    </div>
</div>   
`;


    document.body.append(modalWrap);

    let modal = new bootstrap.Modal(modalWrap.querySelector('.modal'));
    modal.show();

    // 輸入
   
    let newsTitle;
    let newsCont;
    let newsStatus;
    let updateTime;
    let pic;

    var updateData = {
   
        "newsTitle": newsTitle,
        "newsCont": newsCont,
        "newsStatus": newsStatus,
        "updateTime": updateTime,
        "pic": pic,
       
    };

    let newsNos = document.querySelectorAll('#newsNo');
    newsNos.forEach((newsNoInput) => {
        newsNo = fetchData.content;
        updateData.content = newsNo;
        newsNoInput.addEventListener('input', () => {
            newsNo = newsNoInput.value;
            updateData.content = newsNo;
        });
    });


    let titleValueInputs = document.querySelectorAll('#title');
    titleValueInputs.forEach((titleValueInput) => {
        titleValue = fetchData.title;
        updateData.title = titleValue;
        titleValueInput.addEventListener('input', (e) => {
            titleValue = titleValueInput.value;
            updateData.title = titleValue;
        });
    });

    let newsConts = document.querySelectorAll('#newsCont');
    newsConts.forEach((newsContInput) => {
        newsCont = fetchData.content;
        updateData.content = newsCont;
        newsContInput.addEventListener('input', () => {
            newsCont = newsContInput.value;
            updateData.content = newsCont;
        });
    });

    let newsStatuss = document.querySelectorAll('#newsStatus');
    newsStatuss.forEach((newsStatusInput) => {
        newsStatus = fetchData.content;
        updateData.content = newsStatus;
        newsStatusInput.addEventListener('input', () => {
            newsStatus = newsStatusInput.value;
            updateData.content = newsStatus;
        });
    });
    
    let updateTimeInputs = document.querySelectorAll('#updateTime');
    updateTimeInputs.forEach((updateTimeInput) => {
        updateTime = fetchData.updateTime;
        updateData.updateTime = updateTime;
        updateTimeInput.addEventListener('input', () => {
            let updateTimeValue = updateTimeInput.value;
            updateTime = updateTimeValue.toString().replace("T", " ") + ":00";
            updateData.updateTime = updateTime;

        });
    });

    //處理圖片
    var picOputs = document.querySelectorAll('#imageOutput');
    var picInputs = document.querySelectorAll('#pic');
    picInputs.forEach((picInput) => {
        //預設為之前的圖片
        updateData.pic = fetchData.pic;
        picInput.addEventListener('change', (e) => {
            let file = e.target.files[0];
            if (file) {

                toBase64(file).then((reslut) => {
                    //轉換成base64字串傳輸資料(這邊要解析格式)
                    let base64String = (reslut.split(',')[1]);
                    //建立預覽圖
                    picOputs.forEach((picOput) => {
                        console.log(updateData);
                        picOput.src = reslut;
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


    let editComfirms = document.querySelectorAll('#editComfirm');
    editComfirms.forEach((editComfirm) => {
        editComfirm.onclick = () => {
            editData();
        }
    });


    async function editData() {
        let updateResult = await updateNews(newsNo, updateData);
        if (updateResult.code === 200) {
            Swal.fire(
                {
                    title: '更新成功',
                    icon: 'success',
                    confirmButtonText: '了解', //　按鈕顯示文字
                }
            ).then((result) => {
                if (result.isConfirmed) {
                    let pageData = getOneNews();
                    createDataTable(pageData);
                    createPagination(pageData);
                }
            })
        } else {
            Swal.fire(
                {
                    title: '更新失敗',
                    icon: 'error',
                    confirmButtonText: '了解', //　按鈕顯示文字
                }
            );
        }
        modal.hide();

    }

}



// async function getOneNews() {
//     // 選取具有 "page-item active" 類別的元素
//     const activePageItem = document.querySelector('.page-item.active');
//     // 從選取的元素中獲取 data-page 屬性的值
//     const pageValue = activePageItem.querySelector('.page-link').getAttribute('data-page');
//     let data = await getAllNews(pageValue);
//     let pageData = {
//         //目前所在頁數(預設為0)
//         curentPage: await data.curentPage,
//         //一頁有幾筆資料
//         pageSize: await data.pageSize,
//         totalPage: await data.totalPage,
//         fetchData: await data.resList,
//     }
//     return pageData;
// }


export { editNewsByNewsNo };