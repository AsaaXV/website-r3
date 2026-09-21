import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  Award,
  Flame,
  Coins,
  CheckCircle2,
  Lock,
  Sparkles,
  ChevronRight,
  TrendingUp,
  Share2,
  CalendarCheck,
  ShieldCheck,
  Check,
  Ban,
  Users
} from 'lucide-react';
import {
  INITIAL_LEADERBOARD_STUDENTS,
  FACULTY_LEADERBOARD_DATA,
} from '../data/mockData';
import { UserProfile, DailyChallenge } from '../types';
import { getUserChallenges, saveUserChallenges } from '../utils/storage';

interface GamificationViewProps {
  currentUser: UserProfile;
  onUpdateUser?: (updatedUser: UserProfile) => void;
}

export const GamificationView: React.FC<GamificationViewProps> = ({
  currentUser,
  onUpdateUser,
}) => {
  const [activeTab, setActiveTab] = useState<'challenges' | 'leaderboard' | 'faculty' | 'badges'>('challenges');
  const [challengeToast, setChallengeToast] = useState<string | null>(null);

  // Daily Micro-challenges state strictly isolated per user session (currentUser.id)
  const [dailyChallenges, setDailyChallenges] = useState<DailyChallenge[]>(() =>
    getUserChallenges(currentUser?.id || '')
  );

  // Re-fetch challenges whenever active authenticated user changes
  React.useEffect(() => {
    setDailyChallenges(getUserChallenges(currentUser?.id || ''));
  }, [currentUser?.id]);

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
    saveUserChallenges(currentUser.id, updated);

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
          { id: 'leaderboard', label: 'Klasemen Mahasiswa' },
          { id: 'faculty', label: 'Kompetisi Antar-Fakultas' },
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
    </div>
  );
};
