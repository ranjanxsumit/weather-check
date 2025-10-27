import React from 'react';
import { getWeatherIcon } from '../utils/weatherUtils.jsx';
import CardEffects from './CardEffects';

const HourlyForecast = ({ hourly, currentWeatherTime, showRain = false, isNight = false }) => {
  
  const currentHourIndex = hourly.time.findIndex(
    (time) => time === currentWeatherTime
  );

  const startIndex = currentHourIndex !== -1 ? currentHourIndex : 0;

  const next8Hours = hourly.time
    .slice(startIndex, startIndex + 8)
    .map((time, index) => {
      const realIndex = startIndex + index;
      return {
        time: new Date(time).getHours(),
        temp: hourly.temperature_2m[realIndex],
        code: hourly.weathercode[realIndex],
      };
    });

  return (
    // UPDATED: This component is now its own glass card and constrained to align with top two cards
  <div className="glass p-4 sm:p-6 rounded-2xl shadow-xl w-full max-w-[760px] md:max-w-[760px] lg:max-w-[816px] mx-auto relative overflow-hidden">
      {/* effects under content */}
      <CardEffects showRain={showRain} isNight={isNight} />
      <div className="text-white relative z-10">
        <h3 className="text-sm opacity-70 mb-3">HOURLY FORECAST</h3>
        
        <div className="flex justify-between items-center text-center">
          {next8Hours.map((hour, index) => (
            <div
              key={hour.time + '-' + index}
              className="flex flex-col items-center gap-2"
            >
              <span className="text-sm opacity-90">
                {index === 0 ? 'Now' : `${hour.time}:00`}
              </span>
              {getWeatherIcon(hour.code, 36)} 
              <span className="text-xl font-semibold">{Math.round(hour.temp)}°</span>
            </div>
          ))}
        </div>
      </div>
      {/* Card-level effects (rain/stars) */}
      {(showRain || isNight) && <CardEffects showRain={showRain} isNight={isNight} />}
    </div>
  );
};

export default HourlyForecast;