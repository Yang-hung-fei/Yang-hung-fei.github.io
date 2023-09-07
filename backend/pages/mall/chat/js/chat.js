import config from "/ipconfig.js";

var statusOutput = document.getElementById("statusOutput");
var messagesArea = document.getElementById("messagesArea");
var self = '${userName}';
var webSocket;
$(window).on("load", () => {
    connect();
})
function connect() {
    
    let token = localStorage.getItem("Authorization_U"); 
    let connectUrl = (config.url).split('//')[1];
    if (token == null)
        return;  
    let url = 'ws://' + connectUrl + '/websocket/productMallChat?access_token=' + token;
    let webSocket = new WebSocket(url);
    webSocket.onopen = function () {
        console.log("Connect Success!");
       
    };

    webSocket.onmessage = function (event) {
        var jsonObj = JSON.parse(event.data);
        if ("open" === jsonObj.type) {
            refreshFriendList(jsonObj);
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
            document.getElementById("area").appendChild(li);
            messagesArea.scrollTop = messagesArea.scrollHeight;
        } else if ("close" === jsonObj.type) {
            refreshFriendList(jsonObj);
        }

    };

    webSocket.onclose = function (event) {
        console.log("Disconnected!");
    };
}

function sendMessage() {
    var inputMessage = document.getElementById("message");
    var friend = statusOutput.textContent;
    var message = inputMessage.value.trim();

    if (message === "") {
        alert("Input a message");
        inputMessage.focus();
    } else if (friend === "") {
        alert("Choose a friend");
    } else {
        var jsonObj = {
            "type": "chat",
            "sender": self,
            "receiver": friend,
            "message": message
        };
        webSocket.send(JSON.stringify(jsonObj));
        inputMessage.value = "";
        inputMessage.focus();
    }
}

// 有好友上線或離線就更新列表
function refreshFriendList(jsonObj) {
    var friends = jsonObj.users;
    var row = document.getElementById("row");
    row.innerHTML = '';
    for (var i = 0; i < friends.length; i++) {
        if (friends[i] === self) { continue; }
        row.innerHTML += '<div id=' + i + ' class="column" name="friendName" value=' + friends[i] + ' ><h2>' + friends[i] + '</h2></div>';
    }
    addListener();
}
// 註冊列表點擊事件並抓取好友名字以取得歷史訊息
function addListener() {
    var container = document.getElementById("row");
    container.addEventListener("click", function (e) {
        var friend = e.srcElement.textContent;
        updateFriendName(friend);
        var jsonObj = {
            "type": "history",
            "sender": self,
            "receiver": friend,
            "message": ""
        };
        webSocket.send(JSON.stringify(jsonObj));
    });
}

function disconnect() {
    webSocket.close();
    document.getElementById('sendMessage').disabled = true;
    document.getElementById('connect').disabled = false;
    document.getElementById('disconnect').disabled = true;
}

function updateFriendName(name) {
    statusOutput.innerHTML = name;
}