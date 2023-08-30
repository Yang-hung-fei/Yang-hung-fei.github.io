import config from "../../../../../ipconfig.js";
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
                                        cell.appendChild(button);
                                    } else {
                                        cell.textContent = '-';
                                    }

                                    row.appendChild(cell);
                                }
                            }

                            calendarBody.appendChild(row);
                        }
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
    calendarTable.addEventListener('click', (event) => {
        const clickedElement = event.target;

        // 確保點擊的是按鈕元素
        if (clickedElement.tagName === 'BUTTON') {
            const tdElement = clickedElement.parentElement; // 取得包含按鈕的 td 元素
            const columnIndex = tdElement.cellIndex; // 取得所在列的索引（不包含表頭行）
            const tableBody = calendarTable.querySelector('tbody'); // 表格的tbody元素
            const tdElements = tableBody.querySelectorAll(`td:nth-child(${columnIndex + 1})`); // 抓取指定列的所有td

            let pgsState = '';

            tdElements.forEach(td => {
                const button = td.querySelector('button');
                pgsState += button.value; // 將每個td內的按鈕值組成字串
            });
            console.log(pgsState);

            const pgsId = tdElements[0].querySelector('[name="pgsId"]').value; // 取得第一個td的相鄰的前一個兄弟元素的值
            const pgId = pgIdInput.value; // 從 hidden input 中取得 pgId
            const pgsDate = tdElements[0].querySelector('[name="pgsDate"]').value; // 取得第一個td內的 name="pgsDate" 隱藏 input 的值

            // 构建請求的數據
            const requestData = {
                pgsId: parseInt(pgsId),
                pgId: parseInt(pgId),
                pgsDate,
                pgsState
            };

            // 執行fetch請求
            fetch(config.url + "/manager/modifySchedule", {
                method: "POST",
                headers: {
                    Authorization_M: "your-auth-token",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(requestData)
            })
                .then(response => response.json())
                .then(data => {
                    if (data.code === 200) {
                        // 成功處理的操作
                        console.log("Request successful:", data.message);
                    } else {
                        // 處理錯誤的操作
                        console.error("Request failed:", data.message);
                    }
                })
                .catch(error => {
                    console.error("An error occurred:", error);
                });
        }
    });
});