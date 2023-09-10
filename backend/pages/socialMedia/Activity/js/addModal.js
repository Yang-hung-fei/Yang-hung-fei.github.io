
import { getAllAc, createAc } from "./callApi.js";

//新增活動
async function showAddModal() {
    let modalWrap = null;
    modalWrap = document.createElement('div');
    modalWrap.innerHTML = `
<div class="modal fade tabindex="-1">
    <div class="modal-dialog">
        <div class="modal-content">
            <form id="addForm">
                <div class="modal-header">
                    <h4 class="modal-title">新增活動</h4>
                    <button type="button" class="close" data-bs-dismiss="modal" aria-hidden="true">
                        x
                    </button>
                </div>
                <div class="modal-body">
                  <div class="form-group">
                        <label for="title">活動主題</label>
                        <input type="text" class="form-control" name="title" id="title">
                    </div>
                    <div class="form-group">
                        <label for="activityTime">活動時間</label>
                        <input type="datetime-local" class="form-control" placeholder="選擇日期..."
                            name="activityTime" id="activityTime">
                    </div>
                    <div class="form-group">
                        <label for="activityImg">活動圖片</label>
                            <input type="file" accept="image/*" class="form-control" name="activityImg" id="activityImg">
                        <div class="mt-3">
                            <img id="imageOutput" src="" alt="此活動沒有照片" class="img-fluid"><br>
                        </div>
                    </div>
                   
                    <div class="form-group">
                        <label for="activityContent">活動內容</label>
                        <textarea class="form-control" name="activityContent" id="activityContent"
                            ></textarea>
                    </div>
                    <div class="form-group">
                        <label for="startTime">報名開始時間</label>
                        <input class="form-control" name="startTime" id="startTime" type="date"
                            placeholder="選擇日期..">
                    </div>
                    <div class="form-group">
                        <label for="endTime">報名截止時間</label>
                        <input class="form-control" name="endTime" id="endTime" type="date"
                            class="form-control" placeholder="選擇日期...">
                    </div>
                    <div class="form-group">
                        <label for="enterLimit">報名人數限制</label>
                        <input type="text" name="enterLimit" id="enterLimit" class="form-control"
                        >
                    </div>  
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-default" data-bs-dismiss="modal">取消新增</button>
                    <a herf="#" type="submit" id="addComfirm" class="btn btn-success" >確認新增</a>
                </div>
            </form>
        </div>
    </div>
</div>   
`;
    document.body.append(modalWrap);
    let modal = new bootstrap.Modal(modalWrap.querySelector('.modal'));
    modal.show();
    const addComfirm = document.querySelector('#addComfirm');
    addComfirm.addEventListener('click', async (e) => {
        await addData();
    })

    // 輸入
    var activityImg;
    var titleValue;
    var activityTime;
    var activityContent;
    var startTime;
    var endTime;
    var enrollLimit;


    var postData = {
        "title": titleValue,
        "content": activityContent,
        "startTime": startTime,
        "endTime": endTime,
        "activityTime": activityTime,
        "activityPicture": activityImg,
        "enrollLimit": enrollLimit,
    };
    const title = document.querySelector('#title');
    title.addEventListener('input', (e) => {
        titleValue = e.target.value;
        postData.title = titleValue;
    });

    const activityTimeInput = document.querySelector('#activityTime');
    activityTimeInput.addEventListener('input', (e) => {
        activityTime = e.target.value.toString().replace("T", " ") + ":00";
        postData.activityTime = activityTime;
    });

    const activityContentInput = document.querySelector('#activityContent');
    activityContentInput.addEventListener('input', (e) => {
        activityContent = e.target.value;
        postData.content = activityContent;
    });

    const startTimeInput = document.querySelector('#startTime');
    startTimeInput.addEventListener('input', (e) => {
        startTime = e.target.value;
        postData.startTime = startTime;
    });


    const endTimeInput = document.querySelector('#endTime');
    endTimeInput.addEventListener('input', (e) => {
        endTime = e.target.value;
        postData.endTime = endTime;
    });

    const enrollLimitInput = document.querySelector('#enterLimit');
    enrollLimitInput.addEventListener('input', (e) => {
        enrollLimit = e.target.value;
        postData.enrollLimit = enrollLimit;
    });
    var activityImgOputs = document.body.querySelectorAll('#imageOutput');
    var activityImgInputs = document.querySelectorAll('#activityImg');
    activityImgInputs.forEach((activityImgInput) => {
        activityImgInput.addEventListener('change', (e) => {
            let file = e.target.files[0];
            if (file) {
                toBase64(file).then((reslut) => {
                    //轉換成base64字串傳輸資料(這邊要解析格式)
                    let base64String = (reslut.split(',')[1]);
                    //建立預覽圖
                    activityImgOputs.forEach((activityImgOput) => {
                        activityImgOput.src = reslut;
                    })
                    postData.activityPicture = base64String;
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

    async function addData() {
        console.log("新增成功");
        let createResult = await createAc(postData);
        if (createResult.code === 200) {
            Swal.fire(
                {
                    title: '新增成功',
                    icon: 'success',
                    confirmButtonText: '了解', //　按鈕顯示文字
                }
            ).then((result) => {
                if (result.isConfirmed) {
                    getAllAc();
                }
            })
        } else {
            Swal.fire(
                {
                    title: '新增失敗',
                    icon: 'error',
                    confirmButtonText: '了解', //　按鈕顯示文字
                }
            );
        }
        modal.hide();

    }

}
export { showAddModal };
