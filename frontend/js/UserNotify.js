import config from "../../ipconfig.js";
const token = localStorage.getItem("Authorization_U");
$(window).on("load", () => {
    let connectUrl = (config.url).split('//')[1];
    if (token == null)
        return;
    let url = 'ws://' + connectUrl + '/websocket?access_token=' + token;
    let webSocket = new WebSocket(url);
    webSocket.onopen = function () {
        console.log('創建連接。。。');
        webSocket.send("getHistory");
    }
    webSocket.onmessage = function (event) {
        let notifyMsg = JSON.parse(event.data);
        console.log(notifyMsg.msg);
        const newContent = `
        <a href="#" class="list-group-item">
          <div class="row g-0 align-items-center">
            <div class="col-2">
              <i class="text-warning" data-feather="bell"></i>
            </div>
            <div class="col-10"> 
              <div class="text-muted small mt-1">`+ notifyMsg.msg + `
              </div> 
            </div>
          </div>
        </a>
      `;
        let listGroup =$('.list-group');
        listGroup.prepend(newContent);
        let maxItems =5;
        const currentItems = listGroup.children('.list-group-item').length;

        if (currentItems > maxItems) {
            // 如果当前项目数量达到限制，删除最后一个项目
            listGroup.children('.list-group-item').last().remove();
        }

    }
    webSocket.onclose = function () {
        console.log('webSocket已斷開。。。');
        // $('#messageArea').append('websocket已斷開\n');
    };


});

