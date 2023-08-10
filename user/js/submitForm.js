function submitForm() {
    var userName_el = document.getElementById("username").value;
    var userNickName_el = document.getElementById("nickname").value;
    var gender_el = document.querySelector('#gender + span span span span').getAttribute('title');
    var birthday_el = document.getElementById("birthday").value;
    var email_el = document.getElementById("email").value;
    var phone_el = document.getElementById("phone").value;
    var password_el = document.getElementById("password").value;

    //---------地址
    var city_el = document.getElementById("city").options[parseInt(document.getElementById("city").value) + 1].text;
    var area_el = document.getElementById("area").options[document.getElementById("area").value].text;
    var address_el = document.getElementById("address_input").value;
    var fullAddress = city_el + area_el + address_el;
    //^^^^^^^^^^地址

    var chaptcha_el = document.getElementById("chatcha_code").value;

    //=======JSON

    const jsonData = {};

    jsonData.chaptcha = chaptcha_el;
    jsonData.identityProvider = "";
    jsonData.userAddress = fullAddress;
    jsonData.userBirthday = birthday_el;
    jsonData.userEmail = email_el;
    if (gender_el === "女性") {
        jsonData.userGender = 0;
    } else if (gender_el === "男性") {
        jsonData.userGender = 1;
    } else {
        jsonData.userGender = 2;
    }
    jsonData.userName = userName_el;
    jsonData.userNickName = userNickName_el;
    jsonData.userPassword = password_el;
    jsonData.userPhone = phone_el;
    jsonData.userPic = "";



    //=======POST

    fetch('https://api.example.com/data', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(jsonData)
    })
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(error => console.error('Error:', error));

}