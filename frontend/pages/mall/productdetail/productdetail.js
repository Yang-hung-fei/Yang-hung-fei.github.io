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
                    console.log(singleProduct);
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
            const subpdpic = document.getElementById('subpdpic');

            console.log(subpdpic);
            // 将产品数据填充到页面元素中
            productNameElement.textContent = productData.pdName;
            productPriceElement.textContent = 'NT$' + productData.pdPrice;

            // 清空产品图片容器
            productImagesElement.innerHTML = '';

            const base64Images = productData.base64Image;

            const div = document.createElement('div');
            div.className = 'subpdpic';

            // 填充产品图片
            for (let i = 0; i < base64Images.length; i++) {
                if (i === 0) {
                    const imgElement = document.createElement('img');
                    imgElement.src = 'data:image/png;base64,' + base64Images[i];
                    imgElement.alt = 'Product Main Image';
                    productImagesElement.appendChild(imgElement);
                } else {
                    const imgElement = document.createElement('img');
                    imgElement.src = 'data:image/png;base64,' + base64Images[i];
                    imgElement.alt = 'Product Sub Image';
                    div.appendChild(imgElement);
                }
            }

            productImagesElement.appendChild(div);

            // 填充产品描述
            productDescriptionElement.innerHTML = productData.pdDescription;
        }

    }




});