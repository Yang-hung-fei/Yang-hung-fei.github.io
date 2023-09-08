import config from '../../../../../ipconfig.js';
const hostUrl = config.url;
const websocket = new websocket("ws:/websocket/activity");
websocket.on("connection", ws => {
    console.log("user is connection");
});