
import { getUerJoinDetails } from "./callApi.js";
async function joinAcModal(page) {
    let fetchData = await getUerJoinDetails(page);
    //轉換資料
    let pageData = fetchData.message;
    let data = pageData.resList;
    let modalWrap = null;
    let dataList = "";
    let userName;
    // 建立資料清單 list group
    if (data !== undefined) {
        userName = data[0].userName;
        data.forEach(dataDetails => {
            // 建立資料
            dataList += `
                <li class="list-group-item">活動主題: ${dataDetails.activityTitle} -- 活動時間: ${dataDetails.activityTime} --活動狀態: ${dataDetails.activityStatus === 0 ? "執行中" : "已取消"} --你的參加狀態: ${dataDetails.joinStatus === 0 ? "參加中" : "已退出"}</li>
                `;
        });
    }
    if (dataList !== undefined || null) {
        modalWrap = document.createElement('div');
        modalWrap.innerHTML = `
        <div class="modal fade" tabindex="-1">
        <div class="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
            <div class="modal-content">
                <div class="modal-header">
                    <h2 class="modal-title" style="padding-left:30%">${userName}的活動參加清單</h2>
                    <button type="button" class="btn btn-dark" data-bs-dismiss="modal" aria-hidden="true">
                        返回
                    </button>
                </div>
                <div class="modal-body">
                    <div class="row">
                        <ul class="list-group list-group-flush text-start">
                        ${dataList}
                        </ul>
                    </div>
                </div>
                </div>
            </div>
        </div>`;
    }
    document.body.append(modalWrap);

    let modal = new bootstrap.Modal(modalWrap.querySelector('.modal'));
    modal.show();
}

export { joinAcModal };
