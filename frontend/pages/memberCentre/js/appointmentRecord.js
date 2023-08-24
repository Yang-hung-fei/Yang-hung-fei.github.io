import config from "../../../../ipconfig.js";

window.addEventListener("load", () => {

    const token = localStorage.getItem("Authorization_U");
    //一進入頁面呼叫
    fetchAndBuildTable();

    //撈該使用者的預約單(token要改)
    function fetchAndBuildTable() {
        fetch(config.url + `/user/appointmentList`, {
            method: "GET",
            headers: {
                Authorization_U: "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI0IiwiZXhwIjoxNjkzMTMwNjQyfQ.65VWBEyaA6_Wq8LB8zkO1xT1TxlRsbyJHI-uwNKhWqs",
                "Content-Type": "application/json"
            }
        })
            .then(response => response.json())
            .then(data => {
                if (data.code === 200) {
                    const appointments = data.message.rs;
                    buildTable(appointments);
                } else {
                    console.error(data.message);
                }
            });
    }
    //建構表格
    function buildTable(data) {
        const tableBody = document.querySelector(".table-hover");
        tableBody.innerHTML = ""; // 清空表格内容

        data.forEach(appointment => {
            const row = document.createElement("tr");
            
            if(appointment.pgaNotes===null){
                appointment.pgaNotes="無"
            }

            row.innerHTML = `
                <td class="text-center" hidden>${appointment.pgaNo}</td>
                <td class="text-center">${appointment.pgName}</td>    
                <td class="text-center">
                <img src="data:image/png;base64,${appointment.pgPic}" alt="美容師照片" class="pg-pic">
                </td>
                <td class="text-center">${appointment.pgaDate}</td>
                <td class="text-center">${appointment.pgaTime}</td>
                <td class="text-center">${appointment.pgaOption}</td>
                <td class="text-center" style="max-width: 152px;white-space:pre-line;
                word-wrap: break-word;">${appointment.pgaNotes}</td>
                <td class="text-center">${appointment.userName}</td>
                <td class="text-center">${appointment.pgaPhone}</td>
                <td class="text-center">${appointment.pgaState}</td>
                <td class="text-center">
                    <button class="complete-btn">完成</button>
                </td>
                <td class="text-center">
                    <button class="cancel-btn">取消</button>
                </td>
            `;

            tableBody.appendChild(row);
        });
    }

});