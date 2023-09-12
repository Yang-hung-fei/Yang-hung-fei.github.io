import { getAllNews} from "./NewsList.js";
window.addEventListener('DOMContentLoaded', function () {
    getAllNews();

    // ------------------------- 改變分頁  ------------------------- //
    const pagination = document.querySelector(".pagination");
    pagination.addEventListener('click', async (event) => {
        let page = await event.target.getAttribute('data-page');
        await getAllNews(page);
    });

    var searchContent;
    // ------------------------- 關鍵字搜尋  ------------------------- //
    const searchInput = document.querySelector("#search");
    searchInput.addEventListener('input', async function (event) {
        searchContent = await event.target.value;
    });
    const searchBtn = document.querySelector("#searchBtn");
    searchBtn.addEventListener('click', async function (e) {
        await searchNews(searchContent);
    })

    // keywoard search
    async function searchNews(NewsCont, page) {
        let params
        if (page === undefined) {
            params = new URLSearchParams({
                NewsCont: NewsCont
            });
        } else {
            params = new URLSearchParams({
                NewsCont: NewsCont,
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
                let NewsPageData = data.message;
                let pageData = {
                    //目前所在頁數(預設為0)
                    curentPage: NewsPageData.currentPageNumber,
                    //一頁有幾筆資料
                    pageSize: NewsPageData.pageSize,
                    totalPage: NewsPageData.totalPage,
                    fetchData: NewsPageData.resList,
                }
                return pageData;
            }).then(pageData => {
                //create table data and pagination
                createList(pageData);
                //不一樣的pagination
                createSearchPagination(NewsCont, pageData);
                return pageData;
            })
            .catch(err => {
                console.error(err.message);
            });
    }

});

// export { searchNews } ;