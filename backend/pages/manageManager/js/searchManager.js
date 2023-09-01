import config from "/ipconfig.js";

export function searchManagerAccount() {
  fetch(config.url + "/manager/manageManager", {
    method: "GET",
    headers: {
      Authorization_U: token,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: formData.toString(), // Encode the parameters as a string
  })
    .then((response) => response.json())
    .then((responseData) => {
      var code = responseData.code;
      if (code === 200) {
        swal("查詢成功", "", "success");
      }
    })
    .catch((error) => {
      // 处理捕获的错误，包括网络错误等
      console.error("Fetch error:", error);
    });
}

export function searchManagerAuthority(){
  fetch(config.url + "/manager/manageManager/authorities", {
    method: "GET",
    headers: {
      Authorization_U: token,
      "Content-Type": "application/json",
    },
    body: formData.toString(), // Encode the parameters as a string
  })
    .then((response) => response.json())
    .then((responseData) => {
      var code = responseData.code;
      if (code === 200) {
        swal("查詢成功", "", "success");
      }
    })
    .catch((error) => {
      // 处理捕获的错误，包括网络错误等
      console.error("Fetch error:", error);
    });
}
