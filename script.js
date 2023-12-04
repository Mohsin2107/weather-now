const inputBox = document.querySelector(".input-box");
const searchBtn = document.getElementById("searchBtn");
const weather_img = document.querySelector(".weather-img");
const temperature = document.querySelector(".temperature");
const description = document.querySelector(".description");
const humidity = document.getElementById("humidity");
const wind_speed = document.getElementById("wind-speed");
const city_name = document.querySelector(".city-name");

const location_not_found = document.querySelector(".location-not-found");

const weather_body = document.querySelector(".weather-body");
let weatherData = {};
let cityList = [];
let currentCityIndex = 0;

async function getWeather(cityInput) {
  const cities = cityInput.split(",").map((city) => city.trim());

  try {
    const response = await fetch("https://weather-nslu.onrender.com/getWeather", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ cities }),
    });

    const data = await response.json();
    weatherData = data.weather;
    cityList = Object.keys(weatherData);
    if (cityList.length > 0) {
      displayCity(0);
    }
  } catch (error) {
    console.error("Error fetching weather:", error.message);
  }
}

function displayCity(cityIndex) {
  const city = weatherData[cityList[cityIndex]];
  console.log(city);
  if (!city || city.found === false) {
    location_not_found.style.display = "flex";
    weather_body.style.display = "none";
  } else {
    location_not_found.style.display = "none";
    weather_body.style.display = "flex";
    city_name.innerHTML = `${cityList[cityIndex].replace(/\b\w/g, (char) =>
      char.toUpperCase()
    )}`;
    temperature.innerHTML = `${Math.round(city.temperature)}°C`;
    description.innerHTML = `${city.text}`;
    humidity.innerHTML = `${city.humidity}%`;
    wind_speed.innerHTML = `${city.windSpeed}Km/H`;
    weather_img.src = `${city.image}`;
  }
}

function showNextCity() {
  if (currentCityIndex < cityList.length - 1) {
    currentCityIndex++;
    displayCity(currentCityIndex);
  }
}

function showPreviousCity() {
  if (currentCityIndex > 0) {
    currentCityIndex--;
    displayCity(currentCityIndex);
  }
}

// Event listeners for left and right arrow buttons
document
  .querySelector(".left-arrow")
  .addEventListener("click", showPreviousCity);
document.querySelector(".right-arrow").addEventListener("click", showNextCity);

searchBtn.addEventListener("click", () => {
  getWeather(inputBox.value);
});
