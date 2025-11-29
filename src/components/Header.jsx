import { useState, useEffect } from 'react';

export function Header({ currentTime }) {
  const [weather, setWeather] = useState(null);
  const [city, setCity] = useState('Detecting...');
  const [upcomingEvents, setUpcomingEvents] = useState([]);

  // Fetch weather and location with Nexus API integration
  useEffect(() => {
    const fetchWeather = async () => {
      try {
        // Try Nexus API first (https://eaglepython.github.io/Nexus/)
        try {
          const nexusController = new AbortController();
          const nexusTimeoutId = setTimeout(() => nexusController.abort(), 5000);

          const nexusRes = await fetch('https://eaglepython.github.io/Nexus/', {
            signal: nexusController.signal
          });
          clearTimeout(nexusTimeoutId);

          if (nexusRes.ok) {
            const nexusData = await nexusRes.json();
            if (nexusData.location?.city) {
              setCity(nexusData.location.city);
            }
            if (nexusData.weather?.temperature !== undefined) {
              setWeather({
                temp: nexusData.weather.temperature,
                code: nexusData.weather.code || 0,
                humidity: nexusData.weather.humidity || '--',
                wind: nexusData.weather.wind || '--'
              });
              return; // Success with Nexus
            }
          }
        } catch (nexusError) {
          console.debug('Nexus API unavailable, falling back to standard APIs');
        }

        // Fallback: Get location from IP
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000);

        const geoRes = await fetch('https://ipapi.co/json/', { 
          signal: controller.signal 
        });
        clearTimeout(timeoutId);
        
        if (!geoRes.ok) throw new Error('Geo fetch failed');
        const geoData = await geoRes.json();
        const cityName = geoData.city || geoData.region_code || 'Your Location';
        setCity(cityName);

        // Get weather from Open-Meteo
        const weatherController = new AbortController();
        const weatherTimeoutId = setTimeout(() => weatherController.abort(), 8000);

        const weatherRes = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${geoData.latitude}&longitude=${geoData.longitude}&current=temperature_2m,weather_code,relative_humidity,wind_speed_10m&temperature_unit=fahrenheit`,
          { signal: weatherController.signal }
        );
        clearTimeout(weatherTimeoutId);

        if (!weatherRes.ok) throw new Error('Weather fetch failed');
        const weatherData = await weatherRes.json();
        
        if (weatherData.current) {
          setWeather({
            temp: Math.round(weatherData.current.temperature_2m),
            code: weatherData.current.weather_code,
            humidity: weatherData.current.relative_humidity,
            wind: Math.round(weatherData.current.wind_speed_10m)
          });
        }
      } catch (error) {
        console.error('Weather/location error:', error.message);
        // Set safe defaults on error
        setCity('Your Location');
        setWeather({
          temp: '--',
          code: 0,
          humidity: '--',
          wind: '--'
        });
      }
    };

    fetchWeather();
    // Update every 30 minutes
    const weatherInterval = setInterval(fetchWeather, 1800000);
    return () => clearInterval(weatherInterval);
  }, []);

  // Get upcoming events/dates
  useEffect(() => {
    const events = [
      { date: new Date(2025, 11, 25), name: 'Christmas Day', emoji: '🎄' },
      { date: new Date(2025, 11, 31), name: 'New Year\'s Eve', emoji: '🎉' },
      { date: new Date(2026, 0, 1), name: 'New Year 2026', emoji: '🎆' },
      { date: new Date(2026, 0, 15), name: 'MLK Day', emoji: '🇺🇸' },
      { date: new Date(2026, 1, 14), name: 'Valentine\'s Day', emoji: '💕' },
      { date: new Date(2026, 2, 17), name: 'St. Patrick\'s Day', emoji: '🍀' },
      { date: new Date(2026, 4, 25), name: 'Memorial Day', emoji: '🇺🇸' },
      { date: new Date(2026, 6, 4), name: 'Independence Day', emoji: '🎆' },
      { date: new Date(2026, 8, 7), name: 'Labor Day', emoji: '💼' },
      { date: new Date(2026, 10, 26), name: 'Thanksgiving', emoji: '🦃' },
      { date: new Date(2026, 11, 25), name: 'Christmas 2026', emoji: '🎄' }
    ];

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const upcoming = events
      .filter(e => e.date >= today)
      .sort((a, b) => a.date - b.date)
      .slice(0, 2);

    setUpcomingEvents(upcoming);
  }, []);

  // Get weather emoji based on WMO code
  const getWeatherEmoji = (code) => {
    if (code === 0) return '☀️';           // Clear
    if (code === 1 || code === 2) return '🌤️';    // Mostly clear
    if (code === 3) return '☁️';           // Overcast
    if (code === 45 || code === 48) return '🌫️';  // Foggy
    if (code >= 51 && code <= 55) return '🌦️';    // Drizzle
    if (code >= 61 && code <= 65) return '🌧️';    // Rain
    if (code >= 71 && code <= 77) return '❄️';    // Snow
    if (code >= 80 && code <= 82) return '⛈️';    // Showers
    if (code === 85 || code === 86) return '🌨️';  // Snow showers
    if (code >= 95 && code <= 99) return '⚡';     // Thunderstorm
    return '🌤️';
  };

  // Calculate days until event
  const daysUntilEvent = (eventDate) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const target = new Date(eventDate);
    target.setHours(0, 0, 0, 0);
    const diff = target - today;
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const timeStr = currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const dateStr = currentTime.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

  return (
    <div className="glass rounded-xl md:rounded-2xl p-3 md:p-6 mb-4 md:mb-6 border-b-2 md:border-b-4 border-red-900 space-y-3 md:space-y-4">
      {/* Top Row: Title and Time */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-4">
        <div className="min-w-0">
          <h1 className="text-xl md:text-3xl lg:text-4xl font-bold text-white mb-1 break-words">⚡ LIFE EXCELLENCE TRACKER</h1>
          <p className="text-xs md:text-sm lg:text-base text-slate-300 truncate">Joseph Bidias | Life Optimization</p>
          <p className="text-red-400 text-xs md:text-sm font-semibold mt-1 line-clamp-2">📋 v1.0 | Discipline = Freedom</p>
        </div>

        {/* Time with Seconds & Date */}
        <div className="text-right bg-slate-800 rounded-lg md:rounded-xl p-2 md:p-4 border border-red-900/50 flex-shrink-0">
          <div className="text-2xl md:text-4xl lg:text-5xl font-bold text-white font-mono whitespace-nowrap">
            {timeStr}
          </div>
          <div className="text-red-400 text-xs md:text-sm truncate">{dateStr}</div>
        </div>
      </div>

      {/* Bottom Row: Weather, City, Location & Upcoming Events */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
        {/* Weather & Humidity */}
        {weather && (
          <div className="bg-slate-800/50 rounded-lg p-2 md:p-3 border border-slate-700 flex items-center gap-2 hover:bg-slate-800/70 transition">
            <span className="text-2xl md:text-3xl flex-shrink-0">{getWeatherEmoji(weather.code)}</span>
            <div className="min-w-0 flex-1">
              <div className="text-xs md:text-sm text-slate-300">Weather</div>
              <div className="text-base md:text-lg font-semibold text-white">
                {typeof weather.temp === 'number' ? `${weather.temp}°F` : weather.temp}
              </div>
              <div className="text-xs text-slate-400">{weather.humidity}% humidity</div>
            </div>
          </div>
        )}

        {/* City/Location */}
        <div className="bg-slate-800/50 rounded-lg p-2 md:p-3 border border-slate-700 flex items-center gap-2 hover:bg-slate-800/70 transition">
          <span className="text-2xl md:text-3xl flex-shrink-0">📍</span>
          <div className="min-w-0 flex-1">
            <div className="text-xs md:text-sm text-slate-300">Location</div>
            <div className="text-base md:text-lg font-semibold text-white truncate">{city}</div>
            <div className="text-xs text-slate-400">Current</div>
          </div>
        </div>

        {/* Upcoming Event 1 */}
        {upcomingEvents.length > 0 && (
          <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 rounded-lg p-2 md:p-3 border border-purple-600/30 flex items-center gap-2 hover:border-purple-500/50 transition">
            <span className="text-2xl md:text-3xl flex-shrink-0">{upcomingEvents[0].emoji}</span>
            <div className="min-w-0 flex-1">
              <div className="text-xs md:text-sm text-slate-300 truncate">{upcomingEvents[0].name}</div>
              <div className="text-base md:text-lg font-semibold text-white">{daysUntilEvent(upcomingEvents[0].date)}d</div>
              <div className="text-xs text-slate-400">away</div>
            </div>
          </div>
        )}

        {/* Upcoming Event 2 */}
        {upcomingEvents.length > 1 && (
          <div className="bg-gradient-to-br from-blue-900/30 to-cyan-900/30 rounded-lg p-2 md:p-3 border border-blue-600/30 flex items-center gap-2 hover:border-blue-500/50 transition">
            <span className="text-2xl md:text-3xl flex-shrink-0">{upcomingEvents[1].emoji}</span>
            <div className="min-w-0 flex-1">
              <div className="text-xs md:text-sm text-slate-300 truncate">{upcomingEvents[1].name}</div>
              <div className="text-base md:text-lg font-semibold text-white">{daysUntilEvent(upcomingEvents[1].date)}d</div>
              <div className="text-xs text-slate-400">away</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Header;
