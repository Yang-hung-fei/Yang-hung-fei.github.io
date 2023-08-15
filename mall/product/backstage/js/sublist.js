$(function(){

    $(li.sidebar-headar).on("click", function(e){
        e.preventDefault();
        $(this).closest("i").toggleClass("-on");
        $(this).closest("i").find("div.inner_block").slideToggle();
    })

})();