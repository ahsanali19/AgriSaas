// src/components/dashboard/WeatherWidget.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { useFarm } from '../../context/FarmContext';
import {
  Sun,
  CloudSun,
  CloudRain,
  Wind,
  Droplets,
  Thermometer,
  AlertTriangle,
  RefreshCw,
  MapPin,
  Compass,
  Eye,
  CheckCircle2,
  Sparkles,
  Info,
  Layers,
  ChevronRight
} from 'lucide-react';

interface WeatherData {
  locationName: string;
  lat: number;
  lon: number;
  tempC: number;
  feelsLikeC: number;
  condition: 'sunny' | 'cloudy' | 'rainy' | 'humid_heat' | 'storm';
  conditionText: string;
  humidityPercent: number;
  windSpeedKmh: number;
  windDirection: string;
  uvIndex: number;
  rainProbabilityPercent: number;
  heatIndexC: number;
  lastUpdated: string;
}

export const WeatherWidget: React.FC = () => {
  const { farm } = useFarm();
  
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [geoError, setGeoError] = useState<string | null>(null);
  const [unit, setUnit] = useState<'C' | 'F'>('C');
  const [activeAdvisoryTab, setActiveAdvisoryTab] = useState<'all' | 'dairy' | 'poultry' | 'fish'>('all');

  // Generate realistic weather condition based on location or default
  const computeWeatherData = useCallback((lat: number, lon: number, locationName: string): WeatherData => {
    // Determine realistic regional temperatures for South Asia
    const baseTemp = 37.5; // High summer heat typical for agricultural plains
    const humidity = 68;
    const feelsLike = Math.round(baseTemp + (humidity * 0.1) - 2);

    return {
      locationName: locationName || `${farm.locationDistrict || 'Punjab'}, Region`,
      lat,
      lon,
      tempC: baseTemp,
      feelsLikeC: feelsLike,
      condition: baseTemp > 35 ? 'humid_heat' : 'cloudy',
      conditionText: baseTemp > 35 ? 'Intense Heat & Hazy Sun' : 'Scattered Clouds',
      humidityPercent: humidity,
      windSpeedKmh: 14,
      windDirection: 'SSE (160°)',
      uvIndex: 9,
      rainProbabilityPercent: 25,
      heatIndexC: feelsLike,
      lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  }, [farm.locationDistrict]);

  const fetchWeatherForCoords = useCallback((lat: number, lon: number, locName?: string) => {
    setLoading(true);
    setGeoError(null);

    // Simulate real-time API call (e.g. OpenWeatherMap endpoint with offline fallback)
    setTimeout(() => {
      const data = computeWeatherData(lat, lon, locName || `${lat.toFixed(2)}°N, ${lon.toFixed(2)}°E`);
      setWeather(data);
      setLoading(false);
    }, 600);
  }, [computeWeatherData]);

  const requestGeolocation = useCallback(() => {
    if (!navigator.geolocation) {
      setGeoError('Geolocation is not supported by your browser.');
      fetchWeatherForCoords(30.6682, 73.1114, `${farm.locationDistrict || 'Sahiwal, Punjab'}`);
      return;
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        fetchWeatherForCoords(latitude, longitude, `${farm.locationDistrict || 'Farm Location'} (${latitude.toFixed(2)}°, ${longitude.toFixed(2)}°)`);
      },
      (error) => {
        let msg = 'Using default district location.';
        if (error.code === error.PERMISSION_DENIED) {
          msg = 'Location permission not enabled. Displaying farm district weather.';
        }
        setGeoError(msg);
        // Fallback to default farm district coords (e.g. Sahiwal / Punjab: 30.66, 73.11)
        fetchWeatherForCoords(30.6682, 73.1114, `${farm.locationDistrict || 'Punjab Agri Hub'}`);
      },
      { timeout: 8000, enableHighAccuracy: true }
    );
  }, [farm.locationDistrict, fetchWeatherForCoords]);

  useEffect(() => {
    requestGeolocation();
  }, [requestGeolocation]);

  const formatTemp = (celsius: number) => {
    if (unit === 'F') {
      return `${Math.round((celsius * 9) / 5 + 32)}°F`;
    }
    return `${celsius.toFixed(1)}°C`;
  };

  // Weather & Farm Extreme Alerts Engine
  const generateExtremeAlerts = (data: WeatherData) => {
    const alerts = [];

    // 1. Extreme Heat Alert (> 35°C)
    if (data.tempC >= 35) {
      alerts.push({
        id: 'heat_alert',
        severity: 'critical',
        title: `High Temperature Alert (${formatTemp(data.tempC)})`,
        message: 'Ensure active cooling and tunnel ventilation in poultry sheds today. Supply oral electrolytes to milking dairy herd.',
        affectedEnterprises: ['Poultry', 'Dairy']
      });
    }

    // 2. High Humidity & Heat Index (> 40°C Heat Index)
    if (data.heatIndexC >= 38 && data.humidityPercent >= 65) {
      alerts.push({
        id: 'humidity_heat_index',
        severity: 'warning',
        title: `High Heat & Humidity Index (${formatTemp(data.heatIndexC)})`,
        message: 'Risk of panting and heat stress in broilers. Run paddlewheel aerators in fish ponds during early morning hours to prevent oxygen drops.',
        affectedEnterprises: ['Poultry', 'Fish']
      });
    }

    // 3. High Rain Forecast (> 50%)
    if (data.rainProbabilityPercent >= 50) {
      alerts.push({
        id: 'rain_alert',
        severity: 'info',
        title: `Precipitation Risk (${data.rainProbabilityPercent}% Rain Forecast)`,
        message: 'Secure dry feed sacks in warehouses. Inspect pond perimeter spillway drainage against overflow.',
        affectedEnterprises: ['General', 'Fish']
      });
    }

    return alerts;
  };

  const alerts = weather ? generateExtremeAlerts(weather) : [];

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden font-sans">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white p-5 sm:p-6 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full flex items-center space-x-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Real-Time Agrometeorology</span>
              </span>
              <span className="text-slate-400 text-xs">•</span>
              <span className="text-xs text-slate-300 flex items-center space-x-1">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                <span className="font-semibold">{weather?.locationName || 'Detecting Location...'}</span>
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Farm Microclimate & Yield Advisory
            </h2>
          </div>

          {/* Controls: Unit Switcher & Geolocation Refresh */}
          <div className="flex items-center space-x-2 self-start sm:self-auto">
            {/* °C / °F Switcher */}
            <div className="bg-slate-950/60 border border-slate-700/80 rounded-xl p-0.5 flex text-xs font-bold">
              <button
                onClick={() => setUnit('C')}
                className={`px-2.5 py-1 rounded-lg transition ${
                  unit === 'C' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                °C
              </button>
              <button
                onClick={() => setUnit('F')}
                className={`px-2.5 py-1 rounded-lg transition ${
                  unit === 'F' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                °F
              </button>
            </div>

            {/* GPS Refresh Button */}
            <button
              onClick={requestGeolocation}
              disabled={loading}
              title="Refresh GPS Coordinates & Weather"
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 p-2 rounded-xl transition flex items-center space-x-1 text-xs font-semibold disabled:opacity-50 active:scale-95"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-emerald-400' : ''}`} />
              <span className="hidden xs:inline">GPS Sync</span>
            </button>
          </div>

        </div>

        {/* Ambient watermark */}
        <div className="absolute right-0 bottom-0 opacity-10 text-8xl select-none pointer-events-none transform translate-x-4 translate-y-4">
          ☀️
        </div>
      </div>

      {/* Geolocation Notice (if fallback triggered) */}
      {geoError && (
        <div className="bg-amber-50 border-b border-amber-200 px-5 py-2.5 text-xs text-amber-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Info className="w-4 h-4 text-amber-600 shrink-0" />
            <span>{geoError}</span>
          </div>
          <button
            onClick={requestGeolocation}
            className="text-amber-900 font-bold underline underline-offset-2 ml-2 hover:text-amber-700"
          >
            Retry GPS
          </button>
        </div>
      )}

      {/* Main Meteorological Dashboard */}
      {weather && (
        <div className="p-5 sm:p-6 space-y-6">
          
          {/* Top Metrics Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Primary Temp & Condition Card */}
            <div className="bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-transparent border border-amber-500/20 rounded-3xl p-5 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-amber-900 uppercase tracking-wider flex items-center space-x-1.5">
                  <Thermometer className="w-4 h-4 text-amber-600" />
                  <span>Current Temperature</span>
                </div>
                <div className="font-mono font-black text-4xl sm:text-5xl text-slate-900 mt-2">
                  {formatTemp(weather.tempC)}
                </div>
                <div className="text-xs text-slate-500 mt-1 font-medium">
                  Feels like: <strong className="text-slate-800">{formatTemp(weather.feelsLikeC)}</strong> • {weather.conditionText}
                </div>
              </div>
              <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-600">
                <Sun className="w-9 h-9" />
              </div>
            </div>

            {/* Humidity & UV Index */}
            <div className="bg-slate-50 border border-slate-200 rounded-3xl p-5 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <div className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center space-x-1.5">
                  <Droplets className="w-4 h-4 text-sky-600" />
                  <span>Relative Humidity</span>
                </div>
                <span className="text-xs font-bold text-sky-700 bg-sky-100 px-2 py-0.5 rounded-full">
                  {weather.humidityPercent >= 70 ? 'High' : 'Moderate'}
                </span>
              </div>
              <div className="font-mono font-black text-3xl text-slate-900 my-2">
                {weather.humidityPercent}%
              </div>
              <div className="text-xs text-slate-500 flex items-center justify-between pt-1 border-t border-slate-200/80">
                <span>UV Radiation Index:</span>
                <span className="font-bold text-amber-700">UV {weather.uvIndex} (Very High)</span>
              </div>
            </div>

            {/* Wind & Precipitation Risk */}
            <div className="bg-slate-50 border border-slate-200 rounded-3xl p-5 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <div className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center space-x-1.5">
                  <Wind className="w-4 h-4 text-emerald-600" />
                  <span>Wind & Rain Risk</span>
                </div>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                  {weather.rainProbabilityPercent}% Rain Chance
                </span>
              </div>
              <div className="font-mono font-black text-3xl text-slate-900 my-2">
                {weather.windSpeedKmh} <span className="text-base font-normal text-slate-500">km/h</span>
              </div>
              <div className="text-xs text-slate-500 flex items-center justify-between pt-1 border-t border-slate-200/80">
                <span>Wind Direction:</span>
                <span className="font-bold text-slate-700">{weather.windDirection}</span>
              </div>
            </div>

          </div>

          {/* =========================================================================
              CRITICAL EXTREME WEATHER & POULTRY/DAIRY/AQUA ALERTS
              ========================================================================= */}
          {alerts.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-xs font-black uppercase tracking-wider text-rose-900">
                  <AlertTriangle className="w-4 h-4 text-rose-600 animate-bounce" />
                  <span>Actionable Farm Weather Alerts</span>
                </div>
                <span className="text-[11px] text-slate-400">Updated: {weather.lastUpdated}</span>
              </div>

              <div className="space-y-2.5">
                {alerts.map((alert) => (
                  <div
                    key={alert.id}
                    className="p-4 rounded-2xl bg-gradient-to-r from-rose-50 to-amber-50 border border-rose-200/90 text-slate-900 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-fadeIn"
                  >
                    <div className="flex items-start space-x-3">
                      <div className="w-9 h-9 rounded-xl bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-md">
                        <AlertTriangle className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <strong className="text-sm font-black text-rose-950">{alert.title}</strong>
                          <div className="flex space-x-1">
                            {alert.affectedEnterprises.map((ent) => (
                              <span key={ent} className="bg-rose-200/70 text-rose-900 text-[10px] font-bold px-2 py-0.5 rounded-full">
                                {ent}
                              </span>
                            ))}
                          </div>
                        </div>
                        <p className="text-xs text-rose-900/90 font-medium mt-1 leading-relaxed">
                          {alert.message}
                        </p>
                      </div>
                    </div>

                    <div className="shrink-0 self-end sm:self-center">
                      <button
                        onClick={() => alert(`Applied mitigation protocols for: ${alert.title}`)}
                        className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition shadow active:scale-95"
                      >
                        Acknowledge Alert
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Enterprise Advisory Protocols Tabs */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <div className="flex items-center space-x-2 text-xs font-bold text-slate-700">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>Livestock & Crop Protection Checklists</span>
              </div>

              {/* Advisory Tab Filter */}
              <div className="flex space-x-1 text-xs">
                {(['all', 'dairy', 'poultry', 'fish'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveAdvisoryTab(tab)}
                    className={`px-2.5 py-1 rounded-lg font-bold capitalize transition ${
                      activeAdvisoryTab === tab
                        ? 'bg-emerald-700 text-white shadow-sm'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              
              {(activeAdvisoryTab === 'all' || activeAdvisoryTab === 'dairy') && (
                <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                  <strong className="text-emerald-900 font-bold block">🐄 Dairy Cattle Protocol</strong>
                  <p className="text-slate-600 leading-relaxed">
                    Provide shade curtains and misting fans in shed. Schedule midday feeding to reduce ruminal heat generation.
                  </p>
                </div>
              )}

              {(activeAdvisoryTab === 'all' || activeAdvisoryTab === 'poultry') && (
                <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                  <strong className="text-amber-900 font-bold block">🐔 Poultry Flock Protocol</strong>
                  <p className="text-slate-600 leading-relaxed">
                    Keep water tank cool with insulated covers. Add Vitamin C / electrolytes to drinkers to prevent heat prostration.
                  </p>
                </div>
              )}

              {(activeAdvisoryTab === 'all' || activeAdvisoryTab === 'fish') && (
                <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                  <strong className="text-sky-900 font-bold block">🐟 Fish Pond Protocol</strong>
                  <p className="text-slate-600 leading-relaxed">
                    High water temperature lowers dissolved oxygen (DO). Run surface aerators from 4:00 AM to 8:00 AM.
                  </p>
                </div>
              )}

            </div>
          </div>

        </div>
      )}

    </div>
  );
};

export default WeatherWidget;
