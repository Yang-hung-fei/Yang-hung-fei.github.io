import config from "../../../../ipconfig.js";
$(".login100-form-btn").on("click", (event) => {
    event.preventDefault();
    let newPassword = $("#pwd").val();
    let reIptPwd = $("#reIptPwd").val();
    if (!(newPassword === reIptPwd)) {
        swal("失敗", "密碼不一致", "error");
        return;
    }


    if (!(newPassword.indexOf(' ') === -1)) {
        swal("失敗", "不可輸入空白", "error");
        return;
    }
    if (newPassword.length<6) {
        swal("失敗", "長度不可小於6", "error");
        return;
    }
    // 獲取當前 URL 的查詢字串
    const queryString = window.location.search;

    // 解析查詢字串
    const urlParams = new URLSearchParams(queryString);

    // 獲取 "code" 參數的值
    const codeValue = urlParams.get('code');

    const formData = new FormData();
    formData.append('newPassword', newPassword);
    formData.append('code', codeValue);
    fetch(config.url + "/user/forgetPassword/renewPassword", {
        method: 'POST',
        body: formData
    })
        .then(response => response.json())
        .then(res => {
            var code = res.code;
            if (code === 200) {
                swal("修改成功", res.message, "success");
            }
            else {
                swal("失敗", res.message, "error");
                submitButton.removeClass("disabled-button");
            }
        })



});

const passwordInput = document.getElementById('pwd');
const showPasswordToggle = document.getElementById('showPasswordToggle');

showPasswordToggle.addEventListener('click', () => {
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        showPasswordToggle.classList.remove('fa-eye-slash');
        showPasswordToggle.classList.add('fa-eye');
    } else {
        passwordInput.type = 'password';
        showPasswordToggle.classList.remove('fa-eye');
        showPasswordToggle.classList.add('fa-eye-slash');
    }
});


const passwordReInput = document.getElementById('reIptPwd');
const showRePasswordToggle = document.getElementById('showReIptPwdToggle');

showRePasswordToggle.addEventListener('click', () => {
    if (passwordReInput.type === 'password') {
        passwordReInput.type = 'text';
        showRePasswordToggle.classList.remove('fa-eye-slash');
        showRePasswordToggle.classList.add('fa-eye');
    } else {
        passwordReInput.type = 'password';
        showRePasswordToggle.classList.remove('fa-eye');
        showRePasswordToggle.classList.add('fa-eye-slash');
    }
});