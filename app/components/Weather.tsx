"use client";

import axios from "axios";
import { useEffect, useState } from "react";

type WeatherData = {
  temp: number;
  tempUnit: string;
  wind: number;
  windUnit: string;
};

type Location = {
  latitude: number;
  longitude: number;
};

const Weather = () => {
  const [weather, setWeather] = useState<WeatherData>();
  const [error, setError] = useState<string>();
  const [location, setLocation] = useState<Location>();

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation(position.coords);
          fetchWeatherData(latitude, longitude);
        },
        (error) => {
          setError(
            "Geolocation not supported or permission denied. Please enable location permission or refresh page."
          );
          console.error(`Error getting user location: ${error}`);
        }
      );
    } else {
      console.error(`Error getting user location`);
      setError("Geolocation not supported");
    }
  }, []);

  const fetchWeatherData = async (lat: number, long: number) => {
    try {
      const response = await axios.get(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&current=temperature_2m,wind_speed_10m&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m`
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
    } catch (error) {
      console.log(`Error calling Open Mateo weather API: ${error}`);
      setError("Service unavailable at this time. Please try again later.");
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
      {error && <p>Error: {error}</p>}
      {location && (
        <p>
          Location: {location.latitude}, {location.longitude}
        </p>
      )}
    </div>
  );
};

export default Weather;
