$(document).ready(function () {
  // 名字和暱稱
  $("#username, #nickname").blur(function () {
    const username = $("#username").val();
    const nickname = $("#nickname").val();

    if (username === "" || nickname === "") {
      $("#usernameNotice").addClass("-on");
    } else {
      $("#usernameNotice").removeClass("-on");
    }
  });

  // 性別
  $("#gender").blur(function () {
    const selectedValue = $(this).val();
    if (selectedValue === "性別") {
      $("#genderNotice").addClass("-on");
    } else {
      $("#genderNotice").removeClass("-on");
    }
  });

  // 信箱
  $("#email").blur(function () {
    const email = $(this).val();
    if (!isValidEmail(email)) {
      $("#emailNotice").addClass("-on");
    } else {
      $("#emailNotice").removeClass("-on");
    }
  });

  function isValidEmail(email) {
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailPattern.test(email);
  }

  // 電話
  $("#phone").blur(function () {
    const phone = $(this).val();
    if (!isValidPhoneNumber(phone)) {
      $("#phoneNotice").addClass("-on");
    } else {
      $("#phoneNotice").removeClass("-on");
    }
  });

  function isValidPhoneNumber(phoneNumber) {
    const phonePattern = /^\d{10}$/;
    return phonePattern.test(phoneNumber);
  }

  // 密碼
  $("#password").blur(function () {
    const password = $(this).val();
    if (!isValidPassword(password)) {
      $("#passwordNotice").addClass("-on");
    } else {
      $("#passwordNotice").removeClass("-on");
    }
  });

  function isValidPassword(password) {
    const passwordPattern = /^[a-zA-Z0-9]{6,}$/;
    return passwordPattern.test(password);
  }

  // 地址
  $("#address_input").blur(function () {
    const address = $(this).val();
    if (address === undefined || address === "") {
      $("#addressNotice").addClass("-on");
    } else {
      $("#addressNotice").removeClass("-on");
    }
  });

  // 驗證碼
  $("#chatcha_code").blur(function () {
    const code = $(this).val();
    if (code === undefined || code === "") {
      $("#charchaCodeNotice").addClass("-on");
    } else {
      $("#charchaCodeNotice").removeClass("-on");
    }
  });
});
