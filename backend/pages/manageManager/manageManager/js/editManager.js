import config from "/ipconfig";

export function editManagerData() {
  getEditedManagerData();

  fetch(config.url + "/manager/manageManager", {
    method: "PUT",
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
        swal("修改成功", "", "success");
      }
    })
    .catch((error) => {
      // 处理捕获的错误，包括网络错误等
      console.error("Fetch error:", error);
    });
}

function getEditedManagerData() {
  const managerAccount = "";
  const managerId = "";
  const managerPassword = "";
  const managerState = "";
  const orgManagerAccount = "";

  let setedManagerProfil;
}

export function editManagerAuthorities() {
  geteEitManagerAuthoriies();

  fetch(config.url + "/manager/manageManager/authorities", {
    method: "PUT",
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
        swal("修改成功", "", "success");
      }
    })
    .catch((error) => {
      // 处理捕获的错误，包括网络错误等
      console.error("Fetch error:", error);
    });
}

function geteEitManagerAuthoriies() {
  const account = "";
  const authories = "";

  let setedManagerAuthoriies;
}

function searchManagerAuthority() {
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
