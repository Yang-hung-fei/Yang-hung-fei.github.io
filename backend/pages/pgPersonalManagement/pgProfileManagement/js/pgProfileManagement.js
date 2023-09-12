import config from "../../../../../ipconfig.js";
window.addEventListener("load", () => {
    const token = localStorage.getItem("Authorization_M"); // 使用Manager Token
    // const token = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI2IiwiZXhwIjoxNjk0MTgxNjcwfQ.RQddPyCnj9QS_eaFELGxMNyt7bFu8Hz1NmtEuPnL2v4";
    //塞入資訊
    const manId = document.getElementById('manId');
    const pgId = document.getElementById('pgId');
    const name = document.getElementById('name');
    const email = document.getElementById('email');
    const phone = document.getElementById('phone');
    const address = document.getElementById('address');
    const birthday = document.getElementById('birthday');
    const gender = document.getElementById('gender');
    const appointments = document.getElementById('appointments');
    const pic = document.getElementById('pic');
    const picNull = document.getElementById('picNull');

    //修改按鈕
    const modifyPgBtn = document.getElementById('modifyPgBtn');
    //送出按鈕
    const commitModifyBtn = document.getElementById('commitModifyBtn');


    //修改資訊
    const newPgGender = document.getElementById('newPgGender');
    //生日
    const dateInput = document.getElementById("dateInput");
    const newPgName = document.getElementById('newPgName');
    const newPgAddress = document.getElementById('newPgAddress');
    const newPgPh = document.getElementById('newPgPh');
    const newPgEmail = document.getElementById('newPgEmail');
    const newPgPic = document.getElementById('newPgPic');

    //修改區塊隱藏
    const modify_img = document.getElementById('modify_img');
    const modifyBlock = document.getElementById('modifyBlock');

    let clickCount = 0; // 跟蹤按鈕次數

    //送出修改
    commitModifyBtn.addEventListener("click", function () {
        modifyPg();
    })
    //開始修改
    modifyPgBtn.addEventListener("click", function () {

        clickCount++;
        if (clickCount === 1) {
            modify_img.hidden = false;
            modifyBlock.hidden = false;
            previewImage.hidden = true;
            modifyPgBtn.textContent = "點擊取消修改";
        } else {
            modify_img.hidden = true;
            modifyBlock.hidden = true;

            modifyPgBtn.textContent = "我要修改";
            clickCount = 0;

            newPgPic.value = null;
        }
    });

    fetchPg();

    //撈管理員資料(token要改)
    function fetchPg() {
        fetch(config.url + "/manager/pg", {
            method: "GET",
            headers: {
                Authorization_M: token,
                "Content-Type": "application/json"
            }
        })
            .then(response => response.json())
            .then(data => {
                if (data.code === 200) {
                    const pg = data.message;

                    //塞入資訊
                    manId.textContent = pg.manId;
                    pgId.textContent = pg.pgId;

                    if (pg.pgPic !== null) {
                        pic.style.display = 'inline-block';
                        pic.setAttribute('src', 'data:image/png;base64,' + pg.pgPic);
                    } else {
                        picNull.style.display = 'inline-block';
                    }

                    name.textContent = pg.pgName;
                    email.textContent = pg.pgEmail === null ? '無' : pg.pgEmail;
                    phone.textContent = pg.pgPh === null ? '無' : pg.pgPh;
                    address.textContent = pg.pgAddress === null ? '無' : pg.pgAddress;
                    birthday.textContent = pg.pgBirthday === null ? '無' : pg.pgBirthday;
                    gender.textContent = pg.pgGender === null ? '無' : pg.pgGender;
                    appointments.textContent = (pg.numAppointments === null || pg.numAppointments === 0) ? '無' : pg.numAppointments;

                    // 修改預先放入
                    newPgName.value = pg.pgName;
                    newPgAddress.value = pg.pgAddress;
                    newPgPh.value = pg.pgPh;
                    newPgEmail.value = pg.pgEmail;

                    //性別
                    if (pg.pgGender === '男') {
                        newPgGender.value = '1';
                    } else if (pg.pgGender === '女') {
                        newPgGender.value = '0';
                    }

                    // 設置預設日期
                    dateInput.value = pg.pgBirthday;
                    dateInput.flatpickr({
                        dateFormat: "Y-m-d",
                        onChange: function (selectedDates, dateStr, instance) {
                            const selectedDate = selectedDates[0];
                            const formattedDate = formatDate(selectedDate);
                            dateInput.value = formattedDate;
                        },
                    });


                } else {
                    Swal.fire({
                        icon: "error",
                        title: "您非美容師",
                        text: data.message
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


    newPgPh.addEventListener("blur", function () {
        // 手機號碼格式驗證
        const phoneNumber = newPgPh.value;
        const phoneNumberPattern = /^[0-9]{10}$/; // 台灣10碼
        if (!phoneNumberPattern.test(phoneNumber)) {
            const phCheck = document.getElementById("phCheck");
            phCheck.innerText = '請輸入有效的手機號碼（10位數）';
        } else {
            const phCheck = document.getElementById("phCheck");
            phCheck.innerText = '';
        }
    });

    newPgEmail.addEventListener("blur", function () {
        // Email格式驗證
        const email = newPgEmail.value;
        const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        if (!emailPattern.test(email)) {
            const emailCheck = document.getElementById("emailCheck");
            emailCheck.innerText = 'Email格式錯誤';
        } else {
            const emailCheck = document.getElementById("emailCheck");
            emailCheck.innerText = '';
        }
    });
    newPgPic.addEventListener("change", function () {
        // 當選擇了新圖片時觸發事件
        const file = newPgPic.files[0];
        if (file) {
            // 讀取選擇的圖片並顯示預覽
            const reader = new FileReader();
            reader.onload = function (e) {
                previewImage.src = e.target.result;
                previewImage.hidden = false;
            };
            reader.readAsDataURL(file);
        }
    });



    //修改:
    function modifyPg() {
        //修改資訊
        const manId = document.getElementById('manId');
        const pgId = document.getElementById('pgId');
        const newPgGender = document.getElementById('newPgGender');
        //生日
        const dateInput = document.getElementById("dateInput");
        const newPgName = document.getElementById('newPgName');
        const newPgAddress = document.getElementById('newPgAddress');
        const newPgPh = document.getElementById('newPgPh');
        const newPgEmail = document.getElementById('newPgEmail');

        // 創建FormData對象，用於包裝要上傳的文件

        const formData = new FormData();
        const newPgPic = document.getElementById("newPgPic");
        const selectedFile = newPgPic.files[0];
        if (selectedFile === undefined || selectedFile === "" || selectedFile === null) {
            formData.append("pgPic", null);
        } else {
            formData.append("pgPic", selectedFile);
        }

        // 將空值替換為null
        const sanitizedNewPgEmail = newPgEmail || null;
        const sanitizedNewPgPh = newPgPh || null;
        const sanitizedNewPgAddress = newPgAddress || null;
        const sanitizedDateInput = dateInput || null;

        console.log(newPgGender.value);
        console.log(newPgName.value);

        formData.append("pgId", pgId.textContent); // manId值
        formData.append("manId", manId.textContent); // manId值
        formData.append("pgName", newPgName.value); //美容師姓名
        formData.append("pgGender", newPgGender.value); // 性別值
        formData.append("pgEmail", sanitizedNewPgEmail.value); // Email值
        formData.append("pgPh", sanitizedNewPgPh.value); // 手機號碼值
        formData.append("pgAddress", sanitizedNewPgAddress.value); // 地址值
        formData.append("pgBirthday", sanitizedDateInput.value); // 生日值

        // 送出修改，TOKEN要改
        fetch(config.url + "/manager/updateGroomerForPg", {
            method: "POST",
            headers: {
                Authorization_M: token
            },
            body: formData,
        })
            .then(response => response.json())
            .then(data => {
                if (data.code === 200) {
                    Swal.fire({
                        icon: "success",
                        title: "修改成功",
                        text: data.message
                    });
                    modifyPgBtn.click();
                   
                    fetchPg();
                } else {
                    Swal.fire({
                        icon: "error",
                        title: "修改失敗",
                        text: data.message
                    });
                    modifyPgBtn.click();
                    fetchPg();
                }
            });
    }
});
