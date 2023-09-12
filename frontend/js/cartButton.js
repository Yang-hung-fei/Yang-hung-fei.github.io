import config from "/ipconfig.js";

document.addEventListener("DOMContentLoaded", function () {
  $("#shoppingCart").on("click", function () {
    const token = localStorage.getItem("Authorization_U");
    if (!token) {
      window.location.href = "/frontend/pages/user/login.html";
    } else {
      window.location.href = "/frontend/pages/mall/order/cart.html";
    }
  });
});
