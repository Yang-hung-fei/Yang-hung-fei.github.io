import { createAc, cancelAc, updateAc, getAcDetails, getAllAc, getAcByStatus } from './callApi.js';
import { showAddModal } from './addModal.js';
// ------------------------- 頁面載入  ------------------------- //
window.addEventListener('DOMContentLoaded', function () {
    getAllAc();


    // ------------------------- 改變分頁  ------------------------- //
    const pagination = document.querySelector(".pagination");
    pagination.addEventListener('click', async (event) => {
        let page = await event.target.getAttribute('data-page');
        await getAllAc(page);
    });

    // ------------------------- 新增活動  ------------------------- //
    const addBtn = document.getElementById('addBtn');
    addBtn.addEventListener('click', async (e) => {
        console.log("show your modal");
        await showAddModal();


    })
});



