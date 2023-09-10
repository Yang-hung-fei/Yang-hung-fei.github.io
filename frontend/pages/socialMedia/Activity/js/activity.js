import { getAllActivities, getHotActivities, searchActivity } from "./callApi.js";
window.addEventListener('DOMContentLoaded', function () {
        getHotActivities();
        getAllActivities();

        // ------------------------- 改變分頁  ------------------------- //
        const pagination = document.querySelector(".pagination");
        pagination.addEventListener('click', async (event) => {
                let page = await event.target.getAttribute('data-page');
                await getAllActivities(page);
        });

        var searchContent;
        // ------------------------- 關鍵字搜尋  ------------------------- //
        const searchInput = document.querySelector("#search");
        searchInput.addEventListener('input', async function (event) {
                searchContent = await event.target.value;
        });
        const searchBtn = document.querySelector("#searchBtn");
        searchBtn.addEventListener('click', async function (e) {
                await searchActivity(searchContent);
        })

});