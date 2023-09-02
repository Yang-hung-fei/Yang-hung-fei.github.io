import config from "/ipconfig.js";

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
  const newManagerAccount = "";
  const newManagerPassword = "";

  let newManagerProfile;
}

function creatNewManager() {
  swal({
    text: '新增管理員',
    content: "input",
    button: {
      text: "Search!",
      closeModal: false,
    },
  })
    .then((name) => {
      if (!name) throw null;

      return fetch(`https://itunes.apple.com/search?term=${name}&entity=movie`);
    })
    .then((results) => {
      return results.json();
    })
    .then((json) => {
      const movie = json.results[0];

      if (!movie) {
        return swal("No movie was found!");
      }
      swal("新增成功", "", "success");
    })
    .catch((err) => {
      if (err) {
        swal("新增失敗", "", "error");
      } else {
        swal.stopLoading();
        swal.close();
      }
    });
}

