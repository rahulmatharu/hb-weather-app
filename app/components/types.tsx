import { SvgIconComponent } from "@mui/icons-material";

export type WeatherCodes =
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

export type WeatherHighlights = {
  time: Date;
  temp: number;
  tempUnit: string;
  isDay: boolean;
  weatherCode: WeatherCodes;
  description: string;
  icon: string;
};

export type WeatherDetails = {
  type: string;
  unit?: string;
  value: number;
  icon: React.ReactNode;
};

export type Location = {
  latitude: number;
  longitude: number;
};

export type CurrentWeatherType = {
  time: string;
  interval: number;
  temperature_2m: number;
  wind_speed_10m: number;
  is_day: 0 | 1;
  weather_code: WeatherCodes;
  relative_humidity_2m: number;
  precipitation: number;
  wind_direction_10m: number;
};
