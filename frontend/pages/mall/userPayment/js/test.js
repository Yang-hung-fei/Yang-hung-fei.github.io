import { generateBtnCallAPI } from "../../userPayment/js/userEcpay.js";
//假設為生成訂單 js 
$(window).on("load",()=>{

    //生成訂單時順便生成付款按鈕  ("付款鈕位置",orderId)
    generateBtnCallAPI("buttonContainer",1);
})