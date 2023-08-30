import config from "../../../../../ipconfig.js";
window.addEventListener("load", () => {

    const pgNameSelect = document.getElementById('pgName');
    const pgPic = document.getElementById('pgPic');
    const pgIdInput = document.getElementById('pgId');

    const currentDate = new Date();
    const currentYear = currentDate.getFullYear(); // 獲取年份
    const currentMonth = currentDate.getMonth() + 1; // 獲取月份（0-based）

    const yearInput = document.getElementById('year');

    const monthInput = document.getElementById('month');

    yearInput.value = parseInt(currentYear);// 將年分設置到Input框中
    monthInput.value = parseInt(currentMonth); // 將月分設置道Input框中

    yearInput.addEventListener('change', function () {
        
        fetchGroomerSchedule(pgIdInput.value, parseInt(yearInput.value), parseInt(monthInput.value));
        
    });
    monthInput.addEventListener('change', function () {
        fetchGroomerSchedule(pgIdInput.value, parseInt(yearInput.value), parseInt(monthInput.value));
    });
    fetchGroomer();

    //撈使用者/美容師資料(token要改)
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
                        fetchGroomerSchedule(pgIdInput.value, yearInput.value, monthInput.value);
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

                    // 将API返回的数据按日期进行分组
                    const scheduleData = {}; // 使用日期作为键，值为对应日期的排班数据数组
                    pgs.forEach(item => {
                        const date = item.pgsDate;
                        if (!scheduleData[date]) {
                            scheduleData[date] = [];
                        }
                        scheduleData[date].push(item);
                    });

                    // 获取当前年月
                    const currentDate = new Date();
                    const currentYear = currentDate.getFullYear();
                    const currentMonth = currentDate.getMonth() + 1; // 月份从0开始

                    // 根据日历数据和当前年月生成日历表格
                    function generateCalendar(year, month) {
                        const calendar = new Calendar(year, month);
                        const calendarBody = document.getElementById('calendar-body');
                        calendarBody.innerHTML = ''; // 清空表格内容

                        const daysOfMonth = calendar.getDaysOfMonth();

                        // 创建表格的第一行，包含日期信息
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
                                    cell.classList.add('calendar-cell'); // 添加 CSS 类

                                    const date = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
                                    const scheduleDataForDate = scheduleData[date] || [];
                                    const scheduleItem = scheduleDataForDate.find(item => item.pgsState.charAt(hour - 1) !== '');

                                    if (scheduleItem) {
                                        const input = document.createElement('input');
                                        input.name = 'pgsId';
                                        input.type = 'hidden';
                                        input.value = scheduleItem.pgsId; // 设置 input 的值为pgsId
                                        cell.appendChild(input);

                                        const pgsDateInput = document.createElement('input'); // 创建隐藏的 input 元素
                                        pgsDateInput.type = 'hidden'; // 设置 input 元素类型为隐藏
                                        pgsDateInput.value = scheduleItem.pgsDate; // 设置 input 的值为日期
                                        pgsDateInput.name = 'pgsDate'; // 设置 input 的 name 属性
                                        cell.appendChild(pgsDateInput); // 将 input 放置到 cell 元素内

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
                    // 初始化生成当前年月的日历
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
});