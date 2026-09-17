import React, { useState, useEffect } from 'react';
import {
  Recycle,
  Leaf,
  LogIn,
  Lock,
  Mail,
  User,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Sun,
  Moon,
  KeyRound,
  Sparkles,
  Layers,
  SlidersHorizontal,
  AlertCircle,
  Eye,
  EyeOff,
  UserCheck,
  Shield,
  Clock,
  MapPin,
  Check,
  HelpCircle,
  Code,
} from 'lucide-react';
import { UserProfile, UserRole } from '../types';
import { DEMO_ACCOUNTS, INITIAL_USER } from '../data/mockData';
import {
  DEV_ACCOUNT_CREDENTIALS,
  DEV_ACCOUNT_PROFILE,
  AUTHORIZED_ACCOUNTS,
  validateCredentials,
  saveRegisteredAccount,
} from '../utils/authAccounts';
import {
  auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  isFirebaseLiveConfigured,
} from '../utils/firebase';

interface LoginGatewayViewProps {
  onLogin: (user: UserProfile) => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  onOpenArchitecture: () => void;
  onOpenSusModal: () => void;
  onOpenPrivacyPolicy: () => void;
}

export const LoginGatewayView: React.FC<LoginGatewayViewProps> = ({
  onLogin,
  theme,
  onToggleTheme,
  onOpenArchitecture,
  onOpenSusModal,
  onOpenPrivacyPolicy,
}) => {
  const [activeTab, setActiveTab] = useState<'login' | 'quick' | 'register' | 'forgot'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Login Form
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockoutTimer, setLockoutTimer] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Register Form
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regFaculty, setRegFaculty] = useState('Fakultas Teknik');
  const [regRole, setRegRole] = useState<UserRole>('mahasiswa');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regError, setRegError] = useState('');

  // Forgot Password
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);

  // Countdown timer for lockout
  useEffect(() => {
    if (lockoutTimer !== null && lockoutTimer > 0) {
      const timer = setTimeout(() => {
        setLockoutTimer((prev) => (prev !== null && prev > 1 ? prev - 1 : null));
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [lockoutTimer]);

  // Password strength calculation
  const getPasswordStrength = (pw: string) => {
    if (!pw) return { score: 0, label: 'Kosong', color: 'bg-slate-300 dark:bg-slate-700' };
    if (pw.length < 6) return { score: 1, label: 'Sangat Lemah (< 6 karakter)', color: 'bg-rose-500' };
    if (pw.length < 8) return { score: 2, label: 'Lemah (< 8 karakter)', color: 'bg-amber-500' };
    const hasLetters = /[a-zA-Z]/.test(pw);
    const hasNumbers = /[0-9]/.test(pw);
    const hasSpecial = /[^a-zA-Z0-9]/.test(pw);
    if (pw.length >= 8 && hasLetters && hasNumbers && hasSpecial) {
      return { score: 4, label: 'Kuat & Aman (Sesuai OWASP)', color: 'bg-emerald-500' };
    }
    if (pw.length >= 8 && hasLetters && hasNumbers) {
      return { score: 3, label: 'Cukup Bagus', color: 'bg-blue-500' };
    }
    return { score: 2, label: 'Sedang', color: 'bg-amber-500' };
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (lockoutTimer !== null && lockoutTimer > 0) {
      setLoginError(`Akun sementara dibatasi demi keamanan. Coba lagi dalam ${lockoutTimer} detik.`);
      return;
    }

    setLoginError('');
    const query = loginIdentifier.trim().toLowerCase();
    if (!query) {
      setLoginError('Silakan masukkan Email, NIM, atau Nama Akun Anda.');
      return;
    }

    if (!loginPassword) {
      setLoginError('Silakan masukkan kata sandi.');
      return;
    }

    setIsLoading(true);

    const rawPass = loginPassword.trim();

    // =========================================================================
    // 1. ATURAN HARDCODE AKUN DEV (WAJIB):
    // Jika email/identifier adalah 'admin' atau 'admin@web.com' dan sandi '12345'
    // maka set localStorage dan arahkan ke Dashboard.
    // =========================================================================
    const isAdminAccount = query === 'admin' || query === 'admin@web.com' || query === 'admin@ecocampus.id';
    const isDevPassword = rawPass === '12345';

    if (isAdminAccount && isDevPassword) {
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('ecocampus_logged_in', 'true');
      localStorage.setItem('ecocampus_user_profile', JSON.stringify(DEV_ACCOUNT_PROFILE));
      setFailedAttempts(0);
      setIsLoading(false);
      onLogin(DEV_ACCOUNT_PROFILE);
      return;
    }

    // Coba otentikasi Firebase hanya jika sudah dikonfigurasi live
    if (isFirebaseLiveConfigured) {
      const emailToUse = query.includes('@') ? query : `${query}@student.unm.ac.id`;
      try {
        const userCredential = await signInWithEmailAndPassword(auth, emailToUse, loginPassword);
        const fbUser = userCredential.user;

        const matched = DEMO_ACCOUNTS.find(
          (u) => u.email.toLowerCase() === fbUser.email?.toLowerCase()
        );

        const loggedUser: UserProfile = matched || {
          id: fbUser.uid,
          name: fbUser.displayName || emailToUse.split('@')[0].replace(/[._-]/g, ' '),
          email: fbUser.email || emailToUse,
          faculty: 'Sivitas Universitas Negeri Makassar (UNM)',
          major: 'Pengguna Terdaftar',
          role: 'mahasiswa',
          ecoPoints: 200,
          xp: 400,
          level: 1,
          currentStreakDays: 1,
          totalWeightDepositedKg: 0,
          avatarUrl:
            fbUser.photoURL ||
            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
          badges: [
            {
              id: 'b_login',
              title: 'Warga Terotentikasi Firebase',
              description: 'Masuk melalui otentikasi Firebase EcoCampus 3R.',
              icon: 'ShieldCheck',
              unlockedAt: new Date().toISOString().split('T')[0],
            },
          ],
        };

        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('ecocampus_logged_in', 'true');
        localStorage.setItem('ecocampus_user_profile', JSON.stringify(loggedUser));
        setFailedAttempts(0);
        setIsLoading(false);
        onLogin(loggedUser);
        return;
      } catch (firebaseErr: any) {
        console.info('Firebase auth attempt info:', firebaseErr?.code || firebaseErr?.message);
      }
    }

    // 2. Validasi Akun Sivitas Terdaftar (Strict Verification)
    const validUser = validateCredentials(loginIdentifier, loginPassword);

    if (validUser) {
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('ecocampus_logged_in', 'true');
      localStorage.setItem('ecocampus_user_profile', JSON.stringify(validUser));
      setFailedAttempts(0);
      setIsLoading(false);
      onLogin(validUser);
      return;
    }

    // 3. JIKA KREDENSIAL SALAH / SELAIN ITU: TOLAK AKSES!
    setIsLoading(false);
    const nextFails = failedAttempts + 1;
    setFailedAttempts(nextFails);

    if (nextFails >= 5) {
      setLockoutTimer(30);
      setLoginError('Terlalu banyak percobaan gagal (5x). Sistem dikunci 30 detik untuk perlindungan keamanan.');
    } else {
      setLoginError(
        'Akses ditolak! Email atau kata sandi salah. Silakan gunakan Akun Dev: email "admin" dan sandi "12345".'
      );
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegError('');

    if (!regName.trim() || !regEmail.trim()) {
      setRegError('Nama Lengkap dan Email wajib diisi.');
      return;
    }

    if (regPassword.length < 8) {
      setRegError('Kata sandi harus minimal 8 karakter demi keamanan data.');
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setRegError('Konfirmasi kata sandi tidak cocok.');
      return;
    }

    setIsLoading(true);
    const emailToUse = regEmail.includes('@') ? regEmail.trim() : `${regEmail.trim()}@student.unm.ac.id`;

    // 1. Coba registrasi ke Firebase Auth SDK (createUserWithEmailAndPassword)
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, emailToUse, regPassword);
      const fbUser = userCredential.user;

      try {
        await updateProfile(fbUser, { displayName: regName.trim() });
      } catch (profileErr) {
        // Abaikan error profil tambahan
      }

      const newUser: UserProfile = {
        id: fbUser.uid,
        name: regName.trim(),
        email: fbUser.email || emailToUse,
        faculty: regFaculty,
        major: 'Mahasiswa / Warga Kampus',
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
            id: 'b_welcome',
            title: 'Warga Baru Terverifikasi Firebase',
            description: 'Berhasil mendaftarkan akun di portal EcoCampus 3R.',
            icon: 'Sparkles',
            unlockedAt: new Date().toISOString().split('T')[0],
          },
        ],
      };

      // Simpan akun terdaftar agar dapat digunakan login kembali
      saveRegisteredAccount(emailToUse, regPassword, newUser);
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('ecocampus_logged_in', 'true');
      localStorage.setItem('ecocampus_user_profile', JSON.stringify(newUser));

      setIsLoading(false);
      onLogin(newUser);
    } catch (fbRegErr: any) {
      console.info('Firebase register attempt info:', fbRegErr?.code || fbRegErr?.message);

      if (isFirebaseLiveConfigured && fbRegErr?.code === 'auth/email-already-in-use') {
        setIsLoading(false);
        setRegError('Email ini sudah terdaftar di Firebase. Silakan gunakan tab Masuk Akun.');
        return;
      }

      // Mode Prototipe / Demo: Buat akun lokal sivitas
      const newUser: UserProfile = {
        id: `usr_reg_${Date.now()}`,
        name: regName.trim(),
        email: emailToUse,
        faculty: regFaculty,
        major: 'Mahasiswa / Warga Kampus',
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
            id: 'b_welcome',
            title: 'Warga Baru Terverifikasi',
            description: 'Berhasil mendaftarkan akun di portal EcoCampus 3R.',
            icon: 'Sparkles',
            unlockedAt: new Date().toISOString().split('T')[0],
          },
        ],
      };

      // Simpan akun ke database lokal
      saveRegisteredAccount(emailToUse, regPassword, newUser);
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('ecocampus_logged_in', 'true');
      localStorage.setItem('ecocampus_user_profile', JSON.stringify(newUser));

      setIsLoading(false);
      onLogin(newUser);
    }
  };

  const handleDemoSelect = (user: UserProfile) => {
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('ecocampus_logged_in', 'true');
    localStorage.setItem('ecocampus_user_profile', JSON.stringify(user));
    onLogin(user);
  };

  const regPwStrength = getPasswordStrength(regPassword);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#0b0f19] text-slate-900 dark:text-slate-100 transition-colors duration-200">
      {/* Top Header Bar */}
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-[#131b2e]/95 backdrop-blur-md border-b border-slate-200/90 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
          {/* Logo & Platform Identity */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 text-white flex items-center justify-center shadow-md shadow-emerald-500/20 font-bold shrink-0">
              <Recycle className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base sm:text-lg tracking-tight text-slate-950 dark:text-white">
                  EcoCampus 3R
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-300/60 dark:border-emerald-700/50">
                  UNM Zero Waste
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block">
                Portal Otentikasi & Sirkularitas Kampus Berkelanjutan
              </p>
            </div>
          </div>

          {/* Quick Header Utility Links */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={onOpenArchitecture}
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#1a233a] hover:bg-slate-100 dark:hover:bg-[#222e4d] text-slate-700 dark:text-slate-300 text-xs font-semibold transition-colors cursor-pointer"
            >
              <Layers className="w-3.5 h-3.5 text-emerald-500" />
              <span>Arsitektur & ERD</span>
            </button>

            <button
              onClick={onOpenSusModal}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#1a233a] hover:bg-slate-100 dark:hover:bg-[#222e4d] text-slate-700 dark:text-slate-300 text-xs font-semibold transition-colors cursor-pointer"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-amber-500" />
              <span>Skor SUS: 88.5 A</span>
            </button>

            {/* Dark / Light Theme Toggle */}
            <button
              onClick={onToggleTheme}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-[#1a233a] hover:bg-slate-200 dark:hover:bg-[#222e4d] text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
              title={theme === 'dark' ? 'Ganti ke Tema Terang' : 'Ganti ke Tema Gelap'}
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-600" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Authentication Hero Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 md:py-12 flex flex-col lg:flex-row gap-8 lg:gap-12 items-center justify-center">
        {/* Left Side: Editorial Presentation & Live Urgency Context */}
        <div className="w-full lg:w-1/2 space-y-6 text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-300 text-xs font-bold">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Sistem Otentikasi Wajib Masuk Dasbor</span>
          </div>

          <div className="space-y-3">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-950 dark:text-white leading-tight">
              Satu Akun untuk Seluruh Aksi <span className="text-emerald-600 dark:text-emerald-400">Sirkularitas Kampus</span>.
            </h1>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
              Silakan masuk dengan akun sivitas akademika Universitas Negeri Makassar (UNM) Anda untuk mengakses Dasbor Pemilahan, Bursa Preloved Kampus, AI Scanner Material, dan Radar TPA Tamangapa.
            </p>
          </div>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3.5 rounded-2xl bg-white dark:bg-[#131b2e] border border-slate-200/90 dark:border-slate-800 shadow-xs">
              <div className="text-lg sm:text-xl font-black text-emerald-600 dark:text-emerald-400">
                1.480+ Kg
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                Residu Dicegah ke TPA
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white dark:bg-[#131b2e] border border-slate-200/90 dark:border-slate-800 shadow-xs">
              <div className="text-lg sm:text-xl font-black text-amber-600 dark:text-amber-400">
                340+ Sivitas
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                Akun Terdaftar
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white dark:bg-[#131b2e] border border-slate-200/90 dark:border-slate-800 shadow-xs">
              <div className="text-lg sm:text-xl font-black text-blue-600 dark:text-blue-400">
                58+ Transaksi
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                Bursa Preloved Berhasil
              </div>
            </div>
          </div>

          {/* Live Context Card TPA Tamangapa */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-rose-500/10 via-amber-500/5 to-transparent border border-rose-200/70 dark:border-rose-900/40 space-y-2">
            <div className="flex items-center gap-2 text-rose-700 dark:text-rose-400 font-extrabold text-xs">
              <MapPin className="w-4 h-4 text-rose-600" />
              <span>Misi Hulu-Hilir: TPA Tamangapa Antang Makassar</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Ketinggian tumpukan sampah di TPA Tamangapa telah mencapai <strong>38,5 meter</strong> dengan pasokan <strong>950 ton/hari</strong>. Lewat EcoCampus 3R, pemilahan organik & bursa barang guna ulang sivitas kampus secara langsung memotong rantai beban sampah kota.
            </p>
          </div>
        </div>

        {/* Right Side: The Authentication Card */}
        <div className="w-full lg:w-1/2 max-w-md">
          <div className="bg-white dark:bg-[#131b2e] border border-slate-200/90 dark:border-slate-800 rounded-3xl shadow-xl overflow-hidden">
            {/* Auth Card Tabs */}
            <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-[#101726]">
              <button
                type="button"
                onClick={() => setActiveTab('login')}
                className={`flex-1 py-3.5 text-xs font-bold text-center border-b-2 transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  activeTab === 'login'
                    ? 'border-emerald-500 text-emerald-700 dark:text-emerald-400 bg-white dark:bg-[#131b2e]'
                    : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
                }`}
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Masuk Akun</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('quick')}
                className={`flex-1 py-3.5 text-xs font-bold text-center border-b-2 transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  activeTab === 'quick'
                    ? 'border-emerald-500 text-emerald-700 dark:text-emerald-400 bg-white dark:bg-[#131b2e]'
                    : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>1-Klik Demo</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('register')}
                className={`flex-1 py-3.5 text-xs font-bold text-center border-b-2 transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  activeTab === 'register'
                    ? 'border-emerald-500 text-emerald-700 dark:text-emerald-400 bg-white dark:bg-[#131b2e]'
                    : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>Daftar Baru</span>
              </button>
            </div>

            <div className="p-6">
              {/* ========================================================= */}
              {/* TAB 1: FORM MASUK AKUN                                    */}
              {/* ========================================================= */}
              {activeTab === 'login' && (
                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  <div>
                    <div className="text-xs font-extrabold text-slate-900 dark:text-white">
                      Selamat Datang Kembali
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Gunakan Akun Dev khusus atau email sivitas terdaftar untuk masuk.
                    </p>
                  </div>

                  {/* Dev Account Notice Banner */}
                  <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-300 dark:border-amber-700/60 text-left space-y-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 text-xs font-extrabold text-amber-900 dark:text-amber-300">
                        <Code className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                        <span>Akun Khusus Pengembang (Dev)</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setLoginIdentifier('admin');
                          setLoginPassword('12345');
                          setLoginError('');
                        }}
                        className="px-2 py-1 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-[10px] font-extrabold transition-all cursor-pointer shadow-xs shrink-0"
                      >
                        Isi Otomatis
                      </button>
                    </div>
                    <p className="text-[11px] text-amber-800 dark:text-amber-300 font-mono">
                      Email/User: <strong>admin</strong> | Sandi: <strong>12345</strong>
                    </p>
                  </div>

                  {loginError && (
                    <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                      <span>{loginError}</span>
                    </div>
                  )}

                  {/* Identifier Input */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                      <span>Email Kampus / NIM / Username</span>
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        value={loginIdentifier}
                        onChange={(e) => setLoginIdentifier(e.target.value)}
                        placeholder="contoh: fathur@student.unm.ac.id atau NIM 220209501045"
                        required
                        className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-[#1a233a] text-slate-900 dark:text-slate-100 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Password Input */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        Kata Sandi
                      </label>
                      <button
                        type="button"
                        onClick={() => setActiveTab('forgot')}
                        className="text-[11px] text-emerald-600 dark:text-emerald-400 hover:underline font-semibold"
                      >
                        Lupa Sandi?
                      </button>
                    </div>
                    <div className="relative">
                      <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        placeholder="Masukkan kata sandi akun"
                        required
                        className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-[#1a233a] text-slate-900 dark:text-slate-100 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Remember Me */}
                  <div className="flex items-center justify-between text-xs pt-1">
                    <label className="flex items-center gap-2 cursor-pointer text-slate-600 dark:text-slate-400 select-none">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                      />
                      <span>Ingat sesi masuk di perangkat ini</span>
                    </label>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 active:scale-[0.99] text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition-all cursor-pointer"
                  >
                    {isLoading ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>Masuk ke Dashboard EcoCampus</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  {/* Quick Pill Selection for Immediate Testing */}
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
                    <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500 text-center">
                      Atau Masuk Cepat Sebagai Akun Uji:
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => handleDemoSelect(DEV_ACCOUNT_PROFILE)}
                        className="p-2 rounded-xl border border-amber-300 dark:border-amber-700/60 bg-amber-50/70 dark:bg-amber-950/30 hover:border-amber-500 text-left transition-all cursor-pointer flex items-center gap-2"
                      >
                        <div className="w-7 h-7 rounded-lg bg-amber-500 text-white flex items-center justify-center font-extrabold text-[10px] shrink-0">
                          DEV
                        </div>
                        <div className="overflow-hidden">
                          <div className="font-bold text-[11px] truncate text-amber-950 dark:text-amber-200">Admin Dev</div>
                          <div className="text-[9px] text-amber-700 dark:text-amber-400 font-medium truncate">
                            admin@web.com
                          </div>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDemoSelect(DEMO_ACCOUNTS[0])}
                        className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#1a233a] hover:border-emerald-500 text-left transition-all cursor-pointer flex items-center gap-2"
                      >
                        <img
                          src={DEMO_ACCOUNTS[0].avatarUrl}
                          alt="Fathur"
                          className="w-7 h-7 rounded-full object-cover shrink-0"
                        />
                        <div className="overflow-hidden">
                          <div className="font-bold text-[11px] truncate">Muh. Fathur</div>
                          <div className="text-[9px] text-emerald-600 dark:text-emerald-400 font-semibold">
                            Mahasiswa
                          </div>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDemoSelect(DEMO_ACCOUNTS[1])}
                        className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#1a233a] hover:border-blue-500 text-left transition-all cursor-pointer flex items-center gap-2"
                      >
                        <img
                          src={DEMO_ACCOUNTS[1].avatarUrl}
                          alt="Daeng Sikki"
                          className="w-7 h-7 rounded-full object-cover shrink-0"
                        />
                        <div className="overflow-hidden">
                          <div className="font-bold text-[11px] truncate">Pak Baharuddin</div>
                          <div className="text-[9px] text-blue-600 dark:text-blue-400 font-semibold">
                            Petugas TPST
                          </div>
                        </div>
                      </button>
                    </div>
                  </div>
                </form>
              )}

              {/* ========================================================= */}
              {/* TAB 2: AKUN CEPAT DEMO (1-KLIK)                           */}
              {/* ========================================================= */}
              {activeTab === 'quick' && (
                <div className="space-y-3">
                  <div>
                    <div className="text-xs font-extrabold text-slate-900 dark:text-white">
                      Pilih Akun Terverifikasi & Dev
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Klik salah satu akun di bawah ini untuk langsung masuk ke dasbor tanpa mengisi formulir.
                    </p>
                  </div>

                  <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                    {/* Kartu Akun Khusus Dev */}
                    <div
                      onClick={() => handleDemoSelect(DEV_ACCOUNT_PROFILE)}
                      className="p-3 rounded-2xl border-2 border-amber-400 dark:border-amber-600 bg-amber-50/60 dark:bg-amber-950/40 hover:bg-amber-100/70 dark:hover:bg-amber-900/50 transition-all cursor-pointer group flex items-center justify-between gap-3 shadow-xs"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-sm">
                          <Code className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                          <div className="font-extrabold text-xs text-amber-950 dark:text-amber-200 truncate group-hover:text-amber-700 dark:group-hover:text-amber-300">
                            {DEV_ACCOUNT_PROFILE.name}
                          </div>
                          <div className="text-[10px] text-amber-800 dark:text-amber-400 truncate">
                            Email: admin@web.com | Sandi: admin123
                          </div>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-200 dark:bg-amber-900 text-amber-900 dark:text-amber-200">
                              Akun Dev Khusus
                            </span>
                            <span className="text-[10px] font-mono text-amber-800 dark:text-amber-300">
                              Akses Penuh
                            </span>
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        className="px-3 py-1.5 rounded-xl bg-amber-600 group-hover:bg-amber-500 text-white font-bold text-[11px] shrink-0 flex items-center gap-1 transition-colors shadow-xs"
                      >
                        <span>Masuk Dev</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                    {DEMO_ACCOUNTS.map((account) => (
                      <div
                        key={account.id}
                        onClick={() => handleDemoSelect(account)}
                        className="p-3 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-emerald-500 dark:hover:border-emerald-500 bg-slate-50/60 dark:bg-[#1a233a]/80 hover:bg-white dark:hover:bg-[#1f2a47] transition-all cursor-pointer group flex items-center justify-between gap-3 shadow-xs"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <img
                            src={account.avatarUrl}
                            alt={account.name}
                            className="w-9 h-9 rounded-full object-cover ring-2 ring-emerald-500/40 shrink-0"
                          />
                          <div className="min-w-0">
                            <div className="font-extrabold text-xs text-slate-900 dark:text-white truncate group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                              {account.name}
                            </div>
                            <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                              {account.faculty}
                            </div>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 capitalize">
                                {account.role}
                              </span>
                              <span className="text-[10px] font-mono text-slate-600 dark:text-slate-300">
                                {account.ecoPoints} Poin
                              </span>
                            </div>
                          </div>
                        </div>

                        <button
                          type="button"
                          className="px-3 py-1.5 rounded-xl bg-emerald-600 group-hover:bg-emerald-500 text-white font-bold text-[11px] shrink-0 flex items-center gap-1 transition-colors"
                        >
                          <span>Masuk</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ========================================================= */}
              {/* TAB 3: FORM REGISTRASI WARGA BARU                         */}
              {/* ========================================================= */}
              {activeTab === 'register' && (
                <form onSubmit={handleRegisterSubmit} className="space-y-3">
                  <div>
                    <div className="text-xs font-extrabold text-slate-900 dark:text-white">
                      Pendaftaran Sivitas Baru
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Dapatkan bonus <strong>+250 EcoPoints</strong> langsung setelah registrasi.
                    </p>
                  </div>

                  {regError && (
                    <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{regError}</span>
                    </div>
                  )}

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                      Nama Lengkap
                    </label>
                    <input
                      type="text"
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      placeholder="Nama lengkap sivitas"
                      required
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-[#1a233a] text-xs text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                      Email Kampus / Akun
                    </label>
                    <input
                      type="email"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="email@student.unm.ac.id atau email pribadi"
                      required
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-[#1a233a] text-xs text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                        Peran
                      </label>
                      <select
                        value={regRole}
                        onChange={(e) => setRegRole(e.target.value as UserRole)}
                        className="w-full px-2.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-[#1a233a] text-xs text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      >
                        <option value="mahasiswa">Mahasiswa</option>
                        <option value="dosen">Dosen / Peneliti</option>
                        <option value="petugas">Petugas TPST</option>
                        <option value="pengelola_kantin">Pengelola Kantin</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                        Fakultas / Unit
                      </label>
                      <select
                        value={regFaculty}
                        onChange={(e) => setRegFaculty(e.target.value)}
                        className="w-full px-2.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-[#1a233a] text-xs text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      >
                        <option value="Fakultas Teknik">Fakultas Teknik (FT UNM)</option>
                        <option value="Fakultas MIPA">Fakultas MIPA (FMIPA UNM)</option>
                        <option value="Fakultas Ilmu Pendidikan">Fakultas Ilmu Pendidikan (FIP UNM)</option>
                        <option value="Fakultas Bahasa & Sastra">Fakultas Bahasa & Sastra (FBS UNM)</option>
                        <option value="Fakultas Seni & Desain">Fakultas Seni & Desain (FSD UNM)</option>
                        <option value="Fakultas Ilmu Keolahragaan & Kesehatan">Fakultas Ilmu Keolahragaan & Kesehatan (FIKK UNM)</option>
                        <option value="Fakultas Ekonomi & Bisnis">Fakultas Ekonomi & Bisnis (FEB UNM)</option>
                        <option value="Fakultas Ilmu Sosial & Hukum">Fakultas Ilmu Sosial & Hukum (FISH UNM)</option>
                        <option value="Fakultas Psikologi">Fakultas Psikologi (FPsi UNM)</option>
                        <option value="Unit Pengelola Kampus">Pusat Green Campus UNM</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                      Kata Sandi (min. 8 karakter)
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        placeholder="Minimal 8 karakter"
                        required
                        className="w-full px-3 py-2 pr-9 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-[#1a233a] text-xs text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400"
                      >
                        {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                    {regPassword && (
                      <div className="flex items-center justify-between text-[10px] pt-0.5">
                        <span className="text-slate-400">Kekuatan: {regPwStrength.label}</span>
                        <div className="w-20 h-1.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                          <div
                            className={`h-full ${regPwStrength.color}`}
                            style={{ width: `${(regPwStrength.score / 4) * 100}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                      Konfirmasi Kata Sandi
                    </label>
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={regConfirmPassword}
                      onChange={(e) => setRegConfirmPassword(e.target.value)}
                      placeholder="Ulangi kata sandi"
                      required
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-[#1a233a] text-xs text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-2.5 mt-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
                  >
                    {isLoading ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        <span>Daftar & Masuk ke Dashboard</span>
                      </>
                    )}
                  </button>
                </form>
              )}

              {/* ========================================================= */}
              {/* TAB 4: LUPA KATA SANDI                                    */}
              {/* ========================================================= */}
              {activeTab === 'forgot' && (
                <div className="space-y-3">
                  <div>
                    <div className="text-xs font-extrabold text-slate-900 dark:text-white">
                      Pemulihan Akun
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Masukkan alamat email terdaftar untuk menerima tautan reset kata sandi.
                    </p>
                  </div>

                  {forgotSent ? (
                    <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 space-y-2 text-center">
                      <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                      <div className="text-xs font-bold text-emerald-800 dark:text-emerald-300">
                        Tautan Pemulihan Terkirim!
                      </div>
                      <p className="text-[11px] text-emerald-700 dark:text-emerald-400">
                        Instruksi telah dikirim ke <strong>{forgotEmail}</strong>. Silakan periksa kotak masuk atau spam.
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          setForgotSent(false);
                          setActiveTab('login');
                        }}
                        className="mt-2 px-4 py-1.5 rounded-xl bg-emerald-600 text-white font-bold text-xs"
                      >
                        Kembali ke Masuk Akun
                      </button>
                    </div>
                  ) : (
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        if (forgotEmail.trim()) {
                          setForgotSent(true);
                        }
                      }}
                      className="space-y-3"
                    >
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                          Email Terdaftar
                        </label>
                        <input
                          type="email"
                          value={forgotEmail}
                          onChange={(e) => setForgotEmail(e.target.value)}
                          placeholder="email@student.unm.ac.id"
                          required
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-[#1a233a] text-xs text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                        />
                      </div>

                      <div className="flex items-center gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => setActiveTab('login')}
                          className="flex-1 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800"
                        >
                          Batal
                        </button>
                        <button
                          type="submit"
                          className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
                        >
                          Kirim Tautan Reset
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              )}
            </div>

            {/* Security Guarantee Banner */}
            <div className="p-3 bg-slate-50 dark:bg-[#101726] border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-center gap-2">
              <Shield className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>Sesi terenkripsi & kepatuhan UU Pelindungan Data Pribadi No. 27/2022</span>
            </div>
          </div>
        </div>
      </main>

      {/* Footer Links */}
      <footer className="mt-auto border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131b2e] py-4 text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center gap-2 text-[11px]">
            <Leaf className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>EcoCampus 3R • Inisiatif Sirkularitas & Reduksi Sampah Universitas Negeri Makassar (UNM)</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <button
              onClick={onOpenPrivacyPolicy}
              className="hover:underline text-slate-600 dark:text-slate-400"
            >
              Kebijakan Privasi
            </button>
            <span>•</span>
            <button
              onClick={onOpenArchitecture}
              className="hover:underline text-slate-600 dark:text-slate-400"
            >
              Arsitektur Sistem
            </button>
            <span>•</span>
            <button
              onClick={onOpenSusModal}
              className="hover:underline text-slate-600 dark:text-slate-400"
            >
              Evaluasi Usability (SUS)
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};
