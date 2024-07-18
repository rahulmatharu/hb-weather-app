"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import Image from "next/image";
import mapping from "./wmoWeatherCodes.json";
import { format } from "date-fns-tz";
import {
  CurrentWeatherType,
  WeatherDetails,
  WeatherHighlights,
  Location,
} from "./types";
import WaterDropIcon from "@mui/icons-material/WaterDrop";
import WavesIcon from "@mui/icons-material/Waves";
import AirIcon from "@mui/icons-material/Air";
import NavigationIcon from "@mui/icons-material/Navigation";
import IconWithText from "./IconWithText";

const Weather = () => {
  const [weather, setWeather] = useState<WeatherHighlights>();
  const [weatherDetails, setWeatherDetails] = useState<WeatherDetails[]>([]);
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
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&current=temperature_2m,relative_humidity_2m,is_day,precipitation,weather_code,wind_speed_10m,wind_direction_10m`
      );

      if (response.data) {
        const currentWeather: CurrentWeatherType = response.data.current;
        const units = response.data.current_units;
        const windDirection =
          response.data.current.wind_direction_10m.toString();
        setWeather({
          time: new Date(currentWeather.time),
          temp: currentWeather.temperature_2m,
          tempUnit: units.temperature_2m,
          isDay: currentWeather.is_day ? true : false,
          weatherCode: currentWeather.weather_code,
          description:
            mapping[currentWeather.weather_code][
              currentWeather.is_day ? "day" : "night"
            ].description,
          icon: mapping[currentWeather.weather_code][
            currentWeather.is_day ? "day" : "night"
          ].icon,
        });

        setWeatherDetails([
          {
            type: "Wind Speed",
            unit: units.wind_speed_10m,
            value: currentWeather.wind_speed_10m,
            icon: <AirIcon />,
          },
          {
            type: "Humidity",
            unit: units.relative_humidity_2m,
            value: currentWeather.relative_humidity_2m,
            icon: <WavesIcon />,
          },
          {
            type: "Precipitation",
            unit: units.precipitation,
            value: currentWeather.precipitation,
            icon: <WaterDropIcon />,
          },
          {
            type: "Wind Direction",
            unit: "°",
            //TODO: fix issue with correct unit not being returned by API - could be a bug with open meteo
            //TODO: fix rotation  bug

            value: windDirection,
            icon: <NavigationIcon className={`rotate-[${windDirection}deg]`} />,
          },
        ]);
      }
    } catch (error) {
      console.log(`Error calling Open Meteo weather API: ${error}`);
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
      <div className="flex flex-col gap-10 p-12 max-w-3xl mx-auto md:space-x-6">
        {weather && (
          <div className="flex flex-col">
            <div className="flex flex-col-reverse gap-8 sm:flex-row items-center">
              <div className="flex flex-row items-center flex-grow">
                <Image
                  src={weather.icon}
                  width={100}
                  height={100}
                  alt={weather.description}
                />
                <div className="flex flex-row font-bold ">
                  <h1 className="text-5xl">{weather.temp}</h1>
                  <h3 className="pl-2 text-xl">{weather.tempUnit}</h3>
                </div>
              </div>
              <div className="flex flex-col gap-1 text-center sm:text-left">
                <p className="font-bold text-2xl">Weather</p>
                <p>
                  {format(weather.time.toUTCString(), "EEEE HH:mm")}
                  {/* TODO: fix bug with time not taking into account daylight savings */}
                </p>
                <p>{weather.description}</p>
              </div>
            </div>
          </div>
        )}
        {weatherDetails.length > 0 && (
          <div className="flex justify-center sm:justify-start">
            <ul className="flex flex-col gap-3">
              {weatherDetails.map((item) => (
                <IconWithText
                  key={item.type.replace(/ /g, "_")} // Replaces whitespace with underscore
                  icon={item.icon}
                  label={item.type}
                  value={item.value.toString() + item.unit}
                />
              ))}
            </ul>
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
