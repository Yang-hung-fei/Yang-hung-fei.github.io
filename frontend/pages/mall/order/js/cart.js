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

document.addEventListener("DOMContentLoaded", ()=>{   
    updateCart();

        tbody.addEventListener('input', event => {
            const target = event.target;
            if (target.classList.contains('qty')) {
                const row = target.closest('tr');
                const price = parseFloat(row.querySelector('.price-pr p').textContent.replace('$', ''));
                const quantity = parseInt(target.value, 10);
                const totalCell = row.querySelector('.total-pr p');
                
                if (!isNaN(quantity) && quantity >= 0) {
                    const newTotal = (price * quantity).toFixed(2);
                    totalCell.textContent = `$ ${newTotal}`;
                }
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
});

updateButton.addEventListener('click', () => {
    updateCart();
});


//取得購物車資訊 記得更新token
function updateCart() {
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
                const row = document.createElement('tr');
                row.innerHTML = `
                <td class="thumbnail-img">
                    <a href="#"><img class="img-fluid" src="data:image/jpeg;base64,${item.productImage}" alt="" /></a>
                </td>
                <td class="name-pr"><a href="#">${item.productName}</a></td>
                <td class="price-pr"><p>$ ${item.productPrice.toFixed(2)}</p></td>
                <td class="quantity-box"><input type="number" size="4" value="${item.quantity}" min="0" step="1" class="c-input-text qty text"></td>
                <td class="total-pr"><p>$ ${(item.productPrice * item.quantity).toFixed(2)}</p></td>
                <td class="remove-pr" data-pdNo="${item.pdNo}"><a href="#"><i class="fas fa-times"></i></a></td>
                `;
                tbody.appendChild(row);
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
// console.log(tbody);
