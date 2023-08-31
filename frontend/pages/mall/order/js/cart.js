import config from "../../../../../ipconfig.js";

$("#contactForm").validator().on("submit", function (event) {
    if (event.isDefaultPrevented()) {
        // handle the invalid form...
        formError();
        submitMSG(false, "Did you fill in the form properly?");
    } else {
        // everything looks good!
        event.preventDefault();
        submitForm();
    }
});

function submitForm(){
    // Initiate Variables With Form Content
    var name = $("#name").val();
    var email = $("#email").val();
    var msg_subject = $("#msg_subject").val();
    var message = $("#message").val();


    $.ajax({
        type: "POST",
        url: "php/form-process.php",
        data: "name=" + name + "&email=" + email + "&msg_subject=" + msg_subject + "&message=" + message,
        success : function(text){
            if (text == "success"){
                formSuccess();
            } else {
                formError();
                submitMSG(false,text);
            }
        }
    });
}

function formSuccess(){
    $("#contactForm")[0].reset();
    submitMSG(true, "Message Submitted!")
}

function formError(){
    $("#contactForm").removeClass().addClass('shake animated').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
        $(this).removeClass();
    });
}

function submitMSG(valid, msg){
    if(valid){
        var msgClasses = "h3 text-center tada animated text-success";
    } else {
        var msgClasses = "h3 text-center text-danger";
    }
    $("#msgSubmit").removeClass().addClass(msgClasses).text(msg);
}

const tbody = document.querySelector("#shopCartTBody"); //監聽toby
const updateButton = document.querySelector('.update-box input[type="submit"]'); //監聽更新購物車按鈕
const getPointButton = document.getElementById("getPointButton"); //監聽取得點數按鈕
const pointInput = document.getElementById("pointInput"); //監聽顯示點數欄位
const userPoint = document.querySelector('#coupon-discount');

document.addEventListener("DOMContentLoaded", ()=>{   
    updateCart();
    updateTotalAmount();


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
        
    //監聽刪除按鈕
    tbody.addEventListener('click', event => {
        const target = event.target;
        if (target.classList.contains('fa-times')) {
            const row = target.closest('tr');
            const pdNo = row.querySelector('.remove-pr').getAttribute('data-pdNo');
            deleteProduct(pdNo, row);
        }
    });

    updateButton.addEventListener('click', () => {
        updateCart();
    });

    // 設置折扣點數輸入框的預設值為0
    pointInput.value = 0;
    //更新折扣點數後的總額
    pointInput.addEventListener('input', () => {
    updateTotalAmount();
});
});

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
            Authorization_U: "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI1IiwiZXhwIjoxNjkzNTgwNjg3fQ.jic15MNqsEeChK7IY0lCgMd51p7bXniRWOgm6fZREts",
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
            Authorization_U: "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI1IiwiZXhwIjoxNjkzNTgwNjg3fQ.jic15MNqsEeChK7IY0lCgMd51p7bXniRWOgm6fZREts",
            "Content-Type": "application/json"
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.code === 200) {
            // 從表格中移除該行
            alert(data.message);
            tbody.removeChild(row);

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

    // 獲取折抵點數輸入框的值
    const couponDiscountInput = document.getElementById('pointInput');
    const couponDiscount = parseFloat(couponDiscountInput.value);
    
    // 更新折抵點數的顯示
    const couponDiscountElement = document.getElementById('coupon-discount');
    couponDiscountElement.textContent = `$ ${couponDiscount.toFixed(2)}`;

    // 計算新的總金額（扣除折扣點數）
    const grandTotal = total - couponDiscount;
   
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

    // 調用後端 API 以更新購物車中商品數量
    // Swal.fire({
    //     title: '確定修改商品數量?',
    //     icon: 'warning',
    //     showCancelButton: true,
    //     confirmButtonColor: '#3085d6',
    //     cancelButtonColor: '#d33',
    //     confirmButtonText: 'Yes!'
    //   }).then((result) => {
    //     if (result.isConfirmed) {
           
         
    //     }
    //   })
      updateCartItemQuantity(pdNo, newQuantity);
}


// 更新購物車中商品數量, 記得更新token 
function updateCartItemQuantity(pdNo, quantity) {
    fetch(`${config.url}/user/addProduct?pdNo=${pdNo}&quantity=${quantity}`, {
        method: "POST",
        headers: {
            Authorization_U: "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI1IiwiZXhwIjoxNjkzNTgwNjg3fQ.jic15MNqsEeChK7IY0lCgMd51p7bXniRWOgm6fZREts",
            "Content-Type": "application/json"
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.code === 200) {
            // 更新成功，重新載入購物車
            updateRowTotal(pdNo, quantity);

            Swal.fire({
                position: 'top-end',
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

//發送請求取得點數, 記得更新token 
getPointButton.addEventListener("click", () => {

    // Fetch user 個人資訊
    fetch(config.url + "/user/profile", {
        method: "GET",
        headers: {
            Authorization_U: "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI1IiwiZXhwIjoxNjkzNTgwNjg3fQ.jic15MNqsEeChK7IY0lCgMd51p7bXniRWOgm6fZREts",
            "Content-Type": "application/json"
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.code === 200) {
            const userPoint = data.message.userPoint;
            pointInput.value = userPoint;

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
});


// 綁定前往結帳按鈕點擊事件
const checkoutButton = document.querySelector('.shopping-box a');
checkoutButton.addEventListener('click', function () {
    window.location.href = "orders.html";
});


