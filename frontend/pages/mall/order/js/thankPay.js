import config from "../../../../../ipconfig.js";
const token = localStorage.getItem("Authorization_U");
document.addEventListener('DOMContentLoaded', function () {
  const params = new URLSearchParams(window.location.search);
  const paymentTransactionId = params.get('paymentTransactionId');
  const status = params.get('status');
  fetch(config.url+`/customer/fonPayRedirectUrl`, {
    method: "PUT",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify({
        "paymentTransactionId":`${paymentTransactionId}`,
        "status":`${status}`
    })
    
}).then(response => response.json())
    .then(res => {
        if (res.code != 200){
            Swal.fire({
                icon: "error",
                title: res.message
            });
            console.log("1");
        }else{
          console.log("2");
        }
    })
    .catch(error => {
        console.error("Error fetching form:", error);
    });


});


var app = new Vue({
    el: '#app',
    data: {
      open: false
    },
    methods: {
      click: function() {
        this.open = !this.open;
      },
      continueShopping: function() {
        // 在這裡處理 "繼續選購" 按鈕的點擊事件
        window.location.href="../mall/mall.html";
      },
      viewOrders: function() {
        // 在這裡處理 "查看訂單" 按鈕的點擊事件
        window.location.href="./memberCenterOrders.html";
      }
    },
    watch:{
      open: function() {
        if (this.open == true) {
            document.body.className = 'open';
            }
        else {
          document.body.className = '';
        }
      }
    }
  });

// 先打這支
// GET https://notify-bot.line.me/oauth/authorize

// 再拿 code 來打這支取 accessToken
// POST https://notify-bot.line.me/oauth/token

// 然後就可以用這支推播
// POST https://notify-api.line.me/api/notify
  