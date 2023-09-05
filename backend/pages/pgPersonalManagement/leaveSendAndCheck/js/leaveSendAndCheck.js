import config from "../../../../../ipconfig.js";
window.addEventListener("load", () => {
    // const token = localStorage.getItem("Authorization_M"); // 使用Manager Token
    const token = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxIiwiZXhwIjoxNjkzNzM0ODgzfQ.MGVymnvxKaRZ9N7gGInQitt7q_zVoHxvt2n7hoPws6A";
    //錯誤顯示用
    const errorDiv = document.getElementById("error");

    // 一進入頁面呼叫
    fetchAndBuildTable();

    // 撈所有預約單 for Manager
    function fetchAndBuildTable() {
        fetch(config.url + `/manager/getLeaveByPg`, {
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
                    const rs = data.message;

                    buildTable(rs);
                } else if (data.code === 401) {
                    Swal.fire({
                        icon: "error",
                        title: "無權限",
                        text: `身分${data.message}`
                    });
                } else {
                    Swal.fire({
                        icon: "error",
                        title: "目前無預約單",
                        text: data.message
                    });
                }
            });
    }

    //建構表格
    function buildTable(data) {

        const table = $('.table-fill').DataTable({
            id: 'myTable',
            data: data,
            columns: [
                { data: 'leaveNo' },
                { data: 'pgId' },
                { data: 'pgName' },
                { data: 'leaveCreated' },
                { data: 'leaveDate' },
                {
                    data: 'leaveTime', // Use the leaveTime property
                    render: function (data) {
                        const timeSlots = data.split('').map((digit, index) => {
                            const hour = index.toString().padStart(2, '0'); // Add hour markers
                            const status = digit === '0' ? '出勤' : '休';
                            return { hour, status };
                        });

                        const rows = [];
                        for (let i = 0; i < timeSlots.length; i += 4) {
                            const slotsRow = timeSlots.slice(i, i + 4).map(slot => {
                                const statusClass = slot.status === '出勤' ? 'btn-success' : 'btn-danger';
                                return `<button class="btn ${statusClass} time-slot">${slot.hour}點${slot.status}</button>`;
                            }).join('');
                            rows.push(slotsRow);
                        }

                        return rows.join('<br>'); // Display rows with line breaks
                    }
                },
                { data: 'leaveState' }
            ],
            order: [[0, 'asc']], // 預設按 leaveCreated 欄位降序排列
            paging: true,
            searching: true,
            info: true,
            language: {
                url: "https://cdn.datatables.net/plug-ins/1.13.6/i18n/zh-HANT.json"
            }, createdRow: function (row, data, dataIndex) {
                const leaveState = data.leaveState;

                if (leaveState === '未審核') {
                    $('td', row).eq(6).css('color', 'blue'); // Set blue color for the 7th column (leaveState)
                } else if (leaveState === '審核通過') {
                    $('td', row).eq(6).css('color', 'green'); // Set green color for the 7th column (leaveState)
                } else if (leaveState === '審核未通過') {
                    $('td', row).eq(6).css('color', 'red'); // Set red color for the 7th column (leaveState)
                }
            }
        });
        $('.table-container').css('overflow-x', 'auto');


    }


    const dateInput = document.getElementById('dateInput');
    const addNewScBtn = document.getElementById('addNewScBtn');

    flatpickr(dateInput, {
        minDate: "today",
        dateFormat: "Y-m-d",
        onChange: function (selectedDates, dateStr, instance) {
            const selectedDate = selectedDates[0];
            const formattedDate = formatDate(selectedDate);
            dateInput.value = formattedDate;
            addNewScBtn.hidden = false;
            generateTimeSlots(); // 在選擇日期後生成時間槽
            addCheckboxListeners();
        }
    });

    // 格式化 yyyy-mm-dd
    function formatDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    }
    function generateTimeSlots() {
        const timeSlotsContainer = document.getElementById('timeSlots');
        timeSlotsContainer.innerHTML = ''; // Clear the container content

        const row = document.createElement('div');
        row.classList.add('row'); // Add Bootstrap row class

        for (let hour = 0; hour < 24; hour++) {
            const column = document.createElement('div');
            column.classList.add('col-2'); // Add Bootstrap column class for 5 columns

            const timeSlot = document.createElement('button');
            timeSlot.classList.add('time-button', 'btn', 'btn-secondary', 'w-100'); // Add Bootstrap classes
            timeSlot.textContent = `${hour}點`;
            timeSlot.value = '1'; // Set the default value to '1'

            column.appendChild(timeSlot);
            row.appendChild(column);

            // Add event listener to toggle button value and style
            timeSlot.addEventListener('click', function () {
                if (this.value === '1') {
                    this.value = '0';
                    this.classList.add('green-button', 'btn-success');
                    this.classList.remove('gray-button');
                } else if (this.value === '0') {
                    this.value = '1';
                    this.classList.add('gray-button');
                    this.classList.remove('btn-success', 'green-button');
                }
            });
        }

        timeSlotsContainer.appendChild(row);
    }
    function addCheckboxListeners() {
        const checkboxes = document.querySelectorAll('.form-check-input');
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', function () {
                this.value = this.checked ? '0' : '1';
            });
        });
    }

    addNewScBtn.addEventListener('click', function () {
        const selectedDate = dateInput.value;
        const buttons = document.querySelectorAll('.time-button');
        let pgLeaveTimeState = '';
 
        buttons.forEach(button => {
            pgLeaveTimeState += button.value;
        });
        const reqData = {
            leaveDate: selectedDate,
            leaveTime: pgLeaveTimeState
        };

        Swal.fire({
            title: '確定送出假單嗎?',
            text: "請務必再次確認!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: '確定!',
            cancelButtonText: '取消'
        }).then((result) => {
            if (result.isConfirmed) {
                fetchAddleave(reqData);
            }
        })



    });
    function fetchAddleave(requestData) {
        fetch(config.url + "/manager/commitLeave", {
            method: 'POST',
            headers: {
                Authorization_M: token,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(requestData)
        })
            .then(response => response.json())
            .then(data => {
                if (data.code === 200) {
                    Swal.fire({
                        icon: "success",
                        title: "送出假單成功",
                        text: data.message
                    });
                    if (dataTableInstance) {
                        dataTableInstance.destroy();
                    }
                    fetchAndBuildTable();
                } else {
                    Swal.fire({
                        icon: "error",
                        title: "送出假單失敗",
                        text: data.message
                    });
                    if (dataTableInstance) {
                        dataTableInstance.destroy();
                    }
                    fetchAndBuildTable();
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }
});
