import React, { useState, useEffect, useMemo } from 'react';
import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
  InfoWindow,
  useMap
} from '@vis.gl/react-google-maps';
import {
  MapPin,
  Truck,
  Navigation,
  Compass,
  Layers,
  Clock,
  CheckCircle2,
  Phone,
  Search,
  Key,
  ExternalLink,
  Route,
  Zap,
  Info,
  Calendar,
  AlertCircle,
  Crosshair,
  Footprints,
  ChevronRight,
  LocateFixed,
  Building2,
  AlertTriangle,
  Flame,
  Mountain,
  ShieldAlert,
  ArrowRight,
  TrendingDown,
  Sparkles,
  HelpCircle,
  Activity
} from 'lucide-react';
import { GIS_FACILITIES, VRP_STOPS, WASTE_CATEGORIES } from '../data/mockData';
import { GISFacility, WasteCategoryType } from '../types';

interface FacilitiesViewProps {
  onOpenPickupModal: () => void;
}

// Campus Location Presets for 1-click positioning across university grounds
export interface CampusPreset {
  id: string;
  name: string;
  faculty: string;
  coords: { lat: number; lng: number };
}

export const CAMPUS_PRESETS: CampusPreset[] = [
  {
    id: 'ft-unhas',
    name: 'Fakultas Teknik (Gedung Dekanat & Elektro)',
    faculty: 'Fakultas Teknik',
    coords: { lat: -5.1345, lng: 119.4975 },
  },
  {
    id: 'fmipa-unhas',
    name: 'Fakultas MIPA (Laboratorium Dasar)',
    faculty: 'Fakultas MIPA',
    coords: { lat: -5.1362, lng: 119.4951 },
  },
  {
    id: 'ramsis-unhas',
    name: 'Asrama Mahasiswa Ramsis Blok B',
    faculty: 'Asrama Mahasiswa Ramsis',
    coords: { lat: -5.1310, lng: 119.4960 },
  },
  {
    id: 'kantin-danau',
    name: 'Kantin Pusat & Danau Rektorat',
    faculty: 'Rektorat & PKM Kampus',
    coords: { lat: -5.1339, lng: 119.4948 },
  },
  {
    id: 'fk-unhas',
    name: 'Fakultas Kedokteran (RSP Unhas)',
    faculty: 'Fakultas Kedokteran',
    coords: { lat: -5.1355, lng: 119.4920 },
  },
  {
    id: 'faperta-unhas',
    name: 'Fakultas Pertanian & Kehutanan',
    faculty: 'Fakultas Pertanian',
    coords: { lat: -5.1370, lng: 119.4915 },
  },
];

// Haversine formula to calculate accurate distances in kilometers
export function calculateHaversineDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Number((R * c).toFixed(2));
}

// Subcomponent to smoothly pan the map when a facility or location is selected
const MapPanController: React.FC<{
  targetCoords: { lat: number; lng: number } | null;
  targetZoom?: number;
}> = ({ targetCoords, targetZoom = 15 }) => {
  const map = useMap();
  useEffect(() => {
    if (map && targetCoords) {
      map.panTo(targetCoords);
      if (targetZoom) {
        map.setZoom(targetZoom);
      }
    }
  }, [map, targetCoords, targetZoom]);
  return null;
};

export const FacilitiesView: React.FC<FacilitiesViewProps> = ({ onOpenPickupModal }) => {
  // Read env key or use state to allow pasting Demo Key or Custom Key
  const envMapsKey = (import.meta as any).env?.VITE_GOOGLE_MAPS_API_KEY;
  const initialKey = (typeof envMapsKey === 'string' ? envMapsKey : '') || '';
  const [apiKey, setApiKey] = useState<string>(initialKey);
  const [showKeyPrompt, setShowKeyPrompt] = useState<boolean>(!initialKey);
  const [tempKeyInput, setTempKeyInput] = useState<string>('');

  // Default facility is TPA Tamangapa (Tempat Sampah Akhir Utama)
  const defaultFacility = GIS_FACILITIES[0]; // tpa_tamangapa
  const [selectedFacility, setSelectedFacility] = useState<GISFacility>(defaultFacility);
  const [activeInfoWindow, setActiveInfoWindow] = useState<GISFacility | null>(null);
  const [filterType, setFilterType] = useState<'all' | 'final_landfill' | 'campus_reduction' | 'special_dropbox'>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [activeSubTab, setActiveSubTab] = useState<'map' | 'landfill_profile' | 'waste_flow' | 'schedule' | 'vrp'>('map');
  const [mapType, setMapType] = useState<'roadmap' | 'satellite' | 'hybrid' | 'terrain'>('roadmap');

  // Geographic coordinates
  // Midpoint between Unhas Tamalanrea (-5.1345) and TPA Tamangapa (-5.1765) to frame the full corridor
  const fullCorridorCenter = { lat: -5.1555, lng: 119.4950 };
  const campusCenter = { lat: -5.1345, lng: 119.4975 };
  const tpaCenter = { lat: -5.1765, lng: 119.4942 };

  // User location state
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(campusCenter);
  const [userLocationName, setUserLocationName] = useState<string>('Fakultas Teknik (Gedung Dekanat & Elektro)');
  const [gpsAccuracy, setGpsAccuracy] = useState<number | null>(null);
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [locationStatusMessage, setLocationStatusMessage] = useState<string | null>(null);
  const [showUserMarkerInfo, setShowUserMarkerInfo] = useState<boolean>(false);
  const [targetCoords, setTargetCoords] = useState<{ lat: number; lng: number } | null>(tpaCenter);
  const [targetZoom, setTargetZoom] = useState<number>(14);

  // VRP simulation
  const [isVrpSimulating, setIsVrpSimulating] = useState<boolean>(false);
  const [simulatedStep, setSimulatedStep] = useState<number>(2);

  // Compute dynamic distances for each facility relative to current user location
  const facilitiesWithDistance = useMemo(() => {
    return GIS_FACILITIES.map((fac) => {
      const distance = userLocation
        ? calculateHaversineDistanceKm(
            userLocation.lat,
            userLocation.lng,
            fac.latitude,
            fac.longitude
          )
        : fac.distanceKm;
      const meters = Math.round(distance * 1000);
      const walkMinutes = Math.max(1, Math.round(meters / 75)); // ~4.5 km/h average walking pace
      return {
        ...fac,
        liveDistanceKm: distance,
        liveDistanceMeters: meters,
        estimatedWalkMinutes: walkMinutes,
      };
    });
  }, [userLocation]);

  // Filter facilities based on landfill vs reduction points
  const filteredFacilities = useMemo(() => {
    return facilitiesWithDistance.filter((f) => {
      if (filterType === 'final_landfill' && !f.isFinalLandfill) return false;
      if (filterType === 'campus_reduction' && f.isFinalLandfill) return false;
      if (filterType === 'special_dropbox' && !f.isSpecialDropbox) return false;
      if (filterCategory !== 'all' && !f.acceptsCategories.includes(filterCategory as WasteCategoryType)) return false;
      return true;
    });
  }, [facilitiesWithDistance, filterType, filterCategory]);

  const finalLandfills = facilitiesWithDistance.filter((f) => f.isFinalLandfill);
  const reductionFacilities = facilitiesWithDistance.filter((f) => !f.isFinalLandfill);
  const specialDropboxes = facilitiesWithDistance.filter((f) => f.isSpecialDropbox);
  const primaryTpa = facilitiesWithDistance.find((f) => f.id === 'tpa_tamangapa') || facilitiesWithDistance[0];

  // Geolocation trigger
  const handleLocateUser = () => {
    if (!('geolocation' in navigator)) {
      setLocationStatusMessage('Browser Anda tidak mendukung HTML5 Geolocation.');
      return;
    }

    setIsLocating(true);
    setLocationStatusMessage('Mencari sinyal satelit GPS dengan presisi tinggi...');

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setUserLocation(loc);
        setTargetCoords(loc);
        setTargetZoom(16);
        const accuracyM = Math.round(pos.coords.accuracy);
        setGpsAccuracy(accuracyM);
        setUserLocationName(`GPS Akurat Presisi (±${accuracyM}m)`);
        setLocationStatusMessage(`Lokasi GPS berhasil dikunci dengan akurasi ±${accuracyM} meter.`);
      },
      (err) => {
        setIsLocating(false);
        setLocationStatusMessage(
          err.code === 1
            ? 'Izin GPS belum diberikan. Silakan pilih salah satu Preset Kampus di bawah ini.'
            : 'Sinyal GPS timeout. Mengarahkan pada preset kampus.'
        );
        setTargetCoords(campusCenter);
        setTargetZoom(15);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const handleSelectPreset = (preset: CampusPreset) => {
    setUserLocation(preset.coords);
    setTargetCoords(preset.coords);
    setTargetZoom(16);
    setUserLocationName(preset.name);
    setGpsAccuracy(15);
    setLocationStatusMessage(`Posisi dialihkan ke ${preset.name}.`);
  };

  const handleSelectFacility = (fac: GISFacility) => {
    setSelectedFacility(fac);
    setTargetCoords({ lat: fac.latitude, lng: fac.longitude });
    setTargetZoom(fac.isFinalLandfill ? 15 : 17);
    setActiveInfoWindow(fac);
  };

  const handleFocusTPA = () => {
    setSelectedFacility(primaryTpa);
    setTargetCoords(tpaCenter);
    setTargetZoom(15);
    setActiveInfoWindow(primaryTpa);
  };

  const handleFocusCampus = () => {
    setTargetCoords(campusCenter);
    setTargetZoom(15);
  };

  const handleFocusFullCorridor = () => {
    setTargetCoords(fullCorridorCenter);
    setTargetZoom(13);
  };

  // VRP Step Simulation
  const handleSimulateVrp = () => {
    setIsVrpSimulating(true);
    setSimulatedStep(0);
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
      {/* Header Banner */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-rose-100 text-rose-800 border border-rose-200 flex items-center gap-1">
              <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
              <span>Peta Tempat Limbah Sampah Akhir (TPA) & Titik Pilah</span>
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-200 flex items-center gap-1">
              <AlertTriangle className="w-3 h-3 text-amber-600" />
              <span>Status TPA Tamangapa: Kritis Overcapacity</span>
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900">
            Penandaan Spasial Tempat Pembuangan Akhir (TPA) & Fasilitas Reduksi
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-3xl leading-relaxed">
            Peta ini menandai secara spesifik <strong>Tempat Pemrosesan Akhir (TPA Tamangapa Antang)</strong> sebagai muara akhir sampah Kota Makassar, fasilitas pengolahan residu (TPST RDF), serta titik pilah kampus (TPS3R & Bank Sampah) yang bertugas mencegah sampah membebani gunungan TPA.
          </p>
        </div>

        {/* Quick Corridor Buttons */}
        <div className="flex flex-wrap lg:flex-col gap-2 shrink-0">
          <button
            onClick={handleFocusTPA}
            id="btn-focus-tpa-akhir"
            className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
          >
            <Mountain className="w-4 h-4" />
            <span>Fokus ke TPA Sampah Akhir (Tamangapa)</span>
          </button>
          <button
            onClick={handleFocusFullCorridor}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
          >
            <Route className="w-4 h-4 text-emerald-400" />
            <span>Lihat Alur Kampus ➔ TPA (5.2 km)</span>
          </button>
        </div>
      </div>

      {/* Subtab Navigation Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex flex-wrap p-1 rounded-lg bg-slate-100 border border-slate-200 gap-1">
          <button
            onClick={() => setActiveSubTab('map')}
            className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeSubTab === 'map'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <MapPin className="w-3.5 h-3.5 text-rose-600" />
            <span>Peta Interaktif TPA & Titik Pilah</span>
          </button>

          <button
            onClick={() => setActiveSubTab('landfill_profile')}
            className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeSubTab === 'landfill_profile'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Mountain className="w-3.5 h-3.5 text-amber-600" />
            <span>Kondisi Gunungan TPA Tamangapa</span>
          </button>

          <button
            onClick={() => setActiveSubTab('waste_flow')}
            className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeSubTab === 'waste_flow'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <TrendingDown className="w-3.5 h-3.5 text-emerald-600" />
            <span>Alur Perjalanan Sampah Kampus</span>
          </button>

          <button
            onClick={() => setActiveSubTab('schedule')}
            className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeSubTab === 'schedule'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Calendar className="w-3.5 h-3.5 text-blue-600" />
            <span>Daftar Fasilitas & Jadwal</span>
          </button>

          <button
            onClick={() => setActiveSubTab('vrp')}
            className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeSubTab === 'vrp'
                ? 'bg-emerald-600 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Route className="w-3.5 h-3.5" />
            <span>Simulasi Armada Jemput Kampus</span>
          </button>
        </div>

        {/* API Key configuration toggle */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-500 font-medium">Google Maps API:</span>
          {apiKey ? (
            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px] flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              <span>Key Aktif</span>
            </span>
          ) : (
            <button
              onClick={() => setShowKeyPrompt(true)}
              className="px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 font-bold text-[11px] hover:bg-amber-100 flex items-center gap-1 cursor-pointer"
            >
              <Key className="w-3 h-3" />
              <span>Atur API Key / Demo Key</span>
            </button>
          )}
        </div>
      </div>

      {/* API Key Modal / Setup banner if requested */}
      {showKeyPrompt && (
        <div className="p-4 rounded-xl bg-gradient-to-r from-slate-900 to-slate-800 text-white border border-slate-700 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Key className="w-4 h-4 text-emerald-400" />
              <h4 className="font-bold text-xs sm:text-sm">Konfigurasi Google Maps API Key</h4>
            </div>
            <button
              onClick={() => setShowKeyPrompt(false)}
              className="text-xs text-slate-400 hover:text-white cursor-pointer"
            >
              Tutup
            </button>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
            Untuk merender peta satelit Google Maps Platform secara penuh tanpa batas, Anda dapat memasukkan Google Cloud API Key atau menggunakan <strong>Maps Demo Key</strong> gratis tanpa tagihan kartu kredit (
            <a
              href="https://mapsplatform.google.com/maps-demo-key?utm_campaign=gmp_mcp_codeassist_v1_aistudio"
              target="_blank"
              rel="noreferrer"
              className="text-emerald-400 underline inline-flex items-center gap-0.5"
            >
              Ambil Demo Key <ExternalLink className="w-3 h-3" />
            </a>
            ).
          </p>
          <div className="flex gap-2 max-w-lg">
            <input
              type="text"
              placeholder="Tempel Google Maps API Key / Demo Key di sini..."
              value={tempKeyInput}
              onChange={(e) => setTempKeyInput(e.target.value)}
              className="flex-1 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white focus:outline-emerald-400"
            />
            <button
              onClick={() => {
                if (tempKeyInput.trim()) {
                  setApiKey(tempKeyInput.trim());
                  setShowKeyPrompt(false);
                }
              }}
              className="px-4 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs transition-colors cursor-pointer"
            >
              Terapkan
            </button>
          </div>
        </div>
      )}

      {/* ================= SUBTAB 1: PETA GOOGLE MAPS INTERAKTIF ================= */}
      {activeSubTab === 'map' && (
        <div className="space-y-6">
          {/* Quick Action & Positioning Strip */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 border border-rose-100">
                  <Mountain className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Titik Pengamatan Spasial
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200">
                      TPA Tamangapa berjarak ±5.2 km dari Kampus Unhas
                    </span>
                  </div>
                  <h3 className="text-sm sm:text-base font-extrabold text-slate-900 mt-0.5 flex items-center gap-1.5">
                    <span>Posisi Anda: {userLocationName}</span>
                  </h3>
                </div>
              </div>

              {/* Action Buttons: Live GPS & TPA Focus */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={handleLocateUser}
                  disabled={isLocating}
                  id="btn-get-live-gps"
                  className="px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer active:scale-95"
                >
                  <Crosshair className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin' : ''}`} />
                  <span>{isLocating ? 'Mencari GPS...' : 'GPS Saya'}</span>
                </button>
                <button
                  onClick={handleFocusTPA}
                  className="px-3 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer active:scale-95"
                >
                  <Mountain className="w-3.5 h-3.5" />
                  <span>Sorot TPA Akhir</span>
                </button>
                <button
                  onClick={handleFocusCampus}
                  className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Building2 className="w-3.5 h-3.5" />
                  <span>Kembali ke Kampus</span>
                </button>
              </div>
            </div>

            {/* Quick Campus Landmark Presets */}
            <div>
              <div className="flex items-center justify-between mb-2 text-xs">
                <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-slate-400" />
                  <span>Pilih Lokasi Awal Mahasiswa (Unhas Tamalanrea):</span>
                </span>
                <span className="text-slate-400 text-[11px]">Simulasi jarak dari fakultas Anda ke TPA</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
                {CAMPUS_PRESETS.map((preset) => {
                  const isSelected = userLocationName.includes(preset.faculty);
                  return (
                    <button
                      key={preset.id}
                      onClick={() => handleSelectPreset(preset)}
                      className={`p-2 rounded-xl text-left border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-rose-50 border-rose-400 text-rose-950 font-bold shadow-2xs ring-1 ring-rose-400'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-300'
                      }`}
                    >
                      <div className="text-[11px] font-bold truncate">{preset.faculty}</div>
                      <div className="text-[10px] text-slate-500 truncate mt-0.5">Unhas Tamalanrea</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {locationStatusMessage && (
              <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 text-xs flex items-center gap-2">
                <Info className="w-4 h-4 text-blue-600 shrink-0" />
                <span>{locationStatusMessage}</span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: Google Map View Container (8 cols) */}
            <div className="lg:col-span-8 bg-slate-900 rounded-2xl overflow-hidden border border-slate-200 shadow-md flex flex-col">
              {/* Map Top Bar Control Strip */}
              <div className="px-4 py-2.5 bg-slate-950 text-white flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <Compass className="w-4 h-4 text-rose-400" />
                  <span className="font-mono text-[11px] text-slate-300 font-semibold">
                    Google Maps Platform • Koridor Pengelolaan Sampah Kota Makassar
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {/* Map Type Toggle */}
                  <button
                    onClick={() => setMapType(mapType === 'roadmap' ? 'hybrid' : 'roadmap')}
                    className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <Layers className="w-3 h-3 text-blue-400" />
                    <span>{mapType === 'roadmap' ? 'Mode Satelit (Lihat Gunungan)' : 'Mode Jalan (Roadmap)'}</span>
                  </button>
                </div>
              </div>

              {/* Map Area */}
              <div className="relative w-full h-[520px] bg-slate-950">
                <APIProvider apiKey={apiKey} libraries={['marker', 'routes']}>
                  <Map
                    mapId="DEMO_MAP_ID"
                    defaultCenter={fullCorridorCenter}
                    defaultZoom={13}
                    gestureHandling="greedy"
                    mapTypeId={mapType}
                    disableDefaultUI={false}
                    internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
                    style={{ width: '100%', height: '100%' }}
                  >
                    <MapPanController targetCoords={targetCoords} targetZoom={targetZoom} />

                    {/* User Geolocation Marker with pulsating blue ring */}
                    {userLocation && (
                      <AdvancedMarker
                        position={userLocation}
                        title="Posisi Mahasiswa (Titik Timbulan Sampah)"
                        onClick={() => setShowUserMarkerInfo(true)}
                      >
                        <div className="relative flex items-center justify-center cursor-pointer">
                          <span className="w-6 h-6 rounded-full bg-blue-500/40 ring-4 ring-blue-400/50 animate-ping absolute"></span>
                          <span className="w-4 h-4 rounded-full bg-blue-600 border-2 border-white relative z-10 shadow-lg flex items-center justify-center">
                            <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                          </span>
                        </div>
                      </AdvancedMarker>
                    )}

                    {/* User Location Info Window */}
                    {showUserMarkerInfo && userLocation && (
                      <InfoWindow
                        position={userLocation}
                        onCloseClick={() => setShowUserMarkerInfo(false)}
                      >
                        <div className="p-1 max-w-xs text-xs space-y-1.5 text-slate-900">
                          <div className="flex items-center gap-1.5">
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-black bg-blue-100 text-blue-800">
                              Posisi Mahasiswa (Hulu)
                            </span>
                          </div>
                          <h4 className="font-bold text-slate-900 text-xs">
                            {userLocationName}
                          </h4>
                          <p className="text-[11px] text-slate-600">
                            Jarak tempuh ke <strong>TPA Tamangapa Antang</strong>: ±{primaryTpa.liveDistanceKm} km
                          </p>
                          <div className="p-1.5 bg-rose-50 rounded border border-rose-200 text-[10px] text-rose-800">
                            Jika sampah Anda tidak dipilah di sini, armada dinas kebersihan akan mengangkutnya ke TPA Tamangapa.
                          </div>
                          <button
                            onClick={() => {
                              setShowUserMarkerInfo(false);
                              handleFocusTPA();
                            }}
                            className="w-full py-1 text-center rounded bg-rose-600 text-white font-bold text-[10px] hover:bg-rose-700 cursor-pointer"
                          >
                            Sorot TPA Tamangapa di Peta
                          </button>
                        </div>
                      </InfoWindow>
                    )}

                    {/* Facilities Advanced Markers with Distinct Styling for TPA Akhir */}
                    {filteredFacilities.map((fac) => {
                      const isSelected = selectedFacility.id === fac.id;
                      const isLandfill = fac.isFinalLandfill;

                      if (isLandfill) {
                        return (
                          <AdvancedMarker
                            key={fac.id}
                            position={{ lat: fac.latitude, lng: fac.longitude }}
                            onClick={() => handleSelectFacility(fac)}
                            title={`${fac.name} (TEMPAT LIMBAH SAMPAH AKHIR)`}
                          >
                            <div className="relative flex flex-col items-center cursor-pointer group">
                              {/* Pulsing beacon for TPA Sampah Akhir Utama */}
                              {fac.type === 'TPA Sampah Akhir' && (
                                <span className="w-9 h-9 rounded-full bg-rose-600/40 ring-4 ring-rose-500/50 animate-ping absolute -top-1"></span>
                              )}
                              <div
                                className={`px-2.5 py-1 rounded-xl text-white font-black text-[10px] flex items-center gap-1 shadow-xl border-2 transition-transform ${
                                  fac.type === 'TPA Sampah Akhir'
                                    ? 'bg-rose-700 border-white ring-2 ring-rose-600'
                                    : fac.type === 'TPST Pengolahan Akhir'
                                    ? 'bg-purple-700 border-white ring-2 ring-purple-600'
                                    : 'bg-amber-700 border-white ring-2 ring-amber-600'
                                } ${isSelected ? 'scale-125' : 'scale-100 group-hover:scale-110'}`}
                              >
                                <Mountain className="w-3.5 h-3.5 text-amber-300" />
                                <span>
                                  {fac.type === 'TPA Sampah Akhir'
                                    ? 'TPA AKHIR'
                                    : fac.type === 'TPST Pengolahan Akhir'
                                    ? 'TPST RDF'
                                    : 'TPA B3'}
                                </span>
                              </div>
                              <div
                                className={`w-2.5 h-2.5 rotate-45 -mt-1 border-r-2 border-b-2 border-white ${
                                  fac.type === 'TPA Sampah Akhir'
                                    ? 'bg-rose-700'
                                    : fac.type === 'TPST Pengolahan Akhir'
                                    ? 'bg-purple-700'
                                    : 'bg-amber-700'
                                }`}
                              ></div>
                            </div>
                          </AdvancedMarker>
                        );
                      }

                      // Standard reduction facilities (TPS3R, Drop Box, Bank Sampah)
                      const pinBg =
                        fac.type === 'TPS3R'
                          ? '#059669' // Emerald
                          : fac.type === 'Drop Box Kampus'
                          ? '#2563eb' // Blue
                          : '#d97706'; // Amber

                      return (
                        <AdvancedMarker
                          key={fac.id}
                          position={{ lat: fac.latitude, lng: fac.longitude }}
                          onClick={() => handleSelectFacility(fac)}
                          title={`${fac.name} (Titik Pilah Reduksi Hulu)`}
                        >
                          <Pin
                            background={pinBg}
                            glyphColor="#ffffff"
                            borderColor="#ffffff"
                            scale={isSelected ? 1.25 : 0.95}
                          />
                        </AdvancedMarker>
                      );
                    })}

                    {/* InfoWindow for Active Facility */}
                    {activeInfoWindow && (
                      <InfoWindow
                        position={{ lat: activeInfoWindow.latitude, lng: activeInfoWindow.longitude }}
                        onCloseClick={() => setActiveInfoWindow(null)}
                      >
                        <div className="p-1 max-w-xs text-xs space-y-1.5 text-slate-900">
                          <div className="flex items-center gap-1.5">
                            <span
                              className={`px-1.5 py-0.5 rounded text-[10px] font-black ${
                                activeInfoWindow.isFinalLandfill
                                  ? 'bg-rose-100 text-rose-900 border border-rose-300'
                                  : 'bg-emerald-100 text-emerald-800'
                              }`}
                            >
                              {activeInfoWindow.type}
                            </span>
                            <span className="text-[10px] text-slate-500 font-bold">
                              {(activeInfoWindow as any).liveDistanceMeters < 1000
                                ? `${(activeInfoWindow as any).liveDistanceMeters}m`
                                : `${(activeInfoWindow as any).liveDistanceKm} km dari Anda`}
                            </span>
                          </div>
                          <h4 className="font-bold text-slate-900 text-xs">
                            {activeInfoWindow.name}
                          </h4>
                          <p className="text-[11px] text-slate-600">
                            {activeInfoWindow.address}
                          </p>

                          {activeInfoWindow.isFinalLandfill ? (
                            <div className="p-1.5 bg-rose-50 rounded border border-rose-200 space-y-0.5 text-[10px]">
                              <div className="font-bold text-rose-900">
                                Status: {activeInfoWindow.landfillStatus}
                              </div>
                              <div className="text-slate-700">
                                Tinggi Gunungan: <strong>{activeInfoWindow.mountainHeightM} meter</strong>
                              </div>
                              <div className="text-slate-700">
                                Pasokan Harian: <strong>{activeInfoWindow.dailyIncomingTons} ton/hari</strong>
                              </div>
                            </div>
                          ) : (
                            <div className="text-[10px] text-slate-600">
                              <strong>Beban:</strong> {activeInfoWindow.currentLoadKg} / {activeInfoWindow.capacityDailyKg} kg/hari
                            </div>
                          )}

                          <a
                            href={`https://www.google.com/maps/dir/?api=1&origin=${userLocation ? `${userLocation.lat},${userLocation.lng}` : ''}&destination=${activeInfoWindow.latitude},${activeInfoWindow.longitude}`}
                            target="_blank"
                            rel="noreferrer"
                            className="mt-1 block text-center py-1 px-2 rounded bg-rose-600 text-white font-bold text-[10px] hover:bg-rose-700"
                          >
                            Buka Rute Navigasi Google Maps
                          </a>
                        </div>
                      </InfoWindow>
                    )}
                  </Map>
                </APIProvider>
              </div>

              {/* Bottom Filter Strip */}
              <div className="p-3 bg-slate-950 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-300">
                {/* Type Filter Buttons */}
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-slate-400 font-medium mr-1">Tampilkan:</span>
                  <button
                    onClick={() => setFilterType('all')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      filterType === 'all'
                        ? 'bg-white text-slate-900 shadow-2xs'
                        : 'bg-slate-900 text-slate-300 hover:text-white'
                    }`}
                  >
                    Semua Titik ({facilitiesWithDistance.length})
                  </button>
                  <button
                    onClick={() => setFilterType('final_landfill')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                      filterType === 'final_landfill'
                        ? 'bg-rose-600 text-white shadow-2xs'
                        : 'bg-slate-900 text-rose-400 hover:text-rose-200'
                    }`}
                  >
                    <Mountain className="w-3 h-3" />
                    <span>Tempat Sampah Akhir TPA ({finalLandfills.length})</span>
                  </button>
                  <button
                    onClick={() => setFilterType('campus_reduction')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                      filterType === 'campus_reduction'
                        ? 'bg-emerald-600 text-white shadow-2xs'
                        : 'bg-slate-900 text-emerald-400 hover:text-emerald-200'
                    }`}
                  >
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Titik Pilah Kampus ({reductionFacilities.length})</span>
                  </button>
                  <button
                    onClick={() => setFilterType('special_dropbox')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                      filterType === 'special_dropbox'
                        ? 'bg-amber-500 text-slate-950 shadow-2xs'
                        : 'bg-slate-900 text-amber-300 hover:text-amber-100'
                    }`}
                  >
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    <span>Drop Box Khusus ({specialDropboxes.length})</span>
                  </button>
                </div>

                {/* Material Category Filter */}
                <div className="flex items-center gap-2">
                  <span className="text-slate-400 font-medium">Material:</span>
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="bg-slate-900 border border-slate-800 text-slate-200 text-xs px-2.5 py-1 rounded-lg focus:outline-rose-500"
                  >
                    <option value="all">Semua Kategori</option>
                    <option value="organik">Organik</option>
                    <option value="plastik">Plastik</option>
                    <option value="kertas">Kertas</option>
                    <option value="khusus">B3 / Khusus</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Right: Selected Facility Card & Details (4 cols) */}
            <div className="lg:col-span-4 space-y-4">
              {/* Selected Facility Card */}
              <div
                className={`bg-white rounded-2xl p-5 border shadow-xs space-y-4 ${
                  selectedFacility.isFinalLandfill
                    ? 'border-rose-300 ring-1 ring-rose-200'
                    : 'border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`px-2.5 py-1 rounded-lg text-xs font-black flex items-center gap-1 ${
                      selectedFacility.isFinalLandfill
                        ? 'bg-rose-100 text-rose-900 border border-rose-300'
                        : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                    }`}
                  >
                    {selectedFacility.isFinalLandfill && <Mountain className="w-3.5 h-3.5 text-rose-600" />}
                    <span>{selectedFacility.type}</span>
                  </span>
                  <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-rose-600" />
                    <span>
                      {(selectedFacility as any).liveDistanceMeters !== undefined
                        ? (selectedFacility as any).liveDistanceMeters < 1000
                          ? `${(selectedFacility as any).liveDistanceMeters} m dari Anda`
                          : `${(selectedFacility as any).liveDistanceKm} km dari Anda`
                        : `${selectedFacility.distanceKm} km`}
                    </span>
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-black text-slate-900 leading-snug">
                    {selectedFacility.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    {selectedFacility.address}
                  </p>
                </div>

                {/* Specific Landfill Stats Banner */}
                {selectedFacility.isFinalLandfill ? (
                  <div className="p-3.5 rounded-xl bg-gradient-to-br from-rose-50 to-amber-50 border border-rose-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-rose-900 flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                        <span>Status Kapasitas TPA:</span>
                      </span>
                      <span className="px-2 py-0.5 rounded bg-rose-600 text-white font-black text-[10px]">
                        {selectedFacility.landfillStatus}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="p-2 rounded-lg bg-white/80 border border-rose-100">
                        <div className="text-[10px] text-slate-500 font-semibold">Tinggi Timbunan</div>
                        <div className="text-base font-black text-rose-700">
                          {selectedFacility.mountainHeightM} Meter
                        </div>
                        <div className="text-[9px] text-slate-400">Setara gedung 10 lantai</div>
                      </div>

                      <div className="p-2 rounded-lg bg-white/80 border border-rose-100">
                        <div className="text-[10px] text-slate-500 font-semibold">Luas Area TPA</div>
                        <div className="text-base font-black text-slate-900">
                          {selectedFacility.landfillAreaHectares} Ha
                        </div>
                        <div className="text-[9px] text-slate-400">Lahan hampir habis</div>
                      </div>

                      <div className="p-2 rounded-lg bg-white/80 border border-rose-100">
                        <div className="text-[10px] text-slate-500 font-semibold">Debit Masuk / Hari</div>
                        <div className="text-base font-black text-slate-900">
                          {selectedFacility.dailyIncomingTons} Ton
                        </div>
                        <div className="text-[9px] text-slate-400">Dari seluruh Makassar</div>
                      </div>

                      <div className="p-2 rounded-lg bg-white/80 border border-rose-100">
                        <div className="text-[10px] text-slate-500 font-semibold">Risiko Gas Metana</div>
                        <div className="text-base font-black text-amber-700">
                          {selectedFacility.methaneRisk}
                        </div>
                        <div className="text-[9px] text-slate-400">Efek rumah kaca 28x CO₂</div>
                      </div>
                    </div>

                    {selectedFacility.leachateManagement && (
                      <div className="text-[11px] text-slate-700 bg-white/90 p-2 rounded-lg border border-rose-100">
                        <strong>Pengolahan Lindi (Air Sampah):</strong> {selectedFacility.leachateManagement}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between items-center py-1 border-b border-slate-100">
                      <span className="text-slate-500">Kapasitas Harian</span>
                      <span className="font-semibold text-slate-900">
                        {selectedFacility.capacityDailyKg} kg / hari
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-1">
                      <span className="text-slate-500">Beban Hari Ini</span>
                      <span className="font-bold text-emerald-700">
                        {selectedFacility.currentLoadKg} kg ({Math.round((selectedFacility.currentLoadKg / selectedFacility.capacityDailyKg) * 100)}%)
                      </span>
                    </div>
                  </div>
                )}

                {selectedFacility.isSpecialDropbox && selectedFacility.acceptedItemsDetail && (
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs space-y-1">
                    <div className="font-bold text-amber-900 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                      <span>Material Khusus yang Diterima di Drop Box Ini:</span>
                    </div>
                    <div className="text-amber-800 text-[11px] font-medium leading-relaxed">
                      {selectedFacility.acceptedItemsDetail}
                    </div>
                  </div>
                )}

                {selectedFacility.operatingHours && (
                  <div className="flex items-center gap-2 text-xs text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                    <Clock className="w-4 h-4 text-emerald-600 shrink-0" />
                    <div>
                      <span className="font-bold text-slate-800">Jam Layanan: </span>
                      <span>{selectedFacility.operatingHours}</span>
                    </div>
                  </div>
                )}

                {selectedFacility.contactPhone && (
                  <div className="flex items-center justify-between p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <Phone className="w-4 h-4 text-emerald-700 shrink-0" />
                      <div className="min-w-0">
                        <div className="font-bold text-emerald-950 truncate">Kontak Petugas / Pengelola:</div>
                        <div className="text-slate-600 text-[11px] font-mono">{selectedFacility.contactPhone}</div>
                      </div>
                    </div>
                    <a
                      href={`https://wa.me/62${selectedFacility.contactPhone.replace(/[^0-9]/g, '').replace(/^62|^0/, '')}?text=${encodeURIComponent(`Halo Pengelola ${selectedFacility.name}, saya sivitas akademika ingin menanyakan penerimaan drop box sampah.`)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors shrink-0"
                    >
                      WhatsApp
                    </a>
                  </div>
                )}

                <div className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200 leading-relaxed">
                  <span className="font-bold text-slate-800">
                    {selectedFacility.isFinalLandfill ? 'Peran Sebagai Tempat Sampah Akhir:' : 'Peran Reduksi Hulu:'}
                  </span>{' '}
                  {selectedFacility.significance}
                </div>

                <a
                  href={`https://www.google.com/maps/dir/?api=1&origin=${userLocation ? `${userLocation.lat},${userLocation.lng}` : ''}&destination=${selectedFacility.latitude},${selectedFacility.longitude}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
                >
                  <Navigation className="w-3.5 h-3.5 text-rose-400" />
                  <span>Buka Navigasi Rute di Google Maps</span>
                </a>
              </div>

              {/* Quick list of facilities grouped by Landfill vs Reduction */}
              <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-900">Daftar Tempat Sampah Akhir (TPA):</span>
                  <span className="text-[11px] text-rose-600 font-bold">{finalLandfills.length} Lokasi</span>
                </div>
                <div className="space-y-1.5">
                  {finalLandfills.map((fac) => (
                    <div
                      key={fac.id}
                      onClick={() => handleSelectFacility(fac)}
                      className={`p-2.5 rounded-xl border text-xs cursor-pointer transition-all flex items-center justify-between ${
                        selectedFacility.id === fac.id
                          ? 'bg-rose-50 border-rose-300 font-bold text-rose-950 shadow-2xs'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <div className="truncate pr-2">
                        <div className="truncate text-xs font-bold text-slate-900">{fac.name}</div>
                        <div className="text-[10px] text-rose-700 truncate mt-0.5">{fac.subdistrict} • {fac.landfillStatus}</div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="text-xs font-bold text-rose-700">
                          {fac.liveDistanceKm} km
                        </div>
                        <div className="text-[10px] text-slate-400">dari kampus</div>
                      </div>
                    </div>
                  ))}
                </div>

                {specialDropboxes.length > 0 && (
                  <>
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="font-bold text-amber-900 flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                        <span>Drop Box Khusus (E-Waste, Tekstil, Jelantah):</span>
                      </span>
                      <span className="text-[11px] text-amber-700 font-bold">{specialDropboxes.length} Titik</span>
                    </div>
                    <div className="space-y-1">
                      {specialDropboxes.map((fac) => (
                        <div
                          key={fac.id}
                          onClick={() => handleSelectFacility(fac)}
                          className={`p-2 rounded-lg border text-xs cursor-pointer transition-all flex items-center justify-between ${
                            selectedFacility.id === fac.id
                              ? 'bg-amber-100/70 border-amber-300 font-bold text-amber-950 shadow-2xs'
                              : 'bg-amber-50/40 border-amber-200/60 text-slate-700 hover:bg-amber-100/50'
                          }`}
                        >
                          <div className="truncate pr-2">
                            <div className="truncate text-xs font-medium text-slate-900">{fac.name}</div>
                            <div className="text-[10px] text-amber-800 truncate">{fac.acceptedItemsDetail || fac.categoryLabel}</div>
                          </div>
                          <div className="text-right shrink-0 text-[11px] font-bold text-amber-800">
                            {fac.liveDistanceMeters < 1000 ? `${fac.liveDistanceMeters}m` : `${fac.liveDistanceKm}km`}
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-700">Titik Pilah Kampus (Pencegah ke TPA):</span>
                  <span className="text-[11px] text-emerald-600 font-bold">{reductionFacilities.length} Titik</span>
                </div>
                <div className="space-y-1 max-h-40 overflow-y-auto pr-1">
                  {reductionFacilities.map((fac) => (
                    <div
                      key={fac.id}
                      onClick={() => handleSelectFacility(fac)}
                      className={`p-2 rounded-lg border text-xs cursor-pointer transition-all flex items-center justify-between ${
                        selectedFacility.id === fac.id
                          ? 'bg-emerald-50 border-emerald-300 font-bold text-emerald-950 shadow-2xs'
                          : 'bg-white border-slate-100 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <div className="truncate pr-2">
                        <div className="truncate text-xs font-medium">{fac.name}</div>
                      </div>
                      <div className="text-right shrink-0 text-[11px] font-bold text-emerald-700">
                        {fac.liveDistanceMeters < 1000 ? `${fac.liveDistanceMeters}m` : `${fac.liveDistanceKm}km`}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= SUBTAB 2: PROFIL GUNUNGAN TPA TAMANGAPA ================= */}
      {activeSubTab === 'landfill_profile' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-rose-100 text-rose-900 border border-rose-200">
                  Tempat Pemrosesan Akhir (TPA) Utama Makassar
                </span>
                <span className="text-xs text-slate-500">Koordinat: -5.1765° S, 119.4942° E</span>
              </div>
              <h3 className="text-lg font-black text-slate-900">
                Profil Realita TPA Tamangapa (TPA Antang): Muara Akhir Sampah Kota
              </h3>
              <p className="text-xs text-slate-600 mt-1 max-w-2xl">
                TPA Tamangapa adalah satu-satunya tempat pemrosesan limbah sampah akhir skala kota yang menampung timbunan dari 15 kecamatan di Makassar, termasuk residu dari Universitas Hasanuddin.
              </p>
            </div>

            <button
              onClick={() => {
                handleFocusTPA();
                setActiveSubTab('map');
              }}
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer shrink-0"
            >
              <MapPin className="w-4 h-4" />
              <span>Lihat Posisi TPA di Peta</span>
            </button>
          </div>

          {/* Key Facts Infographic Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 space-y-1">
              <div className="flex items-center justify-between text-rose-800">
                <span className="text-xs font-bold uppercase">Tinggi Gunungan</span>
                <Mountain className="w-4 h-4" />
              </div>
              <div className="text-2xl font-black text-rose-900">35 Meter</div>
              <p className="text-[11px] text-rose-700">
                Timbunan sampah organik dan plastik menumpuk melebihi kapasitas standar aman sanitary landfill (maks 20m).
              </p>
            </div>

            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 space-y-1">
              <div className="flex items-center justify-between text-amber-800">
                <span className="text-xs font-bold uppercase">Debit Masuk Harian</span>
                <Truck className="w-4 h-4" />
              </div>
              <div className="text-2xl font-black text-amber-900">~950 Ton/Hari</div>
              <p className="text-[11px] text-amber-700">
                Diangkut oleh lebih dari 300 armada truk dinas kebersihan Makassar setiap hari selama 24 jam.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <div className="flex items-center justify-between text-slate-800">
                <span className="text-xs font-bold uppercase">Luas Lahan Aktif</span>
                <Layers className="w-4 h-4" />
              </div>
              <div className="text-2xl font-black text-slate-900">19.8 Hektar</div>
              <p className="text-[11px] text-slate-600">
                Beroperasi sejak 1993, saat ini 97% kapasitas tampung telah terisi penuh (overcapacity).
              </p>
            </div>

            <div className="p-4 rounded-xl bg-purple-50 border border-purple-200 space-y-1">
              <div className="flex items-center justify-between text-purple-800">
                <span className="text-xs font-bold uppercase">Gas Rumah Kaca</span>
                <Flame className="w-4 h-4" />
              </div>
              <div className="text-2xl font-black text-purple-900">Metana (CH₄)</div>
              <p className="text-[11px] text-purple-700">
                Dekomposisi anaerobik sampah makanan basah memicu pelepasan gas metana yang rentan terbakar saat kemarau.
              </p>
            </div>
          </div>

          {/* Detailed Environmental Challenges */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center gap-2 text-rose-700 font-bold text-sm">
                <ShieldAlert className="w-5 h-5" />
                <h4>Dampak Ekologis Jika Sampah Terus Masuk ke TPA Tanpa Dipilah</h4>
              </div>
              <ul className="space-y-2 text-xs text-slate-600">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-600 mt-1.5 shrink-0"></span>
                  <span><strong>Air Lindi (Leachate)</strong>: Air rembesan sampah yang kaya zat organik pekat dan logam berat berpotensi meresap mencemari air tanah pemukiman di sekitar Antang.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-600 mt-1.5 shrink-0"></span>
                  <span><strong>Emisi Metana 28x Lebih Kuat</strong>: Gas metana dari tumpukan sampah makanan di TPA menyumbang pemanasan global 28 kali lebih agresif daripada CO₂.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-600 mt-1.5 shrink-0"></span>
                  <span><strong>Kebakaran TPA Musim Kemarau</strong>: Asap tebal dari kebakaran lapisan bawah sampah yang mengandung gas metana mengganggu pernapasan warga dan mahasiswa.</span>
                </li>
              </ul>
            </div>

            <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-3">
              <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
                <CheckCircle2 className="w-5 h-5" />
                <h4>Solusi Nyata: Reduksi di Sumber Kampus (Unhas Tamalanrea)</h4>
              </div>
              <ul className="space-y-2 text-xs text-slate-700">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 shrink-0"></span>
                  <span><strong>Pilah Sampah Organik ke Biokonversi Maggot</strong>: Mengalihkan sampah sisa kantin kampus agar diproses larva BSF, bukan dibuang ke TPA Tamangapa.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 shrink-0"></span>
                  <span><strong>Setor Botol PET ke Smart Drop Box Fakultas</strong>: Botol plastik yang dipilah langsung masuk jalur daur ulang industri tekstil dan botol daur ulang baru.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 shrink-0"></span>
                  <span><strong>Residu Terolah Menjadi RDF</strong>: Hanya residu padat kering tak bernilai yang dikirim ke fasilitas TPST RDF Tamangapa untuk bahan bakar semen.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* ================= SUBTAB 3: ALUR PERJALANAN SAMPAH KAMPUS ================= */}
      {activeSubTab === 'waste_flow' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-6">
          <div>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-900 border border-blue-200">
              Edukasi Siklus Hidup Limbah
            </span>
            <h3 className="text-lg font-black text-slate-900 mt-1">
              Ke Mana Sampah Anda Berakhir? Bandingkan 2 Skenario Nyata
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Tindakan kecil memilah kemasan makanan Anda di fakultas menentukan apakah sampah tersebut menjadi bahan bernilai atau menumpuk ratusan tahun di TPA Tamangapa.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Skenario 1: Tidak Dipilah (Berakhir di TPA) */}
            <div className="p-5 rounded-2xl bg-rose-50/70 border-2 border-rose-300 space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-lg bg-rose-600 text-white font-black text-xs flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>SKENARIO A: SAMPAH TERCAMPUR</span>
                </span>
                <span className="text-xs font-bold text-rose-800">Destinasi: TPA Tamangapa</span>
              </div>

              <div className="space-y-3">
                <div className="p-3 bg-white rounded-xl border border-rose-200 text-xs space-y-1">
                  <div className="font-bold text-slate-900">1. Kamar Kos / Kantin Kampus</div>
                  <p className="text-slate-600">Sisa nasi, botol plastik, dan tisu disatukan dalam satu kantong plastik kresek hitam.</p>
                </div>
                <div className="flex justify-center text-rose-400">
                  <ArrowRight className="w-4 h-4 rotate-90" />
                </div>
                <div className="p-3 bg-white rounded-xl border border-rose-200 text-xs space-y-1">
                  <div className="font-bold text-slate-900">2. Tempat Sampah Terbuka & Truk Angkut</div>
                  <p className="text-slate-600">Sampah membusuk, menghasilkan bau tak sedap dan cairan lengket yang mengotori plastik bernilai.</p>
                </div>
                <div className="flex justify-center text-rose-400">
                  <ArrowRight className="w-4 h-4 rotate-90" />
                </div>
                <div className="p-3 bg-rose-600 text-white rounded-xl border border-rose-700 text-xs space-y-1">
                  <div className="font-bold flex items-center gap-1.5">
                    <Mountain className="w-4 h-4" />
                    <span>3. Destinasi Akhir: TPA Tamangapa Antang</span>
                  </div>
                  <p className="text-rose-100">
                    Menumpuk di gunungan sampah setinggi 35m, menghasilkan gas metana dan air lindi berbahaya selama 450+ tahun!
                  </p>
                </div>
              </div>
            </div>

            {/* Skenario 2: Dipilah 3R (Bebas dari TPA) */}
            <div className="p-5 rounded-2xl bg-emerald-50/70 border-2 border-emerald-300 space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white font-black text-xs flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>SKENARIO B: DIPILAH DENGAN PRINSIP 3R</span>
                </span>
                <span className="text-xs font-bold text-emerald-800">Destinasi: Industri Daur Ulang</span>
              </div>

              <div className="space-y-3">
                <div className="p-3 bg-white rounded-xl border border-emerald-200 text-xs space-y-1">
                  <div className="font-bold text-slate-900">1. Kos / Fakultas (Pilah 3 Kategori)</div>
                  <p className="text-slate-600">Botol dibilas & dipipihkan, sisa makanan ke wadah basah, kertas skripsi dipisahkan.</p>
                </div>
                <div className="flex justify-center text-emerald-500">
                  <ArrowRight className="w-4 h-4 rotate-90" />
                </div>
                <div className="p-3 bg-white rounded-xl border border-emerald-200 text-xs space-y-1">
                  <div className="font-bold text-slate-900">2. Drop Point Smart Bin / TPS3R Tamalanrea</div>
                  <p className="text-slate-600">Mahasiswa mendapat Eco-Points, sampah organik diolah larva maggot menjadi pupuk organik.</p>
                </div>
                <div className="flex justify-center text-emerald-500">
                  <ArrowRight className="w-4 h-4 rotate-90" />
                </div>
                <div className="p-3 bg-emerald-700 text-white rounded-xl border border-emerald-800 text-xs space-y-1">
                  <div className="font-bold flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4" />
                    <span>3. Destinasi Akhir: Pabrik Daur Ulang & Pertanian</span>
                  </div>
                  <p className="text-emerald-100">
                    Plastik dicacah menjadi biji plastik baru, pupuk menyuburkan kebun kampus, dan 0% beban sampah ke TPA Tamangapa!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= SUBTAB 4: JADWAL & KAPASITAS FASILITAS ================= */}
      {activeSubTab === 'schedule' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-5">
          <div>
            <h3 className="font-bold text-slate-900 text-base">
              Daftar Tempat Pembuangan Akhir (TPA) & Fasilitas Pengolahan Sampah
            </h3>
            <p className="text-xs text-slate-500">
              Menampilkan seluruh fasilitas penerima limbah akhir di Kota Makassar dan titik reduksi hulu kampus.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
                  <th className="py-3 px-4">Nama Fasilitas</th>
                  <th className="py-3 px-4">Fungsi / Kategori</th>
                  <th className="py-3 px-4">Wilayah & Alamat</th>
                  <th className="py-3 px-4">Hari & Jam Layanan</th>
                  <th className="py-3 px-4">Kapasitas / Karakteristik</th>
                  <th className="py-3 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {GIS_FACILITIES.map((fac) => (
                  <tr key={fac.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 font-bold text-slate-900">
                      <div className="flex items-center gap-1.5">
                        {fac.isFinalLandfill && <Mountain className="w-3.5 h-3.5 text-rose-600" />}
                        <span>{fac.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          fac.isFinalLandfill
                            ? 'bg-rose-100 text-rose-900 border border-rose-300'
                            : 'bg-slate-100 text-slate-700 border border-slate-200'
                        }`}
                      >
                        {fac.type}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-600 max-w-xs truncate">
                      {fac.address}
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-800">
                      {fac.operatingHours}
                    </td>
                    <td className="py-3 px-4">
                      {fac.isFinalLandfill ? (
                        <div className="text-rose-800 font-bold">
                          Gunungan: {fac.mountainHeightM}m • {fac.landfillStatus}
                        </div>
                      ) : (
                        <div>
                          <div className="font-bold text-slate-900">{fac.currentLoadKg} / {fac.capacityDailyKg} kg</div>
                          <div className="w-24 bg-slate-100 rounded-full h-1.5 mt-1 overflow-hidden">
                            <div
                              className="bg-emerald-500 h-1.5 rounded-full"
                              style={{ width: `${(fac.currentLoadKg / fac.capacityDailyKg) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => {
                          handleSelectFacility(fac);
                          setActiveSubTab('map');
                        }}
                        className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] cursor-pointer"
                      >
                        Lihat di Peta
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================= SUBTAB 5: RUTE PENGANGKUTAN ARMADA VRP ================= */}
      {activeSubTab === 'vrp' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                Optimasi Rute Pengangkutan Armada Kampus (Vehicle Routing Problem)
              </h3>
              <p className="text-xs text-slate-500">
                Pengangkutan terjadwal dari drop point fakultas langsung ke TPS3R Tamalanrea untuk dipilah, sehingga residu yang menuju ke TPA Tamangapa terpangkas hingga 85%.
              </p>
            </div>
            <button
              onClick={handleSimulateVrp}
              disabled={isVrpSimulating}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white font-bold text-xs transition-colors flex items-center gap-2 shadow-xs shrink-0 cursor-pointer"
            >
              <Truck className="w-4 h-4" />
              <span>{isVrpSimulating ? 'Armada Sedang Bergerak...' : 'Jalankan Simulasi Logistik'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <div className="text-[11px] text-slate-500 font-semibold uppercase">Total Jarak Tempuh Harian</div>
              <div className="text-xl font-black text-slate-900">8.2 km <span className="text-xs text-emerald-600 font-bold">(-6.6 km)</span></div>
              <p className="text-[11px] text-slate-500">Sebelum optimasi: 14.8 km</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <div className="text-[11px] text-slate-500 font-semibold uppercase">Konsumsi BBM Armada</div>
              <div className="text-xl font-black text-slate-900">1.8 Liter <span className="text-xs text-emerald-600 font-bold">(-44.6%)</span></div>
              <p className="text-[11px] text-slate-500">Sebelum optimasi: 3.4 Liter</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <div className="text-[11px] text-slate-500 font-semibold uppercase">Status Armada Hari Ini</div>
              <div className="text-xl font-black text-emerald-700">Aktif Beroperasi</div>
              <p className="text-[11px] text-slate-500">Motor Listrik Roda Tiga Kampus #01 & #02</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="text-xs font-bold text-slate-900">Urutan Perjalanan Armada Kampus Saat Ini:</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              {VRP_STOPS.map((stop, idx) => (
                <div
                  key={stop.id}
                  className={`p-3 rounded-xl border text-xs space-y-1.5 transition-all ${
                    idx === simulatedStep
                      ? 'bg-amber-50 border-amber-400 ring-2 ring-amber-300'
                      : idx < simulatedStep
                      ? 'bg-emerald-50/70 border-emerald-300'
                      : 'bg-slate-50 border-slate-200 opacity-60'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="w-5 h-5 rounded-full bg-slate-900 text-white font-black flex items-center justify-center text-[10px]">
                      {stop.sequence}
                    </span>
                    <span className="text-[10px] font-bold text-slate-500">
                      {idx < simulatedStep ? '✓ Selesai' : idx === simulatedStep ? 'Sedang Dituju' : 'Menunggu'}
                    </span>
                  </div>
                  <div className="font-bold text-slate-900 text-xs truncate">{stop.name}</div>
                  <div className="text-[11px] text-slate-500">
                    {stop.wasteAccumulationKg > 0 ? `Muatan: +${stop.wasteAccumulationKg} kg` : 'Pusat TPST'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
