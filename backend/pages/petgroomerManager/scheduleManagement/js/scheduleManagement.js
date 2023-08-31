import config from "../../../../../ipconfig.js";
let tdElements = [];
window.addEventListener("load", () => {
    // 表格元素
    const calendarTable = document.getElementById('calendar');

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
    for (let year = 2020; year <= 2120; year++) {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        yearSelect.appendChild(option);
    }
    const monthInput = document.getElementById('month');

    yearSelect.value = parseInt(currentYear);// 將年分設置到Input框中
    monthInput.value = parseInt(currentMonth); // 將月分設置道Input框中

    yearSelect.addEventListener('change', function () {

        fetchGroomerSchedule(pgIdInput.value, parseInt(yearSelect.value), parseInt(monthInput.value));

    });
    monthInput.addEventListener('change', function () {
        fetchGroomerSchedule(pgIdInput.value, parseInt(yearSelect.value), parseInt(monthInput.value));
    });
    fetchGroomer();

    //撈使用者美容師資料(token要改)
    function fetchGroomer() {
        fetch(config.url + "/manager/schedulePageGroomer", {
            method: "GET",
            headers: {
                Authorization_M: "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxIiwiZXhwIjoxNjkzNzM0ODgzfQ.MGVymnvxKaRZ9N7gGInQitt7q_zVoHxvt2n7hoPws6A",
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
                Authorization_M: "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxIiwiZXhwIjoxNjkzNzM0ODgzfQ.MGVymnvxKaRZ9N7gGInQitt7q_zVoHxvt2n7hoPws6A",
                "Content-Type": "application/json"
            }
        })
            .then(response => response.json())
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

                        // 创建每小时的行
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
                                        button.classList.add('btn'); // 添加 "btn" 类
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
                        // 找到表头的容器元素
                        const tableHeaderRow = document.querySelector("#calendar-body tr:first-child");
                        const thElements = tableHeaderRow.querySelectorAll("th");

                        // 遍历每个表头单元格
                        thElements.forEach((th, index) => {
                            if (index > 0) { // 跳过第一个表头单元格
                                // 创建按钮元素
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

                                // 添加按钮到表头单元格
                                th.appendChild(modifyButton);
                                th.appendChild(sendButton);
                                th.appendChild(cancelButton);
                            }
                        });
                        // 获取所有的修改、送出和取消按钮
                        const modifyButtons = document.querySelectorAll(".modify-button");
                        const sendButtons = document.querySelectorAll(".send-button");
                        const cancelButtons = document.querySelectorAll(".cancel-button");

                        // 为每个修改按钮添加点击事件
                        modifyButtons.forEach((modifyButton, index) => {
                            modifyButton.addEventListener("click", () => {

                                // 隐藏所有列的修改按钮
                                modifyButtons.forEach((btn) => {
                                    btn.hidden = true;
                                });

                                // 显示对应列的送出和取消按钮
                                sendButtons[index].hidden = false;
                                cancelButtons[index].hidden = false;
                            });
                        });

                        // 為每個送出按鈕添加點擊事件
                        sendButtons.forEach((sendButton, index) => {
                            sendButton.addEventListener("click", () => {

                                // 隱藏送出和取消按鈕
                                sendButtons[index].hidden = true;
                                cancelButtons[index].hidden = true;

                                // 顯示所有列的修改按鈕
                                modifyButtons.forEach((btn) => {
                                    btn.hidden = false;
                                });

                                // 將該列的所有 status-button 按鈕的 disabled 屬性改為 true
                                tdElements.forEach(td => {
                                    const button = td.querySelector('.status-button');
                                    button.disabled = true;
                                });

                                const thElement = sendButton.parentElement; // 取得包含按鈕的 th 元素
                                const columnIndex = thElement.cellIndex; // 取得所在列的索引（不包含表頭行）
                                const tableBody = calendarTable.querySelector('tbody'); // 表格的 tbody 元素
                                tdElements = tableBody.querySelectorAll(`td:nth-child(${columnIndex + 1})`); // 抓取指定列的所有 td

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
                            });

                        });

                        // 取消按鈕監聽
                        cancelButtons.forEach((cancelButton, index) => {
                            cancelButton.addEventListener("click", () => {

                                // 隐藏送出和取消按钮
                                sendButtons[index].hidden = true;
                                cancelButtons[index].hidden = true;

                                // 顯示所有列的修改按鈕
                                modifyButtons.forEach((btn) => {
                                    btn.hidden = false;
                                });

                                // 將該列的所有 status-button 按鈕的 disabled 屬性改回 true
                                tdElements.forEach(td => {
                                    const button = td.querySelector('.status-button');
                                    button.disabled = true;
                                });
                                fetchGroomerSchedule(pgIdInput.value, yearSelect.value, monthInput.value);

                            });
                        });

                        calendarTable.addEventListener('click', (event) => {
                            const clickedElement = event.target;

                            // 確保點擊的是「修改」按鈕元素
                            if (clickedElement.id === 'modify') {
                                const thElement = clickedElement.parentElement; // 取得包含按鈕的 th 元素
                                const columnIndex = thElement.cellIndex; // 取得所在列的索引（不包含表頭行）
                                const tableBody = calendarTable.querySelector('tbody'); // 表格的 tbody 元素
                                tdElements = tableBody.querySelectorAll(`td:nth-child(${columnIndex + 1})`); // 抓取指定列的所有 td

                                // 將該列的所有 status-button 按鈕的 disabled 屬性改為 false
                                tdElements.forEach(td => {
                                    const button = td.querySelector('.status-button');
                                    button.disabled = false;
                                });
                            }
                        });

                        // 監聽 status-button 按鈕的點擊事件
                        calendarTable.addEventListener('click', (event) => {
                            const clickedElement = event.target;

                            // 確保點擊的是 status-button 按鈕元素
                            if (clickedElement.classList.contains('status-button')) {
                                const currentValue = clickedElement.value;

                                // 循環改變 value 值
                                if (currentValue === '0') {
                                    clickedElement.value = '1';
                                } else if (currentValue === '1') {
                                    clickedElement.value = '0';
                                }else if(currentValue === '2'){
                                    clickedElement.value = '1';
                                }

                                // 更新按鈕的文字和樣式
                                clickedElement.textContent = getButtonText(clickedElement.value);
                                clickedElement.classList.remove('green-button', 'gray-button', 'yellow-button');
                                clickedElement.classList.add(getButtonClass(clickedElement.value));
                            }
                        });

                    }
                    function getButtonText(state) {
                        switch (state) {
                            case '0':
                                return '出勤';
                            case '1':
                                return '-';
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
            });
    }

    //修改請求
    function fetchModifySchedule(pgsId, pgId, pgsDate, pgsState) {
        // 构建请求的数据
        const requestData = {
            pgsId: parseInt(pgsId),
            pgId: parseInt(pgId),
            pgsDate,
            pgsState
        };

        // 执行fetch请求
        fetch(config.url + "/manager/modifySchedule", {
            method: "POST",
            headers: {
                Authorization_M: "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxIiwiZXhwIjoxNjkzNzM0ODgzfQ.MGVymnvxKaRZ9N7gGInQitt7q_zVoHxvt2n7hoPws6A",
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
});