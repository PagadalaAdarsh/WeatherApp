document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("weatherIcon").src = "icons/default.png"; // Default icon
    loadPreviousSearches();
});

function saveCityToHistory(city) {
    let cities = JSON.parse(localStorage.getItem("searchedCities")) || [];

    if (!cities.includes(city)) {
        cities.unshift(city); // Add to the beginning
        if (cities.length > 5) cities.pop(); // Limit history to 5 entries
        localStorage.setItem("searchedCities", JSON.stringify(cities));
    }
}

// Load previous searches into the datalist
function loadPreviousSearches() {
    const cities = JSON.parse(localStorage.getItem("searchedCities")) || [];
    const datalist = document.getElementById("cityList");

    datalist.innerHTML = ""; // Clear previous suggestions

    cities.forEach(city => {
        let option = document.createElement("option");
        option.value = city;
        datalist.appendChild(option);
    });
}

// Update suggestions while typing
document.getElementById("cityInput").addEventListener("input", function () {
    loadPreviousSearches();
});

async function getWeather() {
    const apiKey = "fb2ad586cb872f38a3f00086045d8a7d";
    const cityInput = document.getElementById("cityInput");
    const city = cityInput.value.trim();

    if (city === "") {
        alert("Please enter a city name.");
        return;
    }

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.cod === "404") {
            alert("City not found. Please try again.");
            return;
        }

        document.getElementById("temperature").textContent = `${data.main.temp}°C`;
        document.getElementById("cityName").textContent = `${data.name}, ${data.sys.country}`;
        document.getElementById("weatherCondition").textContent = data.weather[0].description;

        const weatherIconElement = document.getElementById("weatherIcon");
        weatherIconElement.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

        saveCityToHistory(city); // Save the searched city
        loadPreviousSearches();  // Reload the search history

        // 🌈 **Background Color Transition Based on Temperature**
        const weatherBox = document.querySelector(".weather-box");
        const temperature = data.main.temp;

        if (temperature < 15) {
            weatherBox.style.backgroundColor = "rgba(0, 102, 255, 0.2)"; // Cool - Blue
        } else if (temperature >= 15 && temperature <= 30) {
            weatherBox.style.backgroundColor = "rgba(255, 165, 0, 0.2)"; // Moderate - Orange
        } else {
            weatherBox.style.backgroundColor = "rgba(255, 0, 0, 0.2)"; // Hot - Red
        }

        // **Smooth Transition Effect**
        weatherBox.style.transition = "background-color 0.5s ease-in-out";

    } catch (error) {
        alert("Error fetching weather data.");
        console.error(error);
    }
}
