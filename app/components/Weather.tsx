"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import Image from "next/image";
import mapping from "./wmoWeatherCodes.json";
import { format } from "date-fns-tz";

type WeatherCodes =
  | 0
  | 1
  | 2
  | 3
  | 45
  | 48
  | 51
  | 53
  | 55
  | 56
  | 57
  | 61
  | 63
  | 65
  | 66
  | 67
  | 71
  | 73
  | 75
  | 77
  | 80
  | 81
  | 82
  | 85
  | 86
  | 95
  | 96
  | 99;

type WeatherData = {
  time: Date;
  temp: number;
  tempUnit: string;
  wind: number;
  windUnit: string;
  isDay: boolean;
  weatherCode: WeatherCodes;
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
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&current=temperature_2m,wind_speed_10m,is_day,weather_code`
      );

      const currentWeather = response.data.current;
      const units = response.data.current_units;
      console.log(response.data);
      setWeather({
        time: new Date(currentWeather.time),
        temp: currentWeather.temperature_2m,
        tempUnit: units.temperature_2m,
        wind: currentWeather.wind_speed_10m,
        windUnit: units.wind_speed_10m,
        isDay: currentWeather.is_day ? true : false,
        weatherCode: currentWeather.weather_code,
      });
    } catch (error) {
      console.log(`Error calling Open Mateo weather API: ${error}`);
      setError("Service unavailable at this time. Please try again later.");
    }
  };

  return (
    <div>
      {/* Overlay */}
      <div className="absolute top-0 left-0 right-0 bottom-0 bg-black/40 z-[-1]" />
      {/* Background */}
      <Image
        src="/clear-sky.avif"
        alt="Clear Sky"
        layout="fill"
        className="absolute w-full h-full object-cover object-top z-[-2]"
      />
      {/* Current Weather */}
      <div className="flex flex-col gap-6 p-8 m-w-3xl md:space-x-6">
        {weather && (
          <div className="flex flex-col">
            <div className="flex flex-row items-center">
              <Image
                src={
                  mapping[weather.weatherCode][weather.isDay ? "day" : "night"]
                    .image
                }
                width={100}
                height={100}
                alt="Clear Sky"
                className=""
              />
              <div className="flex flex-row flex-grow font-bold ">
                <h1 className="text-5xl">{weather.temp}</h1>
                <h3 className="pl-2 text-xl">{weather.tempUnit}</h3>
              </div>
              <div className="flex flex-col mr-10">
                <p className="font-bold">Weather</p>
                <p className=" text-sm">
                  {format(weather.time.toUTCString(), "EEEE HH:mm")}
                </p>

                <p className="text-sm">
                  {
                    mapping[weather.weatherCode][
                      weather.isDay ? "day" : "night"
                    ].description
                  }
                </p>
              </div>
            </div>

            <p>
              {
                mapping[weather.weatherCode][weather.isDay ? "day" : "night"]
                  .description
              }
            </p>

            <p>
              Wind Speed: {weather.wind} {weather.windUnit}
            </p>
            <p>code: {weather.weatherCode}</p>
            <p>time: {format(weather.time.toUTCString(), "EEEE HH:mm")}</p>
          </div>
        )}
        {error && <p>Error: {error}</p>}
      </div>

      {/* Location Coordinates */}
      {location && (
        <div className="fixed bottom-0 right-0 mr-2 text-sm text-gray-300">
          Lat: {location.latitude.toFixed(6)}, Long:{" "}
          {location.longitude.toFixed(6)}
        </div>
      )}
    </div>
  );
};

export default Weather;
