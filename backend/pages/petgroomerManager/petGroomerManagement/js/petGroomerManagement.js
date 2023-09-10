import config from "../../../../../ipconfig.js";
window.addEventListener("load", () => {
    const token = localStorage.getItem("Authorization_M"); // 使用Manager Token
    // const token = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI2IiwiZXhwIjoxNjk0MTgxNjcwfQ.RQddPyCnj9QS_eaFELGxMNyt7bFu8Hz1NmtEuPnL2v4"; // 使用Manager Token
    const searchInput = document.getElementById("search");
    const limitSelect = document.querySelector("#limit");
    const sortSelect = document.querySelector("#sort");
    const orderByRadios = document.querySelectorAll("[name=orderBy]"); // 新的Order By radios
    let currentPage = 1;
    let itemsPerPage = parseInt(limitSelect.value);
    let searchString = searchInput.value;

    const modifyInput = document.getElementById("modify_input");
    //錯誤顯示用
    const errorDiv = document.getElementById("error");


    //新增按鈕
    const insertNewPgBtn = document.getElementById('insertNewPgBtn');

    insertNewPgBtn.addEventListener('click', function () {
        insertNewPg();
    });

    //------新增------//
    function insertNewPg() {

        Swal.fire({
            title: `新增美容師`,
            html:
                `
                <div class="row d-flex justify-content-center" style="color: #fff; font-family: cwTeXYen" >
                    <div class="col-md-12">
                        <form>
                        <p for="manName" class="form-label" style="margin-left: 0px;font-size: 20px; color:#fff;">1.選擇管理員</p><br>
								<select id="manName" name="manName" class="form-select"
									style="max-width: 120px; min-width:290px; margin-left: 0px; margin-bottom: 20px; margin-top: 0px; text-align:left;"></select>
								<p style="color: yellow;font-size: 14px;">只會列出擁有美容師個人管理權限之管理員。<br>如需將管理員新增此權限請至管理員管理。</p>
								<!-- 發送新增請求抓Man值-->
								<div style="display: flex; align-items: center;">
									<input id="manId" name="manId" value="" class="form-control" readonly hidden
										style="max-width: 120px; margin-left: 5px; margin: 0;"></input>
								</div>
                                
                                <p class="form-label" style="margin-left: 0px;font-size: 20px; color:#fff;">2.請填寫基本資料</p><br>
									<span style="font-size: 14px; color:yellow; font-family: cwTeXYen"
										padding-bottom: 20px;>除了"姓名"以外，如不須新增的內容可留空</span><br><br>
									<label for="insertPgName" style="font-size: 18px;">美容師姓名</label>
                                    <span style="font-size: 14px; color:yellow; font-family: cwTeXYen">美容師姓名不可留白</span>
									<input type="text" id="insertPgName" class="form-control" value="" /><br>
									<label for="insertPgGender" style="font-size: 18px;">美容師性別</label>
									<select id="insertPgGender" class="form-control">
										<option value="1">男</option>
										<option value="2">女</option>
									</select>

									<label for="insertPgEmail" style="font-size: 18px; margin-top:10px;">Email</label>
									<label id="insertPgEmailCheck" style="color:yellow; font-size: 12px;"></label>
									<input type="email" id="insertPgEmail" class="form-control" value=""><br>

									<label for="insertPgPh" style="font-size: 18px;">手機號碼</label>
									<label id="insertPhCheck" for="phCheck" style="color:yellow; font-size: 12px;"></label>
									<input type="tel" pattern="[0-9]{10}" title="請輸入有效的手機號碼（10位數字）" id="insertPgPh"
										class="form-control" value=""><br>

									<label for="insertPgAddress" style="font-size: 18px;">地址</label>
									<input type="text" id="insertPgAddress" class="form-control" value=""><br>

									<label for="insertPgBirthday" style="font-size: 18px;">生日</label>
									<input type="text" class="form-control" id="insertPgBirthday" name="dateInput" placeholder="請點擊選擇日期"
										style="width:100%;"><br>

									<label for="insertPgPic" style="font-size: 18px;">上傳圖片</label>
									<input type="file" id="insertPgPic" accept="image/*" class="form-control" />
                                    <label for="insertPreviewImage" style="font-size: 18px; margin-top:20px;">預覽</label>
                        <img id="insertPreviewImage" src="" alt="尚未上傳照片" class="modifyPic" style="display:none; max-width:277px;max-height:277px;"><br>
                        <form> 
                    </div>
                 </div>
                 `,
            didRender: function () {
                //存放資訊
                const manNameSelect = document.getElementById('manName');
                const manIdInput = document.getElementById('manId');

                fetchMan(manNameSelect,manIdInput);

                insertPgBirthday.flatpickr({
                    dateFormat: "Y-m-d",
                    onChange: function (selectedDates, dateStr, instance) {
                        const selectedDate = selectedDates[0];
                        const formattedDate = formatDate(selectedDate);
                        insertPgBirthday.value = formattedDate;
                    },
                });
                const insertPgPh = document.getElementById("insertPgPh");
                const insertPgEmail = document.getElementById("insertPgEmail");

                insertPgPh.addEventListener("blur", function () {
                    // 手機號碼格式驗證
                    const phoneNumber = insertPgPh.value;
                    const phoneNumberPattern = /^[0-9]{10}$/; // 台灣10碼
                    if (!phoneNumberPattern.test(phoneNumber)) {
                        const insertPhCheck = document.getElementById("insertPhCheck");
                        insertPhCheck.innerText = '手機號碼格式錯誤 請輸入有效的手機號碼（10位數字）';
                    } else {
                        const insertPhCheck = document.getElementById("insertPhCheck");
                        insertPhCheck.innerText = '';
                    }
                });

                insertPgEmail.addEventListener("blur", function () {
                    // Email格式驗證
                    const email = insertPgEmail.value;
                    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
                    if (!emailPattern.test(email)) {
                        const insertPgEmailCheck = document.getElementById("insertPgEmailCheck");
                        insertPgEmailCheck.innerText = 'Email格式錯誤 請輸入有效的Email地址';
                    } else {
                        const insertPgEmailCheck = document.getElementById("insertPgEmailCheck");
                        insertPgEmailCheck.innerText = '';
                    }
                });

                const insertPgPic = document.getElementById("insertPgPic");
                const insertPreviewImage = document.getElementById("insertPreviewImage");

                insertPgPic.addEventListener("change", function () {
                    // 當選擇了新圖片時觸發事件
                    const file = insertPgPic.files[0];
                    if (file) {
                        // 讀取選擇的圖片並顯示預覽
                        const reader = new FileReader();
                        reader.onload = function (e) {
                            insertPreviewImage.src = e.target.result;
                            insertPreviewImage.style.display = "block";
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
            width: '600px',
            preConfirm: () => {
                // 創建FormData對象，用於包裝要上傳的文件
                const formData = new FormData();
                const insertPgPic = document.getElementById("insertPgPic");
                const selectedFile = insertPgPic.files[0];
                if (selectedFile === undefined || selectedFile === "" || selectedFile === null) {
                    formData.append("pgPic", null);
                } else {
                    formData.append("pgPic", selectedFile);
                }
                const manIdInput = document.getElementById('manId');
                const insertPgName = document.getElementById("insertPgName");
                const insertPgGender = document.getElementById("insertPgGender");
                const insertPgEmail = document.getElementById("insertPgEmail");
                const insertPgPh = document.getElementById("insertPgPh");
                const insertPgAddress = document.getElementById("insertPgAddress");
                const insertPgBirthday = document.getElementById("insertPgBirthday");

                // 將空值替換為null
                const sanitizedNewPgEmail = insertPgEmail || null;
                const sanitizedNewPgPh = insertPgPh || null;
                const sanitizedNewPgAddress = insertPgAddress || null;
                const sanitizedDateInput = insertPgBirthday || null;

                // 添加其他表單數據到FormData對象
                console.log(insertPgName.value);
                console.log(insertPgGender.value);
                console.log(sanitizedNewPgEmail.value);
                console.log(sanitizedNewPgPh.value);
                console.log(sanitizedNewPgAddress.value);
                console.log(sanitizedDateInput.value);
                console.log(formData.get('pgPic'));

                formData.append("manId", manIdInput.value); // manId值
                formData.append("pgName", insertPgName.value); //美容師姓名
                formData.append("pgGender", insertPgGender.value); // 性別值
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
                fetch(config.url + "/manager/commitInsertNewGroomer", {
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
                                title: "新增成功",
                                text: data.message
                            });
                            let searchString = searchInput.value;
                            fetchAndBuildTable(itemsPerPage, sortSelect.value, currentPage, searchString);
                        } else {
                            Swal.fire({
                                icon: "error",
                                title: "新增失敗",
                                text: data.message
                            });
                        }
                    });
            }

        });
    }


    //撈管理員資料(token要改)
    function fetchMan(manNameSelect,manIdInput){
        fetch(config.url + "/manager/insertNewGroomer", {
            method: "GET",
            headers: {
                Authorization_M: token,
                "Content-Type": "application/json"
            }
        })
            .then(response => response.json())
            .then(data => {
                if (data.code === 200) {
                    const managers = data.message;

                    // 填充下拉選單
                    managers.forEach(man => {
                        const option = document.createElement('option');
                        option.value = man.managerId;
                        option.textContent = `${man.managerId} - ${man.managerAccount}`;
                        manNameSelect.appendChild(option);
                    });

                    // 美容師選擇事件
                    manNameSelect.addEventListener('change', function () {

                        const selectedMan = managers.find(man => man.managerId == this.value);

                        if (selectedMan) {

                            manIdInput.value = selectedMan.managerId;
                        }
                        // fetchGroomerSchedule(manIdInput.value, yearSelect.value, monthInput.value);
                    });

                    // 直接選擇第一個選項並觸發 change 事件
                    const firstOption = manNameSelect.querySelector('option');
                    if (firstOption) {
                        firstOption.selected = true;
                        manNameSelect.dispatchEvent(new Event('change'));
                    }
                }
            });
    }



    //-------------------------------------------TABLE-------------------------------------------


    // 純顯示筆數用
    const maxCount = document.querySelector("#maxCount");

    // 一進入頁面呼叫
    fetchAndBuildTable(itemsPerPage, sortSelect.value, currentPage, searchString);

    //搜尋
    searchInput.addEventListener("change", () => {
        let searchString = searchInput.value;
        fetchAndBuildTable(itemsPerPage, sortSelect.value, currentPage, searchString);
    });

    // 當最大筆數不同
    limitSelect.addEventListener("change", () => {
        itemsPerPage = parseInt(limitSelect.value);
        currentPage = 1;
        let searchString = searchInput.value;
        fetchAndBuildTable(itemsPerPage, sortSelect.value, currentPage, searchString);
    });

    // 當排序選擇
    sortSelect.addEventListener("change", () => {
        let searchString = searchInput.value;
        fetchAndBuildTable(itemsPerPage, sortSelect.value, currentPage, searchString);
    });

    // 監聽Order By選項
    orderByRadios.forEach((radio) => {
        radio.addEventListener("change", () => {
            let searchString = searchInput.value;
            fetchAndBuildTable(itemsPerPage, sortSelect.value, currentPage, searchString);
        });
    });

    // 撈所有美容師 for Manager
    function fetchAndBuildTable(itemsPerPage, sort, page, searchString) {
        const offset = (page - 1) * itemsPerPage;
        const orderBy = getOrderValue(); // 取得選中的Order By值
        fetch(config.url + `/manager/getAllGroomerListSort?limit=${itemsPerPage}&sort=${sort}&offset=${offset}&orderBy=${orderBy}&search=${searchString}`, {
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
                    const petGroomers = data.message.rs;
                    const totalCounts = data.message.total;
                    maxCount.value = totalCounts;
                    buildTable(petGroomers);
                    updatePaginationButtons(totalCounts);
                } else if (data.code === 401) {
                    Swal.fire({
                        icon: "error",
                        title: `身分${data.message}`
                    });
                    tableBody.innerHTML = "";
                    maxCount.value = 0;
                } else {
                    Swal.fire({
                        icon: "error",
                        title: data.message
                    });
                    tableBody.innerHTML = "";
                    maxCount.value = 0;
                }
            });
    }

    // 獲取選中的Order By值
    function getOrderValue() {
        let orderValue = "";
        orderByRadios.forEach((radio) => {
            if (radio.checked) {
                orderValue = radio.value;
            }
        });
        return orderValue;
    }

    const tableBody = document.querySelector(".table-hover");
    //建構表格
    function buildTable(data) {
        tableBody.innerHTML = ""; // 清空表格内容

        data.forEach(petGroomer => {
            const row = document.createElement("tr");
            if(petGroomer.pgEmail===null){
                petGroomer.pgEmail="";
            }
            if(petGroomer.pgPh===null){
                petGroomer.pgPh="";
            }
            if(petGroomer.pgAddress===null){
                petGroomer.pgAddress="無";
            }
            
            if(petGroomer.pgBirthday===null){
                petGroomer.pgBirthday="";
            }

            row.innerHTML = `
            <td class="text-center" name="pgId" value="${petGroomer.pgId}">${petGroomer.pgId}</td>
            <td class="text-center" name="manId">${petGroomer.manId}</td>
            <td class="text-center" name="pgName">${petGroomer.pgName}</td>
            <td class="text-center" name="pgGender">${petGroomer.pgGender}</td>
            <td class="text-center">
                <img src="data:image/png;base64,${petGroomer.pgPic}" alt="此美容師無照片" class="pg-pic">
            </td>
            <td class="text-center" name="pgEmail" style="padding:5px; min-width:80px;">${petGroomer.pgEmail}</td>
            <td class="text-center" name="pgPh"style="padding:5px; min-width:80px;">${petGroomer.pgPh}</td>
            <td class="text-center" name="pgAddress" style="max-width: 80px;white-space:pre-line;
            word-wrap: break-word;" style="min-width:80px; padding:5px;">${petGroomer.pgAddress}</td>
            <td class="text-center" name="pgBirthday" style="padding:5px; min-width:80px;">${petGroomer.pgBirthday}</td>
            <td class="text-center" name="numAppointments">${petGroomer.numAppointments}</td>
            <td class="text-center disable-edit">
                <button class="btn slot-button modify">修改</button>
            </td>
        `;

            tableBody.appendChild(row);
            const editButtons = tableBody.querySelectorAll("tr > td > .modify");

            editButtons.forEach((editButton) => {

                editButton.addEventListener("click", () => {
                    handleModifyButtonClick(editButton);
                });
            });
        });
    }
    // 更新分頁
    function updatePaginationButtons(totalCounts) {
        const paginationButtonsContainer = document.getElementById("pagination-buttons");
        paginationButtonsContainer.innerHTML = "";

        // 獲取總頁數（通過 total 和 itemsPerPage 計算）
        const totalPages = Math.ceil(totalCounts / itemsPerPage);

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
                let searchString = searchInput.value;
                fetchAndBuildTable(itemsPerPage, sortSelect.value, currentPage, searchString);
                //SC
            });
            paginationButtonsContainer.appendChild(button);
        }
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
                        <label for="newPgEmail" style="font-size: 18px;">Email&nbsp;&nbsp;&nbsp;<span id="emailCheck" for="emailCheck" style="color:yellow; font-size: 12px;"></span></label>
                        
                        <input type="email" id="newPgEmail" class="form-control" value="${pgEmail}" ><br>
                        <label for="newPgPh" style="font-size: 18px;">手機號碼&nbsp;&nbsp;&nbsp;<span id="phCheck"  for="phCheck" style="color:yellow; font-size: 12px;"></span></label>
                        
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
                        Authorization_M: token
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
