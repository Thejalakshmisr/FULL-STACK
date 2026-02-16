import { useState, useEffect } from 'react'

function App() {
  const [countries, setCountries] = useState([])
  const [query, setQuery] = useState('')
  const [selectedCountry, setSelectedCountry] = useState(null)
  const [weather, setWeather] = useState(null)

  // Fetch all countries when query changes
  useEffect(() => {
    if (!query) return

    fetch('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then(res => res.json())
      .then(data => {
        const matches = data.filter(c =>
          c.name.common.toLowerCase().includes(query.toLowerCase())
        )
        setCountries(matches)
        if (matches.length === 1) setSelectedCountry(matches[0])
        else setSelectedCountry(null)
      })
  }, [query])

  // Fetch weather when a country is selected
  useEffect(() => {
    if (!selectedCountry) return
    const api_key = import.meta.env.VITE_SOME_KEY
    if (!api_key) return

    const capital = selectedCountry.capital
    fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${capital}&units=metric&appid=${api_key}`
    )
      .then(res => res.json())
      .then(data => setWeather(data))
      .catch(err => console.log('Weather fetch error:', err))
  }, [selectedCountry])

  return (
    <div style={{ padding: '20px' }}>
      <h1>Countries App</h1>
      <div>
        Find countries:{' '}
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Type country name"
        />
      </div>

      {/* Too many matches */}
      {countries.length > 10 && (
        <p style={{ color: 'red' }}>Too many matches, specify another filter.</p>
      )}

      {/* List of countries with "show" buttons */}
      {countries.length <= 10 && countries.length > 1 && (
        <ul>
          {countries.map(c => (
            <li key={c.name.common}>
              {c.name.common}{' '}
              <button onClick={() => setSelectedCountry(c)}>show</button>
            </li>
          ))}
        </ul>
      )}

      {/* Detailed country view */}
      {selectedCountry && (
        <div style={{ marginTop: '20px' }}>
          <h2>{selectedCountry.name.common}</h2>
          <p>Capital: {selectedCountry.capital}</p>
          <p>Area: {selectedCountry.area} km²</p>
          <p>
            Languages:{' '}
            {selectedCountry.languages
              ? Object.values(selectedCountry.languages).join(', ')
              : 'N/A'}
          </p>
          <img
            src={selectedCountry.flags.png}
            alt="flag"
            width="150"
            style={{ border: '1px solid black' }}
          />

          {/* Weather info */}
          {weather && weather.main && (
            <div style={{ marginTop: '10px' }}>
              <h3>Weather in {selectedCountry.capital}</h3>
              <p>Temperature: {weather.main.temp}°C</p>
              <p>Wind: {weather.wind.speed} m/s</p>
              <img
                src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                alt="weather icon"
              />
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default App
