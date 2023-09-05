import config from "../../../../ipconfig.js";

window.addEventListener("load", () => {



    fetch(config.url + "/customer/mallproduct", {
        method: "GET"
        // headers: {
        //     Authorization_U: token,
        //     "Content-Type": "application/json"
        // }
    })
    .then(response => response.json())
    .then(data => {
        if (data.code === 200) {
            console.log(data.message.rs);
            renderProductList(data.message.rs);
        }     
    });
    
    // 填充产品详情
function renderProductList(productData) {
    // 获取页面中的元素
    const productNameElement = document.querySelector('.product-name');
    const productPriceElement = document.querySelector('.product-price');
    const productImagesElement = document.querySelector('.product-images');
    const productDescriptionElement = document.querySelector('.product-description');

    // 将产品数据填充到页面元素中
    productNameElement.textContent = productData.pdName;
    productPriceElement.textContent = 'NT$' + productData.pdPrice;

    // 清空产品图片容器
    productImagesElement.innerHTML = '';

    // 填充产品图片
    productData.base64Image.forEach(base64 => {
        const imgElement = document.createElement('img');
        imgElement.src = 'data:image/png;base64,' + base64;
        imgElement.alt = 'Product Image';
        productImagesElement.appendChild(imgElement);
    });

    // 填充产品描述
    productDescriptionElement.innerHTML = productData.description;
}
    

});