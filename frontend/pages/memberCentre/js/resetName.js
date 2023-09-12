import config from "/ipconfig";

document.addEventListener("DOMContentLoaded", function () {
  document
    .getElementById("editNameButton")
    .addEventListener("click", function () {
      $("#inputNameEdit").val("");
      document.getElementById("showNameContain").style.display = "none";
      document.getElementById("editNameContain").style.display = "block";
    });

  document
    .getElementById("saveNameButton")
    .addEventListener("click", function () {
      // 在這裡添加儲存名稱的程式碼
      document.getElementById("editNameContain").style.display = "none";
      document.getElementById("showNameContain").style.display = "block";

      // 在這裡添加fetch名稱的程式碼
    });

  document
    .getElementById("editNickNameButton")
    .addEventListener("click", function () {
      $("#inputNickNameEdit").val("");
      document.getElementById("showNickNameContain").style.display = "none";
      document.querySelector(".editNickNameContanin").style.display = "block";
    });

  document
    .getElementById("saveNickNameButton")
    .addEventListener("click", function () {
      // 在這裡添加儲存暱稱的程式碼
      document.querySelector(".editNickNameContanin").style.display = "none";
      document.getElementById("showNickNameContain").style.display = "block";

      // 在這裡添加fetch暱稱的程式碼
    });
});

//------------fetch------------
