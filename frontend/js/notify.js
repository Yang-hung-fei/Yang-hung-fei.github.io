document.addEventListener("DOMContentLoaded", function () {
  const notificationDiv = document.querySelector("#notifyMenu.dropdown-menu");
  const notifyButton = document.getElementById("notify");

  notifyButton.addEventListener("click", function () {
    notifyButton.css("z-index", "999");
    notificationDiv.classList.toggle("show");
  });

  // 點擊其他區域時隱藏
  document.addEventListener("click", function (event) {
    if (
      !notificationDiv.contains(event.target) &&
      !notifyButton.contains(event.target)
    ) {
      notificationDiv.classList.remove("show");
    }
  });
});
