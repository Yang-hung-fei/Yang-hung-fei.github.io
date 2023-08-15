import domain from '../../../../ipconfig';
import { backToRedirectUrl } from '../../../js/backToRedirectUrl';
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
function authenticate(code) {
    return axios.post(`${domain.url}/user/googleLogin`, JSON.stringify({ code }), {
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(res => {
        let token = res.data.message;
        console.log("token : " +token);
        localStorage.setItem('Authorization_U', token);
        backToRedirectUrl(); //跳轉原頁
    });
}
 
function onFailure(error) {
    fadeOut();
    console.log(error);
}
function onClickSignIn() {
    auth2.grantOfflineAccess()
        .then(onSuccess)
        .catch(onFailure);
}
 




