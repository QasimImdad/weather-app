import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./WeatherApp.css";

// Decorative wavy underline SVG for active tabs
const WavyUnderline = () => (
  <svg
    className="wavy-underline-svg"
    viewBox="0 0 50 8"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M1 4C4 1 7 7 10 4C13 1 16 7 19 4C22 1 25 7 28 4C31 1 34 7 37 4C40 1 43 7 46 4"
      stroke="white"
      strokeWidth="2.2"
      strokeLinecap="round"
    />
  </svg>
);

// Sunrise SVG Icon
const SunriseIcon = () => (
  <svg
    className="sun-icon-svg"
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 28C12 21.3726 17.3726 16 24 16C30.6274 16 36 21.3726 36 28"
      stroke="#a4abb8"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
    <path d="M8 34H40" stroke="#a4abb8" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M24 8V13" stroke="#a4abb8" strokeWidth="2.5" strokeLinecap="round" />
    <path
      d="M20 10L24 6L28 10"
      stroke="#a4abb8"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Sunset SVG Icon
const SunsetIcon = () => (
  <svg
    className="sun-icon-svg"
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 28C12 21.3726 17.3726 16 24 16C30.6274 16 36 21.3726 36 28"
      stroke="#a4abb8"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
    <path d="M8 34H40" stroke="#a4abb8" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M24 6V11" stroke="#a4abb8" strokeWidth="2.5" strokeLinecap="round" />
    <path
      d="M20 9L24 13L28 9"
      stroke="#a4abb8"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Helper to map weather conditions to beautiful custom 3D icons in /assests/images
const getCustomWeatherIcon = (conditionText, iconUrl = "", isDay = 1) => {
  const text = (conditionText || "").toLowerCase();
  const url = (iconUrl || "").toLowerCase();
  const isNight = isDay === 0 || url.includes("night");

  if (text.includes("thunder") || text.includes("storm") || text.includes("lightning")) {
    return "/assests/images/vecteezy_thunderstorm-on-transparent-background_19552647 1.png";
  }
  if (text.includes("heavy rain") || text.includes("torrential") || text.includes("heavy shower")) {
    return isNight
      ? "/assests/images/vecteezy_rainy-night-on-transparent-background_19781576 1.png"
      : "/assests/images/vecteezy_rain-on-transparent-background_19781571 1.png";
  }
  if (text.includes("rain") || text.includes("drizzle") || text.includes("shower") || text.includes("sleet")) {
    return isNight
      ? "/assests/images/vecteezy_rainy-night-on-transparent-background_19781576 1.png"
      : "/assests/images/vecteezy_cloudy-rain-on-transparent-background_19781539 1 (1).png";
  }
  if (text.includes("wind") || text.includes("breezy") || text.includes("gale")) {
    return isNight
      ? "/assests/images/vecteezy_windy-night-on-transparent-background_19552645 1.png"
      : "/assests/images/vecteezy_windy-cloud-on-transparent-background_19552646 1.png";
  }
  if (text.includes("cloud") || text.includes("overcast") || text.includes("fog") || text.includes("mist") || text.includes("haze")) {
    return isNight
      ? "/assests/images/vecteezy_windy-night-on-transparent-background_19552645 1.png"
      : "/assests/images/vecteezy_cloudy-on-transparent-background_19781556 1.png";
  }
  if (text.includes("sun") || text.includes("clear") || text.includes("fair")) {
    return isNight
      ? "/assests/images/vecteezy_starry-moon-on-transparent-background_19781537 1.png"
      : "/assests/images/vecteezy_sun-on-transparent-background_19781530 1.png";
  }

  // Fallbacks based on day/night
  if (isNight) {
    return "/assests/images/vecteezy_starry-moon-on-transparent-background_19781537 1.png";
  }
  return "/assests/images/vecteezy_sun-on-transparent-background_19781530 1.png";
};

function WeatherApp() {
  // --- STATE VARIABLES ---
  const [searchInput, setSearchInput] = useState("");
  const [currentCity, setCurrentCity] = useState("Lahore");
  const [activeTab, setActiveTab] = useState("Week");
  const [weatherData, setWeatherData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const API_KEY = import.meta.env.VITE_WEATHER_API_KEY || "4005fce511ab44f1a1f52138261108";

  // --- FETCH WEATHER DATA FROM API ---
  const fetchWeather = async (cityQuery) => {
    if (!cityQuery || cityQuery.trim() === "") {
      setErrorMsg("Please enter a city name to search.");
      return;
    }

    setIsLoading(true);
    setErrorMsg("");

    try {
      const url = `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${encodeURIComponent(
        cityQuery
      )}&days=7&aqi=yes&alerts=no`;

      const response = await fetch(url);
      const data = await response.json();

      if (!response.ok || data.error) {
        setErrorMsg(data.error?.message || "City not found. Please try another city.");
        setIsLoading(false);
        return;
      }

      setWeatherData(data);
      setCurrentCity(data.location.name);
      setIsLoading(false);
    } catch (err) {
      console.error("Fetch weather error:", err);
      setErrorMsg("Unable to connect to weather service. Please check connection.");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather(currentCity);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      fetchWeather(searchInput);
    } else {
      setErrorMsg("Please enter a city name.");
    }
  };

  const getDayName = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { weekday: "short" });
  };

  const formatHourTime = (timeStr) => {
    const date = new Date(timeStr);
    return date.toLocaleTimeString("en-US", { hour: "numeric", hour12: true });
  };

  const getEpaAqiTag = (epaIndex) => {
    switch (epaIndex) {
      case 1:
        return { label: "Good", class: "good" };
      case 2:
        return { label: "Moderate", class: "moderate" };
      case 3:
        return { label: "Unhealthy (Sensitive)", class: "moderate" };
      case 4:
        return { label: "Unhealthy", class: "unhealthy" };
      case 5:
        return { label: "Very Unhealthy", class: "unhealthy" };
      case 6:
        return { label: "Hazardous", class: "unhealthy" };
      default:
        return { label: "Normal", class: "normal" };
    }
  };

  const current = weatherData?.current;
  const location = weatherData?.location;
  const forecastDays = weatherData?.forecast?.forecastday || [];
  const todayForecast = forecastDays[0] || {};
  const airQuality = current?.air_quality;

  // Determine current hour index based on city local time or system time
  const getCurrentHourIndex = () => {
    if (location?.localtime) {
      const parts = location.localtime.split(" ");
      if (parts[1]) {
        const hourNum = parseInt(parts[1].split(":")[0], 10);
        if (!isNaN(hourNum)) return hourNum;
      }
    }
    return new Date().getHours();
  };

  const currentHourIndex = getCurrentHourIndex();

  // Combine today's and tomorrow's hourly forecast data
  const todayHours = forecastDays[0]?.hour || [];
  const tomorrowHours = forecastDays[1]?.hour || [];
  const combinedHours = [...todayHours, ...tomorrowHours];

  // Slice 24 upcoming hours starting from the current hour
  const upcoming24Hours = combinedHours.length > 0
    ? combinedHours.slice(currentHourIndex, currentHourIndex + 24)
    : [];

  // Filter 8 intervals for precipitation chart X-axis
  const chartHours = todayHours.filter((_, idx) => idx % 3 === 0);

  // Dynamic SVG path for precipitation graph
  const generateChartPath = () => {
    if (!chartHours || chartHours.length === 0) return { linePath: "", areaPath: "" };

    const startX = 45;
    const endX = 410;
    const stepX = (endX - startX) / (chartHours.length - 1);

    const points = chartHours.map((h, i) => {
      const chance = h.chance_of_rain || 0;
      const x = startX + i * stepX;
      const y = 95 - (chance / 100) * 77;
      return { x, y, chance };
    });

    const linePath = points.reduce(
      (acc, p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`),
      ""
    );

    const areaPath = `${linePath} L ${points[points.length - 1].x} 98 L ${points[0].x} 98 Z`;

    return { linePath, areaPath, points };
  };

  const chartData = generateChartPath();

  return (
    <div className="weather-dashboard-wrapper">
      <div className="container-fluid weather-dashboard-container">
        
        {/* ERROR BANNER */}
        {errorMsg && (
          <div className="alert alert-danger alert-dismissible fade show mb-4 text-center" role="alert">
            <i className="bi bi-exclamation-triangle-fill me-2"></i>
            {errorMsg}
          </div>
        )}

        {/* LOADING SPINNER STATE */}
        {isLoading ? (
          <div className="loading-container text-center py-5">
            <div className="spinner-border text-light mb-3" role="status" style={{ width: "3rem", height: "3rem" }}>
              <span className="visually-hidden">Loading...</span>
            </div>
            <h5 className="text-light">Loading weather...</h5>
          </div>
        ) : (
          /* MAIN DASHBOARD CONTENT MATCHING DESIGN */
          <div className="row g-4">
            
            {/* LEFT SIDEBAR PANEL */}
            <div className="col-12 col-lg-4 col-xl-3.5">
              <div className="sidebar-panel">
                <div>
                  {/* Search Bar Form */}
                  <form onSubmit={handleSearchSubmit} className="search-box-wrapper">
                    <i className="bi bi-search search-icon"></i>
                    <input
                      className="search-input"
                      type="text"
                      placeholder="Search city..."
                      value={searchInput}
                      onChange={(e) => setSearchInput(e.target.value)}
                    />
                    <button type="submit" className="search-btn">
                      Search
                    </button>
                  </form>

                  {/* Main Weather Graphic */}
                  <div className="sidebar-weather-visual">
                    <img
                      className="main-weather-img"
                      src={getCustomWeatherIcon(current?.condition?.text, current?.condition?.icon, current?.is_day)}
                      alt={current?.condition?.text || "Weather Icon"}
                    />
                  </div>

                  {/* Temperature Display */}
                  <div className="temp-display">
                    {Math.round(current?.temp_c)}
                    <span>°C</span>
                  </div>

                  {/* City and Day Row */}
                  <div className="city-day-row">
                    <span>{location?.name || "Lahore"}</span>
                    <span>
                      {new Date(location?.localtime || Date.now()).toLocaleDateString("en-US", { weekday: "long" })}
                    </span>
                  </div>

                  {/* Weather Details List */}
                  <div className="weather-details-list">
                    <div className="detail-item">
                      <img
                        src={getCustomWeatherIcon(current?.condition?.text, current?.condition?.icon, current?.is_day)}
                        alt="Condition"
                        className="detail-asset-img"
                      />
                      <span>{current?.condition?.text || "Sunny"}</span>
                    </div>
                    <div className="detail-item">
                      <i className="bi bi-thermometer-snow"></i>
                      <span>Min Temperature - {Math.round(todayForecast?.day?.mintemp_c)}°C</span>
                    </div>
                    <div className="detail-item">
                      <i className="bi bi-thermometer-sun"></i>
                      <span>Max Temperature - {Math.round(todayForecast?.day?.maxtemp_c)}°C</span>
                    </div>
                  </div>
                </div>

                {/* Bottom Humidity & Wind Pill */}
                <div className="sidebar-bottom-pill">
                  <div className="pill-stat">
                    <img src="/assests/images/water.png" alt="Humidity" className="pill-asset-img" />
                    <div className="pill-info">
                      <span className="pill-value">{current?.humidity}%</span>
                      <span className="pill-label">Humidity</span>
                    </div>
                  </div>

                  <div className="pill-stat">
                    <img src="/assests/images/wind.png" alt="Wind Speed" className="pill-asset-img" />
                    <div className="pill-info">
                      <span className="pill-value">{current?.wind_kph}km/h</span>
                      <span className="pill-label">Wind Speed</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT MAIN OVERVIEW PANEL */}
            <div className="col-12 col-lg-8 col-xl-8.5">
              <div className="main-panel">
                
                {/* Top Navigation Tabs */}
                <div className="nav-tabs-wrapper">
                  <span
                    className={`tab-item ${activeTab === "Today" ? "active" : "inactive"}`}
                    onClick={() => setActiveTab("Today")}
                  >
                    Today
                    {activeTab === "Today" && <WavyUnderline />}
                  </span>
                  <span
                    className={`tab-item ${activeTab === "Week" ? "active" : "inactive"}`}
                    onClick={() => setActiveTab("Week")}
                  >
                    Week
                    {activeTab === "Week" && <WavyUnderline />}
                  </span>
                </div>

                {/* Forecast Grid Cards */}
                {activeTab === "Week" ? (
                  /* 7-DAY FORECAST VIEW */
                  <div className="weekly-cards-grid">
                    {forecastDays.map((item, index) => (
                      <div className="weekly-card" key={index}>
                        <span className="weekly-card-day">
                          {index === 0 ? "Today" : getDayName(item.date)}
                        </span>
                        <img
                          src={getCustomWeatherIcon(item.day?.condition?.text, item.day?.condition?.icon, 1)}
                          alt={item.day?.condition?.text}
                          className="weekly-card-img"
                        />
                        <span className="weekly-card-temp">{Math.round(item.day?.maxtemp_c)}°</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  /* HOURLY FORECAST STARTING FROM CURRENT HOUR ("NOW") */
                  <div className="hourly-scroll-grid">
                    {upcoming24Hours.map((item, index) => {
                      const isNow = index === 0;
                      return (
                        <div className={`weekly-card hourly-card ${isNow ? "now-card" : ""}`} key={index}>
                          <span className="weekly-card-day">{isNow ? "Now" : formatHourTime(item.time)}</span>
                          <img
                            src={getCustomWeatherIcon(item.condition?.text, item.condition?.icon, item.is_day)}
                            alt={item.condition?.text}
                            className="weekly-card-img"
                          />
                          <span className="weekly-card-temp">{Math.round(item.temp_c)}°</span>
                          <div className="hourly-humidity-badge">
                            <img src="/assests/images/water.png" alt="Humidity" className="humidity-icon-img" />
                            <span>{item.humidity !== undefined ? item.humidity : item.chance_of_rain}%</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Today's Overview Title */}
                <div className="overview-header">Today's Overview</div>

                {/* Overview Cards Row 1 (Air Quality, UV, Pressure) */}
                <div className="overview-grid-top">
                  
                  {/* Air Quality Index Card */}
                  <div className="overview-stat-card">
                    <span className="stat-card-title">Air Quality Index</span>
                    <div className="stat-card-value">
                      {airQuality?.["us-epa-index"] ? Math.round(airQuality.pm2_5 || 23) : 23}
                    </div>
                    <div className="stat-card-footer">
                      <span className={`stat-tag ${getEpaAqiTag(airQuality?.["us-epa-index"]).class}`}>
                        {getEpaAqiTag(airQuality?.["us-epa-index"]).label}
                      </span>
                      <img src="/assests/images/air-pollution.png" alt="Air Quality" className="overview-card-asset-icon" />
                    </div>
                  </div>

                  {/* UV Index Card */}
                  <div className="overview-stat-card">
                    <span className="stat-card-title">UV Index</span>
                    <div className="stat-card-value">{current?.uv ?? 1}</div>
                    <div className="stat-card-footer">
                      <span className="stat-tag moderate">
                        {current?.uv <= 2 ? "Low" : current?.uv <= 5 ? "Moderate" : "High"}
                      </span>
                      <img src="/assests/images/uv.png" alt="UV Index" className="overview-card-asset-icon" />
                    </div>
                  </div>

                  {/* Pressure Card */}
                  <div className="overview-stat-card">
                    <span className="stat-card-title">Pressure (hpa)</span>
                    <div className="stat-card-value">{current?.pressure_mb || 1001}</div>
                    <div className="stat-card-footer">
                      <span className="stat-tag normal">Normal</span>
                      <img src="/assests/images/barometer.png" alt="Pressure" className="overview-card-asset-icon" />
                    </div>
                  </div>
                </div>

                {/* Overview Cards Row 2 (Precipitation & Sun Schedule) */}
                <div className="overview-grid-bottom">
                  
                  {/* Precipitation Card */}
                  <div className="precip-card">
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="stat-card-title">Precipitation</span>
                      <span className="precip-value-badge">
                        {todayForecast?.day?.daily_chance_of_rain || 0}% chance ({todayForecast?.day?.totalprecip_mm || 0} mm)
                      </span>
                    </div>
                    <div className="chart-wrapper">
                      <svg viewBox="0 0 420 120" style={{ width: "100%", height: "100%" }}>
                        <defs>
                          <linearGradient id="precipGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.25" />
                            <stop offset="100%" stopColor="#ffffff" stopOpacity="0.0" />
                          </linearGradient>
                        </defs>

                        {/* Grid Lines */}
                        <line x1="45" y1="15" x2="410" y2="15" stroke="rgba(255,255,255,0.08)" strokeDasharray="3 3" />
                        <line x1="45" y1="35" x2="410" y2="35" stroke="rgba(255,255,255,0.08)" strokeDasharray="3 3" />
                        <line x1="45" y1="55" x2="410" y2="55" stroke="rgba(255,255,255,0.08)" strokeDasharray="3 3" />
                        <line x1="45" y1="75" x2="410" y2="75" stroke="rgba(255,255,255,0.08)" strokeDasharray="3 3" />
                        <line x1="45" y1="95" x2="410" y2="95" stroke="rgba(255,255,255,0.08)" strokeDasharray="3 3" />

                        {/* Y-axis Ticks */}
                        <text x="5" y="18" fill="#6c727c" fontSize="10">100%</text>
                        <text x="10" y="38" fill="#6c727c" fontSize="10">80%</text>
                        <text x="10" y="58" fill="#6c727c" fontSize="10">60%</text>
                        <text x="10" y="78" fill="#6c727c" fontSize="10">40%</text>
                        <text x="10" y="98" fill="#6c727c" fontSize="10">20%</text>

                        {/* X-axis Ticks */}
                        {chartData.points?.map((p, idx) => (
                          <text key={idx} x={p.x - 10} y="115" fill="#6c727c" fontSize="9">
                            {chartHours[idx] ? formatHourTime(chartHours[idx].time) : ""}
                          </text>
                        ))}

                        {/* Area Fill */}
                        {chartData.areaPath && <path d={chartData.areaPath} fill="url(#precipGradient)" />}

                        {/* Line Graph Curve */}
                        {chartData.linePath && (
                          <path
                            d={chartData.linePath}
                            fill="none"
                            stroke="#ffffff"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                          />
                        )}
                      </svg>
                    </div>
                  </div>

                  {/* Sunrise & Sunset Card */}
                  <div className="sun-card">
                    <span className="stat-card-title">Sunrise & Sunset</span>
                    <div className="sun-events-container">
                      <div className="sun-item">
                        <SunriseIcon />
                        <div className="sun-info">
                          <span className="sun-label">Sunrise</span>
                          <span className="sun-time">{todayForecast?.astro?.sunrise || "05:53 AM"}</span>
                        </div>
                      </div>
                      <div className="sun-item">
                        <SunsetIcon />
                        <div className="sun-info">
                          <span className="sun-label">Sunset</span>
                          <span className="sun-time">{todayForecast?.astro?.sunset || "05:54 PM"}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>

              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}

export default WeatherApp;
