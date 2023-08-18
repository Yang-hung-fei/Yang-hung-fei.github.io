document.addEventListener("DOMContentLoaded", function () {
    // 第一層選單
    fetch('https://raw.githubusercontent.com/donma/TaiwanAddressCityAreaRoadChineseEnglishJSON/master/CityCountyData.json')
        .then(response => response.json())
        .then(data => {
            const citySelect = document.getElementById('city');
            for (const key in data) {
                if (data.hasOwnProperty(key)) {
                    const option = document.createElement('option');
                    option.value = key;
                    option.textContent = data[key].CityName;
                    citySelect.appendChild(option);
                }
            }
        })
        .catch(error => {
            alert("fail");
        });


    //第二層選擇
    $('#city').change(function () {
        const cityvalue = this.value;
        const areaSelect = document.getElementById('area');
        areaSelect.innerHTML = '';
        areaSelect.style.display = 'inline';

        fetch('https://raw.githubusercontent.com/donma/TaiwanAddressCityAreaRoadChineseEnglishJSON/master/CityCountyData.json')
            .then(response => response.json())
            .then(data => {
                const eachval = data[cityvalue].AreaList; // 鄉鎮
                for (const key in eachval) {
                    if (eachval.hasOwnProperty(key)) {
                        const option = document.createElement('option');
                        option.value = key;
                        option.textContent = eachval[key].AreaName;
                        areaSelect.appendChild(option);
                    }
                }
            })
            .catch(error => {
                alert("fail");
            });
    });

});
