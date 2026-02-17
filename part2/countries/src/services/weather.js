import axios from "axios";

const API_KEY = "2d9daf04b4f3d5dfd65480023c89b176";

const getWeather = (city) => {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;
  return axios.get(url).then(res => res.data);
};

export default { getWeather };