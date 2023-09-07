//新增活動
async function showCancelModal(activityId) {
    let modalWrap = null;
    modalWrap = document.createElement('div');
    modalWrap.innerHTML = `
        <div class="modal fade tabindex="- 1">
            < div id = "cancelActivity" class="modal fade" >
                <div class="modal-dialog">
                    <div class="modal-content">
                        <form>
                            <div class="modal-header">
                                <h4 class="modal-title">取消活動</h4>
                                <button type="button" class="close" data-bs-dismiss="modal"
                                    aria-hidden="true">&times;</button>
                            </div>
                            <div class="modal-body">
                                <p>確定要取消此活動??</p>
                                <p class="text-danger"><small>取消活動後資料不會復原喔!!!</small></p>
                            </div>
                            <div class="modal-footer">
                                <input type="button" class="btn btn-default" data-bs-dismiss="modal" value="返回">
                                    <input type="submit" id="cancelConfirm" class="btn btn-danger" value="確認取消">
                                    </div>
                                </form>
                            </div>
                    </div>
                </div> 
            </div > 
            `
        ;
    document.body.append(modalWrap);
    let modal = new bootstrap.Modal(modalWrap.querySelector('.modal'));
    modal.show();



    const addComfirm = document.querySelector('#cancelConfirm');
    addComfirm.addEventListener('click', (e) => {
        modal.hide();
    })

    // async function addData() {
    //     console.log("新增成功");

    // let postData = {
    //     "title": "活動建立測試",
    //     "content": "測試第28次",
    //     "startTime": "2023-08-29",
    //     "endTime": "2023-09-19",
    //     "activityTime": "2023-09-12 09:30:00",
    //     "enrollLimit": 40
    // };
    // let updateResult = await createAc(postData);
    // if (updateResult.code === 200) {
    //     Swal.fire(
    //         {
    //             title: '確認新增',
    //             icon: 'success',
    //             confirmButtonText: '了解', //　按鈕顯示文字
    //         }
    //     ).then((result) => {
    //         if (result.isConfirmed) {
    //             // location.reload();
    //             console.log("改變render");
    //             let pageData = getAc();
    //             createDataTable(pageData);
    //             createPagination(pageData);
    //         }
    //     })
    // } else {
    //     Swal.fire(
    //         {
    //             title: '新增失敗',
    //             icon: 'error',
    //             confirmButtonText: '了解', //　按鈕顯示文字
    //         }
    //     );
    // }


    // }

}

export { showCancelModal };