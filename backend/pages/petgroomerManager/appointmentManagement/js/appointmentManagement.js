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
        fetch(config.url + `/manager/allAppointmentSearch?limit=${itemsPerPage}&sort=${sort}&offset=${offset}&orderBy=${orderBy}&search=${searchString}`, {
            method: "GET",
            headers: {
                Authorization_M: "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxIiwiZXhwIjoxNjkzNjM0ODE5fQ.qMvo_LrPZp3-za4HCjjMhUX8b_mHXSIuNATPM9Ke83c", // 使用Manager Token
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
                    let errorLabel = document.createElement("label");
                    errorLabel.innerHTML = `身分${data.message}`;
                    errorLabel.style.color = "red";
                    errorLabel.style.font = "16px Arial, sans-serif";
                    errorDiv.appendChild(errorLabel);
                    maxCount.value = 0;
                } else {
                    let errorLabel = document.createElement("label");
                    errorLabel.innerHTML = `${data.message}`;
                    errorLabel.style.color = "red";
                    errorLabel.style.font = "16px Arial, sans-serif";
                    errorDiv.appendChild(errorLabel);
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
                    stateElement.style.color = 'green';
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
                    stateElement2.style.color = 'red';
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
                fetchAndBuildTable(itemsPerPage, sortSelect.value, currentPage, searchString);
                //SC
            });
            paginationButtonsContainer.appendChild(button);
        }
    }

    //查詢班表(token要改)
    function fetchScheduleForDate(pgId, dateInput, timeSlotsContainer) {
        fetch(config.url + `/manager/pgScheduleForA?pgId=${pgId}`, {
            method: "GET",
            headers: {
                Authorization_M: "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxIiwiZXhwIjoxNjkzNjM0ODE5fQ.qMvo_LrPZp3-za4HCjjMhUX8b_mHXSIuNATPM9Ke83c",
                "Content-Type": "application/json"
            }
        })
            .then(response => response.json())
            .then(data => {
                if (data.code === 200) {
                    const scheduleDates = data.message.map(schedule => schedule.pgsDate);
                    const minDate = scheduleDates[0];
                    const maxDate = scheduleDates[scheduleDates.length - 1];

                    dateInput.flatpickr({
                        minDate: minDate,
                        maxDate: maxDate,
                        dateFormat: "Y-m-d",
                        onChange: function (selectedDates, dateStr, instance) {
                            const selectedDate = selectedDates[0];
                            const formattedDate = formatDate(selectedDate);
                            dateInput.value = formattedDate;

                            // 找到選中日期的班表資料
                            const selectedSchedule = data.message.find(schedule => schedule.pgsDate === formattedDate);
                            if (selectedSchedule) {
                                //pgsIdLabel.style.display = "block";
                                generateTimeSlots(selectedSchedule.pgsState, timeSlotsContainer);
                            } else {

                            }
                        },
                    });
                } else if (data.code === 404) {
                    Swal.fire({
                        icon: "error",
                        title: "無班表可修改",
                        text: data.message
                    });
                }
            });
    }

    //抓對應時間
    function generateTimeSlots(pgsState, timeSlotsContainer) {
        timeSlotsContainer.innerHTML = '';

        for (let i = 0; i < 24; i++) {
            // 创建<option>元素
            const option = document.createElement('option');
            option.value = `${i}:00 ~ ${i + 1}:00`;
            option.textContent = `${i}:00 ~ ${i + 1}:00`;

            // 设置不可选择的选项
            if (pgsState[i] === '1' || pgsState[i] === '2') {
                option.disabled = true;
            }

            // 添加到<select>元素中
            timeSlotsContainer.appendChild(option);
        }
    }
    //格式化yyyy-mm-dd
    function formatDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    }
    //修改:
    function handleModifyButtonClick(editButton) {

        const row = editButton.closest("tr");

        const pgId = row.querySelector("[name=pgId]").textContent;
        const pgaNo = row.querySelector("[name=pgaNo]").textContent;

        const sourcePgaDate = row.querySelector("[name=sourcePgaDate]").textContent;
        const sourcePgaTime = row.querySelector("[name=sourcePgaTime]").textContent;
        const pgaOption = row.querySelector("[name=pgaOption]").textContent;
        const pgaNotes = row.querySelector("[name=pgaNotes]").textContent;
        const pgaPhone = row.querySelector("[name=pgaPhone]").textContent;
        Swal.fire({
            title: '修改預約',
            html:
                `
                <div class="row d-flex justify-content-center" style="color: #fff; font-family: cwTeXYen" >
                    <div class="col-md-6" style="margin-top:25px;">
                        <label for="sourcePgaDate" style="font-size: 18px;">原預約日期</label>
                        <input type="text" id="sourcePgaDate"  value="${sourcePgaDate}" readonly><br>
                        <label for="sourcePgaTime" style="font-size: 18px;">原預約時間</label>               
                        <input type="text" id="sourcePgaTime"  value="${sourcePgaTime}" readonly><br>
                        <label for="editPgaOption" style="font-size: 18px;">原預約選項</label>  
                        <input type="text" id="editPgaOption"  value="${pgaOption}" readonly><br>
                        <label for="editPgaNotes" style="font-size: 18px;">原預約備註</label>
                        <input type="text" id="editPgaNotes"  value="${pgaNotes}" readonly style="max-height:100px; min-height:100px;"><br>
                        <label for="editPgaPhone" style="font-size: 18px;">原手機號碼</label>
                        <input type="text" id="editPgaPhone"  value="${pgaPhone}" readonly>
                    </div>
                    <div class="col-md-6">
                    <span  style="font-size: 14px; color:#ddd; font-family: cwTeXYen" >不修改的內容請留空</span><br>
                        <input id="pgId" name="pgId" value="${pgId}" hidden readonly></input>
                        <input id="pgaNo" name="pgaNo2" value="${pgaNo}" hidden readonly></input>
                        <label for="dateInput" style="font-size: 18px;">修改日期</label>
                        <input type="text" id="dateInput" name="dateInput" placeholder="請點擊選擇預約日期"><br>
                        
                        <label for="timeSlotsContainer" style="font-size: 18px;">修改時間</label><br>              
                        <select id="timeSlotsContainer" name="pgaNewTime"></select><br>
                        
                        <label for="pgaOption" style="font-size: 18px;">修改選項</label>
                        <select id="pgaOption">
                            <option value="" disabled selected>如需要請選擇</option>
                            <option value="狗狗洗澡" >狗狗洗澡</option>
                            <option value="狗狗半手剪 (洗澡+剃毛)" >狗狗半手剪 (洗澡+剃毛)</option>
                            <option value="狗狗全手剪(洗澡+全身手剪造型)" >狗狗全手剪(洗澡+全身手剪造型)</option>
                            <option value="貓咪洗澡" >貓咪洗澡</option>
                            <option value="貓咪大美容" >貓咪大美容</option>
                        </select><br>
                        <label for="pgaNotes" style="font-size: 18px;">修改備註</label>
                        <textarea name="pgaNotes" id="pgaNotes" rows="10"
                        style="min-width: 200; max-width: 200px; max-height:100px; resize: none; overflow: auto;"
                        maxlength="500"></textarea><br>
                        <label for="pgaPhone" style="font-size: 18px;">修改手機號碼</label>
                        <input type="text" id="pgaPhone">
                    </div>
                 </div>
                 `,
            didRender: function () {
                const timeSlotsContainer = document.getElementById('timeSlotsContainer');
                const dateInput = document.getElementById('dateInput');
                fetchScheduleForDate(pgId, dateInput, timeSlotsContainer);
            },
            showCancelButton: true,
            confirmButtonText: '確認',
            confirmButtonColor: '#8f88f8',
            cancelButtonText: '取消',
            background: 'rgba(0, 50, 129, 0.79)',
            preConfirm: () => {
                const editedData = {
                    pgaNo: document.getElementById("pgaNo").value,//notnull
                    pgId: document.getElementById("pgId").value,//notnull
                    sourcePgaDate: document.getElementById("sourcePgaDate").value,
                    pgaNewDate: document.getElementById("dateInput").value,
                    sourcePgaTime: document.getElementById("sourcePgaTime").value,
                    pgaNewTime: document.getElementById("timeSlotsContainer").value,
                    pgaOption: document.getElementById("pgaOption").value,
                    pgaNotes: document.getElementById("pgaNotes").value,
                    pgaPhone: document.getElementById("pgaPhone").value,
                };
                return editedData;
            },
        }).then((result) => {
            if (result.isConfirmed) {
                // 送出修改，TOKEN要改
                const editedData = result.value;

                fetch(config.url + "/manager/modifyAppointment", {
                    method: "POST",
                    headers: {
                        Authorization_M: "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxIiwiZXhwIjoxNjkzNjM0ODE5fQ.qMvo_LrPZp3-za4HCjjMhUX8b_mHXSIuNATPM9Ke83c",
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(editedData)
                })
                    .then(response => response.json())
                    .then(data => {
                        if (data.code === 200) {
                            Swal.fire({
                                icon: "success",
                                title: "預約修改成功",
                                text: data.message
                            });
                            let searchString = searchInput.value;
                            fetchAndBuildTable(itemsPerPage, sortSelect.value, currentPage, searchString);
                        } else {
                            Swal.fire({
                                icon: "error",
                                title: "預約修改失敗",
                                text: data.message
                            });
                        }
                    });
            }

        });
    }
    //修改狀態
    function CancelOrfinishButtonClick(editButton) {
        const row = editButton.closest("tr");
        const pgaNo = row.querySelector("[name=pgaNo]").textContent;

        let value;
        if (editButton.id === 'finishBtn') {
            value = 1;
        } else if (editButton.id === 'cancelBtn') {
            value = 2;
        }

        const requestBody = {
            pgaNo: parseInt(pgaNo),
            pgaState: parseInt(value)
        };
        //TOKEN要修改
        fetch(config.url + "/manager/CompleteOrCancel", {
            method: "POST",
            headers: {
                Authorization_M: "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxIiwiZXhwIjoxNjkzNjM0ODE5fQ.qMvo_LrPZp3-za4HCjjMhUX8b_mHXSIuNATPM9Ke83c",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(requestBody)
        })
            .then(response => response.json())
            .then(data => {
                if (data.code === 200) {
                    Swal.fire({
                        icon: "success",
                        title: "訂單狀態已修改",
                        text: data.message
                    });
                    let searchString = searchInput.value;
                    fetchAndBuildTable(itemsPerPage, sortSelect.value, currentPage, searchString);
                } else {
                    Swal.fire({
                        icon: "error",
                        title: "修改失敗",
                        text: data.message
                    });
                }
            });
    }

});
