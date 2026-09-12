import React, { useState } from 'react';
import {
  X,
  LogIn,
  UserPlus,
  Lock,
  Mail,
  User,
  CheckCircle2,
  Sparkles,
  Eye,
  EyeOff,
  UserCheck,
  Shield,
  ArrowRight,
  Info
} from 'lucide-react';
import { UserProfile, UserRole } from '../types';
import { DEMO_ACCOUNTS } from '../data/mockData';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: UserProfile) => void;
  currentUser: UserProfile | null;
  initialMode?: 'login' | 'register';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLogin,
  currentUser,
  initialMode = 'login',
}) => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Register form state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regCategory, setRegCategory] = useState('Warga & Komunitas Umum');
  const [regNote, setRegNote] = useState('');
  const [regRole, setRegRole] = useState<UserRole>('mahasiswa');
  const [regPassword, setRegPassword] = useState('');
  const [regSuccess, setRegSuccess] = useState(false);

  if (!isOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    const query = loginEmail.trim().toLowerCase();
    if (!query) {
      setLoginError('Silakan masukkan Email (seperti Gmail) atau Username Anda');
      return;
    }

    // Match with existing demo accounts by email or name
    const matched = DEMO_ACCOUNTS.find(
      (u) =>
        u.email.toLowerCase() === query ||
        u.name.toLowerCase() === query ||
        u.name.toLowerCase().includes(query) ||
        (query.includes('@') && u.email.toLowerCase().includes(query.split('@')[0]))
    );

    if (matched) {
      onLogin(matched);
      onClose();
    } else {
      // Create user session immediately with provided email/username
      const isEmail = query.includes('@');
      const cleanName = isEmail
        ? query.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
        : loginEmail.trim();

      const newUser: UserProfile = {
        id: `usr_${Date.now()}`,
        name: cleanName,
        email: isEmail ? loginEmail.trim() : `${query}@gmail.com`,
        faculty: 'Warga & Komunitas EcoCampus',
        major: 'Pengguna Umum',
        role: 'mahasiswa',
        ecoPoints: 200,
        xp: 400,
        level: 1,
        currentStreakDays: 1,
        totalWeightDepositedKg: 0,
        avatarUrl:
          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
        badges: [
          {
            id: 'b_welcome',
            title: 'Warga Baru EcoCampus',
            description: 'Bergabung dalam ekosistem sirkularitas.',
            icon: 'Sprout',
            unlockedAt: new Date().toISOString().split('T')[0],
          },
        ],
      };
      onLogin(newUser);
      onClose();
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim() || !regEmail.trim()) {
      return;
    }

    const query = regEmail.trim().toLowerCase();
    const isEmail = query.includes('@');

    const newUser: UserProfile = {
      id: `usr_reg_${Date.now()}`,
      name: regName.trim(),
      email: isEmail ? regEmail.trim() : `${query}@gmail.com`,
      faculty: regCategory,
      major: regNote.trim() || 'Pengguna Umum',
      role: regRole,
      ecoPoints: 250, // Welcome bonus points!
      xp: 500,
      level: 1,
      currentStreakDays: 1,
      totalWeightDepositedKg: 0,
      avatarUrl:
        'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=250&q=80',
      badges: [
        {
          id: 'b_welcome_bonus',
          title: 'Bonus Registrasi 250 Pts',
          description: 'Berhasil mendaftarkan akun di portal sirkularitas EcoCampus.',
          icon: 'Sparkles',
          unlockedAt: new Date().toISOString().split('T')[0],
        },
      ],
    };

    setRegSuccess(true);
    setTimeout(() => {
      onLogin(newUser);
      onClose();
    }, 800);
  };

  const handleQuickDemoSelect = (user: UserProfile) => {
    onLogin(user);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border border-slate-200 my-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-600/20">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base sm:text-lg">
                Masuk ke Akun EcoCampus
              </h3>
              <p className="text-xs text-slate-500">
                Gunakan email umum (Gmail dsb.) atau username — tanpa NIS / data kampus
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Toggle: Masuk vs Daftar */}
        <div className="flex rounded-xl bg-slate-100 p-1 mt-4">
          <button
            type="button"
            onClick={() => {
              setActiveTab('login');
              setLoginError('');
            }}
            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'login'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <LogIn className="w-3.5 h-3.5 text-emerald-600" />
            <span>Masuk Akun</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('register');
              setLoginError('');
            }}
            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'register'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5 text-emerald-600" />
            <span>Daftar Akun Baru</span>
          </button>
        </div>

        {/* Info Banner: Bebas Tanpa Data Kampus */}
        <div className="mt-3.5 p-2.5 rounded-xl bg-emerald-50 border border-emerald-200/80 flex items-start gap-2 text-emerald-900 text-xs">
          <Info className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <span>
            <strong>Akses Bebas & Mudah:</strong> Tidak memerlukan NIS, NIM, atau email universitas. Cukup masukkan email umum (seperti Gmail/Yahoo) atau ketik nama/username Anda.
          </span>
        </div>

        {/* Tab 1: LOGIN FORM */}
        {activeTab === 'login' && (
          <div className="space-y-4 mt-3">
            <form onSubmit={handleLoginSubmit} className="space-y-3.5">
              {loginError && (
                <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                  <span>{loginError}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email atau Nama Pengguna
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="Contoh: fatur@gmail.com atau fatur"
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-700">
                    Kata Sandi
                  </label>
                  <span className="text-[11px] text-slate-400">
                    (Bebas / apa saja)
                  </span>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Masukkan kata sandi (opsional)"
                    className="w-full pl-9 pr-10 py-2 text-xs rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? (
                      <EyeOff className="w-3.5 h-3.5" />
                    ) : (
                      <Eye className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-600">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>Ingat saya di perangkat ini</span>
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
              >
                <LogIn className="w-4 h-4" />
                <span>Masuk Sekarang</span>
              </button>
            </form>

            {/* Quick 1-Click Persona Accounts */}
            <div className="pt-3 border-t border-slate-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600">
                  Atau Masuk Cepat 1-Klik:
                </span>
                <span className="text-[10px] text-emerald-700 font-semibold">
                  Langsung Masuk
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {DEMO_ACCOUNTS.map((acc) => {
                  const isCurrent = currentUser?.id === acc.id;
                  return (
                    <button
                      key={acc.id}
                      type="button"
                      onClick={() => handleQuickDemoSelect(acc)}
                      className={`flex items-center gap-2.5 p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                        isCurrent
                          ? 'border-emerald-500 bg-emerald-50/70 ring-1 ring-emerald-400'
                          : 'border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-slate-300'
                      }`}
                    >
                      <img
                        src={acc.avatarUrl}
                        alt={acc.name}
                        className="w-8 h-8 rounded-full object-cover border border-slate-200 shrink-0"
                      />
                      <div className="overflow-hidden">
                        <div className="text-xs font-bold text-slate-900 truncate flex items-center gap-1">
                          <span>{acc.name}</span>
                          {isCurrent && (
                            <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                          )}
                        </div>
                        <div className="text-[10px] text-slate-500 truncate">
                          {acc.email} • {acc.role === 'petugas_tps' ? 'Operator' : acc.role === 'admin_kampus' ? 'Pengelola' : 'Pengguna'}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: REGISTER FORM */}
        {activeTab === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="space-y-3 mt-3">
            {regSuccess ? (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-center space-y-2">
                <Sparkles className="w-8 h-8 text-emerald-600 mx-auto animate-bounce" />
                <div className="font-bold text-sm">Pendaftaran Berhasil!</div>
                <p className="text-xs text-emerald-700">
                  Selamat datang! Bonus +250 Eco-Points telah aktif di akun Anda.
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Nama Lengkap / Panggilan
                    </label>
                    <input
                      type="text"
                      required
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      placeholder="Contoh: Fatur Rahman"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Email atau Username
                    </label>
                    <input
                      type="text"
                      required
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="Contoh: fatur@gmail.com atau fatur"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Kategori Pengguna
                    </label>
                    <select
                      value={regCategory}
                      onChange={(e) => setRegCategory(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none bg-white"
                    >
                      <option value="Warga & Komunitas Umum">Warga & Komunitas Umum</option>
                      <option value="Mahasiswa / Sivitas">Mahasiswa / Sivitas Kampus</option>
                      <option value="Pegiat Lingkungan 3R">Pegiat Lingkungan 3R</option>
                      <option value="Relawan Pemilah">Relawan Pemilah</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Keterangan / Domisili (Opsional)
                    </label>
                    <input
                      type="text"
                      value={regNote}
                      onChange={(e) => setRegNote(e.target.value)}
                      placeholder="Contoh: Tamalanrea / Sekitar Kampus"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Peran Akun
                    </label>
                    <select
                      value={regRole}
                      onChange={(e) => setRegRole(e.target.value as UserRole)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none bg-white"
                    >
                      <option value="mahasiswa">Pengguna / Warga Komunitas</option>
                      <option value="petugas_tps">Relawan / Operator TPS3R</option>
                      <option value="admin_kampus">Pengurus / Admin</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Kata Sandi
                    </label>
                    <input
                      type="password"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="Bebas (contoh: 123456)"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none"
                    />
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200/80 flex items-start gap-2.5 text-xs text-emerald-800">
                  <Sparkles className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    Dapatkan <strong>+250 Eco-Points</strong> langsung saat akun baru terdaftar untuk mulai barter di Bursa Reuse dan berkontribusi.
                  </span>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Daftar & Masuk Langsung</span>
                </button>
              </>
            )}
          </form>
        )}

        {/* Footer info */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <div className="flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-emerald-600" />
            <span>Akses Terbuka & Terenkripsi</span>
          </div>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-800 font-semibold cursor-pointer"
          >
            Lanjutkan sebagai Tamu
          </button>
        </div>
      </div>
    </div>
  );
};
