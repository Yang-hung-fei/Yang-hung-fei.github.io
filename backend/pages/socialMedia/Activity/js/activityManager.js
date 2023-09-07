import { createAc, cancelAc, updateAc, getAcDetails, getAllAc, getAcByStatus } from './callApi.js';
import { createDataTable, createPagination } from './pagination.js';
import { showEditModal } from './editModal.js';
// ------------------------- 頁面載入  ------------------------- //
window.addEventListener('DOMContentLoaded', function () {
    getAllAc();
});


// ------------------------- 事件驅動  ------------------------- //
//改變分頁
const pagination = document.querySelector(".pagination");
pagination.addEventListener('click', async (event) => {
    let page = await event.target.getAttribute('data-page');
    await getAllAc(page);
});
