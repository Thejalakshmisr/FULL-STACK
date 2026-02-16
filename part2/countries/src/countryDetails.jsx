import axios from "axios";
import { useEffect, useState } from "react";

const CountryDetails = ({ country }) => {
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    const api_key = import.meta.env.VITE_WEATHER_KEY;

    axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${country.capital[0]}&units=metric&appid=${api_key}`
    ).then(res => setWeather(res.data));
  }, [country]);

  return (
    <div>
      <h2>{country.name.common}</h2>
      <p>capital {country.capital[0]}</p>
      <p>area {country.area}</p>

      <h3>languages</h3>
      <ul>
        {Object.values(country.languages).map(l => (
          <li key={l}>{l}</li>
        ))}
      </ul>

      <img src={country.flags.png} alt="flag" width="200" />

      {weather && (
        <div>
          <h3>Weather in {country.capital[0]}</h3>
          <p>temperature {weather.main.temp} °C</p>
          <p>wind {weather.wind.speed} m/s</p>
          <img
            src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
            alt="weather icon"
          />
        </div>
      )}
    </div>
  );
};

export default CountryDetails;
