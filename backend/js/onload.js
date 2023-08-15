import domain from '../../ipconfig.js';
document.addEventListener("DOMContentLoaded", function () {
    const token = localStorage.getItem("token");

    if (token) {
        axios.get(`${domain.url}/manager/profile`, {
            headers: {
                "Authorization_M": + token
            }
        })
            .then(response => {
                if (response.status !== 200) {
                    console.error("Token validation failed:", response.statusText);
                    // window.location.href = "./pages/login.html";
                } else {
                    axios.get(`${domain.url}/manager/authorities`)
                        .then(response => {
                            const managerAccount = response.data.message.managerAccount;
                            showName();

                            const managerAuthoritiesList = response.data.message.managerAuthoritiesList;
                            loadMenuAndContent();
                            aliveLink();

                            console.log(managerAuthoritiesList); // 或者你可以對這個數據進行其他處理
                        })
                        .catch(error => {
                            console.error('Error:', error);
                        });
                }
            })
            .catch(error => {
                console.error("Axios error:", error);
            });
    } else {
        // window.location.href = "./pages/login.html";
    }

    function showName() {

    }

    function loadMenuAndContent() {
        //後台管理 & 會員管理


        //其他
        const menuList = document.getElementById("sidebar-nav");
        const functionMenusData = currentUserMenu.menu;
        functionMenusData.forEach(roleMenu => {
            const functionMenu = roleMenu.menu;

            if (functionMenu.length > 0) {
                const submenuUl = document.createElement("ul");

                functionMenu.forEach(menuItem => {
                    const li = document.createElement("li");
                    const a = document.createElement("a");
                    a.className = "sidebar-link function-link";
                    a.href = menuItem.link;

                    const svg = document.createElement("svg");
                    svg.className = "feather " + menuItem.icon;
                    svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
                    svg.setAttribute("viewBox", "0 0 512 512");
                    svg.setAttribute("fill", "currentcolor");
                    svg.setAttribute("stroke", "none");
                    svg.setAttribute("stroke-width", "2");
                    svg.setAttribute("stroke-linecap", "round");
                    svg.setAttribute("stroke-linejoin", "round");

                    const path = document.createElement("path");
                    path.setAttribute("d", menuItem.iconPath);
                    svg.appendChild(path);

                    a.appendChild(svg);

                    const span = document.createElement("span");
                    span.className = "align-middle";
                    span.textContent = menuItem.title;
                    a.appendChild(span);

                    li.appendChild(a);
                    submenuUl.appendChild(li);
                });

                menuList.appendChild(submenuUl);
            }
        });
    }

    //根據當前網址 alive link
    function aliveLink() {

    }

});