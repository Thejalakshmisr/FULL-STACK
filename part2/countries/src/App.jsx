import { useState, useEffect } from "react"
import countriesService from "./services/countries"
import axios from "axios"

const App = () => {
  const [countries, setCountries] = useState([])
  const [filter, setFilter] = useState("")
  const [selected, setSelected] = useState(null)

  // Fetch all countries
  useEffect(() => {
    countriesService.getAll().then(data => {
      setCountries(data)
    })
  }, [])

  // Filtered list
  const filtered = countries.filter(country =>
    country.name.common.toLowerCase().includes(filter.toLowerCase())
  )

  return (
    <div>
      <h1>Find Countries</h1>

      <input
        value={filter}
        onChange={(e) => {
          setFilter(e.target.value)
          setSelected(null) // Reset selected when typing
        }}
      />

      {filter && filtered.length > 10 && (
        <p>Too many matches, specify another filter.</p>
      )}

      {filtered.length > 1 && filtered.length <= 10 && (
        <ul>
          {filtered.map(c => (
            <li key={c.name.common}>
              {c.name.common}
              <button onClick={() => setSelected(c)}>show</button>
            </li>
          ))}
        </ul>
      )}

      {filtered.length === 1 && (
        <CountryDetail country={filtered[0]} />
      )}

      {selected && (
        <CountryDetail country={selected} />
      )}
    </div>
  )
}

// ------------------------
// COUNTRY DETAIL COMPONENT
// ------------------------

const CountryDetail = ({ country }) => {
  const [weather, setWeather] = useState(null)

  const api_key = import.meta.env.VITE_WEATHER_KEY
  const capital = country.capital?.[0] || "Unknown"

  // Fetch weather when country changes
  useEffect(() => {
    if (!capital || !api_key) return

    axios
      .get(
        `https://api.openweathermap.org/data/2.5/weather?q=${capital}&units=metric&appid=${api_key}`
      )
      .then((response) => {
        setWeather(response.data)
      })
      .catch(() => {
        console.error("Weather fetch failed")
      })
  }, [capital, api_key])

  return (
    <div>
      <h2>{country.name.common}</h2>

      <p><b>Capital:</b> {capital}</p>
      <p><b>Area:</b> {country.area}</p>

      <h3>Languages</h3>
      <ul>
        {Object.values(country.languages || {}).map(lang => (
          <li key={lang}>{lang}</li>
        ))}
      </ul>

      <img 
        src={country.flags.png}
        alt="flag"
        width="150"
      />

      <h3>Weather in {capital}</h3>

      {!weather && <p>Loading weather...</p>}

      {weather && (
        <div>
          <p><b>Temperature:</b> {weather.main.temp} °C</p>

          <img
            src={`https://openweathermap.org/img/wn/${weather.weather?.[0]?.icon}@2x.png`}
            alt="weather icon"
          />

          <p><b>Wind:</b> {weather.wind.speed} m/s</p>
        </div>
      )}
    </div>
  )
}

export default App
