import { ReuseItem, ItemRequest, ScanHistoryItem, DailyChallenge, UserProfile } from '../types';
import { REUSE_ITEMS, INITIAL_USER } from '../data/mockData';

const STORAGE_KEYS = {
  REUSE_ITEMS: 'ecocampus_reuse_items_v2',
  ITEM_REQUESTS: 'ecocampus_item_requests_v2',
  SCAN_HISTORY: 'ecocampus_scan_history_v2',
  CHALLENGES: 'ecocampus_daily_challenges_v2',
  USER_PROFILE: 'ecocampus_user_profile_v2',
};

// Safe COD Spots standard recommendations
export const SAFE_COD_SPOTS = [
  'Lobi Utama Gedung Fakultas Teknik (Gedung Sipil & Elektro)',
  'Perpustakaan Pusat Kampus (Area Diskusi Lt. 1)',
  'Pusat Jajanan & Kantin Ramsis Kampus',
  'Halte Bus Damri Kampus Pintu 1',
  'Lobi Rektorat & Gedung PKM Kampus',
  'Pos Security Pintu 2 Kampus',
  'Taman Danau Lingkungan Unhas',
];

export const INITIAL_ITEM_REQUESTS: ItemRequest[] = [
  {
    id: 'req_01',
    userId: 'usr_fatur_01',
    userName: 'Muh. Fatur Rahman',
    userEmail: 'fatur@gmail.com',
    title: 'Dicari: Kardus Bekas Ukuran Sedang untuk Pindahan Kos',
    description: 'Halo rekan-rekan, butuh 4-5 kardus mi instan/air mineral bekas yang masih kokoh untuk beres-beres kosan akhir semester. Siap ambil di sekitar kampus.',
    category: 'Peralatan Kos',
    urgency: 'Segera',
    preferredCodSpot: 'Lobi Utama Gedung Fakultas Teknik',
    createdAt: '2 jam yang lalu',
    responsesCount: 2,
    status: 'open',
    contactWhatsapp: '081234567890',
  },
  {
    id: 'req_02',
    userId: 'usr_nurul_02',
    userName: 'Nurul Hidayah',
    userEmail: 'nurul@gmail.com',
    title: 'Dicari: Buku Ajar Kalkulus & Fisika Dasar Preloved',
    description: 'Mencari buku ajar bekas mata kuliah kalkulus atau fisika teknik semester 1-2. Yang edisi lama tidak apa-apa asal halaman masih lengkap.',
    category: 'Buku & Diktat',
    urgency: 'Santai',
    preferredCodSpot: 'Perpustakaan Pusat Kampus (Area Diskusi Lt. 1)',
    createdAt: 'Kemarin',
    responsesCount: 4,
    status: 'open',
    contactWhatsapp: '082198765432',
  },
  {
    id: 'req_03',
    userId: 'usr_ahmad_03',
    userName: 'Ahmad Fauzi',
    userEmail: 'ahmad@gmail.com',
    title: 'Dicari: Stopkontak / Kabel Roll Bekas Kosan',
    description: 'Butuh kabel roll 3-4 lubang yang masih berfungsi normal dengan aman. Boleh barter dengan tumbler atau buku novel santai.',
    category: 'Elektronik & Kos',
    urgency: 'Fleksibel',
    preferredCodSpot: 'Pusat Jajanan & Kantin Ramsis Kampus',
    createdAt: '2 hari yang lalu',
    responsesCount: 1,
    status: 'open',
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
    if (data) return JSON.parse(data);
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

export function getStoredScanHistory(): ScanHistoryItem[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.SCAN_HISTORY);
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error(e);
  }
  return INITIAL_SCAN_HISTORY;
}

export function saveStoredScanHistory(history: ScanHistoryItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.SCAN_HISTORY, JSON.stringify(history));
  } catch (e) {
    console.error(e);
  }
}

export function getStoredChallenges(): DailyChallenge[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.CHALLENGES);
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error(e);
  }
  return INITIAL_DAILY_CHALLENGES;
}

export function saveStoredChallenges(challenges: DailyChallenge[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.CHALLENGES, JSON.stringify(challenges));
  } catch (e) {
    console.error(e);
  }
}

export function getStoredUser(): UserProfile {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error(e);
  }
  return INITIAL_USER;
}

export function saveStoredUser(user: UserProfile): void {
  try {
    localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(user));
  } catch (e) {
    console.error(e);
  }
}
