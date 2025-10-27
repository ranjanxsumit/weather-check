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

        {/* Local time display: extract time from API timestamp if available */}
        {current && current.time && typeof current.time === 'string' && (
          (() => {
            const m = current.time.match(/T(\d{2}):(\d{2})/);
            if (m) {
              const hh = parseInt(m[1], 10);
              const mm = m[2];
              const ampm = hh >= 12 ? 'PM' : 'AM';
              const hh12 = ((hh % 12) === 0) ? 12 : (hh % 12);
              return <div className="text-sm opacity-80">Local: {hh12}:{mm} {ampm}</div>;
            }
            return null;
          })()
        )}

        <div className="text-8xl font-thin my-1">{Math.round(temperature)}°</div>
        <div className="text-xl opacity-90 -mt-2">{description}</div>
        <div className="text-md opacity-90">Wind: {windspeed} km/h</div>
      </div>
    </div>
  );
}

export default WeatherCard;