import React from 'react';
import {
  Mountain,
  AlertTriangle,
  Radio,
  Users,
  MessageSquare,
  Flame,
  CheckCircle2,
  MapPin,
  Sparkles,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import { UserProfile, ReuseItem } from '../types';

interface ConsoleRightSidebarProps {
  currentUser: UserProfile;
  onOpenChat: (sellerName: string, item?: ReuseItem) => void;
  onOpenInbox: () => void;
  onNavigate: (tab: string) => void;
  unreadCount: number;
}

interface OnlinePeer {
  id: string;
  name: string;
  avatar: string;
  major: string;
  streakDays: number;
  ecoPoints: number;
  statusText: string;
  isOnline: boolean;
}

const PEERS_ONLINE: OnlinePeer[] = [
  {
    id: 'peer_1',
    name: 'Ahmad Fauzi',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
    major: 'Teknik Sipil 22',
    streakDays: 14,
    ecoPoints: 850,
    statusText: 'Mendonasi Buku Kalkulus',
    isOnline: true,
  },
  {
    id: 'peer_2',
    name: 'Nurul Hidayah',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
    major: 'Arsitektur 21',
    streakDays: 8,
    ecoPoints: 620,
    statusText: 'Barter Meja Gambar A2',
    isOnline: true,
  },
  {
    id: 'peer_3',
    name: 'Pak Joko',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    major: 'Petugas TPST Kampus',
    streakDays: 30,
    ecoPoints: 1420,
    statusText: 'Standby Penimbangan',
    isOnline: true,
  },
  {
    id: 'peer_4',
    name: 'Rian Pratama',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    major: 'MIPA Kimia 23',
    streakDays: 5,
    ecoPoints: 410,
    statusText: 'Cari kardus pindahan kos',
    isOnline: false,
  },
];

const CAMPUS_GROUPS = [
  {
    id: 'grp_1',
    name: 'BEM FT-UNM Zero Waste',
    members: 142,
    tag: 'Komunitas Fakultas',
    activeTopic: 'Operasi Pilah Kardus Parangtambung',
    color: 'emerald',
  },
  {
    id: 'grp_2',
    name: 'Mapala Sintalaras UNM',
    members: 88,
    tag: 'Kelompok Mahasiswa',
    activeTopic: 'Pembersihan Kawasan Kampus Hijau',
    color: 'blue',
  },
  {
    id: 'grp_3',
    name: 'Bank Sampah Unit UNM Peduli',
    members: 215,
    tag: 'Mitra Pengolahan',
    activeTopic: 'Jemput Jelantah & Plastik UNM',
    color: 'amber',
  },
];

export const ConsoleRightSidebar: React.FC<ConsoleRightSidebarProps> = ({
  currentUser,
  onOpenChat,
  onOpenInbox,
  onNavigate,
  unreadCount,
}) => {
  return (
    <aside className="w-full xl:w-72 2xl:w-80 flex flex-col gap-4 text-xs select-none">
      {/* 1. Live Stream / TPA Tamangapa Alert Radar Card (Equivalent to Stream in Reference) */}
      <div className="rounded-2xl bg-white dark:bg-[#131b2e] border border-slate-200/90 dark:border-slate-800 shadow-sm p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
            </span>
            <span className="font-bold text-slate-800 dark:text-slate-100 text-[11px] uppercase tracking-wider">
              Monitor Hulu-Hilir
            </span>
          </div>
          <span className="px-1.5 py-0.5 rounded text-[10px] font-extrabold bg-rose-100 dark:bg-rose-950/70 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
            SIAGA 1
          </span>
        </div>

        {/* Visual Map/Mountain Banner */}
        <div className="relative rounded-xl overflow-hidden bg-slate-900 border border-slate-700/60 p-3 text-white space-y-2">
          {/* Subtle grid background */}
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#e11d48_1px,transparent_1px)] [background-size:12px_12px] pointer-events-none" />

          <div className="relative z-10 flex items-start justify-between gap-2">
            <div>
              <div className="text-[10px] text-slate-300 font-semibold flex items-center gap-1">
                <Mountain className="w-3.5 h-3.5 text-rose-400" />
                <span>TPA Tamangapa Antang</span>
              </div>
              <div className="text-xl font-black tracking-tight text-white mt-0.5">
                38.5 <span className="text-xs font-normal text-slate-300">meter</span>
              </div>
              <div className="text-[10px] text-rose-300 font-medium">
                Tinggi Gunungan Sampah (Kritis)
              </div>
            </div>

            <div className="text-right">
              <div className="text-[10px] text-slate-400">Jarak Kampus</div>
              <div className="text-xs font-bold text-emerald-300">±10.4 km</div>
              <div className="text-[9px] text-slate-400">950 ton/hari</div>
            </div>
          </div>

          {/* Reduksi Progress Bar */}
          <div className="space-y-1 pt-1">
            <div className="flex justify-between text-[10px] text-slate-300">
              <span>Beban Daya Tampung</span>
              <span className="font-bold text-rose-400">96% Penuh</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-amber-500 via-rose-500 to-rose-600 rounded-full w-[96%]" />
            </div>
          </div>

          <button
            onClick={() => onNavigate('fasilitas')}
            className="w-full mt-2 py-1.5 px-3 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-[11px] flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-sm"
          >
            <span>Buka Peta Satelit & Topologi</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {/* Drop Box Terdekat */}
        <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#1a233a] border border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 flex items-center justify-center font-bold">
              <MapPin className="w-3.5 h-3.5" />
            </div>
            <div>
              <div className="font-bold text-slate-800 dark:text-slate-200 text-[11px]">
                Drop Box Kampus
              </div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400">
                Gedung CSA FT (250m)
              </div>
            </div>
          </div>
          <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold">
            Tersedia
          </span>
        </div>
      </div>

      {/* 2. Friends Online / Sivitas Mahasiswa Aktif (Equivalent to Friends Online in Reference) */}
      <div className="rounded-2xl bg-white dark:bg-[#131b2e] border border-slate-200/90 dark:border-slate-800 shadow-sm p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <h4 className="font-bold text-slate-800 dark:text-slate-100 text-xs">
              Sivitas Aktif Pilah
            </h4>
          </div>
          <button
            onClick={onOpenInbox}
            className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>Inbox</span>
            {unreadCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-rose-500 text-white font-black text-[9px] flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>
        </div>

        <div className="space-y-2">
          {PEERS_ONLINE.map((peer) => (
            <div
              key={peer.id}
              className="p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-[#1a233a] transition-colors flex items-center justify-between gap-2 border border-transparent hover:border-slate-100 dark:hover:border-slate-800"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="relative shrink-0">
                  <img
                    src={peer.avatar}
                    alt={peer.name}
                    className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-200 dark:ring-slate-700"
                  />
                  {peer.isOnline && (
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-[#131b2e]" />
                  )}
                </div>
                <div className="min-w-0">
                  <div className="font-bold text-slate-900 dark:text-slate-100 text-xs truncate">
                    {peer.name}
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                    {peer.statusText}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <div className="text-right hidden sm:block">
                  <div className="text-[10px] font-bold text-amber-600 dark:text-amber-400 flex items-center justify-end gap-0.5">
                    <Flame className="w-3 h-3" />
                    <span>{peer.streakDays}h</span>
                  </div>
                </div>
                {peer.name.toLowerCase() === currentUser.name.toLowerCase() ? (
                  <span className="text-[10px] font-semibold text-slate-400 bg-slate-100 dark:bg-[#1a233a] px-2 py-0.5 rounded-md">
                    Anda
                  </span>
                ) : (
                  <button
                    onClick={() => onOpenChat(peer.name)}
                    className="p-1.5 rounded-lg bg-slate-100 dark:bg-[#1a233a] hover:bg-emerald-100 dark:hover:bg-emerald-950/70 hover:text-emerald-700 dark:hover:text-emerald-300 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
                    title={`Kirim pesan ke ${peer.name}`}
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Groups / Komunitas Fakultas & Unit (Equivalent to Groups in Reference) */}
      <div className="rounded-2xl bg-white dark:bg-[#131b2e] border border-slate-200/90 dark:border-slate-800 shadow-sm p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <h4 className="font-bold text-slate-800 dark:text-slate-100 text-xs">
              Komunitas Kampus
            </h4>
          </div>
          <button
            onClick={() => onNavigate('komunitas')}
            className="text-[11px] font-bold text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer"
          >
            Lihat Semua
          </button>
        </div>

        <div className="space-y-2">
          {CAMPUS_GROUPS.map((grp) => (
            <div
              key={grp.id}
              onClick={() => onNavigate('komunitas')}
              className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#1a233a] hover:bg-slate-100 dark:hover:bg-[#202c48] transition-colors cursor-pointer border border-slate-100 dark:border-slate-800/80 space-y-1"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 dark:text-slate-100 text-[11px] truncate">
                  {grp.name}
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                  {grp.members} mhs
                </span>
              </div>
              <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400">
                <span className="truncate text-emerald-600 dark:text-emerald-400 font-medium">
                  ● {grp.activeTopic}
                </span>
                <span className="text-slate-400">{grp.tag}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
};
