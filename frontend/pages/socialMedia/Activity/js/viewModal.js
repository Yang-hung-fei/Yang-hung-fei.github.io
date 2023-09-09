
// import { getAcDetails, getAllAc, updateAc } from "./callApi.js";
// import { createDataTable, createPagination } from "./pagination.js";

// //修改活動
// async function showViewModal(activityId) {
//     let id = await activityId;
//     let fetchData = await getAcDetails(id);
//     let modalWrap = null;
//     // if (modalWrap != null) {
//     //     modalWrap.remove();
//     // }
//     modalWrap = document.createElement('div');
//     modalWrap.innerHTML = `
// <div class="modal fade" tabindex="-1">
//     <div class="modal-dialog">
//         <div class="modal-content">
//             <form id="queryForm">
//                 <div class="modal-header">
//                     <h4 class="modal-title">查看活動資訊</h4>
//                     <button type="button" class="close" data-bs-dismiss="modal" aria-hidden="true">
//                         x
//                     </button>
//                 </div>
//                 <div class="modal-body">
//                     <div class="form-group">
//                         <label for="title">活動主題</label>
//                         <input type="text" class="form-control" name="title" id="title" value="${fetchData.title}">
//                     </div>
//                     <div class="form-group">
//                         <label for="activityTime">活動時間</label>
//                         <input type="datetime-local" class="form-control" placeholder="選擇日期..."
//                             name="activityTime" id="activityTime" value="${fetchData.activityTime}">
//                     </div>
//                     <div class="form-group">
//                         <label for="activityImg">活動圖片</label>
//                         <input type="file" class="form-control" name="activityImg" id="activityImg" value="${fetchData.activityPicture}">
//                     </div>
//                     <div class="form-group">
//                         <label for="activityContent">活動內容</label>
//                         <textarea class="form-control" name="activityContent" id="activityContent"
//                             >${fetchData.content}</textarea>
//                     </div>
//                     <div class="form-group">
//                         <label for="startTime">報名開始時間</label>
//                         <input class="form-control" name="startTime" id="startTime" type="date"
//                             placeholder="選擇日期.." value="${fetchData.startTime}">
//                     </div>
//                     <div class="form-group">
//                         <label for="endTime">報名截止時間</label>
//                         <input class="form-control" name="endTime" id="endTime" type="date"
//                             class="form-control" placeholder="選擇日期..." value="${fetchData.endTime}">
//                     </div>
//                     <div class="form-group">
//                         <label for="enterLimit">報名人數限制</label>
//                         <input type="text" name="enterLimit" id="enterLimit" class="form-control"
//                         value="${fetchData.enrollLimit}">
//                     </div>
//                     <div class="form-group">
//                         <label for="peopleCount">目前報名人數</label>
//                         <input type="text" name="peopleCount" id="peopleCount" class="form-control"
//                             readonly="readonly" value="${fetchData.peopleCount}">
//                     </div>
//                     <div class="form-group">
//                         <label for="status">活動狀態</label>
//                         <input type="text" name="status" id="status" class="form-control"
//                             readonly="readonly" value="${fetchData.status === 0 ? "執行中" : "已取消"}">
//                     </div>
//                 </div>
//                 <div class="modal-footer">
//                     <button type="button"  id="close" class="btn btn-default" data-bs-dismiss="modal">返回</button>
//                 </div>
//             </form>
//         </div>
//     </div>
// </div>
// `;


//     document.body.append(modalWrap);

//     let modal = new bootstrap.Modal(modalWrap.querySelector('.modal'));
//     modal.show();


//處理圖片轉換成字串
// let activityImgInput = document.getElementById('activityImg');
// activityImgInput.value = fetchData.activityImg;
// activityImgInput.addEventListener('change', () => {
//     activityImg = activityImgInput.value;
// });

// }









// export { showViewModal };