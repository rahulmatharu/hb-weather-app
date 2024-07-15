"use client";

import axios from "axios";
import { useEffect, useState } from "react";

type WeatherData = {
  temp: number;
  tempUnit: string;
  wind: number;
  windUnit: string;
};

const Weather = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);

  useEffect(() => {
    fetchWeatherData();
  }, []);

  const fetchWeatherData = async () => {
    try {
      const response = await axios.get(
        "https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&current=temperature_2m,wind_speed_10m&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m"
      );
      const currentWeather = response.data.current;
      const units = response.data.current_units;
      console.log(response.data);
      setWeather({
        temp: currentWeather.temperature_2m,
        tempUnit: units.temperature_2m,
        wind: currentWeather.wind_speed_10m,
        windUnit: units.wind_speed_10m,
      });
      //console.log(JSON.stringify(response));
    } catch (error) {
      console.log(`API call to Open Mateo failed with error ${error}`);
      // TODO: Add proper error handling and display error on front end
    }
  };

  return (
    <div>
      <p>Weather Component</p>
      {weather && (
        <div>
          <p>
            Temperature: {weather.temp} {weather.tempUnit}
          </p>
          <p>
            Wind Speed: {weather.wind} {weather.windUnit}
          </p>
        </div>
      )}
    </div>
  );
};

export default Weather;
