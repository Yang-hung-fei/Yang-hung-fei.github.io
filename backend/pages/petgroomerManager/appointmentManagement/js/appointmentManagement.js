import config from "../../../../../ipconfig.js";
window.addEventListener("load", () => {
    const token = localStorage.getItem("Authorization_M"); // 使用Manager Token
    const searchInput = document.getElementById("search");
    const limitSelect = document.querySelector("#limit");
    const sortSelect = document.querySelector("#sort");
    const orderByRadios = document.querySelectorAll("[name=orderBy]"); // 新的Order By radios
    let currentPage = 1;
    let itemsPerPage = parseInt(limitSelect.value);
    let searchString = searchInput.value;

    // 純顯示筆數用
    const maxCount = document.querySelector("#maxCount");

    // 一進入頁面呼叫
    fetchAndBuildTable(itemsPerPage, sortSelect.value, currentPage,searchString);
    
    //搜尋
    searchInput.addEventListener("change", () => {
        let searchString = searchInput.value;
        fetchAndBuildTable(itemsPerPage, sortSelect.value, currentPage,searchString);
    });

    // 當最大筆數不同
    limitSelect.addEventListener("change", () => {
        itemsPerPage = parseInt(limitSelect.value);
        currentPage = 1;
        let searchString = searchInput.value;
        fetchAndBuildTable(itemsPerPage, sortSelect.value, currentPage,searchString);
    });

    // 當排序選擇
    sortSelect.addEventListener("change", () => {
        let searchString = searchInput.value;
        fetchAndBuildTable(itemsPerPage, sortSelect.value, currentPage,searchString);
    });

    // 監聽Order By選項
    orderByRadios.forEach((radio) => {
        radio.addEventListener("change", () => {
            let searchString = searchInput.value;
            fetchAndBuildTable(itemsPerPage, sortSelect.value, currentPage,searchString);
        });
    });

    // 撈所有預約單 for Manager
    function fetchAndBuildTable(itemsPerPage, sort, page,searchString) {
        const offset = (page - 1) * itemsPerPage;
        const orderBy = getOrderValue(); // 取得選中的Order By值
        fetch(config.url + `/manager/allAppointmentSearch?limit=${itemsPerPage}&sort=${sort}&offset=${offset}&orderBy=${orderBy}&search=${searchString}`, {
            method: "GET",
            headers: {
                Authorization_M: "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxIiwiZXhwIjoxNjkzNTc1NDE5fQ.PnzUjj3mBltwVS_uW32XxpKC1EY0rW9tgn5asMcOaxI", // 使用Manager Token
                "Content-Type": "application/json"
            }
        })
            .then(response => response.json())
            .then(data => {
                if (data.code === 200) {
                    const appointments = data.message.rs;
                    const totalAppointments = data.message.total;
                    maxCount.value = totalAppointments;
                    buildTable(appointments);
                    updatePaginationButtons(totalAppointments);
                } else {
                    console.error(data.message);
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

    function buildTable(data) {
        tableBody.innerHTML = ""; // 清空表格内容
        
        data.forEach(appointment => {
            const row = document.createElement("tr");
            if (appointment.pgaNotes === null) {
                appointment.pgaNotes = "無"
            }
            row.innerHTML = `
            <td class="text-center">${appointment.pgaNo}</td>
            <td class="text-center">${appointment.pgId}</td>
            <td class="text-center">${appointment.pgName}</td>
            <td class="text-center">${appointment.pgaDate}</td>
            <td class="text-center">${appointment.pgaTime}</td>
            <td class="text-center">${appointment.pgaOption}</td>
            <td class="text-center">${appointment.pgaNotes}</td>
            <td class="text-center">${appointment.userId}</td>
            <td class="text-center">${appointment.userName}</td>
            <td class="text-center">${appointment.pgaPhone}</td>
            <td class="text-center">${appointment.pgaState}</td>
            <td class="text-center disable-edit">
                <button class="btn slot-button modify">修改</button>
            </td>
            <td class="text-center">
                <button class="btn slot-button finish" id="finishBtn">完成</button>
            </td>
            <td class="text-center">
                <button class="btn slot-button cancel" id="cancelBtn">取消</button>
            </td>
        `;
        tableBody.appendChild(row);
            if (appointment.pgaState === "已完成") {
                const stateElement = row.querySelectorAll(".state");
                const finishButton = row.querySelectorAll(".finish");
                const cancelButton = row.querySelectorAll(".cancel");
                const editButton = row.querySelectorAll(".modify");
                stateElement.forEach(stateElement => {
                    stateElement.style.color = 'green'
                });
                finishButton.forEach(finishButton => {
                    finishButton.disabled = true;
                });

                cancelButton.forEach(cancelButton => {
                    cancelButton.disabled = true;
                });
                editButton.forEach(editButton => {
                    editButton.disabled = true;
                });
            }
            if (appointment.pgaState === "已取消") {
                const stateElement2 = row.querySelectorAll(".state");
                const finishButton = row.querySelectorAll(".finish");
                const cancelButton = row.querySelectorAll(".cancel");
                const editButton = row.querySelectorAll(".modify");
                stateElement2.forEach(stateElement2 => {
                    stateElement2.style.color = 'red'
                });
                finishButton.forEach(finishButton => {
                    finishButton.disabled = true;
                });

                cancelButton.forEach(cancelButton => {
                    cancelButton.disabled = true;
                });
                editButton.forEach(editButton => {
                    editButton.disabled = true;
                });
            }

            const editButtons = tableBody.querySelectorAll("tr > td > .modify");

            editButtons.forEach((editButton) => {

                editButton.addEventListener("click", () => {
                    handleModifyButtonClick(editButton);
                });
            });
            const finishButtons = tableBody.querySelectorAll("tr > td > .finish");

            finishButtons.forEach((finishButton) => {

                finishButton.addEventListener("click", () => {
                    CancelOrfinishButtonClick(finishButton);
                }); 
            });
            const cancelButtons = tableBody.querySelectorAll("tr > td > .cancel");

            cancelButtons.forEach((cancelButton) => {

                cancelButton.addEventListener("click", () => {
                    CancelOrfinishButtonClick(cancelButton);
                });
            });


        });
    }
    // 更新分頁
    function updatePaginationButtons(totalAppointments) {
        const paginationButtonsContainer = document.getElementById("pagination-buttons");
        paginationButtonsContainer.innerHTML = "";

        // 獲取總頁數（通過 total 和 itemsPerPage 計算）
        const totalPages = Math.ceil(totalAppointments / itemsPerPage);

        // 創造分頁按鈕
        for (let i = 1; i <= totalPages; i++) {
            const button = document.createElement("button");
            button.textContent = i;
            button.classList.add("btn", "slot-button");
            if (i === currentPage) {
                button.classList.add("active");
            }
            button.addEventListener("click", () => {
                currentPage = i;
                let searchString = searchInput.value;
                fetchAndBuildTable(itemsPerPage, sortSelect.value, currentPage,searchString);
                //SC
            });
            paginationButtonsContainer.appendChild(button);
        }
    }

});
