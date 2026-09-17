import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  ReactNode,
} from 'react';
import { UserProfile, UserRole } from '../types';
import { INITIAL_USER } from '../data/mockData';
import { DEV_ACCOUNT_PROFILE } from '../utils/authAccounts';
import { auth, signOut, onAuthStateChanged, isFirebaseLiveConfigured } from '../utils/firebase';
import { useIdle } from '../hooks/useIdle';

export const UNAUTHENTICATED_USER: UserProfile = {
  id: '',
  name: 'Tamu (Belum Masuk)',
  email: '',
  faculty: 'Belum Terotentikasi',
  major: 'Pengguna Tamu',
  role: 'mahasiswa' as UserRole,
  ecoPoints: 0,
  xp: 0,
  level: 0,
  currentStreakDays: 0,
  totalWeightDepositedKg: 0,
  avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=250&q=80',
  badges: [],
};

export interface AuthContextType {
  user: UserProfile;
  isLoggedIn: boolean;
  role: UserRole;
  isLoading: boolean;
  login: (user: UserProfile) => void;
  logout: (reason?: string) => Promise<void>;
  updateUser: (updates: Partial<UserProfile> | ((prev: UserProfile) => UserProfile)) => void;
  /** Role-Based Access Control: verify if current user has any of the specified roles */
  hasRole: (requiredRoles: UserRole | UserRole[]) => boolean;
  /** Module-level permission check based on RBAC rules */
  canAccess: (permission: string) => boolean;
  /** Idle Session Management */
  idleState: {
    isWarning: boolean;
    isIdle: boolean;
    remainingSeconds: number;
    keepAlive: () => void;
  };
  /** Latest auth notice/status */
  authNotice: string | null;
  clearAuthNotice: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Storage keys
const STORAGE_KEYS = {
  LOGGED_IN: 'isLoggedIn',
  ECO_LOGGED_IN: 'ecocampus_logged_in',
  USER_PROFILE: 'ecocampus_user_profile',
  SESSION_STARTED_AT: 'ecocampus_session_start',
};

// RBAC Permissions Mapping
const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  mahasiswa: [
    'view_dashboard',
    'view_waste_catalog',
    'view_leaderboard',
    'take_quiz',
    'view_my_activity',
    'earn_ecopoints',
    'request_pickup',
  ],
  petugas_tps: [
    'view_dashboard',
    'view_waste_catalog',
    'view_leaderboard',
    'take_quiz',
    'view_my_activity',
    'earn_ecopoints',
    'record_deposits',
    'manage_inventory',
    'verify_transactions',
    'weigh_waste',
    'manage_logistics',
  ],
  admin_kampus: [
    'view_dashboard',
    'view_waste_catalog',
    'view_leaderboard',
    'take_quiz',
    'view_my_activity',
    'earn_ecopoints',
    'record_deposits',
    'manage_inventory',
    'verify_transactions',
    'weigh_waste',
    'manage_logistics',
    'audit_logs',
    'system_configuration',
    'export_reports',
    'manage_users',
    'manage_rates',
    'full_administrative_access',
  ],
  admin: [
    'view_dashboard',
    'view_waste_catalog',
    'view_leaderboard',
    'take_quiz',
    'view_my_activity',
    'earn_ecopoints',
    'record_deposits',
    'manage_inventory',
    'verify_transactions',
    'weigh_waste',
    'manage_logistics',
    'audit_logs',
    'system_configuration',
    'export_reports',
    'manage_users',
    'manage_rates',
    'full_administrative_access',
  ],
  dosen: [
    'view_dashboard',
    'view_waste_catalog',
    'view_leaderboard',
    'take_quiz',
    'view_my_activity',
    'earn_ecopoints',
    'view_research_data',
    'participate_surveys',
  ],
  pengelola: [
    'view_dashboard',
    'view_waste_catalog',
    'view_leaderboard',
    'manage_inventory',
    'verify_transactions',
    'weigh_waste',
    'manage_logistics',
  ],
  mitra: [
    'view_dashboard',
    'view_waste_catalog',
    'view_my_activity',
    'earn_ecopoints',
    'manage_inventory',
    'request_pickup',
  ],
};

interface AuthProviderProps {
  children: ReactNode;
  idleTimeoutMs?: number;
  idleWarningMs?: number;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({
  children,
  idleTimeoutMs = 20 * 60 * 1000, // 20 minutes default idle timeout
  idleWarningMs = 60 * 1000,       // 60 seconds warning countdown
}) => {
  // STRICT AUTH INITIALIZATION: Default WAJIB belum login (false) saat baru dibuka
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    try {
      const primary = localStorage.getItem(STORAGE_KEYS.LOGGED_IN);
      return primary === 'true';
    } catch {
      return false;
    }
  });

  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    try {
      const primary = localStorage.getItem(STORAGE_KEYS.LOGGED_IN);
      if (primary === 'true') {
        const saved = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed && parsed.id) return parsed;
        }
        return DEV_ACCOUNT_PROFILE;
      }
    } catch (e) {
      console.warn('Failed parsing stored user profile:', e);
    }
    // Jika belum login, status default adalah tamu unauthenticated (bukan login otomatis)
    return UNAUTHENTICATED_USER;
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [authNotice, setAuthNotice] = useState<string | null>(null);

  // Sync state to localStorage
  const persistSession = useCallback((loggedIn: boolean, user?: UserProfile | null) => {
    try {
      if (loggedIn && user && user.id) {
        localStorage.setItem(STORAGE_KEYS.LOGGED_IN, 'true');
        localStorage.setItem(STORAGE_KEYS.ECO_LOGGED_IN, 'true');
        localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(user));
        localStorage.setItem(STORAGE_KEYS.SESSION_STARTED_AT, String(Date.now()));
      } else {
        localStorage.removeItem(STORAGE_KEYS.LOGGED_IN);
        localStorage.removeItem(STORAGE_KEYS.ECO_LOGGED_IN);
        localStorage.removeItem(STORAGE_KEYS.USER_PROFILE);
        localStorage.removeItem(STORAGE_KEYS.SESSION_STARTED_AT);
      }
    } catch (e) {
      console.warn('Storage persistence error:', e);
    }
  }, []);

  // Firebase Auth State Listener (hanya aktif jika konfigurasi live ada)
  useEffect(() => {
    if (!isFirebaseLiveConfigured) return;
    try {
      const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
        if (firebaseUser) {
          setIsLoggedIn(true);
          setCurrentUser((prev) => {
            const userEmail = firebaseUser.email || prev.email;
            const displayName =
              firebaseUser.displayName ||
              prev.name ||
              userEmail.split('@')[0].replace(/[._-]/g, ' ');

            const updated: UserProfile = {
              ...prev,
              id: firebaseUser.uid,
              name: displayName,
              email: userEmail,
            };
            persistSession(true, updated);
            return updated;
          });
        }
      });
      return () => unsubscribe();
    } catch (err) {
      console.info('Firebase auth listener status:', err);
    }
  }, [persistSession]);

  // Login handler
  const login = useCallback(
    (user: UserProfile) => {
      setCurrentUser(user);
      setIsLoggedIn(true);
      persistSession(true, user);
      setAuthNotice(`Selamat datang, ${user.name}! Sesi terotentikasi sebagai ${user.role}.`);
    },
    [persistSession]
  );

  // Logout handler
  const logout = useCallback(
    async (reason?: string) => {
      try {
        if (isFirebaseLiveConfigured) {
          await signOut(auth);
        }
      } catch (err) {
        console.info('Firebase signOut info:', err);
      }
      setIsLoggedIn(false);
      setCurrentUser(UNAUTHENTICATED_USER);
      persistSession(false, null);
      setAuthNotice(
        reason || 'Anda telah keluar dari akun. Silakan masuk kembali untuk mengakses sistem.'
      );
    },
    [persistSession]
  );

  // Update user profile data
  const updateUser = useCallback(
    (updates: Partial<UserProfile> | ((prev: UserProfile) => UserProfile)) => {
      setCurrentUser((prev) => {
        const next = typeof updates === 'function' ? updates(prev) : { ...prev, ...updates };
        persistSession(isLoggedIn, next);
        return next;
      });
    },
    [isLoggedIn, persistSession]
  );

  // RBAC Role Check
  const hasRole = useCallback(
    (requiredRoles: UserRole | UserRole[]): boolean => {
      if (!isLoggedIn) return false;
      const rolesArray = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];
      return rolesArray.includes(currentUser.role);
    },
    [isLoggedIn, currentUser.role]
  );

  // RBAC Permission Check
  const canAccess = useCallback(
    (permission: string): boolean => {
      if (!isLoggedIn) return false;
      const allowed = ROLE_PERMISSIONS[currentUser.role] || [];
      return allowed.includes(permission);
    },
    [isLoggedIn, currentUser.role]
  );

  // Idle Session Detection Hook
  const { isIdle, isWarning, remainingSeconds, resetTimer } = useIdle({
    timeoutMs: idleTimeoutMs,
    warningThresholdMs: idleWarningMs,
    enabled: isLoggedIn,
    onIdle: () => {
      logout('Sesi otomatis diakhiri karena tidak ada aktivitas pengguna demi keamanan.');
    },
    onWarning: () => {
      // Trigger warning state
    },
  });

  const clearAuthNotice = useCallback(() => {
    setAuthNotice(null);
  }, []);

  const value = useMemo<AuthContextType>(
    () => ({
      user: currentUser,
      isLoggedIn,
      role: currentUser.role,
      isLoading,
      login,
      logout,
      updateUser,
      hasRole,
      canAccess,
      idleState: {
        isWarning,
        isIdle,
        remainingSeconds,
        keepAlive: resetTimer,
      },
      authNotice,
      clearAuthNotice,
    }),
    [
      currentUser,
      isLoggedIn,
      isLoading,
      login,
      logout,
      updateUser,
      hasRole,
      canAccess,
      isWarning,
      isIdle,
      remainingSeconds,
      resetTimer,
      authNotice,
      clearAuthNotice,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an <AuthProvider>');
  }
  return context;
};
