let auth2;
function renderButton() {
    gapi.load('auth2', function () {
        auth2 = gapi.auth2.init({
            client_id: '12649271170-0risrvfckuf08oe89uk0jfgltlm5t168.apps.googleusercontent.com',
            scope: 'profile email',
            redirect_uri: "http://localhost:5050",
            plugin_name: "This is Google oAuth login "
        });
    });
}
 
function onSuccess(result) {
    authenticate(result.code)
        .then(res => {
            // console.log(res);
            // const parsedData = JSON.parse(res);
            // token = parsedData.message;
            // console.log("token : "+token);
        })
        .catch(console.log);
    fadeOut();

}
function fadeOut() {
    $("div.overlay").fadeOut();
}
function fadeIn() {
    $("div.overlay").fadeIn();
}
function authenticate(code) {

    //TODO: 更改API網域
    return axios.post('http://localhost:8080/user/googleLogin', JSON.stringify({ code }), {
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(res => {
        let token = res.data.message;
        console.log("token : " +token);
        localStorage.setItem('Authorization_U', token);
        /**之後 跳轉頁 */
        //TODO: API取userProfile，有空值就跳會員中心
        window.location.href = '../../pages/memberCentre/memberCentre.html';
    });
}
 
function onFailure(error) {
    fadeOut();
    console.log(error);
}
function onClickSignIn() {
    fadeIn();
    if(auth2 ==null){
        auth2 = gapi.auth2.init({
            client_id: '12649271170-0risrvfckuf08oe89uk0jfgltlm5t168.apps.googleusercontent.com',
            scope: 'profile email',
            redirect_uri: "http://localhost:5050",
            plugin_name: "This is Google oAuth login "
        });
    }
    auth2.grantOfflineAccess()
        .then(onSuccess)
        .catch(onFailure);
}
 