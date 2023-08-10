$(function () {

    //有子項目的標題
    //去除沒有連結，並且有箭號 (可以開合)。

    // $(".sidebar-link").on("click", function () {
    //     this.preventDefault();

    //     if ($(this).closest(".arrow").is(".arrow.-rotate")) {
    //         $(this).closest(".arrow").removeClass("-rotate");
    //     } else {
    //         $(this).closest(".arrow").addClass("-rotate");
    //     }
    // })

    $("li.sidebar-item").on("click", function () {
        $(this).closest("li.sidebar-item").find("div.sublist").slideToggle();

        $(this).find(".arrow").toggleClass("-rotate"); // 切換箭頭的旋轉類別

    })



})();