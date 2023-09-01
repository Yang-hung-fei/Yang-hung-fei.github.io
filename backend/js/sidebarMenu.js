export function creatSidebarListMenu(roles, roleMenu) {
    console.log(roleMenu);
    const menuList = document.getElementById("authorities");
    roleMenu.forEach(roleMenu => {
        const functionMenu = roleItem.menuItems; // Assuming your role item has a property called "menuItems"
        functionMenu.id = roles.divId;
        
        const submenuUl = document.createElement("ul");

        roleMenu.forEach(menuItem => {
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
    });
}

