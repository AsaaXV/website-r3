import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Clock, ShieldAlert, LogOut, CheckCircle } from 'lucide-react';

export const IdleSessionWarningModal: React.FC = () => {
  const { idleState, logout } = useAuth();
  const { isWarning, remainingSeconds, keepAlive } = idleState;

  if (!isWarning) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#131b2e] rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-amber-300/80 dark:border-amber-700/80 text-center space-y-4">
        {/* Warning Icon */}
        <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center relative">
          <Clock className="w-7 h-7 animate-pulse" />
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center">
            !
          </span>
        </div>

        {/* Text */}
        <div className="space-y-1.5">
          <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
            Peringatan Sesi Menganggur
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Tidak terdeteksi aktivitas pada perangkat Anda. Demi keamanan sesi otentikasi, sistem akan keluar otomatis dalam:
          </p>
        </div>

        {/* Countdown Timer Badge */}
        <div className="py-2.5 px-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 flex items-center justify-center gap-2">
          <span className="font-mono text-2xl font-black text-amber-600 dark:text-amber-400">
            {remainingSeconds}
          </span>
          <span className="text-xs font-bold text-amber-700 dark:text-amber-300">
            detik tersisa
          </span>
        </div>

        {/* Security Note */}
        <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-400">
          <ShieldAlert className="w-3.5 h-3.5 text-slate-400" />
          <span>Protokol Keamanan OWASP / Enterprise Idle Guard</span>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2 pt-1">
          <button
            type="button"
            onClick={keepAlive}
            className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-emerald-600/20 cursor-pointer"
          >
            <CheckCircle className="w-4 h-4" />
            <span>Lanjutkan Sesi (Saya Masih Di Sini)</span>
          </button>
          <button
            type="button"
            onClick={() => logout('Pengguna memilih keluar saat sesi menganggur.')}
            className="w-full py-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Keluar Sekarang</span>
          </button>
        </div>
      </div>
    </div>
  );
};
