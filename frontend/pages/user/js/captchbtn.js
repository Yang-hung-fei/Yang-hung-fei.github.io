const btn_getchptcha = document.getElementById('chptcha_btn');
let countDown = 60;
let intervalId;

btn_getchptcha.addEventListener('click', () => {
    btn_getchptcha.classList.remove("btn--green");
    btn_getchptcha.disabled = true;
    countDown = 60;
    intervalId = setInterval(() => {
        countDown--;
        if (countDown >= 0) {
            btn_getchptcha.innerText = "重新取得驗證碼 (" + countDown + " 秒)";
        } else {
            clearInterval(intervalId);
            btn_getchptcha.innerText = "產生驗證碼";
            btn_getchptcha.disabled = false;
        }
    }, 1000); // 1秒
});

