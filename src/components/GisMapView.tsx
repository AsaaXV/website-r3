import React, { useState, useEffect } from 'react';
import {
  MapPin,
  Truck,
  Navigation,
  Layers,
  Compass,
  CheckCircle2,
  Clock,
  ShieldAlert,
  Info,
  Route,
  Zap,
  Maximize2,
  Crosshair,
  Key,
  ExternalLink,
  Map as MapIcon,
  Globe2,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { GIS_FACILITIES, VRP_STOPS, WASTE_CATEGORIES } from '../data/mockData';
import { GISFacility, WasteCategoryType } from '../types';
import { GoogleMapComponent } from './GoogleMapComponent';

export const GisMapView: React.FC = () => {
  const [selectedFacility, setSelectedFacility] = useState<GISFacility>(GIS_FACILITIES[0]);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterRadiusKm, setFilterRadiusKm] = useState<number>(5.0);
  const [activeTab, setActiveTab] = useState<'facilities' | 'vrp'>('facilities');
  // Google Maps API Key handling
  const envKey = (import.meta as any).env?.VITE_GOOGLE_MAPS_API_KEY || '';
  const [customApiKey, setCustomApiKey] = useState<string>(() => {
    return localStorage.getItem('ecocampus_gmaps_key') || envKey || '';
  });
  const [mapEngine, setMapEngine] = useState<'google' | 'vector'>(() => {
    const saved = localStorage.getItem('ecocampus_gmaps_key') || envKey || '';
    return saved.trim().length > 5 ? 'google' : 'vector';
  });
  const [isVrpSimulating, setIsVrpSimulating] = useState<boolean>(false);
  const [simulatedStep, setSimulatedStep] = useState<number>(2);

  // User live geolocation state
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [gpsStatus, setGpsStatus] = useState<'idle' | 'loading' | 'active' | 'error'>('idle');
  const [gpsMessage, setGpsMessage] = useState<string>('');

  const [showKeyModal, setShowKeyModal] = useState<boolean>(false);
  const [tempKeyInput, setTempKeyInput] = useState<string>(customApiKey);

  // Calculate geodesic distance (Haversine formula)
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Number((R * c).toFixed(1));
  };

  // Facilities with dynamic distance calculation if user location is detected
  const facilitiesWithDistance = GIS_FACILITIES.map((f) => {
    if (!userLocation) return f;
    const liveDistance = calculateDistance(
      userLocation.lat,
      userLocation.lng,
      f.latitude,
      f.longitude
    );
    return {
      ...f,
      distanceKm: liveDistance,
    };
  });

  // Filter facilities based on category and distance
  const filteredFacilities = facilitiesWithDistance.filter((f) => {
    if (f.distanceKm > filterRadiusKm) return false;
    if (filterCategory === 'all') return true;
    return f.acceptsCategories.includes(filterCategory as WasteCategoryType);
  });

  // Get current device GPS location
  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setGpsStatus('error');
      setGpsMessage('Peramban tidak mendukung sensor Geolocation.');
      return;
    }

    setGpsStatus('loading');
    setGpsMessage('Mendeteksi koordinat GPS akurat...');

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = {
          lat: Number(pos.coords.latitude.toFixed(5)),
          lng: Number(pos.coords.longitude.toFixed(5)),
        };
        setUserLocation(coords);
        setGpsStatus('active');
        setGpsMessage(`GPS Akurat: ${coords.lat}°, ${coords.lng}° (Akurasi: ±${Math.round(pos.coords.accuracy)}m)`);
      },
      (err) => {
        // Fallback to campus coordinate if denied or in iframe sandbox
        console.warn('Geolocation error:', err.message);
        // Default to Gedung Dekanat Fakultas Teknik UNHAS Tamalanrea
        const fallbackCoord = { lat: -5.1345, lng: 119.4975 };
        setUserLocation(fallbackCoord);
        setGpsStatus('active');
        setGpsMessage('Koordinat diposisikan ke Kampus UNHAS Tamalanrea (Gedung Dekanat FT).');
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 }
    );
  };

  const handleSaveApiKey = () => {
    const trimmed = tempKeyInput.trim();
    setCustomApiKey(trimmed);
    if (trimmed.length > 5) {
      localStorage.setItem('ecocampus_gmaps_key', trimmed);
      setMapEngine('google');
    } else {
      localStorage.removeItem('ecocampus_gmaps_key');
      setMapEngine('vector');
    }
    setShowKeyModal(false);
  };

  const handleSimulateVrp = () => {
    setIsVrpSimulating(true);
    setSimulatedStep(1);
    const interval = setInterval(() => {
      setSimulatedStep((prev) => {
        if (prev >= VRP_STOPS.length - 1) {
          clearInterval(interval);
          setIsVrpSimulating(false);
          return prev;
        }
        return prev + 1;
      });
    }, 1200);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Info */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-teal-100 text-teal-800 border border-teal-200">
              Google Maps Platform & PostGIS SRID 4326
            </span>
            <span className="text-xs text-slate-500 font-medium">
              Bagian 6.2 & 7.2 Dokumen
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900">
            Sistem Informasi Geografis (GIS) & Peta Google Maps Akurat
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
            Pemetaan geospasial titik TPS3R, Bank Sampah kawasan Tamalanrea & Makassar dengan koordinat presisi tinggi WGS 84, penentuan rute, serta simulasi Vehicle Routing Problem (VRP).
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto shrink-0">
          <div className="flex p-1 rounded-xl bg-slate-100 border border-slate-200">
            <button
              onClick={() => setActiveTab('facilities')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'facilities'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Peta Fasilitas & Drop Box
            </button>
            <button
              onClick={() => setActiveTab('vrp')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'vrp'
                  ? 'bg-emerald-600 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Truck className="w-3.5 h-3.5" />
              <span>Rute Armada VRP</span>
            </button>
          </div>
        </div>
      </div>

      {/* Map Engine & GPS Control Strip */}
      <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Engine switcher */}
        <div className="flex items-center gap-2">
          <span className="text-slate-500 font-semibold flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-emerald-600" />
            <span>Mode Peta:</span>
          </span>
          <div className="flex p-0.5 bg-slate-100 rounded-lg border border-slate-200 text-xs">
            <button
              onClick={() => {
                setMapEngine('google');
                if (!customApiKey || customApiKey.trim().length <= 5) {
                  setShowKeyModal(true);
                }
              }}
              className={`px-2.5 py-1 rounded-md font-bold transition-all flex items-center gap-1.5 ${
                mapEngine === 'google'
                  ? 'bg-emerald-600 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Globe2 className="w-3.5 h-3.5" />
              <span>Google Maps Akurat</span>
            </button>
            <button
              onClick={() => setMapEngine('vector')}
              className={`px-2.5 py-1 rounded-md font-bold transition-all flex items-center gap-1.5 ${
                mapEngine === 'vector'
                  ? 'bg-slate-900 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <MapIcon className="w-3.5 h-3.5" />
              <span>Skema Topologi Kampus</span>
            </button>
          </div>
        </div>

        {/* GPS Geolocation trigger */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleGetLocation}
            disabled={gpsStatus === 'loading'}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 border transition-all ${
              gpsStatus === 'active'
                ? 'bg-blue-50 border-blue-300 text-blue-700'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 shadow-2xs'
            }`}
          >
            <Crosshair className={`w-3.5 h-3.5 ${gpsStatus === 'loading' ? 'animate-spin text-blue-600' : 'text-blue-600'}`} />
            <span>
              {gpsStatus === 'loading'
                ? 'Mencari GPS...'
                : gpsStatus === 'active'
                ? 'Lokasi GPS Terhubung'
                : 'Posisikan ke Lokasi Saya'}
            </span>
          </button>

          {/* API Key settings button */}
          <button
            onClick={() => setShowKeyModal(true)}
            className="px-2.5 py-1.5 rounded-lg text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 flex items-center gap-1.5 transition-colors"
            title="Pengaturan Google Maps API Key"
          >
            <Key className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden sm:inline">Kunci API Maps</span>
          </button>
        </div>
      </div>

      {/* GPS Status Message Toast */}
      {gpsMessage && (
        <div className="px-4 py-2 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-800 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
            <span>{gpsMessage}</span>
          </div>
          <button
            onClick={() => setGpsMessage('')}
            className="text-blue-500 hover:text-blue-700 font-bold"
          >
            &times;
          </button>
        </div>
      )}

      {/* Main Map & Filter Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Map Container (8 cols) */}
        <div className="lg:col-span-8 bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 shadow-md flex flex-col">
          {/* Map Top Bar */}
          <div className="px-4 py-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-emerald-400" />
              <span className="font-mono text-[11px] text-slate-300">
                KOORDINAT PUSAT: -5.1328° S, 119.4932° E • KAMPUS TAMALANREA UNHAS
              </span>
            </div>
            <div className="hidden sm:flex items-center gap-3 text-[11px]">
              <span className="flex items-center gap-1 text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span> TPS3R
              </span>
              <span className="flex items-center gap-1 text-blue-400">
                <span className="w-2 h-2 rounded-full bg-blue-500"></span> Drop Point
              </span>
              <span className="flex items-center gap-1 text-amber-400">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span> Bank Sampah
              </span>
            </div>
          </div>

          {/* Interactive Map Area */}
          <div className="relative min-h-[460px] sm:min-h-[520px] bg-[#0d1624] overflow-hidden select-none">
            {mapEngine === 'google' ? (
              /* Google Maps Component with @vis.gl/react-google-maps */
              <div className="absolute inset-0 w-full h-full">
                <GoogleMapComponent
                  apiKey={customApiKey}
                  facilities={filteredFacilities}
                  selectedFacility={selectedFacility}
                  onSelectFacility={(fac) => setSelectedFacility(fac)}
                  userLocation={userLocation}
                  activeTab={activeTab}
                  vrpStops={VRP_STOPS}
                  simulatedStep={simulatedStep}
                />
              </div>
            ) : (
              /* Vector Topology Canvas Mode */
              <>
                <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none">
                  <defs>
                    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#38bdf8" strokeWidth="0.5" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>

                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                  {/* Lake Unhas */}
                  <ellipse cx="44" cy="40" rx="14" ry="7" fill="#0369a1" opacity="0.4" />
                  <text x="40" y="41" fill="#7dd3fc" fontSize="2.5" fontWeight="bold" opacity="0.7">Danau Unhas</text>

                  {/* Main Arterial Roads */}
                  <path d="M 0 25 Q 40 28 100 15" fill="none" stroke="#334155" strokeWidth="2.5" />
                  <text x="5" y="23" fill="#94a3b8" fontSize="2.2">Jl. Perintis Kemerdekaan (Poros Km 10)</text>

                  {/* Campus Inner Ring Roads */}
                  <path d="M 25 30 Q 30 70 65 65 Q 85 50 78 40 Q 60 25 25 30" fill="none" stroke="#1e293b" strokeWidth="2" strokeDasharray="2,1" />

                  {/* VRP Routing Paths if tab is VRP */}
                  {activeTab === 'vrp' && (
                    <>
                      <polyline
                        points={VRP_STOPS.slice(0, simulatedStep + 1).map((s) => `${s.x},${s.y}`).join(' ')}
                        fill="none"
                        stroke="#10b981"
                        strokeWidth="1.2"
                        strokeDasharray="1.5,1"
                        className="transition-all duration-500"
                      />
                      {simulatedStep < VRP_STOPS.length && (
                        <circle
                          cx={VRP_STOPS[simulatedStep].x}
                          cy={VRP_STOPS[simulatedStep].y}
                          r="2.2"
                          fill="#34d399"
                          className="animate-ping"
                        />
                      )}
                    </>
                  )}
                </svg>

                {/* Facility Markers in Vector mode */}
                {activeTab === 'facilities'
                  ? filteredFacilities.map((fac, idx) => {
                      const posX = idx === 0 ? 28 : idx === 1 ? 82 : idx === 2 ? 65 : idx === 3 ? 35 : idx === 4 ? 76 : 58;
                      const posY = idx === 0 ? 32 : idx === 1 ? 16 : idx === 2 ? 80 : idx === 3 ? 68 : idx === 4 ? 42 : 55;
                      const isSelected = selectedFacility.id === fac.id;

                      return (
                        <div
                          key={fac.id}
                          onClick={() => setSelectedFacility(fac)}
                          className="absolute cursor-pointer -translate-x-1/2 -translate-y-1/2 group z-20"
                          style={{ left: `${posX}%`, top: `${posY}%` }}
                        >
                          <div
                            className={`relative flex items-center justify-center rounded-full transition-all duration-300 ${
                              isSelected
                                ? 'w-9 h-9 bg-white ring-4 ring-emerald-400 shadow-xl scale-110'
                                : 'w-7 h-7 bg-slate-900/90 border-2 border-emerald-400/80 hover:scale-110 shadow-md'
                            }`}
                          >
                            <MapPin
                              className={`w-4 h-4 ${
                                isSelected
                                  ? 'text-emerald-700'
                                  : fac.type === 'TPS3R'
                                  ? 'text-emerald-400'
                                  : fac.type === 'Drop Box Kampus'
                                  ? 'text-blue-400'
                                  : 'text-amber-400'
                              }`}
                            />
                          </div>
                          <div className="absolute left-1/2 -translate-x-1/2 -bottom-6 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-950/90 text-white font-mono text-[9px] px-1.5 py-0.5 rounded pointer-events-none whitespace-nowrap z-30 border border-slate-700">
                            {fac.name.split(' (')[0]} ({fac.distanceKm} km)
                          </div>
                        </div>
                      );
                    })
                  : VRP_STOPS.map((stop, idx) => {
                      const isCompleted = idx <= simulatedStep;
                      const isCurrent = idx === simulatedStep;

                      return (
                        <div
                          key={stop.id}
                          className="absolute cursor-pointer -translate-x-1/2 -translate-y-1/2 group z-20"
                          style={{ left: `${stop.x}%`, top: `${stop.y}%` }}
                        >
                          <div
                            className={`w-7 h-7 rounded-full flex items-center justify-center font-mono text-xs font-bold transition-all ${
                              isCurrent
                                ? 'bg-amber-400 text-amber-950 ring-4 ring-amber-300 scale-125 shadow-lg'
                                : isCompleted
                                ? 'bg-emerald-500 text-white shadow-md'
                                : 'bg-slate-800 text-slate-400 border border-slate-700'
                            }`}
                          >
                            {stop.sequence}
                          </div>
                          <div className="absolute left-1/2 -translate-x-1/2 -bottom-6 bg-slate-950/90 text-slate-200 font-mono text-[9px] px-1.5 py-0.5 rounded pointer-events-none whitespace-nowrap z-30 border border-slate-800">
                            {stop.name}
                          </div>
                        </div>
                      );
                    })}
              </>
            )}

            {/* Bottom Floating Map Scale & Controls */}
            <div className="absolute bottom-3 left-3 bg-slate-950/85 backdrop-blur-md border border-slate-800 rounded-xl px-3 py-1.5 text-[10px] text-slate-300 flex items-center gap-3 z-30 shadow-md">
              <span className="font-mono text-emerald-400">WGS 84 • SRID 4326</span>
              <span className="text-slate-600">|</span>
              <span className="hidden sm:inline">Kalkulasi: ST_DistanceSpheroid</span>
              <span className="text-slate-600 hidden sm:inline">|</span>
              <span className="text-slate-400">
                {userLocation ? 'GPS Terhubung' : 'Tamalanrea Campus'}
              </span>
            </div>
          </div>

          {/* Map Controls Filter Strip */}
          <div className="p-3 bg-slate-950 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-slate-400 font-medium">Filter Kategori:</span>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="bg-slate-900 border border-slate-800 text-slate-200 text-xs px-2.5 py-1 rounded-lg focus:outline-emerald-500"
              >
                <option value="all">Semua Kategori (Organik, Kertas, Plastik, Khusus)</option>
                <option value="organik">Hanya Organik (Kompos & Maggot)</option>
                <option value="kertas">Kertas & Karton</option>
                <option value="plastik">Plastik Berharga (PET/HDPE)</option>
                <option value="khusus">Logam & E-Waste</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-slate-400 font-medium">Radius Spasial:</span>
              {[1.0, 3.0, 5.0, 10.0].map((rad) => (
                <button
                  key={rad}
                  onClick={() => setFilterRadiusKm(rad)}
                  className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                    filterRadiusKm === rad
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-900 text-slate-400 hover:text-white'
                  }`}
                >
                  &le; {rad} km
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Facility Details or VRP Analytics (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          {activeTab === 'facilities' ? (
            /* Facility Inspector */
            <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  {selectedFacility.type}
                </span>
                <span className="text-xs font-bold text-slate-500">
                  Jarak: {selectedFacility.distanceKm} km
                </span>
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {selectedFacility.name}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {selectedFacility.address}
                </p>
                <div className="text-[11px] font-mono text-slate-400 mt-1">
                  Koordinat: {selectedFacility.latitude}, {selectedFacility.longitude}
                </div>
              </div>

              <div className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200 leading-relaxed">
                <span className="font-semibold text-slate-800">Fungsi Strategis:</span>{' '}
                {selectedFacility.significance}
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between items-center py-1 border-b border-slate-100">
                  <span className="text-slate-500 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>Jam Layanan</span>
                  </span>
                  <span className="font-semibold text-slate-900">
                    {selectedFacility.operatingHours}
                  </span>
                </div>

                <div className="flex justify-between items-center py-1 border-b border-slate-100">
                  <span className="text-slate-500">Kapasitas Harian</span>
                  <span className="font-semibold text-slate-900">
                    {selectedFacility.capacityDailyKg} kg / hari
                  </span>
                </div>

                <div className="flex justify-between items-center py-1">
                  <span className="text-slate-500">Status Beban Saat Ini</span>
                  <span className="font-bold text-emerald-700">
                    {selectedFacility.currentLoadKg} kg ({Math.round((selectedFacility.currentLoadKg / selectedFacility.capacityDailyKg) * 100)}%)
                  </span>
                </div>
              </div>

              {/* Accepted categories badges */}
              <div className="pt-2 border-t border-slate-100">
                <div className="text-[11px] font-semibold text-slate-500 mb-1.5">
                  Material yang Diterima:
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {selectedFacility.acceptsCategories.map((catId) => {
                    const cat = WASTE_CATEGORIES.find((c) => c.id === catId);
                    return (
                      <span
                        key={catId}
                        className="px-2 py-0.5 rounded-md text-[10px] font-bold"
                        style={{
                          backgroundColor: `${cat?.binColor}20`,
                          color: cat?.binColor,
                        }}
                      >
                        {cat?.name}
                      </span>
                    );
                  })}
                </div>
              </div>

              {/* Direct Navigation Button */}
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${selectedFacility.latitude},${selectedFacility.longitude}`}
                target="_blank"
                rel="noreferrer"
                className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
              >
                <Navigation className="w-3.5 h-3.5 text-emerald-400" />
                <span>Navigasi Rute Resmi Google Maps</span>
              </a>
            </div>
          ) : (
            /* VRP Optimizer Dashboard */
            <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Optimasi Logistik Armada VRP</h3>
                  <p className="text-[11px] text-slate-500">Clarke-Wright Savings & Google Routes</p>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                  Aktif
                </span>
              </div>

              {/* VRP Efficiency Metrics Comparison */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-rose-50/60 border border-rose-200 text-rose-950">
                  <div className="text-[10px] text-rose-700 font-semibold uppercase">Sebelum VRP</div>
                  <div className="text-base font-black text-rose-900 mt-1">14.8 km</div>
                  <div className="text-[10px] text-rose-700">3.4 Liter BBM Kampus</div>
                </div>

                <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-200 text-emerald-950">
                  <div className="text-[10px] text-emerald-700 font-semibold uppercase">Setelah VRP</div>
                  <div className="text-base font-black text-emerald-900 mt-1">8.2 km</div>
                  <div className="text-[10px] text-emerald-700">1.8 Liter (-44.6% BBM)</div>
                </div>
              </div>

              {/* Waypoints sequence */}
              <div className="space-y-2">
                <div className="text-xs font-bold text-slate-800">Urutan Kunjungan Armada Saat Ini:</div>
                <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1">
                  {VRP_STOPS.map((stop, idx) => (
                    <div
                      key={stop.id}
                      className={`p-2 rounded-lg border text-xs flex items-center justify-between ${
                        idx === simulatedStep
                          ? 'bg-amber-50 border-amber-300 font-bold'
                          : idx < simulatedStep
                          ? 'bg-emerald-50/50 border-emerald-200 text-slate-700'
                          : 'bg-slate-50 border-slate-200 text-slate-400'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center text-[10px] font-bold">
                          {stop.sequence}
                        </span>
                        <span className="truncate max-w-[150px]">{stop.name}</span>
                      </div>
                      <span className="text-[10px] font-semibold">
                        {stop.wasteAccumulationKg > 0 ? `+${stop.wasteAccumulationKg} kg` : 'Depot'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={handleSimulateVrp}
                disabled={isVrpSimulating}
                className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white font-bold text-xs transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer"
              >
                <Truck className="w-4 h-4" />
                <span>{isVrpSimulating ? 'Simulasi Berjalan...' : 'Mulai Simulasi Gerak Armada'}</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Google Maps API Key Modal */}
      {showKeyModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2 font-bold text-slate-900 text-base">
                <Key className="w-5 h-5 text-emerald-600" />
                <span>Kunci API Google Maps Platform</span>
              </div>
              <button
                onClick={() => setShowKeyModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                &times;
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Anda dapat menggunakan kunci API Google Cloud Anda sendiri atau membuat <strong>Maps Demo Key gratis</strong> untuk tujuan prototipe tanpa memerlukan kartu kredit atau penagihan (billing).
            </p>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">
                Google Maps API Key:
              </label>
              <input
                type="text"
                placeholder="AIzaSy..."
                value={tempKeyInput}
                onChange={(e) => setTempKeyInput(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-mono text-xs focus:outline-emerald-500"
              />
            </div>

            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900 space-y-1">
              <div className="font-bold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
                <span>Belum punya kunci API?</span>
              </div>
              <p className="text-[11px] text-emerald-800">
                Dapatkan <strong>Maps Demo Key</strong> instan dari portal resmi Google Maps:
              </p>
              <a
                href="https://mapsplatform.google.com/maps-demo-key?utm_campaign=gmp_mcp_codeassist_v1_aistudio"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 hover:underline pt-1"
              >
                <span>Buka Generator Maps Demo Key</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowKeyModal(false)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-800"
              >
                Tutup
              </button>
              <button
                type="button"
                onClick={handleSaveApiKey}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors shadow-xs"
              >
                Terapkan Kunci
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
