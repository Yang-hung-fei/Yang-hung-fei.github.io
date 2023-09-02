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

    const modifyInput = document.getElementById("modify_input");
    //錯誤顯示用
    const errorDiv = document.getElementById("error");

    //存放資訊
    const manNameSelect = document.getElementById('manName');
    const manIdInput = document.getElementById('manId');
    //進頁面先撈
    fetchMan();

    //撈管理員資料(token要改)
    function fetchMan() {
        fetch(config.url + "/manager/insertNewGroomer", {
            method: "GET",
            headers: {
                Authorization_M: "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxIiwiZXhwIjoxNjkzNzM0ODgzfQ.MGVymnvxKaRZ9N7gGInQitt7q_zVoHxvt2n7hoPws6A",
                "Content-Type": "application/json"
            }
        })
            .then(response => response.json())
            .then(data => {
                if (data.code === 200) {
                    const managers = data.message;

                    // 填充美容師下拉選單
                    managers.forEach(man => {
                        const option = document.createElement('option');
                        option.value = man.managerId;
                        option.textContent = `${man.managerId} - ${man.managerAccount}`;
                        manNameSelect.appendChild(option);
                    });

                    // 美容師選擇事件
                    manNameSelect.addEventListener('change', function () {

                        const selectedMan = managers.find(man => man.managerId == this.value);

                        if (selectedMan) {

                            manIdInput.value = selectedMan.managerId;
                        }
                        // fetchGroomerSchedule(manIdInput.value, yearSelect.value, monthInput.value);
                    });

                    // 直接選擇第一個選項並觸發 change 事件
                    const firstOption = manNameSelect.querySelector('option');
                    if (firstOption) {
                        firstOption.selected = true;
                        manNameSelect.dispatchEvent(new Event('change'));
                    }
                }
            });
    }







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
        fetch(config.url + `/manager/getAllGroomerListSort?limit=${itemsPerPage}&sort=${sort}&offset=${offset}&orderBy=${orderBy}&search=${searchString}`, {
            method: "GET",
            headers: {
                Authorization_M: "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxIiwiZXhwIjoxNjkzNzM0ODgzfQ.MGVymnvxKaRZ9N7gGInQitt7q_zVoHxvt2n7hoPws6A", // 使用Manager Token
                "Content-Type": "application/json"
            }
        })
            .then(response => response.json())
            .then(data => {
                if (data.code === 200) {
                    errorDiv.innerHTML = "";
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

        data.forEach(petGroomer => {
            const row = document.createElement("tr");

            row.innerHTML = `
            <td class="text-center" name="pgId" value="${petGroomer.pgId}">${petGroomer.pgId}</td>
            <td class="text-center" name="manId">${petGroomer.manId}</td>
            <td class="text-center" name="pgName">${petGroomer.pgName}</td>
            <td class="text-center" name="pgGender">${petGroomer.pgGender}</td>
            <td class="text-center">
                <img src="data:image/png;base64,${petGroomer.pgPic}" alt="此美容師無照片" class="pg-pic">
            </td>
            <td class="text-center" name="pgEmail" style="padding:5px; min-width:80px;">${petGroomer.pgEmail}</td>
            <td class="text-center" name="pgPh"style="padding:5px; min-width:80px;">${petGroomer.pgPh}</td>
            <td class="text-center" name="pgAddress" style="max-width: 80px;white-space:pre-line;
            word-wrap: break-word;" style="min-width:80px; padding:5px;">${petGroomer.pgAddress}</td>
            <td class="text-center" name="pgBirthday" style="padding:5px; min-width:80px;">${petGroomer.pgBirthday}</td>
            <td class="text-center" name="numAppointments">${petGroomer.numAppointments}</td>
            <td class="text-center disable-edit">
                <button class="btn slot-button modify">修改</button>
            </td>
        `;

            tableBody.appendChild(row);
            const editButtons = tableBody.querySelectorAll("tr > td > .modify");

            editButtons.forEach((editButton) => {

                editButton.addEventListener("click", () => {
                    handleModifyButtonClick(editButton);
                });
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


    //修改:
    function handleModifyButtonClick(editButton) {

        const row = editButton.closest("tr");

        const pgId = row.querySelector("[name=pgId]").textContent;
        const pgName = row.querySelector("[name=pgName]").textContent;
        const pgGender = row.querySelector("[name=pgGender]").textContent;
        const imgElement = row.querySelector(".pg-pic");
        const pgPicSrc = imgElement.getAttribute("src");
        const pgEmail = row.querySelector("[name=pgEmail]").textContent;
        const pgPh = row.querySelector("[name=pgPh]").textContent;
        const pgAddress = row.querySelector("[name=pgAddress]").textContent;
        const pgBirthday = row.querySelector("[name=pgBirthday]").textContent;


        Swal.fire({
            title: `修改PG ID為${pgId} - ${pgName}的資訊`,
            html:
                `
                <div class="row d-flex justify-content-center" style="color: #fff; font-family: cwTeXYen" >
                    <div class="col-md-6">
                        <label for="pgId" style="font-size: 18px;">美容師ID:${pgId}</label><br>
                        <label for="newPgName" style="font-size: 18px;">美容師姓名</label>               
                        <input type="text" id="newPgName" class="form-control" value="${pgName}"  /><br>
                        <label for="newPgGender" style="font-size: 18px;">美容師性別</label>  
                        <input type="text" id="newPgGender" class="form-control" value="${pgGender}" /><br>

                        <label for="newPgEmail" style="font-size: 18px;">Email</label>
                        <input type="text" id="newPgEmail" class="form-control" value="${pgEmail}" ><br>
                        <label for="newPgPh" style="font-size: 18px;">手機號碼</label>
                        <input type="text" id="newPgPh" class="form-control" value="${pgPh}"><br>
                        <label for="newPgAddress" style="font-size: 18px;">地址</label>
                        <input type="text" id="newPgAddress" class="form-control" value="${pgAddress}"><br>
                        <label for="newPgBirthday" style="font-size: 18px;">生日</label>   
                        <input type="text" id="dateInput" name="dateInput" placeholder="請點擊選擇預約日期"><br>
                    </div>    
                    <div class="col-md-6">
                        <label for="modifyPic" style="font-size: 18px;">美容師照片</label>
                        <img src="${pgPicSrc}" alt="此美容師無照片" class="modifyPic"><br>
                    </div>    
                 </div>
                 `,
            didRender: function () {
                const dateInput = document.getElementById("dateInput");
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
                
            },
            showCancelButton: true,
            confirmButtonText: '確認',
            confirmButtonColor: '#8f88f8',
            cancelButtonText: '取消',
            background: 'rgba(0, 50, 129, 0.79)',
            width:'700px',
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
    //格式化yyyy-mm-dd
    function formatDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    }

});
