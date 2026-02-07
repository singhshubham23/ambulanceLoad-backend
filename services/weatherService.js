const axios = require("axios");

exports.getCurrentWeather = async () => {
  try {
    const API_KEY = process.env.WEATHER_API_KEY;

    if (!API_KEY) {
      return { temperature: 30, rainfall: 0 };
    }

    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=Delhi&appid=${API_KEY}&units=metric`
    );

    return {
      temperature: response.data.main.temp,
      rainfall: response.data.rain?.["1h"] || 0
    };

  } catch (err) {
    return { temperature: 30, rainfall: 0 };
  }
};
