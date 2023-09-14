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
    },
    mounted: function() {
        // 在這裡添加你希望在一進入頁面時執行的程式碼
        axios.get(config.url + '/user/getUserPoint',{
            headers: {
                Authorization_U: token, 
                "Content-Type": "application/json"
            }
        }) // 請替換為實際的 API 端點
        .then(response => {
            this.userPoint = response.data.message; // 將 API 回應中的點數賦值給用戶點數數據屬性
            this.text = `您還剩餘 ${this.userPoint} 點折扣點數`;
            console.log(this.userPoint);
        })
        .catch(error => {
            console.error('獲取用戶點數時出錯：', error);
        });

        // 禁止用戶返回上一頁
        history.pushState(null, null, location.href);
        window.onpopstate = function(event) {
            // 當用戶嘗試返回上一頁時，將其重新導向回感謝購買頁面
            history.go(1);
        };
    }
  });

// 先打這支
// GET https://notify-bot.line.me/oauth/authorize

// 再拿 code 來打這支取 accessToken
// POST https://notify-bot.line.me/oauth/token

// 然後就可以用這支推播
// POST https://notify-api.line.me/api/notify
  