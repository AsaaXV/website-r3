import { UserProfile, UserRole } from '../types';
import { INITIAL_USER, OPERATOR_USER, ADMIN_USER, DEMO_ACCOUNTS } from '../data/mockData';

export interface AuthorizedAccount {
  email: string;
  aliases: string[];
  passwords: string[];
  profile: UserProfile;
  label?: string;
  isDev?: boolean;
}

export const DEV_ACCOUNT_CREDENTIALS = {
  email: 'admin',
  password: '12345',
};

export const DEV_ACCOUNT_PROFILE: UserProfile = {
  id: 'usr_admin_dev_01',
  name: 'Administrator Dev (EcoCampus)',
  email: 'admin@web.com',
  faculty: 'Direktorat Fasilitas & Green Campus',
  major: 'Kepala Pengembangan Sistem & Audit 3R',
  role: 'admin_kampus' as UserRole,
  ecoPoints: 5000,
  xp: 10000,
  level: 10,
  currentStreakDays: 30,
  totalWeightDepositedKg: 1250.0,
  avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=250&q=80',
  badges: [
    {
      id: 'b_super_dev',
      title: 'Super Admin Developer',
      description: 'Akun developer dengan hak akses penuh sistem dan audit data.',
      icon: 'ShieldCheck',
      unlockedAt: '2026-09-15',
    },
  ],
};

export const AUTHORIZED_ACCOUNTS: AuthorizedAccount[] = [
  {
    email: 'admin',
    aliases: ['admin', 'admin@web.com', 'admin_dev', 'developer', 'adminweb'],
    passwords: ['12345', 'admin123', 'unm2026', 'UNM2026!Eco'],
    profile: DEV_ACCOUNT_PROFILE,
    label: 'Akun Khusus Developer (admin / 12345)',
    isDev: true,
  },
  {
    email: 'fathur@student.unm.ac.id',
    aliases: [
      'fathur@student.unm.ac.id',
      'fathur@unm.ac.id',
      'fatur@gmail.com',
      'imuhfatur@gmail.com',
      'fathur',
      '220209501045',
    ],
    passwords: ['UNM2026!Eco', 'unm2026', 'fathur123', 'admin123', '12345'],
    profile: INITIAL_USER,
    label: 'Muh. Fathurrahman (Mahasiswa FT UNM - Kampus Parangtambung)',
  },
  {
    email: 'petugas.tps@unm.ac.id',
    aliases: [
      'petugas.tps@unm.ac.id',
      'operator@unm.ac.id',
      'operator@ecocampus.id',
      'operator',
      'baharuddin',
      'syahrul',
    ],
    passwords: ['operator123', 'UNM2026!Eco', 'unm2026', '12345'],
    profile: OPERATOR_USER,
    label: 'Pak Baharuddin S.Pd. (Petugas TPST Kampus Parangtambung UNM)',
  },
  {
    email: 'admin.ecocampus@unm.ac.id',
    aliases: [
      'admin.ecocampus@unm.ac.id',
      'admin@unm.ac.id',
      'admin@ecocampus.id',
      'admin',
      'nurul_qamariyah',
      'nurul_hidayah',
    ],
    passwords: ['admin123', 'UNM2026!Eco', 'unm2026', '12345'],
    profile: ADMIN_USER,
    label: 'Dr. Ir. Nurul Hidayah, M.Pd. (Pusat Green Campus UNM - Menara Pinisi)',
  },
  {
    email: 'nurul.annisa@student.unm.ac.id',
    aliases: [
      'nurul.annisa@student.unm.ac.id',
      'nurul@student.unm.ac.id',
      'nurul@gmail.com',
      'nurul',
    ],
    passwords: ['nurul123', 'UNM2026!Eco', 'unm2026', '12345'],
    profile: DEMO_ACCOUNTS[3] || INITIAL_USER,
    label: 'Nurul Annisa (Mahasiswi FMIPA UNM)',
  },
];

// Helper to get registered accounts from localStorage
export const getRegisteredLocalAccounts = (): AuthorizedAccount[] => {
  try {
    const raw = localStorage.getItem('ecocampus_registered_users');
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return parsed.map((item: any) => ({
      email: item.email,
      aliases: [item.email, item.email.split('@')[0]],
      passwords: [item.password],
      profile: item.profile,
      label: item.profile.name,
    }));
  } catch {
    return [];
  }
};

// Save a newly registered account to localStorage
export const saveRegisteredAccount = (email: string, password: string, profile: UserProfile) => {
  try {
    const current = getRegisteredLocalAccounts();
    const updated = [
      ...current.filter((a) => a.email.toLowerCase() !== email.toLowerCase()),
      { email, password, profile },
    ];
    localStorage.setItem('ecocampus_registered_users', JSON.stringify(updated));
  } catch (e) {
    console.warn('Failed to save user in localStorage:', e);
  }
};

/**
 * Validates credentials strictly.
 * Returns UserProfile ONLY IF email and password match.
 * Returns null IF credentials do NOT match (NO BYPASS!).
 */
export const validateCredentials = (
  identifier: string,
  pass: string
): UserProfile | null => {
  const query = identifier.trim().toLowerCase();
  const trimmedPass = pass.trim();
  if (!query || !trimmedPass) return null;

  const allAccounts = [...AUTHORIZED_ACCOUNTS, ...getRegisteredLocalAccounts()];

  const matched = allAccounts.find((acc) => {
    const emailMatch = acc.email.toLowerCase() === query;
    const aliasMatch = acc.aliases.some((a) => a.toLowerCase() === query);
    const idPrefixMatch = query.includes('@') && acc.email.toLowerCase().startsWith(query.split('@')[0]);
    return emailMatch || aliasMatch || idPrefixMatch;
  });

  if (!matched) {
    return null;
  }

  // Strictly check password
  const isPasswordCorrect = matched.passwords.includes(trimmedPass);
  if (!isPasswordCorrect) {
    return null;
  }

  return matched.profile;
};
