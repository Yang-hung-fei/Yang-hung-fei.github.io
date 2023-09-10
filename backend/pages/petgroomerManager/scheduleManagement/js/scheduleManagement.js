import config from "../../../../../ipconfig.js";
let tdElements = [];
window.addEventListener("load", () => {
    const token = localStorage.getItem("Authorization_M"); // 使用Manager Token
    // const token = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI1IiwiZXhwIjoxNjk0Njg4NzQxfQ.b5PO4UyeDrQApx3_CTXPtDvpN4-XKxWteiSqCa5AuPI"; // 使用Manager Token
    // 表格元素
    const calendarTable = document.getElementById('calendar');
    //error
    const errorDiv = document.getElementById("error");

    //存放資訊
    const pgNameSelect = document.getElementById('pgName');
    const pgPic = document.getElementById('pgPic');
    const pgIdInput = document.getElementById('pgId');
    //年份 / 月份
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear(); // 獲取年份
    const currentMonth = currentDate.getMonth() + 1; // 獲取月份（0-based）
    //月份按鈕
    const prevMonthBtn = document.getElementById('prevMonthBtn');
    const nextMonthBtn = document.getElementById('nextMonthBtn');
    // 當點擊上個月按鈕時
    prevMonthBtn.addEventListener('click', () => {
        const currentMonth = parseInt(monthInput.value);
        const newMonth = currentMonth - 1 > 0 ? currentMonth - 1 : 12;
        const newYear = currentMonth - 1 > 0 ? parseInt(yearSelect.value) : parseInt(yearSelect.value) - 1;
        yearSelect.value = newYear;
        monthInput.value = newMonth;
        fetchGroomerSchedule(pgIdInput.value, newYear, newMonth);
    });

    // 當點擊下個月按鈕時
    nextMonthBtn.addEventListener('click', () => {
        const currentMonth = parseInt(monthInput.value);
        const newMonth = currentMonth + 1 <= 12 ? currentMonth + 1 : 1;
        const newYear = currentMonth + 1 <= 12 ? parseInt(yearSelect.value) : parseInt(yearSelect.value) + 1;
        yearSelect.value = newYear;
        monthInput.value = newMonth;
        fetchGroomerSchedule(pgIdInput.value, newYear, newMonth);
    });

    // const yearSelect = document.getElementById('year');
    const yearSelect = document.getElementById('yearSelect');
    for (let year = 2000; year <= 2120; year++) {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        yearSelect.appendChild(option);
    }

    const batchyearSelect = document.getElementById('batchyearSelect');
    for (let year = 2023; year <= 2120; year++) {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        batchyearSelect.appendChild(option);
    }


    const monthInput = document.getElementById('month');

    yearSelect.value = parseInt(currentYear);// 將年分設置到Input框中
    monthInput.value = parseInt(currentMonth); // 將月分設置道Input框中

    yearSelect.addEventListener('change', function () {
        fetchGroomerSchedule(pgIdInput.value, parseInt(yearSelect.value), parseInt(monthInput.value));

    });
    monthInput.addEventListener('change', function () {
        adjustMonthValue(monthInput);
        fetchGroomerSchedule(pgIdInput.value, parseInt(yearSelect.value), parseInt(monthInput.value));
    });

    function adjustMonthValue(input) {
        var value = parseInt(input.value, 10);

        if (isNaN(value) || value < 1) {
            input.value = 1;
        } else if (value > 12) {
            input.value = 12;
        }
    }

    fetchGroomer();

    //撈使用者美容師資料(token要改)
    function fetchGroomer() {
        fetch(config.url + "/manager/schedulePageGroomer", {
            method: "GET",
            headers: {
                Authorization_M: token,
                "Content-Type": "application/json"
            }
        })
            .then(response => response.json())
            .then(data => {
                if (data.code === 200) {
                    const groomers = data.message;

                    // 填充美容師下拉選單
                    groomers.forEach(groomer => {
                        const option = document.createElement('option');
                        option.value = groomer.pgId;
                        option.textContent = `${groomer.pgId} - ${groomer.pgName}`;
                        pgNameSelect.appendChild(option);
                    });

                    // 美容師選擇事件
                    pgNameSelect.addEventListener('change', function () {
                        pgPic.style.display = 'inline';
                        const selectedGroomer = groomers.find(groomer => groomer.pgId == this.value);

                        pgPic.src = '';

                        if (selectedGroomer) {
                            pgPic.src = 'data:image/png;base64,' + selectedGroomer.pgPic;
                            pgIdInput.value = selectedGroomer.pgId;
                        }
                        fetchGroomerSchedule(pgIdInput.value, yearSelect.value, monthInput.value);
                    });

                    // 直接選擇第一個選項並觸發 change 事件
                    const firstOption = pgNameSelect.querySelector('option');
                    if (firstOption) {
                        firstOption.selected = true;
                        pgNameSelect.dispatchEvent(new Event('change'));
                    }
                } else if (data.code === 401) {
                    Swal.fire({
                        icon: "error",
                        title: "無權限",
                        text: `身分${data.message}`
                    });
                } else {
                    Swal.fire({
                        icon: "error",
                        title: "無美容師，無法查詢班表。",
                        text: data.message
                    });

                }
            });
    }
    // 日曆類別
    class Calendar {
        // 日期
        constructor(year, month) {
            this.year = year;
            this.month = month;
        }

        // 取得當月的天數
        getDaysOfMonth() {
            // 判斷是否為閏年
            const isLeapYear = this.year % 4 === 0 && this.year % 100 !== 0 || this.year % 400 === 0;

            // 取得月份的天數
            const daysOfMonth = [
                31,
                28 + isLeapYear,
                31,
                30,
                31,
                30,
                31,
                31,
                30,
                31,
                30,
                31,
            ];

            return daysOfMonth[this.month - 1];
        }

        // 取得當月的第一天是星期幾
        getWeekdayOfFirstDay() {
            const day = new Date(this.year, this.month, 1);
            return day.getDay();
        }

        // 取得當月的日期陣列
        getDayTextArray() {
            const daysOfMonth = this.getDaysOfMonth();
            const weekdayOfFirstDay = this.getWeekdayOfFirstDay();

            const dayTextArray = [];
            let day = 1;
            for (let i = 0; i < daysOfMonth; i++) {
                dayTextArray.push(day);
                day++;
            }

            // 將日期陣列補齊
            const padding = weekdayOfFirstDay - 1;
            for (let i = 0; i < padding; i++) {
                dayTextArray.unshift("&nbsp;");
            }

            return dayTextArray;
        }
    }
    //建構班表
    function fetchGroomerSchedule(pgId, yearParam, monthParam) {

        fetch(config.url + `/manager/schedule?pgId=${pgId}&year=${yearParam}&month=${monthParam}`, {
            method: "GET",
            headers: {
                Authorization_M: token,
                "Content-Type": "application/json"
            }
        }).then(res => res.json())
            .then(data => {
                if (data.code === 200) {
                    const pgs = data.message;

                    // 將API返回的數據按日期進行分組
                    const scheduleData = {}; // 使用日期作為鍵，值為對應日期的排班數據數組
                    pgs.forEach(item => {
                        const date = item.pgsDate;
                        if (!scheduleData[date]) {
                            scheduleData[date] = [];
                        }
                        scheduleData[date].push(item);
                    });

                    // 獲取當前年月
                    const currentDate = new Date();
                    const currentYear = currentDate.getFullYear();
                    const currentMonth = currentDate.getMonth() + 1; // 月份從0開始

                    // 根據日曆數據和當前年月生成日曆表格
                    function generateCalendar(year, month) {
                        const calendar = new Calendar(year, month);
                        const calendarBody = document.getElementById('calendar-body');
                        calendarBody.innerHTML = ''; // 清空表格内容

                        const daysOfMonth = calendar.getDaysOfMonth();

                        // 創建表格的第一行，包含日期信息
                        const dateRow = document.createElement('tr');
                        const thEmpty = document.createElement('th');
                        dateRow.appendChild(thEmpty);

                        for (let day = 1; day <= daysOfMonth; day++) {
                            const th = document.createElement('th');
                            th.textContent = `${day}號`; // Display day of the month
                            dateRow.appendChild(th);
                        }

                        calendarBody.appendChild(dateRow);

                        // 創建每小時的行
                        for (let hour = 0; hour < 25; hour++) {
                            const row = document.createElement('tr');

                            if (hour > 0) {
                                const hourCell = document.createElement('td');
                                hourCell.textContent = `${hour - 1}:00 - ${hour === 24 ? '0' : hour}:00`;
                                row.appendChild(hourCell);
                            }

                            for (let day = 1; day <= daysOfMonth; day++) {
                                if (hour === 0) {
                                } else {
                                    const cell = document.createElement('td');
                                    cell.classList.add('calendar-cell'); // 添加 CSS class

                                    const date = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
                                    const scheduleDataForDate = scheduleData[date] || [];
                                    const scheduleItem = scheduleDataForDate.find(item => item.pgsState.charAt(hour - 1) !== '');

                                    if (scheduleItem) {
                                        const input = document.createElement('input');
                                        input.name = 'pgsId';
                                        input.type = 'hidden';
                                        input.value = scheduleItem.pgsId; // 設置 input 的值為pgsId
                                        input.readOnly = true;
                                        cell.appendChild(input);

                                        const pgsDateInput = document.createElement('input'); // 創建隱藏的 input 元素
                                        pgsDateInput.type = 'hidden'; // 設置 input 元素類型為隱藏
                                        pgsDateInput.value = scheduleItem.pgsDate; // 設置 input 的值為日期
                                        pgsDateInput.name = 'pgsDate'; // 設置 input 的 name 屬性
                                        pgsDateInput.readOnly = true; // 設定為只讀
                                        cell.appendChild(pgsDateInput); // 將 input 放置到 cell 元素內

                                        const button = document.createElement('button');
                                        button.name = 'state';
                                        button.value = scheduleItem.pgsState.charAt(hour - 1);
                                        button.textContent = getButtonText(scheduleItem.pgsState.charAt(hour - 1));
                                        button.classList.add('status-button');
                                        button.classList.add(getButtonClass(scheduleItem.pgsState.charAt(hour - 1)));
                                        button.classList.add('btn'); // 添加 "btn" 類
                                        button.disabled = true;
                                        cell.appendChild(button);
                                    } else {
                                        cell.textContent = '-';
                                    }

                                    row.appendChild(cell);
                                }
                            }

                            calendarBody.appendChild(row);
                        }

                        // 找到表頭的容器元素
                        const tableHeaderRow = document.querySelector("#calendar-body tr:first-child");
                        const thElements = tableHeaderRow.querySelectorAll("th");

                        // 遍歷每個表頭單元格
                        thElements.forEach((th, index) => {
                            if (index > 0) { // 跳過第一個表頭單元格
                                // 創建按鈕元素
                                const modifyButton = document.createElement("button");
                                modifyButton.id = "modify";
                                modifyButton.name = "modify";
                                modifyButton.classList.add("form-control", "modify-button");
                                modifyButton.style = " margin: 0;";
                                modifyButton.textContent = "修改";

                                const sendButton = document.createElement("button");
                                sendButton.id = "send";
                                sendButton.name = "send";
                                sendButton.classList.add("form-control", "send-button");
                                sendButton.style = " margin: 0;";
                                sendButton.textContent = "送出";
                                sendButton.hidden = true;

                                const cancelButton = document.createElement("button");
                                cancelButton.id = "cancel";
                                cancelButton.name = "cancel";
                                cancelButton.classList.add("form-control", "cancel-button");
                                cancelButton.style = " margin: 0;";
                                cancelButton.textContent = "取消";
                                cancelButton.hidden = true;

                                // 添加按鈕到表頭單元格
                                th.appendChild(modifyButton);
                                th.appendChild(sendButton);
                                th.appendChild(cancelButton);
                            }
                        });
                        // 獲取所有的修改、送出和取消按钮
                        const modifyButtons = document.querySelectorAll(".modify-button");
                        const sendButtons = document.querySelectorAll(".send-button");
                        const cancelButtons = document.querySelectorAll(".cancel-button");

                        // 為每個修改按鈕添加點擊事件
                        modifyButtons.forEach((modifyButton, index) => {
                            modifyButton.addEventListener("click", () => {

                                // 隐藏所有列的修改按钮
                                modifyButtons.forEach((btn) => {
                                    btn.hidden = true;
                                });

                                // 顯示對應列的送出和取消按鈕
                                sendButtons[index].hidden = false;
                                cancelButtons[index].hidden = false;
                            });
                        });

                        calendarTable.addEventListener('click', (event) => {
                            const clickedElement = event.target;

                            // 確保點擊的是「修改」按鈕元素
                            if (clickedElement.classList.contains('modify-button')) {
                                const thElement = clickedElement.parentElement;
                                const columnIndex = thElement.cellIndex;
                                const tableBody = calendarTable.querySelector('tbody');
                                const tdElements = tableBody.querySelectorAll(`td:nth-child(${columnIndex + 1})`);

                                // Toggle buttons visibility
                                clickedElement.hidden = true;
                                thElement.querySelector('.send-button').hidden = false;
                                thElement.querySelector('.cancel-button').hidden = false;
                                event.stopPropagation();
                                event.stopImmediatePropagation();
                                // Enable corresponding status-button elements
                                tdElements.forEach(td => {
                                    const button = td.querySelector('.status-button');
                                    button.disabled = false;
                                });
                            }

                            // 確保點擊的是 status-button 按鈕元素
                            if (clickedElement.classList.contains('status-button')) {
                                const currentValue = clickedElement.value;

                                if (currentValue === '0') {
                                    clickedElement.value = '1';
                                } else if (currentValue === '1') {
                                    clickedElement.value = '0';
                                } else if (currentValue === '2') {
                                    clickedElement.value = '1';
                                }
                                event.stopPropagation();
                                event.stopImmediatePropagation();
                                clickedElement.textContent = getButtonText(clickedElement.value);
                                clickedElement.classList.remove('green-button', 'gray-button', 'yellow-button');
                                clickedElement.classList.add(getButtonClass(clickedElement.value));

                            }
                            if (clickedElement.classList.contains('send-button')) {
                                const thElement = clickedElement.parentElement;
                                const columnIndex = thElement.cellIndex;
                                const tableBody = calendarTable.querySelector('tbody');
                                const tdElements = tableBody.querySelectorAll(`td:nth-child(${columnIndex + 1})`);

                                const firstTd = tdElements[0]; // 取得該列的第一個 td 元素
                                const pgsId = firstTd.querySelector('[name="pgsId"]').value;
                                const pgsDate = firstTd.querySelector('[name="pgsDate"]').value;

                                const pgId = pgIdInput.value;
                                // 獲取對應列中的所有 status-button 按鈕的值，組成字串
                                let pgsState = "";
                                tdElements.forEach(td => {
                                    const button = td.querySelector('.status-button');
                                    pgsState += button.value;
                                });

                                fetchModifySchedule(pgsId, pgId, pgsDate, pgsState);

                                // 隱藏送出和取消按鈕
                                thElement.querySelector('.send-button').hidden = true;
                                clickedElement.hidden = true;

                                // 顯示所有列的修改按鈕
                                modifyButtons.forEach((btn) => {
                                    btn.hidden = false;
                                });

                                // 將該列的所有 status-button 按鈕的 disabled 屬性改為 true
                                tdElements.forEach(td => {
                                    const button = td.querySelector('.status-button');
                                    button.disabled = true;
                                });
                                fetchGroomerSchedule(pgIdInput.value, yearSelect.value, monthInput.value);

                            }
                            if (clickedElement.classList.contains('cancel-button')) {
                                const thElement = clickedElement.parentElement;
                                const columnIndex = thElement.cellIndex;
                                const tableBody = calendarTable.querySelector('tbody');
                                const tdElements = tableBody.querySelectorAll(`td:nth-child(${columnIndex + 1})`);

                                // 隐藏送出和取消按钮
                                thElement.querySelector('.send-button').hidden = true;
                                clickedElement.hidden = true;

                                // 顯示所有列的修改按鈕
                                modifyButtons.forEach((btn) => {
                                    btn.hidden = false;
                                });
                                event.stopPropagation();
                                event.stopImmediatePropagation();
                                // 將該列的所有 status-button 按鈕的 disabled 屬性改回 true
                                tdElements.forEach(td => {
                                    const button = td.querySelector('.status-button');
                                    button.disabled = true;
                                });
                                fetchGroomerSchedule(pgIdInput.value, yearSelect.value, monthInput.value);
                            }
                        });
                    }

                    function getButtonText(state) {
                        switch (state) {
                            case '0':
                                return '出勤';
                            case '1':
                                return '休';
                            case '2':
                                return '被預約';
                            default:
                                return '';
                        }
                    }

                    function getButtonClass(state) {
                        switch (state) {
                            case '0':
                                return 'green-button';
                            case '1':
                                return 'gray-button';
                            case '2':
                                return 'yellow-button';
                            default:
                                return '';
                        }
                    }
                    // 初始化生成當前年月日歷
                    generateCalendar(yearParam, monthParam);
                } else {
                    const calendarBody = document.getElementById('calendar-body');
                    calendarBody.innerHTML = ''; // 清空表格内容
                    Swal.fire({
                        icon: "error",
                        title: data.message,
                    });
                }
            })
    }

    //修改請求
    function fetchModifySchedule(pgsId, pgId, pgsDate, pgsState) {
        // 構建請求的數據
        const requestData = {
            pgsId: parseInt(pgsId),
            pgId: parseInt(pgId),
            pgsDate,
            pgsState
        };

        // fetch
        fetch(config.url + "/manager/modifySchedule", {
            method: "POST",
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
                        title: "修改班表成功",
                        text: data.message
                    });
                    fetchGroomerSchedule(pgIdInput.value, yearSelect.value, monthInput.value); // Refresh schedule after modification
                } else {
                    Swal.fire({
                        icon: "success",
                        title: "修改班表失敗",
                        text: data.message
                    });
                    fetchGroomerSchedule(pgIdInput.value, yearSelect.value, monthInput.value); // Refresh schedule after modification
                }
            });
    }

    const dateInput = document.getElementById('dateInput');


    flatpickr(dateInput, {
        minDate: "today",
        dateFormat: "Y-m-d",
        onChange: function (selectedDates, dateStr, instance) {
            const selectedDate = selectedDates[0];
            const formattedDate = formatDate(selectedDate);
            dateInput.value = formattedDate;
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
        timeSlotsContainer.innerHTML = ''; // 清空容器內容

        for (let hour = 0; hour < 24; hour++) {
            const timeSlot = document.createElement('div');
            timeSlot.classList.add('time-slot');

            const checkboxId = `checkbox-${hour}`;

            const timeLabel = document.createElement('label');
            timeLabel.classList.add('time-label', 'text-center');
            timeLabel.textContent = `${hour}點`;
            timeLabel.setAttribute('for', checkboxId);

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.value = '1';
            checkbox.id = checkboxId;
            checkbox.classList.add('form-check-input');

            // 添加條件，如果 hour 在 9 到 21 之間，則預先勾選複選框
            if (hour >= 9 && hour <= 21) {
                checkbox.checked = true;
                checkbox.value = '0';
            }

            timeSlot.appendChild(timeLabel);
            timeSlot.appendChild(checkbox);

            timeSlotsContainer.appendChild(timeSlot);
        }
    }
    function addCheckboxListeners() {
        const checkboxes = document.querySelectorAll('.form-check-input');
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', function () {
                this.value = this.checked ? '0' : '1';
            });
        });
    }

    //新增單筆班表
    const addNewScBtn = document.getElementById('addNewScBtn');
    addNewScBtn.addEventListener('click', function () {
        const timeSlotsContainer = document.getElementById('timeSlots');
        const selectedDate = dateInput.value;
        const checkboxes = document.querySelectorAll('.form-check-input');
        let pgsState = '';
        checkboxes.forEach(checkbox => {
            pgsState += checkbox.value;
        });
        const requestData = {
            pgId: parseInt(pgIdInput.value),
            pgsDate: selectedDate,
            pgsState: pgsState
        };
        // POST
        fetch(config.url + "/manager/insertNewSchedule", {
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
                        title: "新增班表成功",
                        text: data.message
                    });
                    fetchGroomerSchedule(pgIdInput.value, yearSelect.value, monthInput.value);
                    dateInput.value = null;
                    timeSlotsContainer.innerHTML = '';
                } else {
                    Swal.fire({
                        icon: "error",
                        title: "新增班表失敗",
                        text: data.message
                    });
                    fetchGroomerSchedule(pgIdInput.value, yearSelect.value, monthInput.value);
                    dateInput.value = null;
                    timeSlotsContainer.innerHTML = '';
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
    });


    function generateBatchTimeSlots() {
        const batchTimeSlotsContainer = document.getElementById('batchTimeSlots');
        batchTimeSlotsContainer.innerHTML = ''; // 清空容器內容

        for (let hour = 0; hour < 24; hour++) {
            const timeSlot = document.createElement('div');
            timeSlot.classList.add('time-slot');

            const checkboxId = `checkbox-${hour}`;

            const timeLabel = document.createElement('label');
            timeLabel.classList.add('time-label', 'text-center');
            timeLabel.textContent = `${hour}點`;
            timeLabel.setAttribute('for', checkboxId);

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.value = '1';
            checkbox.id = checkboxId;
            checkbox.classList.add('batch-input');

            // 添加條件，如果 hour 在 9 到 21 之間，則預先勾選複選框
            if (hour >= 9 && hour <= 21) {
                checkbox.checked = true;
                checkbox.value = '0';
            }

            timeSlot.appendChild(timeLabel);
            timeSlot.appendChild(checkbox);

            batchTimeSlotsContainer.appendChild(timeSlot);
        }
    }

    const batchBtn = document.getElementById('batchBtn');
    //點擊批次新增出現
    batchBtn.addEventListener('click', function () {
        const hiddenDiv = document.getElementById('hiddenDiv');
        batchBtn.hidden = true;
        hiddenDiv.hidden = false;
        const batchInsertScheduleBtn = document.getElementById('batchInsertScheduleBtn');
        batchInsertScheduleBtn.hidden = false;
        const cancelbatchInsertScheduleBtn = document.getElementById('cancelbatchInsertScheduleBtn');
        cancelbatchInsertScheduleBtn.hidden = false;
        generateBatchTimeSlots();
    });
    //取消批次新增
    const cancelbatchInsertScheduleBtn = document.getElementById('cancelbatchInsertScheduleBtn');
    cancelbatchInsertScheduleBtn.addEventListener('click', function () {
        const hiddenDiv = document.getElementById('hiddenDiv');
        batchBtn.hidden = false;
        hiddenDiv.hidden = true;
        const batchInsertScheduleBtn = document.getElementById('batchInsertScheduleBtn');
        batchInsertScheduleBtn.hidden = true;
        const cancelbatchInsertScheduleBtn = document.getElementById('cancelbatchInsertScheduleBtn');
        cancelbatchInsertScheduleBtn.hidden = true;
        const batchTimeSlotsContainer = document.getElementById('batchTimeSlots');
        batchTimeSlotsContainer.innerHTML = ''; // 清空容器內容
    });

    const batchInsertScheduleBtn = document.getElementById('batchInsertScheduleBtn');
    const batchmonth = document.getElementById('batchmonth');

    batchmonth.addEventListener('blur', function () {
        let value = parseInt(batchmonth.value);
        if (isNaN(value) || value < 1 || value > 12) {
            const batchMonthCheck = document.getElementById("batchMonthCheck");
            batchMonthCheck.innerText = '無效的月份';
            batchmonth.value = ''; // 清空输入框
        } else {
            const batchMonthCheck = document.getElementById("batchMonthCheck");
            batchMonthCheck.innerText = '';
        }
    });


    //批次新增班表
    batchInsertScheduleBtn.addEventListener('click', function () {

        Swal.fire({
            title: '確定批次新增?',
            text: `確定批次新增美容師ID:[ ${pgNameSelect.value} ]的${batchyearSelect.value}年${batchmonth.value}月班表?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            cancelButtonText: '取消',
            confirmButtonText: '確定新增!'
        }).then((result) => {
            if (result.isConfirmed) {

                const batchyearSelect = document.getElementById('batchyearSelect');
                const batchmonth = document.getElementById('batchmonth');
                const checkboxes = document.querySelectorAll('.batch-input');
                let pgsState = '';
                checkboxes.forEach(checkbox => {
                    pgsState += checkbox.value;
                });
                const requestData = {
                    pgId: parseInt(pgIdInput.value),
                    year: parseInt(batchyearSelect.value),
                    month: parseInt(batchmonth.value),
                    pgsState: pgsState
                };
                console.log(JSON.stringify(requestData));

                // POST
                fetch(config.url + "/manager/batchInsertSchedule", {
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
                                title: "批次新增班表成功",
                                text: data.message
                            });
                            fetchGroomerSchedule(pgIdInput.value, yearSelect.value, monthInput.value);
                            dateInput.value = null;
                            timeSlotsContainer.innerHTML = '';
                            cancelbatchInsertScheduleBtn.click();
                        } else {
                            Swal.fire({
                                icon: "error",
                                title: "批次新增班表失敗",
                                text: data.message
                            });
                            fetchGroomerSchedule(pgIdInput.value, yearSelect.value, monthInput.value);
                            dateInput.value = null;
                            timeSlotsContainer.innerHTML = '';
                            cancelbatchInsertScheduleBtn.click();
                        }
                    })
                    .catch(error => {
                        Swal.fire({
                            icon: "error",
                            title: "批次新增班表失敗",
                            text: data.message
                        });
                    });

            }
        })
    });



});