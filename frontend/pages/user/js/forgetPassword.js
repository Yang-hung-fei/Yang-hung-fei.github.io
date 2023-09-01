import config from "../../../../ipconfig.js";
$(".login100-form-btn").on("click", (event) => {
    event.preventDefault(); // 阻止表單的預設行為
    const submitButton = $(event.currentTarget);
    submitButton.addClass("disabled-button");
    let email = $("#email").val();
    if (!validateEmail(email)) {
        swal("失敗", "信箱格式異常", "error");
        submitButton.removeClass("disabled-button");
        return;
    }
    //機器人驗證
    // 取得 reCAPTCHA 驗證的回應 token
    var response = grecaptcha.getResponse();

    // 檢查回應是否為空，表示未通過驗證
    if (response.length === 0) {
        swal("失敗", "請通過機器人驗證", "error");
        submitButton.removeClass("disabled-button");
        return;
    }

    const formData = new FormData();
    formData.append('userEmail', email);
    fetch(config.url + "/user/forgetPassword", {
        method: 'POST',
        body: formData
    })
        .then(response => response.json())
        .then(res => {
            var code = res.code;
            if (code === 200) {
                // 讓按鈕在 60 秒後再次可用
                setTimeout(() => {
                    submitButton.removeClass("disabled-button");
                }, 60000); // 60000 毫秒 = 60 秒
                countdown(submitButton, 60); // 開始倒數計時 60 秒
                swal("送出認證碼", "請檢察信箱並於十分鐘內修改密碼", "success");
            }
            else {
                swal("失敗", res.message, "error");
                submitButton.removeClass("disabled-button");
            }
        })


}
);

function countdown(button, seconds) {
    let remainingSeconds = seconds;
    button.prop("disabled", true); // 禁止按鈕點擊
    button.text(remainingSeconds + " 秒後重新寄信"); // 更新按鈕文字

    const interval = setInterval(() => {
        remainingSeconds--;
        button.text(remainingSeconds + " 秒後重新寄信");

        if (remainingSeconds <= 0) {
            clearInterval(interval); // 清除計時器
            button.prop("disabled", false); // 啟用按鈕點擊
            button.text("重新寄信");
        }
    }, 1000); // 每 1000 毫秒（1 秒）更新一次
}

function validateEmail(email) {
    // 正則表達式來驗證電子郵件格式
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailPattern.test(email);
} 