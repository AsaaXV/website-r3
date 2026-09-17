import React, { ReactNode } from 'react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import { ShieldAlert, LogIn, ArrowLeft } from 'lucide-react';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRoles?: UserRole[];
  requiredPermission?: string;
  fallback?: ReactNode;
  onUnauthorizedRedirect?: () => void;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRoles,
  requiredPermission,
  fallback,
  onUnauthorizedRedirect,
}) => {
  const { isLoggedIn, user, hasRole, canAccess, logout } = useAuth();

  // 1. Not Authenticated Guard
  if (!isLoggedIn) {
    if (fallback) return <>{fallback}</>;

    return (
      <div className="min-h-[400px] flex items-center justify-center p-6 text-center">
        <div className="max-w-md w-full p-8 rounded-3xl bg-white dark:bg-[#131b2e] border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 flex items-center justify-center">
            <LogIn className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
              Autentikasi Diperlukan
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Silakan masuk ke akun EcoCampus 3R Anda untuk mengakses fitur dan data pada modul ini.
            </p>
          </div>
          {onUnauthorizedRedirect && (
            <button
              onClick={onUnauthorizedRedirect}
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md shadow-emerald-600/20"
            >
              Buka Layar Masuk
            </button>
          )}
        </div>
      </div>
    );
  }

  // 2. Role-Based Access Control (RBAC) Guard
  if (requiredRoles && requiredRoles.length > 0 && !hasRole(requiredRoles)) {
    if (fallback) return <>{fallback}</>;

    return (
      <div className="min-h-[400px] flex items-center justify-center p-6 text-center">
        <div className="max-w-md w-full p-8 rounded-3xl bg-white dark:bg-[#131b2e] border border-amber-200 dark:border-amber-900/60 shadow-xl space-y-4">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <div className="space-y-1.5">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
              Akses Dibatasi (RBAC)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Peran Anda saat ini (
              <span className="font-semibold text-slate-700 dark:text-slate-200 capitalize">
                {user.role.replace('_', ' ')}
              </span>
              ) tidak memiliki hak akses administratif untuk membuka modul ini.
            </p>
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#1a233a] text-[11px] text-slate-600 dark:text-slate-300 font-mono">
              Peran Dibutuhkan: {requiredRoles.join(' atau ')}
            </div>
          </div>
          <div className="flex gap-2 pt-2">
            {onUnauthorizedRedirect ? (
              <button
                onClick={onUnauthorizedRedirect}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Kembali</span>
              </button>
            ) : null}
            <button
              onClick={() => logout('Beralih ke akun dengan hak akses yang sesuai.')}
              className="flex-1 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition-all shadow-md shadow-amber-600/20"
            >
              Ganti Akun
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 3. Permission-based Guard
  if (requiredPermission && !canAccess(requiredPermission)) {
    if (fallback) return <>{fallback}</>;

    return (
      <div className="min-h-[400px] flex items-center justify-center p-6 text-center">
        <div className="max-w-md w-full p-8 rounded-3xl bg-white dark:bg-[#131b2e] border border-rose-200 dark:border-rose-900/60 shadow-xl space-y-4">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 flex items-center justify-center">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <div className="space-y-1.5">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
              Izin Operasi Tidak Memadai
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Operasi ini memerlukan izin khusus <code className="text-rose-600 dark:text-rose-400 font-mono">[{requiredPermission}]</code> yang tidak tersedia pada profil akun Anda.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Authorized: render child component tree
  return <>{children}</>;
};
