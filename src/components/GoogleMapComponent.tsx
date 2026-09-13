import React, { useEffect, useState } from 'react';
import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
  InfoWindow,
  useMap,
} from '@vis.gl/react-google-maps';
import { GISFacility, VRPStop } from '../types';
import { WASTE_CATEGORIES } from '../data/mockData';
import { MapPin, Navigation, ExternalLink, Clock, Sparkles, Key, AlertTriangle } from 'lucide-react';

interface GoogleMapComponentProps {
  apiKey: string;
  facilities: GISFacility[];
  selectedFacility: GISFacility;
  onSelectFacility: (fac: GISFacility) => void;
  userLocation: { lat: number; lng: number } | null;
  activeTab: 'facilities' | 'vrp';
  vrpStops: VRPStop[];
  simulatedStep: number;
}

// Controller to smoothly pan the map when facility or user location changes
function MapCameraController({
  selectedFacility,
  userLocation,
}: {
  selectedFacility: GISFacility | null;
  userLocation: { lat: number; lng: number } | null;
}) {
  const map = useMap();

  useEffect(() => {
    if (!map) return;
    if (userLocation) {
      map.panTo(userLocation);
      map.setZoom(15);
    } else if (selectedFacility) {
      map.panTo({ lat: selectedFacility.latitude, lng: selectedFacility.longitude });
    }
  }, [map, selectedFacility, userLocation]);

  return null;
}

// VRP Polyline Drawer on native Google Map
function VrpRoutePolyline({
  vrpStops,
  simulatedStep,
}: {
  vrpStops: VRPStop[];
  simulatedStep: number;
}) {
  const map = useMap();

  useEffect(() => {
    const g = (window as any).google;
    if (!map || typeof g === 'undefined' || !g.maps) return;

    const path = vrpStops.slice(0, simulatedStep + 1).map((s) => ({
      lat: s.lat,
      lng: s.lng,
    }));

    const polyline = new g.maps.Polyline({
      path,
      geodesic: true,
      strokeColor: '#059669', // Emerald 600
      strokeOpacity: 0.9,
      strokeWeight: 4,
      map,
    });

    return () => {
      polyline.setMap(null);
    };
  }, [map, vrpStops, simulatedStep]);

  return null;
}

export const GoogleMapComponent: React.FC<GoogleMapComponentProps> = ({
  apiKey,
  facilities,
  selectedFacility,
  onSelectFacility,
  userLocation,
  activeTab,
  vrpStops,
  simulatedStep,
}) => {
  const [activeInfoWindow, setActiveInfoWindow] = useState<GISFacility | null>(selectedFacility);
  const [mapAuthError, setMapAuthError] = useState<boolean>(false);

  useEffect(() => {
    (window as any).gm_authFailure = () => {
      console.warn('Google Maps authentication failed (gm_authFailure)');
      setMapAuthError(true);
    };
  }, []);

  useEffect(() => {
    setActiveInfoWindow(selectedFacility);
  }, [selectedFacility]);

  const isValidKey = Boolean(apiKey && apiKey.trim().length > 5);

  if (!isValidKey) {
    return (
      <div className="w-full h-full min-h-[460px] sm:min-h-[520px] flex flex-col items-center justify-center p-6 bg-slate-900 text-white text-center rounded-2xl border border-slate-800 space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
          <Key className="w-6 h-6" />
        </div>
        <div className="max-w-md space-y-2">
          <h3 className="font-bold text-sm sm:text-base text-slate-100">
            Google Maps Platform API Key Diperlukan
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Untuk merender peta satelit Google Maps secara langsung, masukkan Google Cloud API Key atau gunakan <strong>Maps Demo Key</strong> gratis tanpa kartu kredit.
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
          <a
            href="https://mapsplatform.google.com/maps-demo-key?utm_campaign=gmp_mcp_codeassist_v1_aistudio"
            target="_blank"
            rel="noreferrer"
            className="px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>Ambil Maps Demo Key</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    );
  }

  if (mapAuthError) {
    return (
      <div className="w-full h-full min-h-[460px] sm:min-h-[520px] flex flex-col items-center justify-center p-6 bg-slate-900 text-white text-center rounded-2xl border border-rose-800/40 space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <div className="max-w-md space-y-1.5">
          <h3 className="font-bold text-sm sm:text-base text-rose-200">
            Google Maps API Key Memerlukan Verifikasi
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Kunci API yang dimasukkan belum mengaktifkan <em>Maps JavaScript API</em> atau terdapat pembatasan domain di Google Cloud Console. Silakan periksa kunci Anda atau gunakan mode Peta Topologi Kampus.
          </p>
        </div>
        <div className="flex items-center gap-2 pt-2">
          <button
            onClick={() => setMapAuthError(false)}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors cursor-pointer"
          >
            Coba Muat Ulang
          </button>
        </div>
      </div>
    );
  }

  // Default coordinate: Kampus Universitas Hasanuddin Tamalanrea, Makassar
  const defaultCenter = { lat: -5.1328, lng: 119.4932 };

  return (
    <div className="w-full h-full min-h-[460px] sm:min-h-[520px] relative rounded-2xl overflow-hidden shadow-inner">
      <APIProvider apiKey={apiKey} libraries={['marker']}>
        <Map
          mapId="DEMO_MAP_ID"
          internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
          defaultCenter={defaultCenter}
          defaultZoom={14}
          gestureHandling="greedy"
          disableDefaultUI={false}
          className="w-full h-full"
          style={{ width: '100%', height: '100%', minHeight: '460px' }}
        >
          <MapCameraController
            selectedFacility={selectedFacility}
            userLocation={userLocation}
          />

          {/* User GPS location marker */}
          {userLocation && (
            <AdvancedMarker
              position={userLocation}
              title="Lokasi Anda Saat Ini"
            >
              <div className="relative flex items-center justify-center">
                <div className="w-5 h-5 rounded-full bg-blue-600 border-2 border-white shadow-lg animate-ping absolute" />
                <div className="w-4 h-4 rounded-full bg-blue-600 border-2 border-white shadow-md z-10" />
              </div>
            </AdvancedMarker>
          )}

          {/* Render Facility Markers when in 'facilities' tab */}
          {activeTab === 'facilities' &&
            facilities.map((fac) => {
              const isSelected = selectedFacility?.id === fac.id;
              const isLandfill = fac.isFinalLandfill || fac.type === 'TPA Sampah Akhir';
              const isTPS3R = fac.type === 'TPS3R';
              const isDropBox = fac.type === 'Drop Box Kampus';

              const pinBackground = isLandfill
                ? '#DC2626' // Crimson red for TPA Akhir
                : fac.type === 'TPST Pengolahan Akhir'
                ? '#7C3AED' // Purple for TPST RDF
                : isTPS3R
                ? '#059669' // Emerald
                : isDropBox
                ? '#2563EB' // Blue
                : '#D97706'; // Amber

              const pinGlyphColor = '#FFFFFF';
              const pinBorderColor = isLandfill
                ? (isSelected ? '#FDE047' : '#FFFFFF')
                : (isSelected ? '#10B981' : '#FFFFFF');

              return (
                <AdvancedMarker
                  key={fac.id}
                  position={{ lat: fac.latitude, lng: fac.longitude }}
                  title={`${fac.name} ${isLandfill ? '(TEMPAT LIMBAH SAMPAH AKHIR)' : ''}`}
                  onClick={() => {
                    onSelectFacility(fac);
                    setActiveInfoWindow(fac);
                  }}
                >
                  <Pin
                    background={pinBackground}
                    borderColor={pinBorderColor}
                    glyphColor={pinGlyphColor}
                    scale={isSelected ? (isLandfill ? 1.4 : 1.3) : (isLandfill ? 1.15 : 1.0)}
                  />
                </AdvancedMarker>
              );
            })}

          {/* Render InfoWindow on selected facility */}
          {activeTab === 'facilities' && activeInfoWindow && (
            <InfoWindow
              position={{
                lat: activeInfoWindow.latitude,
                lng: activeInfoWindow.longitude,
              }}
              onCloseClick={() => setActiveInfoWindow(null)}
              headerContent={
                <div className="font-bold text-xs text-slate-900 pr-2">
                  {activeInfoWindow.name}
                </div>
              }
            >
              <div className="p-1 space-y-2 max-w-[240px] text-xs text-slate-700">
                <div className="flex items-center gap-1.5 text-[11px]">
                  <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                    {activeInfoWindow.type}
                  </span>
                  <span className="font-mono text-slate-500">
                    Jarak: {activeInfoWindow.distanceKm} km
                  </span>
                </div>

                <p className="text-[11px] text-slate-600 leading-snug">
                  {activeInfoWindow.address}
                </p>

                <div className="text-[11px] flex items-center gap-1 text-slate-500">
                  <Clock className="w-3 h-3 text-slate-400" />
                  <span>{activeInfoWindow.operatingHours}</span>
                </div>

                {/* Accepted Waste Tags */}
                <div className="flex flex-wrap gap-1 pt-1">
                  {activeInfoWindow.acceptsCategories.map((cId) => {
                    const cat = WASTE_CATEGORIES.find((c) => c.id === cId);
                    return (
                      <span
                        key={cId}
                        className="px-1.5 py-0.2 rounded text-[9px] font-bold"
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

                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${activeInfoWindow.latitude},${activeInfoWindow.longitude}`}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2 block w-full py-1.5 text-center rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] transition-colors shadow-xs"
                >
                  Buka Rute di Google Maps
                </a>
              </div>
            </InfoWindow>
          )}

          {/* Render VRP Stops and Waypoints when in 'vrp' tab */}
          {activeTab === 'vrp' && (
            <>
              <VrpRoutePolyline vrpStops={vrpStops} simulatedStep={simulatedStep} />
              {vrpStops.map((stop, idx) => {
                const isCompleted = idx <= simulatedStep;
                const isCurrent = idx === simulatedStep;

                const pinBg = isCurrent
                  ? '#F59E0B'
                  : isCompleted
                  ? '#059669'
                  : '#475569';

                return (
                  <AdvancedMarker
                    key={stop.id}
                    position={{ lat: stop.lat, lng: stop.lng }}
                    title={`${stop.sequence}. ${stop.name}`}
                  >
                    <Pin
                      background={pinBg}
                      borderColor="#FFFFFF"
                      glyphColor="#FFFFFF"
                      scale={isCurrent ? 1.3 : 1.0}
                    >
                      <span className="font-bold text-[10px] text-white">
                        {stop.sequence}
                      </span>
                    </Pin>
                  </AdvancedMarker>
                );
              })}
            </>
          )}
        </Map>
      </APIProvider>
    </div>
  );
};
