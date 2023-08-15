$(function () {
    $("li.sidebar-item").on("click", function () {
        $(this).closest("li.sidebar-item").find("div.sublist").slideToggle();

        $(this).find(".arrow").toggleClass("-rotate"); // 切換箭頭的旋轉類別

    })
})