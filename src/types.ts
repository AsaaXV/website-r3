export type UserRole = 'mahasiswa' | 'dosen' | 'pengelola' | 'mitra' | 'petugas_tps' | 'admin_kampus' | 'admin';

export type WasteCategoryType = 'organik' | 'kertas' | 'plastik' | 'khusus';

export interface WasteCategoryInfo {
  id: WasteCategoryType;
  name: string;
  subtypes: string[];
  percentageVolume: string; // e.g. "48.0% - 60.0%"
  description: string;
  handlingAction: string;
  pointsPerKg: number;
  xpPerKg: number;
  co2SavedPerKg: number; // in kg CO2e
  waterSavedPerKg: number; // in liters
  binColor: string;
  binColorName: string;
  badgeBg: string;
  badgeBorder: string;
}

export interface UserProfile {
  id: string;
  nim?: string;
  batch?: string;
  name: string;
  email: string;
  faculty: string;
  major: string;
  role: UserRole;
  ecoPoints: number;
  xp: number;
  level: number;
  currentStreakDays: number;
  lastDepositDate?: string;
  badges: BadgeItem[];
  totalWeightDepositedKg: number;
  avatarUrl: string;
}

export interface BadgeItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: string;
}

export interface WasteDepositItem {
  categoryId: WasteCategoryType;
  categoryName: string;
  materialName: string;
  weightKg: number;
  pointsEarned: number;
  xpEarned: number;
  co2SavedKg: number;
}

export interface LedgerTransaction {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  faculty: string;
  items: WasteDepositItem[];
  totalWeightKg: number;
  totalPoints: number;
  totalXp: number;
  dropPointId: string;
  dropPointName: string;
  status: 'verified' | 'flagged' | 'pending';
  zScore: number;
  flagReason?: string;
  verifiedBy?: string;
  hash: string;
}

export interface GISFacility {
  id: string;
  name: string;
  type: 'TPA Sampah Akhir' | 'TPST Pengolahan Akhir' | 'TPA B3 / Medis Regional' | 'TPS3R' | 'Bank Sampah' | 'Drop Box Kampus' | 'Pusat Kompos';
  subdistrict: string;
  latitude: number;
  longitude: number;
  distanceKm: number;
  capacityDailyKg: number;
  currentLoadKg: number;
  acceptsCategories: WasteCategoryType[];
  operatingHours: string;
  address: string;
  significance: string;
  contactPhone?: string;
  isSpecialDropbox?: boolean;
  acceptedItemsDetail?: string;
  isFinalLandfill?: boolean;
  landfillAreaHectares?: number;
  landfillStatus?: 'Kritis (Overcapacity)' | 'Mendekati Penuh' | 'Aktif Terkendali';
  mountainHeightM?: number;
  methaneRisk?: 'Tinggi' | 'Sedang' | 'Rendah';
  dailyIncomingTons?: number;
  leachateManagement?: string;
}

export interface VRPStop {
  id: string;
  name: string;
  sequence: number;
  wasteAccumulationKg: number;
  lat: number;
  lng: number;
  x: number; // map SVG relative coordinate 0..100
  y: number; // map SVG relative coordinate 0..100
  status: 'pending' | 'collected' | 'next';
}

export interface LeaderboardUser {
  rank: number;
  id: string;
  name: string;
  faculty: string;
  avatar: string;
  totalKg: number;
  ecoPoints: number;
  xp: number;
  streak: number;
}

export interface FacultyLeaderboard {
  rank: number;
  faculty: string;
  totalKg: number;
  participantsCount: number;
  co2ReducedKg: number;
  recyclingRatePercent: number;
}

export interface DetectionResult {
  label: string;
  category: WasteCategoryType;
  confidence: number;
  recommendedBin: string;
  suggestedAction: string;
  estimatedWeightKg: number;
  ecoPointsEst: number;
  bbox: [number, number, number, number]; // [ymin, xmin, ymax, xmax] in %
}

export interface SUSAuditResult {
  score: number;
  adjectiveRating: 'Unacceptable' | 'Marginal' | 'Good' | 'Best Imaginable';
  answers: number[]; // 1-5 for 10 questions
  timestamp: string;
}

export interface EducationArticle {
  id: string;
  title: string;
  category: 'Panduan Pemilahan' | 'Kabar Kampus' | 'Riset & Inovasi' | 'Tips Kosan';
  summary: string;
  readTime: string;
  date: string;
  author: string;
  imageUrl: string;
  tags: string[];
  content: string[];
}

export interface ReuseItem {
  id: string;
  donorId?: string;
  title: string;
  category: 'Buku & Diktat' | 'Elektronik & Kos' | 'Alat Lab & Gambar' | 'Peralatan Kos' | 'Fashion & Sepatu' | 'Lainnya';
  condition: 'Seperti Baru' | 'Sangat Baik' | 'Cukup Baik' | 'Butuh Perbaikan';
  pointPrice: number; // 0 if free / hibah
  isFree: boolean;
  priceRupiah?: number;
  isNego?: boolean;
  donorName: string;
  donorFaculty: string;
  location: string;
  meetupPoint?: string;
  imageUrl: string;
  description: string;
  postedAt: string;
  status: 'available' | 'claimed';
  contactWhatsapp?: string;
  sellerRating?: number;
  viewsCount?: number;
  isVerifiedStudent?: boolean;
}

export interface ForumPost {
  id: string;
  authorId?: string;
  authorName: string;
  authorFaculty: string;
  authorRole: string;
  avatarUrl: string;
  title: string;
  content: string;
  category: 'Diskusi' | 'Ide Inovasi' | 'Tanya Petugas' | 'Kegiatan Bersih';
  likes: number;
  repliesCount: number;
  createdAt: string;
  tags: string[];
}

export interface PickupRequest {
  id: string;
  userId: string;
  userName: string;
  facultyLocation: string;
  exactAddress: string;
  wasteTypes: WasteCategoryType[];
  estimatedWeightKg: number;
  contactWhatsapp: string;
  notes: string;
  status: 'scheduled' | 'on_the_way' | 'completed';
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  recipientId: string;
  recipientName: string;
  text: string;
  timestamp: string;
  isSelf: boolean;
  itemTitle?: string;
}

export interface ChatThread {
  id: string;
  participantId: string;
  participantName: string;
  participantAvatar: string;
  participantRole: string;
  participantFaculty: string;
  onlineStatus?: 'online' | 'offline';
  lastMessage: string;
  lastTimestamp: string;
  unreadCount: number;
  itemContext?: {
    id: string;
    title: string;
    imageUrl: string;
    price: string;
  };
  messages: ChatMessage[];
}

export interface UserReview {
  id: string;
  reviewerName: string;
  reviewerAvatar: string;
  rating: number; // 1-5
  comment: string;
  timestamp: string;
  transactionType: 'Bursa Reuse' | 'Titip Pilah Sampah' | 'Barter Edukasi';
}

export interface ItemRequest {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  userFaculty?: string;
  title: string;
  description: string;
  category: 'Buku & Diktat' | 'Elektronik & Kos' | 'Alat Lab & Gambar' | 'Peralatan Kos' | 'Fashion & Sepatu' | 'Lainnya';
  urgency: 'Segera' | 'Santai' | 'Fleksibel';
  preferredCodSpot: string;
  preferredMeetupPoint?: string;
  createdAt: string;
  postedAt?: string;
  responsesCount: number;
  status: 'open' | 'fulfilled';
  contactWhatsapp?: string;
  requesterName?: string;
  requesterFaculty?: string;
}

export interface UpcyclingTip {
  title: string;
  difficulty: 'Mudah' | 'Menengah' | 'Kreatif';
  estTime: string;
  materialsNeeded: string;
  steps: string[];
}

export interface ScanHistoryItem {
  id: string;
  timestamp: string;
  materialName: string;
  category: WasteCategoryType;
  confidence: number;
  thumbnailUrl?: string;
  suggestedAction: string;
  upcyclingTips: UpcyclingTip[];
}

export interface DailyChallenge {
  day: number;
  title: string;
  description: string;
  rewardPoints: number;
  rewardXp: number;
  completed: boolean;
  completedAt?: string;
  iconName: string;
}

export interface AppNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'system' | 'reward' | 'challenge' | 'chat' | 'deposit';
  read: boolean;
  linkTab?: string;
}

// ==========================================
// DYNAMIC SURVEY SYSTEM TYPES
// ==========================================

export type SurveyStatus = 'draft' | 'scheduled' | 'published' | 'active' | 'closed' | 'expired';

export type SurveyQuestionType =
  | 'single_choice'
  | 'multiple_choice'
  | 'likert'
  | 'yes_no'
  | 'short_text'
  | 'long_text'
  | 'number';

export interface SurveyQuestion {
  id: string;
  questionId?: string; // alias for id
  surveyId: string;
  question: string;
  type: SurveyQuestionType;
  options?: string[]; // For single_choice & multiple_choice
  required: boolean;
  order: number;
  helpText?: string;
  scaleMin?: number; // default 1
  scaleMax?: number; // default 5
  scaleLabels?: { min: string; max: string };
  createdAt?: string;
  updatedAt?: string;
}

export interface Survey {
  id: string;
  surveyId?: string; // alias for id
  title: string;
  description: string;
  status: SurveyStatus;
  startDateTime: string; // ISO or YYYY-MM-DDTHH:mm
  endDateTime: string;   // ISO or YYYY-MM-DDTHH:mm
  startDate?: string;    // compatibility
  endDate?: string;      // compatibility
  createdBy: string;
  creatorId?: string;
  createdAt: string;
  updatedAt: string;
  allowResubmission?: boolean;
  questions: SurveyQuestion[];
}

export interface SurveyAnswer {
  id: string;
  responseId: string;
  questionId: string;
  value: string | string[] | number;
}

export interface SurveyResponse {
  id: string;
  responseId?: string; // alias for id
  surveyId: string;
  userId: string;
  userName?: string;
  userFaculty?: string;
  userMajor?: string;
  userRole?: string;
  userBatch?: string;
  submittedAt: string;
  answers: SurveyAnswer[];
}

// ==========================================
// ROLE APPLICATION & REVIEW TYPES
// ==========================================

export type RoleRequestStatus = 'pending' | 'approved' | 'rejected';

export interface RoleRequest {
  id: string;
  userId: string;
  requestedRole: UserRole;
  fullName: string;
  identityNumber: string; // NIM, NIP, NIDN, ID Mitra
  faculty: string;
  reason: string;
  evidence: string; // Deskripsi dokumen atau nomor SK
  status: RoleRequestStatus;
  reviewedBy?: string;
  reviewedAt?: string;
  reviewNotes?: string;
  createdAt: string;
}

// ==========================================
// DYNAMIC REUSE CATEGORY SYSTEM
// ==========================================

export interface ReuseCategory {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'inactive';
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface OfficialCommunityPost {
  id: string;
  title: string;
  content: string;
  image?: string;
  categoryId: string;
  categoryName: string;
  status: 'draft' | 'published' | 'archived';
  createdBy: string;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

// ==========================================
// 3R (REDUCE, REUSE, RECYCLE) FRAMEWORK TYPES
// ==========================================

export type R3Pillar = 'reduce' | 'reuse' | 'recycle';

export type ReduceActionKey =
  | 'tumbler'
  | 'lunchbox'
  | 'tote_bag'
  | 'paperless'
  | 'reusable_cutlery'
  | 'digital_notes';

export interface ReduceActionDefinition {
  key: ReduceActionKey;
  title: string;
  category: 'Wadah Makanan & Minuman' | 'Belanja & Fotokopi' | 'Akademik & Tugas';
  description: string;
  pointsEarned: number;
  xpEarned: number;
  wastePreventedGrams: number;
  co2PreventedGrams: number;
  iconName: string;
  tips: string;
}

export interface ReduceActionLog {
  id: string;
  userId: string;
  actionKey: ReduceActionKey;
  title: string;
  pointsEarned: number;
  xpEarned: number;
  wastePreventedGrams: number;
  co2PreventedGrams: number;
  timestamp: string;
  notes?: string;
}

export interface R3MetricsSummary {
  // REDUCE
  totalWastePreventedGrams: number;
  totalReduceActionsCount: number;
  estimatedSingleUseBottlesSaved: number;
  // REUSE
  totalItemsReusedCount: number;
  totalReuseTransactionsRupiah: number;
  // RECYCLE
  totalWasteRecycledKg: number;
  totalRecyclePointsEarned: number;
  // IMPACT
  totalCo2SavedKg: number;
}

