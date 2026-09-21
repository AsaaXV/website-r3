import {
  ReuseItem,
  ItemRequest,
  ScanHistoryItem,
  DailyChallenge,
  UserProfile,
  ChatThread,
  ChatMessage,
  AppNotification,
  PickupRequest,
  ReduceActionKey,
  ReduceActionDefinition,
  ReduceActionLog,
  R3MetricsSummary,
  LedgerTransaction,
} from '../types';
import {
  REUSE_ITEMS,
  INITIAL_USER,
  OPERATOR_USER,
  ADMIN_USER,
  INITIAL_CHAT_THREADS,
  DEMO_ACCOUNTS,
  INITIAL_LEDGER_TRANSACTIONS,
} from '../data/mockData';
import { DEV_ACCOUNT_PROFILE } from './authAccounts';

const STORAGE_KEYS = {
  REUSE_ITEMS: 'ecocampus_reuse_items_v2',
  ITEM_REQUESTS: 'ecocampus_item_requests_v2',
  SCAN_HISTORY: 'ecocampus_scan_history_v2',
  CHALLENGES: 'ecocampus_daily_challenges_v2',
  USER_PROFILE: 'ecocampus_user_profile_v2',
  CHAT_THREADS_PREFIX: 'ecocampus_chat_threads_v4_',
  TRANSACTIONS: 'ecocampus_ledger_transactions_v2',
  REDUCE_ACTIONS_PREFIX: 'ecocampus_reduce_actions_v1_',
};

export function sanitizeUserId(userId?: string): string {
  if (!userId) return 'guest';
  return userId.trim().toLowerCase().replace(/[^a-z0-9_-]/g, '_');
}

// Safe COD Spots standard recommendations
export const SAFE_COD_SPOTS = [
  'Pelataran Menara Pinisi UNM (Jl. A.P. Pettarani)',
  'Lobi Dekanat & Gedung Elektro FT UNM (Parangtambung)',
  'Perpustakaan Pusat UNM Kampus Gunungsari',
  'Pusat Kegiatan Mahasiswa (PKM) & Asrama UNM Parangtambung',
  'Gedung Olahraga FIKK UNM Banta-Bantaeng',
  'Gedung Kesenian & Desain FSD UNM Kampus Tidung',
  'Taman Kampus Hijau Parangtambung UNM',
];

export const INITIAL_ITEM_REQUESTS: ItemRequest[] = [
  {
    id: 'req_01',
    userId: 'usr_fatur_01',
    userName: 'Muh. Fatur Rahman',
    userEmail: 'fatur@gmail.com',
    userFaculty: 'Fakultas Teknik',
    requesterName: 'Muh. Fatur Rahman',
    requesterFaculty: 'Fakultas Teknik',
    title: 'Dicari: Kardus Bekas Ukuran Sedang untuk Pindahan Kos',
    description: 'Halo rekan-rekan, butuh 4-5 kardus mi instan/air mineral bekas yang masih kokoh untuk beres-beres kosan akhir semester. Siap ambil di sekitar kampus.',
    category: 'Peralatan Kos',
    urgency: 'Segera',
    preferredCodSpot: 'Lobi Utama Gedung Fakultas Teknik',
    preferredMeetupPoint: 'Lobi Utama Gedung Fakultas Teknik',
    createdAt: '2 jam yang lalu',
    postedAt: '2 jam yang lalu',
    responsesCount: 2,
    status: 'open',
    contactWhatsapp: '081234567890',
  },
  {
    id: 'req_02',
    userId: 'usr_nurul_02',
    userName: 'Nurul Hidayah',
    userEmail: 'nurul@gmail.com',
    userFaculty: 'Fakultas MIPA',
    requesterName: 'Nurul Hidayah',
    requesterFaculty: 'Fakultas MIPA',
    title: 'Dicari: Buku Ajar Kalkulus & Fisika Dasar Preloved',
    description: 'Mencari buku ajar bekas mata kuliah kalkulus atau fisika teknik semester 1-2. Yang edisi lama tidak apa-apa asal halaman masih lengkap.',
    category: 'Buku & Diktat',
    urgency: 'Santai',
    preferredCodSpot: 'Perpustakaan Pusat Kampus (Area Diskusi Lt. 1)',
    preferredMeetupPoint: 'Perpustakaan Pusat Kampus (Area Diskusi Lt. 1)',
    createdAt: 'Kemarin',
    postedAt: 'Kemarin',
    responsesCount: 4,
    status: 'open',
    contactWhatsapp: '082198765432',
  },
  {
    id: 'req_03',
    userId: 'usr_ahmad_03',
    userName: 'Ahmad Fauzi',
    userEmail: 'ahmad@gmail.com',
    userFaculty: 'Fakultas Ekonomi & Bisnis',
    requesterName: 'Ahmad Fauzi',
    requesterFaculty: 'Fakultas Ekonomi & Bisnis',
    title: 'Dicari: Stopkontak / Kabel Roll Bekas Kosan',
    description: 'Butuh kabel roll 3-4 lubang yang masih berfungsi normal dengan aman. Boleh barter dengan tumbler atau buku novel santai.',
    category: 'Elektronik & Kos',
    urgency: 'Fleksibel',
    preferredCodSpot: 'Pusat Jajanan & Kantin Ramsis Kampus',
    preferredMeetupPoint: 'Pusat Jajanan & Kantin Ramsis Kampus',
    createdAt: '2 hari yang lalu',
    postedAt: '2 hari yang lalu',
    responsesCount: 1,
    status: 'open',
    contactWhatsapp: '081398761234',
  },
];

export const INITIAL_DAILY_CHALLENGES: DailyChallenge[] = [
  {
    day: 1,
    title: 'Bawa Botol Minum (Tumbler) Sendiri',
    description: 'Hindari membeli air mineral kemasan plastik sekali pakai selama beraktivitas di kampus hari ini.',
    rewardPoints: 50,
    rewardXp: 100,
    completed: true,
    completedAt: '2026-09-10',
    iconName: 'Coffee',
  },
  {
    day: 2,
    title: 'Tolak Sedotan & Kantong Plastik',
    description: 'Katakan "tanpa sedotan dan kresek" saat berbelanja jajanan di kantin atau minimarket.',
    rewardPoints: 50,
    rewardXp: 100,
    completed: true,
    completedAt: '2026-09-11',
    iconName: 'Ban',
  },
  {
    day: 3,
    title: 'Posting 1 Barang Layak Pakai ke Bursa Reuse',
    description: 'Cek lemari kosanmu, posting buku/baju/barang yang sudah tak terpakai agar dapat digunakan orang lain.',
    rewardPoints: 75,
    rewardXp: 150,
    completed: false,
    iconName: 'ShoppingBag',
  },
  {
    day: 4,
    title: 'Pindai Material dengan Kamera AI EcoCampus',
    description: 'Gunakan fitur Scan AI untuk mendeteksi jenis plastik (PET/HDPE) atau kertas karton.',
    rewardPoints: 50,
    rewardXp: 100,
    completed: false,
    iconName: 'Scan',
  },
  {
    day: 5,
    title: 'Bersihkan & Pisahkan 3 Botol Plastik PET',
    description: 'Lepaskan label plastik dan bilas botol sebelum dibuang ke tempat sampah pilah kuning.',
    rewardPoints: 60,
    rewardXp: 120,
    completed: false,
    iconName: 'Sparkles',
  },
  {
    day: 6,
    title: 'Bagikan 1 Tips 3R ke Teman Kampus',
    description: 'Ajak teman kuliah untuk berpartisipasi menjaga kebersihan fasilitas kampus bebas timbunan sampah.',
    rewardPoints: 50,
    rewardXp: 100,
    completed: false,
    iconName: 'Share2',
  },
  {
    day: 7,
    title: 'Selesaikan Kuis Literasi Sirkularitas Hijau',
    description: 'Uji pemahaman Anda tentang dampak TPA Tamangapa dan siklus daur ulang di modul edukasi.',
    rewardPoints: 100,
    rewardXp: 200,
    completed: false,
    iconName: 'Award',
  },
];

export const INITIAL_SCAN_HISTORY: ScanHistoryItem[] = [
  {
    id: 'scan_01',
    timestamp: '12 Sep 2026, 10:15 WITA',
    materialName: 'Botol Plastik PET (Polyethylene Terephthalate)',
    category: 'plastik',
    confidence: 0.96,
    thumbnailUrl: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=300&q=80',
    suggestedAction: 'Bilas bersih, remukkan untuk menghemat ruang tempat sampah pilah anorganik atau manfaatkan jadi pot hidroponik.',
    upcyclingTips: [
      {
        title: 'Pot Tanaman Hidroponik Sederhana (Wick System)',
        difficulty: 'Mudah',
        estTime: '10 menit',
        materialsNeeded: 'Botol PET 600ml/1.5L, kain flanel/sumbu kompor, gunting, media tanam rockwool/tanah.',
        steps: [
          'Potong botol menjadi dua bagian (bagian atas sepertiga panjang botol).',
          'Lubangi tutup botol dan selipkan kain flanel sebagai sumbu penyerap air.',
          'Balik potongan atas botol ke dalam potongan bawah yang telah diisi air nutrisi.',
        ],
      },
      {
        title: 'Wadah Pensil & Alat Tulis Meja Estetik',
        difficulty: 'Mudah',
        estTime: '5 menit',
        materialsNeeded: 'Bagian bawah botol PET, setrika hangat (untuk menghaluskan pinggiran potong).',
        steps: [
          'Potong botol setinggi 10 cm dari bagian alas.',
          'Tempelkan pinggiran potongan ke permukaan setrika hangat selama 3 detik agar tepian melengkung halus dan tidak tajam.',
          'Siap ditaruh di meja belajar untuk menampung pulpen, spidol, dan gunting.',
        ],
      },
    ],
  },
  {
    id: 'scan_02',
    timestamp: '11 Sep 2026, 16:40 WITA',
    materialName: 'Kardus Karton Gelombang (Corrugated Cardboard)',
    category: 'kertas',
    confidence: 0.94,
    thumbnailUrl: 'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?auto=format&fit=crop&w=300&q=80',
    suggestedAction: 'Lipat rapi dalam kondisi kering. Sangat dibutuhkan oleh mahasiswa kos untuk wadah buku atau kirim paket.',
    upcyclingTips: [
      {
        title: 'Pembatas / Divider Laci & Rak Buku',
        difficulty: 'Mudah',
        estTime: '10 menit',
        materialsNeeded: 'Lembaran kardus, cutter, penggaris.',
        steps: [
          'Ukur kedalaman dan tinggi laci meja Anda.',
          'Potong lembaran kardus dan buat celah selip di tengah-tengahnya.',
          'Rakit menjadi sekat kotak-kotak untuk merapikan kaus kaki atau alat tulis.',
        ],
      },
      {
        title: 'Dudukan Laptop Ergonomis DIY',
        difficulty: 'Menengah',
        estTime: '15 menit',
        materialsNeeded: 'Kardus tebal tebal ganda, lem tembak/kertas, template potongan miring.',
        steps: [
          'Potong 2 bentuk segitiga siku-siku dengan sudut kemiringan 15-20 derajat.',
          'Hubungkan kedua segitiga dengan sekat penyangga di bagian belakang.',
          'Alasi laptop untuk sirkulasi udara lebih dingin dan posisi layar lebih sejajar mata.',
        ],
      },
    ],
  },
];

// Helper functions with localStorage fallback
export function getStoredReuseItems(): ReuseItem[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.REUSE_ITEMS);
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error(e);
  }
  return REUSE_ITEMS;
}

export function saveStoredReuseItems(items: ReuseItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.REUSE_ITEMS, JSON.stringify(items));
  } catch (e) {
    console.error(e);
  }
}

export function getStoredItemRequests(): ItemRequest[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.ITEM_REQUESTS);
    if (data) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map((item: any, idx: number) => ({
          ...item,
          id: item.id || `req_stored_${idx}`,
          title: item.title || 'Barang Kebutuhan',
          description: item.description || '',
          category: item.category || 'Peralatan Kos',
          urgency: item.urgency || 'Santai',
          status: item.status || 'open',
          requesterName: item.requesterName || item.userName || 'Rekan Mahasiswa',
          userName: item.userName || item.requesterName || 'Rekan Mahasiswa',
          requesterFaculty: item.requesterFaculty || item.userFaculty || 'Fakultas Teknik',
          userFaculty: item.userFaculty || item.requesterFaculty || 'Fakultas Teknik',
          preferredMeetupPoint: item.preferredMeetupPoint || item.preferredCodSpot || 'Lobi Utama Kampus',
          preferredCodSpot: item.preferredCodSpot || item.preferredMeetupPoint || 'Lobi Utama Kampus',
          postedAt: item.postedAt || item.createdAt || 'Baru saja',
          createdAt: item.createdAt || item.postedAt || 'Baru saja',
          contactWhatsapp: item.contactWhatsapp || '081234567890',
          responsesCount: typeof item.responsesCount === 'number' ? item.responsesCount : 0,
        }));
      }
    }
  } catch (e) {
    console.error(e);
  }
  return INITIAL_ITEM_REQUESTS;
}

export function saveStoredItemRequests(requests: ItemRequest[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.ITEM_REQUESTS, JSON.stringify(requests));
  } catch (e) {
    console.error(e);
  }
}

// =============================================================
// USER-SCOPED DATA STORAGE (STRICT ISOLATION BY userId)
// =============================================================

export function getUserProfile(userId: string, fallback?: UserProfile): UserProfile {
  if (!userId) return fallback || INITIAL_USER;
  const sanitized = sanitizeUserId(userId);
  try {
    const data = localStorage.getItem(`ecocampus_user_profile_${sanitized}`);
    if (data) {
      const parsed = JSON.parse(data);
      if (parsed && parsed.id) return parsed;
    }
  } catch (e) {
    console.error('Error reading user profile for', userId, e);
  }

  // Pre-configured baseline accounts if never saved yet
  if (sanitized === 'usr_fatur_01' || sanitized === 'usr_demo_01') {
    return INITIAL_USER;
  }
  if (sanitized === 'usr_operator_01') {
    return OPERATOR_USER;
  }
  if (sanitized === 'usr_admin_01') {
    return ADMIN_USER;
  }
  if (sanitized === 'usr_admin_dev_01') {
    return DEV_ACCOUNT_PROFILE;
  }
  const matchedDemo = DEMO_ACCOUNTS.find((a) => a.id === userId || a.id === sanitized);
  if (matchedDemo) {
    return matchedDemo;
  }

  return fallback || {
    id: userId,
    name: 'Sivitas Akademika UNM',
    email: `${sanitized}@student.unm.ac.id`,
    faculty: 'Universitas Negeri Makassar',
    major: 'Mahasiswa Aktif',
    role: 'mahasiswa',
    ecoPoints: 0,
    xp: 0,
    level: 1,
    currentStreakDays: 0,
    totalWeightDepositedKg: 0,
    avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=250&q=80',
    badges: [],
  };
}

export function saveUserProfile(userId: string, profile: UserProfile): void {
  if (!userId) return;
  const sanitized = sanitizeUserId(userId);
  try {
    localStorage.setItem(`ecocampus_user_profile_${sanitized}`, JSON.stringify(profile));
    // Also update active session profile if this user is currently active
    const activeUser = localStorage.getItem('ecocampus_active_user_id');
    if (activeUser === userId || activeUser === sanitized) {
      localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(profile));
    }
  } catch (e) {
    console.error('Error saving user profile for', userId, e);
  }
}

// --- 7-Day Challenges (Isolated per user) ---

export function getUserChallenges(userId: string): DailyChallenge[] {
  const sanitized = sanitizeUserId(userId);
  const key = `ecocampus_challenges_${sanitized}`;
  try {
    const data = localStorage.getItem(key);
    if (data) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.error('Error reading challenges for', userId, e);
  }

  // Fatur has Day 1 & Day 2 completed baseline
  if (sanitized === 'usr_fatur_01' || sanitized === 'usr_demo_01') {
    saveUserChallenges(userId, INITIAL_DAILY_CHALLENGES);
    return INITIAL_DAILY_CHALLENGES;
  }

  // Nurul has Day 1 completed baseline
  if (sanitized === 'usr_nurul_02') {
    const nurulChallenges = INITIAL_DAILY_CHALLENGES.map((c) => ({
      ...c,
      completed: c.day === 1,
      completedAt: c.day === 1 ? '10 Sep 2026' : undefined,
    }));
    saveUserChallenges(userId, nurulChallenges);
    return nurulChallenges;
  }

  // Ahmad has Day 1 completed baseline
  if (sanitized === 'usr_ahmad_03') {
    const ahmadChallenges = INITIAL_DAILY_CHALLENGES.map((c) => ({
      ...c,
      completed: c.day === 1,
      completedAt: c.day === 1 ? '09 Sep 2026' : undefined,
    }));
    saveUserChallenges(userId, ahmadChallenges);
    return ahmadChallenges;
  }

  // Any other user (Operator, Admin, fresh user): FRESH challenges, 0/7 completed!
  const freshChallenges: DailyChallenge[] = INITIAL_DAILY_CHALLENGES.map((c) => ({
    ...c,
    completed: false,
    completedAt: undefined,
  }));
  saveUserChallenges(userId, freshChallenges);
  return freshChallenges;
}

export function saveUserChallenges(userId: string, challenges: DailyChallenge[]): void {
  const sanitized = sanitizeUserId(userId);
  const key = `ecocampus_challenges_${sanitized}`;
  try {
    localStorage.setItem(key, JSON.stringify(challenges));
  } catch (e) {
    console.error('Error saving challenges for', userId, e);
  }
}

// --- Scan AI History (Isolated per user) ---

export function getUserScanHistory(userId: string): ScanHistoryItem[] {
  const sanitized = sanitizeUserId(userId);
  const key = `ecocampus_scan_history_${sanitized}`;
  try {
    const data = localStorage.getItem(key);
    if (data) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {
    console.error('Error reading scan history for', userId, e);
  }

  // Only Fatur starts with baseline 2 demo scans
  if (sanitized === 'usr_fatur_01' || sanitized === 'usr_demo_01') {
    saveUserScanHistory(userId, INITIAL_SCAN_HISTORY);
    return INITIAL_SCAN_HISTORY;
  }

  // All other users start with EMPTY scan history (no data leakage)
  return [];
}

export function saveUserScanHistory(userId: string, history: ScanHistoryItem[]): void {
  const sanitized = sanitizeUserId(userId);
  const key = `ecocampus_scan_history_${sanitized}`;
  try {
    localStorage.setItem(key, JSON.stringify(history));
  } catch (e) {
    console.error('Error saving scan history for', userId, e);
  }
}

export function clearUserScanHistory(userId: string): void {
  const sanitized = sanitizeUserId(userId);
  const key = `ecocampus_scan_history_${sanitized}`;
  try {
    localStorage.setItem(key, JSON.stringify([]));
  } catch (e) {
    console.error('Error clearing scan history for', userId, e);
  }
}

// --- User Wishlist & Cart (Isolated per user) ---

export function getUserWishlist(userId: string): string[] {
  const sanitized = sanitizeUserId(userId);
  const key = `ecocampus_wishlist_${sanitized}`;
  try {
    const data = localStorage.getItem(key);
    if (data) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {
    console.error(e);
  }
  if (sanitized === 'usr_fatur_01' || sanitized === 'usr_demo_01') {
    const initial = ['reuse_01', 'reuse_05'];
    saveUserWishlist(userId, initial);
    return initial;
  }
  return [];
}

export function saveUserWishlist(userId: string, wishlist: string[]): void {
  const sanitized = sanitizeUserId(userId);
  try {
    localStorage.setItem(`ecocampus_wishlist_${sanitized}`, JSON.stringify(wishlist));
  } catch (e) {
    console.error(e);
  }
}

export function getUserCart(userId: string): string[] {
  const sanitized = sanitizeUserId(userId);
  const key = `ecocampus_cart_${sanitized}`;
  try {
    const data = localStorage.getItem(key);
    if (data) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {
    console.error(e);
  }
  if (sanitized === 'usr_fatur_01' || sanitized === 'usr_demo_01') {
    const initial = ['reuse_02', 'reuse_04'];
    saveUserCart(userId, initial);
    return initial;
  }
  return [];
}

export function saveUserCart(userId: string, cart: string[]): void {
  const sanitized = sanitizeUserId(userId);
  try {
    localStorage.setItem(`ecocampus_cart_${sanitized}`, JSON.stringify(cart));
  } catch (e) {
    console.error(e);
  }
}

// --- Forum Likes (Isolated per user) ---

export function getUserForumLikes(userId: string): string[] {
  const sanitized = sanitizeUserId(userId);
  const key = `ecocampus_forum_likes_${sanitized}`;
  try {
    const data = localStorage.getItem(key);
    if (data) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {
    console.error(e);
  }
  if (sanitized === 'usr_fatur_01' || sanitized === 'usr_demo_01') {
    const initial = ['post_02'];
    saveUserForumLikes(userId, initial);
    return initial;
  }
  return [];
}

export function saveUserForumLikes(userId: string, likes: string[]): void {
  const sanitized = sanitizeUserId(userId);
  try {
    localStorage.setItem(`ecocampus_forum_likes_${sanitized}`, JSON.stringify(likes));
  } catch (e) {
    console.error(e);
  }
}

// --- User Notifications (Isolated per user) ---

export function getUserNotifications(userId: string, profile?: UserProfile): AppNotification[] {
  const sanitized = sanitizeUserId(userId);
  const notifKey = `ecocampus_notifications_${sanitized}`;
  try {
    const data = localStorage.getItem(notifKey);
    if (data) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {
    console.error(e);
  }

  let initial: AppNotification[] = [];
  if (sanitized === 'usr_fatur_01' || sanitized === 'usr_demo_01') {
    initial = [
      {
        id: 'notif_f1',
        userId: sanitized,
        title: 'Selamat Datang di EcoCampus UNM',
        message: 'Akun mahasiswa aktif Anda terhubung dengan program Green Metric UNM 2026.',
        timestamp: '12 Sep 2026, 08:00 WITA',
        type: 'system',
        read: true,
        linkTab: 'dashboard',
      },
      {
        id: 'notif_f2',
        userId: sanitized,
        title: 'Poin Setoran +255 Pts Terverifikasi',
        message: 'Setoran botol plastik 5.5 kg di Drop Point FT UNM Parangtambung telah divalidasi oleh petugas.',
        timestamp: '12 Sep 2026, 09:30 WITA',
        type: 'deposit',
        read: true,
        linkTab: 'dashboard',
      },
      {
        id: 'notif_f3',
        userId: sanitized,
        title: 'Tantangan Hari ke-2 Selesai!',
        message: 'Selamat! Anda memperoleh 50 Eco-Points & 100 XP karena membawa tumbler ramah lingkungan di kampus.',
        timestamp: '12 Sep 2026, 12:45 WITA',
        type: 'challenge',
        read: false,
        linkTab: 'gamifikasi',
      },
    ];
  } else if (sanitized === 'usr_operator_01') {
    initial = [
      {
        id: 'notif_op1',
        userId: sanitized,
        title: 'Portal Petugas TPST Aktif',
        message: 'Selamat bertugas di TPST Kampus Parangtambung UNM. Timbangan digital dan modul VRP armada siap digunakan.',
        timestamp: 'Hari ini, 07:00 WITA',
        type: 'system',
        read: false,
        linkTab: 'dashboard',
      },
      {
        id: 'notif_op2',
        userId: sanitized,
        title: 'Permintaan Penjemputan Baru',
        message: 'Ada permohonan penjemputan sampah anorganik terpilah di Gedung Dekanat FT UNM.',
        timestamp: 'Hari ini, 09:15 WITA',
        type: 'deposit',
        read: false,
        linkTab: 'dashboard',
      },
    ];
  } else if (sanitized === 'usr_admin_01' || sanitized === 'usr_admin_dev_01') {
    initial = [
      {
        id: 'notif_ad1',
        userId: sanitized,
        title: 'Dasbor Audit & Monitoring UNM',
        message: 'Sistem audit sirkularitas kampus UNM aktif. Ringkasan emisi karbon dan buku besar dapat diunduh.',
        timestamp: 'Hari ini, 08:00 WITA',
        type: 'system',
        read: false,
        linkTab: 'dashboard',
      },
    ];
  } else {
    initial = [
      {
        id: `notif_gen_${Date.now()}`,
        userId: sanitized,
        title: 'Selamat Bergabung di EcoCampus UNM! 🌱',
        message: `Halo ${profile?.name || 'Sivitas Akademika'}! Mulai pilah sampah kos atau jual/hibahkan barang bekas di Bursa Reuse UNM.`,
        timestamp: 'Baru saja',
        type: 'system',
        read: false,
        linkTab: 'dashboard',
      },
    ];
  }

  saveUserNotifications(userId, initial);
  return initial;
}

export function saveUserNotifications(userId: string, notifications: AppNotification[]): void {
  const sanitized = sanitizeUserId(userId);
  try {
    localStorage.setItem(`ecocampus_notifications_${sanitized}`, JSON.stringify(notifications));
  } catch (e) {
    console.error(e);
  }
}

export function markNotificationAsRead(userId: string, notifId: string): void {
  const current = getUserNotifications(userId);
  const updated = current.map((n) => (n.id === notifId ? { ...n, read: true } : n));
  saveUserNotifications(userId, updated);
}

export function markAllNotificationsAsRead(userId: string): void {
  const current = getUserNotifications(userId);
  const updated = current.map((n) => ({ ...n, read: true }));
  saveUserNotifications(userId, updated);
}

// --- User Pickup Requests (Isolated per user) ---

export function getUserPickupRequests(userId: string): PickupRequest[] {
  const sanitized = sanitizeUserId(userId);
  const key = `ecocampus_pickup_requests_${sanitized}`;
  try {
    const saved = localStorage.getItem(key);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {
    console.error(e);
  }
  // Default for Fatur: 1 sample scheduled request
  if (sanitized === 'usr_fatur_01' || sanitized === 'usr_demo_01') {
    const initial: PickupRequest[] = [
      {
        id: 'req_pickup_01',
        userId: sanitized,
        userName: 'Muh. Fatur Rahman',
        facultyLocation: 'Fakultas Teknik',
        exactAddress: 'Lobi Gedung Elektro & Komputer FT UNM Parangtambung',
        wasteTypes: ['plastik', 'kertas'],
        estimatedWeightKg: 6.5,
        contactWhatsapp: '081244556677',
        notes: 'Kardus tugas kuliah dan botol PET sudah dipisah dalam 2 karung rapi.',
        status: 'scheduled',
        createdAt: '12 Sep 2026, 09:00 WITA',
      },
    ];
    saveUserPickupRequests(userId, initial);
    return initial;
  }
  return [];
}

export function saveUserPickupRequests(userId: string, requests: PickupRequest[]): void {
  const sanitized = sanitizeUserId(userId);
  try {
    localStorage.setItem(`ecocampus_pickup_requests_${sanitized}`, JSON.stringify(requests));
  } catch (e) {
    console.error(e);
  }
}

// --- Backward-compatible delegates (auto-scoped to active session) ---

export function getStoredScanHistory(userId?: string): ScanHistoryItem[] {
  if (userId) return getUserScanHistory(userId);
  try {
    const active = localStorage.getItem('ecocampus_active_user_id');
    if (active) return getUserScanHistory(active);
  } catch {}
  return getUserScanHistory('usr_fatur_01');
}

export function saveStoredScanHistory(history: ScanHistoryItem[], userId?: string): void {
  if (userId) return saveUserScanHistory(userId, history);
  try {
    const active = localStorage.getItem('ecocampus_active_user_id');
    if (active) return saveUserScanHistory(active, history);
  } catch {}
  return saveUserScanHistory('usr_fatur_01', history);
}

export function getStoredChallenges(userId?: string): DailyChallenge[] {
  if (userId) return getUserChallenges(userId);
  try {
    const active = localStorage.getItem('ecocampus_active_user_id');
    if (active) return getUserChallenges(active);
  } catch {}
  return getUserChallenges('usr_fatur_01');
}

export function saveStoredChallenges(challenges: DailyChallenge[], userId?: string): void {
  if (userId) return saveUserChallenges(userId, challenges);
  try {
    const active = localStorage.getItem('ecocampus_active_user_id');
    if (active) return saveUserChallenges(active, challenges);
  } catch {}
  return saveUserChallenges('usr_fatur_01', challenges);
}

export function getStoredUser(userId?: string): UserProfile {
  if (userId) return getUserProfile(userId);
  try {
    const active = localStorage.getItem('ecocampus_active_user_id');
    if (active) return getUserProfile(active);
    const saved = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && parsed.id) return getUserProfile(parsed.id, parsed);
    }
  } catch {}
  return getUserProfile('usr_fatur_01');
}

export function saveStoredUser(user: UserProfile): void {
  if (user && user.id) {
    saveUserProfile(user.id, user);
  }
}

function getChatStorageKey(userId: string): string {
  const sanitized = sanitizeUserId(userId);
  return `${STORAGE_KEYS.CHAT_THREADS_PREFIX}${sanitized}`;
}

function getInitialThreadsForUser(userId: string, userName?: string): ChatThread[] {
  // 1. Perspective: Fatur (usr_fatur_01 or demo)
  if (userId === 'usr_fatur_01' || userId === 'usr_demo_01') {
    return INITIAL_CHAT_THREADS;
  }

  // 2. Perspective: Ahmad Fauzi (usr_ahmad_03)
  if (userId === 'usr_ahmad_03') {
    return [
      {
        id: 'thread_ahmad_fatur',
        participantId: 'usr_fatur_01',
        participantName: 'Muh. Fatur Rahman',
        participantAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=250&q=80',
        participantRole: 'Mahasiswa (Informatika 22)',
        participantFaculty: 'Fakultas Teknik',
        onlineStatus: 'online',
        lastMessage: 'Halo bro! Buku kalkulusnya masih ada, besok bisa COD di Lobi FT jam istirahat ya.',
        lastTimestamp: '10:15 WITA',
        unreadCount: 0,
        itemContext: {
          id: 'reuse_01',
          title: 'Buku Kalkulus Stewart Edisi 8',
          imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
          price: 'GRATIS (Hibah)',
        },
        messages: [
          {
            id: 'msg_af_1',
            senderId: 'usr_fatur_01',
            senderName: 'Muh. Fatur Rahman',
            recipientId: 'usr_ahmad_03',
            recipientName: 'Ahmad Fauzi',
            text: 'Halo kak Ahmad, saya mahasiswa Informatika angkatan 22. Buku kalkulus Stewart edisi 8 yang dihibahkan masih ada?',
            timestamp: '09:40 WITA',
            isSelf: false,
            itemTitle: 'Buku Kalkulus Stewart Edisi 8',
          },
          {
            id: 'msg_af_2',
            senderId: 'usr_ahmad_03',
            senderName: 'Ahmad Fauzi',
            recipientId: 'usr_fatur_01',
            recipientName: 'Muh. Fatur Rahman',
            text: 'Halo bro! Buku kalkulusnya masih ada, besok bisa COD di Lobi FT jam istirahat ya.',
            timestamp: '10:15 WITA',
            isSelf: true,
          },
        ],
      },
    ];
  }

  // 3. Perspective: Operator TPST (usr_operator_01)
  if (userId === 'usr_operator_01') {
    return [
      {
        id: 'thread_operator_fatur',
        participantId: 'usr_fatur_01',
        participantName: 'Muh. Fatur Rahman',
        participantAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=250&q=80',
        participantRole: 'Mahasiswa (Informatika 22)',
        participantFaculty: 'Fakultas Teknik',
        onlineStatus: 'online',
        lastMessage: 'Setoran botol PET 4.2 kg Anda sudah terverifikasi di buku besar, poin 147 pts sudah masuk!',
        lastTimestamp: 'Kemarin',
        unreadCount: 0,
        messages: [
          {
            id: 'msg_jf_1',
            senderId: 'usr_fatur_01',
            senderName: 'Muh. Fatur Rahman',
            recipientId: 'usr_operator_01',
            recipientName: 'Baharuddin S.Pd. (Petugas TPST)',
            text: 'Pak Baharuddin, tadi saya titip kardus dan botol di drop box lobi FT. Apakah sudah ditimbang?',
            timestamp: 'Kemarin, 14:10 WITA',
            isSelf: false,
          },
          {
            id: 'msg_jf_2',
            senderId: 'usr_operator_01',
            senderName: 'Baharuddin S.Pd. (Petugas TPST)',
            recipientId: 'usr_fatur_01',
            recipientName: 'Muh. Fatur Rahman',
            text: 'Setoran botol PET 4.2 kg Anda sudah terverifikasi di buku besar, poin 147 pts sudah masuk!',
            timestamp: 'Kemarin, 15:30 WITA',
            isSelf: true,
          },
        ],
      },
    ];
  }

  // 4. Perspective: Nurul Hidayah (usr_nurul_02)
  if (userId === 'usr_nurul_02') {
    return [
      {
        id: 'thread_nurul_fatur',
        participantId: 'usr_fatur_01',
        participantName: 'Muh. Fatur Rahman',
        participantAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=250&q=80',
        participantRole: 'Mahasiswa (Informatika 22)',
        participantFaculty: 'Fakultas Teknik',
        onlineStatus: 'online',
        lastMessage: 'Bisa kak, kalau mau bayar pakai Eco-Points juga boleh langsung di sistem.',
        lastTimestamp: '2 hari lalu',
        unreadCount: 0,
        itemContext: {
          id: 'reuse_02',
          title: 'Set Meja Gambar Portable A2',
          imageUrl: 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&w=600&q=80',
          price: 'Rp 45.000 / 50 Pts',
        },
        messages: [
          {
            id: 'msg_nf_1',
            senderId: 'usr_fatur_01',
            senderName: 'Muh. Fatur Rahman',
            recipientId: 'usr_nurul_02',
            recipientName: 'Nurul Hidayah',
            text: 'Halo Nurul, meja gambarnya apakah penggaris T-nya masih lurus presisi?',
            timestamp: '2 hari lalu',
            isSelf: false,
          },
          {
            id: 'msg_nf_2',
            senderId: 'usr_nurul_02',
            senderName: 'Nurul Hidayah',
            recipientId: 'usr_fatur_01',
            recipientName: 'Muh. Fatur Rahman',
            text: 'Bisa kak, kalau mau bayar pakai Eco-Points juga boleh langsung di sistem.',
            timestamp: '2 hari lalu',
            isSelf: true,
          },
        ],
      },
    ];
  }

  // 5. Perspective: Admin Kampus (usr_admin_01 or usr_admin_dev_01)
  if (userId === 'usr_admin_01' || userId === 'usr_admin_dev_01') {
    return [
      {
        id: `thread_admin_tpst_${userId}`,
        participantId: 'usr_operator_01',
        participantName: 'Baharuddin S.Pd. (Petugas TPST)',
        participantAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=250&q=80',
        participantRole: 'Koordinator TPST Parangtambung',
        participantFaculty: 'Unit Pengelolaan Lingkungan & Sarpras UNM',
        onlineStatus: 'online',
        lastMessage: 'Laporan timbangan mingguan sudah divalidasi ke buku besar UNM, Bu Dokter.',
        lastTimestamp: 'Hari ini, 08:30 WITA',
        unreadCount: 1,
        messages: [
          {
            id: `msg_ad_1_${Date.now()}`,
            senderId: 'usr_operator_01',
            senderName: 'Baharuddin S.Pd. (Petugas TPST)',
            recipientId: userId,
            recipientName: userName || 'Admin Kampus UNM',
            text: 'Selamat pagi Bu/Pak Pengelola, laporan akumulasi sampah anorganik terpilah minggu ini di Parangtambung dan Gunungsari telah sinkron dengan sistem audit.',
            timestamp: 'Hari ini, 08:30 WITA',
            isSelf: false,
          },
        ],
      },
    ];
  }

  // 6. Default fresh account: Official Welcoming conversation
  return [
    {
      id: `thread_welcome_${userId}`,
      participantId: 'usr_operator_01',
      participantName: 'Baharuddin S.Pd. (Petugas TPST)',
      participantAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=250&q=80',
      participantRole: 'Koordinator TPST Parangtambung',
      participantFaculty: 'Unit Pengelolaan Lingkungan & Sarpras UNM',
      onlineStatus: 'online',
      lastMessage: 'Selamat datang di EcoCampus UNM! Hubungi kami jika ingin janjian penjemputan sampah terpilah di kampus.',
      lastTimestamp: 'Hari ini',
      unreadCount: 1,
      messages: [
        {
          id: `msg_welcome_${Date.now()}`,
          senderId: 'usr_operator_01',
          senderName: 'Baharuddin S.Pd. (Petugas TPST)',
          recipientId: userId,
          recipientName: userName || 'Sivitas Kampus',
          text: `Halo ${userName || 'Rekan Kampus'}! Selamat datang di platform EcoCampus UNM. Jika Anda memerlukan koordinasi drop box sampah atau transaksi bursa reuse di lingkungan UNM, Anda bisa mengobrol langsung di sini. Salam lestari! 🌱`,
          timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WITA',
          isSelf: false,
        },
      ],
    },
  ];
}

/**
 * Retrieve chat threads strictly isolated to the specified userId.
 */
export function getStoredUserChatThreads(userId: string, userName?: string): ChatThread[] {
  if (!userId) return [];
  try {
    const key = getChatStorageKey(userId);
    const data = localStorage.getItem(key);
    if (data) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Error reading chat threads for user:', userId, e);
  }

  // Initialize and persist tailored initial threads
  const initial = getInitialThreadsForUser(userId, userName);
  saveStoredUserChatThreads(userId, initial);
  return initial;
}

/**
 * Persist chat threads strictly isolated to the specified userId.
 */
export function saveStoredUserChatThreads(userId: string, threads: ChatThread[]): void {
  if (!userId) return;
  try {
    const key = getChatStorageKey(userId);
    localStorage.setItem(key, JSON.stringify(threads));
  } catch (e) {
    console.error('Error saving chat threads for user:', userId, e);
  }
}

/**
 * Clear chat threads storage for a specific userId.
 */
export function clearStoredUserChatThreads(userId: string): void {
  if (!userId) return;
  try {
    const key = getChatStorageKey(userId);
    localStorage.removeItem(key);
  } catch (e) {
    console.error('Error clearing chat threads for user:', userId, e);
  }
}

/**
 * Deliver a message across accounts to the recipient's isolated mailbox.
 * This guarantees real P2P message delivery without global state leaks or auto-replies.
 */
export function deliverMessageToRecipient(
  recipientId: string,
  message: ChatMessage,
  senderUser: UserProfile,
  itemContext?: any
): void {
  if (!recipientId || recipientId === senderUser.id) return;
  try {
    const recipientThreads = getStoredUserChatThreads(recipientId);
    let matchedThread = recipientThreads.find(
      (t) => t.participantId === senderUser.id || t.participantName.toLowerCase() === senderUser.name.toLowerCase()
    );

    const receivedMessage: ChatMessage = {
      ...message,
      isSelf: false,
    };

    if (matchedThread) {
      // Guard against duplicates
      const isDuplicate = matchedThread.messages.some((m) => m.id === message.id);
      if (!isDuplicate) {
        matchedThread.messages.push(receivedMessage);
        matchedThread.lastMessage = message.text;
        matchedThread.lastTimestamp = message.timestamp || 'Baru saja';
        matchedThread.unreadCount = (matchedThread.unreadCount || 0) + 1;
        if (itemContext && !matchedThread.itemContext) {
          matchedThread.itemContext = itemContext;
        }
      }
    } else {
      // Create new inbound thread for recipient
      const newThread: ChatThread = {
        id: `thread_inbound_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        participantId: senderUser.id,
        participantName: senderUser.name,
        participantAvatar: senderUser.avatarUrl,
        participantRole: senderUser.role === 'petugas_tps' ? 'Petugas TPST' : 'Mahasiswa',
        participantFaculty: senderUser.faculty,
        onlineStatus: 'online',
        lastMessage: message.text,
        lastTimestamp: message.timestamp || 'Baru saja',
        unreadCount: 1,
        itemContext,
        messages: [receivedMessage],
      };
      recipientThreads.unshift(newThread);
    }

    saveStoredUserChatThreads(recipientId, recipientThreads);
  } catch (e) {
    console.error('Error delivering message to recipient mailbox:', e);
  }
}

// ==========================================
// 3R (REDUCE, REUSE, RECYCLE) STORAGE ENGINE
// ==========================================

export const REDUCE_ACTION_DEFINITIONS: ReduceActionDefinition[] = [
  {
    key: 'tumbler',
    title: 'Bawa Tumbler Pribadi',
    category: 'Wadah Makanan & Minuman',
    description: 'Mengisi ulang air minum di kampus tanpa membeli air mineral kemasan plastik (AMDK) sekali pakai.',
    pointsEarned: 10,
    xpEarned: 15,
    wastePreventedGrams: 25,
    co2PreventedGrams: 80,
    iconName: 'Droplet',
    tips: 'Isi ulang gratis di Water Station Menara Pinisi & Gedung Laboratorium Terpadu Parangtambung.',
  },
  {
    key: 'lunchbox',
    title: 'Wadah Makan Sendiri (Mistik)',
    category: 'Wadah Makanan & Minuman',
    description: 'Membawa bekal atau wadah sendiri saat jajan di kantin kampus, menolak styrofoam & bungkus plastik minyak.',
    pointsEarned: 15,
    xpEarned: 20,
    wastePreventedGrams: 35,
    co2PreventedGrams: 110,
    iconName: 'Utensils',
    tips: 'Mitra Kantin Hijau UNM memberikan porsi ekstra atau potongan harga bagi yang membawa wadah makan sendiri.',
  },
  {
    key: 'tote_bag',
    title: 'Tolak Kresek / Bawa Tote Bag',
    category: 'Belanja & Fotokopi',
    description: 'Menolak kantong plastik sekali pakai saat fotokopi modul, beli ATK, atau berbelanja di sekitar kampus.',
    pointsEarned: 10,
    xpEarned: 10,
    wastePreventedGrams: 15,
    co2PreventedGrams: 50,
    iconName: 'ShoppingBag',
    tips: 'Selalu selipkan 1 tas belanja kain lipat di ransel kuliahmu sebelum berangkat ke kampus.',
  },
  {
    key: 'paperless',
    title: 'Tugas Paperless & LMS SYAM-OK',
    category: 'Akademik & Tugas',
    description: 'Mengumpulkan tugas, makalah, atau laporan praktikum secara digital di SYAM-OK tanpa cetak kertas HVS.',
    pointsEarned: 10,
    xpEarned: 15,
    wastePreventedGrams: 50,
    co2PreventedGrams: 65,
    iconName: 'FileText',
    tips: 'Gunakan format PDF terkompresi dan mintalah review digital kepada dosen pengampu.',
  },
  {
    key: 'reusable_cutlery',
    title: 'Sendok & Sedotan Guna Ulang',
    category: 'Wadah Makanan & Minuman',
    description: 'Menolak sedotan plastik dan sendok plastik sekali pakai saat menikmati minuman es atau jajanan kampus.',
    pointsEarned: 5,
    xpEarned: 10,
    wastePreventedGrams: 8,
    co2PreventedGrams: 25,
    iconName: 'Sparkles',
    tips: 'Bawa sedotan stainless/bambu dan sendok travel ringkas di saku tas ranselmu.',
  },
  {
    key: 'digital_notes',
    title: 'Catatan Kuliah Digital / E-Book Diktat',
    category: 'Akademik & Tugas',
    description: 'Mencatat materi kuliah menggunakan tablet/laptop dan membaca buku diktat berformat digital dari perpustakaan.',
    pointsEarned: 15,
    xpEarned: 20,
    wastePreventedGrams: 80,
    co2PreventedGrams: 105,
    iconName: 'BookOpen',
    tips: 'Perpustakaan Digital UNM menyediakan ribuan e-book dan jurnal bereputasi gratis bagi sivitas akademika.',
  },
];

export function getUserReduceActions(userId: string): ReduceActionLog[] {
  const sanitized = sanitizeUserId(userId);
  const key = `${STORAGE_KEYS.REDUCE_ACTIONS_PREFIX}${sanitized}`;
  try {
    const raw = localStorage.getItem(key);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {
    console.error('Failed to load user reduce actions:', e);
  }

  // Initial demonstration actions
  const initialLogs: ReduceActionLog[] = [
    {
      id: `red_init_1_${sanitized}`,
      userId,
      actionKey: 'tumbler',
      title: 'Bawa Tumbler Pribadi',
      pointsEarned: 10,
      xpEarned: 15,
      wastePreventedGrams: 25,
      co2PreventedGrams: 80,
      timestamp: 'Hari ini, 08:30 WITA',
      notes: 'Refill air di Water Station Menara Pinisi Lt. 1',
    },
    {
      id: `red_init_2_${sanitized}`,
      userId,
      actionKey: 'tote_bag',
      title: 'Tolak Kresek / Bawa Tote Bag',
      pointsEarned: 10,
      xpEarned: 10,
      wastePreventedGrams: 15,
      co2PreventedGrams: 50,
      timestamp: 'Kemarin, 14:15 WITA',
      notes: 'Fotokopi modul Algoritma Pemrograman di Parangtambung',
    },
    {
      id: `red_init_3_${sanitized}`,
      userId,
      actionKey: 'paperless',
      title: 'Tugas Paperless & LMS SYAM-OK',
      pointsEarned: 10,
      xpEarned: 15,
      wastePreventedGrams: 50,
      co2PreventedGrams: 65,
      timestamp: '2 hari lalu, 19:40 WITA',
      notes: 'Pengumpulan proposal praktikum via portal SYAM-OK UNM',
    },
  ];

  saveUserReduceActions(userId, initialLogs);
  return initialLogs;
}

export function saveUserReduceActions(userId: string, logs: ReduceActionLog[]): void {
  const sanitized = sanitizeUserId(userId);
  const key = `${STORAGE_KEYS.REDUCE_ACTIONS_PREFIX}${sanitized}`;
  try {
    localStorage.setItem(key, JSON.stringify(logs));
  } catch (e) {
    console.error('Failed to save user reduce actions:', e);
  }
}

export function logUserReduceAction(
  userId: string,
  actionKey: ReduceActionKey,
  notes?: string
): { log: ReduceActionLog; pointsEarned: number; xpEarned: number } {
  const def = REDUCE_ACTION_DEFINITIONS.find((d) => d.key === actionKey) || REDUCE_ACTION_DEFINITIONS[0];
  const now = new Date();
  const timeStr = `Hari ini, ${now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WITA`;

  const newLog: ReduceActionLog = {
    id: `red_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    userId,
    actionKey,
    title: def.title,
    pointsEarned: def.pointsEarned,
    xpEarned: def.xpEarned,
    wastePreventedGrams: def.wastePreventedGrams,
    co2PreventedGrams: def.co2PreventedGrams,
    timestamp: timeStr,
    notes: notes || def.tips,
  };

  const existing = getUserReduceActions(userId);
  const updated = [newLog, ...existing];
  saveUserReduceActions(userId, updated);

  // Automatically credit points and XP to user profile
  try {
    const profile = getUserProfile(userId);
    profile.ecoPoints = (profile.ecoPoints || 0) + def.pointsEarned;
    profile.xp = (profile.xp || 0) + def.xpEarned;
    // Check level progression (e.g. 100 XP per level)
    profile.level = Math.floor(profile.xp / 100) + 1;
    saveUserProfile(userId, profile);
  } catch (e) {
    console.error('Failed to update user profile points for reduce action:', e);
  }

  return {
    log: newLog,
    pointsEarned: def.pointsEarned,
    xpEarned: def.xpEarned,
  };
}

// ==========================================
// TRANSACTIONS PERSISTENCE ENGINE
// ==========================================

export function getStoredTransactions(): LedgerTransaction[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.error('Failed to load stored transactions:', e);
  }
  // Fallback to initial seed transactions and save them
  saveStoredTransactions(INITIAL_LEDGER_TRANSACTIONS);
  return INITIAL_LEDGER_TRANSACTIONS;
}

export function saveStoredTransactions(txs: LedgerTransaction[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(txs));
  } catch (e) {
    console.error('Failed to save stored transactions:', e);
  }
}

// ==========================================
// 3R COMPREHENSIVE METRICS SUMMARY
// ==========================================

export function getR3MetricsSummary(userId?: string): R3MetricsSummary {
  // 1. REDUCE METRICS
  let totalWastePreventedGrams = 245000; // Baseline campus 245 kg
  let totalReduceActionsCount = 3840; // Campus baseline actions
  let estimatedSingleUseBottlesSaved = 5820;

  if (userId) {
    const userActions = getUserReduceActions(userId);
    const userPreventedGrams = userActions.reduce((acc, a) => acc + (a.wastePreventedGrams || 0), 0);
    totalWastePreventedGrams += userPreventedGrams;
    totalReduceActionsCount += userActions.length;
    const userBottles = userActions.filter((a) => a.actionKey === 'tumbler').length;
    estimatedSingleUseBottlesSaved += userBottles;
  }

  // 2. REUSE METRICS
  const reuseItems = getStoredReuseItems();
  const claimedCount = reuseItems.filter((i) => i.status === 'claimed').length;
  const totalItemsReusedCount = 428 + claimedCount;
  const totalReuseTransactionsRupiah = 14850000;

  // 3. RECYCLE METRICS
  const txs = getStoredTransactions();
  const verifiedTxs = txs.filter((t) => t.status === 'verified');
  const totalWasteRecycledKg = Math.round(
    1820 + verifiedTxs.reduce((acc, t) => acc + (t.totalWeightKg || 0), 0)
  );
  const totalRecyclePointsEarned = 24600 + verifiedTxs.reduce((acc, t) => acc + (t.totalPoints || 0), 0);

  // 4. TOTAL CO2 SAVINGS (From Reduce + Recycle)
  const co2FromRecycleKg = totalWasteRecycledKg * 2.8;
  const co2FromReduceKg = totalWastePreventedGrams / 1000 * 2.5;
  const totalCo2SavedKg = Math.round(co2FromRecycleKg + co2FromReduceKg);

  return {
    totalWastePreventedGrams,
    totalReduceActionsCount,
    estimatedSingleUseBottlesSaved,
    totalItemsReusedCount,
    totalReuseTransactionsRupiah,
    totalWasteRecycledKg,
    totalRecyclePointsEarned,
    totalCo2SavedKg,
  };
}
