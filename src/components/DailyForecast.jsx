import React from 'react';
import { getWeatherIcon } from '../utils/weatherUtils.jsx';

const DailyForecast = ({ daily }) => {
  const days = daily.time.map((time, index) => {
    const dayName = new Date(time).toLocaleString('en-US', { weekday: 'short' });
    return {
      day: index === 0 ? 'Today' : dayName,
      code: daily.weathercode[index],
      max: daily.temperature_2m_max[index],
      min: daily.temperature_2m_min[index],
    };
  });

  return (
    // UPDATED: Removed 'h-full' and 'flex-col'
    <div className="text-white">
      <h3 className="text-sm opacity-70 mb-3">7-DAY FORECAST</h3>
      
      {/* UPDATED: Removed 'flex-grow' and 'justify-between' */}
      <div className="flex flex-col gap-3">
        {days.map((day) => (
          <div key={day.day} className="flex items-center justify-between">
            <span className="font-medium w-12">{day.day}</span>
            {getWeatherIcon(day.code, 28)}
            <div className="flex items-center gap-2">
              <span className="font-medium">{Math.round(day.max)}°</span>
              <span className="opacity-60">{Math.round(day.min)}°</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DailyForecast;