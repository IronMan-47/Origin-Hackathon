import React, { useState, useEffect, useRef } from 'react';
import { Map, MapPin, Search, Navigation, Info, Layers, RefreshCw } from 'lucide-react';
import { translations, type Language } from './translations';
import { fetchLiveEnvironment } from './environmentService';
import type { EnvironmentalData } from './riskEngine';

declare global {
  interface Window {
    L: any;
  }
}

interface MapExplorerProps {
  profile: any;
  lang: Language;
  isDarkMode?: boolean;
}

const GLOBAL_HUBS = [
  { name: "Delhi, India", lat: 28.6139, lon: 77.2090 },
  { name: "Raipur, India", lat: 21.2514, lon: 81.6296 },
  { name: "Mumbai, India", lat: 19.0760, lon: 72.8777 },
  { name: "Bengaluru, India", lat: 12.9716, lon: 77.5946 },
  { name: "London, UK", lat: 51.5074, lon: -0.1278 },
  { name: "Tokyo, Japan", lat: 35.6762, lon: 139.6503 },
  { name: "New York, USA", lat: 40.7128, lon: -74.0060 }
];

export default function MapExplorer({ profile, lang, isDarkMode = true }: MapExplorerProps) {
  const t = translations[lang];
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markerRef = useRef<any>(null);

  const [activeCoords, setActiveCoords] = useState<{ lat: number; lon: number; name: string }>({
    lat: profile?.latitude ?? 21.25,
    lon: profile?.longitude ?? 81.63,
    name: profile?.location_name || 'Raipur, Chhattisgarh'
  });

  const [pointData, setPointData] = useState<EnvironmentalData | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);

  // Fetch telemetry at coordinates
  const fetchCoordsData = async (lat: number, lon: number, name: string) => {
    setLoading(true);
    setActiveCoords({ lat, lon, name });
    
    // Pan map to location
    if (mapInstanceRef.current && window.L) {
      mapInstanceRef.current.flyTo([lat, lon], 10, { duration: 1.5 });
      if (markerRef.current) {
        markerRef.current.setLatLng([lat, lon]);
        markerRef.current.bindPopup(`<b>${name}</b><br>Fetching live sensor data...`).openPopup();
      }
    }

    try {
      const data = await fetchLiveEnvironment(lat, lon);
      setPointData(data);
      if (markerRef.current) {
        const popupHtml = `
          <div style="font-family: 'Plus Jakarta Sans', system-ui; min-width: 140px;">
            <div style="font-weight: 800; font-size: 13px; color: #0f172a;">${name}</div>
            <div style="margin-top: 4px; font-size: 12px; color: ${data.aqi > 150 ? '#ef4444' : '#10b981'}; font-weight: 700;">
              AQI: ${data.aqi} (${data.aqiCategory})
            </div>
            <div style="font-size: 11px; color: #64748b; margin-top: 2px;">
              Temp: ${data.temperature}°C | PM2.5: ${data.pm25}
            </div>
          </div>
        `;
        markerRef.current.setPopupContent(popupHtml).openPopup();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Initialize Leaflet Map instance
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    if (window.L) {
      const initialLat = profile?.latitude ?? 21.25;
      const initialLon = profile?.longitude ?? 81.63;

      // Create map
      const map = window.L.map(mapContainerRef.current).setView([initialLat, initialLon], 9);

      // Tile layer matching mode
      const tileUrl = isDarkMode
        ? 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png'
        : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

      window.L.tileLayer(tileUrl, {
        attribution: '&copy; OpenStreetMap contributors',
        subdomains: 'abcd',
        maxZoom: 19
      }).addTo(map);

      // Custom animated marker
      const marker = window.L.marker([initialLat, initialLon]).addTo(map);
      markerRef.current = marker;
      mapInstanceRef.current = map;

      // Click anywhere on map to inspect coordinates!
      map.on('click', async (e: any) => {
        const { lat, lng } = e.latlng;
        fetchCoordsData(lat, lng, `Coord (${lat.toFixed(3)}, ${lng.toFixed(3)})`);
      });

      // Initial fetch
      fetchCoordsData(initialLat, initialLon, profile?.location_name || 'Raipur, Chhattisgarh');
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  const handleSearch = async (q: string) => {
    setSearchQuery(q);
    if (q.trim().length < 2) {
      setSearchResults([]);
      return;
    }
    try {
      const res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(q)}&count=4&language=en&format=json`);
      const data = await res.json();
      setSearchResults(data.results || []);
    } catch (err) {
      console.error(err);
    }
  };

  const cardBase = isDarkMode 
    ? 'bg-slate-900/90 border-slate-800 text-white shadow-xl' 
    : 'bg-white/95 border-slate-200 text-slate-900 shadow-xl shadow-slate-200/50 backdrop-blur-md';

  const cardSubtext = isDarkMode ? 'text-slate-400' : 'text-slate-600';
  const cardHeading = isDarkMode ? 'text-white' : 'text-slate-900';
  const innerTile = isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-100 border-slate-200';

  return (
    <div className="max-w-5xl w-full mx-auto space-y-6 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className={`border rounded-3xl p-6 md:p-8 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:-translate-y-0.5 transition-all duration-300 ${cardBase}`}>
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-blue-500 uppercase tracking-widest mb-1">
            <Map className="w-4 h-4" /> Global Geospatial Live Map
          </div>
          <h2 className={`text-2xl md:text-3xl font-black ${cardHeading}`}>{t.explorerTitle}</h2>
          <p className={`text-xs md:text-sm mt-1 ${cardSubtext}`}>
            {t.explorerSubtitle}
          </p>
        </div>

        {/* Global Quick Hub Buttons */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {GLOBAL_HUBS.map((hub, idx) => (
            <button
              key={idx}
              onClick={() => fetchCoordsData(hub.lat, hub.lon, hub.name)}
              className={`text-[11px] font-semibold px-3 py-1.5 rounded-full border transition-colors ${
                isDarkMode 
                  ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border-slate-700' 
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 border-slate-300'
              }`}
            >
              {hub.name.split(',')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Global Canvas Container */}
      <div className={`border rounded-3xl p-6 shadow-2xl relative hover:-translate-y-0.5 transition-all duration-300 ${cardBase}`}>
        
        {/* Search Bar overlay */}
        <div className="relative z-20 max-w-md mb-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder={t.searchPlaceholder}
              aria-label="Search map locations"
              className={`w-full pl-10 pr-4 py-2.5 border rounded-2xl text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-xl ${
                isDarkMode 
                  ? 'bg-slate-950 border-slate-700 text-white placeholder-slate-500' 
                  : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400'
              }`}
            />
          </div>

          {searchResults.length > 0 && (
            <div className={`absolute top-full left-0 right-0 mt-1.5 border rounded-2xl shadow-2xl z-30 overflow-hidden ${
              isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-300'
            }`}>
              {searchResults.map((item, i) => (
                <button
                  key={i}
                  onClick={() => {
                    const full = `${item.name}, ${item.country || ''}`;
                    fetchCoordsData(item.latitude, item.longitude, full);
                    setSearchResults([]);
                    setSearchQuery('');
                  }}
                  className={`w-full text-left px-4 py-2.5 text-xs flex justify-between border-b last:border-none ${
                    isDarkMode ? 'hover:bg-slate-700 border-slate-700/50 text-white' : 'hover:bg-slate-100 border-slate-200 text-slate-900'
                  }`}
                >
                  <span className="font-semibold">{item.name}</span>
                  <span className="text-slate-400">{item.country}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Real Leaflet Map Container */}
        <div 
          ref={mapContainerRef} 
          className="w-full h-96 rounded-2xl border border-slate-400/40 relative z-10 shadow-inner overflow-hidden"
          style={{ minHeight: '380px' }}
        />

        {/* Selected Coordinate Live Telemetry Popup Card */}
        {pointData && (
          <div className={`mt-5 p-5 border rounded-2xl animate-in fade-in duration-300 ${
            isDarkMode ? 'bg-slate-800/90 border-slate-700' : 'bg-slate-100/90 border-slate-200'
          }`}>
            <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
              <div>
                <span className="text-[11px] text-blue-500 font-bold uppercase tracking-wider">{t.inspectedPoint}</span>
                <h4 className={`text-lg font-black ${cardHeading}`}>{activeCoords.name}</h4>
              </div>
              <span className={`text-xs font-black uppercase px-3 py-1 rounded-full ${
                pointData.aqi > 150 ? 'bg-red-500/20 text-red-500' : 'bg-emerald-500/20 text-emerald-500'
              }`}>
                {t.aqi} {pointData.aqi} ({pointData.aqiCategory})
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className={`p-3 rounded-xl border ${innerTile}`}>
                <span className={cardSubtext}>{t.temp}</span>
                <div className={`text-base font-bold mt-0.5 ${cardHeading}`}>{pointData.temperature}°C</div>
                <span className="text-[10px] text-orange-500 font-semibold">{t.feelsLike} {pointData.feelsLike}°C</span>
              </div>

              <div className={`p-3 rounded-xl border ${innerTile}`}>
                <span className={cardSubtext}>{t.pm25}</span>
                <div className={`text-base font-bold mt-0.5 ${cardHeading}`}>{pointData.pm25} µg/m³</div>
              </div>

              <div className={`p-3 rounded-xl border ${innerTile}`}>
                <span className={cardSubtext}>{t.humidity}</span>
                <div className={`text-base font-bold mt-0.5 ${cardHeading}`}>{pointData.humidity}%</div>
              </div>

              <div className={`p-3 rounded-xl border ${innerTile}`}>
                <span className={cardSubtext}>{t.monitoringStation}</span>
                <div className="text-xs font-bold text-emerald-500 mt-0.5 truncate">
                  {pointData.stationName || 'WAQI/Open-Meteo'}
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
