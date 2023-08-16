// google-login.js
function loadGooglePlatform() {
    const script = document.createElement("script");
    script.src = "https://apis.google.com/js/platform.js";
    script.onload = initializeGoogleSignIn;
    document.head.appendChild(script);
  }
  
  function initializeGoogleSignIn() {
    gapi.load("auth2", function() {
      gapi.auth2.init({
        client_id: "YOUR_CLIENT_ID",
      });
      const signInButton = document.querySelector(".g-signin2");
      signInButton.style.display = "block";
    });
  }
  
  function onSignIn(googleUser) {
    const profile = googleUser.getBasicProfile();
    const idToken = googleUser.getAuthResponse().id_token;
  
    // 在這裡處理登入成功後的操作
    // 例如：將 idToken 送到後端伺服器進行驗證
    sendTokenToServer(idToken);
  }
  
  function sendTokenToServer(token) {
    // 在這裡使用 AJAX 或 fetch 將 token 送到後端伺服器
    // 用來驗證並進行後續處理
    fetch("/verify-google-token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ token })
    })
    .then(response => response.json())
    .then(data => {
      // 處理伺服器回應
      console.log(data);
    })
    .catch(error => {
      console.error("Fetch error:", error);
    });
  }
  
  // 載入 Google JavaScript 庫，然後初始化 Google 登入
  loadGooglePlatform();
  