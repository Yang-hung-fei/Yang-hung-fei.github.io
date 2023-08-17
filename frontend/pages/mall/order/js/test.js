// console.log("測試");

// let formData1 = new FormData(document.getElementById("form1"));
// // formData.get('name'); // 取得目前 input 的值
// // formData.get('file'); // 取得目前的檔案
// console.log(formData1.get("recipient"));
// console.log(formData1.get('recipientPh'));
// console.log(formData1.get('recipientAddress'));

const app = Vue.createApp({
    data() {
        return {
            userId:'',
            recipientName: '',
            recipientPh: '',
            recipientAddress: ''
        };
    },
    methods: {
        submitForm() {
            const formData = {
                userId: this.userId,
                recipientName: this.recipientName,
                recipientPh: this.recipientPh,
                recipientAddress: this.recipientAddress
            };
            console.log(formData);
            console.log("確認付款按鈕被點擊了！");
           
            // 使用 axios 發送 POST 請求至後端
            axios.post('http://localhost:8080/customer/insertOrders', formData)
                .then(response => {
                    console.log(response.data); // 處理後端回應
                    alert(response.data['message']);
                    // 跳轉至付款頁面
                    // window.location.href = 'checkout.html';
                })
                .catch(error => {
                    console.log(error);
                });
        }
    }
});

const vm = app.mount('#app');
