import config from "../../../../../ipconfig.js";
window.addEventListener("load", () => {
    // const token = localStorage.getItem("Authorization_M"); // 使用Manager Token
    const token = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI2IiwiZXhwIjoxNjk0MTgxNjcwfQ.RQddPyCnj9QS_eaFELGxMNyt7bFu8Hz1NmtEuPnL2v4"; // 使用Manager Token
    const searchInput = document.getElementById("search");
    const limitSelect = document.querySelector("#limit");
    const sortSelect = document.querySelector("#sort");
    const orderByRadios = document.querySelectorAll("[name=orderBy]"); // 新的Order By radios
    let currentPage = 1;
    let itemsPerPage = parseInt(limitSelect.value);
    let searchString = searchInput.value;


    //-------------------------------------------TABLE-------------------------------------------


    // 純顯示筆數用
    const maxCount = document.querySelector("#maxCount");

    // 一進入頁面呼叫
    fetchAndBuildTable(itemsPerPage, sortSelect.value, currentPage, searchString);

    //搜尋
    searchInput.addEventListener("change", () => {
        let searchString = searchInput.value;
        fetchAndBuildTable(itemsPerPage, sortSelect.value, currentPage, searchString);
    });

    // 當最大筆數不同
    limitSelect.addEventListener("change", () => {
        itemsPerPage = parseInt(limitSelect.value);
        currentPage = 1;
        let searchString = searchInput.value;
        fetchAndBuildTable(itemsPerPage, sortSelect.value, currentPage, searchString);
    });

    // 當排序選擇
    sortSelect.addEventListener("change", () => {
        let searchString = searchInput.value;
        fetchAndBuildTable(itemsPerPage, sortSelect.value, currentPage, searchString);
    });

    // 監聽Order By選項
    orderByRadios.forEach((radio) => {
        radio.addEventListener("change", () => {
            let searchString = searchInput.value;
            fetchAndBuildTable(itemsPerPage, sortSelect.value, currentPage, searchString);
        });
    });

    // 撈所有美容師 for Manager
    function fetchAndBuildTable(itemsPerPage, sort, page, searchString) {
        const offset = (page - 1) * itemsPerPage;
        const orderBy = getOrderValue(); // 取得選中的Order By值
        fetch(config.url + `/customer/getAllGroomerListSort?limit=${itemsPerPage}&sort=${sort}&offset=${offset}&orderBy=${orderBy}&search=${searchString}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then(response => response.json())
            .then(data => {
                if (data.code === 200) {
                    const petGroomers = data.message.rs;
                    const totalCounts = data.message.total;
                    maxCount.value = totalCounts;
                    buildTable(petGroomers);
                    updatePaginationButtons(totalCounts);
                } else if (data.code === 401) {
                    Swal.fire({
                        icon: "error",
                        title: `身分${data.message}`
                    });
                    tableBody.innerHTML = "";
                    maxCount.value = 0;
                } else {
                    Swal.fire({
                        icon: "error",
                        title: data.message
                    });
                    tableBody.innerHTML = "";
                    maxCount.value = 0;
                }
            });
    }

    // 獲取選中的Order By值
    function getOrderValue() {
        let orderValue = "";
        orderByRadios.forEach((radio) => {
            if (radio.checked) {
                orderValue = radio.value;
            }
        });
        return orderValue;
    }

    const tableBody = document.querySelector(".table-hover");
    //建構表格
    function buildTable(data) {
        tableBody.innerHTML = ""; // 清空表格内容
        let i = 1;
        data.forEach(petGroomer => {

            const row = document.createElement("tr");
            row.innerHTML = `
            <td class="text-center" name="pgId" value="${petGroomer.pgId}" hidden>${petGroomer.pgId}</td>
            <td class="text-center" style="padding:20px;">
                <div class="pgCard ${i}">
                    <div class="pgcard_image">
                        <img src="data:image/png;base64,${petGroomer.pgPic}" alt="此美容師無照片" class="pg-pic" style="">
                    </div>
                    <p style="font-size:20px;">${petGroomer.pgName}</p>
                </div>
            </td>
            <td class="text-center" style="font-size:20px;" name="numAppointments" value="${petGroomer.numAppointments}">${petGroomer.numAppointments}</td>
           
            <td class="text-center portfolio" style="min-width:752px; max-width:752px;">
            
            </td>
        `;
            tableBody.appendChild(row);
            // const portfolioButtons = tableBody.querySelectorAll("tr > td > .portfolio");

            i++
            const pgId = petGroomer.pgId;
            const portfolioContainer = row.querySelector(".portfolio");


            fetchPortfolioData(pgId)
                .then(portfolioData => {
                    buildPortfolioCards(portfolioContainer, portfolioData);
                });
        });



    }
    // 更新分頁
    function updatePaginationButtons(totalCounts) {
        const paginationButtonsContainer = document.getElementById("pagination-buttons");
        paginationButtonsContainer.innerHTML = "";

        // 獲取總頁數（通過 total 和 itemsPerPage 計算）
        const totalPages = Math.ceil(totalCounts / itemsPerPage);

        // 創造分頁按鈕
        for (let i = 1; i <= totalPages; i++) {
            const button = document.createElement("button");
            button.textContent = i;
            button.classList.add("slot-button");
            if (i === currentPage) {
                button.classList.add("active");
            }
            button.addEventListener("click", () => {
                currentPage = i;
                let searchString = searchInput.value;
                fetchAndBuildTable(itemsPerPage, sortSelect.value, currentPage, searchString);
                //SC
            });
            paginationButtonsContainer.appendChild(button);
        }
    }
    //修改:
    async function fetchPortfolioData(pgId) {
        const response = await fetch(config.url + `/customer/getPortfolioByPgId?pgId=${pgId}`);
        const data = await response.json();
        return data.message;
    }

    async function buildPortfolioCards(container, portfolioData) {
        const cardsList = document.createElement("div");
        cardsList.classList.add("cards-list");
        function handleClick(porId) {
            setCookie("porId", porId, 600);
            // 跳转
            window.location.href = "YOUR_URL_HERE";
        }

        for (let i = 0; i < Math.min(4, portfolioData.length); i++) {
            const card = document.createElement("div");
            card.classList.add("card", `${i + 1}`);

            const cardImage = document.createElement("div");
            cardImage.classList.add("card_image");

            try {
                const response = await fetch(config.url + `/customer/getPics?porId=${portfolioData[i].porId}`);
                const data = await response.json();

                if (data.code === 200) {
                    const pics = data.message;
                    const img = document.createElement("img");
                    img.src = `data:image/png;base64,${pics[0].piPicture}`;

                    img.setAttribute('name', portfolioData[i].porId);
                    img.addEventListener('click', () => handleClick(portfolioData[i].porId));

                    cardImage.appendChild(img);

                    const cardTitle = document.createElement("div");
                    cardTitle.classList.add("card_title", "title-white");
                    cardTitle.innerHTML = `<p style="color:#fff; margin: 0px; margin-top:55px">${portfolioData[i].porTitle}</p>`;

                    cardTitle.addEventListener('click', () => handleClick(portfolioData[i].porId));

                    card.appendChild(cardImage);
                    card.appendChild(cardTitle);

                    cardsList.appendChild(card);
                }
            } catch (error) {
                console.error(error);
            }
        }

        container.appendChild(cardsList);

        function setCookie(key, value, expirySeconds) {
            const date = new Date();
            date.setTime(date.getTime() + (expirySeconds * 1000));
            const expires = "expires=" + date.toUTCString();
            document.cookie = key + "=" + value + ";" + expires + ";path=/";
        }
    }

});

