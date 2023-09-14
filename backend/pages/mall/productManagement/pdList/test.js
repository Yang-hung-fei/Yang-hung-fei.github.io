//包裝預覽圖容器及生成鴻叉叉可以取消上傳
function createImageContainer_preview(pic) {
    // console.log("Creating preview");
    const imageContainer = document.createElement("div");
    imageContainer.classList.add("image-container");
    imageContainer.style.zIndex = '0';
    imageContainer.style.position = 'relative';
    const image = document.createElement("img");
    image.src = "data: image/jpg;base64," + pic.attrPicData;
    image.style.maxWidth = "318.3px"; // 設定預覽圖最大寬度
    image.style.width = "100%";
    image.style.objectFit = "cover;"// 設定圖片裁切
    image.style.position = "relative";
    image.style.marginTop = "5px";
    // const attrPicId = pic.attrPicId;
    // imageContainer.setAttribute("attrPicId", attrPicId);
    // const attrId = pic.attrId;
    // imageContainer.setAttribute("attrId", attrId);

    const closeButton = document.createElement("span");
    closeButton.classList.add("close-button");
    closeButton.innerHTML = `<i class="fa-solid fa-xmark" style="font-size: 30px;color:white; text-shadow:2px 2px 2px black;"></i>`;
    closeButton.style.zIndex = "1";
    closeButton.style.position = "relative";
    closeButton.style.top = "38px";
    closeButton.style.left = "90%";

    closeButton.addEventListener("click", async function () {
        const attrPicId = imageContainer.getAttribute("attrPicId");
        // console.log("deleting attrPicId:" + attrPicId);
        // const delResponse = await fetch(baseURL + 'delAttrPic/' + attrPicId);
        imageContainer.remove();
        attrPicFilesInput.value = '';
    });
    // console.log("attrId:" + attrId + ", attrPicId:" + attrPicId + ", attrPicData" + image.src);
    imageContainer.appendChild(closeButton);
    imageContainer.appendChild(image);

    return imageContainer;
}
