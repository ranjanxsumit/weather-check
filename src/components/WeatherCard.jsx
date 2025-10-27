import React from 'react';
import { weatherCodeMap } from '../utils/weatherUtils.jsx';

function WeatherCard({ current, place }) {
  const { temperature, windspeed, weathercode } = current;
  const description = weatherCodeMap[weathercode] || 'Weather';

  return (
    // UPDATED: Removed 'h-full', added 'min-h-[300px]'
    <div className="flex flex-col text-white gap-4 w-full min-h-[300px]">
      {/* UPDATED: Removed 'flex-grow' */}
      <div className="flex flex-col items-center justify-center text-center gap-1">
        <div className="text-3xl font-semibold">{place}</div>
        <div className="text-8xl font-thin my-1">{Math.round(temperature)}°</div>
        <div className="text-xl opacity-90 -mt-2">{description}</div>
        <div className="text-md opacity-90">Wind: {windspeed} km/h</div>
      </div>
    </div>
  );
}

export default WeatherCard;