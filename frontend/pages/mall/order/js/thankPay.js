import config from "../../../../../ipconfig.js";
const token = localStorage.getItem("Authorization_U");
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
  