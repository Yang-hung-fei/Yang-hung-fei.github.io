
import { getAcDetails, getAllAc, updateAc } from "./callApi.js";
import { createDataTable, createPagination } from "./pagination.js";

//新增活動

//修改活動
async function showEditModal(activityId) {
    let id = await activityId;
    let fetchData = await getAcDetails(id);
    let modalWrap = null;
    // if (modalWrap != null) {
    //     modalWrap.remove();
    // }
    modalWrap = document.createElement('div');
    modalWrap.innerHTML = `
<div class="modal fade" >
    <div class="modal-dialog">
        <div class="modal-content">
            <form id="editForm">
                <div class="modal-header">
                    <h4 class="modal-title">修改活動</h4>
                    <button type="button" class="close" data-bs-dismiss="modal" aria-hidden="true">
                        x
                    </button>
                </div>
                <div class="modal-body">
                    <div class="form-group">
                        <label for="title">活動主題</label>
                        <input type="text" class="form-control" name="title" id="title" value="${fetchData.title}">
                    </div>
                    <div class="form-group">
                        <label for="activityTime">活動時間</label>
                        <input type="datetime-local" class="form-control" placeholder="選擇日期..."
                            name="activityTime" id="activityTime" value="${fetchData.activityTime}">
                    </div>
                    <div class="form-group">
                        <label for="activityImg">活動圖片</label>
                        <input type="file" class="form-control" name="activityImg" id="activityImg" value="${fetchData.activityPicture}">
                    </div>
                    <div class="form-group">
                        <label for="activityContent">活動內容</label>
                        <textarea class="form-control" name="activityContent" id="activityContent"
                            >${fetchData.content}</textarea>
                    </div>
                    <div class="form-group">
                        <label for="startTime">報名開始時間</label>
                        <input class="form-control" name="startTime" id="startTime" type="date"
                            placeholder="選擇日期.." value="${fetchData.startTime}">
                    </div>
                    <div class="form-group">
                        <label for="endTime">報名截止時間</label>
                        <input class="form-control" name="endTime" id="endTime" type="date"
                            class="form-control" placeholder="選擇日期..." value="${fetchData.endTime}">
                    </div>
                    <div class="form-group">
                        <label for="enterLimit">報名人數限制</label>
                        <input type="text" name="enterLimit" id="enterLimit" class="form-control"
                        value="${fetchData.enrollLimit}">
                    </div>
                    <div class="form-group">
                        <label for="peopleCount">目前報名人數</label>
                        <input type="text" name="peopleCount" id="peopleCount" class="form-control"
                            readonly="readonly" value="${fetchData.peopleCount}">
                    </div>
                    <div class="form-group">
                        <label for="status">活動狀態</label>
                        <input type="text" name="status" id="status" class="form-control"
                            readonly="readonly" value="${fetchData.status === 0 ? "執行中" : "已取消"}">
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button"  id="close" class="btn btn-default" data-bs-dismiss="modal">返回</button>
                    <a herf="#" type="submit" id="editComfirm" onclick = "editData()" class="btn btn-success" >確認修改</a>
                </div>
            </form>
        </div>
    </div>
</div>   
`;


    document.body.append(modalWrap);

    var modal = new bootstrap.Modal(modalWrap.querySelector('.modal'));
    modal.show();

    // 輸入
    let titleValue;
    let activityTime;
    let activityContent;
    let startTime;
    let endTime;
    let enrollLimit;
    let activityImg;

    var updateData = {
        "title": titleValue,
        "content": activityContent,
        "startTime": startTime,
        "endTime": endTime,
        "activityTime": activityTime,
        "activityPicture": null,
        "enrollLimit": enrollLimit,
    };


    let titleValueInputs = document.querySelectorAll('#title');
    titleValueInputs.forEach((titleValueInput) => {
        titleValue = fetchData.title;
        updateData.title = titleValue;
        titleValueInput.addEventListener('input', (e) => {
            titleValue = titleValueInput.value;
            updateData.title = titleValue;
        });
    });
    let activityTimeInputs = document.querySelectorAll('#activityTime');
    activityTimeInputs.forEach((activityTimeInput) => {
        activityTime = fetchData.activityTime;
        updateData.activityTime = activityTime;
        activityTimeInput.addEventListener('input', () => {
            // 處理時間格式
            let activityTimeValue = activityTimeInput.value;
            activityTime = activityTimeValue.toString().replace("T", " ") + ":00";
            updateData.activityTime = activityTime;
        });

    });
    let activityContents = document.querySelectorAll('#activityContent');
    activityContents.forEach((activityContentInput) => {
        activityContent = fetchData.content;
        updateData.content = activityContent;
        activityContentInput.addEventListener('input', () => {
            activityContent = activityContentInput.value;
            updateData.activityContent = activityContent;
            console.log(activityContent);
        });
    });

    let startTimeInputs = document.querySelectorAll('#startTime');
    startTimeInputs.forEach((startTimeInput) => {
        startTime = fetchData.startTime;
        updateData.startTime = startTime;
        startTimeInput.addEventListener('input', () => {
            startTime = startTimeInput.value;
            updateData.startTime = startTime;
        });
    });

    let endTimeInputs = document.querySelectorAll('#endTime');
    endTimeInputs.forEach((endTimeInput) => {
        endTime = fetchData.endTime;
        updateData.endTime = endTime;
        endTimeInput.addEventListener('input', () => {
            endTime = endTimeInput.value;
            updateData.endTime = endTime;
        });
    });

    let enrollLimitInputs = document.querySelectorAll('#enterLimit');
    enrollLimitInputs.forEach((enrollLimitInput) => {
        enrollLimit = fetchData.enrollLimit;
        updateData.enrollLimit = enrollLimit;
        enrollLimitInput.addEventListener('input', () => {
            enrollLimit = enrollLimitInput.value;
            updateData.enrollLimit = enrollLimit;
        });
    });

    //處理圖片轉換成字串
    // let activityImgInput = document.getElementById('activityImg');
    // activityImgInput.value = fetchData.activityImg;
    // activityImgInput.addEventListener('change', () => {
    //     activityImg = activityImgInput.value;
    // });



    let editComfirms = document.querySelectorAll('#editComfirm');
    editComfirms.forEach((editComfirm) => {
        editComfirm.onclick = () => {
            editData();
        }
    });


    async function editData() {

        console.log(updateData);
        let updateResult = await updateAc(activityId, updateData);
        if (updateResult.code === 200) {
            Swal.fire(
                {
                    title: '更新成功',
                    icon: 'success',
                    confirmButtonText: '了解', //　按鈕顯示文字
                }
            ).then((result) => {
                if (result.isConfirmed) {
                    // location.reload();
                    console.log("改變render");
                    let pageData = getAc();
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

async function getAc() {
    // 選取具有 "page-item active" 類別的元素
    const activePageItem = document.querySelector('.page-item.active');
    // 從選取的元素中獲取 data-page 屬性的值
    const pageValue = activePageItem.querySelector('.page-link').getAttribute('data-page');
    let data = await getAllAc(pageValue);
    console.log(data);
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







export { showEditModal };