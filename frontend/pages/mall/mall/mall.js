import config from "../../../../ipconfig.js";



window.addEventListener("load", () => {

    let total;

    fetch(config.url + "/customer/mall?limit=8&offset=0", {
        method: "GET"
        // headers: {
        //     Authorization_U: token,
        //     "Content-Type": "application/json"
        // }
    })
        .then(response => response.json())
        .then(data => {
            if (data.code === 200) {
                // console.log(data.message.rs); v
                total = data.message.total;
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
                            <a id="viewDetailLink" class="text-body viewDetailLink" href="https://yang-hung-fei.github.io/frontend/pages/mall/productdetail/productdetail.html"><i class="fa fa-eye text-primary me-2"></i>View detail</a>
                        </small>
                        <small class="w-50 text-center py-2">
                            <a class="text-body add-to-cart-link" href="#" data-product-id="${product.pdNo}"><i class="fa fa-shopping-bag text-primary me-2"></i>Add to cart</a>
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
                // console.log("View detail link clicked for product: " + product.pdNo);

                localStorage.setItem("pdNo", product.pdNo);
                window.location.href = "https://yang-hung-fei.github.io/frontend/pages/mall/productdetail/productdetail.html";
            });
        });

        let count = total - 8;

        $("#more").on("click", () => {
            fetch(config.url + "/customer/mall?limit=" + count + "&offset=8", {
                method: "GET"
            })
                .then(response => response.json())
                .then(data => {
                    if (data.code === 200) {
                        console.log(data);
                        //找到剛剛的productListContainer 往後append
                        const otherPd = data.message.rs;
                        if (otherPd.length === count) {
                            document.getElementById('more').style.display = 'none';
                        }
                        renderProductList(otherPd);
                        console.log(otherPd);
                    }
                });
            // 返回 false，取消默认跳转行为
            return false;

        });

        // 找到搜索按钮和搜索栏元素
        const searchButton = document.getElementById("search-button");
        const searchBar = document.getElementById("search-bar");
        // 添加点击事件监听器
        searchButton.addEventListener("click", performSearch);

        // 添加键盘事件监听器
        searchBar.addEventListener("keyup", function (event) {
            // 检查按下的键是否是 Enter 键（keyCode 13），如果是，则执行搜索
            if (event.keyCode === 13) {
                performSearch();
            }
        });

        // 创建一个函数来执行搜索操作
        function performSearch() {
            // 获取用户输入的搜索关键字
            const searchKeyword = searchBar.value;


            // 调用API并传递搜索关键字
            fetch(config.url + `/customer/mall?search=${searchKeyword}`, {
                method: "GET"
            })
                .then(response => response.json())
                .then(data => {
                    // 清空商品列表容器
                    productListContainer.innerHTML = '';
                    // 处理API响应，渲染搜索结果等操作
                    if (data.code === 200) {
                        const searchResults = data.message.rs;

                        if (searchResults.length === 0) {
                            // 如果找不到搜索结果，显示 "找不到.jpg"
                            const notFoundImage = document.createElement("div");
                            notFoundImage.classList.add("unknow");
                            notFoundImage.style.width = "100%";
                            notFoundImage.innerHTML = `
                        <img src="./img/找不到.jpg" alt="找不到.jpg">
                    `;
                            productListContainer.appendChild(notFoundImage);
                        }
                        searchResults.forEach(product => {
                            // 创建一个用于显示搜索结果的元素，例如一个 <div> 或 <li>
                            const productItem = document.createElement("div");
                            productItem.classList.add("col-xl-3", "col-lg-4", "col-md-6", "wow", "fadeInUp");
                            productItem.setAttribute("data-wow-delay", "0.1s");

                            productItem.innerHTML = `
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
                                        <a id="viewDetailLink" class="text-body viewDetailLink" href="https://yang-hung-fei.github.io/frontend/pages/mall/productdetail/productdetail.html"><i class="fa fa-eye text-primary me-2"></i>View detail</a>
                                    </small>
                                    <small class="w-50 text-center py-2">
                                        <a class="text-body add-to-cart-link" href="#" data-product-id="${product.pdNo}"><i class="fa fa-shopping-bag text-primary me-2"></i>Add to cart</a>
                                    </small>
                                    </div>
                                </div>
                    `;

                            // 将结果添加到商品列表容器中
                            productListContainer.appendChild(productItem);

                        });
                    } else {
                        // 处理API响应中的错误消息
                        console.error(data.message);
                    }
                });
        }

        // 取得所有 Add to cart 連結
        var addToCartLinks = document.querySelectorAll(".add-to-cart-link");
        // 迭代所有 Add to cart 連結，為它們添加點擊事件監聽器
        addToCartLinks.forEach(function (link) {
            link.addEventListener("click", function (event) {
                event.preventDefault(); // 防止連結默認行為 (例如導航到新頁面)

                // 取得產品編號 (在 data-product-id 屬性中)
                var productId = link.getAttribute("data-product-id");

                const token = localStorage.getItem("Authorization_U");
                console.log(productId);
                // console.log(token);
                if (!token) {
                    window.location.href = "../../user/login.html";
                    console.log(productId);

                } else {
                    fetch(`${config.url}/user/addProduct?pdNo=${productId}`, {
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

                // 在這裡執行你希望的操作，例如將該產品添加到購物車

            });
        });

    }
});