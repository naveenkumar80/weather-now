# Weather Now ☀️🌧️

A fast and beautiful weather application designed for outdoor enthusiasts who need quick access to current weather conditions for any city worldwide.

## Features

### 🎯 Core Functionality
- **Instant City Search**: Search for any city globally and get real-time weather data
- **Current Temperature**: Large, easy-to-read temperature display with "feels like" information
- **Weather Conditions**: Human-readable descriptions (Clear sky, Partly cloudy, Rain, Snow, etc.)
- **Comprehensive Metrics**: 
  - Humidity percentage
  - Wind speed and direction
  - Atmospheric pressure
  - Cloud cover percentage
  - Sunrise and sunset times
- **Precipitation Alerts**: Highlights active precipitation when detected

### 🎨 User Experience
- Clean, modern gradient interface
- Responsive design that works on all devices
- Keyboard support (press Enter to search)
- Real-time loading indicators
- Clear error messages for invalid cities

## Technology Stack

- **Framework**: React with Hooks (useState)
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **API**: Open-Meteo API (free, no API key required)

## API Information

### Open-Meteo API
Weather Now uses two Open-Meteo API endpoints:

1. **Geocoding API**: Converts city names to coordinates
   - Endpoint: `https://geocoding-api.open-meteo.com/v1/search`
   - Purpose: Find latitude and longitude for searched cities

2. **Weather API**: Fetches current weather data
   - Endpoint: `https://api.open-meteo.com/v1/forecast`
   - Data Retrieved:
     - Temperature (°C)
     - Apparent temperature (feels like)
     - Relative humidity
     - Precipitation
     - Weather code (condition description)
     - Cloud cover
     - Wind speed and direction
     - Atmospheric pressure
     - Sunrise and sunset times

**Why Open-Meteo?**
- Completely free and open-source
- No API key required
- Reliable and accurate data
- Fast response times
- Privacy-friendly

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Steps

1. **Clone or create a new React project**
```bash
npx create-react-app weather-now
cd weather-now
```

2. **Install dependencies**
```bash
npm install lucide-react
```

3. **Install Tailwind CSS**
```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

4. **Configure Tailwind**

Update `tailwind.config.js`:
```javascript
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

Update `src/index.css`:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

5. **Add the Weather Now component**

Replace the contents of `src/App.js` with the Weather Now component code.

6. **Run the application**
```bash
npm start
```

The app will open at `http://localhost:3000`

## Usage Guide

### Searching for Weather

1. **Enter a city name** in the search bar (e.g., "London", "New York", "Tokyo")
2. **Press Enter** or click the search button
3. **View results** displayed in an easy-to-read format

### Understanding Weather Codes

The app translates weather codes into descriptions:
- **0**: Clear sky
- **1-3**: Clear to overcast
- **45-48**: Fog
- **51-55**: Drizzle (light to dense)
- **61-65**: Rain (slight to heavy)
- **71-77**: Snow
- **80-82**: Rain showers
- **85-86**: Snow showers
- **95-99**: Thunderstorm

### Wind Direction

Wind direction is displayed using cardinal directions:
- **N**: North
- **NE**: Northeast
- **E**: East
- **SE**: Southeast
- **S**: South
- **SW**: Southwest
- **W**: West
- **NW**: Northwest

## Component Structure

```
WeatherNow
├── State Management
│   ├── city (search input)
│   ├── weather (weather data)
│   ├── loading (loading state)
│   └── error (error messages)
├── API Functions
│   ├── getWeather (main fetch function)
│   ├── Geocoding call
│   └── Weather data call
├── Helper Functions
│   ├── getWeatherDescription
│   ├── formatTime
│   └── getWindDirection
└── UI Components
    ├── Header
    ├── Search Bar
    ├── Weather Display Card
    └── Weather Metrics Grid
```

## Customization Options

### Temperature Units
To switch from Celsius to Fahrenheit, modify the API call:
```javascript
`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,cloud_cover,wind_speed_10m,wind_direction_10m,pressure_msl&daily=sunrise,sunset&timezone=auto&temperature_unit=fahrenheit`
```

### Wind Speed Units
Change from km/h to other units by adding:
```javascript
&windspeed_unit=mph  // for miles per hour
&windspeed_unit=ms   // for meters per second
&windspeed_unit=kn   // for knots
```

### Color Scheme
Modify the gradient colors in the main container:
```javascript
// Current: Blue theme
className="min-h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 p-4"

// Example: Purple theme
className="min-h-screen bg-gradient-to-br from-purple-400 via-purple-500 to-purple-600 p-4"
```

## Error Handling

The app handles several error scenarios:
- **City not found**: Displays a helpful message to try another city
- **API failures**: Shows a generic error with retry option
- **Network issues**: Caught and displayed to the user
- **Empty searches**: Prevents empty API calls

## Browser Support

Weather Now works on all modern browsers:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance Considerations

- **API Rate Limiting**: Open-Meteo has generous rate limits for free tier
- **Caching**: Consider implementing caching for frequently searched cities
- **Debouncing**: For autocomplete features, implement search debouncing

## Future Enhancements

Potential features to add:
- [ ] 7-day weather forecast
- [ ] Hourly weather breakdown
- [ ] Weather alerts and warnings
- [ ] Favorite cities list
- [ ] Geolocation for current location weather
- [ ] Weather maps and radar
- [ ] Unit preference saving (localStorage)
- [ ] Dark mode toggle
- [ ] Multiple cities comparison
- [ ] Weather history

## Troubleshooting

### Common Issues

**Problem**: City not found
- **Solution**: Try different spellings or include country name (e.g., "Paris, France")

**Problem**: API not responding
- **Solution**: Check internet connection and verify Open-Meteo API status

**Problem**: Incorrect temperature display
- **Solution**: Verify API units parameter matches display format

## License

This project is open source and available for personal and commercial use.

## Credits

- **Weather Data**: [Open-Meteo](https://open-meteo.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Framework**: [React](https://react.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)

## Support

For outdoor enthusiasts like Jamie who need reliable weather information on the go!

---

**Built with ❤️ for outdoor adventures**