
import { getAllRotePic, getOneRotePic, updateNews } from "./PicRoteList.js";
import { createDataTable, createPagination } from "./PicRoteList.js";

//修改news
async function editRotePic(picNo) {
    let id = await picNo;
    let fetchData = await getAllRotePic(id);
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
                    <h4 class="modal-picLocateUrl">修改輪播圖</h4>
                    <button type="button" class="close" data-bs-dismiss="modal" aria-hidden="true">
                        x
                    </button>
                </div>
                <div class="modal-body">
                    
                    <div class="form-group">
                        <label for="picLocateUrl">輪播圖編號</label>
                        <input type="text" class="form-control" name="picNo" id="picNo" value="${fetchData.picNo}">
                    </div>
                    <div class="form-group">
                        <label for="picLocateUrl">輪播圖URL</label>
                        <input type="text" class="form-control" name="picLocateUrl" id="picLocateUrl" value="${fetchData.picLocateUrl}">
                    </div>
                    
                    <div class="form-group">
                        <label for="pic">輪播圖圖片</label>
                            <input type="file" class="form-control" name="pic" id="pic">
                        <div class="mt-3">
                            <img id="imageOutput" src="data:image/*;base64,${fetchData.pic}" alt="此輪播圖沒有照片" class="img-fluid"><br>
                         </div>
                    </div>
                    <div class="form-group">
                        <label for="status">輪播圖狀態</label>
                        <input type="text" name="status" id="status" class="form-control"
                            readonly="readonly" value="${fetchData.picRotStatus === 0 ? "下架" : "上架"}">
                    </div>
                    <div class="form-group">
                        <label for="picRotStart">輪播圖開始日期</label>
                        <input type="datetime-local" class="form-control" placeholder="選擇日期..."
                            name="picRotStart" id="picRotStart" value="${fetchData.picRotStart}">
                    </div>
                    <div class="form-group">
                        <label for="picRotEnd">輪播圖結束日期</label>
                        <input type="datetime-local" class="form-control" placeholder="選擇日期..."
                            name="picRotEnd" id="picRotEnd" value="${fetchData.picRotEnd}">
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
   
    let picLocateUrl;
    let picRotStatus;
    let picRotStart;
    let picRotEnd;
    let pic;

    var updateData = {
   
        "picLocateUrl": picLocateUrl,
        "picRotStatus": picRotStatus,
        "picRotStart": picRotStart,
        "picRotEnd": picRotEnd,
        "pic": pic,
       
    };

    let picNos = document.querySelectorAll('#picNo');
    picNos.forEach((newsNoInput) => {
        picNo = fetchData.content;
        updateData.content = picNo;
        newsNoInput.addEventListener('input', () => {
            picNo = newsNoInput.value;
            updateData.content = picNo;
        });
    });


    let picLocateUrlValueInputs = document.querySelectorAll('#picLocateUrl');
    picLocateUrlValueInputs.forEach((picLocateUrlValueInput) => {
        picLocateUrlValue = fetchData.picLocateUrl;
        updateData.picLocateUrl = picLocateUrlValue;
        picLocateUrlValueInput.addEventListener('input', (e) => {
            picLocateUrlValue = picLocateUrlValueInput.value;
            updateData.picLocateUrl = picLocateUrlValue;
        });
    });

    let picRotStatuss = document.querySelectorAll('#picRotStatus');
    picRotStatuss.forEach((picRotStatusInput) => {
        picRotStatus = fetchData.content;
        updateData.content = picRotStatus;
        picRotStatusInput.addEventListener('input', () => {
            picRotStatus = picRotStatusInput.value;
            updateData.content = picRotStatus;
        });
    });

    let picRotStarts = document.querySelectorAll('#picRotStart');
    picRotStarts.forEach((picRotStartInput) => {
        picRotStart = fetchData.content;
        updateData.content = picRotStart;
        picRotStartInput.addEventListener('input', () => {
            picRotStart = picRotStartInput.value;
            updateData.content = picRotStart;
        });
    });

    let picRotEnds = document.querySelectorAll('#picRotEnd');
    picRotEnds.forEach((picRotEndInput) => {
        picRotEnd = fetchData.content;
        updateData.content = picRotEnd;
        picRotEndInput.addEventListener('input', () => {
            picRotEnd = picRotEndInput.value;
            updateData.content = picRotEnd;
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
        let updateResult = await updateNews(picNo, updateData);
        if (updateResult.code === 200) {
            Swal.fire(
                {
                    picLocateUrl: '更新成功',
                    icon: 'success',
                    confirmButtonText: '了解', //　按鈕顯示文字
                }
            ).then((result) => {
                if (result.isConfirmed) {
                    let pageData = getOneRotePic();
                    createDataTable(pageData);
                    createPagination(pageData);
                }
            })
        } else {
            Swal.fire(
                {
                    picLocateUrl: '更新失敗',
                    icon: 'error',
                    confirmButtonText: '了解', //　按鈕顯示文字
                }
            );
        }
        modal.hide();

    }

}



async function getOneRotePic() {
    // 選取具有 "page-item active" 類別的元素
    const activePageItem = document.querySelector('.page-item.active');
    // 從選取的元素中獲取 data-page 屬性的值
    const pageValue = activePageItem.querySelector('.page-link').getAttribute('data-page');
    let data = await getAllRotePic(pageValue);
    let pageData = {
        //目前所在頁數(預設為0)
        curentPage: await data.curentPage,
        //一頁有幾筆資料
        pageSize: await data.pageSize,
        totalPage: await data.totalPage,
        fetchData: await data.resList,
    }
    return pageData;
}


export { editRotePic };