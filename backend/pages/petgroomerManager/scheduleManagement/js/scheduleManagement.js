import config from "../../../../../ipconfig.js";
window.addEventListener("load", () => {

    const pgNameSelect = document.getElementById('pgName');
    const pgPic = document.getElementById('pgPic');
    const pgIdInput = document.getElementById('pgId');
    fetchGroomer();

    //撈使用者/美容師資料(token要改)
    function fetchGroomer(){
    fetch(config.url + "/manager/schedulePageGroomer", {
        method: "GET",
        headers: {
            Authorization_M: "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxIiwiZXhwIjoxNjkzNzM0ODgzfQ.MGVymnvxKaRZ9N7gGInQitt7q_zVoHxvt2n7hoPws6A",
            "Content-Type": "application/json"
        }
    })
        .then(response => response.json())
        .then(data => {
            if (data.code === 200) {
                const groomers = data.message;

                // 填充美容師下拉選單
                groomers.forEach(groomer => {
                    const option = document.createElement('option');
                    option.value = groomer.pgId;
                    option.textContent =`${groomer.pgId} - ${groomer.pgName}`;
                    pgNameSelect.appendChild(option);
                });

                // 美容師選擇事件
                pgNameSelect.addEventListener('change', function () {
                    pgPic.style.display = 'inline';
                    const selectedGroomer = groomers.find(groomer => groomer.pgId == this.value);
                    
                    pgPic.src = '';

                    if (selectedGroomer) {
                        pgPic.src = 'data:image/png;base64,' + selectedGroomer.pgPic;
                        pgIdInput.value=selectedGroomer.pgId;
                        // fetchScheduleForDate(selectedGroomer.pgId); 執行日歷
                        
                    }
                });

                // 直接選擇第一個選項並觸發 change 事件
                const firstOption = pgNameSelect.querySelector('option');
                if (firstOption) {
                    firstOption.selected = true;
                    pgNameSelect.dispatchEvent(new Event('change'));
                }
            }
        });
    }


    var objCalendar = new Calendar();
    var daysTextArr = objCalendar.getDayTextArray(2017, 6);
    var calendarBody = document.getElementById("calendar-body"); // Get the calendar body
    
    calendarBody.innerHTML = ""; // Clear previous content
    
    var rows = Math.ceil(daysTextArr.length / 7); // Calculate number of rows needed
    for (var i = 0; i < rows; i++) {
        var row = document.createElement("tr");
        for (var j = 0; j < 7; j++) {
            var index = i * 7 + j;
            var dayValue = daysTextArr[index];
            var cell = document.createElement("td");
            cell.className = "cell";
            if (dayValue !== "&nbsp;") {
                var cellContent = document.createElement("div");
                cellContent.className = "day";
                cellContent.textContent = dayValue;
                cell.appendChild(cellContent);
            }
            row.appendChild(cell);
        }
        calendarBody.appendChild(row); // Append row to calendar body
    }
});
function Calendar() {

}

Calendar.prototype.getMonthDays = function(year, month) {
    var monthDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    var days = monthDays[month - 1];
    if (month == 2 && this.isLeapYear(year, month)) {
        days = 29;
    }
    return days;
}

Calendar.prototype.isLeapYear = function(year, month) {
    var isLeapYear = false;

    if (year % 400 == 0 || (year % 4 == 0 && year % 100 != 0)) {
        isLeapYear = true;
    }

    return isLeapYear;
}

Calendar.prototype.getWeek = function(year, month, day) {
    var date = new Date();
    date.setFullYear(year, month - 1, day);
    var dayOfWeek = date.getDay();
    if (dayOfWeek == 0) {
        dayOfWeek = 7;
    }
    return dayOfWeek;
}

Calendar.prototype.getDayTextArray = function(year, month) {
    var endDays = this.getMonthDays(year, month);
    var startEmpty = this.getWeek(year, month, 1) - 1;
    var endEmpty = 7 - this.getWeek(year, month, endDays);
    var days = [];
    
    for (var i = 1; i <= startEmpty; i++) {
        days.push("&nbsp;");
    }
    for (var i = 1; i <= endDays; i++) {
        days.push(i);
    }
    for (var i = 1; i <= endEmpty; i++) {
        days.push("&nbsp;");
    }
    
    return days;
}