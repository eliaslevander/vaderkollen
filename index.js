/* Innehåll */

/*
1. Funktion som hämtar användarens nuvarande position

2. Funktion för att söka på städer

3. Funktion som hämtar staden som användaren har angivit som hemort

4. Funktion som hämtar alla favoriter och mappar ut dom i nya containers under favoriter

5. Möjlig lösning på problemet gällande favoriter vid reload (WIP)

6. Funktion som möjliggör öppning/stängning av containers i favoritlistan

7. Funktion som byter ut bakgrunden på hero vid visning av stad

8. Funktion som byter färg och ändrar text på knappen "Ange som hemort"

9. Funktion som återställer färg och ändrar text på knappen "Ange som hemort"

10. Funktion som anger hemstad

11. Funktion som stylear knappen "Visa nuvarande position"

12. Funktion som återställer knappen "Visa nuvarande position"

13. Funktion som stylear knappen "Lägg till favoriter"

14. Funktion som återställer knappen "Lägg till favoriter"

*/

const heroCity = document.getElementById("hero-city");
const heroConditionText = document.getElementById("hero-condition-text");
const heroConditionIcon = document.getElementById("hero-condition-icon");
const heroUv = document.getElementById("hero-uv-index-text");
const heroHumidityText = document.getElementById("hero-humidity-text");
const heroTemp = document.getElementById("hero-temp");
const heroFeelsLike = document.getElementById("hero-feelslike");
const container1 = document.getElementById("searched-city-container");
const favouritesList = document.getElementById("favourites-list");
const newFavouritesList = document.getElementById("new-favourites-list")
const warningBanner = document.querySelector('#warning')
const forecastLink = document.getElementById("current-city-forecast")

const currentPosButton = document.getElementById("view-current-pos");

const lastDisplayed = localStorage.getItem("lastDisplayed");

currentPosButton.addEventListener("click", getCurrentLocation);

//Rensa sökfältet vid klick på "Visa nuvarande position"
currentPosButton.addEventListener("click", () => {
  searchInput.value = "";
});

// 1. Funktion som hämtar användarens nuvarande position

async function getCurrentLocation() {

  try {
  // Hämta användarens nuvarande position
  const position = await new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });

  const latitude = position.coords.latitude;
  const longitude = position.coords.longitude;
  const currentPosition = `${latitude},${longitude}`;
  const response = await fetch(
    `https://api.weatherapi.com/v1/forecast.json?key=c16f3924032646cc966121030233110&q=${currentPosition}&lang=sv`
  );
  const data = await response.json();

  //lastDisplayed används som ett värde för vilken stad som visas just nu. Detta är viktigt
  //för att andra funktioner ska fungera

  const lastDisplayed = data.location.name;
  localStorage.setItem("lastDisplayed", lastDisplayed);

  //Används för styleing av visa nuvarande position knappen
  const currentPosString = data.location.name;
  localStorage.setItem("currentPosString", currentPosString);

  //Färgge eller återställ hemortsknapp beroende på om staden som visas
  //är den samma som ärt satt som homeCity i localStorage
  if (lastDisplayed === localStorage.getItem("homeCity")) {
    styleHomeBtn();
  } else {
    clearHomeBtn();
  }

  //Stadens namn
  const name = data.location.name;
  //Ändra font size beroende på strängens längd

  if (name.length > 20) {
    fontSize = "1"
    heroCity.innerHTML = `<p style="font-size: ${fontSize}rem;">${name}</p>`;
  } else if (name.length > 12) {
    fontSize = "1.2"
    heroCity.innerHTML = `<p style="font-size: ${fontSize}rem;">${name}</p>`;
  } else if (name.length > 9) {
    fontSize = "1.4"
    heroCity.innerHTML = `<p style="font-size: ${fontSize}rem;">${name}</p>`;
  } else {
    fontSize = "1.8"
    heroCity.innerHTML = `<p style="font-size: ${fontSize}rem;">${name}</p>`;
  }

  //Vädret i staden,
  //text
  const conditionText = data.current.condition.text;
  heroConditionText.innerHTML = `<p>${conditionText}</p>`;

  while (heroConditionIcon.firstChild) {
    heroConditionIcon.removeChild(heroConditionIcon.firstChild);
  }
  //.. och lägg till en ny
  const conditionIcon = document.createElement("img");
  conditionIcon.classList.add("condition-img");
  conditionIcon.src = data.current.condition.icon;
  heroConditionIcon.appendChild(conditionIcon);

  //----------------------------------------
  //Stadens UV
  const uvIndex = data.current.uv;
  heroUv.innerHTML = `<p>${uvIndex}</p>`;
  //----------------------------------------
  //Stadens luftfuktighet
  const humidity = data.current.humidity;
  heroHumidityText.innerHTML = `<p>${humidity}</p>`;
  //-------------------------------------------
  //Stadens temp
  const temp = data.current.temp_c;
  heroTemp.innerHTML = `<p>${temp.toFixed(0)}\u00B0</p>`;
  //Stadens känns som temp
  const feelslike = data.current.feelslike_c;
  heroFeelsLike.innerHTML = `<p>Känns som ${feelslike.toFixed(0)}\u00B0</p>`;

  //Anropar funktionen som byter bakgrund på hero beroende på strängen från condition.text

  //Återställ nuvarande position knappen


  setHeroImage();
  styleCurrentPosBtn();

  forecastLink.querySelector("a").textContent = `${lastDisplayed}, 3-dygnsprognos`

  weatherInfoAndDisplay(apiKey, lastDisplayed, container1);
  } catch (error) {
    console.error("Kunde inte hämta nuvarande position: " + error)
  }
}

//2. Funktion för att söka på städer

const searchInput = document.getElementById("search");
const searchButton = document.getElementById("search-btn");

//Se till så att funktionen körs genom både "enter" och klick på sökknappen

searchInput.addEventListener("search", searchCity);

searchButton.addEventListener("click", searchCity);

//Scrolla till toppen av sidan vid sökning

function scrollToTop() {
  window.scrollTo({
    top: 0,
    behaviour: 'smooth'
  })
}

async function searchCity() {
  try {
  const response = await fetch(
    `s://api.weatherapi.com/v1/current.json?key=c16f3924032646cc966121030233110&q=${searchInput.value}&lang=sv`
  );
  const data = await response.json();

  //Använder localstorage för att spara den sökta stadens namn. Den först bokstaven i strängen omvandlas till en
  //stor bokstav för att undvika problem vid matchning av värden som är sparade i "Favoriter" (localStorage.getItem('favourites'))

  //Felsträng: 1

  const lastDisplayed =
    searchInput.value.charAt(0).toUpperCase() + searchInput.value.slice(1);

  // const lastDisplayed = heroCity.textContent.charAt(0).toUpperCase() + heroCity.textContent.slice(1);

  //--Felsträng: 1

  localStorage.setItem("lastDisplayed", lastDisplayed);

  //Anropar funktionen som byter bakgrund på hero beroende på strängen från condition.text
  setHeroImage();

  //Stadens namn
  const name = data.location.name;

  //Ändra font size beroende på strängens längd

  if (name.length > 20) {
    fontSize = "1"
    heroCity.innerHTML = `<p style="font-size: ${fontSize}rem;">${name}</p>`;
  } else if (name.length > 12) {
    fontSize = "1.2"
    heroCity.innerHTML = `<p style="font-size: ${fontSize}rem;">${name}</p>`;
  } else if (name.length > 9) {
    fontSize = "1.4"
    heroCity.innerHTML = `<p style="font-size: ${fontSize}rem;">${name}</p>`;
  } else {
    fontSize = "1.8"
    heroCity.innerHTML = `<p style="font-size: ${fontSize}rem;">${name}</p>`;
  }

  //-------------------------
  //Vädret i staden,
  //text
  const conditionText = data.current.condition.text;
  heroConditionText.innerHTML = `<p>${conditionText}</p>`;

  //ikon

  //Ta bort befintlig condition icon

  while (heroConditionIcon.firstChild) {
    heroConditionIcon.removeChild(heroConditionIcon.firstChild);
  }

  const conditionIcon = document.createElement("img");
  conditionIcon.classList.add("condition-img");
  conditionIcon.src = data.current.condition.icon;
  heroConditionIcon.appendChild(conditionIcon);
  //----------------------------------------
  //Stadens UV
  const uvIndex = data.current.uv;
  heroUv.innerHTML = `<p>${uvIndex}</p>`;
  //----------------------------------------
  //Stadens luftfuktighet
  const humidity = data.current.humidity;
  heroHumidityText.innerHTML = `<p>${humidity}</p>`;
  //-------------------------------------------
  //Stadens temp
  // const temp = data.current.temp_c;

  const temp = JSON.stringify(data.current.temp_c);
  // heroTemp.innerHTML = `<p>${temp}\u00B0</p>`;

  console.log(temp.length)
  if (temp.length > 3) {
    fontSize = "3.5"
    heroTemp.innerHTML = `<p style="font-size: ${fontSize}rem;">${JSON.parse(temp).toFixed(0)}\u00B0</p>`;
  } else if (temp.length > 2) {
    fontSize = "4.5"
    heroTemp.innerHTML = `<p style="font-size: ${fontSize}rem;">${JSON.parse(temp).toFixed(0)}\u00B0</p>`;
  } else {
    fontSize = "5"
    heroTemp.innerHTML = `<p style="font-size: ${fontSize}rem;">${JSON.parse(temp).toFixed(0)}\u00B0</p>`;
  }

  //Stadens känns som temp
  const feelslike = data.current.feelslike_c;
  heroFeelsLike.innerHTML = `<p>Känns som ${feelslike.toFixed(0)}\u00B0</p>`;

  if (
    localStorage.getItem("homeCity") === localStorage.getItem("lastDisplayed")
  ) {
    styleHomeBtn();
  } else {
    clearHomeBtn();
  }

  //Rensa sökfältet vid sökning

  searchInput.value = "";

  //Om den angivna hemstaden är den aktuella staden som visas så styleas knappen för
  //nuvarande position. Om inte så återställs stylen.

  if (
    localStorage.getItem("homeCity") === localStorage.getItem("lastDisplayed") ||
    localStorage.getItem("currentPosString") === localStorage.getItem("lastDisplayed")
  ) {
    styleCurrentPosBtn();
  } else {
    clearCurrentPosBtn();
  }

  let favourites = JSON.parse(localStorage.getItem("favourites"));

  //Om favourites innehåller staden som visades senast så styleas hemknappen.
  //Om inte så återställs den. Den måste också kolla om favourites ens innehåller
  //ett värde, annars uppstår en bugg.

  if (favourites !== null && favourites.includes(lastDisplayed)) {
    styleFavButton();
  } else {
    clearFavButton();
  }

  forecastLink.querySelector("a").textContent = `${lastDisplayed}, 3-dygnsprognos`

  weatherInfoAndDisplay(apiKey, lastDisplayed, container1);
  scrollToTop();
 } catch (error) {
  console.error("Staden hittades inte, försök igen: " + error)
 }
}

//Funktion som hämtar staden som användaren har angivit som hemort

async function getHomeCity() {
  try {
  const city = localStorage.getItem("homeCity");
  const response = await fetch(
    `s://api.weatherapi.com/v1/current.json?key=c16f3924032646cc966121030233110&q=${city}&lang=sv`
  );
  const data = await response.json();

  //lastDisplayed deklareras med både senaste sökningen och den aktuella stadens namn

  const lastDisplayed = searchInput.value || data.location.name;
  console.log("hej1");
  localStorage.setItem("lastDisplayed", lastDisplayed);

  //Stadens namn

  const name = data.location.name;
  //Ändra font size beroende på strängens längd

  if (name.length > 20) {
    fontSize = "1"
    heroCity.innerHTML = `<p style="font-size: ${fontSize}rem;">${name}</p>`;
  } else if (name.length > 12) {
    fontSize = "1.2"
    heroCity.innerHTML = `<p style="font-size: ${fontSize}rem;">${name}</p>`;
  } else if (name.length > 9) {
    fontSize = "1.4"
    heroCity.innerHTML = `<p style="font-size: ${fontSize}rem;">${name}</p>`;
  } else {
    fontSize = "1.8"
    heroCity.innerHTML = `<p style="font-size: ${fontSize}rem;">${name}</p>`;
  }

  //-------------------------
  //Vädret i staden,
  //text
  const conditionText = data.current.condition.text;
  heroConditionText.innerHTML = `<p>${conditionText}</p>`;
  //ikon

  //Ta bort befintlig condition icon

  while (heroConditionIcon.firstChild) {
    heroConditionIcon.removeChild(heroConditionIcon.firstChild);
  }

  const conditionIcon = document.createElement("img");
  conditionIcon.classList.add("condition-img");
  conditionIcon.src = data.current.condition.icon;
  heroConditionIcon.appendChild(conditionIcon);
  //----------------------------------------
  //Stadens UV
  const uvIndex = data.current.uv;
  heroUv.innerHTML = `<p>${uvIndex}</p>`;
  //----------------------------------------
  //Stadens luftfuktighet
  const humidity = data.current.humidity;
  heroHumidityText.innerHTML = `<p>${humidity}</p>`;
  //-------------------------------------------
  //Stadens temp
  const temp = JSON.stringify(data.current.temp_c);
  // const temp = data.current.temp_c;
  console.log(temp.length)
  // heroTemp.innerHTML = `<p>${temp}\u00B0</p>`;
  if (temp.length > 3) {
    fontSize = "3.5"
    heroTemp.innerHTML = `<p style="font-size: ${fontSize}rem;">${JSON.parse(temp).toFixed(0)}\u00B0</p>`;
  } else if (temp.length > 2) {
    fontSize = "4.5"
    heroTemp.innerHTML = `<p style="font-size: ${fontSize}rem;">${JSON.parse(temp).toFixed(0)}\u00B0</p>`;
  } else {
    fontSize = "5"
    heroTemp.innerHTML = `<p style="font-size: ${fontSize}rem;">${JSON.parse(temp).toFixed(0)}\u00B0</p>`;
  }
  //Stadens känns som temp
  const feelslike = data.current.feelslike_c;
  heroFeelsLike.innerHTML = `<p>Känns som ${feelslike.toFixed(0)}\u00B0</p>`;

  //Anropar funktionen som byter bakgrund på hero beroende på strängen från condition.text
  setHeroImage();
  //Stylea hemortsknappen
  styleHomeBtn();

  //Återställ nuvarande position knappen
  if (
    localStorage.getItem("currentPosString") ===
    localStorage.getItem("lastDisplayed")
  ) {
    styleCurrentPosBtn();
  } else {
    clearCurrentPosBtn();
  }

  forecastLink.querySelector("a").textContent = `${lastDisplayed}, 3-dygnsprognos `

  weatherInfoAndDisplay(apiKey, lastDisplayed, container1);
  } catch (error) {
    console.error("Kunde inte hämta hemort: " + error)
  }
}

//Om användaren aldrig har angivit sin hemort så visas den nuvarande positionens väderdata som
//default. Om användaren anger hemort så visas då den stadens väderdata som default via
//localstorage

if (localStorage.getItem("homeCity")) {
  //<-- Kollar om det finns en nyckel 'homeCity' med ett värde i localStorage
  getHomeCity();
} else {
  //<-- Om inte så hämtas den nuvarande positionens väderdata
  getCurrentLocation();
}

//Använd fetch för att hämta städerna som lagras i favoriter i localstorage, och för att sedan mappa ut datan för varje stad i en
//egen container

const favourites = localStorage.getItem("favourites");

//4. Funktion som hämtar alla favoriter och mappar ut dom i nya containers under favoriter

const fetchFavourites = async () => {
  try {
  const favouriteArrayData = [];
  if (favourites !== null) {
    const promises = JSON.parse(favourites).map(async (favourite) => {
      const getFavourites = await fetch(
        `s://api.weatherapi.com/v1/forecast.json?key=c16f3924032646cc966121030233110&q=${favourite}&lang=sv`
      );
      const res = await getFavourites.json();
      favouriteArrayData.push(res);
    });
    await Promise.all(promises);
    const mappedFavourites = favouriteArrayData.map((data) => {
      console.log(data);
      const favUlList = document.getElementsByClassName("fav-dropdown-menu-1");
      const favLocation = data.location.name;
      console.log("Här är felet för stadens namn");
      const favCondition = data.current.condition.text;
      const favTemperature = data.current.temp_c;
      const favIcon = data.current.condition.icon;
      const date = data.forecast.forecastday[0].date;
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
        `Tryck: ${pressure} millibar`,
      ];

      apiArray.forEach((item) => {
        const liElement = document.createElement("li");
        liElement.textContent = item;
        Array.from(favUlList).forEach((element) => {
          element.appendChild(liElement.cloneNode(true));
        });
      });

      const tempHigh = data.forecast.forecastday[0].day.maxtemp_c;
      const tempLow = data.forecast.forecastday[0].day.mintemp_c;
      const rainChance = data.forecast.forecastday[0].day.daily_chance_of_rain;
      const dailyIcon = data.forecast.forecastday[0].day.condition.icon;

      const dailyIMG = document.getElementsByClassName("fav-dailyIMG");

      dailyIMG.src = dailyIcon;

      return `
      <div class="favourite-container" id="${favLocation}" onclick="openBox('${favLocation}')">
          <div class="fav-grid">
              <div class="fav-item-1" id="${favLocation + "fav-item-1"}">
                      <p>${favLocation}</p>
                      <img src="${favIcon}" style="height: 40px">
                  </div>
                  <div class="fav-item-2" id="${favLocation + "fav-item-2"}">
                      <p>${favCondition}</p>
                  </div>
                  <div class="fav-item-3" id="${favLocation + "fav-item-3"}">
                      <p>${favTemperature.toFixed(0)}°</p>
                  </div>
              </div>
              <div class="fav-arrow-box-down" id="${
                favLocation + "fav-arrow-box-down"
              }">
                        <img class="fav-down-arrow" id="${
                          favLocation + "fav-down-arrow"
                        }" src="img/icons/Arrow-down.png" alt="Neråtpil" style="display: ${arrowState}; margin: 0px auto;">
                    </div>
              <div class="fav-dropdown-menu" id="${
                favLocation + "fav-dropdown-menu"
              }" style="display: ${dropDownState};">
                  <ul class="fav-dropdown-menu-1" >
                    <li>Temperatur: ${temp.toFixed(0)}°</li>
                    <li>Temperatur känns som: ${feelsLike.toFixed(0)}°</li>
                    <li>Nederbörd ${rain}mm</li>
                    <li>Vindhastighet: ${gust.toFixed(1)}m/s</li>
                    <li>Vindriktning: ${windDirection}</li>
                    <li>Molnighet: ${cloud}</li>
                    <li>UV: ${uvIndex}</li>
                    <li>Fuktighet: ${humidity}</li>
                    <li>Tryck: ${pressure} millibar</li>
                  </ul>
                  <div class="fav-weather-box">
                      <div class="fav-item-4" id="${favLocation + "fav-item-4"}">
                          <p>${(() => {
                            let out;
                            const formattedDate = new Date(date);
                            const month = formattedDate.toLocaleString("default", { month: "short" });
                            const day = formattedDate.getDate();
                            out = `Idag, ${month} ${day}`;
                            return out
                          })()}</p>
                          <img class="fav-dailyIMG" src="${dailyIcon}" alt="">
                      </div>
                      <div class="fav-item-5" id="${favLocation + "fav-item-5"}">
                          <p>${"H: " + tempHigh.toFixed(0)}°</p>
                          <p>${"L: " + tempLow.toFixed(0)}°</p>
                      </div>
                      <div class="fav-item-6" id="${favLocation + "fav-item-1"}">
                          <img src="//cdn.weatherapi.com/weather/64x64/day/296.png" alt="">
                          <p>${rainChance + "%"}</p>
                      </div>
                  </div>

                  <div class="fav-table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Tid</th>
                                <th>Väder</th>
                                <th>Temp</th>
                                <th>Nederbörd</th>
                                <th>Vind M/S</th>
                            </tr>
                        </thead>
                        <tbody class="fav-data-output">
                            ${(() => {
                              const getCurrentHour = new Date();
                              let currentHour = getCurrentHour.getHours();

                              const hourIndex =
                                data.forecast.forecastday[0].hour;
                              //Hämta ut time och splitta strängen. Ta de två första symbolerna och sätt dom som currentHour
                              const timeIndex =
                                hourIndex[`${currentHour}`].time;

                              const splittedTimeIndex = timeIndex.split(" ");

                              const substringTimeIndex =
                                splittedTimeIndex[1].substring(0, 2);

                              let singleSubstringTimeIndex = substringTimeIndex;

                              if (substringTimeIndex.startsWith("0")) {
                                singleSubstringTimeIndex =
                                  substringTimeIndex.substring(1);
                              }

                              let tableContent =
                                document.getElementById("data-output");
                              let out = "";
                              let hourlyData =
                                data.forecast.forecastday[0].hour;

                              for (
                                let i = singleSubstringTimeIndex;
                                i < hourlyData.length;
                                i++
                              ) {
                                let timeToSplit = hourlyData[i].time.split(" ");
                                let time = timeToSplit[1];
                                out += `
                                      <tr>
                                          <td>${time}</td>
                                          <td> <img src="${
                                            hourlyData[i].condition.icon
                                          }"></td>
                                          <td>${
                                            hourlyData[i].temp_c.toFixed(0)
                                          }&deg;</td>
                                          <td>${hourlyData[i].precip_mm} mm</td>
                                          <td>${(
                                            hourlyData[i].gust_kph / 3.6
                                          ).toFixed(1)}</td>
                                      </tr>
                                  `;
                              }
                              tableContent.innerHTML = out;
                              return out;
                            })()}
                        </tbody>
                    </table>
                </div>
                <section id="${favLocation + "chart-container"}">

                </section>
                <div class="fav-arrow-box-up">
                    <img class="fav-up-arrow" src="img/icons/Arrow-up.png"
                    alt="Uppåtpil"
                </div>
            </div>
          </div>
        </div>
      `;
    });
    const joinedHTML = mappedFavourites.join("");
    favouritesList.innerHTML = joinedHTML;
  }
} catch (error) {
  console.error("Kunde inte hämta favoriter: " + error)
}
};

fetchFavourites();

//6. Funktion som möjliggör öppning/stängning av containers i favoritlistan

function openBox(name) {
  const conditionList = document.getElementById(name + "fav-dropdown-menu");
  const arrowBoxDown = document.getElementById(name + "fav-arrow-box-down");
  const arrowDown = document.getElementById(name + "fav-down-arrow");
  if (
    conditionList.style.display === "none" ||
    conditionList.style.display === ""
  ) {
    conditionList.style.display = "block";
    arrowBoxDown.style.display = "none";
  } else {
    conditionList.style.display = "none";
    arrowBoxDown.style.display = "block";
    arrowDown.style.display = "block";
    arrowDown.style.margin = "0 auto";
  }
}

//Behövs för att openBox ska fungera?

const dropDownState = "none";
const arrowState = "block";

//7. Funktion som byter ut bakgrunden på hero vid visning av stad

async function setHeroImage() {
  try {
  const city = localStorage.getItem("lastDisplayed");
  const response = await fetch(
    `s://api.weatherapi.com/v1/current.json?key=c16f3924032646cc966121030233110&q=${city}&lang=sv`
  );
  const data = await response.json();
  const hero = document.getElementById("hero");
  const condition = data.current.condition.text;

  let x = window.matchMedia("(max-width: 600px)");

  switch (condition) {
    //Allt med regn
    case "Lätt regn":
    case "Lätt duggregn":
    case "Underkylt duggren":
    case "Tungt underkylt duggren":
    case "Områden med lätt regn":
    case "Områden med regn i närheten":
    case "Måttligt regn då och då":
    case "Måttligt regn":
    case "Tungt regn":
    case "Tungt regn då och då":
    case "Lätt underkylt regn":
    case "Lätt regnskur":
    case "Måttlig eller tung regnskur":
    case "Störtregn":
    case "Måttligt eller tungt underkylt regn":
    case "Lätt snöblandat regn":
    case "Lätt snöblandad regnskur":
    case "Måttlig eller tung snöblandad regnskur":
    case "Områden med lätt duggren":
    case "Områden med underkylt duggregn i närheten":
    case "Måttligt eller tungt snöblandat regn":
      //Responsiv, om skärmen är mindre än 600 px bred så laddas bilden för mobile
      if (x.matches) {
        hero.style.backgroundImage = "url(/img/mobile/conditions/drizzle.jpg)";
      } else {
        hero.style.backgroundImage = "url(/img/desktop/conditions/drizzle.jpg)";
      }
      break;
    //Åska
    case "Åska i närheten":
    case "Områden med lätt regn i område med åska":
    case "Måttligt eller tungt regn i område med åska":
    case "Områden med lätt snöfall i område med åska":
    case "Måttligt eller tungt snöfall i område med åska":
      //Responsiv, om skärmen är mindre än 600 px bred så laddas bilden för mobile
      if (x.matches) {
        hero.style.backgroundImage = "url(/img/mobile/conditions/thunder.jpg)";
      } else {
        hero.style.backgroundImage = "url(/img/desktop/conditions/thunder.jpg)";
      }
      break;
    //Moln
    case "Molnigt":
    case "Växlande molnighet":
      //Responsiv, om skärmen är mindre än 600 px bred så laddas bilden för mobile
      if (x.matches) {
        hero.style.backgroundImage =
          "url(/img/mobile/conditions/partly_cloudy.jpg)";
      } else {
        hero.style.backgroundImage =
          "url(/img/desktop/conditions/partly_cloudy.jpg)";
      }
      break;
    //Snö
    case "Områden med snö i närheten":
    case "Högt snödrev":
    case "Häftig snöstorm":
    case "Områden med lätt snöfall":
    case "Områden med måttligt snöfall":
    case "Måttligt snöfall":
    case "Områden med tungt snöfall":
    case "Lätta snöbyar":
    case "Måttliga eller kraftiga snöbyar":
    case "Lätt snöfall":
    case "Tungt snöfall":
    case "Lätta skurar med iskorn":
    case "Måttliga eller tunga skurar med iskorn":
    case "Iskorn":
      //Responsiv, om skärmen är mindre än 600 px bred så laddas bilden för mobile
      if (x.matches) {
        hero.style.backgroundImage = "url(/img/mobile/conditions/snowing.jpg)";
      } else {
        hero.style.backgroundImage = "url(/img/desktop/conditions/snowing.jpg)";
      }
      break;
    //Soligt
    case "Soligt":
      //Responsiv, om skärmen är mindre än 600 px bred så laddas bilden för mobile
      if (x.matches) {
        hero.style.backgroundImage = "url(/img/mobile/conditions/sunny.jpg)";
      } else {
        hero.style.backgroundImage = "url(/img/desktop/conditions/sunny.jpg)";
      }
      break;
    //Klart (Natt)
    case "Klart":
      if (x.matches) {
        hero.style.backgroundImage = "url(/img/mobile/conditions/moon.jpg)";
      } else {
        hero.style.backgroundImage = "url(/img/desktop/conditions/moon.jpg)";
      }
      break;
    //Dimma
    case "Dimma":
    case "Dimfrost":
    case "Fuktdis":
      //Responsiv, om skärmen är mindre än 600 px bred så laddas bilden för mobile
      if (x.matches) {
        hero.style.backgroundImage = "url(/img/mobile/conditions/fog.jpg)";
      } else {
        hero.style.backgroundImage = "url(/img/desktop/conditions/fog.jpg)";
      }
      break;
    case "Mulet":
      //Responsiv, om skärmen är mindre än 600 px bred så laddas bilden för mobile
      if (x.matches) {
        hero.style.backgroundImage = "url(/img/mobile/conditions/mulet.jpg)";
      } else {
        hero.style.backgroundImage = "url(/img/desktop/conditions/mulet.jpg)";
      }
      break;
  }
 } catch (error) {
  console.error("Kunde inte ladda omslagsbild: " + error)
 }
}



//8. Funktion som byter färg och ändrar text på knappen "Ange som hemort"

function styleHomeBtn() {
  const homeButton = document.getElementById("set-home");
  homeButton.style.backgroundColor = "#3ab90c";
  const homeButtonText = document.getElementById("home-btn-text");
  const newText = "Hemort";
  homeButtonText.textContent = newText;
}

//9. Funktion som återställer färg och ändrar text på knappen "Ange som hemort"

function clearHomeBtn() {
  const homeButton = document.getElementById("set-home");
  homeButton.style.backgroundColor = "black";
  const homeButtonText = document.getElementById("home-btn-text");
  const newText = "Ange som hemort";
  homeButtonText.textContent = newText;
}

const homeButton = document.getElementById("set-home");

homeButton.addEventListener("click", setHome);

//10. Funktion som anger hemstad

function setHome() {
  const homeCity = localStorage.getItem("lastDisplayed");
  const homeButton = document.getElementById("set-home");
  //Om homeCity redan är deklarerad så sätts homeCitys värde till en tom sträng och style på knappen återställs
  localStorage.setItem("homeCity", "");
  localStorage.setItem("homeCity", homeCity);
  if (homeButton.textContent == "Hemort") {
    clearHomeBtn();
    localStorage.setItem("homeCity", "");
  } else {
    styleHomeBtn();
  }
}

//11. Funktion som stylear knappen "Visa nuvarande position"

function styleCurrentPosBtn() {
  const posBtnIcon = document.getElementById("pos-btn-icon");
  posBtnIcon.src = "/img/icons/location-active.png";
  const posButtonText = document.getElementById("pos-btn-text");
  const newText = "Visar nuvarande position";
  posButtonText.textContent = newText;
  posButtonText.style.textDecoration = "underline";
}

//12. Funktion som återställer knappen "Visa nuvarande position"

function clearCurrentPosBtn() {
  const posBtnIcon = document.getElementById("pos-btn-icon");
  posBtnIcon.src = "/img/icons/location.png";
  const posButtonText = document.getElementById("pos-btn-text");
  const newText = "Visa nuvarande position";
  posButtonText.textContent = newText;
  posButtonText.style.textDecoration = "none";
}

const favButton = document.getElementById("set-favourite");

//13. Funktion som stylear knappen "Lägg till favoriter"

function styleFavButton() {
  const favIcon = document.getElementById("fav-btn-icon");
  favIcon.src = "/img/icons/favourite-active.png";
  const homeButtonText = document.getElementById("fav-btn-text");
  const newText = "Favorit";
  homeButtonText.textContent = newText;
}

//14. Funktion som återställer knappen "Lägg till favoriter"

function clearFavButton() {
  const favIcon = document.getElementById("fav-btn-icon");
  favIcon.src = "/img/icons/favourite.png";
  const homeButtonText = document.getElementById("fav-btn-text");
  const newText = "Lägg till i favoriter";
  homeButtonText.textContent = newText;
}

//favArray = favoriter eller en tom array beroende på om favortier är tom

let favArray = JSON.parse(localStorage.getItem("favourites")) || [];

/* Om den senast visade staden finns i arrayen för favoriter så ska knappen
för lägga till/ta bort favoriter styleas, om den inte finns med så återställs den
*/

const lastCity = localStorage.getItem("lastDisplayed");
if (favArray.includes(lastCity)) {
  styleFavButton();
} else {
  clearFavButton();
}

/* Klick på favoritknappen triggar eventlistener. Om arrayen för favoriter inte
innehåller den senast visade staden så lägger den till staden i arrayen, om den
innerhåller så tas den bort.
*/

favButton.addEventListener("click", () => {
  let lastCity = localStorage.getItem("lastDisplayed");
  if (!favArray.includes(lastCity)) {
    addFavourite();
  } else if (favArray.includes(lastCity)) {
    removeFavourite();
  }
});

function addFavourite() {
  let cityToAdd = localStorage.getItem("lastDisplayed")
  favArray.push(localStorage.getItem("lastDisplayed"));
  localStorage.setItem("favourites", JSON.stringify(favArray));
  styleFavButton();
  fetchFavourites();
  // newFavourite();
  const containerToAdd = document.getElementById(cityToAdd)
  if (containerToAdd) {
    favouritesList.appendChild(containerToAdd);
  }
  console.log(favArray);
}

function removeFavourite() {
  let cityToDelete = localStorage.getItem("lastDisplayed");
  favArray = favArray.filter((city) => city !== cityToDelete);

  const containerToRemove = document.getElementById(cityToDelete)
  if (containerToRemove) {
    containerToRemove.remove();
  }

  clearFavButton();

  if (favArray.length === 0) {
    localStorage.removeItem("favourites");
  } else {
    localStorage.setItem("favourites", JSON.stringify(favArray));
  }

  console.log(favArray);
}

/////////////////////////////////////////////////////////////////////////////
const apiKey = 'c16f3924032646cc966121030233110';

//funktion för att hämta och visa dagens prognos
const weatherInfoAndDisplay = async (apiKey, lastDisplayed) => {
    const ulList = document.getElementById('dropdown-menu-1');

    //Tömmer listan på items innan nya data matas in, annars byggs flera städers
    //väderdata på

    ulList.innerHTML = '';

    try {
        const response = await fetch(
            `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${lastDisplayed}&days=3&lang=sv`
        );
        const data = await response.json();

        //hämtar data från api:n och lägger in i containern
        const location = data.location.name;
        const condition = data.current.condition.text;
        const temperature = data.current.temp_c;
        const icon = data.current.condition.icon;

        const item1 = document.getElementById('item-1');
        const item2 = document.getElementById('item-2');
        const item3 = document.getElementById('item-3');

        item1.querySelector('p').textContent = location;
        item2.querySelector('p').textContent = condition;
        item3.querySelector('p').textContent = temperature.toFixed(0) + '°';

        //skapar ett element och lägger in bild från api:n
        const iconIMG = document.createElement('img');
        iconIMG.src = icon;
        iconIMG.style.height = '40px';
        item1.appendChild(iconIMG);


        //tar bort second child från item 1 när en ny stad söks på för att undvika dubletter
        while (item1.children[2]) {
            item1.removeChild(item1.children[1]);
        }

        //hämtar data och lägger in i en array
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

        //loopar igenom arrayen och skapar li elements i en tom ul
        apiArray.forEach((item) => {
            const liElement = document.createElement('li');
            liElement.textContent = item;
            ulList.appendChild(liElement);
        });

        //Måla ut datan för de resterande timmarna på dygnet i ett table

        const getCurrentHour = new Date();
        let currentHour = getCurrentHour.getHours();

        const hourIndex = data.forecast.forecastday[0].hour;

        const hourLabels = [];

        for (let i = 0; i < 24; i++) {
            // For loop som skapar ett sträng värde för varje timme på dagen, 00:00 - 23:00
            const hours = i < 10 ? `0${i}:00` : `${i}:00`; // ifall i är större än 10, så byt båda nollorna med värdet i, annars hade 12:00 blivit 012:00
            hourLabels.push(hours);
        }

        //Hämta ut time och splitta strängen. Ta de två första symbolerna och sätt dom som currentHour
        const timeIndex = hourIndex[`${currentHour}`].time;

        const splittedTimeIndex = timeIndex.split(' ');

        const substringTimeIndex = splittedTimeIndex[1].substring(0, 2);

        let singleSubstringTimeIndex = substringTimeIndex;

        if (substringTimeIndex.startsWith('0')) {
            singleSubstringTimeIndex = substringTimeIndex.substring(1);
        }

        let tableContent = document.getElementById('data-output');
        let out = '';
        let hourlyData = data.forecast.forecastday[0].hour;

        //loopar igenom timmarna och lägger in dem i en tabell
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


        const dailyTemp = data.forecast.forecastday[0].hour.map((a) =>
            a.temp_c.toFixed(0)
        );

        const chartContainer = document.getElementById('chart-container');
        chartContainer.removeChild(chartContainer.firstChild);
        const newChart = document.createElement('canvas');
        newChart.setAttribute('id', 'myChart');
        chartContainer.appendChild(newChart);

        const ctx = document.getElementById('myChart');

        let chartData = {
            labels: hourLabels,
            datasets: [
                {
                    label: 'Temp',
                    data: dailyTemp,
                    borderWidth: 1,
                    fill: true,
                    backgroundColor: 'rgba(255, 255, 255, 0.5)',
                }
            ]
        };

        let chartOptions = {
            tension: 0.4,
            scales: {
                y: {
                    beginAtZero: true
                }
            }

        };

        let testChart = new Chart(ctx, {
            type: 'line',
            data: chartData,
            options: chartOptions
        });

        testChart.destroy();

        testChart = new Chart(ctx, {
            type: 'line',
            data: chartData,
            options: chartOptions
        });
    } catch (error) {
        console.error('An error occurred:', error);
    }

    try {
        const response1 = await fetch(
            `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${lastDisplayed}&days=3&lang=sv`
        );
        const data1 = await response1.json();

        //hämtar data och lägger in i containern
        const date = data1.forecast.forecastday[0].date;
        const tempHigh = data1.forecast.forecastday[0].day.maxtemp_c;
        const tempLow = data1.forecast.forecastday[0].day.mintemp_c;
        const rainChance =
            data1.forecast.forecastday[0].day.daily_chance_of_rain;
        const dailyIcon = data1.forecast.forecastday[0].day.condition.icon;

        const item4 = document.getElementById('item-4');
        const item5 = document.getElementById('item-5');
        const item6 = document.getElementById('item-6');
        const dailyIMG = document.getElementById('dailyIMG');

        dailyIMG.src = dailyIcon;
        item5.querySelector(':nth-child(1)').textContent =
            'H: ' + tempHigh.toFixed(0) + '°';
        item5.querySelector(':nth-child(2)').textContent =
            'L: ' + tempLow.toFixed(0) + '°';
        item6.querySelector('p').textContent = `${rainChance} %`;


        //använder api nyckeln date och formaterar om datumet till textform
        const formattedDate = new Date(date);

        const month = formattedDate.toLocaleString('default', {
            month: 'short'
        });
        const day = formattedDate.getDate();

        item4.querySelector('p').textContent = `Idag, ${month} ${day}`;
    } catch (error) {
        console.error('An error occurred:', error);
    }
};

// weatherInfoAndDisplay(apiKey, lastDisplayed, container1);

const conditionList = document.getElementById("dropdown-menu");

const arrowBoxDown = document.getElementById("arrow-box-down");
const arrowDown = document.getElementById("down-arrow");

//click funktion för prognos contaiern som öppnar upp den för att visa dess innehåll
container1.addEventListener("click", () => {
  if (
    conditionList.style.display === "none" ||
    conditionList.style.display === ""
  ) {
    conditionList.style.display = "block";
    arrowBoxDown.style.display = "none";
  } else {
    conditionList.style.display = "none";
    arrowBoxDown.style.display = "block";
    arrowDown.style.display = "block";
    arrowDown.style.margin = "0 auto";
  }
});

// -------- Navbar ----------------- //

const lista = document.getElementById("lista")
const länkar = document.getElementById("länkar")

lista.addEventListener("click", () => {  /* När hamburgermenyn klickas på så.. */
    länkar.classList.toggle("active") /* ... öppnas och stängs menylistan */
})
