import config from '../../../../../ipconfig.js';
const hostUrl = (config.url).split('//')[1];
import { getChatList, getAllRoomList } from './chatApi.js'
const managerToken = localStorage.getItem("Authorization_M");
const url = 'wss://' + hostUrl + '/websocket/activity?access_token=' + managerToken;
var webSocket;
var activityId;
var userId = "0";

window.addEventListener('DOMContentLoaded', async function (e) {
    connectWebSocket();
    await getAllRoomLists();
    //使用者輸入message
    document.getElementById('chat-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        let message = document.getElementById('msg').value;
        let messageForm = {
            roomId: activityId,
            content: message,
        }
        console.log(messageForm);
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
            console.log(activityId);
            await getRoomMessage(activityId);
        });
    });
    // roomId: 判斷使用者是否目前在此聊天 userId 區分左右
    webSocket.onmessage = function (event) {
        console.log(event.data);
        let messageObj = JSON.parse(event.data);
        console.log(messageObj);
        //處理通知訊息 && 從這邊拿到userId
        const inMyRoom = messageObj.roomId === activityId;
        if (inMyRoom) {
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

})
function connectWebSocket() {
    let token = managerToken;
    if (token == null) {
        errorConnect();
        return;
    }
    webSocket = new WebSocket(url);
    webSocket.onopen = function () {
        console.log("連結成功");
    }
}


async function getAllRoomLists() {
    const userRoomListElement = document.querySelector('.chat-room');
    let data = await getAllRoomList();
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
    await getRoomMessage(userRoomList[0].roomId);

}

async function getRoomMessage(roomId) {
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

async function sendMessage(message) {
    webSocket.send(JSON.stringify(message));
}

//聊天室滾輪
const scroll = function () {
    //這邊我們讓 panel的scroll top 等於 message container height
    const rightPanel = document.querySelector('.right-panel');
    const messageContainer = document.querySelector('.message-container');
    rightPanel.scrollTop = messageContainer.scrollHeight;
}