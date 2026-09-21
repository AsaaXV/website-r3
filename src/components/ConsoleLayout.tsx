import React, { useState, useRef, useEffect } from 'react';
import {
  Recycle,
  ShoppingBag,
  Camera,
  MapPin,
  BookOpen,
  Award,
  ShieldCheck,
  Search,
  Sun,
  Moon,
  MessageSquare,
  Coins,
  ChevronDown,
  User,
  LogOut,
  LogIn,
  Sparkles,
  Layers,
  Menu,
  X,
  UserCheck,
  HelpCircle,
  Flame,
  Radio,
  SlidersHorizontal,
  LayoutDashboard,
  FileText,
  TrendingDown,
} from 'lucide-react';
import { UserProfile, ReuseItem } from '../types';
import { ConsoleRightSidebar } from './ConsoleRightSidebar';

interface ConsoleLayoutProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentUser: UserProfile;
  isLoggedIn: boolean;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  unreadMessagesCount: number;
  onOpenInbox: () => void;
  onOpenMyProfile: () => void;
  onOpenRoleModal?: () => void;
  onOpenRoleApplicationModal?: () => void;
  onOpenSurveyModal?: () => void;
  activeSurveysCount?: number;
  totalManagedSurveysCount?: number;
  onOpenSusModal?: () => void;
  onOpenAuthModal: (mode: 'login' | 'register') => void;
  onLogout: () => void;
  onOpenOnboarding: () => void;
  onOpenArchitecture?: () => void;
  onOpenChat: (sellerName: string, item?: ReuseItem) => void;
  children: React.ReactNode;
}

export const ConsoleLayout: React.FC<ConsoleLayoutProps> = ({
  activeTab,
  setActiveTab,
  currentUser,
  isLoggedIn,
  theme,
  onToggleTheme,
  unreadMessagesCount,
  onOpenInbox,
  onOpenMyProfile,
  onOpenRoleModal,
  onOpenRoleApplicationModal,
  onOpenSurveyModal,
  activeSurveysCount = 0,
  totalManagedSurveysCount = 0,
  onOpenSusModal,
  onOpenAuthModal,
  onLogout,
  onOpenOnboarding,
  onOpenArchitecture,
  onOpenChat,
  children,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showRightSidebar, setShowRightSidebar] = useState(true);
  const profileDropdownRef = useRef<HTMLDivElement>(null);

  // Close profile dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(e.target as Node)
      ) {
        setIsProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navMenuItems = [
    {
      id: 'dashboard',
      label: 'Pusat 3R Kampus',
      icon: Recycle,
      badge: null,
    },
    {
      id: 'reduce',
      label: '1. Aksi Reduce',
      icon: TrendingDown,
      badge: 'Cegah Sampah',
      badgeColor: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300',
    },
    {
      id: 'komunitas',
      label: '2. Bursa Reuse',
      icon: ShoppingBag,
      badge: 'Preloved',
      badgeColor: 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300',
    },
    {
      id: 'scanner',
      label: '3. Recycle AI',
      icon: Camera,
      badge: 'Gemini AI',
      badgeColor: 'bg-sky-100 text-sky-800 dark:bg-sky-950/80 dark:text-sky-300',
    },
    {
      id: 'edukasi',
      label: 'Pedoman 3R & Karbon',
      icon: BookOpen,
      badge: null,
    },
    {
      id: 'gamification',
      label: 'Tantangan & Klasemen',
      icon: Award,
      badge: `${currentUser.ecoPoints} Pts`,
      badgeColor: 'bg-blue-100 text-blue-800 dark:bg-blue-950/80 dark:text-blue-300',
    },
    {
      id: 'ledger',
      label: 'Buku Kas & Audit TPS',
      icon: ShieldCheck,
      badge: null,
    },
    ...(currentUser.role === 'admin_kampus' || currentUser.role === 'admin'
      ? [
          {
            id: 'admin',
            label: 'Admin Dashboard',
            icon: LayoutDashboard,
            badge: 'Pusat Kendali',
            badgeColor: 'bg-purple-100 text-purple-800 dark:bg-purple-950/80 dark:text-purple-300',
          },
        ]
      : []),
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    // Route smartly based on query keywords
    const q = searchQuery.toLowerCase();
    if (q.includes('buku') || q.includes('kardus') || q.includes('preloved') || q.includes('beli') || q.includes('barter')) {
      setActiveTab('komunitas');
    } else if (q.includes('scan') || q.includes('kamera') || q.includes('foto') || q.includes('ai')) {
      setActiveTab('scanner');
    } else if (q.includes('tpa') || q.includes('peta') || q.includes('drop box') || q.includes('lokasi')) {
      setActiveTab('fasilitas');
    } else if (q.includes('edukasi') || q.includes('sampah') || q.includes('karbon') || q.includes('pedoman')) {
      setActiveTab('edukasi');
    } else if (q.includes('tantangan') || q.includes('klasemen') || q.includes('peringkat') || q.includes('poin') || q.includes('streak') || q.includes('lencana')) {
      setActiveTab('gamification');
    } else {
      setActiveTab('komunitas');
    }
  };

  return (
    <div className="min-h-screen bg-slate-100/70 dark:bg-[#0b0f19] text-slate-900 dark:text-slate-100 font-sans transition-colors duration-200 flex flex-col">
      {/* ========================================================================= */}
      {/* 1. TOP HEADER BAR (Modern Console Topbar with Search, Theme, & User Pill) */}
      {/* ========================================================================= */}
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-[#111827]/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 px-4 sm:px-6 py-3 transition-colors">
        <div className="max-w-7xl 2xl:max-w-[1600px] mx-auto flex items-center justify-between gap-3 sm:gap-6">
          {/* Left: Mobile Hamburger & Brand Title */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              aria-label="Buka Menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <div
              onClick={() => setActiveTab('dashboard')}
              className="flex items-center gap-2.5 cursor-pointer group"
              id="brand-logo-btn"
            >
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-emerald-600 group-hover:bg-emerald-500 text-white flex items-center justify-center font-black shadow-md shadow-emerald-600/30 transition-all group-hover:scale-105">
                <Recycle className="w-5 h-5 group-hover:rotate-45 transition-transform duration-300" />
              </div>
              <div className="leading-tight">
                <div className="flex items-center gap-1.5">
                  <span className="font-black text-slate-900 dark:text-white tracking-tight text-base sm:text-lg">
                    EcoCampus
                  </span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-black bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                    3R
                  </span>
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium hidden sm:block">
                  Sistem Sirkularitas & Reduksi Sampah UNM
                </div>
              </div>
            </div>
          </div>

          {/* Middle: Global Search Input (Inspired by reference search bar) */}
          <div className="flex-1 max-w-md hidden md:block">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari barang bursa, panduan pilah, atau drop box..."
                className="w-full pl-9 pr-20 py-2 rounded-xl bg-slate-100 dark:bg-[#1a233a] border border-slate-200 dark:border-slate-700/80 text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:bg-white dark:focus:bg-[#131b2e] transition-all"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <button
                type="submit"
                className="absolute right-1.5 top-1 px-2 py-1 rounded-lg bg-emerald-600 text-white font-bold text-[10px] hover:bg-emerald-500 transition-colors cursor-pointer"
              >
                Cari
              </button>
            </form>
          </div>

          {/* Right: Theme Toggle, Eco Points, Chat & User Profile Pill */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Theme Toggle Button (Light / Dark) */}
            <button
              onClick={onToggleTheme}
              className="p-2 rounded-xl bg-slate-100 dark:bg-[#1a233a] text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all cursor-pointer"
              title={`Ganti ke mode ${theme === 'dark' ? 'Terang (Siang)' : 'Gelap (Malam)'}`}
              id="theme-toggle-btn"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400 animate-spin-slow" />
              ) : (
                <Moon className="w-4 h-4 text-slate-600" />
              )}
            </button>

            {/* Eco Points Badge */}
            <div
              onClick={() => setActiveTab('gamification')}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/70 text-emerald-800 dark:text-emerald-300 text-xs font-bold cursor-pointer hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-colors"
              title="Saldo Eco-Poin Anda"
            >
              <Coins className="w-3.5 h-3.5 text-amber-500" />
              <span>{currentUser.ecoPoints}</span>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-normal">
                Poin
              </span>
            </div>

            {/* Inbox / Chat Notification Button */}
            <button
              onClick={onOpenInbox}
              className="relative p-2 rounded-xl bg-slate-100 dark:bg-[#1a233a] text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
              title="Pesan & Komunikasi Antar-Pengguna"
              id="inbox-notification-btn"
            >
              <MessageSquare className="w-4 h-4" />
              {unreadMessagesCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white font-black text-[9px] flex items-center justify-center animate-pulse">
                  {unreadMessagesCount}
                </span>
              )}
            </button>

            {/* User Profile Pill & Dropdown */}
            <div className="relative" ref={profileDropdownRef}>
              {isLoggedIn ? (
                <button
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  className="flex items-center gap-2 p-1 sm:pl-2 sm:pr-3 rounded-full sm:rounded-xl bg-slate-100 dark:bg-[#1a233a] hover:bg-slate-200 dark:hover:bg-slate-700/80 border border-slate-200 dark:border-slate-700 transition-all cursor-pointer"
                >
                  <img
                    src={currentUser.avatarUrl}
                    alt={currentUser.name}
                    className="w-7 h-7 rounded-full object-cover ring-2 ring-emerald-500"
                  />
                  <div className="hidden sm:block text-left text-xs leading-tight">
                    <div className="font-bold text-slate-900 dark:text-slate-100 max-w-[100px] truncate">
                      {currentUser.name}
                    </div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 capitalize">
                      {currentUser.role}
                    </div>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
                </button>
              ) : (
                <button
                  onClick={() => onOpenAuthModal('login')}
                  className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Masuk Akun</span>
                </button>
              )}

              {/* Profile Dropdown Menu */}
              {isProfileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white dark:bg-[#131b2e] border border-slate-200 dark:border-slate-800 shadow-2xl py-2 z-50 text-xs space-y-1 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800">
                    <div className="font-bold text-slate-900 dark:text-slate-100 truncate">
                      {currentUser.name}
                    </div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400">
                      {currentUser.faculty} • Level {currentUser.level}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setIsProfileDropdownOpen(false);
                      onOpenMyProfile();
                    }}
                    className="w-full px-3 py-2 text-left hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2.5 text-slate-700 dark:text-slate-200"
                  >
                    <User className="w-4 h-4 text-emerald-500" />
                    <span>Lihat Profil Publik Saya</span>
                  </button>

                  {onOpenRoleApplicationModal && (
                    <button
                      onClick={() => {
                        setIsProfileDropdownOpen(false);
                        onOpenRoleApplicationModal();
                      }}
                      className="w-full px-3 py-2 text-left hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2.5 text-slate-700 dark:text-slate-200"
                    >
                      <UserCheck className="w-4 h-4 text-blue-500" />
                      <span>Ajukan Perubahan Peran</span>
                    </button>
                  )}

                  <div className="border-t border-slate-100 dark:border-slate-800 my-1" />

                  <button
                    onClick={() => {
                      setIsProfileDropdownOpen(false);
                      onLogout();
                    }}
                    className="w-full px-3 py-2 text-left hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-600 dark:text-rose-400 flex items-center gap-2.5 font-bold"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Keluar Akun</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 2. MAIN 3-COLUMN CONSOLE BODY (Sidebar Rail + Center Canvas + Live Hub)   */}
      {/* ========================================================================= */}
      <div className="flex-1 max-w-7xl 2xl:max-w-[1600px] w-full mx-auto px-4 sm:px-6 py-5 flex gap-5 items-start">
        {/* ======================================================================= */}
        {/* COLUMN 1: LEFT NAVIGATION RAIL (Inspired by Sidebar in Reference)       */}
        {/* ======================================================================= */}
        <nav className="hidden lg:flex w-56 2xl:w-64 shrink-0 flex-col gap-5 sticky top-20 select-none">
          {/* Menu Card */}
          <div className="rounded-2xl bg-white dark:bg-[#131b2e] border border-slate-200/90 dark:border-slate-800 shadow-sm p-3 space-y-1">
            <div className="px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Navigasi Utama
            </div>

            {navMenuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                    isActive
                      ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#1a233a]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon
                      className={`w-4 h-4 ${
                        isActive ? 'text-slate-950' : 'text-slate-500 dark:text-slate-400'
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span
                      className={`px-1.5 py-0.5 rounded text-[9px] font-black ${
                        isActive
                          ? 'bg-slate-950 text-emerald-300'
                          : item.badgeColor || 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Quick Utility Box: ALAT RISET */}
          <div className="rounded-2xl bg-white dark:bg-[#131b2e] border border-slate-200/90 dark:border-slate-800 shadow-sm p-3 space-y-2 text-xs">
            <div className="px-2 text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Alat Riset
            </div>

            {currentUser.role === 'admin_kampus' || currentUser.role === 'admin' ? (
              <button
                onClick={() => setActiveTab('admin')}
                className="w-full px-3 py-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 text-slate-800 dark:text-slate-100 flex items-center justify-between transition-all cursor-pointer group shadow-xs"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                    <FileText className="w-3.5 h-3.5" />
                  </div>
                  <div className="text-left">
                    <div className="font-bold text-xs group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                      Survei
                    </div>
                    <div className="text-[10px] text-emerald-700 dark:text-emerald-300 font-medium">
                      {totalManagedSurveysCount} Survei dikelola
                    </div>
                  </div>
                </div>
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
              </button>
            ) : activeSurveysCount > 0 ? (
              <button
                onClick={onOpenSurveyModal}
                className="w-full px-3 py-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 text-slate-800 dark:text-slate-100 flex items-center justify-between transition-all cursor-pointer group shadow-xs"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                    <FileText className="w-3.5 h-3.5" />
                  </div>
                  <div className="text-left">
                    <div className="font-bold text-xs group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                      Survei
                    </div>
                    <div className="text-[10px] text-emerald-700 dark:text-emerald-300 font-medium">
                      {activeSurveysCount} Survei tersedia
                    </div>
                  </div>
                </div>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              </button>
            ) : (
              <div className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#1a233a] border border-slate-100 dark:border-slate-800/80 text-slate-500 dark:text-slate-400 text-left">
                <div className="flex items-center gap-2 font-medium text-[11px] text-slate-700 dark:text-slate-300">
                  <FileText className="w-3.5 h-3.5 text-slate-400" />
                  <span>Survei</span>
                </div>
                <div className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">
                  Tidak ada survei tersedia.
                </div>
              </div>
            )}

            <div className="border-t border-slate-100 dark:border-slate-800 my-1" />

            <button
              onClick={onLogout}
              className="w-full px-2.5 py-1.5 rounded-xl bg-rose-50/70 dark:bg-rose-950/30 hover:bg-rose-100 dark:hover:bg-rose-900/50 text-rose-600 dark:text-rose-400 flex items-center justify-between text-[11px] font-bold transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <LogOut className="w-3.5 h-3.5" />
                <span>Keluar Akun</span>
              </div>
              <span className="text-[10px] opacity-75">Tutup Sesi</span>
            </button>
          </div>
        </nav>

        {/* Mobile Slide-out Menu (when hamburger is open) */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            <div
              className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <div className="relative w-4/5 max-w-xs bg-white dark:bg-[#131b2e] h-full shadow-2xl p-5 flex flex-col justify-between overflow-y-auto z-10">
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                  <span className="font-black text-slate-900 dark:text-white">
                    EcoCampus 3R Menu
                  </span>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-1">
                  {navMenuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          setActiveTab(item.id);
                          setIsMobileMenuOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-bold text-xs ${
                          isActive
                            ? 'bg-emerald-500 text-slate-950'
                            : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <Icon className="w-4 h-4" />
                          <span>{item.label}</span>
                        </div>
                        {item.badge && (
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-black bg-slate-200 dark:bg-slate-700">
                            {item.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-2">
                {currentUser.role === 'admin_kampus' || currentUser.role === 'admin' ? (
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      setActiveTab('admin');
                    }}
                    className="w-full py-2.5 px-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-bold flex items-center justify-between"
                  >
                    <span className="flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      <span>Survei Dikelola</span>
                    </span>
                    <span className="px-1.5 py-0.5 rounded bg-emerald-500 text-slate-950 text-[10px]">
                      {totalManagedSurveysCount} Dikelola
                    </span>
                  </button>
                ) : activeSurveysCount > 0 ? (
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      onOpenSurveyModal?.();
                    }}
                    className="w-full py-2.5 px-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-bold flex items-center justify-between"
                  >
                    <span className="flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      <span>Survei Tersedia</span>
                    </span>
                    <span className="px-1.5 py-0.5 rounded bg-emerald-500 text-slate-950 text-[10px]">
                      {activeSurveysCount} Tersedia
                    </span>
                  </button>
                ) : (
                  <div className="py-2 px-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-slate-400 text-xs flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    <span>Tidak ada survei tersedia</span>
                  </div>
                )}
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onLogout();
                  }}
                  className="w-full py-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 text-xs font-bold flex items-center justify-center gap-1.5"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Keluar Akun</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================================= */}
        {/* COLUMN 2: CENTER CANVAS / DYNAMIC WORKSPACE (The Core Feed & Content)  */}
        {/* ======================================================================= */}
        <main className="flex-1 min-w-0">{children}</main>

        {/* ======================================================================= */}
        {/* COLUMN 3: RIGHT SIDEBAR (Live TPA Status, Online Friends & Groups)      */}
        {/* ======================================================================= */}
        <div className="hidden xl:block shrink-0 sticky top-20">
          <ConsoleRightSidebar
            currentUser={currentUser}
            onOpenChat={onOpenChat}
            onOpenInbox={onOpenInbox}
            onNavigate={setActiveTab}
            unreadCount={unreadMessagesCount}
          />
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. CONSOLE FOOTER                                                         */}
      {/* ========================================================================= */}
      <footer className="mt-auto border-t border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-[#111827]/80 py-6 text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold">
              <Recycle className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className="font-bold text-slate-800 dark:text-slate-200">
                EcoCampus 3R • Console Sirkularitas Kampus
              </span>
              <span className="text-slate-400 dark:text-slate-500 ml-2 hidden sm:inline">
                Terhubung dengan Bank Sampah & TPA Tamangapa
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-[11px]">
            <button
              onClick={onOpenOnboarding}
              className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Panduan Fitur</span>
            </button>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <span className="text-slate-400 dark:text-slate-500 font-medium">
              Sistem Terverifikasi Akademik UNM 2026
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};
