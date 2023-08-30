export function checkEmail(emailText) {
    // Check email format
    var emailRegex =
      /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$/;
  
    if (!emailText.match(emailRegex)) {
      return "Email 格式不正確。";
    }
    return null; // No error
  }
  
  export function checkPassword(password) {
    if (password.length < 6) {
      return "密碼長度不足。";
    }
    return null; // No error
  }