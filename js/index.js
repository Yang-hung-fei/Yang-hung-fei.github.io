import config from '../ipconfig.js';

const hostUrl = config.url;
const homepageUrl = "/customer/homePage";

// ------------------------- 頁面載入  ------------------------- //
window.addEventListener('DOMContentLoaded', async function () {
    getNews();
    let data = await getRotePic();
    await createRotePic(data);
    await getHomepageNewsPic();

});




// ------------------------- 建立data table  ------------------------- //
// 更新資料表格和分頁
function createDataTable(data) {
    // // 選擇分頁元素
    // let table = document.querySelector("#table");
    let tbody = document.getElementById("dataTableList");

    // 清空tbody表格
    tbody.innerHTML = "";
    let dataList = '';
    let fetchData = data;



    // 建立資料表格
    fetchData.forEach(dataDetails => {
        //    console.log(dataDetails.newsNo);
        // 建立資料
        dataList += `
        <tr>
        <td><a href="./frontend/pages/homepage/homepageNewsCont.html?newsNo=${dataDetails.newsNo}" type="button" class="getOneNews" style="outline:none; border:none; background: transparent;">${dataDetails.newsTitle}</a></td>
        <td>${dataDetails.updateTime}</td>
        </tr>
         `;

    });

    //  console.log(dataList);
    tbody.innerHTML = dataList;


}

// ------------------------- 建立輪播圖 ------------------------- //

async function createRotePic(data) {
    let onList = await data;
    console.log(onList);
    let dataList = '';
    let firstPic = onList.shift();
    console.log(firstPic);

    let carouselList = document.getElementById("carouselList");

    // 清空tbody表格
    carouselList.innerHTML = "";

    // carousel active只能有一個，放第一張
    dataList += `<div class="carousel-item  active">
    <img class="w-100" src="data:image/*;base64,${firstPic.pic}" alt="Image">
    <div class="carousel-caption">
      <div class="container">
        <div class="row justify-content-start">
          <div class="col-lg-7">
            <h1 class="display-2 mb-5 animated slideInDown;">A lovely paradise</h1>
            <a href="${firstPic.picLocateUrl}" class="btn btn-primary rounded-pill py-sm-3 px-sm-5">Products</a>
            <a href="/frontend/pages/homepage/about.html" class="btn btn-secondary rounded-pill py-sm-3 px-sm-5 ms-3">Services</a>
          </div>
        </div>
      </div>
    </div>
    </div>`

    //放除了第一張以外的其他張carousel
    onList.forEach(dataDetails => {
        dataList += `
        <div class="carousel-item ">
        <img class="w-100" src="data:image/*;base64,${dataDetails.pic}" alt="Image">
        <div class="carousel-caption">
          <div class="container">
            <div class="row justify-content-start">
              <div class="col-lg-7">
                <h1 class="display-2 mb-5 animated slideInDown;">A lovely paradise</h1>
                <a href="`+ dataDetails.picLocateUrl + `" class="btn btn-primary rounded-pill py-sm-3 px-sm-5" style="z-index: 999">Products</a>
                <a href="/frontend/pages/homepage/about.html" class="btn btn-secondary rounded-pill py-sm-3 px-sm-5 ms-3">Services</a>
              </div>
            </div>
          </div>
        </div>
      </div>    
        `;

    });
    carouselList.innerHTML = dataList;

}

// =====================最新消息圖片清單=====================

async function createHomepageNewsPic(data) {
    let homepageNewsPicList = await data.message;
    console.log(homepageNewsPicList);
    let dataList = '';

    let homepageNewsPic = document.querySelector(".homepageNewsPic");

    // 清空表格
    homepageNewsPic.innerHTML = "";

    homepageNewsPicList.forEach(dataDetails => {
        dataList += `
        <div class="col-lg-4 col-md-6 wow fadeInUp" data-wow-delay="0.1s">
            <div class="bg-white text-center h-100 p-4 p-xl-5">
              <div class="image-container">
                <img class="img-fluid mb-4" src="data:image/*;base64,${dataDetails.pic}" alt="">
              </div>
              <h4 class="mb-3">${dataDetails.newsTitle}</h4>
              <a class="btn btn-outline-primary border-2 py-2 px-4 rounded-pill" href="./frontend/pages/homepage/homepageNewsCont.html?newsNo=${dataDetails.newsNo}">Read More</a>
              
            </div>
        </div>
        `;

        //<td><a href="./frontend/pages/homepage/homepageNewsCont.html?newsNo=${dataDetails.newsNo}" type="button" class="getOneNews" style="outline:none; border:none; background: transparent;">${dataDetails.newsTitle}</a></td>
        

    });
    homepageNewsPic.innerHTML = dataList;



}



async function getNews() {
    return fetch(hostUrl + homepageUrl + "/getAllNews", {
        method: "GET",
        headers: {
      
            "Content-Type": "application/json"
        },
    })
        .then(res => {
            return res.json();
        }).then(data => {
            //     console.log(data.message);
            let dataList = [];
            let dataMes = data.message;
            let dataLength = 5;
            dataMes.forEach((e) => {
                if (e.newsStatus === 1 && dataList.length < dataLength) {
                    dataList.push(e);
                }
            });
            return dataList;
        }).then(data => {
            createDataTable(data);
        }).catch(err => {
            console.error(err.message);
        });;
}

// choose所有带有 getOneNews 的button
// const buttons = document.querySelectorAll('.getOneNews');

// buttons.forEach(button => {
//     button.addEventListener('click', function () {
//         // get按钮的 data-href 屬性，即 URL
//         const newsNo = button.getAttribute('data-id');

//         // click的時候重新導向URL
//         window.location.href = `newspage.html?newsNo=${newsNo}`;
//     });


// });

async function getRotePic() {
    return fetch(hostUrl + homepageUrl + "/getRotePic", {
        method: "GET",
        headers: {
          
            "Content-Type": "application/json"
        },
    })
        .then(res => {
            return res.json();
        }).then(data => {

            console.log(data);
            //0 下架 1 上架
            let dataList = data.message;
            //上架清單
            let onList = [];
            let dataLength = 10;
            dataList.forEach((e) => {
                if (e.picRotStatus === 1 && onList.length <= dataLength) {
                    onList.push(e);
                }
            });
            return onList;
        }).catch(err => {
            console.error(err.message);
        });;

}


async function getHomepageNewsPic() {
    return fetch(hostUrl + homepageUrl + "/getHomepageNewsPic", {
        method: "GET",
        headers: {
      
            "Content-Type": "application/json"
        },
    })
        .then(res => {
            return res.json();
        }).then(data => {
            console.log(data);
            createHomepageNewsPic(data);
            return data;
        }).catch(err => {
            console.error(err.message);
        });;
}


