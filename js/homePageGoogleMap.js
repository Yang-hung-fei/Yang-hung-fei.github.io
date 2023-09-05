import config from "/ipconfig.js";
let url = config.url;
let directionsService1, directionsService2, directionsService3;
let directionsRenderer1, directionsRenderer2, directionsRenderer3;
let location = ["貓職人", "寵孩子", "寵物樂園"]
fetch(url + '/customer/homePage/mapApiKey')
    .then(response => response.json())
    .then(data => {
        if (data.code != 200) {
            alert("找不到");
        }
        const apiKey = data.message;
        appendMapScript(apiKey);

    })
    .catch(error => {
        console.error('Failed to fetch API key:', error);
    });

function appendMapScript(apiKey) {
    // 加载Google Maps API并指定API密钥
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places,drawing,geometry&v=3&callback`;
    document.body.appendChild(script);
    // 使用事件監聽器等待腳本加載完成
    script.addEventListener('load', () => {
        initMap_1(); // 此處調用 initMap 函數
        initMap_2();
        initMap_3();
    });

}

//map 1
$("#navBtn1").on("click", (event) => {
    if (directionsService1 == null || directionsRenderer1 == null)
        return;
    var buttonText = $(event.target).text();
    if (buttonText === "導航") {
        updateMap_1();
        $(event.target).text("切換");
    } else {
        $(event.target).text("導航");
        initMap_1();
    }


})

function initMap_1() {
    const map = new google.maps.Map(document.getElementById('map1'), {
        zoom: 15, // 初始縮放級別
    });

    // 初始化方向服務和方向渲染器
    directionsService1 = new google.maps.DirectionsService();
    directionsRenderer1 = new google.maps.DirectionsRenderer();
    directionsRenderer1.setMap(map);

    // 使用地理編碼服務查找地點名稱的經緯度座標
    const geocoder = new google.maps.Geocoder();
    const locationName = location[0]; // 想要查找的地點名稱

    geocoder.geocode({ address: locationName }, (results, status) => {
        if (status === 'OK' && results[0]) {
            // 獲取第一個結果的經緯度座標
            const location = results[0].geometry.location;

            // 設定地圖的中心為該座標
            map.setCenter(location);

            // 在地圖上添加標記，您可以選擇性地添加標記以表示該地點
            const marker = new google.maps.Marker({
                position: location,
                map: map,
                title: locationName,
            });
        } else {
            console.error('無法查找地點名稱：', status);
        }
    });
}

function updateMap_1() {
    // 獲取使用者的當前位置（這需要用戶授權）
    navigator.geolocation.getCurrentPosition((position) => {
        const userLocation = new google.maps.LatLng(
            position.coords.latitude,
            position.coords.longitude
        );

        // 計算路線
        const request = {
            origin: userLocation,
            destination: location[0], // 目的地是地圖中心
            travelMode: google.maps.TravelMode.DRIVING, // 您可以更改導航模式
        };

        directionsService1.route(request, (result, status) => {
            if (status === 'OK') {
                directionsRenderer1.setDirections(result);
            } else {
                console.error('無法計算路線：', status);
            }
        });
    });
}

//map 2

$("#navBtn2").on("click", (event) => {
    if (directionsService2 == null || directionsRenderer2 == null)
        return;
    var buttonText = $(event.target).text();
    if (buttonText === "導航") {
        updateMap_2();
        $(event.target).text("切換");
    } else {
        $(event.target).text("導航");
        initMap_2();
    }
})

function initMap_2() {
    const map = new google.maps.Map(document.getElementById('map2'), {
        zoom: 15, // 初始縮放級別
    });

    // 初始化方向服務和方向渲染器
    directionsService2 = new google.maps.DirectionsService();
    directionsRenderer2 = new google.maps.DirectionsRenderer();
    directionsRenderer2.setMap(map);

    // 使用地理編碼服務查找地點名稱的經緯度座標
    const geocoder = new google.maps.Geocoder();
    const locationName = location[1]; // 想要查找的地點名稱

    geocoder.geocode({ address: locationName }, (results, status) => {
        if (status === 'OK' && results[0]) {
            // 獲取第一個結果的經緯度座標
            const location = results[0].geometry.location;

            // 設定地圖的中心為該座標
            map.setCenter(location);

            // 在地圖上添加標記，您可以選擇性地添加標記以表示該地點
            const marker = new google.maps.Marker({
                position: location,
                map: map,
                title: locationName,
            });
        } else {
            console.error('無法查找地點名稱：', status);
        }
    });
}

function updateMap_2() {
    // 獲取使用者的當前位置（這需要用戶授權）
    navigator.geolocation.getCurrentPosition((position) => {
        const userLocation = new google.maps.LatLng(
            position.coords.latitude,
            position.coords.longitude
        );

        // 計算路線
        const request = {
            origin: userLocation,
            destination: location[1], // 目的地是地圖中心
            travelMode: google.maps.TravelMode.DRIVING, // 您可以更改導航模式
        };

        directionsService2.route(request, (result, status) => {
            if (status === 'OK') {
                directionsRenderer2.setDirections(result);
            } else {
                console.error('無法計算路線：', status);
            }
        });
    });
}


//map 3

$("#navBtn3").on("click", (event) => {
    if (directionsService3 == null || directionsRenderer3 == null)
        return;

    var buttonText = $(event.target).text();
    if (buttonText === "導航") {
        updateMap_3();
        $(event.target).text("切換");
    } else {
        $(event.target).text("導航");
        initMap_3();
    }
})

function initMap_3() {
    const map = new google.maps.Map(document.getElementById('map3'), {
        zoom: 15, // 初始縮放級別
    });

    // 初始化方向服務和方向渲染器
    directionsService3 = new google.maps.DirectionsService();
    directionsRenderer3 = new google.maps.DirectionsRenderer();
    directionsRenderer3.setMap(map);

    // 使用地理編碼服務查找地點名稱的經緯度座標
    const geocoder = new google.maps.Geocoder();
    const locationName = location[2]; // 想要查找的地點名稱

    geocoder.geocode({ address: locationName }, (results, status) => {
        if (status === 'OK' && results[0]) {
            // 獲取第一個結果的經緯度座標
            const location = results[0].geometry.location;

            // 設定地圖的中心為該座標
            map.setCenter(location);

            // 在地圖上添加標記，您可以選擇性地添加標記以表示該地點
            const marker = new google.maps.Marker({
                position: location,
                map: map,
                title: locationName,
            });
        } else {
            console.error('無法查找地點名稱：', status);
        }
    });
}

function updateMap_3() {
    // 獲取使用者的當前位置（這需要用戶授權）
    navigator.geolocation.getCurrentPosition((position) => {
        const userLocation = new google.maps.LatLng(
            position.coords.latitude,
            position.coords.longitude
        );

        // 計算路線
        const request = {
            origin: userLocation,
            destination: location[2], // 目的地是地圖中心
            travelMode: google.maps.TravelMode.DRIVING, // 您可以更改導航模式
        };

        directionsService3.route(request, (result, status) => {
            if (status === 'OK') {
                directionsRenderer3.setDirections(result);
            } else {
                console.error('無法計算路線：', status);
            }
        });
    });
}