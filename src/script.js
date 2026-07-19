const temperatureText = document.querySelector(".temperature");
const weatherText = document.querySelector(".weather");
const humidityText = document.querySelector(".humidity");  

const weatherCards = document.querySelectorAll(".weekday");

const searchInput = document.querySelector(".search");
const cfButton = document.querySelector(".cf");

const APIKey = "9fa508684060d7e4032f640679d33230";

const today = new Date();

// 1. Get weekday as a number (0 = Sunday, 1 = Monday...)
let dayIndex = today.getDay() -1;
if (dayIndex < 0) {
    dayIndex = 6;
}

weatherCards[dayIndex].classList.add("today");
weatherCards[dayIndex].classList.add("selected"); 

weatherCards.forEach((card, index) => {
    card.addEventListener("click", () => {
        weatherCards.forEach((c) => c.classList.remove("selected"));
        card.classList.add("selected");
    });
});


async function getWeather(lat, lon) {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${APIKey}`);
    const data = await response.json();
    console.log(data);
}

async function getCurrentWeather(lat, lon) {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${APIKey}`);
    const data = await response.json();
    temperatureText.textContent = `${Math.round(data.main.temp - 273.15)}°C`;
    weatherText.textContent = data.weather[0].main;
    humidityText.textContent = `${data.main.humidity}%`;
}

getWeather(51.5074, -0.1278);