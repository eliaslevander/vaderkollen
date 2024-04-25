//Hämtar element från forecast.html
const searchInput = document.getElementById('search');
const searchButton = document.getElementById('search-btn');
const lastDisplayed = localStorage.getItem('lastDisplayed');

const forecastContainer1 = document.getElementById('searched-city-container-1');

const lista = document.getElementById("lista")
const länkar = document.getElementById("länkar")

lista.addEventListener("click", () => {  /* När hamburgermenyn klickas på så.. */
    länkar.classList.toggle("active") /* ... öppnas och stängs menylistan */
})


//deklarar api nyckeln som en constant
const apiKey = 'c16f3924032646cc966121030233110';

//sätter prognostext till lastDisplayed när sidan först laddas
const forecastText = document.getElementById('forecast-text');
forecastText.querySelector(
    'p'
).textContent = `${lastDisplayed}, 3-dygnsprognos`;

const conditionList = document.getElementById('dropdown-menu-1-fc');

const arrowBoxDown = document.getElementById('arrow-box-down-1');
const arrowDown = document.getElementById('down-arrow-1');
const ulList = document.getElementById('dropdown-list-1');

//funktion för att hämta och visa dagens prognos
const forecastToday = async (apiKey, lastDisplayed) => {
    try {
        const response = await fetch(
            `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${lastDisplayed}&days=3&lang=sv`
        );
        const data = await response.json();
        //hämtar data från api:n och sätter in i <p> taggar
        const condition = data.current.condition.text;
        const temperature = data.current.temp_c;

        const item1 = document.getElementById('item-name-1');
        const item2 = document.getElementById('item-condition-1');
        const item3 = document.getElementById('item-temp-1');

        item2.querySelector('p').textContent = condition;
        item3.querySelector('p').textContent = temperature.toFixed(0) + '°';

        //hämtar data som läggs in i en array och därefter loopas igenom för att skapa en lista
        const temp = data.current.temp_c;
        const feelsLike = data.current.feelslike_c;
        const rain = data.current.precip_mm;
        const gust = data.current.gust_kph / 3.6;
        const windDirection = data.current.wind_dir;
        const cloud = data.current.cloud;
        const uvIndex = data.current.uv;
        const humidity = data.current.humidity;
        const pressure = data.current.pressure_mb;

        const apiArray = [
            `Temperatur: ${temp.toFixed(0)}°`,
            `Temperatur känns som: ${feelsLike.toFixed(0)}°`,
            `Nederbörd ${rain}mm`,
            `Vindhastighet: ${gust.toFixed(1)}m/s`,
            `Vindriktning: ${windDirection}`,
            `Molnighet: ${cloud}`,
            `UV: ${uvIndex}`,
            `Fuktighet: ${humidity}`,
            `Tryck: ${pressure} millibar`
        ];
        ulList.innerHTML = '';
        apiArray.forEach((item) => {
            const liElement = document.createElement('li');
            liElement.textContent = item;
            ulList.appendChild(liElement);
        });

        //Måla ut datan för de resterande timmarna på dygnet i ett table

        const getCurrentHour = new Date();
        let currentHour = getCurrentHour.getHours();

        const hourIndex = data.forecast.forecastday[0].hour;
        //Hämta ut time och splitta strängen. Ta de två första symbolerna och sätt dom som currentHour
        const timeIndex = hourIndex[`${currentHour}`].time;

        const splittedTimeIndex = timeIndex.split(' ');

        const substringTimeIndex = splittedTimeIndex[1].substring(0, 2);

        let singleSubstringTimeIndex = substringTimeIndex;

        if (substringTimeIndex.startsWith('0')) {
            singleSubstringTimeIndex = substringTimeIndex.substring(1);
        }

        let tableContent = document.getElementById('data-output-1');
        let out = '';
        let hourlyData = data.forecast.forecastday[0].hour;

        for (let i = singleSubstringTimeIndex; i < hourlyData.length; i++) {
            let timeToSplit = hourlyData[i].time.split(' ');
            let time = timeToSplit[1];
            out += `
                <tr>
                    <td>${time}</td>
                    <td> <img src="${hourlyData[i].condition.icon}"></td>
                    <td>${hourlyData[i].temp_c.toFixed(0)} &deg;C</td>
                    <td>${hourlyData[i].precip_mm} mm</td>
                    <td>${(hourlyData[i].gust_kph / 3.6).toFixed(1)}</td>
                </tr>
            `;
        }
        tableContent.innerHTML = out;
    } catch (error) {
        console.error('An error occurred:', error);
    }
    try {
        const response1 = await fetch(
            `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${lastDisplayed}&days=3&lang=sv`
        );
        //hämtar ut mer data från api:n och en bild och sätter in dem längre in dem under listan
        const data1 = await response1.json();
        const date = data1.forecast.forecastday[0].date;
        const tempHigh = data1.forecast.forecastday[0].day.maxtemp_c;
        const tempLow = data1.forecast.forecastday[0].day.mintemp_c;
        const rainChance =
            data1.forecast.forecastday[0].day.daily_chance_of_rain;
        const dailyIcon = data1.forecast.forecastday[0].day.condition.icon;
        const location = data1.location.name;

        const item1 = document.getElementById('item-name-1');
        const item4 = document.getElementById('item-date-1');
        const item5 = document.getElementById('item-temp_high_low-1');
        const item6 = document.getElementById('item-rain-1');
        const dailyIMG = document.getElementById('dailyIMG-1');

        dailyIMG.src = dailyIcon;
        item5.querySelector(':nth-child(1)').textContent =
            'H: ' + tempHigh.toFixed(0) + '°';
        item5.querySelector(':nth-child(2)').textContent =
            'L: ' + tempLow.toFixed(0) + '°';
        item6.querySelector('p').textContent = rainChance + '%';

        //använder date nyckeln i api:n och formaterar om datumet så det blir utskrivet i text
        const formattedDate = new Date(date);

        const month = formattedDate.toLocaleString('default', {
            month: 'short'
        });
        const day = formattedDate.getDate();

        item1.querySelector('p').textContent = `Idag, ${month} ${day}`;
        item4.querySelector('p').textContent = `Idag, ${month} ${day}`;
    } catch (error) {
        console.error('An error occurred:', error);
    }
    //click funktion för att öpnna upp dagens prognos container
    forecastContainer1.addEventListener('click', () => {
        if (
            conditionList.style.display === 'none' ||
            conditionList.style.display === ''
        ) {
            conditionList.style.display = 'block';
            arrowBoxDown.style.display = 'none';
        } else {
            conditionList.style.display = 'none';
            arrowBoxDown.style.display = 'block';
            arrowDown.style.display = 'block';
            arrowDown.style.margin = '0 auto';
        }
    });
};

forecastToday(apiKey, lastDisplayed);

//hämtar element för morgondagens progons container
const forecastContainer2 = document.getElementById('searched-city-container-2');

const conditionList2 = document.getElementById('dropdown-menu-2');

const arrowBoxDown2 = document.getElementById('arrow-box-down-2');
const arrowDown2 = document.getElementById('down-arrow-2');

//funktion för att hämta och visa morgondagens prognos
const forecastTomorrow = async (apiKey, lastDisplayed) => {
    try {
        const response = await fetch(
            `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${lastDisplayed}&days=3&lang=sv`
        );
        //hämtar data för imorgon från api:n och lägger in dem i containern
        const data = await response.json();
        const date = data.forecast.forecastday[1].date;
        const tempHigh = data.forecast.forecastday[1].day.maxtemp_c;
        const tempLow = data.forecast.forecastday[1].day.mintemp_c;
        const rainChance =
            data.forecast.forecastday[1].day.daily_chance_of_rain;
        const dailyIcon = data.forecast.forecastday[1].day.condition.icon;
        const condition = data.forecast.forecastday[1].day.condition.text;
        const temp = data.forecast.forecastday[1].day.avgtemp_c;

        const item1 = document.getElementById('item-name-2');
        const item2 = document.getElementById('item-condition-2');
        const item3 = document.getElementById('item-temp-2');
        const item5 = document.getElementById('item-temp_high_low-2');
        const item6 = document.getElementById('item-rain-2');
        const dailyIMG = document.getElementById('dailyIMG-2');

        item2.querySelector('p').textContent = condition;
        item3.querySelector('p').textContent = `${temp.toFixed(0)}°`;

        dailyIMG.src = dailyIcon;
        item5.querySelector(':nth-child(1)').textContent =
            'H: ' + tempHigh.toFixed(0) + '°';
        item5.querySelector(':nth-child(2)').textContent =
            'L: ' + tempLow.toFixed(0) + '°';
        item6.querySelector('p').textContent = rainChance + '%';

        //formaterar datum igen till textform
        const formattedDate = new Date(date);

        const month = formattedDate.toLocaleString('default', {
            month: 'short'
        });
        const day = formattedDate.getDate();

        item1.querySelector('p').textContent = `Imorgon, ${month} ${day}`;

        //loopar igenom morgondagens timmar och lägger ut dem i en tabell
        let tableContent = document.getElementById('data-output-2');
        let out = '';
        let hourlyData = data.forecast.forecastday[1].hour;

        for (let i = 0; i < 24; i++) {
            let timeToSplit = hourlyData[i].time.split(' ');
            let time = timeToSplit[1];
            out += `
                <tr>
                    <td>${time}</td>
                    <td> <img src="${hourlyData[i].condition.icon}"></td>
                    <td>${hourlyData[i].temp_c.toFixed(0)} &deg;C</td>
                    <td>${hourlyData[i].precip_mm} mm</td>
                    <td>${(hourlyData[i].gust_kph / 3.6).toFixed(1)}</td>
                </tr>
            `;
        }
        tableContent.innerHTML = out;

        //click funktion för att öppna upp morgondagens prognos container
        forecastContainer2.addEventListener('click', () => {
            if (
                conditionList2.style.display === 'none' ||
                conditionList2.style.display === ''
            ) {
                conditionList2.style.display = 'block';
                arrowBoxDown2.style.display = 'none';
            } else {
                conditionList2.style.display = 'none';
                arrowBoxDown2.style.display = 'block';
                arrowDown2.style.display = 'block';
                arrowDown2.style.margin = '0 auto';
            }
        });
    } catch (error) {
        console.error('An error occurred:', error);
    }
};

forecastTomorrow(apiKey, lastDisplayed);

//hämtar element för dagen efter imorgons prognos container
const forecastContainer3 = document.getElementById('searched-city-container-3');

const conditionList3 = document.getElementById('dropdown-menu-3');

const arrowBoxDown3 = document.getElementById('arrow-box-down-3');
const arrowDown3 = document.getElementById('down-arrow-3');

//funktion för att hämta och visa dagen efter imorgons prognos
const forecastDayAfterTomorrow = async (apiKey, lastDisplayed) => {
    try {
        const response = await fetch(
            `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${lastDisplayed}&days=3&lang=sv`
        );
        const data = await response.json();
        //hämtar data för dagen efter imorgon från api:n och lägger in i prognos containern
        const date = data.forecast.forecastday[2].date;
        const tempHigh = data.forecast.forecastday[2].day.maxtemp_c;
        const tempLow = data.forecast.forecastday[2].day.mintemp_c;
        const rainChance =
            data.forecast.forecastday[2].day.daily_chance_of_rain;
        const dailyIcon = data.forecast.forecastday[2].day.condition.icon;
        const condition = data.forecast.forecastday[2].day.condition.text;
        const temp = data.forecast.forecastday[2].day.avgtemp_c;

        const item1 = document.getElementById('item-name-3');
        const item2 = document.getElementById('item-condition-3');
        const item3 = document.getElementById('item-temp-3');
        const item5 = document.getElementById('item-temp_high_low-3');
        const item6 = document.getElementById('item-rain-3');
        const dailyIMG = document.getElementById('dailyIMG-3');

        item2.querySelector('p').textContent = condition;
        item3.querySelector('p').textContent = `${temp.toFixed(0)}°`;

        dailyIMG.src = dailyIcon;
        item5.querySelector(':nth-child(1)').textContent =
            'H: ' + tempHigh.toFixed(0) + '°';
        item5.querySelector(':nth-child(2)').textContent =
            'L: ' + tempLow.toFixed(0) + '°';
        item6.querySelector('p').textContent = rainChance + '%';

        //formaterar datum till textform och lägger till veckodagen
        const formattedDate = new Date(date);

        const dayOfWeek = formattedDate.toLocaleString('default', {
            weekday: 'long'
        });
        const month = formattedDate.toLocaleString('default', {
            month: 'short'
        });
        const day = formattedDate.getDate();

        item1.querySelector('p').textContent = `${dayOfWeek}, ${month} ${day}`;

        //loopar igenom timmarna och lägger in dem i en tabell
        let tableContent = document.getElementById('data-output-3');
        let out = '';
        let hourlyData = data.forecast.forecastday[2].hour;

        for (let i = 0; i < 24; i++) {
            let timeToSplit = hourlyData[i].time.split(' ');
            let time = timeToSplit[1];
            out += `
                <tr>
                    <td>${time}</td>
                    <td> <img src="${hourlyData[i].condition.icon}"></td>
                    <td>${hourlyData[i].temp_c.toFixed(0)} &deg;C</td>
                    <td>${hourlyData[i].precip_mm} mm</td>
                    <td>${(hourlyData[i].gust_kph / 3.6).toFixed(1)}</td>
                </tr>
            `;
        }
        tableContent.innerHTML = out;

        //click funktion för att öppna upp den sista prognos containern
        forecastContainer3.addEventListener('click', () => {
            if (
                conditionList3.style.display === 'none' ||
                conditionList3.style.display === ''
            ) {
                conditionList3.style.display = 'block';
                arrowBoxDown3.style.display = 'none';
            } else {
                conditionList3.style.display = 'none';
                arrowBoxDown3.style.display = 'block';
                arrowDown3.style.display = 'block';
                arrowDown3.style.margin = '0 auto';
            }
        });
    } catch (error) {
        console.error('An error occurred:', error);
    }
};

forecastDayAfterTomorrow(apiKey, lastDisplayed);

//click eventlistener för sökknappen som uppdaterar prognostexten och alla prognos
//containers utifrån det användaren skriver in
searchButton.addEventListener('click', async () => {
    let userInput =
        searchInput.value.charAt(0).toUpperCase().trim() +
        searchInput.value.slice(1);

    if (userInput) {
        searchInput.value = '';
        forecastText.querySelector(
            'p'
        ).textContent = `${userInput}, 3-dygnsprognos`;
        forecastToday(apiKey, userInput);
        forecastTomorrow(apiKey, userInput);
        forecastDayAfterTomorrow(apiKey, userInput);

        localStorage.setItem('lastDisplayed', userInput);
    } else {
        searchInput.value = '';
        console.log('Please enter a location.');
    }
    forecastToday(apiKey, lastDisplayed);
    forecastTomorrow(apiKey, lastDisplayed);
    forecastDayAfterTomorrow(apiKey, lastDisplayed);
});

//search eventlistener för sökfältet som uppdaterar prognostexten och alla prognos
//containers utifrån det användaren skrivit in när den klickar på enter
searchInput.addEventListener('search', async () => {
    let userInput =
        searchInput.value.charAt(0).toUpperCase().trim() +
        searchInput.value.slice(1);

    if (userInput) {
        searchInput.value = '';
        forecastText.querySelector(
            'p'
        ).textContent = `${userInput}, 3-dygnsprognos`;
        forecastToday(apiKey, userInput);
        forecastTomorrow(apiKey, userInput);
        forecastDayAfterTomorrow(apiKey, userInput);

        localStorage.setItem('lastDisplayed', userInput);
    } else {
        searchInput.value = '';
        console.log('Please enter a location.');
    }

    forecastToday(apiKey, lastDisplayed);
    forecastTomorrow(apiKey, lastDisplayed);
    forecastDayAfterTomorrow(apiKey, lastDisplayed);
});
