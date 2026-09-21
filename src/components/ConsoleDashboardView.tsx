import React, { useState } from 'react';
import {
  Sparkles,
  ShoppingBag,
  Camera,
  Flame,
  ArrowRight,
  Gift,
  HeartHandshake,
  Search,
  MapPin,
  Clock,
  CheckCircle2,
  Recycle,
  Scale,
  PlusCircle,
  HelpCircle,
  ShieldCheck,
  ChevronRight,
  ExternalLink,
  TrendingDown,
  Droplet,
  Utensils,
  Leaf,
  Layers,
  Award,
  Zap,
} from 'lucide-react';
import { UserProfile, LedgerTransaction, ReuseItem, ItemRequest } from '../types';
import {
  getStoredReuseItems,
  getStoredItemRequests,
  getR3MetricsSummary,
  getUserReduceActions,
  logUserReduceAction,
} from '../utils/storage';

interface ConsoleDashboardViewProps {
  currentUser: UserProfile;
  transactions: LedgerTransaction[];
  onNavigate: (tab: string) => void;
  onOpenChatWithSeller: (sellerName: string, item?: ReuseItem) => void;
  onOpenSusModal?: () => void;
  onUpdateUser?: (updated: UserProfile) => void;
}

export const ConsoleDashboardView: React.FC<ConsoleDashboardViewProps> = ({
  currentUser,
  transactions,
  onNavigate,
  onOpenChatWithSeller,
  onUpdateUser,
}) => {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'buku' | 'kos' | 'gratis' | 'dicari'>('all');
  const [quickLogSuccess, setQuickLogSuccess] = useState<string | null>(null);

  // Dynamic storage data
  const reuseItems = getStoredReuseItems();
  const requests = getStoredItemRequests().slice(0, 2);
  const r3Metrics = getR3MetricsSummary(currentUser.id);
  const userReduceLogs = getUserReduceActions(currentUser.id);

  const filteredItems = reuseItems.slice(0, 4).filter((item) => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'buku') return item.category.toLowerCase().includes('buku');
    if (selectedFilter === 'kos') return item.category.toLowerCase().includes('kos') || item.category.toLowerCase().includes('alat');
    if (selectedFilter === 'gratis') return item.isFree;
    return true;
  });

  const handleQuickReduceAction = (key: 'tumbler' | 'lunchbox') => {
    const result = logUserReduceAction(
      currentUser.id,
      key,
      key === 'tumbler' ? 'Refill air minum di kampus UNM' : 'Membawa kotak makan sendiri di kantin'
    );
    if (onUpdateUser) {
      onUpdateUser({
        ...currentUser,
        ecoPoints: (currentUser.ecoPoints || 0) + result.pointsEarned,
        xp: (currentUser.xp || 0) + result.xpEarned,
      });
    }
    setQuickLogSuccess(
      `Aksi ${result.log.title} berhasil dicatat! (+${result.pointsEarned} pts, hemat ~${result.log.wastePreventedGrams}g sampah)`
    );
    setTimeout(() => setQuickLogSuccess(null), 3500);
  };

  return (
    <div className="space-y-6 select-none">
      {/* Quick Action Toast */}
      {quickLogSuccess && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce p-3.5 rounded-2xl bg-emerald-600 text-white shadow-xl flex items-center gap-2.5 border border-emerald-400 text-xs font-bold">
          <CheckCircle2 className="w-5 h-5 text-white" />
          <span>{quickLogSuccess}</span>
        </div>
      )}

      {/* 1. Hero Spotlight Banner: 3R Hub Identity */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 text-white border border-slate-700/60 shadow-xl p-6 sm:p-8">
        {/* Background decorative elements */}
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-80 h-80 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-12 w-64 h-64 bg-teal-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-black tracking-wide">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>SISTEM SIRKULARITAS 3R UNIVERSITAS NEGERI MAKASSAR</span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white leading-tight">
              Kurangi dari Sumber, Gunakan Kembali, Daur Ulang Bersama
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl">
              Terapkan hierarki <strong>3R (Reduce, Reuse, Recycle)</strong> secara utuh di kampus UNM.
              Cegah timbulan plastik sekali pakai, sirkulasikan buku & peralatan kos bekas, serta pilah material daur ulang sebelum menumpuk di TPA Tamangapa.
            </p>

            <div className="flex flex-wrap items-center gap-2.5 pt-2">
              <button
                onClick={() => onNavigate('reduce')}
                className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs sm:text-sm flex items-center gap-2 transition-all shadow-md shadow-emerald-500/20 hover:scale-[1.02] cursor-pointer"
              >
                <TrendingDown className="w-4 h-4" />
                <span>1. REDUCE: Aksi Bebas Sampah</span>
              </button>

              <button
                onClick={() => onNavigate('komunitas')}
                className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs sm:text-sm flex items-center gap-2 transition-all shadow-md shadow-amber-500/20 hover:scale-[1.02] cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>2. REUSE: Bursa Preloved</span>
              </button>

              <button
                onClick={() => onNavigate('scanner')}
                className="px-4 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-black text-xs sm:text-sm flex items-center gap-2 transition-all shadow-md shadow-sky-500/20 hover:scale-[1.02] cursor-pointer"
              >
                <Camera className="w-4 h-4" />
                <span>3. RECYCLE: Scan AI</span>
              </button>
            </div>
          </div>

          {/* Right Highlight Box in Hero */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div className="w-full max-w-sm rounded-2xl bg-slate-950/60 backdrop-blur-md border border-slate-700/80 p-4 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 font-bold">Ringkasan Aksi Anda</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-black text-[10px]">
                  {currentUser.ecoPoints} Eco-Points
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center py-1">
                <div className="p-2 rounded-xl bg-white/5 border border-white/10">
                  <div className="text-[10px] text-emerald-300 font-bold uppercase">Reduce</div>
                  <div className="font-black text-sm text-white mt-0.5">
                    {userReduceLogs.length}
                  </div>
                  <div className="text-[9px] text-slate-400">aksi dicatat</div>
                </div>

                <div className="p-2 rounded-xl bg-white/5 border border-white/10">
                  <div className="text-[10px] text-amber-300 font-bold uppercase">Reuse</div>
                  <div className="font-black text-sm text-white mt-0.5">
                    {reuseItems.filter((i) => i.donorName === currentUser.name).length}
                  </div>
                  <div className="text-[9px] text-slate-400">barang bursa</div>
                </div>

                <div className="p-2 rounded-xl bg-white/5 border border-white/10">
                  <div className="text-[10px] text-sky-300 font-bold uppercase">Recycle</div>
                  <div className="font-black text-sm text-white mt-0.5">
                    {currentUser.totalWeightDepositedKg || 0}
                  </div>
                  <div className="text-[9px] text-slate-400">kg disetor</div>
                </div>
              </div>

              <div className="pt-1 flex items-center justify-between gap-2">
                <button
                  onClick={() => handleQuickReduceAction('tumbler')}
                  className="flex-1 py-1.5 rounded-xl bg-emerald-600/80 hover:bg-emerald-600 text-white font-bold text-[11px] flex items-center justify-center gap-1 transition-colors cursor-pointer"
                >
                  <Droplet className="w-3.5 h-3.5" />
                  <span>+ Refill Tumbler</span>
                </button>
                <button
                  onClick={() => onNavigate('reduce')}
                  className="py-1.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-[11px] transition-colors cursor-pointer"
                >
                  Pusat 3R
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. THE 3R INTERACTIVE COMMAND CARDS (Core Focus) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2">
              <Layers className="w-5 h-5 text-emerald-500" />
              <span>Pilar Aksi 3R Kampus Hijau UNM</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Pilih pilar yang ingin Anda lakukan hari ini:
            </p>
          </div>
          <button
            onClick={() => onNavigate('edukasi')}
            className="text-xs text-emerald-600 dark:text-emerald-400 font-bold hover:underline flex items-center gap-1"
          >
            <span>Panduan Teori 3R</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* PILAR 1: REDUCE */}
          <div className="rounded-2xl bg-gradient-to-br from-emerald-50/80 to-teal-50/50 dark:from-[#0c2421] dark:to-[#122b2b] border border-emerald-200 dark:border-emerald-800/80 p-5 flex flex-col justify-between space-y-4 hover:shadow-lg transition-all group">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-full bg-emerald-600 text-white font-black text-[10px] tracking-wider uppercase">
                  Pilar 1: REDUCE
                </span>
                <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-300">
                  Kurangi dari Sumber
                </span>
              </div>

              <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
                <TrendingDown className="w-6 h-6" />
              </div>

              <div>
                <h3 className="font-extrabold text-slate-900 dark:text-slate-100 text-sm sm:text-base">
                  Cegah Timbulan Sampah
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                  Bawa tumbler pribadi, gunakan mistik bekal di kantin, tolak kresek fotokopi, dan kumpulkan tugas digital di SYAM-OK.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-white/80 dark:bg-slate-900/60 border border-emerald-100 dark:border-emerald-900 text-xs space-y-1">
                <div className="flex justify-between text-slate-500 dark:text-slate-400">
                  <span>Total Sampah Tercegah:</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">
                    {(r3Metrics.totalWastePreventedGrams / 1000).toFixed(1)} kg
                  </span>
                </div>
                <div className="flex justify-between text-slate-500 dark:text-slate-400">
                  <span>Botol Plastik Dihindari:</span>
                  <span className="font-bold text-sky-600 dark:text-sky-400">
                    {r3Metrics.estimatedSingleUseBottlesSaved} unit
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => onNavigate('reduce')}
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm cursor-pointer"
            >
              <span>Buka Pusat Aksi REDUCE</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* PILAR 2: REUSE */}
          <div className="rounded-2xl bg-gradient-to-br from-amber-50/80 to-orange-50/50 dark:from-[#241c10] dark:to-[#2e2316] border border-amber-200 dark:border-amber-800/80 p-5 flex flex-col justify-between space-y-4 hover:shadow-lg transition-all group">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-full bg-amber-600 text-white font-black text-[10px] tracking-wider uppercase">
                  Pilar 2: REUSE
                </span>
                <span className="text-[11px] font-bold text-amber-700 dark:text-amber-300">
                  Gunakan Kembali
                </span>
              </div>

              <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
                <ShoppingBag className="w-6 h-6" />
              </div>

              <div>
                <h3 className="font-extrabold text-slate-900 dark:text-slate-100 text-sm sm:text-base">
                  Bursa Preloved & Papan Dicari
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                  Hibahkan buku ajar, barter perabot kos pindahan, dan penuhi kebutuhan kuliah dari sesama mahasiswa sebelum membeli baru.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-white/80 dark:bg-slate-900/60 border border-amber-100 dark:border-amber-900 text-xs space-y-1">
                <div className="flex justify-between text-slate-500 dark:text-slate-400">
                  <span>Barang Disirkulasikan:</span>
                  <span className="font-bold text-amber-600 dark:text-amber-400">
                    {r3Metrics.totalItemsReusedCount} item
                  </span>
                </div>
                <div className="flex justify-between text-slate-500 dark:text-slate-400">
                  <span>Nilai Manfaat Hemat:</span>
                  <span className="font-bold text-slate-700 dark:text-slate-300">
                    Rp {(r3Metrics.totalReuseTransactionsRupiah / 1000000).toFixed(1)} Jt
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => onNavigate('komunitas')}
              className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm cursor-pointer"
            >
              <span>Jelajahi Bursa REUSE</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* PILAR 3: RECYCLE */}
          <div className="rounded-2xl bg-gradient-to-br from-sky-50/80 to-blue-50/50 dark:from-[#0d1e2e] dark:to-[#122338] border border-sky-200 dark:border-sky-800/80 p-5 flex flex-col justify-between space-y-4 hover:shadow-lg transition-all group">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-full bg-sky-600 text-white font-black text-[10px] tracking-wider uppercase">
                  Pilar 3: RECYCLE
                </span>
                <span className="text-[11px] font-bold text-sky-700 dark:text-sky-300">
                  Daur Ulang Presisi
                </span>
              </div>

              <div className="w-12 h-12 rounded-2xl bg-sky-100 dark:bg-sky-950 text-sky-600 dark:text-sky-400 flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
                <Camera className="w-6 h-6" />
              </div>

              <div>
                <h3 className="font-extrabold text-slate-900 dark:text-slate-100 text-sm sm:text-base">
                  AI Vision & Bank Sampah UNM
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                  Pindai material sampah dengan kamera AI untuk klasifikasi jenis plastik PET/kertas/kaleng dan setorkan ke TPS kampus.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-white/80 dark:bg-slate-900/60 border border-sky-100 dark:border-sky-900 text-xs space-y-1">
                <div className="flex justify-between text-slate-500 dark:text-slate-400">
                  <span>Total Sampah Didaur Ulang:</span>
                  <span className="font-bold text-sky-600 dark:text-sky-400">
                    {r3Metrics.totalWasteRecycledKg} kg
                  </span>
                </div>
                <div className="flex justify-between text-slate-500 dark:text-slate-400">
                  <span>Emisi Ditekan:</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">
                    {r3Metrics.totalCo2SavedKg} kg CO₂e
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => onNavigate('scanner')}
              className="w-full py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm cursor-pointer"
            >
              <span>Mulai RECYCLE: Scan AI</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 3. Trending Bursa Reuse & Papan Dicari */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-amber-500 animate-pulse" />
            <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-slate-100 tracking-tight">
              Aktivitas Sirkular di Kampus
            </h2>
            <span className="text-xs text-slate-400 dark:text-slate-500 hidden sm:inline">
              (Barang Preloved & Kebutuhan Antarmahasiswa)
            </span>
          </div>

          {/* Category Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            <button
              onClick={() => setSelectedFilter('all')}
              className={`px-3 py-1 rounded-full font-bold transition-all cursor-pointer whitespace-nowrap ${
                selectedFilter === 'all'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-[#1a233a] text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              Semua
            </button>
            <button
              onClick={() => setSelectedFilter('buku')}
              className={`px-3 py-1 rounded-full font-bold transition-all cursor-pointer whitespace-nowrap ${
                selectedFilter === 'buku'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-[#1a233a] text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              Buku Diktat
            </button>
            <button
              onClick={() => setSelectedFilter('gratis')}
              className={`px-3 py-1 rounded-full font-bold transition-all cursor-pointer whitespace-nowrap ${
                selectedFilter === 'gratis'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-[#1a233a] text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              🎁 Hibah Gratis
            </button>
            <button
              onClick={() => setSelectedFilter('dicari')}
              className={`px-3 py-1 rounded-full font-bold transition-all cursor-pointer whitespace-nowrap ${
                selectedFilter === 'dicari'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-[#1a233a] text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              🔍 Papan Dicari
            </button>
          </div>
        </div>

        {/* Carousel / Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {selectedFilter === 'dicari' ? (
            requests.map((req) => (
              <div
                key={req.id}
                className="rounded-2xl bg-white dark:bg-[#131b2e] border border-amber-200 dark:border-amber-900/60 shadow-xs p-4 flex flex-col justify-between space-y-3 hover:shadow-md transition-shadow"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 font-bold text-[10px]">
                      DICARI • {req.urgency}
                    </span>
                    <span className="text-[10px] text-slate-400">{req.postedAt || req.createdAt}</span>
                  </div>
                  <h3 className="font-bold text-slate-900 dark:text-slate-100 text-xs sm:text-sm line-clamp-2">
                    {req.title}
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2">
                    {req.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-emerald-500 shrink-0" />
                    <span className="truncate">{req.preferredCodSpot || req.preferredMeetupPoint || 'Kampus UNM'}</span>
                  </div>
                  <button
                    onClick={() => onOpenChatWithSeller(req.userName || req.requesterName || 'Pemohon')}
                    className="w-full py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs flex items-center justify-center gap-1 transition-colors cursor-pointer"
                  >
                    <span>Saya Punya Barang Ini</span>
                  </button>
                </div>
              </div>
            ))
          ) : (
            filteredItems.map((item) => (
              <div
                key={item.id}
                className="group rounded-2xl bg-white dark:bg-[#131b2e] border border-slate-200/90 dark:border-slate-800 shadow-xs overflow-hidden flex flex-col justify-between hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
              >
                <div>
                  <div className="relative h-36 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2 left-2 flex flex-col gap-1">
                      {item.isFree ? (
                        <span className="px-2 py-0.5 rounded-md bg-emerald-600 text-white font-black text-[10px] shadow-xs">
                          GRATIS / HIBAH
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-md bg-slate-900/80 backdrop-blur-xs text-white font-bold text-[10px]">
                          Rp {item.priceRupiah?.toLocaleString()}
                        </span>
                      )}
                    </div>

                    <div className="absolute bottom-2 right-2">
                      <span className="px-1.5 py-0.5 rounded bg-slate-900/80 backdrop-blur-xs text-slate-200 text-[9px] font-medium">
                        {item.category}
                      </span>
                    </div>
                  </div>

                  <div className="p-3.5 space-y-1.5">
                    <h3 className="font-bold text-slate-900 dark:text-slate-100 text-xs line-clamp-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-2">
                      {item.description}
                    </p>

                    <div className="flex items-center gap-1 text-[10px] text-slate-500 dark:text-slate-400 pt-1">
                      <MapPin className="w-3 h-3 text-emerald-500 shrink-0" />
                      <span className="truncate">{item.meetupPoint || item.location}</span>
                    </div>
                  </div>
                </div>

                <div className="p-3.5 pt-0">
                  <button
                    onClick={() => onOpenChatWithSeller(item.donorName, item)}
                    className="w-full py-1.5 rounded-xl bg-slate-100 dark:bg-[#1a233a] hover:bg-emerald-600 hover:text-white dark:hover:bg-emerald-600 text-slate-800 dark:text-slate-200 font-bold text-[11px] flex items-center justify-center gap-1 transition-all cursor-pointer"
                  >
                    <span>Hubungi Pemilik</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* 4. Lower Grid: AI Scanner & Bank Sampah Ledger */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 rounded-2xl bg-white dark:bg-[#131b2e] border border-slate-200/90 dark:border-slate-800 shadow-xs p-5 flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                  <Camera className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-slate-100 text-xs sm:text-sm">
                    AI Scanner Material & Ide DIY
                  </h3>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">
                    Didukung Gemini AI Vision Engine
                  </p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 font-bold text-[10px]">
                Live
              </span>
            </div>

            <div
              onClick={() => onNavigate('scanner')}
              className="p-3.5 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-[#13282b] dark:to-[#17223b] border border-emerald-200 dark:border-emerald-800/60 cursor-pointer space-y-2 hover:border-emerald-400 transition-colors"
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-emerald-900 dark:text-emerald-200 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Ide Upcycle Minggu Ini:</span>
                </span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                  Botol PET
                </span>
              </div>
              <p className="text-[11px] text-slate-700 dark:text-slate-300 leading-relaxed">
                "Ubah botol plastik 1.5L menjadi pot self-watering sistem sumbu kain flanel untuk tanaman hias kamar kos tanpa perlu disiram tiap hari."
              </p>
            </div>
          </div>

          <button
            onClick={() => onNavigate('scanner')}
            className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs"
          >
            <Camera className="w-4 h-4" />
            <span>Mulai Pindai Sampah Sekarang</span>
          </button>
        </div>

        {/* Right Modular Card: Recent Sorting & Verifications */}
        <div className="lg:col-span-7 rounded-2xl bg-white dark:bg-[#131b2e] border border-slate-200/90 dark:border-slate-800 shadow-xs p-5 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
                  <Recycle className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-slate-100 text-xs sm:text-sm">
                    Riwayat Pilah & Setoran Terkini
                  </h3>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">
                    Buku Kas Transparansi Komunitas
                  </p>
                </div>
              </div>

              <button
                onClick={() => onNavigate('ledger')}
                className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-0.5 cursor-pointer"
              >
                <span>Buku Kas</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-2">
              {transactions.slice(0, 3).map((tx) => (
                <div
                  key={tx.id}
                  className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#1a233a] border border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold shrink-0">
                      <Scale className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0">
                      <div className="font-bold text-slate-800 dark:text-slate-100 text-xs truncate">
                        {tx.userName} • {tx.items?.[0]?.categoryName || 'Sampah Terpilah'}
                      </div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400">
                        {tx.totalWeightKg} kg • {tx.dropPointName}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 text-xs">
                      +{tx.totalPoints} pts
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold ${
                        tx.status === 'verified'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300'
                      }`}
                    >
                      {tx.status === 'verified' ? 'Terverifikasi' : 'Menunggu'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs">
            <span className="text-slate-500 dark:text-slate-400 text-[11px]">
              Total pilah akun: <strong>{currentUser.totalWeightDepositedKg} kg</strong>
            </span>
            <button
              onClick={() => onNavigate('dashboard')}
              className="text-[11px] font-bold text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 flex items-center gap-1 cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Buka Dasbor Analisis</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
