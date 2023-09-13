import config from "../../../../../ipconfig.js";
import { updateDiscountAmount } from './discount.js';

const tbody = document.querySelector("#shopCartTBody"); //監聽toby
const updateButton = document.querySelector('.update-box input[type="submit"]'); //監聽更新購物車按鈕
const getPointButton = document.getElementById("getPointButton"); //監聽取得點數按鈕
const pointInput = document.getElementById("pointInput"); //監聽顯示點數欄位
const userPoint = document.querySelector('#discount-amount');
//Header Token
const token = localStorage.getItem("Authorization_U");

//一載入渲染
document.addEventListener("DOMContentLoaded", ()=>{   
    updateCart();
    updateTotalAmount();
    getUserPointAndUpdateUI();

    tbody.addEventListener('input', event => {
        const target = event.target;
        if (target.classList.contains('qty')) {
            const row = target.closest('tr');
            const price = parseFloat(row.querySelector('.price-pr p').textContent.replace('$', ''));
            let quantity = parseInt(target.value, 10);
    
            if (quantity <= 0) {
                 // 添加淡出動畫效果
                 row.style.transition = 'opacity 0.5s';
                 row.style.opacity = '0';
                 
                 // 等待 0.5 秒後刪除行並更新總金額
                 setTimeout(() => {
                     tbody.removeChild(row);
                     updateTotalAmount();
                 }, 1200);
                 return;
            }
    
            const totalCell = row.querySelector('.total-pr p');
            const newTotal = (price * quantity).toFixed(2);
            totalCell.textContent = `$ ${newTotal}`;
    
            // 動態更新數量
            updateTotalAmount();
        }

    }); 
        
    // 監聽刪除按鈕
    tbody.addEventListener('click', event => {
        const target = event.target;
        if (target.classList.contains('fa-times')) {
            const row = target.closest('tr');
            const pdNo = row.querySelector('.remove-pr').getAttribute('data-pdNo');

            // 使用 SweetAlert2 彈窗確認刪除
            Swal.fire({
                title: '確認刪除商品',
                text: '您確定要刪除這個商品嗎？',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                confirmButtonText: '確定刪除'
            }).then((result) => {
                if (result.isConfirmed) {
                    // 使用者確定刪除，執行刪除商品的函數
                    deleteProduct(pdNo, row);
                }
            });
        }
    });


    updateButton.addEventListener('click', () => {
        updateCart();
    });

    // 設置折扣點數輸入框的預設值為0
    pointInput.value = 0;
    //更新折扣點數後的總額,監聽輸入變化
    pointInput.addEventListener('input', () => {
        // 確保只能輸入數字
        pointInput.value = pointInput.value.replace(/\D/g, '');


        const userPoint = parseFloat(pointInput.value);
        const maxUserPoint = parseFloat(pointInput.getAttribute('max')); // 從HTML中取得最大值

        // 如果使用者輸入的點數超過了最大值，則設置輸入框值為最大值
        if (userPoint > maxUserPoint) {
            pointInput.value = maxUserPoint;
        }

        // 更新顯示點數的 <output> 元素
        const displayNumber = document.getElementById('displayNumber');
        displayNumber.value = userPoint;

        // 更新總金額
        updateTotalAmount();
    });
});

//更新購物車資訊
updateButton.addEventListener('click', () => {
    updateCart();
});

//取得購物車資訊 記得更新token
function updateCart() {

     // 取消舊的數量輸入框事件監聽器
     const quantityInputs = document.querySelectorAll('.quantity-box input');
     quantityInputs.forEach(input => {
         input.removeEventListener('change', handleQuantityChange);
     });


    fetch(config.url + "/user/getShopCart", {
        method: "GET",
        headers: {
            Authorization_U: token,
            "Content-Type": "application/json"
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.code === 200) {
            // 清空表格內容
            tbody.innerHTML = '';
            
            // 將獲取的購物車清單數據動態填充到表格中
            data['message'].forEach(item => {
                if (item.quantity > 0){
                    const row = document.createElement('tr');
                    row.innerHTML = `
                    <td class="thumbnail-img">
                        <a href="#"><img class="img-fluid" src="data:image/jpeg;base64,${item.productImage}" alt="" /></a>
                    </td>
                    <td class="name-pr" style="text-align: center;"><a href="#">${item.productName}</a></td>
                    <td class="price-pr"><p style="text-align: center;">$ ${item.productPrice.toFixed(2)}</p></td>
                    <td class="quantity-box">
                        <input type="number" size="4" value="${item.quantity}" min="0" step="1" class="c-input-text qty text" data-pdNo="${item.pdNo}">
                    </td>
                    <td class="total-pr"><p style="text-align: center;">$ ${(item.productPrice * item.quantity).toFixed(2)}</p></td>
                    <td class="remove-pr" data-pdNo="${item.pdNo}"><a href="#"><i class="fas fa-times"></i></a></td>
                    `;
                    tbody.appendChild(row);
                }

            });

             // Update the total amount in the HTML
            let total = 0;
            data['message'].forEach(item => {
                total += item.productPrice * item.quantity;
            });

             const totalPriceElement = document.querySelector('#total-amount');
             totalPriceElement.textContent = `$ ${total.toFixed(2)}`;

             //動態更新下方總金額
             updateTotalAmount();
            
             // 重新註冊數量輸入框事件監聽器
            const quantityInputs = document.querySelectorAll('.quantity-box input');
            quantityInputs.forEach(input => {
                input.addEventListener('change', handleQuantityChange);
            });
        }
    });
}

//刪除該商品, 記得更新token
function deleteProduct(pdNo, row) {

    fetch(config.url + "/user/deleteProduct/" + pdNo, {
        method: "DELETE",
        headers: {
            Authorization_U: token,
            "Content-Type": "application/json"
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.code === 200) {
            // 從表格中移除該行
            Swal.fire(data.message);
            tbody.removeChild(row);
            updateTotalAmount(); 
        }
    })
    .catch(error => {
        console.error('Error deleting product:', error);
    });
}

//動態更新商品總金額
function updateTotalAmount() {
    const allRows = tbody.querySelectorAll('tr');
    let total = 0;
    
    allRows.forEach(row => {
        const price = parseFloat(row.querySelector('.price-pr p').textContent.replace('$', ''));
        const quantity = parseInt(row.querySelector('.qty').value, 10);
         // 檢查商品數量是否為 0，如果是，不納入計算
        if (quantity > 0) {
            total += price * quantity;
        }
    });


    // 在購物車頁面，當使用者輸入折扣金額時，呼叫以下函式
    const couponDiscountInput = document.getElementById('pointInput');
    const couponDiscount = parseFloat(couponDiscountInput.value);
  
    
    // 更新折抵點數的顯示
    const couponDiscountElement = document.getElementById('discount-amount');
    couponDiscountElement.textContent = `$ ${couponDiscount.toFixed(2)}`;

    // 計算新的總金額（扣除折扣點數）
    const grandTotal = total - couponDiscount;

    // console.log(couponDiscount);
    // 更新總金額的顯示
    const totalPriceElement = document.querySelector('#total-amount');
    totalPriceElement.textContent = `$ ${total.toFixed(2)}`;

    // 更新 Grand Total 顯示
    const grandTotalElement = document.getElementById('grand-amount');
    grandTotalElement.textContent = `$ ${grandTotal.toFixed(2)}`

}

// 處理數量變化事件
function handleQuantityChange(event) {
    const pdNo = event.target.getAttribute('data-pdNo');
    const newQuantity = event.target.value;

    updateCartItemQuantity(pdNo, newQuantity);
}

// 更新購物車中商品數量, 記得更新token 
function updateCartItemQuantity(pdNo, quantity) {
    fetch(`${config.url}/user/changProductAmount?pdNo=${pdNo}&quantity=${quantity}`, {
        method: "POST",
        headers: {
            Authorization_U: token,
            "Content-Type": "application/json"
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.code === 200) {
            // 更新成功，重新載入購物車
            updateRowTotal(pdNo, quantity);

            Swal.fire({
                position: 'top-center',
                icon: 'success',
                title: '更新數量成功!',
                showConfirmButton: false,
                timer: 1500
              })
        } else {
            // 更新失敗，處理錯誤
            Swal.fire({
                icon: '錯誤',
                title: "錯誤",
                text: data.message,
                footer: '<a href="">與我們聯絡?</a>'
              })
        }
    });
}

//更新當前行的總金額，而不是重新載入整個購物車
function updateRowTotal(pdNo, quantity) {
    const row = document.querySelector(`.quantity-box input[data-pdNo="${pdNo}"]`).closest('tr');
    const price = parseFloat(row.querySelector('.price-pr p').textContent.replace('$', ''));
    const totalCell = row.querySelector('.total-pr p');
    
    if (!isNaN(quantity) && quantity >= 0) {
        const newTotal = (price * quantity).toFixed(2);
        totalCell.textContent = `$ ${newTotal}`;

        // 動態更新數量
        updateTotalAmount();
    }
}

//取得點數
getPointButton.addEventListener("click", () => {
    getUserPointAndUpdateUI();
});

//發送請求取得點數, 記得更新token 
function getUserPointAndUpdateUI() {
    fetch(config.url + "/user/profile", {
        method: "GET",
        headers: {
            Authorization_U: token,
            "Content-Type": "application/json"
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.code === 200) {
            const userPoint = data.message.userPoint;
            pointInput.value = userPoint;
            
            // 設置最大值屬性
            pointInput.setAttribute('max', userPoint);

            // 更新顯示點數的 <output> 元素
            const displayNumber = document.getElementById('displayNumber');
            displayNumber.value = userPoint;

            // 更新總金額
            updateTotalAmount();
        } else {
            console.error("Failed to get user profile:", data.message);
        }
    })
    .catch(error => {
        console.error("Error fetching user profile:", error);
    });
}

// 綁定前往結帳按鈕點擊事件
const checkoutButton = document.querySelector('.shopping-box a');
checkoutButton.addEventListener('click', function (e) {
    e.preventDefault();

    
    // 檢查購物車中是否有商品
    const cartRows = tbody.querySelectorAll('tr');
    if (cartRows.length === 0) {
        Swal.fire({
            icon: 'error',
            title: '購物車中沒有商品',
            text: '請先加入商品到購物車再前往結帳。',
        });
        return;
    }

    // 確保點數輸入框不為空，如果為空，將其設置為0
    if (pointInput.value === '') {
        pointInput.value = '0';
    }

    const couponDiscount = parseFloat(pointInput.value);
    
    // 計算實付金額
    const totalAmount = parseFloat(document.querySelector('#total-amount').textContent.replace('$', ''));
    const grandTotalAmount = parseFloat(document.querySelector('#grand-amount').textContent.replace('$', ''));
    const paidAmount = grandTotalAmount - couponDiscount;

    // 檢查實付金額是否小於0，如果是，彈出警告
    if (grandTotalAmount < 0) {
        Swal.fire({
            icon: 'error',
            title: '實付金額小於0',
            text: '無法前往結帳，請檢查點數或購物車內容。',
        });
        return;
    }

    console.log(couponDiscount);
    // 將折扣金額存儲到sessionStorage中
    sessionStorage.setItem('couponDiscount', couponDiscount);
    // 如果一切正常，導航到結帳頁面
    window.location.href = "./orders.html";
});