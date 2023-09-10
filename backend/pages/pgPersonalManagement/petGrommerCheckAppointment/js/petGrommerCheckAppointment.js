import config from "../../../../../ipconfig.js";
window.addEventListener("load", () => {
    const token = localStorage.getItem("Authorization_M"); // 使用Manager Token
    // const token = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxIiwiZXhwIjoxNjkzNjM0ODE5fQ.qMvo_LrPZp3-za4HCjjMhUX8b_mHXSIuNATPM9Ke83c"; // 使用Manager Token
    const searchInput = document.getElementById("search");
    const limitSelect = document.querySelector("#limit");
    const sortSelect = document.querySelector("#sort");
    const orderByRadios = document.querySelectorAll("[name=orderBy]"); // 新的Order By radios
    let currentPage = 1;
    let itemsPerPage = parseInt(limitSelect.value);
    let searchString = searchInput.value;
    //錯誤顯示用
    const errorDiv = document.getElementById("error");

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

    // 撈所有預約單 for Manager
    function fetchAndBuildTable(itemsPerPage, sort, page, searchString) {
        const offset = (page - 1) * itemsPerPage;
        const orderBy = getOrderValue(); // 取得選中的Order By值
        fetch(config.url + `/manager/PgAppointmentSearch?limit=${itemsPerPage}&sort=${sort}&offset=${offset}&orderBy=${orderBy}&search=${searchString}`, {
            method: "GET",
            headers: {
                Authorization_M: token, // 使用Manager Token
                "Content-Type": "application/json"
            }
        })
            .then(response => response.json())
            .then(data => {
                if (data.code === 200) {
                    errorDiv.innerHTML = "";
                    const appointments = data.message.rs;
                    const totalAppointments = data.message.total;
                    maxCount.value = totalAppointments;
                    buildTable(appointments);
                    updatePaginationButtons(totalAppointments);
                } else if (data.code === 401) {
                    Swal.fire({
                        icon: "error",
                        title: "無權限",
                        text: `身分${data.message}`
                    });
                    maxCount.value = 0;
                } else {
                    Swal.fire({
                        icon: "error",
                        title: "目前無預約單",
                        text: data.message
                    });
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

        data.forEach(appointment => {
            const row = document.createElement("tr");
            if (appointment.pgaNotes === null) {
                appointment.pgaNotes = "無"
            }
            row.innerHTML = `
            <td class="text-center" name="pgaNo" value="${appointment.pgaNo}">${appointment.pgaNo}</td>
            <td class="text-center" name="pgId">${appointment.pgId}</td>
            <td class="text-center" name="pgName">${appointment.pgName}</td>
            <td class="text-center" name="sourcePgaDate">${appointment.pgaDate}</td>
            <td class="text-center" name="sourcePgaTime">${appointment.pgaTime}</td>
            <td class="text-center" name="pgaOption">${appointment.pgaOption}</td>
            <td class="text-center" name="pgaNotes" style="max-width: 80px;white-space:pre-line;
            word-wrap: break-word;">${appointment.pgaNotes}</td>
            <td class="text-center">${appointment.userId}</td>
            <td class="text-center">${appointment.userName}</td>
            <td class="text-center" name="pgaPhone">${appointment.pgaPhone}</td>
            <td class="text-center state" name="pgaState" style="font-size:15px;  font-weight=bold;">${appointment.pgaState}</td>
        `;
            tableBody.appendChild(row);
            if (appointment.pgaState === "已完成") {
                const stateElement = row.querySelectorAll(".state");
                stateElement.forEach(stateElement => {
                    stateElement.style.color = 'green';
                });
            }
            if (appointment.pgaState === "已取消") {
                const stateElement2 = row.querySelectorAll(".state");
                stateElement2.forEach(stateElement2 => {
                    stateElement2.style.color = 'red';
                });
            }
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
                fetchAndBuildTable(itemsPerPage, sortSelect.value, currentPage, searchString);
                //SC
            });
            paginationButtonsContainer.appendChild(button);
        }
    }


});
