import React, { useState, useEffect, useRef } from 'react';
import { Search, Cloud, Wind, Droplets, Eye, Gauge, Sunrise, Sunset, MapPin } from 'lucide-react';

export default function WeatherNow() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const suggestionsRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target) &&
          inputRef.current && !inputRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (city.trim().length < 2) {
        setSuggestions([]);
        setShowSuggestions(false);
        return;
      }

      try {
        const res = await fetch(
          `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=5&language=en&format=json`
        );
        const data = await res.json();

        if (data.results && data.results.length > 0) {
          setSuggestions(data.results);
          setShowSuggestions(true);
        } else {
          setSuggestions([]);
          setShowSuggestions(false);
        }
      } catch (err) {
        setSuggestions([]);
      }
    };

    const debounce = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounce);
  }, [city]);

  const getWeather = async (selectedCity = null) => {
    const searchCity = selectedCity || city;
    if (!searchCity.trim()) return;

    setLoading(true);
    setError('');
    setWeather(null);
    setShowSuggestions(false);

    try {
      const geoRes = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(searchCity)}&count=1&language=en&format=json`
      );
      const geoData = await geoRes.json();

      if (!geoData.results || geoData.results.length === 0) {
        setError('City not found. Please try another city.');
        setLoading(false);
        return;
      }

      const { latitude, longitude, name, country, admin1 } = geoData.results[0];

      const weatherRes = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,cloud_cover,wind_speed_10m,wind_direction_10m,pressure_msl&daily=sunrise,sunset&timezone=auto`
      );
      const weatherData = await weatherRes.json();

      setWeather({
        location: `${name}, ${admin1 ? admin1 + ', ' : ''}${country}`,
        ...weatherData.current,
        sunrise: weatherData.daily.sunrise[0],
        sunset: weatherData.daily.sunset[0],
        timezone: weatherData.timezone
      });
    } catch (err) {
      setError('Failed to fetch weather data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    const cityName = `${suggestion.name}, ${suggestion.country}`;
    setCity(cityName);
    setShowSuggestions(false);
    setSelectedIndex(-1);
    getWeather(cityName);
  };

  const handleKeyDown = (e) => {
    if (!showSuggestions || suggestions.length === 0) {
      if (e.key === 'Enter') {
        getWeather();
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
          handleSuggestionClick(suggestions[selectedIndex]);
        } else {
          getWeather();
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedIndex(-1);
        break;
      default:
        break;
    }
  };

  const getWeatherDescription = (code) => {
    const descriptions = {
      0: 'Clear sky',
      1: 'Mainly clear',
      2: 'Partly cloudy',
      3: 'Overcast',
      45: 'Foggy',
      48: 'Foggy',
      51: 'Light drizzle',
      53: 'Moderate drizzle',
      55: 'Dense drizzle',
      61: 'Slight rain',
      63: 'Moderate rain',
      65: 'Heavy rain',
      71: 'Slight snow',
      73: 'Moderate snow',
      75: 'Heavy snow',
      77: 'Snow grains',
      80: 'Slight rain showers',
      81: 'Moderate rain showers',
      82: 'Violent rain showers',
      85: 'Slight snow showers',
      86: 'Heavy snow showers',
      95: 'Thunderstorm',
      96: 'Thunderstorm with hail',
      99: 'Thunderstorm with hail'
    };
    return descriptions[code] || 'Unknown';
  };

  const formatTime = (isoTime) => {
    const date = new Date(isoTime);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const getWindDirection = (degrees) => {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    return directions[Math.round(degrees / 45) % 8];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8 pt-8">
          <h1 className="text-4xl font-bold text-white mb-2">Weather Now</h1>
          <p className="text-blue-100">Quick weather conditions for any city</p>
        </div>

        <div className="mb-8 relative">
          <div className="relative">
            <input
              ref={inputRef}
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
              placeholder="Enter city name..."
              className="w-full px-6 py-4 pr-14 rounded-full text-lg shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-300"
              autoComplete="off"
            />
            <button
              onClick={() => getWeather()}
              disabled={loading}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700 transition-colors disabled:bg-gray-400"
            >
              <Search size={20} />
            </button>
          </div>

          {showSuggestions && suggestions.length > 0 && (
            <div
              ref={suggestionsRef}
              className="absolute w-full mt-2 bg-white rounded-2xl shadow-2xl overflow-hidden z-10 max-h-80 overflow-y-auto"
            >
              {suggestions.map((suggestion, index) => (
                <div
                  key={`${suggestion.id}-${index}`}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className={`px-6 py-4 cursor-pointer transition-colors border-b border-gray-100 last:border-b-0 ${
                    index === selectedIndex
                      ? 'bg-blue-50'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <MapPin size={18} className="text-blue-600 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-gray-800 truncate">
                        {suggestion.name}
                      </div>
                      <div className="text-sm text-gray-600 truncate">
                        {[suggestion.admin1, suggestion.country]
                          .filter(Boolean)
                          .join(', ')}
                      </div>
                    </div>
                    {suggestion.population && (
                      <div className="text-xs text-gray-500 flex-shrink-0">
                        Pop: {(suggestion.population / 1000000).toFixed(1)}M
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        {loading && (
          <div className="text-center text-white text-xl py-12">
            <div className="animate-pulse">Loading weather data...</div>
          </div>
        )}

        {weather && !loading && (
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-8">
              <div className="flex items-center gap-2 mb-2">
                <MapPin size={20} />
                <h2 className="text-2xl font-semibold">{weather.location}</h2>
              </div>
              <div className="flex items-center justify-between mt-6">
                <div>
                  <div className="text-6xl font-bold">{Math.round(weather.temperature_2m)}°C</div>
                  <div className="text-xl mt-2 opacity-90">
                    Feels like {Math.round(weather.apparent_temperature)}°C
                  </div>
                </div>
                <Cloud size={80} className="opacity-80" />
              </div>
              <div className="text-xl mt-4 capitalize opacity-90">
                {getWeatherDescription(weather.weather_code)}
              </div>
            </div>

            <div className="p-6 grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 p-4 rounded-xl">
                <div className="flex items-center gap-2 text-blue-600 mb-2">
                  <Droplets size={20} />
                  <span className="text-sm font-medium">Humidity</span>
                </div>
                <div className="text-2xl font-bold text-gray-800">
                  {weather.relative_humidity_2m}%
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-xl">
                <div className="flex items-center gap-2 text-blue-600 mb-2">
                  <Wind size={20} />
                  <span className="text-sm font-medium">Wind</span>
                </div>
                <div className="text-2xl font-bold text-gray-800">
                  {Math.round(weather.wind_speed_10m)} km/h
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  {getWindDirection(weather.wind_direction_10m)}
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-xl">
                <div className="flex items-center gap-2 text-blue-600 mb-2">
                  <Gauge size={20} />
                  <span className="text-sm font-medium">Pressure</span>
                </div>
                <div className="text-2xl font-bold text-gray-800">
                  {Math.round(weather.pressure_msl)} hPa
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-xl">
                <div className="flex items-center gap-2 text-blue-600 mb-2">
                  <Cloud size={20} />
                  <span className="text-sm font-medium">Cloud Cover</span>
                </div>
                <div className="text-2xl font-bold text-gray-800">
                  {weather.cloud_cover}%
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-xl">
                <div className="flex items-center gap-2 text-blue-600 mb-2">
                  <Sunrise size={20} />
                  <span className="text-sm font-medium">Sunrise</span>
                </div>
                <div className="text-xl font-bold text-gray-800">
                  {formatTime(weather.sunrise)}
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-xl">
                <div className="flex items-center gap-2 text-blue-600 mb-2">
                  <Sunset size={20} />
                  <span className="text-sm font-medium">Sunset</span>
                </div>
                <div className="text-xl font-bold text-gray-800">
                  {formatTime(weather.sunset)}
                </div>
              </div>
            </div>

            {weather.precipitation > 0 && (
              <div className="px-6 pb-6">
                <div className="bg-blue-100 border-l-4 border-blue-600 p-4 rounded">
                  <div className="flex items-center gap-2">
                    <Droplets className="text-blue-600" size={20} />
                    <span className="font-medium text-gray-800">
                      Current precipitation: {weather.precipitation} mm
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {!weather && !loading && !error && (
          <div className="text-center text-white text-lg py-12 opacity-75">
            Enter a city name to check the weather conditions
          </div>
        )}
      </div>
    </div>
  );
}