import config from "../../../../../ipconfig.js";

$(window).on("load", () => {

    const token = localStorage.getItem("Authorization_U");
    fetch(config.url + "/user/appointmentPage", {
        method: "GET",
        headers: {
            Authorization_U: "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI0IiwiZXhwIjoxNjkzMTMwNjQyfQ.65VWBEyaA6_Wq8LB8zkO1xT1TxlRsbyJHI-uwNKhWqs",
            "Content-Type": "application/json"
        }
    })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            if (data.code === 200) {
                const groomers = data.message.rs;

                const pgNameSelect = $('#pgName');
                const pgPic = $('#pgPic');
                const pgGender = $('#pgGender');
                const userNameInput = $('#userName');
                const userPhInput = $('#userPh');

                groomers.forEach(groomer => {
                    pgNameSelect.append($('<option>', {
                        value: groomer.pgId,
                        text: groomer.pgName
                    }));
                });

                pgNameSelect.on('change', function () {
                    const selectedGroomer = groomers.find(groomer => groomer.pgId == this.value);

                    pgPic.attr('src', '');

                    if (selectedGroomer) {
                        pgGender.text(selectedGroomer.pgGender)
                        pgPic.attr('src', 'data:image/png;base64,' + selectedGroomer.pgPic);
                    }
                });

                // Set user name and phone
                userNameInput.val(data.message.userName);
                userPhInput.val(data.message.userPh);
            }
        });
});