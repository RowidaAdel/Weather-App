// & Elements
var formData = document.querySelector('#loctaion');
var searchInput = document.querySelector('#searchInput');
var submitButton = document.querySelector('#submitButton');
var emailInput = document.querySelector("#emailInput");
var subscribeInput = document.querySelector("#subscribeInput");
var emailErrorMessage = document.querySelector("#emailErrorMessage");

// & Functions
document.addEventListener("DOMContentLoaded", function () {

  // Function to fetch and display weather data
  async function displayWeather(cityName) {
    try {
      if (!cityName) {
        alert("Search for city");
        return;
      }

      var url = `https://api.weatherapi.com/v1/forecast.json?key=405d7e0ebdfb4b7f827232527252504&q=${cityName}&days=3`;
      console.log("Fetching URL:", url);

      var response = await fetch(url);

      if (!response.ok) {
        throw new Error("Failed to fetch weather data. Status: " + response.status);
      }

      var data = await response.json();
      console.log("API response:", data);

      if (data.error) {
        console.error("City not found:", data.error.message);
        alert("City not found");
        return;
      }

      if (data.forecast && data.forecast.forecastday && data.location) {
        updateCards(data);
        searchInput.value = ""; 
      } else {
        console.error("Invalid data format:", data);
        alert("Invalid data received from API");
      }
    } catch (error) {
      console.error("Error fetching weather data:", error);
      alert("Error fetching weather data: " + error.message);
    }
  }

  // Function to update weather cards
  function updateCards(data) {
    var forecast = data.forecast.forecastday;
    var weatherCards = document.querySelector("#weatherCards");
  
    weatherCards.innerHTML = "";
  
    var cardClasses = ["card-1", "card-2", "card-3"];
  
    [0, 1, 2].forEach((index) => {
      var cardCol = document.createElement("div");
      cardCol.className = `${cardClasses[index]} col-12 col-md-6 col-lg-4 h-100`; 
      var card = document.createElement("div");
      card.className = "card w-100 h-100 d-flex flex-column";
  
      var cardHeader = document.createElement("div");
      cardHeader.className = `card-header ${index === 0 ? "d-flex justify-content-between" : "text-center"}`;
  
      if (index === 0) {
        cardHeader.innerHTML = `
          <p class="m-0">${new Date(data.location.localtime).toLocaleDateString('en-US', { weekday: 'long' })}</p>
          <p class="m-0">${new Date(data.location.localtime).toLocaleDateString('en-US', { day: 'numeric', month: 'long' })}</p>
        `;
      } else {
        cardHeader.textContent = new Date(forecast[index].date).toLocaleDateString('en-US', { weekday: 'long' });
      }
  
      var cardBody = document.createElement("div");
      cardBody.className = `card-body ${index === 0 ? "py-2" : "text-center d-flex justify-content-center align-items-center flex-column"}`;
  
      if (index === 0) {
        cardBody.innerHTML = `
          <h2 class="h4 card-title">${data.location.name}</h2>
          <div class="d-flex justify-content-between align-items-center">
            <h1 class="card-text text-white">${data.current.temp_c}°C</h1>
            <img src="https:${data.current.condition.icon}" alt="weather icon" class="w-50">
          </div>
          <h3>${data.current.condition.text}</h3>
          <div class="d-flex justify-content-between text-center py-2">
            <div class="d-flex align-items-center gap-2">
              <img src="./images/icon-umberella.png" alt="icon-umberella">
              <p class="mb-0">${data.current.humidity}%</p>
            </div>
            <div class="d-flex align-items-center gap-2">
              <img src="./images/icon-wind.png" alt="icon-wind">
              <p class="mb-0">${data.current.wind_kph} km/h</p>
            </div>
            <div class="d-flex align-items-center gap-2">
              <img src="./images/icon-compass.png" alt="icon-compass">
              <p class="mb-0">${data.current.wind_dir}</p>
            </div>
          </div>
        `;
      } else {
        cardBody.innerHTML = `
          <img src="https:${forecast[index].day.condition.icon}" alt="weather icon">
          <h4 class="card-text py-2 text-white">${forecast[index].day.maxtemp_c} <sup>o</sup> C</h4>
          <h5 class="card-text py-2">${forecast[index].day.mintemp_c} <sup>o</sup> C</h5>
          <h3 class="py-3">${forecast[index].day.condition.text}</h3>
        `;
      }
  
      card.appendChild(cardHeader);
      card.appendChild(cardBody);
      cardCol.appendChild(card);
  
      // Apply animation with delay
      setTimeout(() => {
        card.classList.add("weather-card-animation");
      }, index * 200);
  
      weatherCards.appendChild(cardCol);
    });
  }
  

  // Debounce function for search input
  let debounceTimeout;
  searchInput.addEventListener('input', function () {
    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(() => {
      var city = searchInput.value.trim();
      if (city.length >= 2) {
        displayWeather(city);
      }
    }, 500); 
  });

  // Event listener for form submission
  formData.addEventListener('submit', function (e) {
    e.preventDefault(); 
    var city = searchInput.value.trim();
    if (city !== "") {
      displayWeather(city); 
    }
  });

  // Event listener for the submit button
  submitButton.addEventListener("click", function () {
    formData.requestSubmit();  
  });

  // Function to get weather based on geolocation
  function getWeatherByLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function (position) {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        console.log("User's Latitude:", latitude);
        console.log("User's Longitude:", longitude);

        // Call the displayWeather function with the coordinates
        var url = `https://api.weatherapi.com/v1/forecast.json?key=405d7e0ebdfb4b7f827232527252504&q=${latitude},${longitude}&days=3`;
        console.log("Fetching URL for geolocation:", url);

        fetch(url)
          .then(response => response.json())
          .then(data => {
            console.log("Weather data based on geolocation:", data);
            if (data.forecast && data.forecast.forecastday && data.location) {
              updateCards(data);
            } else {
              alert("Invalid data received from API");
            }
          })
          .catch(error => {
            console.error("Error fetching weather data for geolocation:", error);
            alert("Error fetching weather data: " + error.message);
          });
      }, function (error) {
        console.error("Error occurred while fetching geolocation:", error);
        alert("We need your location to provide accurate weather data. Please enable location access.");
      });
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  }

  getWeatherByLocation();

  emailInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      subscribeInput.click();  
    }
  });
});

// & Regex for email validation
var emailRegex = /^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/i;

function validateEmail() {
  if (emailRegex.test(emailInput.value)) {
    emailInput.classList.add("is-valid");
    emailInput.classList.remove("is-invalid");
    emailErrorMessage.textContent = "";
    emailInput.value = ""; 
  } else {
    emailInput.classList.add("is-invalid");
    emailInput.classList.remove("is-valid");
    emailErrorMessage.textContent = "⚠️ Please enter a valid email address (e.g., example@mail.com).";
  }
}

// Event listener for email validation
subscribeInput.addEventListener("click", function (e) {
  e.preventDefault();
  validateEmail();
});
