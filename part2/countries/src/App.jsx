import { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [search, setSearch] = useState("");
  const [countries, setCountries] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    axios.get("https://studies.cs.helsinki.fi/restcountries/api/all")
      .then(res => setCountries(res.data));
  }, []);

  const filtered = countries.filter(c =>
    c.name.common.toLowerCase().includes(search.toLowerCase())
  );

  const showCountry = (country) => {
    setSelected(country);
  };

  return (
    <div>
      <h1>Countries</h1>

      <div>
        find countries <input value={search} onChange={(e) => {
          setSearch(e.target.value);
          setSelected(null);
        }} />
      </div>

      {filtered.length > 10 && <p>Too many matches, specify another filter</p>}

      {filtered.length <= 10 && filtered.length > 1 && (
        <ul>
          {filtered.map(c => (
            <li key={c.name.common}>
              {c.name.common}{" "}
              <button onClick={() => showCountry(c)}>show</button>
            </li>
          ))}
        </ul>
      )}

      {filtered.length === 1 && (
        <CountryDetails country={filtered[0]} />
      )}

      {selected && <CountryDetails country={selected} />}
    </div>
  );
}

export default App;
