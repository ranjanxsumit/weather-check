import React, { useState } from 'react';
import WeatherCard from './components/WeatherCard';
import RainAnimation from './components/RainAnimation';
import CardEffects from './components/CardEffects';
import DailyForecast from './components/DailyForecast';
import HourlyForecast from './components/HourlyForecast';
import { getWeatherVisuals } from './utils/weatherUtils.jsx';

function App() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [weather, setWeather] = useState(null);
  const [suggestions, setSuggestions] = useState([]);

  async function handleSearch(e) {
    e && e.preventDefault();
    if (!query) return;
    setLoading(true);
    setError(null);
    setWeather(null);
    try {
      // 1. Geocoding
      const geoRes = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=1`
      );
      if (!geoRes.ok) throw new Error('Geocoding failed');
      const geo = await geoRes.json();
      if (!geo.results || geo.results.length === 0) {
        setError('City not found');
        setLoading(false);
        return;
      }
      const { latitude, longitude, name, country } = geo.results[0];

      // 2. Weather API Call (include sunrise/sunset for precise day/night)
      const weatherRes = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&hourly=temperature_2m,weathercode&daily=weathercode,temperature_2m_max,temperature_2m_min,sunrise,sunset&timezone=auto`
      );
      if (!weatherRes.ok) {
        const errJson = await weatherRes.json();
        throw new Error(errJson.reason || 'Weather fetch failed');
      }
      const weatherJson = await weatherRes.json();
      if (!weatherJson.current_weather) throw new Error('No current weather');

      // 3. Set all weather data in state
      setWeather({
        place: `${name}, ${country}`,
        latitude,
        longitude,
        current: weatherJson.current_weather,
        hourly: weatherJson.hourly,
        daily: weatherJson.daily,
      });
    } catch (err) {
      console.error(err);
      setError(err.message || 'Unknown error');
    } finally {
      setLoading(false);
    }
  }

  let visuals = { bgClass: 'bg-sunny', showRain: false };
  let isNight = false;
  let showRain = false;
  if (weather) {
    visuals = getWeatherVisuals(weather.current.weathercode);
    // decide final rain visibility: prefer visuals.showRain, but also check hourly data
    showRain = !!visuals.showRain;
    try {
      if (!showRain && weather.hourly && weather.current && Array.isArray(weather.hourly.weathercode)) {
        const times = weather.hourly.time || [];
        const codes = weather.hourly.weathercode;
        const rainCodes = [51, 53, 55, 61, 63, 65, 80, 95];
        const currentTime = new Date(weather.current.time).getTime();

        // find the hourly index closest to current_time
        let bestIdx = -1;
        let bestDiff = Infinity;
        for (let i = 0; i < times.length; i++) {
          const t = Date.parse(times[i]);
          if (Number.isNaN(t)) continue;
          const diff = Math.abs(t - currentTime);
          if (diff < bestDiff) {
            bestDiff = diff;
            bestIdx = i;
          }
        }

        if (bestIdx !== -1) {
          // check a small window around the best index (prev, best, next)
          for (let offset = -1; offset <= 1; offset++) {
            const idx = bestIdx + offset;
            if (idx >= 0 && idx < codes.length) {
              const c = codes[idx];
              if (rainCodes.includes(c)) {
                showRain = true;
                break;
              }
            }
          }
        }
      }
    } catch (e) {
      // ignore parsing errors
    }

    // determine day/night using sunrise/sunset from the API (preferred) or fallback to hour parsing
    try {
      let night = false;
      if (
        weather.daily &&
        Array.isArray(weather.daily.time) &&
        Array.isArray(weather.daily.sunrise) &&
        Array.isArray(weather.daily.sunset)
      ) {
        const currentDate = String(weather.current.time).split('T')[0]; // 'YYYY-MM-DD'
        const dayIdx = weather.daily.time.findIndex((d) => d === currentDate);
        if (dayIdx !== -1) {
          const sunriseStr = weather.daily.sunrise[dayIdx];
          const sunsetStr = weather.daily.sunset[dayIdx];
          const nowTs = Date.parse(weather.current.time);
          const sunriseTs = Date.parse(sunriseStr);
          const sunsetTs = Date.parse(sunsetStr);
          if (Number.isFinite(nowTs) && Number.isFinite(sunriseTs) && Number.isFinite(sunsetTs)) {
            if (nowTs < sunriseTs || nowTs >= sunsetTs) night = true;
          }
        }
      }

      // fallback: if we couldn't determine using sunrise/sunset, parse hour from timestamp
      if (!night) {
        let hour = null;
        if (typeof weather.current.time === 'string') {
          const m = weather.current.time.match(/T(\d{2}):(\d{2})/);
          if (m) hour = parseInt(m[1], 10);
        }
        if (hour === null) hour = new Date(weather.current.time).getHours();
        if (hour < 6 || hour >= 18) night = true;
      }

      isNight = night;
      if (isNight) {
        visuals.bgClass = 'bg-night';
      } else if (showRain) {
        visuals.bgClass = 'bg-rainy';
      } else {
        // morning preference: if hour between 6-12 show sunny; otherwise keep default
        const m = String(weather.current.time).match(/T(\d{2}):(\d{2})/);
        const hour = m ? parseInt(m[1], 10) : new Date(weather.current.time).getHours();
        if (hour >= 6 && hour < 12) visuals.bgClass = 'bg-sunny';
      }
    } catch (e) {
      // keep defaults on error
    }
  }

  return (
    <div
      className={`h-dvh overflow-auto md:overflow-hidden transition-all duration-1000 ${visuals.bgClass} relative`}
    >
      {showRain && <RainAnimation />}

      <div className="relative z-10 h-full flex flex-col">

        {/* Compact, independent search header — absolute so it doesn't affect card centering */}
        <header className="static lg:absolute lg:left-6 lg:top-6 lg:z-20 p-2 lg:p-2 w-full lg:w-auto">
          <form onSubmit={handleSearch} className="relative flex gap-2 items-center p-1 bg-white/3 lg:bg-transparent rounded-lg w-full lg:w-auto">
            <div className="relative w-full lg:w-44">
              <input
                className="glass p-2 rounded-lg text-white placeholder-white/60 focus:outline-none border border-white/10 w-full"
                placeholder="Enter city"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  if (e.target.value.length > 2) {
                    fetch(
                      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(e.target.value)}&count=5`
                    )
                      .then((res) => res.json())
                      .then((data) => {
                        setSuggestions(data.results || []);
                      })
                      .catch(() => setSuggestions([]));
                  } else {
                    setSuggestions([]);
                  }
                }}
                onBlur={() => setTimeout(() => setSuggestions([]), 200)}
              />
              {suggestions.length > 0 && (
                <ul className="absolute top-full left-0 right-0 mt-1 bg-white/20 backdrop-blur-md border border-white/10 rounded-lg shadow-lg overflow-hidden z-50">
                  {suggestions.map((city) => (
                    <li
                      key={city.id}
                      className="px-3 py-2 text-white hover:bg-white/20 cursor-pointer text-sm"
                      onClick={() => {
                        setQuery(`${city.name}, ${city.country}`);
                        setSuggestions([]);
                        // Optional: Trigger search immediately
                        // handleSearch(); 
                      }}
                    >
                      {city.name}, {city.country}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <button
              type="submit"
              onClick={handleSearch}
              className="px-3 py-2 rounded-lg bg-white/20 text-white hover:bg-white/30 transition"
              disabled={loading}
            >
              {loading ? '...' : 'Search'}
            </button>
          </form>

          {error && (
            <div className="mt-4 rounded-lg p-4 bg-red-600/20 text-red-100">
              {error}
            </div>
          )}
        </header>

        <main className="flex-grow flex items-center justify-center px-6 pb-6 lg:pt-20">

          <div className="flex flex-col gap-6 w-full max-w-4xl mx-auto items-center px-4 md:px-0">

            {/* --- TOP ROW --- */}
            {/* Stack on small screens, side-by-side on md+; make cards responsive */}
            <div className="flex flex-col md:flex-row gap-6 items-center justify-center w-full max-w-[760px] md:max-w-[760px] lg:max-w-[816px] mx-auto">

              {/* Card 1: Main (Current) */}
              <div className="glass p-4 sm:p-6 rounded-2xl shadow-xl w-full md:max-w-[340px] md:min-h-[340px] lg:max-w-[396px] lg:min-h-[396px] flex-none relative overflow-hidden">
                {/* effects sit under the card content */}
                <CardEffects showRain={showRain} isNight={isNight} />
                <div className="relative z-10">
                  {weather ? (
                    <WeatherCard
                      place={weather.place}
                      current={weather.current}
                    />
                  ) : (
                    // UPDATED: 'min-h-[400px]' changed to 'min-h-[300px]'
                    <div className="text-white/90 text-center py-10 min-h-[300px] flex flex-col items-center justify-center">
                      <h1 className="text-3xl font-bold text-white mb-4">Weather Now</h1>
                      Search for a city to see the forecast.
                    </div>
                  )}
                </div>
              </div>

              {/* Card 2: Daily (7-Day) */}
              {weather && (
                <div className="glass p-4 sm:p-6 rounded-2xl shadow-xl w-full md:max-w-[340px] md:min-h-[340px] lg:max-w-[396px] lg:min-h-[396px] flex-none relative overflow-hidden">
                  <CardEffects showRain={showRain} isNight={isNight} />
                  <div className="relative z-10">
                    <DailyForecast daily={weather.daily} />
                  </div>
                </div>
              )}
            </div>

            {/* --- BOTTOM ROW --- */}
            {/* Card 3: Hourly */}
            {weather && (
              <HourlyForecast
                hourly={weather.hourly}
                currentWeatherTime={weather.current.time}
                showRain={showRain}
                isNight={isNight}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;