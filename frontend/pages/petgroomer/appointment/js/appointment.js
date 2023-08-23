import config from "../../../../../ipconfig.js";

/*4. 當使用者點選中一個radio ，根據使用者點選的是第幾個RADIO，出現標籤LABLE(可以不須動態生成)顯示使用者選的是xx:xx~xx:xx時段(假如使用者點第3個radio，則代表2:00~3:00)。
5. 該LABLE標籤旁邊有一個INPUT 看不到的，value會根據使用者點選哪個改變。
6. 該INPUT標籤的VALUE依據使用者點選第幾個RADIO。預設為24個數字0。(動態根據使用者點選的RADIO標籤是第幾個就將value 的第幾位數變為1。如使用者又點選其他的 則再將全部變為0並對應位數 */
window.addEventListener("load", () => {

    const pgNameSelect = document.getElementById('pgName');
    const pgPic = document.getElementById('pgPic');
    const pgGender = document.getElementById('pgGender');
    const userNameInput = document.getElementById('userName');
    const userPhInput = document.getElementById('userPh');
    const pgNameShow = document.getElementById('pgNameShow');
    //預約日曆元素
    const dateInput = document.getElementById('dateInput');
    //pgsId欄位。
    const pgsIdLabel = document.getElementById('pgsIdLabel');
    //Header Token
    const token = localStorage.getItem("Authorization_U");
    // 時段選項容器
    const timeSlotsContainer = document.getElementById('timeSlotsContainer');


    //撈使用者/美容師資料
    fetch(config.url + "/user/appointmentPage", {
        method: "GET",
        headers: {
            Authorization_U: "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI0IiwiZXhwIjoxNjkzMTMwNjQyfQ.65VWBEyaA6_Wq8LB8zkO1xT1TxlRsbyJHI-uwNKhWqs",
            "Content-Type": "application/json"
        }
    })
        .then(response => response.json())
        .then(data => {
            if (data.code === 200) {
                const groomers = data.message.rs;

                // 填充美容師下拉選單
                groomers.forEach(groomer => {
                    const option = document.createElement('option');
                    option.value = groomer.pgId;
                    option.textContent = groomer.pgName;
                    pgNameSelect.appendChild(option);
                });

                // 美容師選擇事件
                pgNameSelect.addEventListener('change', function () {
                    pgPic.style.display = 'inline';
                    const selectedGroomer = groomers.find(groomer => groomer.pgId == this.value);
                    pgNameShow.textContent = selectedGroomer.pgName;
                    pgPic.src = '';

                    if (selectedGroomer) {
                        pgGender.textContent = selectedGroomer.pgGender;
                        pgPic.src = 'data:image/png;base64,' + selectedGroomer.pgPic;
                        fetchScheduleForDate(selectedGroomer.pgId);
                    }
                });

                // 直接選擇第一個選項並觸發 change 事件
                const firstOption = pgNameSelect.querySelector('option');
                if (firstOption) {
                    firstOption.selected = true;
                    pgNameSelect.dispatchEvent(new Event('change'));
                }
                // 設定使用者名稱和電話
                userNameInput.value = data.message.userName;
                userPhInput.value = data.message.userPh;
            }
        });

    // 請求 /user/pgScheduleForA API

    function fetchScheduleForDate(pgId) {
        fetch(config.url + `/user/pgScheduleForA?pgId=${pgId}`, {
            method: "GET",
            headers: {
                Authorization_U: "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI0IiwiZXhwIjoxNjkzMTMwNjQyfQ.65VWBEyaA6_Wq8LB8zkO1xT1TxlRsbyJHI-uwNKhWqs", // 替換成您的授權令牌
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
                                pgsIdLabel.textContent = selectedSchedule.pgsId;
                                //pgsIdLabel.style.display = "block";
                                generateTimeSlots(selectedSchedule.pgsState);
                            } else {
                                //pgsIdLabel.style.display = "none";
                            }
                        },
                    });
                }
            });
    }

    //生成時段選項
    // 生成時段選項函式
    function generateTimeSlots(pgsState) {
        timeSlotsContainer.innerHTML = '';
    
        // 獲取 timeValue 元素
        const timeValueInput = document.getElementById('timeValue');
    
        let selectedButton = null; // 用於跟踪當前選中的按鈕
    
        for (let i = 0; i < 24; i++) {
            const label = document.createElement('label');
            label.classList.add('radio'); // 添加 "radio" 樣式類，來應用您提供的樣式
    
            // 創建按鈕元素並設置樣式
            const button = document.createElement('button');
            button.classList.add('time-slot-button'); // 添加按鈕樣式類，您可以在 CSS 中定義它
            button.textContent = `${i}:00 ~ ${i + 1}:00`;
            label.appendChild(button);
            button.disabled = pgsState[i] !== '0';
            if (pgsState[i] === '1' || pgsState[i] === '2') {
                button.classList.add('disabled');
            }
    
            timeSlotsContainer.appendChild(label);
    
            // 為每個按鈕添加點擊事件處理器
            const handler = function () {
                if (pgsState[i] === '0' || pgsState[i] === '1' || pgsState[i] === '2') {
                    if (selectedButton) {
                        selectedButton.classList.remove('time-slot-button-selected');
                    }
    
                    const newValue = timeValueInput.value.split('');
                    newValue.fill('0'); // 全部設為0
                    newValue[i] = '1'; // 設定當前選中的為1
                    timeValueInput.value = newValue.join('');
    
                    selectedButton = button; // 更新當前選中的按鈕
                    selectedButton.classList.add('time-slot-button-selected');
                }
            };
    
            button.addEventListener('click', handler);
        }
    }
    //格式化yyyy-mm-dd
    function formatDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    }



});
