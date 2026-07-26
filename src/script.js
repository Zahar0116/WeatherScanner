const WEATHER_CODES = {
    0: "Clear sky",
    1: "Mainly clear",
    2: "Partly cloudy",
    3: "Overcast",

    45: "Fog",
    48: "Depositing rime fog",

    51: "Light drizzle",
    53: "Moderate drizzle",
    55: "Dense drizzle",

    56: "Light freezing drizzle",
    57: "Dense freezing drizzle",

    61: "Slight rain",
    63: "Moderate rain",
    65: "Heavy rain",

    66: "Light freezing rain",
    67: "Heavy freezing rain",

    71: "Slight snow fall",
    73: "Moderate snow fall",
    75: "Heavy snow fall",
    77: "Snow grains",

    80: "Slight rain showers",
    81: "Moderate rain showers",
    82: "Violent rain showers",

    85: "Slight snow showers",
    86: "Heavy snow showers",

    95: "Thunderstorm",
    96: "Thunderstorm with slight hail",
    99: "Thunderstorm with heavy hail",
};

const temperatureText = document.querySelector(".temperature");
const weatherText = document.querySelector("h3.weather");
const humidityText = document.querySelector("h4.humidity");  

const weatherCards = document.querySelectorAll(".weekday");

const searchInput = document.querySelector(".search");
const cfButton = document.querySelector(".cf");
const cityForm = document.querySelector("form")
cityForm.addEventListener("submit", function (e) {
    e.preventDefault()
    loadWeek(searchInput.value)
})

const APIKey = "9fa508684060d7e4032f640679d33230";

const today = new Date();

let weekWeatherData = [     ]

// 1. Get weekday as a number (0 = Sunday, 1 = Monday...)
let dayIndex = today.getDay() -1;
if (dayIndex < 0) {
    dayIndex = 6;
}

weatherCards[dayIndex].classList.add("today");
weatherCards[dayIndex].classList.add("selected"); 

let selectedDay = dayIndex

weatherCards.forEach((card, index) => {
    card.addEventListener("click", () => {
        weatherCards.forEach((c) => c.classList.remove("selected"));
        card.classList.add("selected");
        selectedDay = index
        render(weekWeatherData)
    });
});

async function loadWeek(city) {
    weekWeatherData.length = 0
    const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`)
    const data = await response.json()
    const lat = data.results[0].latitude;
    const lon = data.results[0].longitude;
    const today = new Date()
    const monday = new Date(today)
    const day = monday.getDate()
    monday.setDate(today.getDate() -(day === 0 ? 6 : day - 1))
    const sunday = new Date(monday)
    sunday.setDate(monday.getDate()+6)

    const format = date => date.toISOString().split("T")[0];
    const weatherResponse = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&start_date=${format(monday)}&end_date=${format(sunday)}&daily=weather_code,temperature_2m_mean,relative_humidity_2m_mean&timezone=auto`)
    const weatherData = await weatherResponse.json()
    console.log(weatherData.daily)
    for (let i = 0; i<7; i++) {
        weekWeatherData.push({
            date:weatherData.daily.time[i],
            temperature:weatherData.daily.temperature_2m_mean[i],
            humidity:weatherData.daily.relative_humidity_2m_mean[i],
            weatherCode:weatherData.daily.weather_code[i],
        })
    }
    console.log(weekWeatherData)
    render(weekWeatherData)

}

function render(weekWeatherData) {
    temperatureText.innerText = `${weekWeatherData[selectedDay].temperature}°C`
    humidityText.innerText = `${weekWeatherData[selectedDay].humidity}%`
    weatherText.innerText = WEATHER_CODES[weekWeatherData[selectedDay].weatherCode]
    
}

loadWeek('london')