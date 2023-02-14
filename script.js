const apiID = "4a14a2e32f854b4cb9e31049230802";

const cityInput = document.querySelector(".city-input");
const cityName = document.querySelector(".city-name");
const weatherIcon = document.querySelector(".weather-icon");
const temp = document.querySelector(".temp");
const weatherCon = document.querySelector(".weather-condition")

const max = document.querySelector(".max")
const min = document.querySelector(".min")
const humidity = document.querySelector(".humidity")
const wind = document.querySelector(".wind")
const ctx = document.getElementById("myChart").getContext("2d");
const myChart = new Chart(ctx, {
  type: "line",
  data: {
    labels: [],
    datasets: [
      {
        label: "Temperature (°C)",
        data: [],
        backgroundColor: "rgba(250, 255, 87, 0.26)",
        borderColor: "rgba(250, 255, 87, 0.59)",
        borderWidth: 2
      }
    ]
  },
  options: {
    scales: {
      x: {
        grid: {
          display: false
        }
        ,
        ticks: {
            color: "white"
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          display: false
        },
        ticks: {
            color: "white"
        }
      }
    }
  }
});

cityInput.addEventListener("change", (e) => {
  fetch(`https://api.weatherapi.com/v1/forecast.json?key=${apiID}&q=${e.target.value}&days=10&aqi=no`)
    .then(res => res.json())
    .then(data => {
        console.log("Search input", data);
        cityName.innerHTML = data.location.name;
        weatherIcon.setAttribute('src', data.current.condition.icon);
        temp.innerHTML = Math.round(data.current.temp_c);
        weatherCon.innerHTML = data.current.condition.text;

        max.innerHTML = Math.round(data.forecast.forecastday[0].day.maxtemp_c) + "°C";
        min.innerHTML = Math.round(data.forecast.forecastday[0].day.mintemp_c) + "°C";
        humidity.innerHTML = data.current.humidity + " %";
        wind.innerHTML = data.current.wind_kph + " km/h";

        // update chart data
        const hourlyData = data.forecast.forecastday[0].hour;
        myChart.data.labels = hourlyData.map(hour => hour.time.slice(-5));
        myChart.data.datasets[0].data = hourlyData.map(hour => hour.temp_c);
        myChart.update();

        // weather forecast for the next 10 days
        const forecastItems = document.querySelectorAll('.forecast-data li');
        for (let i = 0; i < data.forecast.forecastday.length; i++) {
            forecastItems[i].querySelector('.days').textContent = data.forecast.forecastday[i].date;
            forecastItems[i].querySelector('img').setAttribute('src', data.forecast.forecastday[i].day.condition.icon);
            forecastItems[i].querySelector('.min').textContent = Math.round(data.forecast.forecastday[i].day.mintemp_c) + "°";
            forecastItems[i].querySelector('.max').textContent = Math.round(data.forecast.forecastday[i].day.maxtemp_c) + "°";
        }

        // change background by city name
        if (screen.width < screen.height) {
          console.log("mobile")
          document.body.style.backgroundImage = `url('https://source.unsplash.com/1080x1920/?${data.location.name}')`
        }
        else {
          console.log("pc")
          document.body.style.backgroundImage = `url('https://source.unsplash.com/1920x1080/?${data.location.name}')`
        }
        
    })
    .catch(error => console.log(error));
});
