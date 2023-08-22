document.addEventListener("DOMContentLoaded", function () {
  console.log("notifyButton 被點擊");
  const notificationDiv = document.querySelector("#notifyMenu.dropdown-menu");
  const notifyButton = document.getElementById("notify");

  notifyButton.addEventListener("click", function () {
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
