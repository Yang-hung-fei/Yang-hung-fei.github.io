import config from "/ipconfig.js";

export async function getManagerSelfAuthority(token) {
  try {
    const response = await fetch(config.url + "/manager/authorities", {
      method: "GET",
      headers: {
        Authorization_M: token,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    if (response.status === 200) {
      const data = await response.json();
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
}
