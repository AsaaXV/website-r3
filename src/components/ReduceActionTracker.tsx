import React, { useState } from 'react';
import {
  Droplet,
  Utensils,
  ShoppingBag,
  FileText,
  Sparkles,
  BookOpen,
  CheckCircle2,
  TrendingDown,
  Leaf,
  MapPin,
  Calendar,
  Award,
  ChevronRight,
  ShieldCheck,
  Info,
  Clock,
  Plus,
  Trash2,
  Share2,
  ExternalLink,
  Recycle,
} from 'lucide-react';
import { UserProfile, ReduceActionKey, ReduceActionLog } from '../types';
import {
  REDUCE_ACTION_DEFINITIONS,
  getUserReduceActions,
  saveUserReduceActions,
  logUserReduceAction,
} from '../utils/storage';

interface ReduceActionTrackerProps {
  currentUser: UserProfile;
  onUpdateUser: (updated: UserProfile) => void;
  onNavigateToReuse?: () => void;
  onNavigateToRecycle?: () => void;
}

export const ReduceActionTracker: React.FC<ReduceActionTrackerProps> = ({
  currentUser,
  onUpdateUser,
  onNavigateToReuse,
  onNavigateToRecycle,
}) => {
  const [logs, setLogs] = useState<ReduceActionLog[]>(() =>
    getUserReduceActions(currentUser.id)
  );
  const [selectedActionKey, setSelectedActionKey] = useState<ReduceActionKey | null>(null);
  const [actionNote, setActionNote] = useState('');
  const [isLoggingModalOpen, setIsLoggingModalOpen] = useState(false);
  const [successToast, setSuccessToast] = useState<{
    title: string;
    points: number;
    grams: number;
  } | null>(null);
  const [activeSubTab, setActiveSubTab] = useState<'logger' | 'water_stations' | 'history'>('logger');

  // Calculate cumulative reduce stats
  const totalPreventedGrams = logs.reduce((sum, l) => sum + (l.wastePreventedGrams || 0), 0);
  const totalCo2PreventedGrams = logs.reduce((sum, l) => sum + (l.co2PreventedGrams || 0), 0);
  const totalPointsEarned = logs.reduce((sum, l) => sum + (l.pointsEarned || 0), 0);
  const totalTumblerRefills = logs.filter((l) => l.actionKey === 'tumbler').length;

  const handleStartLog = (key: ReduceActionKey) => {
    setSelectedActionKey(key);
    const def = REDUCE_ACTION_DEFINITIONS.find((d) => d.key === key);
    setActionNote(def?.tips || '');
    setIsLoggingModalOpen(true);
  };

  const handleConfirmLog = () => {
    if (!selectedActionKey) return;
    const def = REDUCE_ACTION_DEFINITIONS.find((d) => d.key === selectedActionKey);
    if (!def) return;

    const result = logUserReduceAction(currentUser.id, selectedActionKey, actionNote);
    const updatedLogs = [result.log, ...logs];
    setLogs(updatedLogs);

    // Update parent user state
    const updatedUser: UserProfile = {
      ...currentUser,
      ecoPoints: (currentUser.ecoPoints || 0) + result.pointsEarned,
      xp: (currentUser.xp || 0) + result.xpEarned,
      level: Math.floor(((currentUser.xp || 0) + result.xpEarned) / 100) + 1,
    };
    onUpdateUser(updatedUser);

    setIsLoggingModalOpen(false);
    setSelectedActionKey(null);
    setActionNote('');

    // Trigger feedback notification
    setSuccessToast({
      title: def.title,
      points: def.pointsEarned,
      grams: def.wastePreventedGrams,
    });
    setTimeout(() => {
      setSuccessToast(null);
    }, 4000);
  };

  const handleDeleteLog = (logId: string) => {
    const updated = logs.filter((l) => l.id !== logId);
    setLogs(updated);
    saveUserReduceActions(currentUser.id, updated);
  };

  const WATER_STATION_LOCATIONS = [
    {
      id: 'ws_1',
      name: 'Menara Pinisi UNM (Lobi Utama Lt. 1 & Sayap Timur Lt. 3)',
      campus: 'Kampus Gunungsari (Jl. A.P. Pettarani)',
      type: 'Water Dispenser RO Dingin & Normal',
      status: 'Aktif & Higienis',
      verifiedDate: 'Terverifikasi Tim Labkesda Sulsel 2026',
    },
    {
      id: 'ws_2',
      name: 'Perpustakaan Pusat UNM Lt. 2 (Area Baca Santai)',
      campus: 'Kampus Gunungsari',
      type: 'Dispenser Filtrasi Otomatis Sensor',
      status: 'Aktif',
      verifiedDate: 'Filter diganti tiap 30 hari',
    },
    {
      id: 'ws_3',
      name: 'Gedung Laboratorium Terpadu MIPA & Teknik Parangtambung',
      campus: 'Kampus Parangtambung (Jl. Mallengkeri)',
      type: 'Kran Siap Minum Food-Grade',
      status: 'Aktif & Ramai Mahasiswa',
      verifiedDate: 'Audit Harian Petugas Sarpras UNM',
    },
    {
      id: 'ws_4',
      name: 'Lobi Dekanat Fakultas Teknik (FT) Parangtambung',
      campus: 'Kampus Parangtambung',
      type: 'Water Station BEM FT Peduli Lingkungan',
      status: 'Aktif',
      verifiedDate: 'Didukung Program Green Campus FT',
    },
    {
      id: 'ws_5',
      name: 'Pusat Kegiatan Mahasiswa (PKM) Parangtambung',
      campus: 'Kampus Parangtambung',
      type: 'Water Dispenser Galon Higienis',
      status: 'Aktif',
      verifiedDate: 'Dikelola Bersama Mapala Sintalaras',
    },
  ];

  const getActionIcon = (key: ReduceActionKey) => {
    switch (key) {
      case 'tumbler':
        return <Droplet className="w-5 h-5 text-sky-500" />;
      case 'lunchbox':
        return <Utensils className="w-5 h-5 text-amber-500" />;
      case 'tote_bag':
        return <ShoppingBag className="w-5 h-5 text-emerald-500" />;
      case 'paperless':
        return <FileText className="w-5 h-5 text-indigo-500" />;
      case 'reusable_cutlery':
        return <Sparkles className="w-5 h-5 text-purple-500" />;
      case 'digital_notes':
        return <BookOpen className="w-5 h-5 text-teal-500" />;
      default:
        return <Leaf className="w-5 h-5 text-emerald-500" />;
    }
  };

  return (
    <div className="space-y-6 select-none max-w-6xl mx-auto">
      {/* Toast Alert for Action Logged */}
      {successToast && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce p-4 rounded-2xl bg-emerald-600 text-white shadow-2xl flex items-center gap-3 border border-emerald-400">
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center font-black">
            <CheckCircle2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="font-extrabold text-sm">{successToast.title} Tercatat!</div>
            <div className="text-xs text-emerald-100">
              +{successToast.points} Eco-Points • Mencegah ~{successToast.grams}g timbulan sampah
            </div>
          </div>
        </div>
      )}

      {/* 1. Header Hero: REDUCE Philosophy */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-emerald-950 via-teal-900 to-slate-950 text-white p-6 sm:p-8 border border-emerald-700/60 shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-teal-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-black tracking-wide">
            <TrendingDown className="w-4 h-4 text-emerald-400" />
            <span>PILAR 1 DARI 3R: REDUCE (KURANGI)</span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight">
            Cegah Sampah Sejak dari Sumbernya di Kampus UNM
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
            Satu-satunya sampah yang 100% tidak mencemari bumi adalah sampah yang <strong>tidak pernah dibuat</strong>.
            Catat kebiasaan harian membawamu membawa tumbler, wadah makan, dan tugas digital untuk mengurangi volume
            sampah yang harus diangkut ke TPA Tamangapa Antang.
          </p>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3">
            <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15">
              <div className="text-[10px] text-emerald-200 uppercase font-extrabold tracking-wider">
                Sampah Tercegah
              </div>
              <div className="text-xl sm:text-2xl font-black text-white mt-0.5">
                {(totalPreventedGrams / 1000).toFixed(2)}{' '}
                <span className="text-xs font-semibold text-emerald-300">kg</span>
              </div>
              <div className="text-[10px] text-slate-300 mt-0.5">~{totalPreventedGrams} gram residu</div>
            </div>

            <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15">
              <div className="text-[10px] text-sky-200 uppercase font-extrabold tracking-wider">
                Botol Plastik Dicegah
              </div>
              <div className="text-xl sm:text-2xl font-black text-white mt-0.5">
                {totalTumblerRefills}{' '}
                <span className="text-xs font-semibold text-sky-300">botol</span>
              </div>
              <div className="text-[10px] text-slate-300 mt-0.5">Dari isi ulang tumbler</div>
            </div>

            <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15">
              <div className="text-[10px] text-teal-200 uppercase font-extrabold tracking-wider">
                Emisi Karbon Ditekan
              </div>
              <div className="text-xl sm:text-2xl font-black text-white mt-0.5">
                {(totalCo2PreventedGrams / 1000).toFixed(2)}{' '}
                <span className="text-xs font-semibold text-teal-300">kg CO₂e</span>
              </div>
              <div className="text-[10px] text-slate-300 mt-0.5">Jejak emisi manufaktur</div>
            </div>

            <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15">
              <div className="text-[10px] text-amber-200 uppercase font-extrabold tracking-wider">
                Poin Reduce Kamu
              </div>
              <div className="text-xl sm:text-2xl font-black text-amber-300 mt-0.5">
                +{totalPointsEarned}{' '}
                <span className="text-xs font-semibold text-amber-200">pts</span>
              </div>
              <div className="text-[10px] text-slate-300 mt-0.5">Dari {logs.length} aksi nyata</div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => setActiveSubTab('logger')}
          className={`px-4 py-2 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer ${
            activeSubTab === 'logger'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'bg-slate-100 dark:bg-[#1a233a] text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
          }`}
        >
          <Leaf className="w-4 h-4" />
          <span>Catat Aksi Harian</span>
        </button>

        <button
          onClick={() => setActiveSubTab('water_stations')}
          className={`px-4 py-2 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer ${
            activeSubTab === 'water_stations'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'bg-slate-100 dark:bg-[#1a233a] text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
          }`}
        >
          <Droplet className="w-4 h-4" />
          <span>Peta Water Station UNM</span>
        </button>

        <button
          onClick={() => setActiveSubTab('history')}
          className={`px-4 py-2 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer ${
            activeSubTab === 'history'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'bg-slate-100 dark:bg-[#1a233a] text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Riwayat Aksi ({logs.length})</span>
        </button>
      </div>

      {/* 2. SUB-TAB 1: ACTION LOGGER */}
      {activeSubTab === 'logger' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-slate-100 tracking-tight">
                Pilih Aksi Pencegahan Hari Ini
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Klik kartu aksi di bawah untuk mencatat kebiasaan minim sampahmu dan peroleh Eco-Points seketika.
              </p>
            </div>
            <div className="px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-bold border border-emerald-300 dark:border-emerald-800">
              1-Klik Logger Aktif
            </div>
          </div>

          {/* Action Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {REDUCE_ACTION_DEFINITIONS.map((def) => {
              const actionCount = logs.filter((l) => l.actionKey === def.key).length;
              return (
                <div
                  key={def.key}
                  className="rounded-2xl bg-white dark:bg-[#131b2e] border border-slate-200/90 dark:border-slate-800 p-5 shadow-sm hover:shadow-md hover:border-emerald-400 dark:hover:border-emerald-600 transition-all flex flex-col justify-between space-y-4 group"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-[#1a233a] flex items-center justify-center group-hover:scale-110 transition-transform">
                        {getActionIcon(def.key)}
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-extrabold text-[11px]">
                        +{def.pointsEarned} Pts
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        {def.category}
                      </span>
                      <h3 className="font-extrabold text-slate-900 dark:text-slate-100 text-sm mt-0.5 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                        {def.title}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                        {def.description}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                      <span>Cegah ~{def.wastePreventedGrams}g sampah</span>
                      <span>Ditekan {def.co2PreventedGrams}g CO₂e</span>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={() => handleStartLog(def.key)}
                      className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm active:scale-95 cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Catat Aksi Ini Hari Ini</span>
                    </button>
                    {actionCount > 0 && (
                      <div className="text-center text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1.5">
                        Tercatat {actionCount} kali dalam riwayatmu
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Zero Waste Campus Guide Box */}
          <div className="rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-[#0d2222] dark:to-[#132238] border border-emerald-200 dark:border-emerald-800/60 p-5 space-y-3">
            <div className="flex items-center gap-2">
              <Info className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <h3 className="font-extrabold text-slate-900 dark:text-slate-100 text-sm">
                Pedoman Operasional Bebas Sampah Sekali Pakai (UNM Single-Use Ban)
              </h3>
            </div>
            <ul className="text-xs text-slate-700 dark:text-slate-300 space-y-1.5 list-disc list-inside">
              <li>
                <strong>Kantin Menara Pinisi & Parangtambung:</strong> Telah memberlakukan larangan sedotan plastik kresek dan memberikan diskon Rp 1.000 untuk pengisian air minum ke tumbler sendiri.
              </li>
              <li>
                <strong>Fakultas Teknik & MIPA:</strong> Seluruh tugas pengantar modul praktikum wajib diunggah ke SYAM-OK tanpa cetak hardcopy jilid mika.
              </li>
              <li>
                <strong>Acara Mahasiswa (Himpunan/BEM):</strong> Wajib menyediakan galon isi ulang bersama dan melarang konsumsi air mineral gelas (cup) sekali pakai.
              </li>
            </ul>
          </div>
        </div>
      )}

      {/* 3. SUB-TAB 2: WATER STATIONS UNM */}
      {activeSubTab === 'water_stations' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-slate-100 tracking-tight">
                Titik Isi Ulang Air Minum Gratis Kampus UNM
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Gunakan tumbler pribadi dan isi ulang air minum secara gratis di titik-titik resmi terverifikasi berikut:
              </p>
            </div>
            <span className="px-3 py-1 rounded-full bg-sky-100 dark:bg-sky-950 text-sky-800 dark:text-sky-300 text-xs font-bold">
              100% Gratis & Higienis
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {WATER_STATION_LOCATIONS.map((loc) => (
              <div
                key={loc.id}
                className="rounded-2xl bg-white dark:bg-[#131b2e] border border-slate-200/90 dark:border-slate-800 p-4 space-y-3 shadow-xs"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-sky-100 dark:bg-sky-950 text-sky-600 dark:text-sky-400 flex items-center justify-center font-bold shrink-0">
                      <Droplet className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-slate-900 dark:text-slate-100 text-xs sm:text-sm">
                        {loc.name}
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-emerald-500" />
                        <span>{loc.campus}</span>
                      </p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold shrink-0">
                    {loc.status}
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#1a233a] text-xs space-y-1">
                  <div className="text-slate-700 dark:text-slate-300 font-semibold">
                    Spesifikasi: {loc.type}
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">
                    {loc.verifiedDate}
                  </div>
                </div>

                <button
                  onClick={() => handleStartLog('tumbler')}
                  className="w-full py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Saya Sedang Refill di Sini (+10 Pts)</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. SUB-TAB 3: HISTORY LOGS */}
      {activeSubTab === 'history' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-slate-100 tracking-tight">
              Riwayat Log Aksi Reduce
            </h2>
            <span className="text-xs text-slate-500">Total {logs.length} catatan</span>
          </div>

          {logs.length === 0 ? (
            <div className="text-center py-12 rounded-2xl bg-white dark:bg-[#131b2e] border border-slate-200 dark:border-slate-800 p-6 space-y-3">
              <Leaf className="w-10 h-10 text-slate-400 mx-auto" />
              <h3 className="font-bold text-slate-700 dark:text-slate-300 text-sm">
                Belum Ada Catatan Aksi
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Mulai catat aksi bawamu membawa tumbler atau wadah makan hari ini untuk melihat dampak pencegahan sampahmu di sini.
              </p>
              <button
                onClick={() => setActiveSubTab('logger')}
                className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold cursor-pointer"
              >
                Pilih Aksi Pertama
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              {logs.map((log) => (
                <div
                  key={log.id}
                  className="p-3.5 rounded-2xl bg-white dark:bg-[#131b2e] border border-slate-200/90 dark:border-slate-800 flex items-center justify-between gap-3 text-xs shadow-xs"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                      {getActionIcon(log.actionKey)}
                    </div>
                    <div className="min-w-0">
                      <div className="font-bold text-slate-900 dark:text-slate-100 text-xs sm:text-sm truncate">
                        {log.title}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-2 mt-0.5">
                        <span>{log.timestamp}</span>
                        <span>•</span>
                        <span>Cegah ~{log.wastePreventedGrams}g sampah</span>
                        {log.notes && (
                          <>
                            <span>•</span>
                            <span className="italic truncate">{log.notes}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 text-xs">
                      +{log.pointsEarned} pts
                    </span>
                    <button
                      onClick={() => handleDeleteLog(log.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      title="Hapus catatan"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 5. Cross-Pillars 3R Navigation Footer */}
      <div className="pt-4 border-t border-slate-200 dark:border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div
          onClick={onNavigateToReuse}
          className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 hover:border-amber-500/50 transition-all cursor-pointer flex items-center justify-between group"
        >
          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase tracking-wider text-amber-800 dark:text-amber-400">
              Pilar 2: REUSE (Gunakan Kembali)
            </span>
            <div className="font-extrabold text-slate-900 dark:text-slate-100 text-xs sm:text-sm group-hover:text-amber-600 transition-colors">
              Bursa Preloved & Papan Dicari Mahasiswa
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Hibahkan buku ajar dan barter barang kos sebelum dibuang.
            </p>
          </div>
          <ChevronRight className="w-5 h-5 text-amber-600 group-hover:translate-x-1 transition-transform" />
        </div>

        <div
          onClick={onNavigateToRecycle}
          className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 hover:border-blue-500/50 transition-all cursor-pointer flex items-center justify-between group"
        >
          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase tracking-wider text-blue-800 dark:text-blue-400">
              Pilar 3: RECYCLE (Daur Ulang)
            </span>
            <div className="font-extrabold text-slate-900 dark:text-slate-100 text-xs sm:text-sm group-hover:text-blue-600 transition-colors">
              AI Vision Scanner & Bank Sampah UNM
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Kenali jenis material sampah dan setorkan ke TPS kampus.
            </p>
          </div>
          <ChevronRight className="w-5 h-5 text-blue-600 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>

      {/* 6. LOGGING MODAL */}
      {isLoggingModalOpen && selectedActionKey && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-3xl bg-white dark:bg-[#131b2e] border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-2xl">
            {(() => {
              const def = REDUCE_ACTION_DEFINITIONS.find((d) => d.key === selectedActionKey);
              if (!def) return null;
              return (
                <>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center">
                      {getActionIcon(def.key)}
                    </div>
                    <div>
                      <h3 className="font-black text-slate-900 dark:text-slate-100 text-base">
                        Catat: {def.title}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {def.category}
                      </p>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs space-y-1.5">
                    <div className="font-bold text-emerald-900 dark:text-emerald-200">
                      Imbalan & Dampak Nyata:
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-slate-700 dark:text-slate-300">
                      <div>⭐ +{def.pointsEarned} Eco-Points</div>
                      <div>⚡ +{def.xpEarned} XP Level</div>
                      <div>🗑️ Cegah ~{def.wastePreventedGrams}g sampah</div>
                      <div>🌿 Kurangi ~{def.co2PreventedGrams}g CO₂e</div>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Catatan Tambahan / Lokasi Refill (Opsional):
                    </label>
                    <input
                      type="text"
                      value={actionNote}
                      onChange={(e) => setActionNote(e.target.value)}
                      placeholder="Contoh: Refill di Menara Pinisi Lt. 1"
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-[#1a233a] border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2">
                    <button
                      onClick={() => setIsLoggingModalOpen(false)}
                      className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                    >
                      Batal
                    </button>
                    <button
                      onClick={handleConfirmLog}
                      className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs shadow-md shadow-emerald-600/30 flex items-center gap-1.5 cursor-pointer"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Konfirmasi & Klaim Poin</span>
                    </button>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
};
