import axios from "axios";

const API_KEY = import.meta.env.VITE_WEATHER_KEY; // use env variable

const getWeather = (city) => {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;
  return axios.get(url).then(res => res.data);
};

export default { getWeather };
