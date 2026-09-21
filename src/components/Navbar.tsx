import React, { useState, useRef, useEffect } from 'react';
import {
  Recycle,
  Flame,
  Coins,
  MapPin,
  Camera,
  Scale,
  Award,
  ShieldCheck,
  ClipboardCheck,
  User,
  Wifi,
  ChevronDown,
  BookOpen,
  Users,
  MessageSquare,
  LogIn,
  LogOut,
  UserPlus,
  RefreshCw,
  Sparkles,
  Layers,
} from 'lucide-react';
import { UserProfile } from '../types';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentUser: UserProfile;
  isLoggedIn: boolean;
  onOpenRoleModal: () => void;
  onOpenSusModal: () => void;
  onOpenAuthModal: (mode: 'login' | 'register') => void;
  onLogout: () => void;
  onOpenInbox: () => void;
  onOpenMyProfile: () => void;
  onOpenOnboarding: () => void;
  onOpenArchitecture: () => void;
  unreadMessagesCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  currentUser,
  isLoggedIn,
  onOpenRoleModal,
  onOpenSusModal,
  onOpenAuthModal,
  onLogout,
  onOpenInbox,
  onOpenMyProfile,
  onOpenOnboarding,
  onOpenArchitecture,
  unreadMessagesCount,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navItems = [
    { id: 'edukasi', label: 'Edukasi & Belajar', icon: BookOpen },
    { id: 'scanner', label: 'Scan AI Material', icon: Camera },
    { id: 'dashboard', label: 'Beranda & Aksi', icon: Recycle },
    { id: 'fasilitas', label: 'Peta TPA & Limbah Akhir', icon: MapPin },
    { id: 'komunitas', label: 'Bursa Reuse & Komunitas', icon: Users },
    { id: 'ledger', label: 'Transparansi & Verifikasi', icon: ShieldCheck },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div 
              onClick={() => setActiveTab('dashboard')}
              className="flex items-center gap-2.5 cursor-pointer group"
              id="brand-logo"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-600 group-hover:bg-emerald-700 transition-colors flex items-center justify-center text-white shadow-md shadow-emerald-600/20">
                <Recycle className="w-5 h-5 group-hover:rotate-45 transition-transform duration-300" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-slate-900 tracking-tight text-base sm:text-lg">
                    EcoCampus
                  </span>
                  <span className="px-1.5 py-0.5 rounded text-[11px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                    3R
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
                  Platform Edukasi, Reduksi & Sirkularitas Kampus
                </p>
              </div>
            </div>
          </div>

          {/* Center Navigation - Desktop */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-${item.id}`}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/25'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action Widgets */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Streak & Eco-Points Pill (If logged in) */}
            {isLoggedIn ? (
              <div className="flex items-center gap-2 bg-slate-100/90 border border-slate-200/80 px-2.5 py-1.5 rounded-full text-xs">
                <div 
                  className="flex items-center gap-1 text-amber-600 font-bold"
                  title={`${currentUser.currentStreakDays} Minggu Streak Berkelanjutan`}
                >
                  <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                  <span>{currentUser.currentStreakDays}w</span>
                </div>
                <div className="h-3 w-px bg-slate-300"></div>
                <div 
                  onClick={() => setActiveTab('gamification')}
                  className="flex items-center gap-1 text-emerald-700 font-bold cursor-pointer hover:text-emerald-800"
                  title="Saldo Eco-Points Anda. Klik untuk lihat klasemen & tantangan."
                  id="eco-points-badge"
                >
                  <Coins className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{currentUser.ecoPoints.toLocaleString('id-ID')}</span>
                  <span className="text-[10px] text-slate-500 font-normal">pts</span>
                </div>
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-1 px-2.5 py-1 bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold rounded-full">
                <span>Mode Tamu</span>
              </div>
            )}

            {/* Tour & Onboarding Button */}
            <button
              onClick={onOpenOnboarding}
              id="navbar-onboarding-btn"
              title="Panduan Cepat & Tur Fitur EcoCampus"
              className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-lg hover:bg-emerald-100 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span className="hidden sm:inline">Panduan</span>
            </button>

            {/* Inter-User Message Inbox Button */}
            <button
              onClick={onOpenInbox}
              id="navbar-inbox-btn"
              title="Pusat Pesan & Obrolan Antar-Pengguna"
              className="relative p-2 rounded-xl text-slate-600 bg-slate-100 hover:bg-slate-200 hover:text-slate-900 transition-colors"
            >
              <MessageSquare className="w-4 h-4 text-emerald-700" />
              {unreadMessagesCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-rose-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center ring-2 ring-white">
                  {unreadMessagesCount}
                </span>
              )}
            </button>

            {/* SUS Questionnaire Button */}
            <button
              onClick={onOpenSusModal}
              id="sus-evaluation-btn"
              title="Evaluasi System Usability Scale (SUS)"
              className="hidden lg:flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:text-slate-900 transition-colors"
            >
              <ClipboardCheck className="w-3.5 h-3.5 text-indigo-600" />
              <span>Skor SUS</span>
            </button>

            {/* User Account / Login State */}
            {isLoggedIn ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  id="user-profile-menu-btn"
                  className="flex items-center gap-2 p-1 pl-1.5 pr-2.5 rounded-full border border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50 transition-all text-left group shadow-2xs"
                >
                  <img
                    src={currentUser.avatarUrl}
                    alt={currentUser.name}
                    className="w-7 h-7 rounded-full object-cover border border-emerald-500/40"
                  />
                  <div className="hidden sm:block">
                    <div className="text-[11px] font-bold text-slate-900 leading-tight flex items-center gap-1">
                      <span className="truncate max-w-[100px]">{currentUser.name.split(' ')[0]}</span>
                      <ChevronDown className="w-3 h-3 text-slate-400 group-hover:text-slate-600" />
                    </div>
                    <div className="text-[9px] text-slate-500 uppercase tracking-wider font-semibold">
                      {currentUser.role === 'mahasiswa' ? 'Mahasiswa' : currentUser.role === 'petugas_tps' ? 'Operator TPS' : 'Admin'}
                    </div>
                  </div>
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-3.5 py-2.5 border-b border-slate-100">
                      <div className="font-bold text-xs text-slate-900 truncate">{currentUser.name}</div>
                      <div className="text-[11px] text-slate-500 truncate">{currentUser.email}</div>
                      <div className="text-[10px] text-emerald-700 font-semibold mt-1">
                        {currentUser.faculty}
                      </div>
                    </div>

                    <div className="py-1">
                      <button
                        onClick={() => {
                          setIsDropdownOpen(false);
                          onOpenMyProfile();
                        }}
                        className="w-full px-3.5 py-2 text-left text-xs text-slate-700 hover:bg-emerald-50 hover:text-emerald-800 flex items-center gap-2 font-medium"
                      >
                        <User className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Profil & Reputasi Saya</span>
                      </button>

                      <button
                        onClick={() => {
                          setIsDropdownOpen(false);
                          onOpenInbox();
                        }}
                        className="w-full px-3.5 py-2 text-left text-xs text-slate-700 hover:bg-emerald-50 hover:text-emerald-800 flex items-center justify-between font-medium"
                      >
                        <div className="flex items-center gap-2">
                          <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Pesan Antar-Pengguna</span>
                        </div>
                        {unreadMessagesCount > 0 && (
                          <span className="px-1.5 py-0.2 bg-rose-500 text-white rounded-full text-[9px] font-bold">
                            {unreadMessagesCount}
                          </span>
                        )}
                      </button>

                      <button
                        onClick={() => {
                          setIsDropdownOpen(false);
                          onOpenRoleModal();
                        }}
                        className="w-full px-3.5 py-2 text-left text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2 font-medium"
                      >
                        <RefreshCw className="w-3.5 h-3.5 text-indigo-600" />
                        <span>Ganti Akun Demo (Role)</span>
                      </button>

                      <button
                        onClick={() => {
                          setIsDropdownOpen(false);
                          onOpenArchitecture();
                        }}
                        className="w-full px-3.5 py-2 text-left text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2 font-medium"
                      >
                        <Layers className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Dokumen Arsitektur & ERD</span>
                      </button>
                    </div>

                    <div className="pt-1 border-t border-slate-100">
                      <button
                        onClick={() => {
                          setIsDropdownOpen(false);
                          onLogout();
                        }}
                        className="w-full px-3.5 py-2 text-left text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2 font-semibold"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Keluar / Logout</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => onOpenAuthModal('login')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs shadow-emerald-600/20 transition-all"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Masuk</span>
                </button>
                <button
                  onClick={() => onOpenAuthModal('register')}
                  className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-slate-200 hover:border-slate-300 text-slate-700 text-xs font-semibold bg-white hover:bg-slate-50 transition-all"
                >
                  <UserPlus className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Daftar</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Navigation Bar */}
        <div className="flex md:hidden overflow-x-auto py-2 space-x-1.5 scrollbar-none border-t border-slate-100">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`mobile-nav-${item.id}`}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold shrink-0 ${
                  isActive
                    ? 'bg-emerald-600 text-white'
                    : 'text-slate-600 bg-slate-100 hover:bg-slate-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
