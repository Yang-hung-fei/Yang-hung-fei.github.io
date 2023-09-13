import config from "../../../../../../ipconfig.js";
window.addEventListener("load", () => {
    const token = localStorage.getItem("Authorization_M"); // 使用Manager Token
    // const token = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIzIiwiZXhwIjoxNjk0NjExMDQ4fQ.82ztaxrFP5BeOoSUoSP87iuPiU-oVBBeY83b78lD0lc";
    //塞入資訊
    
    const pdname = document.getElementById('pdname');
    const description = document.getElementById('description');
    const price = document.getElementById('price');
    const status = document.getElementById('status');
    // const pic = document.getElementById('pic');

    //修改按鈕
    const modifyPdBtn = document.getElementById('modifyPdBtn');
    //送出按鈕
    const commitModifyBtn = document.getElementById('commitModifyBtn');


    //修改資訊
    const newPdName = document.getElementById('newPdName');
    const newDescription = document.getElementById('newDescription');
    const newPdPrice = document.getElementById('newPdPrice');
    const newPdStatus = document.getElementById('newPdStatus');
    // const newPdPics1 = document.getElementById('newPdPics1');

    //修改區塊隱藏
    const modify_img = document.getElementById('modify_img');
    const modifyBlock = document.getElementById('modifyBlock');

    let clickCount = 0; // 跟蹤按鈕次數

    //送出修改
    commitModifyBtn.addEventListener("click", function () {
        console.log('修改按鈕觸發');
        modifyPd();
    })
    //開始修改
    modifyPdBtn.addEventListener("click", function () {
        console.log('修改觸發');
        clickCount++;
        if (clickCount === 1) {
            modify_img.hidden = false;
            modifyBlock.hidden = false;
            previewImage.hidden = true;
            modifyPdBtn.textContent = "點擊取消修改";
        } else {
            modify_img.hidden = true;
            modifyBlock.hidden = true;

            modifyPdBtn.textContent = "修改";
            clickCount = 0;

            // newPdPics1.value = null;
        }
    });

    fetchPd();

    //撈資料
    function fetchPd() {
        console.log('送出請求');
        fetch(config.url + "/manager/getProduct", {
            method: "GET",
            headers: {
                Authorization_M: token,
                "Content-Type": "application/json"
            }
        })
            .then(response => response.json())
            .then(data => {
                if (data.code === 200) {
                    const pd = data.message;
                    console.log('請求回傳:');
                    console.log(pd);
                    //塞入資訊
                    
                    // if (pd.pdPic !== null) {
                    //     pic.style.display = 'inline-block';
                    //     pic.setAttribute('src', 'data:image/png;base64,' + pd.pdPic);
                    // } else {
                    //     picNull.style.display = 'inline-block';
                    // }

                    pdname.textContent = pd.pdName;
                    price.textContent = pd.price;
                    status.textContent = pd.status;
                    description.textContent = pd.description=== null ? '無' : pd.description;

                    //修改預先放入
                    newPdName.value = pd.pdName;
                    newPdPrice.value = pd.price;
                    newDescription.value = pd.description;
                    

                    //狀態
                    if (pd.status === '下架') {
                        newPdStatus.value = '1';
                    } else if (pd.status === '上架') {
                        newPdStatus.value = '0';
                    }

                } else {
                    Swal.fire({
                        icon: "error",
                        title: "您非商品管理員",
                        text: data.message
                    });
                }
            });
    }
    
    
    // newpdPic.addEventListener("change", function () {
    //     // 當選擇了新圖片時觸發事件
    //     const file = newpdPic.files[0];
    //     if (file) {
    //         // 讀取選擇的圖片並顯示預覽
    //         const reader = new FileReader();
    //         reader.onload = function (e) {
    //             previewImage.src = e.target.result;
    //             previewImage.hidden = false;
    //         };
    //         reader.readAsDataURL(file);
    //     }
    // });



    //修改:
    function modifyPd() {
        //修改資訊
        const manId = document.getElementById('manId');
        const pdId = document.getElementById('pdId');
        const newpdGender = document.getElementById('newpdGender');
        //生日
        const dateInput = document.getElementById("dateInput");
        const newpdName = document.getElementById('newpdName');
        const newpdAddress = document.getElementById('newpdAddress');
        const newpdPh = document.getElementById('newpdPh');
        

        // 創建FormData對象，用於包裝要上傳的文件

        const formData = new FormData();
        // const newpdPic = document.getElementById("newpdPic");
        // const selectedFile = newpdPic.files[0];
        // if (selectedFile === undefined || selectedFile === "" || selectedFile === null) {
        //     formData.append("pdPic", null);
        // } else {
        //     formData.append("pdPic", selectedFile);
        // }

        // 將空值替換為null
        
        const sanitizedNewpdPh = newpdPh || null;
        const sanitizedNewpdAddress = newpdAddress || null;
        const sanitizedDateInput = dateInput || null;

        console.log(newpdGender.value);
        console.log(newpdName.value);

        formData.append("pdId", pdId.textContent); // manId值
        formData.append("manId", manId.textContent); // manId值
        formData.append("pdName", newpdName.value); //美容師姓名
        formData.append("pdGender", newpdGender.value); // 性別值

        formData.append("pdPh", sanitizedNewpdPh.value); // 手機號碼值
        formData.append("pdAddress", sanitizedNewpdAddress.value); // 地址值
        formData.append("pdBirthday", sanitizedDateInput.value); // 生日值

        // 送出修改，TOKEN要改
        fetch(config.url + "/manager/updateGroomerForpd", {
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
                    modifypdBtn.click();
                   
                    fetchpd();
                } else {
                    Swal.fire({
                        icon: "error",
                        title: "修改失敗",
                        text: data.message
                    });
                    modifypdBtn.click();
                    fetchpd();
                }
            });
    }
});
