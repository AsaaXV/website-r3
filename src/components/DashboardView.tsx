import React from 'react';
import {
  Leaf,
  Droplet,
  CloudRain,
  TreeDeciduous,
  Scale,
  Camera,
  MapPin,
  TrendingUp,
  Award,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Zap,
  BookOpen,
  Calendar,
  Truck,
  Users
} from 'lucide-react';
import { UserProfile, LedgerTransaction } from '../types';
import { WASTE_CATEGORIES, GIS_FACILITIES, FACULTY_LEADERBOARD_DATA } from '../data/mockData';

interface DashboardViewProps {
  currentUser: UserProfile;
  transactions?: LedgerTransaction[];
  onNavigate?: (tab: string) => void;
  onOpenSurveyModal?: () => void;
  activeSurveysCount?: number;
  onNavigateToScanner?: () => void;
  onNavigateToGamification?: () => void;
  onNavigateToEducation?: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  currentUser,
  transactions = [],
  onNavigate,
  onOpenSurveyModal,
  activeSurveysCount = 0,
  onNavigateToScanner,
  onNavigateToGamification,
  onNavigateToEducation,
}) => {
  // Safe navigation helper that handles both onNavigate and specific handlers
  const handleNavigate = (tab: string) => {
    if (onNavigate) {
      onNavigate(tab);
    } else {
      if (tab === 'scanner' && onNavigateToScanner) onNavigateToScanner();
      else if (tab === 'gamification' && onNavigateToGamification) onNavigateToGamification();
      else if (tab === 'edukasi' && onNavigateToEducation) onNavigateToEducation();
    }
  };

  // Safe user impact statistics
  const userWeight = currentUser?.totalWeightDepositedKg ?? 0;
  const userCo2Saved = (userWeight * 2.8).toFixed(1);
  const userWaterSaved = Math.round(userWeight * 45);
  const userTreesEquiv = (userWeight * 0.08).toFixed(1);
  const landfillDiversionRate = 88.4; // %

  return (
    <div className="space-y-8 pb-12">
      {/* Hero Banner: Identity & TPB Attitude Affirmation */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white p-6 sm:p-8 shadow-xl border border-emerald-800/40">
        <div className="absolute -right-12 -bottom-12 w-64 h-64 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none"></div>
        <div className="absolute right-12 top-4 opacity-10 hidden md:block">
          <Leaf className="w-48 h-48 text-emerald-300" />
        </div>

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-200 text-xs font-semibold mb-4">
            <Zap className="w-3.5 h-3.5 text-emerald-400" />
            <span>Green Campus Initiative • Edukasi, Reduksi & Sirkularitas</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-2">
            Selamat Datang, {currentUser.name}
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6 max-w-2xl">
            Platform edukasi dan sirkularitas kampus berbasis <span className="text-emerald-300 font-semibold">Theory of Planned Behavior</span>. Pelajari pemilahan material presisi, manfaatkan <span className="text-emerald-300 font-semibold">Bursa Reuse Preloved</span> antar-mahasiswa, dan deteksi jenis sampah secara instan menggunakan AI.
          </p>

          {/* Quick Action Shortcuts */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => handleNavigate('scanner')}
              id="hero-quick-scan"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95 cursor-pointer"
            >
              <Camera className="w-4 h-4" />
              <span>Scan Material AI</span>
            </button>
            <button
              onClick={() => handleNavigate('komunitas')}
              id="hero-quick-reuse"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95 cursor-pointer"
            >
              <Users className="w-4 h-4" />
              <span>Bursa Reuse Preloved</span>
            </button>
            <button
              onClick={() => handleNavigate('edukasi')}
              id="hero-quick-edu"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-xs sm:text-sm backdrop-blur-xs transition-all active:scale-95 cursor-pointer"
            >
              <BookOpen className="w-4 h-4 text-emerald-300" />
              <span>Panduan Edukasi 3R</span>
            </button>
            <button
              onClick={() => handleNavigate('fasilitas')}
              id="hero-quick-gis"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-xs sm:text-sm backdrop-blur-xs transition-all active:scale-95 cursor-pointer"
            >
              <MapPin className="w-4 h-4 text-teal-300" />
              <span>Peta Aliran TPA Tamangapa</span>
            </button>
          </div>
        </div>
      </div>

      {/* Educational Hub Fast-Access Feature */}
      <div className="bg-gradient-to-br from-emerald-50 via-teal-50 to-white rounded-2xl border border-emerald-200/80 p-5 sm:p-6 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <span className="text-[11px] font-black text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
              <span>Prioritas Literasi & Pemilahan Sampah Kampus</span>
            </span>
            <h2 className="text-base sm:text-lg font-black text-slate-900">
              Pusat Edukasi & Pemilahan Sampah 3R
            </h2>
            <p className="text-xs text-slate-600">
              Pelajari standar pemilahan, ikuti kuis latihan interaktif, dan bedah mitos lingkungan sebelum menyetor sampah.
            </p>
          </div>
          <button
            onClick={() => handleNavigate('edukasi')}
            id="dashboard-open-edu"
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-2 shadow-xs transition-all shrink-0 cursor-pointer"
          >
            <BookOpen className="w-4 h-4" />
            <span>Buka Portal Edukasi Lengkap</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          <div
            onClick={() => handleNavigate('edukasi')}
            className="p-3.5 bg-white rounded-xl border border-emerald-100 hover:border-emerald-300 transition-all cursor-pointer space-y-1.5 group"
          >
            <div className="font-bold text-xs text-slate-900 group-hover:text-emerald-700 transition-colors flex items-center justify-between">
              <span>📋 1. Panduan Pilah & Taksonomi</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-all" />
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Panduan 4 warna tong, jenis polimer plastik, dan tata cara higienis sebelum disetor.
            </p>
          </div>

          <div
            onClick={() => handleNavigate('edukasi')}
            className="p-3.5 bg-white rounded-xl border border-amber-100 hover:border-amber-300 transition-all cursor-pointer space-y-1.5 group"
          >
            <div className="font-bold text-xs text-slate-900 group-hover:text-amber-700 transition-colors flex items-center justify-between">
              <span>🧠 2. Kuis Latihan Pilah Cerdas</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-600 group-hover:translate-x-0.5 transition-all" />
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Uji pemahaman Anda dengan simulasi memilah cup boba, kardus pizza, hingga struk belanja.
            </p>
          </div>

          <div
            onClick={() => handleNavigate('edukasi')}
            className="p-3.5 bg-white rounded-xl border border-blue-100 hover:border-blue-300 transition-all cursor-pointer space-y-1.5 group"
          >
            <div className="font-bold text-xs text-slate-900 group-hover:text-blue-700 transition-colors flex items-center justify-between">
              <span>💡 3. Mitos vs Fakta Ekologi</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Bedah mitos seputar plastik oxo-degradable, kertas berlaminasi, dan bahaya pembakaran sampah.
            </p>
          </div>
        </div>
      </div>

      {/* Quick Location & Nearest Drop Point Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs sm:text-sm font-bold text-slate-900">
                Lokasi Anda: {currentUser?.faculty || 'Fakultas Teknik'} (Kampus Parangtambung UNM)
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                GPS Aktif
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Drop point terdekat: <strong className="text-slate-800">Smart Drop Bin Fakultas Teknik</strong> (±200 meter • 2 menit jalan kaki)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => handleNavigate('fasilitas')}
            id="dashboard-locate-btn"
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer active:scale-95"
          >
            <MapPin className="w-3.5 h-3.5 text-emerald-400" />
            <span>Lihat Lokasi Saya di Peta</span>
          </button>
        </div>
      </div>

      {/* TPB Pillar 1: Attitude - Personal Ecological Impact Counters */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Leaf className="w-5 h-5 text-emerald-600" />
              <span>Dampak Ekologis & Reduksi Sampah Personal</span>
            </h2>
            <p className="text-xs text-slate-500">
              Estimasi pencegahan timbulan sampah, pemilahan mandiri, dan pemanfaatan bursa pakai ulang (reuse)
            </p>
          </div>
          <span className="hidden sm:inline-flex text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
            Audit Ledger Terverifikasi
          </span>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between text-emerald-600 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Sampah Teralihkan</span>
              <Scale className="w-4 h-4" />
            </div>
            <div className="text-2xl font-black text-slate-900">
              {currentUser.totalWeightDepositedKg} <span className="text-xs font-normal text-slate-500">kg</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-emerald-600" />
              <span>Dari pakai ulang & pilah mandiri</span>
            </p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between text-emerald-600 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Emisi CO₂ Tercegah</span>
              <CloudRain className="w-4 h-4 text-teal-600" />
            </div>
            <div className="text-2xl font-black text-slate-900">
              {userCo2Saved} <span className="text-xs font-normal text-slate-500">kg CO₂e</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Ekuivalen eliminasi emisi 120 km motor
            </p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between text-blue-600 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Air Bersih Dihemat</span>
              <Droplet className="w-4 h-4" />
            </div>
            <div className="text-2xl font-black text-slate-900">
              {userWaterSaved.toLocaleString('id-ID')} <span className="text-xs font-normal text-slate-500">Liter</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Dari daur ulang serat kertas & polimer PET
            </p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between text-emerald-700 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Pengalihan TPA</span>
              <TreeDeciduous className="w-4 h-4" />
            </div>
            <div className="text-2xl font-black text-slate-900">
              {landfillDiversionRate}%
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Mencegah beban TPA Antang Makassar
            </p>
          </div>
        </div>
      </section>

      {/* Waste Characterization Section: Direct translation from Document Section 2 */}
      <section className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Taksonomi & Karakteristik Timbulan Sampah Kampus
            </h2>
            <p className="text-xs text-slate-500">
              Berdasarkan studi empiris laju timbulan mahasiswa (0.02 - 0.57 kg/kapita/hari) untuk panduan pengurangan timbulan
            </p>
          </div>
          <button
            onClick={() => handleNavigate('edukasi')}
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 self-start sm:self-auto cursor-pointer"
          >
            <span>Pelajari Taksonomi Pilah</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {WASTE_CATEGORIES.map((cat) => (
            <div
              key={cat.id}
              className="p-4 rounded-xl border border-slate-200 hover:border-slate-300 transition-all bg-slate-50/50 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span
                    className="w-3 h-3 rounded-full shrink-0"
                    style={{ backgroundColor: cat.binColor }}
                    title={`Kode Warna Wadah: ${cat.binColorName}`}
                  />
                  <span className="text-xs font-bold text-slate-700 bg-white px-2 py-0.5 rounded border border-slate-200">
                    {cat.percentageVolume}
                  </span>
                </div>

                <h3 className="font-bold text-slate-900 text-sm mb-1">{cat.name}</h3>
                <p className="text-xs text-slate-600 mb-3 line-clamp-2 leading-relaxed">
                  {cat.description}
                </p>

                <div className="text-[11px] text-slate-500 bg-white p-2 rounded-lg border border-slate-200 mb-3 space-y-1">
                  <div className="font-semibold text-slate-700">Contoh Material:</div>
                  <div className="text-slate-600 leading-tight">
                    {cat.subtypes.slice(0, 2).join(', ')}, dll.
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">Poin Literasi:</span>
                <span className="font-bold text-emerald-700">
                  +{cat.pointsPerKg} Poin Kuis ({cat.xpPerKg} XP)
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Middle Grid: Campus Facilities & Faculty Leaderboard (Subjective Norms) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Logistics Infrastructure Status (Section 2) */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-emerald-600" />
                  <span>Jaringan Fasilitas & Aliran Sampah Kampus</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Pemetaan aliran sampah dari TPS3R & drop box kampus menuju pemrosesan akhir TPA Tamangapa
                </p>
              </div>
              <button
                onClick={() => handleNavigate('fasilitas')}
                className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
              >
                <span>Lihat Peta Fasilitas & TPA</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="space-y-3">
              {GIS_FACILITIES.slice(0, 4).map((fac) => {
                const loadPercent = Math.round((fac.currentLoadKg / fac.capacityDailyKg) * 100);
                return (
                  <div
                    key={fac.id}
                    className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 text-xs sm:text-sm">{fac.name}</span>
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-slate-200 text-slate-700">
                            {fac.type}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">{fac.address}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-xs font-bold text-emerald-700">{fac.distanceKm} km</span>
                        <div className="text-[10px] text-slate-500">{fac.subdistrict}</div>
                      </div>
                    </div>

                    <div className="mt-2 flex items-center gap-3 text-xs">
                      <div className="flex-1">
                        <div className="flex justify-between text-[10px] text-slate-500 mb-1">
                          <span>Kapasitas Operasional Harian</span>
                          <span className="font-bold text-slate-700">{fac.currentLoadKg} / {fac.capacityDailyKg} kg ({loadPercent}%)</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              loadPercent > 85 ? 'bg-rose-500' : loadPercent > 65 ? 'bg-amber-500' : 'bg-emerald-600'
                            }`}
                            style={{ width: `${loadPercent}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
            <span>Algoritma VRP (Vehicle Routing Problem) aktif untuk rute armada kampus.</span>
            <span className="font-medium text-emerald-700">SRID 4326 (WGS 84 PostGIS)</span>
          </div>
        </div>

        {/* Right 1 Col: Faculty Competition (TPB Subjective Norms) */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-500" />
                  <span>Papan Peringkat Fakultas</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Dinamika kompetisi pro-sosial antar-fakultas
                </p>
              </div>
            </div>

            <div className="space-y-2.5 mt-3">
              {FACULTY_LEADERBOARD_DATA.slice(0, 5).map((fac) => (
                <div
                  key={fac.faculty}
                  className={`p-2.5 rounded-xl border transition-all flex items-center justify-between ${
                    fac.faculty === currentUser.faculty
                      ? 'bg-emerald-50/80 border-emerald-300 ring-1 ring-emerald-300'
                      : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                        fac.rank === 1
                          ? 'bg-amber-400 text-amber-950 shadow-2xs'
                          : fac.rank === 2
                          ? 'bg-slate-300 text-slate-800'
                          : fac.rank === 3
                          ? 'bg-amber-700 text-amber-100'
                          : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {fac.rank}
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 text-xs flex items-center gap-1">
                        <span>{fac.faculty}</span>
                        {fac.faculty === currentUser.faculty && (
                          <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-100 px-1 rounded">
                            Anda
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-500">
                        {fac.participantsCount} partisipan • {fac.recyclingRatePercent}% terpilah
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-black text-slate-900 text-xs">{fac.totalKg}</span>
                    <span className="text-[10px] text-slate-500"> kg</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => handleNavigate('gamification')}
            className="w-full mt-4 py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1 cursor-pointer"
          >
            <span>Buka Tantangan & Klasemen Lengkap</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Bottom Section: Immutable Ledger Audit Preview & Usability Rating */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Ledger preview (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Buku Besar Transaksi Terkini (Double-Entry Ledger)</span>
              </h3>
              <p className="text-xs text-slate-500">
                Catatan mutasi poin append-only dengan verifikasi kriptografis dan deteksi anti-cheat
              </p>
            </div>
            <button
              onClick={() => handleNavigate('ledger')}
              className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
            >
              <span>Buka Audit Ledger</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 font-semibold">
                  <th className="pb-2">ID & Waktu</th>
                  <th className="pb-2">Nasabah</th>
                  <th className="pb-2">Bobot (kg)</th>
                  <th className="pb-2">Eco-Points</th>
                  <th className="pb-2">Z-Score</th>
                  <th className="pb-2">Status Audit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {transactions.slice(0, 3).map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-50">
                    <td className="py-2.5 font-mono text-[11px] text-slate-600">
                      <div className="font-bold text-slate-900">{tx.id}</div>
                      <div className="text-[10px] text-slate-400">{tx.timestamp}</div>
                    </td>
                    <td className="py-2.5">
                      <div className="font-semibold text-slate-900">{tx.userName}</div>
                      <div className="text-[10px] text-slate-500">{tx.faculty}</div>
                    </td>
                    <td className="py-2.5 font-bold text-slate-900">
                      {tx.totalWeightKg} kg
                    </td>
                    <td className="py-2.5 font-bold text-emerald-700">
                      +{tx.totalPoints} pts
                    </td>
                    <td className="py-2.5">
                      <span
                        className={`font-mono font-semibold ${
                          tx.zScore > 3.0 ? 'text-rose-600' : 'text-slate-600'
                        }`}
                      >
                        {tx.zScore.toFixed(2)}σ
                      </span>
                    </td>
                    <td className="py-2.5">
                      {tx.status === 'verified' ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Terverifikasi</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-rose-100 text-rose-800">
                          <AlertTriangle className="w-3 h-3" />
                          <span>Anomali Terkunci</span>
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Survei Riset Kampus Widget */}
        <div className="bg-gradient-to-br from-emerald-50 via-white to-slate-50 rounded-2xl p-5 sm:p-6 border border-emerald-100 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <BookOpen className="w-4 h-4 text-emerald-600" />
              <span className="text-xs font-bold text-emerald-900 uppercase tracking-wider">
                Alat Riset & Partisipasi
              </span>
            </div>

            <h3 className="font-bold text-slate-900 text-base mb-1">
              Survei Sirkularitas Kampus
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              Suara Anda menentukan arah inisiatif pengurangan sampah di UNM. Bantu tim riset merumuskan kebijakan sirkularitas berbasis data nyata.
            </p>

            <div className="bg-white p-4 rounded-xl border border-emerald-100 shadow-2xs mb-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-semibold text-slate-600">Status Survei</span>
                <span
                  className={`text-xs font-bold px-2 py-0.5 rounded border ${
                    activeSurveysCount > 0
                      ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
                      : 'text-slate-600 bg-slate-50 border-slate-200'
                  }`}
                >
                  {activeSurveysCount > 0 ? `${activeSurveysCount} Tersedia` : 'Selesai'}
                </span>
              </div>
              <div className="text-2xl font-black text-slate-900">
                {activeSurveysCount > 0 ? 'Survei Tersedia' : 'Tidak Ada Survei Aktif'}
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                {activeSurveysCount > 0
                  ? 'Kuesioner penelitian baru siap diisi dengan reward poin apresiasi.'
                  : 'Terima kasih telah berpartisipasi dalam semua survei aktif.'}
              </p>
            </div>
          </div>

          {activeSurveysCount > 0 && onOpenSurveyModal ? (
            <button
              onClick={onOpenSurveyModal}
              id="open-survey-test-card-btn"
              className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Isi Survei Sekarang</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <div className="w-full py-2.5 px-4 rounded-xl bg-slate-100 text-slate-500 font-semibold text-xs text-center">
              Tidak ada survei aktif saat ini
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
