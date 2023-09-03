import config from "../../../../../ipconfig.js";
window.addEventListener("load", () => {
    const token = localStorage.getItem("Authorization_M"); // 使用Manager Token
   
    //新增按鈕
    const insertNewPgBtn = document.getElementById('insertNewPgBtn');

    insertNewPgBtn.addEventListener('click', function () {
        insertNewPg();
    });


    fetchPg();

    //撈管理員資料(token要改)
    function fetchPg(){
        fetch(config.url + "/manager/pg", {
            method: "GET",
            headers: {
                Authorization_M: "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxIiwiZXhwIjoxNjkzNzM0ODgzfQ.MGVymnvxKaRZ9N7gGInQitt7q_zVoHxvt2n7hoPws6A",
                "Content-Type": "application/json"
            }
        })
            .then(response => response.json())
            .then(data => {
                if (data.code === 200) {
                    const pg = data.message;
                    
                   
                }else{

                }
            });
    }

    //修改:
    function handleModifyButtonClick(editButton) {

        const row = editButton.closest("tr");
        const manId = row.querySelector("[name=manId]").textContent;
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
            title: `修改 ${pgId} - ${pgName}的資訊`,
            html:
                `
                <div class="row d-flex justify-content-center" style="color: #fff; font-family: cwTeXYen" >
                    
                    <div class="col-md-6">
                    
                        <form>
                        <span for="pgId" style="font-size: 18px;">美容師ID:${pgId}</span><br><br>
                        <span  style="font-size: 14px; font-family: cwTeXYen; padding-bottom: 20px; color:yellow;">不修改的內容可為空</span><br><br>
                        <label for="newPgName" style="font-size: 18px;">美容師姓名</label>               
                        <input type="text" id="newPgName" class="form-control" value="${pgName}"  /><br>
                        <label for="newPgGender" style="font-size: 18px;">美容師性別</label>  
                        <select id="newPgGender" class="form-control">
                            <option value="1" ${pgGender === '男' ? 'selected' : ''}>男</option>
                            <option value="2" ${pgGender === '女' ? 'selected' : ''}>女</option>
                        </select>
                        <label for="newPgEmail" style="font-size: 18px;">Email</label>
                        <label id="emailCheck" for="emailCheck" style="color:red; font-size: 12px;"></label>
                        <input type="email" id="newPgEmail" class="form-control" value="${pgEmail}" ><br>
                        <label for="newPgPh" style="font-size: 18px;">手機號碼</label>
                        <label id="phCheck"  for="phCheck" style="color:red; font-size: 12px;"></label>
                        <input type="tel" pattern="[0-9]{10}" title="請輸入有效的手機號碼（10位數字）" id="newPgPh" class="form-control" value="${pgPh}"><br>
                        <label for="newPgAddress" style="font-size: 18px;">地址</label>
                        <input type="text" id="newPgAddress" class="form-control" value="${pgAddress}"><br>
                        <label for="newPgBirthday" style="font-size: 18px;">生日</label>   
                        <input type="text" id="dateInput" name="dateInput" placeholder="請點擊選擇日期" style="min-width:271.76px;" ><br>
                        <label for="newPgPic" style="font-size: 18px;">上傳圖片</label>
                            <input
                                type="file"
                                id="newPgPic"
                                accept="image/*"
                                class="form-control"
                            />
                        <form> 
                        </div>    
                    <div class="col-md-6">
                        <label for="previewImage" style="font-size: 18px;">美容師照片</label>
                        <img id="previewImage" src="${pgPicSrc}" alt="此美容師無照片" class="modifyPic"><br>
                    </div> 
                 </div>
                 `,
            didRender: function () {
                const dateInput = document.getElementById("dateInput");
                // 設置預設日期
                dateInput.value = `${pgBirthday}`;
                dateInput.flatpickr({
                    dateFormat: "Y-m-d",
                    onChange: function (selectedDates, dateStr, instance) {
                        const selectedDate = selectedDates[0];
                        const formattedDate = formatDate(selectedDate);
                        dateInput.value = formattedDate;
                    },
                });
                const newPgPh = document.getElementById("newPgPh");
                const newPgEmail = document.getElementById("newPgEmail");

                newPgPh.addEventListener("blur", function () {
                    // 手機號碼格式驗證
                    const phoneNumber = newPgPh.value;
                    const phoneNumberPattern = /^[0-9]{10}$/; // 台灣10碼
                    if (!phoneNumberPattern.test(phoneNumber)) {
                        const phCheck = document.getElementById("phCheck");
                        phCheck.innerText = '手機號碼格式錯誤 請輸入有效的手機號碼（10位數字）';
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
                        emailCheck.innerText = 'Email格式錯誤 請輸入有效的Email地址';
                    } else {
                        const emailCheck = document.getElementById("emailCheck");
                        emailCheck.innerText = '';
                    }
                });

                const newPgPic = document.getElementById("newPgPic");
                const previewImage = document.getElementById("previewImage");

                newPgPic.addEventListener("change", function () {
                    // 當選擇了新圖片時觸發事件
                    const file = newPgPic.files[0];
                    if (file) {
                        // 讀取選擇的圖片並顯示預覽
                        const reader = new FileReader();
                        reader.onload = function (e) {
                            previewImage.src = e.target.result;
                        };
                        reader.readAsDataURL(file);
                    }
                });

            },
            showCancelButton: true,
            confirmButtonText: '確認',
            confirmButtonColor: '#8f88f8',
            cancelButtonText: '取消',
            background: 'rgba(0, 50, 129, 0.79)',
            width: '700px',
            preConfirm: () => {
                // 創建FormData對象，用於包裝要上傳的文件
                const formData = new FormData();
                const newPgPic = document.getElementById("newPgPic");
                const selectedFile = newPgPic.files[0];
                if (selectedFile === undefined || selectedFile === "" || selectedFile === null) {
                    formData.append("pgPic", null);
                } else {
                    formData.append("pgPic", selectedFile);
                }

                const newPgName = document.getElementById("newPgName");
                const newPgGender = document.getElementById("newPgGender");
                const newPgEmail = document.getElementById("newPgEmail");
                const newPgPh = document.getElementById("newPgPh");
                const newPgAddress = document.getElementById("newPgAddress");
                const dateInput = document.getElementById("dateInput");

                // 將空值替換為null
                const sanitizedNewPgEmail = newPgEmail || null;
                const sanitizedNewPgPh = newPgPh || null;
                const sanitizedNewPgAddress = newPgAddress || null;
                const sanitizedDateInput = dateInput || null;

                formData.append("pgId", pgId); // manId值
                formData.append("manId", manId); // manId值
                formData.append("pgName", newPgName.value); //美容師姓名
                formData.append("pgGender", newPgGender.value); // 性別值
                formData.append("pgEmail", sanitizedNewPgEmail.value); // Email值
                formData.append("pgPh", sanitizedNewPgPh.value); // 手機號碼值
                formData.append("pgAddress", sanitizedNewPgAddress.value); // 地址值
                formData.append("pgBirthday", sanitizedDateInput.value); // 生日值

                return formData;
            },
            didClose: () => {
                // 當 Swal 關閉時，手動清除驗證訊息
                Swal.update({
                    didRender: () => {
                        Swal.hideValidationMessage(); // 清除驗證訊息
                    }
                });
            }
        }).then((result) => {
            if (result.isConfirmed) {
                const formData = result.value;
                // 送出修改，TOKEN要改
                fetch(config.url + "/manager/updateGroomerByPgId", {
                    method: "POST",
                    headers: {
                        Authorization_M: "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxIiwiZXhwIjoxNjk0MDk3MDkzfQ.3A0IMzRE25469nbQMmdNuDr3CZiX60uA2-LhbJ4cRks"
                    },
                    body: formData,
                })
                    .then(response => response.json())
                    .then(data => {
                        if (data.code === 200) {
                            Swal.fire({
                                icon: "success",
                                title: "修改資訊成功",
                                text: data.message
                            });
                            let searchString = searchInput.value;
                            fetchAndBuildTable(itemsPerPage, sortSelect.value, currentPage, searchString);
                        } else {
                            Swal.fire({
                                icon: "error",
                                title: "修改資訊失敗",
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
