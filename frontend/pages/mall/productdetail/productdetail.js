import config from "../../../../ipconfig.js";
window.addEventListener("load", () => {
    const pdNo = localStorage.getItem("pdNo"); // 使用Manager Token

    all(pdNo);

    function all(pdNo) {
        fetch(config.url + `/customer/mallproduct?pdNo=${pdNo}`, {
            method: "GET"
            // headers: {
            //     Authorization_U: token,
            //     "Content-Type": "application/json"
            // }
        })
            .then(response => response.json())
            .then(data => {
                if (data.code === 200) {
                    let singleProduct = data.message;
                    renderProductList(singleProduct);
                }
            });

        // 填充产品详情
        function renderProductList(productData) {


            // 获取页面中的元素
            const productNameElement = document.querySelector('.product-name');
            const productPriceElement = document.querySelector('.product-price');
            const productImagesElement = document.querySelector('.product-images');
            const productDescriptionElement = document.querySelector('.product-description');
            // const subpdpic = document.getElementById('subpdpic');
            // const mainImg = document.getElementById('mainImg');


            // 将产品数据填充到页面元素中
            productNameElement.textContent = productData.pdName;
            productPriceElement.textContent = 'NT$' + productData.pdPrice;

            // 清空产品图片容器
            productImagesElement.innerHTML = '';

            const base64Images = productData.base64Image;

            const div = document.createElement('div');
            div.className = 'subpdpic';

            const imgElementM = document.createElement('img');
            imgElementM.src = '';
            imgElementM.alt = 'Product Main Image';
            productImagesElement.appendChild(imgElementM);
            // 填充产品图片
            for (let i = 0; i < base64Images.length; i++) {

                const imgElement = document.createElement('img');
                imgElement.src = 'data:image/png;base64,' + base64Images[i];
                imgElement.alt = 'Product Sub Image';



                //監聽元素
                imgElement.addEventListener('click', function () {
                    imgElementM.src = 'data:image/png;base64,' + base64Images[i];
                });

                if (i === 0) {
                    imgElement.click();
                }

                div.appendChild(imgElement);
                // else {
                //     const imgElement = document.createElement('img');
                //     imgElement.src = 'data:image/png;base64,' + base64Images[i];
                //     imgElement.alt = 'Product Sub Image';
                //     div.appendChild(imgElement);
                // }
            }

            productImagesElement.appendChild(div);


            // 填充产品描述
            productDescriptionElement.innerHTML = productData.pdDescription;
        }

        // 取得所有 Add to cart 連結
        var addToCartButtons = document.querySelectorAll(".add-to-cart");

        // 迭代所有 Add to cart 連結，為它們添加點擊事件監聽器
        addToCartButtons.forEach(function (button) {
            button.addEventListener("click", function (event) {
                event.preventDefault(); // 防止連結默認行為 (例如導航到新頁面)

                const token = localStorage.getItem("Authorization_U");
                if (!token) {
                    window.location.href = "../../user/login.html";

                } else {
                    fetch(`${config.url}/user/addProduct?pdNo=${pdNo}`, {
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
                                Swal.fire({
                                    position: 'top-center',
                                    icon: 'success',
                                    title: data.message,
                                    showConfirmButton: false,
                                    timer: 1500
                                })
                            } else {
                                //更新失敗，處理錯誤
                                Swal.fire({
                                    icon: '錯誤',
                                    title: "錯誤",
                                    text: data.message,
                                })
                            }
                        });
                }
            });
        });


        // 取得所有 Add to favorites 連結
        var addToFavoritesButtons = document.querySelectorAll(".add-to-favorites");

        // 迭代所有 Add to favorites 連結，為它們添加點擊事件監聽器
        addToFavoritesButtons.forEach(function (button) {
            button.addEventListener("click", function (event) {
                event.preventDefault(); // 防止連結默認行為 (例如導航到新頁面)

                const token = localStorage.getItem("Authorization_U");
                if (!token) {
                    window.location.href = "../../user/login.html";

                } else {
                    fetch(`${config.url}/user/addproductcollect?pdNo=${pdNo}`, {
                        method: "POST",
                        headers: {
                            Authorization_U: token,
                            "Content-Type": "application/json"
                        }
                    })
                        .then(response => response.json())
                        .then(data => {
                            if (data.code === 200) {
                                // 更新成功，重新載入收藏商品
                                Swal.fire({
                                    position: 'top-center',
                                    icon: 'success',
                                    title: "已加入收藏!",
                                    showConfirmButton: false,
                                    timer: 1500
                                })
                            } else {
                                //更新失敗，處理錯誤
                                Swal.fire({
                                    icon: '錯誤',
                                    title: "錯誤",
                                    text: data.message,
                                })
                            }
                        });
                }
            });
        });

    }
});