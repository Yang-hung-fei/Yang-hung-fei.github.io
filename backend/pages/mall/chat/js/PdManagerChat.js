import config from "/ipconfig.js";

var statusOutput = document.getElementById("statusOutput");
var messagesArea = document.getElementById("messagesArea");
var self = "PdManager";
let user;
let webSocket;
let userName;
let usersList=[];
$(window).on("load", () => {
    connect();
    $("#sendMessage").on("click",event=>{ 
        sendMessage();
    });
});
$(document).on('keydown', function (event) {
    if (webSocket == null || self == null)
        return;
    if (event.which === 13) {
        // 在這裡處理按下 Enter 鍵的操作
        sendMessage();
    }
});
function connect() {

    let token = localStorage.getItem("Authorization_M");
    let connectUrl = (config.url).split('//')[1];
    if (token == null)
        return;
    let url = 'ws://' + connectUrl + '/websocket/productMallChat?access_token=' + token;
    webSocket = new WebSocket(url);
    webSocket.onopen = function () {
        console.log("Connect Success!");
        var jsonObj = {
            "type": "getUserList",
            "sender": "PdManager",
            "receiver": "",
            "message": ""
        };
        webSocket.send(JSON.stringify(jsonObj));
    };

    webSocket.onmessage = function (event) {
        var jsonObj = JSON.parse(event.data); 
        if ("getUserList" === jsonObj.type) {  
            refreshUserList(jsonObj);
        } else if ("history" === jsonObj.type) {
            messagesArea.innerHTML = '';
            var ul = document.createElement('ul');
            ul.id = "area";
            messagesArea.appendChild(ul);
            // 這行的jsonObj.message是從redis撈出跟好友的歷史訊息，再parse成JSON格式處理
            var messages = JSON.parse(jsonObj.message);
            for (var i = 0; i < messages.length; i++) {
                var historyData = JSON.parse(messages[i]);
                var showMsg = historyData.message;
                var li = document.createElement('li');
                // 根據發送者是自己還是對方來給予不同的class名, 以達到訊息左右區分
                historyData.sender === self ? li.className += 'me' : li.className += 'friend';
                li.innerHTML = showMsg;
                ul.appendChild(li);
            }
            messagesArea.scrollTop = messagesArea.scrollHeight;
        } else if ("chat" === jsonObj.type) {  
            var li = document.createElement('li');
            jsonObj.sender === self ? li.className += 'me' : li.className += 'friend';
            li.innerHTML = jsonObj.message;
            console.log(li);  
            alert(usersList.indexOf(jsonObj.sender));
            if(usersList.indexOf(jsonObj.sender)===-1){ 
                alert("刷新列表");
                //重新刷新列表
                var jsonObj = {
                    "type": "getUserList",
                    "sender": "PdManager",
                    "receiver": "",
                    "message": ""
                };
                webSocket.send(JSON.stringify(jsonObj));
            }
          
            if(!(jsonObj.sender===user)&&!(jsonObj.sender==="PdManager"))
                return;
            
            document.getElementById("area").appendChild(li);
            messagesArea.scrollTop = messagesArea.scrollHeight;
        }  
    };

    webSocket.onclose = function (event) {
        console.log("Disconnected!");
    };
}

function sendMessage() {
    var inputMessage = document.getElementById("message"); 
    var message = inputMessage.value.trim();

    if (message === "") {
        alert("請輸入訊息");
        inputMessage.focus();
    } else if (user === "") {
        alert("選擇一個客戶");
    } else {
        var jsonObj = {
            "type": "chat",
            "sender": self,
            "receiver": user+"-"+userName,
            "message": message
        };
        webSocket.send(JSON.stringify(jsonObj));
        inputMessage.value = "";
        inputMessage.focus();
    }
}

// 更新列表
function refreshUserList(jsonObj) {
    var users = jsonObj.userDataList;
    var row = document.getElementById("row");
    // console.log(users.userName);
    row.innerHTML = '';
    for (var i = 0; i < users.length; i++) { 
        if (users[i] === self) { continue; }
        usersList.push(users[i].userId);
        row.innerHTML += '<div id=' + i + ' class="column" name="friendName"  ><h2>' + users[i].userName + '</h2><input type="hidden" id="hiddenInput" value=' + users[i].userId + '></div>';
    } 
    addListener();
}
// 註冊列表點擊事件並抓取好友名字以取得歷史訊息
function addListener() {
    var container = document.getElementById("row");
    container.addEventListener("click", function (e) {
        userName = e.srcElement.textContent; 
        // 使用 querySelector 或 getElementById 来获取 hidden input
        var inputElement = findInputElement(e.target);
        user = inputElement.value; 
        updateFriendName(userName);
        var jsonObj = {
            "type": "history",
            "sender": self,
            "receiver": user,
            "message": ""
        };
        webSocket.send(JSON.stringify(jsonObj));
    });
}
function findInputElement(element) {
    // 逐级向上遍历 DOM 树，查找包含 input 的父级 div 元素
    while (element) {
        if (element.tagName === "DIV" && element.querySelector("input")) {
            return element.querySelector("input");
        }
        element = element.parentNode;
    }
    return null; // 没有找到包含 input 的 div 元素
}
function disconnect() {
    webSocket.close();
    document.getElementById('sendMessage').disabled = true; 
}

function updateFriendName(name) {
    statusOutput.innerHTML = name;
}