import { getAllAc, cancelAc } from "./callApi.js";
//取消活動
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
                                <button type="button" class="btn btn-default" data-bs-dismiss="modal">返回</button>
                                <button type="submit" id="cancelConfirm" class="btn btn-danger">確認取消</button>
                            </div>
                        </form>    
                    </div>
                </div> 
            </div > 
            `
        ;
    document.body.append(modalWrap);
    let modal = new bootstrap.Modal(modalWrap.querySelector('.modal'));
    modal.show();



    const cancelConfirm = document.querySelector('#cancelConfirm');
    cancelConfirm.addEventListener('click', (e) => {
        e.preventDefault();
        cancelActiv(activityId);
    })

    async function cancelActiv(activityId) {
        console.log("取消成功" + activityId);
        let cancelResult = await cancelAc(activityId)

        if (cancelResult.code === 200) {
            Swal.fire(
                {
                    title: '取消成功',
                    icon: 'success',
                    confirmButtonText: '了解', //　按鈕顯示文字
                }
            ).then((result) => {
                if (result.isConfirmed) {
                    // 選取具有 "page-item active" 類別的元素
                    const activePageItem = document.querySelector('.page-item.active');
                    // 從選取的元素中獲取 data-page 屬性的值
                    const pageValue = activePageItem.querySelector('.page-link').getAttribute('data-page');
                    getAllAc(pageValue);

                }
            })
        } else {
            Swal.fire(
                {
                    title: '取消失敗',
                    icon: 'error',
                    confirmButtonText: '了解', //　按鈕顯示文字
                }
            );
        }
        modal.hide();

    }

}

export { showCancelModal };