import config from "../../../../ipconfig";

export function addManager() {
  getNewManagerProfile();

  fetch(config.url + "/manager/manageManager", {
    method: "POST",
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
        swal("新增成功", "", "success");
      }
    })
    .catch((error) => {
      // 处理捕获的错误，包括网络错误等
      console.error("Fetch error:", error);
    });
}

function getNewManagerProfile() {
    const newManagerAccount;
    const newManagerPassword;

    let newManagerProfile;
}
