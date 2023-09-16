import config from "../../../../../ipconfig.js";
window.addEventListener("load", () => {
    //Header Token
    const token = localStorage.getItem("Authorization_U");
    // const token = "";


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

    // 時段選項容器
    const timeSlotsContainer = document.getElementById('timeSlotsContainer');

    const pgIdInput = document.getElementById('pgId');

    fetchGroomer();

    //撈使用者/美容師資料(token要改)
    function fetchGroomer() {
        fetch(config.url + "/user/appointmentPage", {
            method: "GET",
            headers: {
                Authorization_U: token,
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
                        timeValueInput.value = '000000000000000000000000';
                        pgPic.style.display = 'inline';
                        const selectedGroomer = groomers.find(groomer => groomer.pgId == this.value);
                        pgNameShow.textContent = selectedGroomer.pgName;
                        pgPic.src = '';

                        if (selectedGroomer) {
                            const buttons = document.querySelectorAll('.time-slot-button');
                            buttons.forEach(button => {
                                button.classList.remove('time-slot-button-selected');

                            });
                            pgGender.textContent = selectedGroomer.pgGender;
                            pgPic.src = 'data:image/png;base64,' + selectedGroomer.pgPic;
                            pgIdInput.value = selectedGroomer.pgId;
                            fetchScheduleForDate(selectedGroomer.pgId);

                        }
                        // 重置 flatpickr 為尚未選擇的狀態
                        dateInput._flatpickr.clear();
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
                }else{
                    Swal.fire({
                        icon: "error",
                        title: data.message
                    });
                }
            });
    }
    // 請求 /user/pgScheduleForA API (token要改)

    function fetchScheduleForDate(pgId) {
        fetch(config.url + `/user/pgScheduleForA?pgId=${pgId}`, {
            method: "GET",
            headers: {
                Authorization_U: token,
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
                                timeValueInput.value = '000000000000000000000000';
                                pgsIdLabel.textContent = selectedSchedule.pgsId;
                                //pgsIdLabel.style.display = "block";
                                generateTimeSlots(selectedSchedule.pgsState);
                            } else {
                                //pgsIdLabel.style.display = "none";
                            }
                        },
                    });
                } else {
                    Swal.fire({
                        icon: "error",
                        title: data.message
                    });
                }
            });
    }
    // 獲取 timeValue 元素
    const timeValueInput = document.getElementById('timeValue');
    //生成時段選項
    // 生成時段選項函式
    function generateTimeSlots(pgsState) {
        timeSlotsContainer.innerHTML = '';

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


    userPhInput.addEventListener("blur", function () {
        // 手機號碼格式驗證
        const phoneNumber = userPhInput.value;
        const phoneNumberPattern = /^[0-9]{10}$/; // 台灣10碼
        if (!phoneNumberPattern.test(phoneNumber)) {
            const phCheck = document.getElementById("phCheck");
            phCheck.innerText = '請輸入有效的手機號碼（10位數）';
        } else {
            const phCheck = document.getElementById("phCheck");
            phCheck.innerText = '';
        }
    });


    //送出預約單:
    const commitButton = document.getElementById("commit");
    const pgaOptions = document.querySelectorAll('.form-check-input[name="pgaOption"]');
    const pgaNotesTextarea = document.getElementById("pgaNotes");
    commitButton.addEventListener("click", function () {
        if (!validateOptions()) {
            return;
        }

        if (!validateDate()) {
            return;
        }

        if (!validateTime()) {
            return;
        }

        if (!validatePhoneNumber()) {
            return;
        }
        let selectedOptionValue = null;

        pgaOptions.forEach(option => {
            if (option.checked) {
                selectedOptionValue = option.value;
            }
        });

        const appointmentData = {
            pgId: pgIdInput.value,//美容師編號 (Foreign Key)
            pgaDate: dateInput.value,// yyyy-mm-dd sql.Date 預約日期
            pgaTime: timeValueInput.value,// Varchar(24)  預約時段 (0:無預約 / 1:預約時段, 預設: 0)
            pgaOption: selectedOptionValue,// 預約選項
            pgaNotes: pgaNotesTextarea.value, // 預約文字
            pgaPhone: userPhInput.value,// 預約電話 (Not Null)
            pgaState: 0// 預約單狀態 (0:未完成 / 1:完成訂單 / 2:取消, 預設: 0)
        };

        insertNewAppointment(appointmentData);

    });
    //預約請求送出(token要改)
    function insertNewAppointment(appointmentData) {
        fetch(config.url + `/user/newAppointment`, {
            method: "POST",
            headers: {
                Authorization_U: token,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(appointmentData)
        })
            .then(response => response.json())
            .then(data => {
                if (data.code === 200) {
                    Swal.fire({
                        icon: 'success',
                        title: '預約成功!',
                        text: `${data.message}`,
                    })
                    pgNameSelect.innerHTML='';
                    fetchGroomer();
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: '預約失敗!',
                        text: `${data.message}`,
                    })
                    pgNameSelect.innerHTML='';

                    fetchGroomer();
                }
            });
    }

    function validateOptions() {
        const checkedOptions = document.querySelectorAll('input[name="pgaOption"]:checked');
        if (checkedOptions.length === 0) {
            Swal.fire({
                icon: 'error',
                title: '請至少選擇一種方案！',
                text: '方案尚未選擇',
            })
            return false;
        }
        return true;
    }

    function validateDate() {
        if (dateInput.value === "") {
            Swal.fire({
                icon: 'error',
                title: '請選擇日期！',
                text: '預約日期尚未選擇',
            })
            return false;
        }
        return true;
    }

    function validateTime() {
        const timeValue = timeValueInput.value;
        const numberOfOnes = timeValue.split("1").length - 1;
        if (numberOfOnes !== 1) {
            Swal.fire({
                icon: 'error',
                title: '請選擇時段！',
                text: '預約時段尚未選擇',
            })
            return false;
        }
        return true;
    }

    function validatePhoneNumber() {
        const phoneNumber = userPhInput.value;
        if (!/^09[0-9]{8}$/.test(phoneNumber)) {
            Swal.fire({
                icon: 'error',
                title: '請輸入有效的手機號碼！',
                text: '手機號碼格式有誤',
            })
            return false;
        }
        return true;
    }

});
