import { useEffect, useState } from "react";
import "./App.css";
import clearSunIcon from "./assets/clearSun.png/";
import cloudIcon from "./assets/cloud.png/";
import drizzleIcon from "./assets/drizzle.png/";
import humidityIcon from "./assets/humidity.png/";
import rainIcon from "./assets/rain.png/";
import searchIcon from "./assets/search.png/";
import snowIcon from "./assets/snow.png/";
import windIcon from "./assets/wind.png/";
import Navbar from "./Navbar";

const WeatherDetails = ({
  icon,
  temp,
  city,
  country,
  lat,
  log,
  humidity,
  wind,
}) => {
  return (
    <>
      <div className="image">
        <img src={icon} alt="image" />
      </div>
      <div className="temp">{temp}°C</div>
      <div className="location">{city}</div>
      <div className="country">{country}</div>
      <div className="card">
        <div>
          <span className="lat">Latitude</span>
          <span>{lat}</span>
        </div>
        <div>
          <span className="log">Longitude</span>
          <span>{log}</span>
        </div>
      </div>
      <div className="data-container">
        <div className="element">
          <img
            src={humidityIcon}
            alt="humidity"
            className="icon w-10 h-9 ml-2"
          />
          <div className="data">
            <div className="humidity-percentage">{humidity}%</div>
            <div className="text">Humidity</div>
          </div>
        </div>
        <div className="element">
          <img src={windIcon} alt="wind" className="icon  w-10 h-9 ml-4" />
          <div className="data">
            <div className="wind-percentage">{wind}km/h</div>
            <div className="text">Wind Speed</div>
          </div>
        </div>
      </div>
    </>
  );
};

function App() {
  let api_key = "139c98e6114fc8d5d3848e471908361b";
  const [text, setText] = useState("Chennai");

  const [icon, setIcon] = useState(snowIcon);
  const [temp, setTemp] = useState(0);
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [lat, setLat] = useState(0);
  const [log, setLog] = useState(0);
  const [humidity, setHumidity] = useState(0);
  const [wind, setWind] = useState(0);

  const [cityNotFound, setCityNotfound] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const weatherIconMap = {
    "01d": clearSunIcon,
    "01n": clearSunIcon,
    "02d": cloudIcon,
    "02n": cloudIcon,
    "03d": drizzleIcon,
    "03n": drizzleIcon,
    "04d": drizzleIcon,
    "04n": drizzleIcon,
    "09d": rainIcon,
    "09n": rainIcon,
    "10d": rainIcon,
    "10n": rainIcon,
    "13d": snowIcon,
    "13n": snowIcon,
  };

  const search = async () => {
    setLoading(true);
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${text}&appid=${api_key}&units=Metric`;

    try {
      let res = await fetch(url);
      let data = await res.json();
      if (data.cod == "404") {
        console.log("City Not Found");
        setCityNotfound(true);
        setLoading(false);
        return;
      }
      setHumidity(data.main.humidity);
      setWind(data.wind.speed);
      setTemp(Math.floor(data.main.temp));
      setCity(data.name);
      setCountry(data.sys.country);
      setLat(data.coord.lat);
      setLog(data.coord.lon);
      const weatherIconCode = data.weather[0].icon;
      setIcon(weatherIconMap[weatherIconCode] || clearSunIcon);
      setCityNotfound(false);
    } catch (err) {
      console.error("An error occurred", err.message);
      setError("An error occurred while fetching weather data.");
    } finally {
      setLoading(false);
    }
  };

  const handleCity = (e) => {
    setText(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      search();
    }
  };

  

  

  useEffect(function () {
    search();
  }, []);
  return (
    <>  
      <Navbar />
      <div className="container text ">
        <div className="input-container ">
          <input
            type="text"
            value={text}
            className="cityInput "
            placeholder="Search City"
            onChange={handleCity}
            onKeyDown={handleKeyDown}
          />
          
          <div className="search-icon" onClick={() => search()}>
            <img className="w-3.5 h-3,5" src={searchIcon} alt="Search" />
          </div>
        </div>
        {!loading && !cityNotFound && (
          <WeatherDetails
            icon={icon}
            temp={temp}
            city={city}
            country={country}
            lat={lat}
            log={log}
            humidity={humidity}
            wind={wind}
          />
        )}
        {loading && <div className="loading-message">Loading...</div>}
        {error && <div className="error-message">{error}</div>}
        {cityNotFound && <div className="city-not-found">City not found</div>}

        <p className="copyright">
          Designed by <span>RP17</span>
        </p>
      </div>
    </>
  );
}

export default App;
