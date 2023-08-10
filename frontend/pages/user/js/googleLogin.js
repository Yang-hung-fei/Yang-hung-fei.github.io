function renderButton() {
    gapi.load('auth2', function () {
        auth2 = gapi.auth2.init({
            client_id: '12649271170-0risrvfckuf08oe89uk0jfgltlm5t168.apps.googleusercontent.com',
            scope: 'profile email',
            redirect_uri: "http://10.1.14.79:5050",
            plugin_name: "This is Google oAuth login "
        });
    });
}


let token;
function onSuccess(result) {
    console.log(result);
    authenticate(result.code)
        .then(res => {
            token = res.data.token;
            console.log(token);
        })
        .catch(console.log);
    fadeOut();

}
function fadeOut() {
    $("div.overlay").fadeOut();
}
function authenticate(code) {

    return axios.post('http://localhost:8080/redirect', JSON.stringify({ code }), {
        headers: {
            'Content-Type': 'application/json'
        }
    });
}
function callEndpoint(uri, token) {
    return axios.get(`http://localhost:8080/${uri}`, { headers: { Authorization: `Bearer ${token}` } });
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
function onClickAdmin() {
    callEndpoint('admin', token)
        .then(console.log)
        .catch(console.log)
}
function onClickUser() {
    alert(token);
    callEndpoint('user', token)
        .then(console.log)
        .catch(console.log)
}




