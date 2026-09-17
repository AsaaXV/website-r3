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
} from 'lucide-react';
import { UserProfile, LedgerTransaction, ReuseItem, ItemRequest } from '../types';
import { REUSE_ITEMS } from '../data/mockData';
import { INITIAL_ITEM_REQUESTS } from '../utils/storage';

interface ConsoleDashboardViewProps {
  currentUser: UserProfile;
  transactions: LedgerTransaction[];
  onNavigate: (tab: string) => void;
  onOpenChatWithSeller: (sellerName: string, item?: ReuseItem) => void;
  onOpenSusModal?: () => void;
}

export const ConsoleDashboardView: React.FC<ConsoleDashboardViewProps> = ({
  currentUser,
  transactions,
  onNavigate,
  onOpenChatWithSeller,
}) => {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'buku' | 'kos' | 'gratis' | 'dicari'>('all');

  // Filter trending items
  const trendingItems = REUSE_ITEMS.slice(0, 4);
  const requests = INITIAL_ITEM_REQUESTS.slice(0, 2);

  const filteredItems = trendingItems.filter((item) => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'buku') return item.category.toLowerCase().includes('buku');
    if (selectedFilter === 'kos') return item.category.toLowerCase().includes('kos') || item.category.toLowerCase().includes('alat');
    if (selectedFilter === 'gratis') return item.isFree;
    return true;
  });

  return (
    <div className="space-y-6 select-none">
      {/* 1. Hero Spotlight Banner (Inspired by the Hero Banner in the Reference Design) */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 text-white border border-slate-700/60 shadow-xl p-6 sm:p-8">
        {/* Background decorative elements */}
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-80 h-80 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-12 w-64 h-64 bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-bold tracking-wide">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Gerakan Sirkular Kampus UNM 2026</span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white leading-tight">
              Beri Hidup Kedua untuk Barangmu, Cegah Residu ke TPA Tamangapa
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl">
              Tukar kardus bekas pindahan kos, hibahkan buku ajar, dan deteksi material berharga dengan kamera AI sebelum menumpuk di gunungan sampah Antang setinggi 38 meter.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => onNavigate('komunitas')}
                className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs sm:text-sm flex items-center gap-2 transition-all shadow-lg shadow-emerald-500/20 hover:scale-[1.02] cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Buka Bursa Preloved</span>
              </button>

              <button
                onClick={() => onNavigate('scanner')}
                className="px-5 py-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-white font-bold text-xs sm:text-sm border border-slate-600 flex items-center gap-2 transition-all hover:scale-[1.02] cursor-pointer"
              >
                <Camera className="w-4 h-4 text-emerald-400" />
                <span>Scan Material AI</span>
              </button>

              <button
                onClick={() => onNavigate('edukasi')}
                className="px-3.5 py-2.5 rounded-xl bg-slate-800/50 hover:bg-slate-800 text-slate-300 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>Edukasi 3R</span>
              </button>
            </div>
          </div>

          {/* Right Highlight Box in Hero (Simulating character/item visual in reference) */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div className="w-full max-w-sm rounded-2xl bg-slate-950/60 backdrop-blur-md border border-slate-700/80 p-4 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Rekomendasi Hari Ini</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-[10px]">
                  Gratis / Rp 0
                </span>
              </div>

              <div className="flex gap-3 items-center">
                <img
                  src="https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=300&q=80"
                  alt="Buku Kalkulus"
                  className="w-16 h-16 rounded-xl object-cover ring-1 ring-slate-600"
                />
                <div className="min-w-0 flex-1">
                  <div className="font-bold text-slate-100 text-xs truncate">
                    Buku Kalkulus Stewart Edisi 8
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Oleh Ahmad Fauzi (Teknik Sipil)
                  </div>
                  <div className="text-[10px] text-emerald-400 font-semibold mt-1 flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    <span>COD: Lobi Dekanat FT UNM Parangtambung</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => onOpenChatWithSeller('Ahmad Fauzi', REUSE_ITEMS[0])}
                className="w-full py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>Ambil / Hubungi Pemilik</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Trending Games ➔ Trending Bursa Reuse & Papan Dicari (Inspired by Reference) */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-amber-500 animate-pulse" />
            <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-slate-100 tracking-tight">
              Trending di Kampus
            </h2>
            <span className="text-xs text-slate-400 dark:text-slate-500 hidden sm:inline">
              (Barang Preloved, Hibah & Permintaan Kebutuhan)
            </span>
          </div>

          {/* Category Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            <button
              onClick={() => setSelectedFilter('all')}
              className={`px-3 py-1 rounded-full font-bold transition-all cursor-pointer whitespace-nowrap ${
                selectedFilter === 'all'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-[#1a233a] text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              Semua
            </button>
            <button
              onClick={() => setSelectedFilter('buku')}
              className={`px-3 py-1 rounded-full font-bold transition-all cursor-pointer whitespace-nowrap ${
                selectedFilter === 'buku'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-[#1a233a] text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              Buku & Diktat
            </button>
            <button
              onClick={() => setSelectedFilter('gratis')}
              className={`px-3 py-1 rounded-full font-bold transition-all cursor-pointer whitespace-nowrap ${
                selectedFilter === 'gratis'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-[#1a233a] text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              🎁 Gratis / Donasi
            </button>
            <button
              onClick={() => setSelectedFilter('dicari')}
              className={`px-3 py-1 rounded-full font-bold transition-all cursor-pointer whitespace-nowrap ${
                selectedFilter === 'dicari'
                  ? 'bg-emerald-600 text-white shadow-sm'
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
            // Render Request Board Items
            requests.map((req) => (
              <div
                key={req.id}
                className="rounded-2xl bg-white dark:bg-[#131b2e] border border-amber-200 dark:border-amber-900/60 shadow-sm p-4 flex flex-col justify-between space-y-3 hover:shadow-md transition-shadow"
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
            // Render Preloved Items
            filteredItems.map((item) => (
              <div
                key={item.id}
                className="group rounded-2xl bg-white dark:bg-[#131b2e] border border-slate-200/90 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
              >
                <div>
                  {/* Image container with badges */}
                  <div className="relative h-36 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2 left-2 flex flex-col gap-1">
                      {item.isFree ? (
                        <span className="px-2 py-0.5 rounded-md bg-emerald-600 text-white font-black text-[10px] shadow-sm">
                          GRATIS / HIBAH
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-md bg-slate-900/80 backdrop-blur-xs text-white font-bold text-[10px]">
                          Rp {item.priceRupiah.toLocaleString()}
                        </span>
                      )}
                    </div>

                    <div className="absolute bottom-2 right-2">
                      <span className="px-1.5 py-0.5 rounded bg-slate-900/80 backdrop-blur-xs text-slate-200 text-[9px] font-medium">
                        {item.category}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
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

                {/* Card footer CTA */}
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

      {/* 3. Lower Modular Grid (Inspired by "Accessories for Gamers" and "Recent plays" in Reference) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Modular Card: Quick AI Scanner & DIY Upcycling (5 cols) */}
        <div className="lg:col-span-5 rounded-2xl bg-white dark:bg-[#131b2e] border border-slate-200/90 dark:border-slate-800 shadow-sm p-5 flex flex-col justify-between space-y-4">
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

            {/* Interactive Preview Box */}
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
            className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-sm"
          >
            <Camera className="w-4 h-4" />
            <span>Mulai Pindai Sampah Sekarang</span>
          </button>
        </div>

        {/* Right Modular Card: Recent Sorting & Verifications (7 cols) */}
        <div className="lg:col-span-7 rounded-2xl bg-white dark:bg-[#131b2e] border border-slate-200/90 dark:border-slate-800 shadow-sm p-5 flex flex-col justify-between space-y-4">
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

            {/* List of recent activities */}
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
