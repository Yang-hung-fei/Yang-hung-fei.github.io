import config from "/ipconfig.js";

$(window).on("load", () => {
  getData();

  try {
    const response = fetch(config.url + "/manager/users", {
      method: "GET",
      headers: {
        Authorization_M: token,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    if (response.status === 200) {
      const data = response.json();
      console.log(data);
      return data;
    } else {
      console.error("Error fetching form:", response.statusText);
      return null;
    }
  } catch (error) {
    console.error("Error fetching form:", error);
    return null;
  }
});

function getData() {
    orderBy
    page
    search
    size
    sort

  let data = {};
}
