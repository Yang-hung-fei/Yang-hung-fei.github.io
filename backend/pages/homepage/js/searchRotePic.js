import { getAllRotePic} from "./PicRoteList.js";
window.addEventListener('DOMContentLoaded', function () {
    getAllRotePic();

    // ------------------------- 改變分頁  ------------------------- //
    const pagination = document.querySelector(".pagination");
    pagination.addEventListener('click', async (event) => {
        let page = await event.target.getAttribute('data-page');
        await getAllRotePic(page);
    });

    var searchContent;
    // ------------------------- 關鍵字搜尋  ------------------------- //
    const searchInput = document.querySelector("#search");
    searchInput.addEventListener('input', async function (event) {
        searchContent = await event.target.value;
    });
    const searchBtn = document.querySelector("#searchBtn");
    searchBtn.addEventListener('click', async function (e) {
        await searchRotePic(searchContent);
    })

    // keywoard search
    async function searchRotePic(RotePicCont, page) {
        let params
        if (page === undefined) {
            params = new URLSearchParams({
                RotePicCont: RotePicCont
            });
        } else {
            params = new URLSearchParams({
                RotePicCont: RotePicCont,
                page: page
            });
        }
        return fetch(acUrl + "/search?" + params.toString(), {
            method: "GET",
            headers: {
                "Authorization": Token,
                "Content-Type": "application/json"
            },
        })
            .then(res => {
                return res.json();
            }).then(data => {
                let RotePicPageData = data.message;
                let pageData = {
                    //目前所在頁數(預設為0)
                    curentPage: RotePicPageData.currentPageNumber,
                    //一頁有幾筆資料
                    pageSize: RotePicPageData.pageSize,
                    totalPage: RotePicPageData.totalPage,
                    fetchData: RotePicPageData.resList,
                }
                return pageData;
            }).then(pageData => {
                //create table data and pagination
                createList(pageData);
                //不一樣的pagination
                createSearchPagination(RotePicCont, pageData);
                return pageData;
            })
            .catch(err => {
                console.error(err.message);
            });
    }

});

// export { searchRotePic } ;