import config from "../../../../ipconfig.js";
// import { editNewsByNewsNo } from "./editNewsByNewsNo.js";

// localStorage.setItem("Authorization_M", "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxIiwiZXhwIjoxNjk0NjgwMzQ3fQ.zAe7mBf5Bcg00KiYAdKk05pmviYQSzh1Nh0S0PqtD1k");
// let token = localStorage.getItem("Authorization_M");
let token = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxIiwiZXhwIjoxNjk0NjgwMzQ3fQ.zAe7mBf5Bcg00KiYAdKk05pmviYQSzh1Nh0S0PqtD1k";

const mainUrl = config.url;
const newsUrl = "/manager/homepageManage";
const updateNewsUrl = mainUrl + newsUrl;
const getNewsDetailsUrl = mainUrl + newsUrl;
const getAllNewsUrl = mainUrl + newsUrl + "/getAllNews";

// ------------------------- 頁面載入  ------------------------- //
window.addEventListener('load', function () {
    getAllNews();



    // ------------------------- 事件驅動  ------------------------- //

    const editModal = document.getElementById('editNewsByNewsNo');
    editModal.addEventListener('click', async function (e) {
        //當使用者點擊按鈕
        let button = e.relatedTarget;
        let newsNo = button.getAttribute('newsNo');
        //fetch獲取資料
        let fetchData = await getNewsDetails(newsNo);
        document.getElementById('newsNo').value = fetchData.newsNo;
        document.getElementById('newsTitle').value = fetchData.newsTitle;
        document.getElementById('newsCont').value = fetchData.newsCont;
        document.getElementById('newsStatus').value = fetchData.newsStatus;

        // 定義函數格式化日期時間
        function formatDateTime(date) {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0'); // 月份從0開始，需要加1，並且補齊兩位
            const day = String(date.getDate()).padStart(2, '0');
            const hours = String(date.getHours()).padStart(2, '0');
            const minutes = String(date.getMinutes()).padStart(2, '0');
            const seconds = String(date.getSeconds()).padStart(2, '0');

            return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
        }

        // 使用 Date 對象將時間戳轉換為日期和時間
        let updateTime = new Date(fetchData.updateTime);
        document.getElementById('updateTime').value = formatDateTime(updateTime);

        console.log("fetchData.updateTime:", fetchData.updateTime);
        console.log("updateTime:", updateTime);

        let status = document.getElementById('newsStatus');
        if (fetchData.newsStatus == 1) {
            status.value = "上架中";
        } else {
            status.value = "已下架";
        }

        document.getElementById('editForm').addEventListener('submit', async function (e) {
            e.preventDefault();
            let newsNo = document.getElementById('newsNo').value;
            let newsTitle = document.getElementById('newsTitle').value;
            let newsCont = document.getElementById('newsCont').value;
            let newsStatus = document.getElementById('newsStatus').value;
            let updateTime = document.getElementById('updateTime').value;

            // 圖片轉換成字串
            //   let newsPic = document.getElementById('newsPic').value;
            // 處理時間格式
            let newUpdateTime = updateTime.toString().replace("T", " ");
            let updateData = {
                "newsNo": newsNo,
                "newsTitle": newsTitle,
                "newsCont": newsCont,
                "newsStatus": newsStatus,
                "updateTime": newUpdateTime + ":00",
                "newsPic": null,
            };
            let updateResult = await updateNews(newsNo, updateData);
            console.log(updateResult);

        });




        // 在需要關閉模態的地方，例如更新成功後
        if (updateResult != null) {
            //   editModal.;
        }
    });






    // ------------------------- 更新  ------------------------- //
    async function updateNews(newsNo, updateData) {

        return fetch(updateNewsUrl + `/${newsNo}`, {
            method: "PUT",
            headers: {
                Authorization_M: token,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(updateData)
        })
            .then(res => {
                return res.json();
            }).then(data => {
                return data.message;
            })
            .catch(err => {
                console.log(err.message);
            });
    }


    // ------------------------- 查詢單一news  ------------------------- //
    async function getOneNews(newsNo) {
        return fetch(getNewsDetailsUrl + `/${newsNo}`, {
            method: "GET",
            headers: {
                "Authorization_M": token,
                "Content-Type": "application/json"
            },
        })
            .then(res => {
                return res.json();
            }).then(data => {
                return data.message;
            })
            .catch(err => {
                console.error(err.message);
            });
    }



    // ------------------------- 查詢all news  ------------------------- //
    function getAllNews() {

        fetch(getAllNewsUrl, {
            method: "GET",
            headers: {
                "Authorization_M": token
            }
        })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                let newsPageData = data.message;
                let pageData = {
                    //目前所在頁數(預設為0)
                    curentPage: newsPageData.currentPageNumber + 1,
                    //一頁有幾筆資料
                    pageSize: newsPageData.pageSize,
                    totalPage: newsPageData.totalPage,
                    fetchData: newsPageData,
                }
                return pageData;

            }).then(pageData => {
                //create table data and pagination
                createDataTable(pageData);

            })
        // .catch(err => {
        //     console.error(err.message);
        // });
    }


    // ------------------------- 建立分頁  ------------------------- //
    // 更新資料表格和分頁
    function createDataTable(data) {
        // // 選擇分頁元素
        let table = document.querySelector("#table");
        let tbody = document.getElementById("dataTableList");
        let pagination = document.querySelector(".pagination");
        console.log(pagination);
        // 清空tbody表格
        tbody.innerHTML = "";
        let dataList = '';
        let fetchData = data.fetchData;



        // 建立資料表格
        fetchData.forEach(dataDetails => {
            console.log(dataDetails.newsNo);
            // 建立資料
            dataList += `
               <tr>
               <td>${dataDetails.newsNo}</td>
               <td>${dataDetails.newsTitle}</td>
               <td>${dataDetails.newsCont}</td>
               <td>${dataDetails.newsStatus == 1 ? "上架中" : "已下架"}</td>
               <td>${dataDetails.updateTime}</td>

               <td><button class="modify" type="button"
               style="background: #325aab;border-style: none;color: #f1ecd1; width: 60px; height: 30px; font-size: 14px;"
               value="${dataDetails.newsNo}">修改</button>
               </td>
               <td>
               <button class="btn btn-danger" type="button"
               style="background: #f44336; border-style: none; color: #ffffff; width: 60px; height: 30px; font-size: 14px;"
               onclick="deleteNewsByNewsNo(${dataDetails.newsNo})">刪除</button>
               </td>
               
               
               </tr>`;

               const modifyBtn=document.querySelectorAll(".modify");
               
               modifyBtn.forEach((btn) => {
                btn.addEventListener("click", () => {
                
                  const newsNo = btn.value;
                  editNewsByNewsNo(newsNo);
                });
              });

        });
        tbody.innerHTML = dataList;

        async function createPagination(data) {
            let pagination = document.querySelector(".pagination");
            //建立分頁 -清空分頁
            pagination.innerHTML = "";
            // 總頁數
            let totalPages = await data.totalPage;
            //預設為1
            let currentPage = await data.curentPage;

            // 創建分頁頁碼
            for (let i = 1; i <= totalPages; i++) {
                const pageItem = document.createElement("li");
                pageItem.classList.add("page-item");
                if (i === currentPage + 1) {
                    pageItem.classList.add("active");
                }
                const pageLink = document.createElement("button");
                pageLink.classList.add("page-link");
                pageLink.textContent = i;
                pageLink.setAttribute('data-page', i - 1);
                pageItem.appendChild(pageLink);
                pagination.appendChild(pageItem);
                console.log(pagination);
            }
        }

        // console.log(editNewsByNewsNo);
        console.log(createPagination);

        //修改news
        async function editNewsByNewsNo(newsNo) {
            console.log('!!!!!!!!!!');
            let id = await newsNo;
            let fetchData = getAllNews(id);
            let modalWrap = null;
            // if (modalWrap != null) {
            //     modalWrap.remove();
            // }
            modalWrap = document.createElement('div');
            modalWrap.innerHTML = `
                <div class="modal fade" tabindex="-1">
                <div class="modal-dialog">
                 <div class="modal-content">
                 <form id="editNews">
                        <div class="modal-header">
                            <h4 class="modal-title">修改最新消息</h4>
                            <button type="button" class="close" data-bs-dismiss="modal" aria-hidden="true">
                        x
                            </button>
                </div>
                <div class="modal-body">
                    <div class="form-group">
                        <label for="title">消息標題</label>
                        <input type="text" class="form-control" name="newsTitle" id="newsTitle" value="${fetchData.newsTitle}">
                    </div>
                    <div class="form-group">
                        <label for="title">消息編號</label>
                        <input type="text" class="form-control" name="newsNo" id="newsNo" value="${fetchData.newsNo}">
                    </div>
                    <div class="form-group">
                        <label for="newsCont">消息內容</label>
                        <input type="datetime-local" class="form-control" placeholder="選擇日期..."
                            name="newsCont" id="newsCont" value="${fetchData.newsCont}">
                    </div>
                    <div class="form-group">
                        <label for="pic">消息圖片</label>
                            <input type="file" class="form-control" name="pic" id="pic">
                        <div class="mt-3">
                            <img id="imageOutput" src="data:image/*;base64,${fetchData.pic}" alt="此消息沒有照片" class="img-fluid"><br>
                         </div>
                    </div>
                    <div class="form-group">
                        <label for="status">消息狀態</label>
                        <input type="text" name="status" id="status" class="form-control"
                            readonly="readonly" value="${fetchData.newsStatus === 0 ? "下架" : "上架"}">
                    </div>
                    <div class="form-group">
                        <label for="updateTime">報名開始時間</label>
                        <input class="form-control" name="updateTime" id="updateTime" type="date"
                            placeholder="選擇日期.." value="${fetchData.updateTime}">
                    </div>
                    
                    
                </div>
                <div class="modal-footer">
                    <button type="button" class="close btn btn-default" data-bs-dismiss="modal">返回</button>
                    <a herf="#" type="submit" id="editComfirm" onclick = "editData()" class="btn btn-success" >確認修改</a>
                </div>
                        </form>
                    </div>
                 </div>
                </div>   
                    `;


            document.body.append(modalWrap);

            let modal = new bootstrap.Modal(modalWrap.querySelector('.modal'));
            modal.show();

            // 輸入

            let newsTitle;
            let newsCont;
            let newsStatus;
            let updateTime;
            let pic;

            var updateData = {

                "newsTitle": newsTitle,
                "newsCont": newsCont,
                "newsStatus": newsStatus,
                "updateTime": updateTime,
                "pic": pic,

            };

            let newsNos = document.querySelectorAll('#newsNo');
            newsNos.forEach((newsNoInput) => {
                newsNo = fetchData.content;
                updateData.content = newsNo;
                newsNoInput.addEventListener('input', () => {
                    newsNo = newsNoInput.value;
                    updateData.content = newsNo;
                });
            });


            let titleValueInputs = document.querySelectorAll('#title');
            titleValueInputs.forEach((titleValueInput) => {
                titleValue = fetchData.title;
                updateData.title = titleValue;
                titleValueInput.addEventListener('input', (e) => {
                    titleValue = titleValueInput.value;
                    updateData.title = titleValue;
                });
            });

            let newsConts = document.querySelectorAll('#newsCont');
            newsConts.forEach((newsContInput) => {
                newsCont = fetchData.content;
                updateData.content = newsCont;
                newsContInput.addEventListener('input', () => {
                    newsCont = newsContInput.value;
                    updateData.content = newsCont;
                });
            });

            let newsStatuss = document.querySelectorAll('#newsStatus');
            newsStatuss.forEach((newsStatusInput) => {
                newsStatus = fetchData.content;
                updateData.content = newsStatus;
                newsStatusInput.addEventListener('input', () => {
                    newsStatus = newsStatusInput.value;
                    updateData.content = newsStatus;
                });
            });

            let updateTimeInputs = document.querySelectorAll('#updateTime');
            updateTimeInputs.forEach((updateTimeInput) => {
                updateTime = fetchData.updateTime;
                updateData.updateTime = updateTime;
                updateTimeInput.addEventListener('input', () => {
                    let updateTimeValue = updateTimeInput.value;
                    updateTime = updateTimeValue.toString().replace("T", " ") + ":00";
                    updateData.updateTime = updateTime;

                });
            });

            //處理圖片
            var picOputs = document.querySelectorAll('#imageOutput');
            var picInputs = document.querySelectorAll('#pic');
            picInputs.forEach((picInput) => {
                //預設為之前的圖片
                updateData.pic = fetchData.pic;
                picInput.addEventListener('change', (e) => {
                    let file = e.target.files[0];
                    if (file) {

                        toBase64(file).then((reslut) => {
                            //轉換成base64字串傳輸資料(這邊要解析格式)
                            let base64String = (reslut.split(',')[1]);
                            //建立預覽圖
                            picOputs.forEach((picOput) => {
                                console.log(updateData);
                                picOput.src = reslut;
                            })
                            updateData.pic = base64String;
                        }).catch(error => {
                            console.log(error);
                        });
                    }
                });
            })


            const toBase64 = file => new Promise((resolve, reject) => {
                let reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = () => resolve(reader.result);
                reader.onerror = error => reject(error);
            });


            let editComfirms = document.querySelectorAll('#editComfirm');
            editComfirms.forEach((editComfirm) => {
                editComfirm.onclick = () => {
                    editData();
                }
            });


            async function editData() {
                let updateResult = await updateNews(newsNo, updateData);
                if (updateResult.code === 200) {
                    Swal.fire(
                        {
                            title: '更新成功',
                            icon: 'success',
                            confirmButtonText: '了解', //　按鈕顯示文字
                        }
                    ).then((result) => {
                        if (result.isConfirmed) {
                            let pageData = getOneNews();
                            createDataTable(pageData);
                            createPagination(pageData);
                        }
                    })
                } else {
                    Swal.fire(
                        {
                            title: '更新失敗',
                            icon: 'error',
                            confirmButtonText: '了解', //　按鈕顯示文字
                        }
                    );
                }
                modal.hide();

            }

        }

    }
});
// export { createDataTable, createPagination };
