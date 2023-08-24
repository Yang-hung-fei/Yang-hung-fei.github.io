import config from "../../../../ipconfig.js";
window.addEventListener("load", () => {
    const token = localStorage.getItem("Authorization_U");

    const limitSelect = document.querySelector("#limit");
    const sortSelect = document.querySelector("#sort");
    let currentPage = 1;
    let itemsPerPage = parseInt(limitSelect.value);

    //純顯示用
    const maxCount = document.querySelector("#maxCount");

    //一進入頁面呼叫
    fetchAndBuildTable(itemsPerPage, sortSelect.value, currentPage);

    //當最大筆數不同
    limitSelect.addEventListener("change", () => {
        itemsPerPage = parseInt(limitSelect.value);
        currentPage = 1;
        fetchAndBuildTable(itemsPerPage, sortSelect.value, currentPage);
    });
    //當排序選擇
    sortSelect.addEventListener("change", () => {
        fetchAndBuildTable(itemsPerPage, sortSelect.value, currentPage);
    });


    //撈該使用者的預約單(token要改)
    function fetchAndBuildTable(itemsPerPage, sort, page) {
        const offset = (page - 1) * itemsPerPage;
        fetch(config.url + `/user/appointmentList?limit=${itemsPerPage}&sort=${sort}&offset=${offset}`, {
            method: "GET",
            headers: {
                Authorization_U: "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI0IiwiZXhwIjoxNjkzMTMwNjQyfQ.65VWBEyaA6_Wq8LB8zkO1xT1TxlRsbyJHI-uwNKhWqs",
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
                <td class="text-center" hidden name="pgId">${appointment.pgId}</td>
                <td class="text-center" hidden name="pgaNo">${appointment.pgaNo}</td>
                <td class="text-center" name="pgName">${appointment.pgName}</td>
                <td class="text-center">
                <img src="data:image/png;base64,${appointment.pgPic}" alt="美容師照片" class="pg-pic">
                </td>
                <td class="text-center" name="sourcePgaDate">${appointment.pgaDate}</td>
                <td class="text-center" name="sourcePgaTime">${appointment.pgaTime}</td>
                <td class="text-center" name="pgaOption">${appointment.pgaOption}</td>
                <td class="text-center" name="pgaNotes" style="max-width: 80px;white-space:pre-line;
                word-wrap: break-word;">${appointment.pgaNotes}</td>
                <td class="text-center">${appointment.userName}</td>
                <td class="text-center" name="pgaPhone">${appointment.pgaPhone}</td>
                <td class="text-center" name="pgaState">${appointment.pgaState}</td>
                <td class="text-center disable-edit">
                    <button class="btn slot-button" data-action="modify">修改</button>
                </td>
                <td class="text-center">
                    <button class="btn slot-button">完成</button>
                </td>
                <td class="text-center">
                    <button class="btn slot-button">取消</button>
                </td>
            `;

            tableBody.appendChild(row);
        });
    }

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
                fetchAndBuildTable(itemsPerPage, sortSelect.value, currentPage);
                scrollToTopFromCurrentPosition(170);
            });
            paginationButtonsContainer.appendChild(button);
        }
    }
    //滾動至最頂 參數可設置豪秒
    function scrollToTopFromCurrentPosition(duration) {
        const startScrollY = window.pageYOffset;
        const startTime = 'now' in window.performance ? performance.now() : new Date().getTime();

        function scroll(timestamp) {
            const currentTime = 'now' in window.performance ? performance.now() : new Date().getTime();
            const timeElapsed = currentTime - startTime;

            const easeInOutCubic = t => t < .5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
            const scrollY = Math.max(startScrollY - startScrollY * easeInOutCubic(timeElapsed / duration), 0);

            window.scrollTo(0, scrollY);

            if (timeElapsed < duration) {
                requestAnimationFrame(scroll);
            }
        }

        requestAnimationFrame(scroll);
    }


    //修改:
    function handleModifyButtonClick(editButton) {

        
        const row = editButton.closest("tr");
        const sourcePgaDate = row.querySelector("[name=sourcePgaDate]").textContent;
        const sourcePgaTime = row.querySelector("[name=sourcePgaTime]").textContent;
        const pgaOption = row.querySelector("[name=pgaOption]").textContent;
        const pgaNotes = row.querySelector("[name=pgaNotes]").textContent;
        const pgaPhone = row.querySelector("[name=pgaPhone]").textContent;

        Swal.fire({
            title: '修改預約',
            html:
                `<input type="text" id="editPgaNewDate" placeholder="新預約日期" value="${sourcePgaDate}">
                 <input type="text" id="editPgaNewTime" placeholder="新预约时段" value="${sourcePgaTime}">
                 <input type="text" id="editPgaOption" placeholder="新预约选项" value="${pgaOption}">
                 <input type="text" id="editPgaNotes" placeholder="新备注" value="${pgaNotes}">
                 <input type="text" id="editPgaPhone" placeholder="新预约电话" value="${pgaPhone}">`,
            showCancelButton: true,
            confirmButtonText: '確認',
            cancelButtonText: '取消',
            preConfirm: () => {
                const editedData = {
                    pgaNewDate: document.getElementById("editPgaNewDate").value,
                    pgaNewTime: document.getElementById("editPgaNewTime").value,
                    pgaOption: document.getElementById("editPgaOption").value,
                    pgaNotes: document.getElementById("editPgaNotes").value,
                    pgaPhone: document.getElementById("editPgaPhone").value,
                };
                return editedData;
            },
        }).then((result) => {
            if (result.isConfirmed) {
                // 在这里可以将修改后的数据发送到服务器
                // 更新表格等逻辑
            }
        });
    }

});