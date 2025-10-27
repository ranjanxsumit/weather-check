import React from 'react';
import { 
  WiDaySunny, WiCloudy, WiRain, WiSnow, WiFog, WiThunderstorm, WiDayCloudy 
} from 'react-icons/wi'; // We'll need to install this!

export const weatherCodeMap = {
  0: 'Clear sky',
  1: 'Mainly clear',
  2: 'Partly cloudy',
  3: 'Overcast',
  45: 'Fog',
  48: 'Depositing rime fog',
  51: 'Light drizzle',
  53: 'Moderate drizzle',
  55: 'Dense drizzle',
  61: 'Slight rain',
  63: 'Moderate rain',
  65: 'Heavy rain',
  80: 'Rain showers',
  95: 'Thunderstorm',
  // Add more as needed
};

// Helper to get a full-page background
export function getWeatherVisuals(code) {
  switch (code) {
    case 0: // Clear sky
    case 1: // Mainly clear
      return { bgClass: 'bg-sunny', showRain: false };
    case 45: // Fog
    case 48: // Rime fog
    case 2: // Partly cloudy
    case 3: // Overcast
      return { bgClass: 'bg-cloudy', showRain: false };
    case 51: // Drizzle
    case 53:
    case 55:
    case 61: // Rain
    case 63:
    case 65:
    case 80: // Showers
      return { bgClass: 'bg-rainy', showRain: true };
    case 95: // Thunderstorm
      return { bgClass: 'bg-rainy', showRain: true };
    default:
      return { bgClass: 'bg-cloudy', showRain: false };
  }
}

// Helper to get an icon for the forecasts
export const getWeatherIcon = (code, size = 24) => {
  const iconProps = { size: size, color: 'white' };
  switch (code) {
    case 0:
    case 1:
      return <WiDaySunny {...iconProps} />;
    case 2:
      return <WiDayCloudy {...iconProps} />;
    case 3:
      return <WiCloudy {...iconProps} />;
    case 45:
    case 48:
      return <WiFog {...iconProps} />;
    case 51:
    case 53:
    case 55:
    case 61:
    case 63:
    case 65:
    case 80:
      return <WiRain {...iconProps} />;
    case 95:
      return <WiThunderstorm {...iconProps} />;
    // Add snow, etc.
    // 71, 73, 75, 77, 85, 86
    case 71:
    case 73:
    case 75:
    case 77:
    case 85:
    case 86:
      return <WiSnow {...iconProps} />;
    default:
      return <WiCloudy {...iconProps} />;
  }
};