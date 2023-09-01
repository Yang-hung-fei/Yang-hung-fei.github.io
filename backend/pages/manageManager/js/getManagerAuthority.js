import config from "/ipconfig.js";

export function getManagerAuthority(token) {
    fetch(config.url + "/manager/authorities", {
      method: "GET",
      headers: {
        Authorization_M: token, // 在標頭中帶入 Token
        "Content-Type": "application/x-www-form-urlencoded", // 如果需要，指定內容類型
      },
    })
      .then((response) => response.json())
      .then((res) => {
        console.log(res);
        if (res.code === 200) return res.message.managerAuthoritiesList;
      })
      .catch((error) => {
        console.error("Error fetching form:", error);
      });
    return false;
  }