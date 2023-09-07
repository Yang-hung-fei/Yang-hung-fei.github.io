import config from "../../../../ipconfig.js";

window.addEventListener("load", () => {


    fetch(config.url + "/customer/mall", {
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

    function renderProductList(products) {
        var productListContainer = document.getElementById("product-list");

        products.forEach(function (product) {
            var productItem = document.createElement("div");
            productItem.className = "col-xl-3 col-lg-4 col-md-6 wow fadeInUp";
            productItem.setAttribute("data-wow-delay", "0.1s");

            var productContent = `
                <div class="product-item">
                    <div class="position-relative bg-light overflow-hidden">
                        <img class="img-fluid w-100" src="data:image/jpeg;base64,${product.base64Image}" alt="${product.pdName}">
                        <div class="bg-secondary rounded text-white position-absolute start-0 top-0 m-4 py-1 px-3">New</div>
                    </div>
                    <div class="text-center p-4">
                        <a class="d-block h5 mb-2" name="${product.pdNo}">${product.pdName}</a>
                        <span class="text-primary me-1">$${product.pdPrice}</span>
                    </div>
                    <div class="d-flex border-top">
                        <small class="w-50 text-center border-end py-2">
                            <a id="viewDetailLink" class="text-body viewDetailLink" href="http://localhost:5500/frontend/pages/mall/productdetail/productdetail.html"><i class="fa fa-eye text-primary me-2"></i>View detail</a>
                        </small>
                        <small class="w-50 text-center py-2">
                            <a class="text-body" href=""><i class="fa fa-shopping-bag text-primary me-2"></i>Add to cart</a>
                        </small>
                    </div>
                </div>
            `;


            productItem.innerHTML = productContent;
            productListContainer.appendChild(productItem);

            // 取得新添加的 View detail 連結
            var viewDetailLink = productItem.querySelector(".viewDetailLink");
            // 為每個 View detail 連結添加點擊事件監聽器
            viewDetailLink.addEventListener("click", function (event) {
                event.preventDefault();
                // 在這裡執行你希望的操作，例如顯示商品詳細資訊
                console.log("View detail link clicked for product: " + product.pdNo);


                localStorage.setItem("pdNo",product.pdNo);
                window.location.href = "http://localhost:5500/frontend/pages/mall/productdetail/productdetail.html";
            });

        });
    }


});