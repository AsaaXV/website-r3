import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  Award,
  Flame,
  Coins,
  Gift,
  CheckCircle2,
  Lock,
  Sparkles,
  QrCode,
  Coffee,
  Wifi,
  FileText,
  GraduationCap,
  ChevronRight,
  TrendingUp,
  Share2,
  CalendarCheck,
  Printer,
  Download,
  ShieldCheck,
  Check,
  Ban,
  ShoppingBag,
  Scan,
  Users
} from 'lucide-react';
import {
  INITIAL_LEADERBOARD_STUDENTS,
  FACULTY_LEADERBOARD_DATA,
  REWARD_ITEMS
} from '../data/mockData';
import { UserProfile, RewardItem, DailyChallenge } from '../types';
import { getStoredChallenges, saveStoredChallenges } from '../utils/storage';

interface GamificationViewProps {
  currentUser: UserProfile;
  onRedeemReward: (reward: RewardItem) => boolean;
  onUpdateUser?: (updatedUser: UserProfile) => void;
}

export const GamificationView: React.FC<GamificationViewProps> = ({
  currentUser,
  onRedeemReward,
  onUpdateUser,
}) => {
  const [activeTab, setActiveTab] = useState<'leaderboard' | 'challenges' | 'certificate' | 'faculty' | 'rewards' | 'badges'>('challenges');
  const [selectedReward, setSelectedReward] = useState<RewardItem | null>(null);
  const [redeemedCode, setRedeemedCode] = useState<string | null>(null);
  const [redeemError, setRedeemError] = useState<string | null>(null);
  const [challengeToast, setChallengeToast] = useState<string | null>(null);

  // Daily Micro-challenges state persisted in localStorage
  const [dailyChallenges, setDailyChallenges] = useState<DailyChallenge[]>(() => getStoredChallenges());

  // Experience level threshold: Level * 400 XP
  const nextLevelXp = currentUser.level * 400;
  const currentLevelBaseXp = (currentUser.level - 1) * 400;
  const progressPercent = Math.min(
    100,
    Math.round(((currentUser.xp - currentLevelBaseXp) / (nextLevelXp - currentLevelBaseXp)) * 100)
  );

  const completedChallengesCount = dailyChallenges.filter((c) => c.completed).length;

  const showChallengeNotification = (msg: string) => {
    setChallengeToast(msg);
    setTimeout(() => setChallengeToast(null), 3500);
  };

  const handleCompleteChallenge = (day: number) => {
    const target = dailyChallenges.find((c) => c.day === day);
    if (!target || target.completed) return;

    confetti({
      particleCount: 90,
      spread: 70,
      origin: { y: 0.6 },
    });

    const updated = dailyChallenges.map((c) =>
      c.day === day
        ? { ...c, completed: true, completedAt: new Date().toISOString() }
        : c
    );
    setDailyChallenges(updated);
    saveStoredChallenges(updated);

    // Update user points and XP
    if (onUpdateUser) {
      const updatedUser: UserProfile = {
        ...currentUser,
        ecoPoints: currentUser.ecoPoints + target.rewardPoints,
        xp: currentUser.xp + target.rewardXp,
      };
      onUpdateUser(updatedUser);
    }

    showChallengeNotification(
      `Selamat! Tantangan Hari ke-${day} Selesai (+${target.rewardPoints} Eco-Points & +${target.rewardXp} XP)`
    );
  };

  const getRewardIcon = (iconName: string) => {
    switch (iconName) {
      case 'Coffee':
        return <Coffee className="w-5 h-5 text-amber-600" />;
      case 'Wifi':
        return <Wifi className="w-5 h-5 text-blue-600" />;
      case 'FileText':
        return <FileText className="w-5 h-5 text-indigo-600" />;
      case 'GraduationCap':
        return <GraduationCap className="w-5 h-5 text-emerald-600" />;
      default:
        return <Gift className="w-5 h-5 text-teal-600" />;
    }
  };

  const handleRedeemClick = (reward: RewardItem) => {
    setRedeemError(null);
    if (currentUser.ecoPoints < reward.costPoints) {
      setRedeemError(`Saldo Eco-Points Anda (${currentUser.ecoPoints}) tidak mencukupi untuk item ini (${reward.costPoints} pts).`);
      return;
    }

    const success = onRedeemReward(reward);
    if (success) {
      const randomCode = `ECO-${reward.category.slice(0, 3).toUpperCase()}-${Math.floor(100000 + Math.random() * 900000)}`;
      setRedeemedCode(randomCode);
      setSelectedReward(reward);

      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  };

  const handlePrintCertificate = () => {
    window.print();
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Toast Notification for challenges */}
      {challengeToast && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 bg-emerald-900 text-white rounded-2xl shadow-2xl flex items-center gap-2.5 text-xs font-bold border border-emerald-500 animate-in fade-in slide-in-from-bottom-5">
          <Sparkles className="w-4 h-4 text-amber-300 shrink-0" />
          <span>{challengeToast}</span>
        </div>
      )}

      {/* Gamification Header: User Progression & Level Status */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-900 to-slate-900 text-white rounded-2xl p-6 sm:p-7 shadow-lg border border-emerald-700/50">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          {/* User Level Card */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={currentUser.avatarUrl}
                alt={currentUser.name}
                className="w-16 h-16 rounded-2xl object-cover ring-2 ring-emerald-400 shadow-md"
              />
              <div className="absolute -bottom-2 -right-2 px-2 py-0.5 rounded-md bg-amber-400 text-amber-950 font-black text-[10px] shadow-xs">
                LVL {currentUser.level}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-white">{currentUser.name}</h2>
                <span className="px-2 py-0.5 rounded bg-emerald-700/60 text-emerald-200 text-[10px] font-bold border border-emerald-500/40">
                  {currentUser.faculty}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Penggerak Kampus Sirkular • Bebas Timbunan Sampah
              </p>

              {/* XP Progress Bar */}
              <div className="mt-3 w-48 sm:w-64">
                <div className="flex justify-between text-[10px] text-slate-300 font-semibold mb-1">
                  <span>Progres Level {currentUser.level + 1}</span>
                  <span>{progressPercent}%</span>
                </div>
                <div className="w-full h-2 bg-slate-800/80 rounded-full overflow-hidden border border-white/10">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-400 to-amber-400 rounded-full transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <div className="text-[9px] text-slate-400 mt-1">
                  {currentUser.xp} / {nextLevelXp} XP ({nextLevelXp - currentUser.xp} XP menuju Level Berikutnya)
                </div>
              </div>
            </div>
          </div>

          {/* Eco-Points Balance & Streak Widget */}
          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md p-3.5 rounded-xl border border-white/10 self-start md:self-auto">
            <div className="pr-3 border-r border-white/20">
              <div className="text-[10px] uppercase font-bold text-slate-300 tracking-wider">Saldo Eco-Points</div>
              <div className="text-2xl font-black text-amber-300 flex items-center gap-1.5 mt-0.5">
                <Coins className="w-5 h-5 text-amber-400" />
                <span>{currentUser.ecoPoints.toLocaleString('id-ID')}</span>
              </div>
            </div>

            <div className="pl-1">
              <div className="text-[10px] uppercase font-bold text-slate-300 tracking-wider">Streak Kampus</div>
              <div className="text-xl font-black text-amber-400 flex items-center gap-1 mt-0.5">
                <Flame className="w-5 h-5 fill-amber-400" />
                <span>{currentUser.currentStreakDays} Minggu</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex border-b border-slate-200 overflow-x-auto gap-2 pb-1 scrollbar-none">
        {[
          { id: 'challenges', label: 'Tantangan 7 Hari Hijau' },
          { id: 'certificate', label: 'E-Sertifikat Partisipasi' },
          { id: 'leaderboard', label: 'Klasemen Mahasiswa' },
          { id: 'faculty', label: 'Kompetisi Antar-Fakultas' },
          { id: 'rewards', label: 'Katalog Hadiah & Insentif' },
          { id: 'badges', label: 'Lencana & Badges' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all whitespace-nowrap cursor-pointer ${
              activeTab === tab.id
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {redeemError && (
        <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 font-medium">
          {redeemError}
        </div>
      )}

      {/* TAB: TANTANGAN 7 HARI HIJAU (MICRO-CHALLENGE) */}
      {activeTab === 'challenges' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-emerald-100 text-emerald-900 border border-emerald-300 flex items-center gap-1">
                    <CalendarCheck className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Micro-Habit Kampus Berkelanjutan</span>
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-black text-slate-900 mt-1">
                  Tantangan 7 Hari Gaya Hidup Hijau Sivitas Akademika
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Selesaikan satu tantangan setiap hari untuk membangun kebiasaan sirkular bebas plastik di kampus dan dapatkan bonus Eco-Points.
                </p>
              </div>

              {/* Progress Tracker */}
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 px-4 flex items-center gap-3 shrink-0">
                <div className="w-10 h-10 rounded-full bg-emerald-600 text-white font-black text-sm flex items-center justify-center shadow-xs">
                  {completedChallengesCount}/7
                </div>
                <div>
                  <div className="text-[11px] font-bold text-emerald-900">Progres Tantangan</div>
                  <div className="text-[10px] text-emerald-700">
                    {completedChallengesCount === 7
                      ? 'Hebat! Semua tantangan tuntas'
                      : `${7 - completedChallengesCount} misi tersisa minggu ini`}
                  </div>
                </div>
              </div>
            </div>

            {/* List of 7 Daily Challenges */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
              {dailyChallenges.map((challenge) => {
                return (
                  <div
                    key={challenge.day}
                    className={`p-4 rounded-xl border transition-all flex flex-col justify-between ${
                      challenge.completed
                        ? 'bg-emerald-50/50 border-emerald-200 text-slate-800'
                        : 'bg-white border-slate-200 hover:border-emerald-300 shadow-2xs'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-black ${
                            challenge.completed
                              ? 'bg-emerald-200 text-emerald-950'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          HARI {challenge.day}
                        </span>

                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-bold text-amber-600 flex items-center gap-1">
                            <Coins className="w-3.5 h-3.5" />
                            <span>+{challenge.rewardPoints} pts</span>
                          </span>
                          <span className="text-[11px] font-bold text-emerald-700">
                            +{challenge.rewardXp} XP
                          </span>
                        </div>
                      </div>

                      <h4 className="font-bold text-slate-900 text-sm">
                        {challenge.title}
                      </h4>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                        {challenge.description}
                      </p>
                    </div>

                    <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between">
                      {challenge.completed ? (
                        <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span>Tantangan Selesai</span>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleCompleteChallenge(challenge.day)}
                          className="w-full py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
                        >
                          <Check className="w-4 h-4" />
                          <span>Klaim Selesai & Ambil Poin</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB: E-SERTIFIKAT PARTISIPASI HIJAU */}
      {activeTab === 'certificate' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-base sm:text-lg font-black text-slate-900">
                  E-Sertifikat Kontribusi Lingkungan Digital
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Bukti portofolio partisipasi resmi sivitas akademika dalam inisiatif reduksi sampah dan ekonomi sirkular kampus.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrintCertificate}
                  className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
                >
                  <Printer className="w-4 h-4 text-emerald-400" />
                  <span>Cetak / Unduh PDF</span>
                </button>
              </div>
            </div>

            {/* Official Digital Certificate Canvas */}
            <div className="mt-6 max-w-3xl mx-auto p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-emerald-950 via-teal-950 to-slate-950 text-white border-4 border-amber-400/80 shadow-2xl relative overflow-hidden">
              {/* Decorative Corner Filigrees */}
              <div className="absolute top-0 left-0 w-24 h-24 border-t-4 border-l-4 border-amber-400/70 rounded-tl-3xl m-3 pointer-events-none" />
              <div className="absolute top-0 right-0 w-24 h-24 border-t-4 border-r-4 border-amber-400/70 rounded-tr-3xl m-3 pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-24 h-24 border-b-4 border-l-4 border-amber-400/70 rounded-bl-3xl m-3 pointer-events-none" />
              <div className="absolute bottom-0 right-0 w-24 h-24 border-b-4 border-r-4 border-amber-400/70 rounded-br-3xl m-3 pointer-events-none" />

              {/* Seal and Header */}
              <div className="text-center space-y-2 relative z-10">
                <div className="w-16 h-16 rounded-full bg-amber-400 text-amber-950 mx-auto flex items-center justify-center font-black shadow-lg ring-4 ring-amber-400/40">
                  <Award className="w-9 h-9" />
                </div>

                <div className="text-xs uppercase tracking-widest text-amber-300 font-bold">
                  UNIVERSITAS HASANUDDIN • ECO-CAMPUS 3R INITIATIVE
                </div>
                <h1 className="text-xl sm:text-3xl font-black tracking-tight text-white uppercase font-serif">
                  Sertifikat Penghargaan Sirkular
                </h1>
                <p className="text-xs text-emerald-200/90 max-w-lg mx-auto">
                  Diberikan sebagai pengakuan dedikasi nyata dalam pemilahan sampah di hulu kampus dan reduksi beban TPA Tamangapa Antang.
                </p>
              </div>

              {/* Recipient Information */}
              <div className="my-8 text-center space-y-1 relative z-10 border-y border-amber-400/30 py-6">
                <div className="text-[11px] text-slate-300 uppercase tracking-wider font-semibold">
                  Diberikan Secara Bangga Kepada:
                </div>
                <div className="text-2xl sm:text-3xl font-black text-amber-300 tracking-wide">
                  {currentUser.name}
                </div>
                <div className="text-xs text-slate-300">
                  {currentUser.email} • {currentUser.faculty}
                </div>
                <div className="inline-block mt-2 px-3 py-1 rounded-full bg-emerald-800/80 border border-emerald-400/40 text-[11px] font-bold text-emerald-200">
                  Peringkat Penggerak: Level {currentUser.level} ({currentUser.ecoPoints} Poin Terakumulasi)
                </div>
              </div>

              {/* Achievements Grid */}
              <div className="grid grid-cols-3 gap-3 text-center my-6 relative z-10">
                <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                  <div className="text-[10px] text-slate-300 uppercase">Total Setor Sampah</div>
                  <div className="text-lg font-black text-white mt-0.5">
                    {currentUser.totalWeightDepositedKg || 38.5} <span className="text-xs font-normal">kg</span>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                  <div className="text-[10px] text-slate-300 uppercase">Cegah Karbon CO₂e</div>
                  <div className="text-lg font-black text-emerald-400 mt-0.5">
                    {Math.round((currentUser.totalWeightDepositedKg || 38.5) * 1.8)} <span className="text-xs font-normal">kg</span>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                  <div className="text-[10px] text-slate-300 uppercase">Status Validasi</div>
                  <div className="text-xs font-black text-amber-300 mt-1 flex items-center justify-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Terverifikasi</span>
                  </div>
                </div>
              </div>

              {/* Footer: Signatures and QR Code */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-6 border-t border-white/10 relative z-10 text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 bg-white p-1 rounded-lg shadow-inner">
                    <QrCode className="w-full h-full text-slate-900" />
                  </div>
                  <div className="text-[10px] text-slate-300 space-y-0.5">
                    <div className="font-mono font-bold text-white">
                      ID: ECO-MAKASSAR-{currentUser.id.slice(-6).toUpperCase()}-2026
                    </div>
                    <div>Diterbitkan di Kampus Tamalanrea</div>
                    <div>Status: Resmi & Berlaku Global</div>
                  </div>
                </div>

                <div className="text-center sm:text-right">
                  <div className="font-serif italic text-amber-300 text-sm">
                    Koordinator EcoCampus 3R
                  </div>
                  <div className="text-[10px] text-slate-300 mt-0.5">
                    UPT Pengelolaan Lingkungan & Kampus Hijau
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB: KLASEMEN MAHASISWA */}
      {activeTab === 'leaderboard' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Papan Peringkat Mahasiswa Teraktif</h3>
              <p className="text-xs text-slate-500">Berdasarkan volume timbangan limbah tervalidasi & akumulasi XP</p>
            </div>
            <div className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
              Reset Siklus: Setiap Akhir Semester
            </div>
          </div>

          <div className="divide-y divide-slate-100">
            {INITIAL_LEADERBOARD_STUDENTS.map((item) => {
              const isCurrentUser = item.id === currentUser.id;
              const calculatedLevel = Math.floor(item.xp / 100) + 1;
              return (
                <div
                  key={item.rank}
                  className={`p-3.5 sm:p-4 flex items-center justify-between gap-3 transition-colors ${
                    isCurrentUser ? 'bg-emerald-50/70 border-l-4 border-l-emerald-600' : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center font-black text-xs shrink-0 ${
                        item.rank === 1
                          ? 'bg-amber-400 text-amber-950 shadow-xs'
                          : item.rank === 2
                          ? 'bg-slate-300 text-slate-800'
                          : item.rank === 3
                          ? 'bg-amber-700 text-white'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {item.rank}
                    </div>

                    <img
                      src={item.avatar}
                      alt={item.name}
                      className="w-10 h-10 rounded-xl object-cover shrink-0"
                    />

                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-slate-900 text-xs sm:text-sm truncate">
                          {item.name}
                        </span>
                        {isCurrentUser && (
                          <span className="px-1.5 py-0.2 rounded bg-emerald-600 text-white text-[10px] font-bold">
                            Anda
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-500 truncate">
                        {item.faculty} • Level {calculatedLevel}
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-xs sm:text-sm font-black text-emerald-700">
                      {item.ecoPoints.toLocaleString('id-ID')} pts
                    </div>
                    <div className="text-[10px] text-slate-400">
                      {item.totalKg} kg terpilah
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB: KOMPETISI ANTAR-FAKULTAS */}
      {activeTab === 'faculty' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 sm:p-6 space-y-4">
          <div>
            <h3 className="font-bold text-slate-900 text-base">Liga Zero Waste Antar-Fakultas</h3>
            <p className="text-xs text-slate-500">
              Total volume sampah organik & anorganik yang berhasil dialihkan dari TPA Tamangapa per fakultas
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {FACULTY_LEADERBOARD_DATA.map((fac, idx) => (
              <div
                key={fac.faculty}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3 shadow-2xs"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-emerald-700 text-white font-bold text-xs flex items-center justify-center">
                      #{idx + 1}
                    </span>
                    <span className="font-bold text-slate-900 text-sm">{fac.faculty}</span>
                  </div>
                  <span className="text-xs font-bold text-emerald-700">
                    {fac.totalKg.toLocaleString('id-ID')} kg
                  </span>
                </div>

                {/* Relative progress bar */}
                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-600 rounded-full"
                    style={{ width: `${Math.min(100, (fac.totalKg / 4500) * 100)}%` }}
                  />
                </div>

                <div className="flex justify-between text-[11px] text-slate-500">
                  <span>Partisipasi: {fac.participantsCount} Mahasiswa</span>
                  <span>Cegah Emisi: {fac.co2ReducedKg} kg CO₂e</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB: KATALOG HADIAH & INSENTIF */}
      {activeTab === 'rewards' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 sm:p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Tukarkan Eco-Points dengan Manfaat Nyata</h3>
              <p className="text-xs text-slate-500">
                Poin diperoleh dari setoran pilah sampah, scan AI material, dan aktivitas sirkular
              </p>
            </div>
            <div className="text-xs font-bold text-amber-700 bg-amber-50 px-3 py-1 rounded-lg border border-amber-200 flex items-center gap-1.5 self-start sm:self-auto">
              <Coins className="w-4 h-4 text-amber-600" />
              <span>Saldo Anda: {currentUser.ecoPoints.toLocaleString('id-ID')} pts</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
            {REWARD_ITEMS.map((reward) => {
              const canAfford = currentUser.ecoPoints >= reward.costPoints;
              return (
                <div
                  key={reward.id}
                  className="p-4 rounded-xl border border-slate-200 bg-white hover:border-emerald-300 transition-all flex flex-col justify-between shadow-2xs"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center">
                        {getRewardIcon(reward.icon)}
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                        {reward.category}
                      </span>
                    </div>

                    <h4 className="font-bold text-slate-900 text-xs sm:text-sm">
                      {reward.title}
                    </h4>
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      {reward.description}
                    </p>

                    <div className="text-[10px] text-slate-400">
                      Partner: <strong className="text-slate-600">{reward.partner}</strong>
                    </div>
                  </div>

                  <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between">
                    <div className="text-xs font-black text-amber-600 flex items-center gap-1">
                      <Coins className="w-3.5 h-3.5" />
                      <span>{reward.costPoints} pts</span>
                    </div>

                    <button
                      onClick={() => handleRedeemClick(reward)}
                      disabled={!canAfford}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        canAfford
                          ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                      }`}
                    >
                      {canAfford ? 'Tukarkan' : 'Poin Kurang'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB: LENCANA & BADGES */}
      {activeTab === 'badges' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 sm:p-6 space-y-4">
          <div>
            <h3 className="font-bold text-slate-900 text-base">Portofolio Lencana & Rekognisi Hijau</h3>
            <p className="text-xs text-slate-500">
              Pengakuan portofolio lingkungan mahasiswa untuk insentif beasiswa dan kurikulum hijau
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {currentUser.badges.map((b) => (
              <div
                key={b.id}
                className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/40 space-y-2 flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-md mb-2">
                    <Award className="w-5 h-5 text-amber-300" />
                  </div>
                  <h4 className="font-bold text-slate-900 text-xs">{b.title}</h4>
                  <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                    {b.description}
                  </p>
                </div>
                <div className="text-[10px] text-emerald-800 font-semibold pt-2 border-t border-emerald-200/60">
                  Terbuka: {b.unlockedAt}
                </div>
              </div>
            ))}

            {/* Locked sample badge */}
            <div className="p-4 rounded-xl border border-dashed border-slate-300 bg-slate-50/60 space-y-2 opacity-60 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-slate-300 text-slate-600 flex items-center justify-center mb-2">
                  <Lock className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-slate-800 text-xs">Pahlawan 100 kg Zero Waste</h4>
                <p className="text-[11px] text-slate-500 mt-1">
                  Kumpulkan total timbangan 100 kg sampah terpilah di bank sampah kampus.
                </p>
              </div>
              <div className="text-[10px] text-slate-400 font-semibold pt-2 border-t border-slate-200">
                Progres: {currentUser.totalWeightDepositedKg || 38.5} / 100 kg
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Redemption Coupon Voucher Modal */}
      {selectedReward && redeemedCode && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 text-center space-y-4 shadow-2xl border border-slate-200">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-7 h-7" />
            </div>

            <div>
              <h3 className="text-lg font-black text-slate-900">Voucher Berhasil Ditukar!</h3>
              <p className="text-xs text-slate-500 mt-0.5">{selectedReward.title}</p>
            </div>

            {/* QR / Barcode Simulation */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <div className="w-28 h-28 bg-white border border-slate-300 mx-auto rounded-lg flex items-center justify-center shadow-2xs">
                <QrCode className="w-20 h-20 text-slate-900" />
              </div>
              <div className="font-mono text-sm font-black text-slate-900 tracking-wider">
                {redeemedCode}
              </div>
              <p className="text-[10px] text-slate-400">
                Tunjukkan kode QR ini ke kasir {selectedReward.partner}
              </p>
            </div>

            <button
              onClick={() => {
                setSelectedReward(null);
                setRedeemedCode(null);
              }}
              className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer"
            >
              Selesai & Simpan Voucher
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
