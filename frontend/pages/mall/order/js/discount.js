// 更新折扣點數
function updateDiscountAmount(discount) {
    const discountAmountElement = document.getElementById('discount-amount');
    discountAmountElement.textContent = `$ ${discount.toFixed(2)}`;
}

export { updateDiscountAmount };
// 在需要時引入此模組，例如在購物車和訂單頁面