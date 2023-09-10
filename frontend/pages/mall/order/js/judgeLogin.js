
window.addEventListener("DOMContentLoaded", function () {
    const token = localStorage.getItem("Authorization_U");

console.log(token);

if(!token){
    window.location.href ="../../user/login.html";
}
})