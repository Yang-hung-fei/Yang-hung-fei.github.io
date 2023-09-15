import config from "../../../../../ipconfig.js";
import { getChatList, getOnlinUser, getUserRoomList } from "./chatApi.js";
const userToken = localStorage.getItem("Authorization_U");
const hostUrl = (config.url).split('//')[1];
const url = 'wss://' + hostUrl + '/websocket/activity?access_token=' + userToken;
var webSocket;
var userId;
var getUserStatus = true;
var activityId;


window.addEventListener('DOMContentLoaded', async function (e) {
    connectWebSocket();
    await getUserRoomLists();
    //使用者輸入message
    document.getElementById('chat-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        let message = document.getElementById('msg').value;
        let messageForm = {
            roomId: activityId,
            content: message,
        }
        await sendMessage(messageForm);
        document.getElementById('msg').value = "";

    });
    webSocket.close = function (event) {
        console.log("disconnect");
    }

    webSocket.onerror = function (event) {
        errorConnect();
    }

    //監聽使用者切換聊天室事件
    const roomsEls = document.querySelectorAll('.get-room');
    roomsEls.forEach(roomBtn => {
        roomBtn.addEventListener('click', async function (e) {
            activityId = this.dataset.id;
            await getOnlinUserLists(activityId);
            getUserRoomMessageLists(activityId);

        });
    })


})

function connectWebSocket() {
    let token = userToken;
    if (token == null) {
        errorConnect();
        return;
    }
    webSocket = new WebSocket(url);
    webSocket.onopen = function () {
        console.log("連結成功");
    }
    // roomId: 判斷使用者是否目前在此聊天 userId 區分左右
    webSocket.onmessage = function (event) {
        let messageObj = JSON.parse(event.data);
        console.log(messageObj);
        //處理通知訊息 && 從這邊拿到userId
        const inMyRoom = messageObj.roomId === activityId;
        if (messageObj.message.includes("已經上線了")) {
            //只執行一次
            if (getUserStatus) {
                userId = messageObj.userId;
                console.log(userId);
                getUserStatus = false;
            }

            const notifyEl = document.querySelector('.notify-message');
            //當通知數超過3移除第一個元素
            while (notifyEl.childNodes.length > 3) {
                //移除最後一個元素
                notifyEl.removeChild(notifyEl.firstChild);
            }
            //處理通知
            document.querySelector('.notify-message').innerHTML
                += ` <li class="list-group-item border-0">${messageObj.message}</li>`;

        } else if (inMyRoom) {
            //處理聊天室留言
            const isMine = messageObj.userId === userId;
            document.querySelector('.message-container').innerHTML += `
                <div class="d-flex ${isMine ? 'justify-content-end' : 'justify-content-start'} my-3">
                    <div class="card w-30 ${isMine ? "bg-success text-light" : ""}">
                        <div class="card-body">
                            <div class="card-title">
                                ${messageObj.username}
                            </div>
                            <div class="card-text">
                                ${messageObj.message} 
                            </div>
                            <div class="card-text">
                                ${messageObj.date} 
                            </div>      
                        </div>
                    </div>
                </div>
                `
            //執行滾輪
            scroll();
        }
    }
}

async function sendMessage(message) {
    webSocket.send(JSON.stringify(message));
}

async function getOnlinUserLists(activityId) {
    const onlineUserListElement = document.querySelector('.online-users');
    let data = await getOnlinUser(activityId);
    if (data.code == 400) {
        console.log(data.message);
        return;
    }
    let userOnlineList = data.message;
    //page render
    let dataList = "";
    userOnlineList.map(user => {
        dataList += ` <li class="list-group-item">${user.username}</li>`
    });

    //刷新清單
    while (onlineUserListElement.childNodes.length > 3) {
        //移除最後一個元素
        onlineUserListElement.removeChild(onlineUserListElement.lastChild);
    }
    onlineUserListElement.innerHTML += dataList;

}

async function getUserRoomLists() {
    const userRoomListElement = document.querySelector('.chat-room');
    let data = await getUserRoomList();
    if (data.code == 400) {
        console.log(data.message);
        return;
    }
    let userRoomList = data.message;
    //page render
    let dataList = "";
    // "roomId": 1,"roomName": "sdfsdffd"
    userRoomList.map(data => {
        dataList += ` <a href="#" class="list-group-item get-room" data-id="${data.roomId}">${data.roomName}</a>`
    });

    //刷新清單
    while (userRoomListElement.childNodes.length > 3) {
        //移除最後一個元素
        userRoomListElement.removeChild(userRoomListElement.lastChild);
    }
    userRoomListElement.innerHTML += dataList;



    //這邊幫使用者預設第一個房間的聊天清單
    await getUserRoomMessageLists(userRoomList[0].roomId);
    //預設目前上線的使用者清單
    getOnlinUserLists(userRoomList[0].roomId);
}


async function getUserRoomMessageLists(roomId) {
    let data = await getChatList(roomId);
    if (data.code == 400) {
        console.log(data.message);
    } else {
        let dataMes = data.message.reverse();
        let dataList = "";
        document.querySelector('.message-container').innerHTML = '';
        dataMes.forEach(message => {
            const isMine = message.userId === userId;
            dataList += `
           <div class="d-flex ${isMine ? 'justify-content-end' : 'justify-content-start'} my-3">
               <div class="card w-30 ${isMine ? "bg-success text-light" : ""}">
                   <div class="card-body">
                       <div class="card-title">
                           ${message.username}
                       </div>
                       <div class="card-text">
                           ${message.message} 
                       </div>
                       <div class="card-text">
                           ${message.date} 
                       </div>      
                   </div>
               </div>
           </div>
           `
        });
        document.querySelector('.message-container').innerHTML = dataList;
        //執行滾輪
        scroll();
    }
}

//聊天室滾輪
const scroll = function () {
    //這邊我們讓 panel的scroll top 等於 message container height
    const rightPanel = document.querySelector('.right-panel');
    const messageContainer = document.querySelector('.message-container');
    rightPanel.scrollTop = messageContainer.scrollHeight;
}













