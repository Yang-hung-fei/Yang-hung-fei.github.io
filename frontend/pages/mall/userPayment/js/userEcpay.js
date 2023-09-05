import config from "../../../../../ipconfig.js";
 

function checkIsPay(button,orderId) {
    let token = localStorage.getItem("Authorization_U"); 
    fetch(config.url+"/user/productMall/order?orderId="+orderId, {
        method: "GET",
        headers: {
            "Authorization_U": token,  // 在標頭中帶入 Token
            "Content-Type": "application/json"   // 如果需要，指定內容類型
        }
    }).then(response => response.json())
        .then(res => {
            console.log(res);
            if (res.code != 200)
                swal(res.message);
            if (res.message == "isPay") {
                button.disabled = true;
                button.textContent = "完成付款"; // 修改按鈕文字為 "完成付款"
                return true;
            }

        })
        .catch(error => {
            console.error("Error fetching form:", error);
        });
        return false;
}


function userPay(button,orderId) {
    let token = localStorage.getItem("Authorization_U");
    fetch(config.url+"/user/productMall/order/getPaymentForm?orderId="+orderId, {
        method: "GET",
        headers: {
            "Authorization_U": token,  // 在標頭中帶入 Token
            "Content-Type": "application/json"   // 如果需要，指定內容類型
        }
    }).then(response => response.json())
        .then(res => {
            if (res.code == 410) {
                button.disabled = true;
                button.textContent = "完成付款"; // 修改按鈕文字為 "完成付款"
                return;
            }
            if (res.code != 200) {
                swal(res.message);
                return;
            }
            var newWindow = window.open();
            newWindow.document.write(res.message); // 插入表單 HTML 內容
            newWindow.document.close();
        })
        .catch(error => {
            console.error("Error fetching form:", error);
        });
}



 // 動態生成按鈕並呼叫 API
 function generateButtonAndCallAPI(container,orderId) {
    // 創建按鈕元素
    var button = document.createElement("button");
    button.textContent = "進行付款";

    // 將按鈕插入容器
    var buttonContainer = document.getElementById(container);
    buttonContainer.appendChild(button);

    // 呼叫 API
    checkIsPay(button,orderId);

    // 監聽按鈕點擊事件
    button.addEventListener("click", function() {
        userPay(this,orderId);//放入的為orderId
    });
}



// 呼叫生成按鈕並呼叫 API 的函數(容器，orderId)
// generateButtonAndCallAPI("buttonContainer",1);

export function generateBtnCallAPI(container, orderId) {
    generateButtonAndCallAPI(container,orderId);
  }

 // generateButtonAndCallAPI("buttonContainer",1);