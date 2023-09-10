
import { getActivityDetails, joinActivity, leaveActivity } from "./callApi.js";
//使用者查詢活動
async function showViewModal(activityId) {
    let id = await activityId;
    let fetchData = await getActivityDetails(id);
    let modalWrap = null;
    // if (modalWrap != null) {
    //     modalWrap.remove();
    // }
    let textContent = fetchData.content;
    let formattedContent = textContent.replace(/\n/g, '<br>')
    modalWrap = document.createElement('div');
    modalWrap.innerHTML = `
    <div class="modal fade" tabindex="-1">
    <div class="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
        <div class="modal-content">
            <div class="modal-header">
                <h2 class="modal-title" style="padding-left:40%">${fetchData.title}</h2>
                <button type="button" class="btn btn-dark" data-bs-dismiss="modal" aria-hidden="true">
                    返回
                </button>
            </div>
            <div class="modal-body">
                    <div class="row">
                        <div class="card mb-3">
                        <img src="data:image/*;base64,${fetchData.activityPicture}" alt="此活動沒有照片" class="card-img-top" >
                        <ul class="list-group list-group-flush text-center">
                            <li class="list-group-item">報名開始時間 ${fetchData.startTime} 報名結束時間 ${fetchData.endTime}</li>
                            <li class="list-group-item">報名人數限制 ${fetchData.enrollLimit} <br/>目前報名人數 ${fetchData.peopleCount}</li>
                            <li class="list-group-item">活動狀態${fetchData.status === 0 ? " 執行中" : "已取消"}</li>
                         </ul>
                        </div>
                        <div class="col-lg-12 col-md-12 col-12">
                            <div class="content">
                                   
                                <div>
                                    <h4>活動內容</h4>
                                    <div style="font-size:18px">${formattedContent}</div>
                                </div>
                            </div>
                        </div>
                    </div>
            </div>
            <div class="modal-footer shadow-sm p-3 mb-5 bg-body rounded">
                <h4 class="text-danger"> 活動時間 : ${fetchData.activityTime}</h4>
                <button type="button" id="joinAc" class="btn btn-success">加入活動</button>
                <button type="button" id="leaveAc" class="btn btn-danger">退出活動</button>
            </div>

        </div>
    </div>
</div>
`;


    document.body.append(modalWrap);

    let modal = new bootstrap.Modal(modalWrap.querySelector('.modal'));
    modal.show();

    //監聽加入活動事件
    const joinActivities = document.querySelectorAll('#joinAc');
    joinActivities.forEach((joinAc) => {
        joinAc.addEventListener('click', async function (e) {
            const { value: number } = await Swal.fire({
                title: '請輸入參加人數',
                input: 'number',
                showCancelButton: true,
            })
            if (number) {
                let joinReq = {
                    activityId: id,
                    count: number
                }
                let data = await joinActivity(joinReq);
                if (data.code == 400) {
                    Swal.fire(`${data.message}`);
                } else {
                    Swal.fire(`參加人數為: ${number}`);
                }
                modal.hide();

            }

        });

    });
    //監聽退出活動事件
    const leaveActivities = document.querySelectorAll('#leaveAc');
    leaveActivities.forEach((leaveAc) => {
        leaveAc.addEventListener('click', async function (e) {
            let data = await leaveActivity(id);
            if (data.code == 400) {
                Swal.fire(`${data.message}`);
            } else {
                Swal.fire(`${data.message}`);
            }
            modal.hide();
        });

    });

}

export { showViewModal };
