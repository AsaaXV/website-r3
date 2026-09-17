import {
  Survey,
  SurveyStatus,
  SurveyQuestion,
  SurveyResponse,
  SurveyAnswer,
  RoleRequest,
  ReuseCategory,
  OfficialCommunityPost,
  UserRole,
} from '../types';

const STORAGE_KEYS = {
  SURVEYS: 'ecocampus_dynamic_surveys_v2',
  SURVEY_RESPONSES: 'ecocampus_survey_responses_v2',
  ROLE_REQUESTS: 'ecocampus_role_requests_v1',
  CATEGORIES: 'ecocampus_dynamic_categories_v1',
  OFFICIAL_POSTS: 'ecocampus_official_posts_v1',
};

// ============================================================
// 1. INITIAL DYNAMIC SURVEYS
// ============================================================
export const INITIAL_SURVEYS: Survey[] = [
  {
    id: 'survey_ecocampus_unm_2026',
    title: 'Survei Evaluasi Usabilitas & Dampak Ekologis EcoCampus UNM 2026',
    description:
      'Kuesioner resmi Direktorat Green Campus & Sarpras UNM untuk mengevaluasi kegunaan aplikasi, efektivitas Bursa Reuse, dan kebiasaan pemilahan sampah di lingkungan kampus UNM (Parangtambung, Gunungsari, Banta-Bantaeng).',
    status: 'published',
    startDateTime: '2026-09-01T08:00',
    endDateTime: '2026-10-31T23:59',
    startDate: '2026-09-01',
    endDate: '2026-10-31',
    createdBy: 'Direktorat Green Campus UNM',
    creatorId: 'usr_admin_01',
    createdAt: '2026-09-01T08:00:00Z',
    updatedAt: '2026-09-10T14:30:00Z',
    allowResubmission: false,
    questions: [
      {
        id: 'q_unm_1',
        surveyId: 'survey_ecocampus_unm_2026',
        question: 'Seberapa mudah antarmuka aplikasi EcoCampus 3R UNM digunakan dalam aktivitas perkuliahan Anda?',
        type: 'likert',
        required: true,
        order: 1,
        scaleMin: 1,
        scaleMax: 5,
        scaleLabels: { min: 'Sangat Sulit', max: 'Sangat Mudah' },
      },
      {
        id: 'q_unm_2',
        surveyId: 'survey_ecocampus_unm_2026',
        question: 'Fitur apa yang paling bermanfaat dan sering Anda akses di platform EcoCampus?',
        type: 'single_choice',
        required: true,
        order: 2,
        options: [
          'Bursa Reuse Kampus (Jual/Hibah/Cari)',
          'Scan AI Material & Klasifikasi Sampah',
          'Gamifikasi & Tantangan 7 Hari Hijau',
          'Buku Kas Digital & Audit TPST',
          'Edukasi Pilah 3R & Jejak Karbon',
        ],
      },
      {
        id: 'q_unm_3',
        surveyId: 'survey_ecocampus_unm_2026',
        question: 'Apakah Anda bersedia menyetorkan sampah terpilah (kardus/botol PET) secara rutin di drop box kampus UNM?',
        type: 'yes_no',
        required: true,
        order: 3,
      },
      {
        id: 'q_unm_4',
        surveyId: 'survey_ecocampus_unm_2026',
        question: 'Kategori barang apa yang paling sering Anda butuhkan atau cari di Bursa Reuse UNM?',
        type: 'multiple_choice',
        required: false,
        order: 4,
        options: [
          'Buku & Diktat Kuliah',
          'Peralatan Kos & Elektronik',
          'Alat Lab & Gambar Teknik',
          'Fashion & Sepatu Praktikum',
          'Furniture Kamar Kos',
        ],
      },
      {
        id: 'q_unm_5',
        surveyId: 'survey_ecocampus_unm_2026',
        question: 'Berapa perkiraan jumlah botol plastik atau kemasan sekali pakai yang Anda konsumsi setiap pekan di area kampus?',
        type: 'number',
        required: true,
        order: 5,
        helpText: 'Tuliskan angka perkiraan (misal: 4)',
      },
      {
        id: 'q_unm_6',
        surveyId: 'survey_ecocampus_unm_2026',
        question: 'Apa saran, kritik, atau ide inovasi Anda untuk mempercepat pencapaian Green Campus di UNM?',
        type: 'long_text',
        required: false,
        order: 6,
      },
    ],
  },
  {
    id: 'survey_kantin_hijau_draft',
    title: 'Survei Kesiapan Kantin Bebas Plastik Sekali Pakai di Kampus Parangtambung',
    description:
      'Kajian pendahuluan penerapan regulasi wadah makan dan tumbler pribadi di sentra kuliner dan kantin Fakultas Teknik & FMIPA UNM.',
    status: 'draft',
    startDateTime: '2026-10-01T08:00',
    endDateTime: '2026-11-30T23:59',
    startDate: '2026-10-01',
    endDate: '2026-11-30',
    createdBy: 'Tim Taskforce Zero Waste UNM',
    creatorId: 'usr_admin_01',
    createdAt: '2026-09-12T09:00:00Z',
    updatedAt: '2026-09-15T11:00:00Z',
    allowResubmission: false,
    questions: [
      {
        id: 'q_kantin_1',
        surveyId: 'survey_kantin_hijau_draft',
        question: 'Apakah Anda mendukung pemberlakuan diskon khusus bagi mahasiswa yang membawa tumbler sendiri di kantin UNM?',
        type: 'yes_no',
        required: true,
        order: 1,
      },
      {
        id: 'q_kantin_2',
        surveyId: 'survey_kantin_hijau_draft',
        question: 'Seberapa sering Anda membeli makanan berbungkus styrofoam atau plastik di sekitar kampus?',
        type: 'single_choice',
        required: true,
        order: 2,
        options: ['Setiap Hari', '3-4 Kali Seminggu', '1-2 Kali Seminggu', 'Hampir Tidak Pernah'],
      },
      {
        id: 'q_kantin_3',
        surveyId: 'survey_kantin_hijau_draft',
        question: 'Tuliskan masukan untuk pemilik kantin kampus mengenai alternatif pembungkus ramah lingkungan:',
        type: 'short_text',
        required: false,
        order: 3,
      },
    ],
  },
  {
    id: 'survey_pilot_2025_closed',
    title: 'Evaluasi Tahap Pilot Project Bank Sampah Terpadu UNM Parangtambung',
    description:
      'Laporan survei terdahulu untuk mengukur partisipasi awal mahasiswa dan tenaga kependidikan pada drop box otomatis kampus.',
    status: 'closed',
    startDateTime: '2026-05-01T08:00',
    endDateTime: '2026-07-31T23:59',
    startDate: '2026-05-01',
    endDate: '2026-07-31',
    createdBy: 'Direktorat Green Campus UNM',
    creatorId: 'usr_admin_01',
    createdAt: '2026-05-01T08:00:00Z',
    updatedAt: '2026-08-01T10:00:00Z',
    allowResubmission: false,
    questions: [
      {
        id: 'q_pilot_1',
        surveyId: 'survey_pilot_2025_closed',
        question: 'Tingkat kepuasan terhadap penempatan drop box di lobi fakultas:',
        type: 'likert',
        required: true,
        order: 1,
        scaleMin: 1,
        scaleMax: 5,
        scaleLabels: { min: 'Kurang Puas', max: 'Sangat Puas' },
      },
    ],
  },
];

// ============================================================
// 2. INITIAL REAL SURVEY RESPONSES (Tanpa data dummy/palsu)
// Sistem harus selalu mengandalkan data aktual yang dikirimkan
// oleh pengguna nyata saat mengisi survei.
// ============================================================
export const INITIAL_SURVEY_RESPONSES: SurveyResponse[] = [];

// ============================================================
// 3. INITIAL REUSE CATEGORIES (Managed dynamically by Admin)
// ============================================================
export const INITIAL_REUSE_CATEGORIES: ReuseCategory[] = [
  {
    id: 'cat_buku',
    name: 'Buku & Didaktik',
    description: 'Buku teks kuliah, modul praktikum, novel, dan diktat ajar.',
    status: 'active',
    createdBy: 'Admin Kampus UNM',
    createdAt: '2026-09-01T00:00:00Z',
    updatedAt: '2026-09-01T00:00:00Z',
  },
  {
    id: 'cat_fashion',
    name: 'Fashion & Sepatu',
    description: 'Baju hem kuliah, jas lab, kemeja rapi, dan sepatu pantofel/sneakers.',
    status: 'active',
    createdBy: 'Admin Kampus UNM',
    createdAt: '2026-09-01T00:00:00Z',
    updatedAt: '2026-09-01T00:00:00Z',
  },
  {
    id: 'cat_elektronik',
    name: 'Elektronik & Kos',
    description: 'Kipas angin, teko listrik, colokan kabel roll, charger, dan kalkulator scientific.',
    status: 'active',
    createdBy: 'Admin Kampus UNM',
    createdAt: '2026-09-01T00:00:00Z',
    updatedAt: '2026-09-01T00:00:00Z',
  },
  {
    id: 'cat_peralatan',
    name: 'Peralatan Kos',
    description: 'Kardus packing, ember, rak jemuran baju, gantungan pakaian, dan keranjang.',
    status: 'active',
    createdBy: 'Admin Kampus UNM',
    createdAt: '2026-09-01T00:00:00Z',
    updatedAt: '2026-09-01T00:00:00Z',
  },
  {
    id: 'cat_alat_lab',
    name: 'Alat Lab & Gambar',
    description: 'Meja gambar portable, penggaris T, tabung gambar, kalkir, dan kaca mata lab.',
    status: 'active',
    createdBy: 'Admin Kampus UNM',
    createdAt: '2026-09-01T00:00:00Z',
    updatedAt: '2026-09-01T00:00:00Z',
  },
  {
    id: 'cat_furniture',
    name: 'Furniture',
    description: 'Meja lipat lesehan, kursi belajar, rak buku kayu, dan cermin dinding.',
    status: 'active',
    createdBy: 'Admin Kampus UNM',
    createdAt: '2026-09-01T00:00:00Z',
    updatedAt: '2026-09-01T00:00:00Z',
  },
  {
    id: 'cat_lainnya',
    name: 'Lainnya',
    description: 'Barang kebutuhan harian sivitas kampus lainnya yang masih layak pakai.',
    status: 'active',
    createdBy: 'Admin Kampus UNM',
    createdAt: '2026-09-01T00:00:00Z',
    updatedAt: '2026-09-01T00:00:00Z',
  },
];

// ============================================================
// 4. INITIAL ROLE REQUESTS (Mahasiswa mengajukan -> Admin me-review)
// ============================================================
export const INITIAL_ROLE_REQUESTS: RoleRequest[] = [
  {
    id: 'req_role_01',
    userId: 'usr_ahmad_03',
    requestedRole: 'dosen',
    fullName: 'Ahmad Fauzi, S.E., M.M.',
    identityNumber: 'NIDN 0912049001',
    faculty: 'Fakultas Ekonomi & Bisnis',
    reason: 'Pengangkatan dosen tetap non-PNS pada Program Studi Manajemen FEB UNM untuk memfasilitasi integrasi tugas circular economy pada mata kuliah Manajemen Operasional.',
    evidence: 'SK Rektor UNM No. 4281/UN36/KP/2026 perihal Pengangkatan Dosen Tetap.',
    status: 'pending',
    createdAt: '2026-09-14T11:20:00Z',
  },
  {
    id: 'req_role_02',
    userId: 'usr_nurul_02',
    requestedRole: 'pengelola',
    fullName: 'Nurul Hidayah',
    identityNumber: 'NIM 220108502011',
    faculty: 'Fakultas MIPA',
    reason: 'Ditugaskan sebagai Koordinator Duta Bank Sampah FMIPA Parangtambung periode 2026/2027.',
    evidence: 'Surat Tugas BEM FMIPA & Pengesahan Wakil Dekan III No. ST-082/UNM/FMIPA/2026.',
    status: 'approved',
    reviewedBy: 'Dr. Ir. Nurul Hidayah, M.Pd.',
    reviewedAt: '2026-09-13T15:00:00Z',
    reviewNotes: 'Disetujui. Surat tugas terverifikasi di Dekanat FMIPA.',
    createdAt: '2026-09-12T09:30:00Z',
  },
];

// ============================================================
// 5. INITIAL OFFICIAL COMMUNITY POSTS
// ============================================================
export const INITIAL_OFFICIAL_POSTS: OfficialCommunityPost[] = [
  {
    id: 'post_off_01',
    title: 'Surat Edaran Rektor: Gerakan Zero Plastic & Pengurangan Botol Kemasan di Kampus UNM',
    content:
      'Dalam rangka menuju akreditasi UI GreenMetric World University Rankings, seluruh civitas akademika UNM dihimbau membawa tumbler dan kotak bekal ramah lingkungan. Setiap gedung fakultas telah dilengkapi dispenser air minum isi ulang higienis.',
    image: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=800&q=80',
    categoryId: 'cat_kebijakan',
    categoryName: 'Kebijakan Kampus',
    status: 'published',
    createdBy: 'Direktorat Green Campus UNM',
    publishedAt: '2026-09-10T08:00:00Z',
    createdAt: '2026-09-10T08:00:00Z',
    updatedAt: '2026-09-10T08:00:00Z',
  },
  {
    id: 'post_off_02',
    title: 'Jadwal Penimbangan & Konversi Poin Bank Sampah Parangtambung Tiap Jumat',
    content:
      'TPST Parangtambung membuka pos penimbangan khusus kardus, botol plastik PET, dan kertas ujian bekas setiap Jumat pukul 08.30 - 11.00 WITA di samping Gedung Elektro FT. Poin dapat langsung ditukarkan kupon kantin.',
    image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80',
    categoryId: 'cat_operasional',
    categoryName: 'Jadwal TPST',
    status: 'published',
    createdBy: 'Unit Pelaksana Teknis TPST UNM',
    publishedAt: '2026-09-12T09:00:00Z',
    createdAt: '2026-09-12T09:00:00Z',
    updatedAt: '2026-09-12T09:00:00Z',
  },
];

// ============================================================
// STORAGE HELPER FUNCTIONS
// ============================================================

export function getStoredSurveys(): Survey[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SURVEYS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.error('Error loading surveys:', e);
  }
  saveStoredSurveys(INITIAL_SURVEYS);
  return INITIAL_SURVEYS;
}

export function saveStoredSurveys(surveys: Survey[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.SURVEYS, JSON.stringify(surveys));
  } catch (e) {
    console.error('Error saving surveys:', e);
  }
}

export function getStoredSurveyResponses(): SurveyResponse[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SURVEY_RESPONSES);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.error('Error loading survey responses:', e);
  }
  saveStoredSurveyResponses(INITIAL_SURVEY_RESPONSES);
  return INITIAL_SURVEY_RESPONSES;
}

export function saveStoredSurveyResponses(responses: SurveyResponse[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.SURVEY_RESPONSES, JSON.stringify(responses));
  } catch (e) {
    console.error('Error saving survey responses:', e);
  }
}

export function getEffectiveSurveyStatus(survey: Survey): SurveyStatus {
  if (survey.status === 'draft') return 'draft';
  if (survey.status === 'closed') return 'closed';

  const now = new Date();
  const startStr = survey.startDateTime || survey.startDate;
  const endStr = survey.endDateTime || survey.endDate;

  if (startStr) {
    const start = new Date(startStr);
    if (!isNaN(start.getTime()) && now < start) {
      return 'scheduled';
    }
  }

  if (endStr) {
    const end = new Date(endStr.length === 10 ? `${endStr}T23:59:59` : endStr);
    if (!isNaN(end.getTime()) && now > end) {
      return 'expired';
    }
  }

  return 'published';
}

export function isSurveyActiveForStudent(
  survey: Survey,
  userId: string,
  answeredSurveyIds: string[] = []
): boolean {
  const effectiveStatus = getEffectiveSurveyStatus(survey);
  if (effectiveStatus !== 'published' && effectiveStatus !== 'active') return false;
  if (!survey.allowResubmission && answeredSurveyIds.includes(survey.id)) return false;
  return true;
}

export function getAvailableSurveysForUser(userId: string): Survey[] {
  const surveys = getStoredSurveys();
  const answeredSurveyIds = getUserAnsweredSurveyIds(userId);
  return surveys.filter((s) => isSurveyActiveForStudent(s, userId, answeredSurveyIds));
}

export function getAvailableSurveysCountForUser(userId: string): number {
  return getAvailableSurveysForUser(userId).length;
}

export function getAdminSurveysSummary() {
  const surveys = getStoredSurveys();
  const summary = {
    total: surveys.length,
    draft: 0,
    scheduled: 0,
    active: 0,
    closed: 0,
    expired: 0,
  };
  surveys.forEach((s) => {
    const eff = getEffectiveSurveyStatus(s);
    if (eff === 'draft') summary.draft++;
    else if (eff === 'scheduled') summary.scheduled++;
    else if (eff === 'published' || eff === 'active') summary.active++;
    else if (eff === 'closed') summary.closed++;
    else if (eff === 'expired') summary.expired++;
  });
  return summary;
}

export function getSurveyById(surveyId: string): Survey | undefined {
  const surveys = getStoredSurveys();
  return surveys.find((s) => s.id === surveyId);
}

export function getResponsesBySurveyId(surveyId: string): SurveyResponse[] {
  const responses = getStoredSurveyResponses();
  return responses.filter((r) => r.surveyId === surveyId);
}

export function deleteSurvey(surveyId: string): void {
  const surveys = getStoredSurveys().filter((s) => s.id !== surveyId);
  saveStoredSurveys(surveys);
  // Also clean up any responses strictly associated with this surveyId
  const responses = getStoredSurveyResponses().filter((r) => r.surveyId !== surveyId);
  saveStoredSurveyResponses(responses);
}

export function updateSurveyStatus(surveyId: string, status: SurveyStatus): void {
  const surveys = getStoredSurveys().map((s) => {
    if (s.id === surveyId) {
      return { ...s, status, updatedAt: new Date().toISOString() };
    }
    return s;
  });
  saveStoredSurveys(surveys);
}

export function getUserAnsweredSurveyIds(userId: string): string[] {
  if (!userId) return [];
  const responses = getStoredSurveyResponses();
  return responses
    .filter((r) => r.userId === userId)
    .map((r) => r.surveyId);
}

export function submitSurveyResponse(
  surveyId: string,
  user: { id: string; name: string; faculty: string; major: string; role: string; batch?: string },
  answers: { questionId: string; value: string | string[] | number }[]
): SurveyResponse {
  const surveys = getStoredSurveys();
  const targetSurvey = surveys.find((s) => s.id === surveyId);
  if (!targetSurvey) {
    throw new Error('Survei tidak ditemukan di sistem.');
  }

  // Validasi Waktu Saat Submit (Section 11)
  const effectiveStatus = getEffectiveSurveyStatus(targetSurvey);
  if (effectiveStatus !== 'published' && effectiveStatus !== 'active') {
    throw new Error('Periode survei telah berakhir atau survei sudah tidak tersedia.');
  }

  const current = getStoredSurveyResponses();
  if (!targetSurvey.allowResubmission) {
    const alreadyAnswered = current.some((r) => r.surveyId === surveyId && r.userId === user.id);
    if (alreadyAnswered) {
      throw new Error('Anda sudah pernah mengisi survei ini.');
    }
  }

  const responseId = `resp_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
  const mappedAnswers: SurveyAnswer[] = answers.map((a, idx) => ({
    id: `ans_${responseId}_${idx}`,
    responseId,
    questionId: a.questionId,
    value: a.value,
  }));

  const newResponse: SurveyResponse = {
    id: responseId,
    responseId,
    surveyId,
    userId: user.id,
    userName: user.name,
    userFaculty: user.faculty,
    userMajor: user.major,
    userRole: user.role,
    userBatch: user.batch || (user.name?.includes('22') ? '2022' : '2023'),
    submittedAt: new Date().toISOString(),
    answers: mappedAnswers,
  };

  const updated = [newResponse, ...current];
  saveStoredSurveyResponses(updated);
  return newResponse;
}

// Category Helpers
export function getStoredCategories(): ReuseCategory[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.error('Error loading categories:', e);
  }
  saveStoredCategories(INITIAL_REUSE_CATEGORIES);
  return INITIAL_REUSE_CATEGORIES;
}

export function saveStoredCategories(categories: ReuseCategory[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
  } catch (e) {
    console.error('Error saving categories:', e);
  }
}

// Role Requests Helpers
export function getStoredRoleRequests(): RoleRequest[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ROLE_REQUESTS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.error('Error loading role requests:', e);
  }
  saveStoredRoleRequests(INITIAL_ROLE_REQUESTS);
  return INITIAL_ROLE_REQUESTS;
}

export function saveStoredRoleRequests(requests: RoleRequest[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.ROLE_REQUESTS, JSON.stringify(requests));
  } catch (e) {
    console.error('Error saving role requests:', e);
  }
}

export function submitRoleRequest(
  userId: string,
  fullName: string,
  faculty: string,
  requestedRole: UserRole,
  identityNumber: string,
  reason: string,
  evidence: string
): RoleRequest {
  const current = getStoredRoleRequests();
  const newReq: RoleRequest = {
    id: `req_role_${Date.now()}`,
    userId,
    requestedRole,
    fullName,
    identityNumber,
    faculty,
    reason,
    evidence,
    status: 'pending',
    createdAt: new Date().toISOString(),
  };
  const updated = [newReq, ...current];
  saveStoredRoleRequests(updated);
  return newReq;
}

// Official Community Posts Helpers
export function getStoredOfficialPosts(): OfficialCommunityPost[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.OFFICIAL_POSTS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.error('Error loading official posts:', e);
  }
  saveStoredOfficialPosts(INITIAL_OFFICIAL_POSTS);
  return INITIAL_OFFICIAL_POSTS;
}

export function saveStoredOfficialPosts(posts: OfficialCommunityPost[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.OFFICIAL_POSTS, JSON.stringify(posts));
  } catch (e) {
    console.error('Error saving official posts:', e);
  }
}
