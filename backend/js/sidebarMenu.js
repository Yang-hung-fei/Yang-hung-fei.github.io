export function createSidebarListMenu(menuData) {
  // 找到現有的 <ul class="sidebar-nav"> 元素
  const existingSidebarNav = document.querySelector(".sidebar-nav");

  // 創建新的 <ul> 元素
  const newUl = document.createElement("ul");

  // 將 menuData 數據轉換成 HTML 字符串
  const menuItemsHtml = menuData
    .map((item) => {
      if (item.header) {
        // 如果是 header，則創建一個帶有 "header" class 的 <li> 元素
        return `<li class="sidebar-header">${item.text}</li>`;
      } else {
        // 否則創建一個帶有超鏈接和 SVG 圖標的 <li> 元素
        return `
  <li class="sidebar-item" id="${item.id}">
    <a class="sidebar-link function-link" href="${item.link}">
      <svg class="feather feather-map align-middle"  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentcolor" stroke="none" storke-width="2" storke-linecap="round" storke-linejoin="round"><!--! Font Awesome Free 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. -->><path d="${item.svgPath}"/></svg>
      <sapn class="align-middle">${item.text}</span>
    </a>
  </li>
`;
      }
    })
    .join(""); // 轉換為字符串

  // 將 menuItemsHtml 添加到新的 <ul> 元素中
  newUl.innerHTML = menuItemsHtml;

  // 將新的 <ul> 元素插入到現有的 <ul class="sidebar-nav"> 中
  existingSidebarNav.appendChild(newUl);
}

