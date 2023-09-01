import config from "../../../../../ipconfig.js";
import { updateDiscountAmount } from './discount.js';

document.addEventListener("DOMContentLoaded", () => {
    // 從localStorage中獲取折扣金額
    const storedCouponDiscount = sessionStorage.getItem('couponDiscount');
    const couponDiscount = parseFloat(storedCouponDiscount || '0'); // 預設為0
    //監聽
    const recipientNameInput = document.getElementById("recipientName");
    const recipientPhInput = document.getElementById("recipientPh");
    const recipientAddressInput = document.getElementById("recipientAddress");
    const shippingFeeOption1 = document.getElementById("shippingFeeOption1");
    const shippingFeeOption2 = document.getElementById("shippingFeeOption2");
    const shippingFeeOption3 = document.getElementById("shippingFeeOption3");
    const shippingAmountElement = document.getElementById("shippingFee");
    const totalPriceElement = document.getElementById("totalPrice"); // 取得商品總金額元素
    //post有關的監聽
    const submitOrderBtnEl = document.getElementById("submitOrderBtn");

    // 定義 cartItems 陣列，使其在整個作用範圍中可訪問
    let cartItems = [];
    // 初始化商品總金額
    let totalPrice = 0;
    // 初始化運費元素為 $0.00
    shippingAmountElement.textContent = "$ 0.00";
    // 定義 ordPick 變數，這樣它就可以在不同的事件監聽器中被設置和使用
    let ordPick; 
    // 設定預設值
    ordPick = 0;
    // 將折抵點數顯示在訂單頁面
    const couponDiscountElement = document.getElementById('discount-amount');
    couponDiscountElement.textContent = `$ ${couponDiscount.toFixed(2)}`;

     // 頁面載入完成後，直接計算並更新實付金額
     updateTotalAmount(totalPrice);

    //取得該購物車資訊, 記得更新token 
    fetch(config.url + "/user/getShopCart", {
        method: "GET",
        headers: {
            Authorization_U: "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI1IiwiZXhwIjoxNjkzNTgwNjg3fQ.jic15MNqsEeChK7IY0lCgMd51p7bXniRWOgm6fZREts",
            "Content-Type": "application/json"
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.code === 200) {
            cartItems = data.message;

            // 將購物車清單數據插入到頁面
            const container = document.querySelector('.rounded.p-2.bg-light');

            cartItems.forEach(item => {
                const media = document.createElement('div');
                media.classList.add('media', 'mb-2', 'border-bottom');

                media.innerHTML = `
                    <div class="media-body">
                        <a href="detail.html">${item.productName}</a>
                        <div class=" text-muted">單價: $${item.productPrice.toFixed(2)} <span class="mx-2">|</span> 購買數量: ${item.quantity} <span class="mx-2">|</span> 此商品總額: $${(item.productPrice * item.quantity).toFixed(2)}</div>
                    </div>
                `;
                // 計算商品總金額
                totalPrice += item.productPrice * item.quantity;
                container.appendChild(media);
            });

            // 將計算結果動態更新到商品總金額元素
            totalPriceElement.textContent = `$ ${totalPrice.toFixed(2)}`;
            // 更新實付金額
            updateTotalAmount(totalPrice);

            
        }
    })
    .catch(error => {
        console.error('Error fetching cart data:', error);
    });


    //取得使用者基本資料, 記得更新token 
    fetch(config.url + "/user/profile", {
        method: "GET",
        headers: {
            Authorization_U: "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI1IiwiZXhwIjoxNjkzNTgwNjg3fQ.jic15MNqsEeChK7IY0lCgMd51p7bXniRWOgm6fZREts",
            "Content-Type": "application/json"
        }
    })
        .then(response => response.json())
        .then(data => {
          const userProfile = data.message;
          recipientNameInput.value = userProfile.userNickName; // 將姓名填充到對應欄位
          recipientPhInput.value = userProfile.userPhone; // 將電話填充到對應欄位
          recipientAddressInput.value = userProfile.userAddress; // 將地址填充到對應欄位
        })
        .catch(error => {
          console.error("Error fetching user profile:", error);
        });

    // 監聽運費選項的變化
    shippingFeeOption1.addEventListener("change", () => {
        shippingAmountElement.textContent = "$0.00";
        updateTotalAmount(totalPrice);
        ordPick = 0;
    });

    shippingFeeOption2.addEventListener("change", () => {
        shippingAmountElement.textContent = "$60.00";
        updateTotalAmount(totalPrice);
        ordPick = 1;
    });

    shippingFeeOption3.addEventListener("change", () => {
        shippingAmountElement.textContent = "$120.00";
        updateTotalAmount(totalPrice);
        ordPick = 2;
    });

    //發送POST請求
    submitOrderBtnEl.addEventListener("click",function (e) {
        e.preventDefault();
        //驗證相關
        const nameInput = document.getElementById("recipientName");
        const phoneInput = document.getElementById("recipientPh");
        const addressInput = document.getElementById("recipientAddress");
        const nameError = document.getElementById("nameError");
        const phoneError = document.getElementById("phoneError");
        const addressError = document.getElementById("addressError");

        const recipientName = nameInput.value; // 從表單中獲取收件人姓名
        const recipientPh = recipientPhInput.value; // 從表單中獲取收件人電話
        const recipientAddress = recipientAddressInput.value; // 從表單中獲取收件人地址
        const ordFee = parseFloat(shippingAmountElement.textContent.replace('$', '')); // 獲取運費
        const totalAmount = parseFloat(totalPriceElement.textContent.replace('$', '')); // 獲取商品總金額
        const orderAmountEl = document.querySelector("#orderAmount");
        const orderAmount = parseFloat(orderAmountEl.textContent.replace('$', '')); // 獲取實付金額
        const discountEl = document.querySelector("#discount-amount");
        const userPoint = parseFloat(discountEl.textContent.replace('$', '')); // 獲取折抵點數
         // 創建"orders"對象
         const orders = {
            ordStatus: 0,
            ordPayStatus: 0,
            ordPick: ordPick,
            ordFee: ordFee,
            totalAmount: totalAmount,
            orderAmount: orderAmount,
            recipientName: recipientName,
            recipientAddress: recipientAddress,
            recipientPh: recipientPh,
            userPoint: userPoint
        };

        // 在此處可以訪問 cartItems 陣列，以及創建 detailList
        const detailList = cartItems.map(item => ({
            proNo: item.pdNo,
            orderListQty: item.quantity,
            orderListPrice: item.productPrice * item.quantity
        }));

         // 將 "orders" 和 "detailList" 包裝成一個物件
        const postData = {
            orders: orders,
            detailList: detailList
        };

        console.log(postData);
        console.log(ordPick);

        // 發送 POST 請求到後端 API,記得更新token
        Swal.fire({
            title: '確定要提交訂單嗎？',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: '確定',
            cancelButtonText: '取消'
        }).then((result) => {

            let isValid = true;

            if (nameInput.value === "") {
                nameError.style.display = "block";
                isValid = false;
            } else {
                nameError.style.display = "none";
            }
    
            if (!/^[0-9]{10}$/.test(phoneInput.value)) {
                phoneError.style.display = "block";
                isValid = false;
            } else {
                phoneError.style.display = "none";
            }
    
            if (addressInput.value === "") {
                addressError.style.display = "block";
                isValid = false;
            } else {
                addressError.style.display = "none";
            }

            if (isValid) {
                // 執行提交操作
                if (result.isConfirmed) {
                    // 使用者按下確定按鈕
                    // 發送 POST 請求到後端 API，記得更新token
                    fetch(config.url + "/user/order", {
                        method: "POST",
                        headers: {
                            Authorization_U: "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI1IiwiZXhwIjoxNjkzNTgwNjg3fQ.jic15MNqsEeChK7IY0lCgMd51p7bXniRWOgm6fZREts",
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(postData)
                    })
                    .then(response => response.json())
                    .then(data => {
                        // 處理後端 API 的回應
                        console.log(data.message);
                        // Swal.fire(data.message);
                        // 如果訂單成功，再發送刪除購物車的請求
                        if (data.message === "新增成功") {
                            fetch(config.url + "/user/deleteShopCart", {
                                method: "DELETE",
                                headers: {
                                    Authorization_U: "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI1IiwiZXhwIjoxNjkzNTgwNjg3fQ.jic15MNqsEeChK7IY0lCgMd51p7bXniRWOgm6fZREts"
                                }
                            })
                            .then(response => response.json())
                            .then(data => {
                                console.log(data.message); // 可以根據需要進行處理
                                Swal.fire("表單新增成功前往付款!");
                            })
                            .catch(error => {
                                console.error('Error deleting shopping cart:', error);
                            });
                        }
    
                    })
                    .catch(error => {
                        console.error('Error creating order:', error);
                    });
                } else {
                    // 使用者按下取消按鈕，不執行請求
                    console.log('使用者取消了訂單提交。');
                }
                // console.log("表單驗證通過，執行提交操作。");
            }
            
        });

        })

});

function updateTotalAmount(totalPrice) {
    const couponDiscount = parseFloat(document.getElementById('discount-amount').textContent.replace('$', '')); // 折抵點數
    const shippingFee = parseFloat(document.getElementById('shippingFee').textContent.replace('$', '')); // 運費
    
    const payableAmount = totalPrice - couponDiscount + shippingFee;

    const orderAmountEl = document.querySelector("#orderAmount");
    orderAmountEl.textContent = `$ ${payableAmount.toFixed(2)}`;
}

// 將折扣金額傳遞給 updateDiscountAmount 函式
// const app = Vue.createApp({
//     data() {
//         return {
//             userId:'',
//             recipientName: '',
//             recipientPh: '',
//             recipientAddress: ''
//         };
//     },
//     methods: {
//         submitForm() {
//             const formData = {
//                 userId: this.userId,
//                 recipientName: this.recipientName,
//                 recipientPh: this.recipientPh,
//                 recipientAddress: this.recipientAddress
//             };
//             console.log(formData);
//             console.log("確認付款按鈕被點擊了！");
           
//             // 使用 axios 發送 POST 請求至後端
//             axios.post(config.url + "/customer/insertOrders", formData)
//                 .then(response => {
//                     console.log(response.data); // 處理後端回應
//                     alert(response.data['message']);
//                     // 跳轉至付款頁面
//                     // window.location.href = 'checkout.html';
//                 })
//                 .catch(error => {
//                     console.log(error);
//                 });
//         }
//     }
// });

// const vm = app.mount('#app');
// console.log("測試");
// let formData1 = new FormData(document.getElementById("form1"));
// // formData.get('name'); // 取得目前 input 的值
// // formData.get('file'); // 取得目前的檔案
// console.log(formData1.get("recipient"));
// console.log(formData1.get('recipientPh'));
// console.log(formData1.get('recipientAddress'));