import React, { useState, useEffect, useRef, Suspense, lazy } from 'react';
import { ConsoleLayout } from './components/ConsoleLayout';
import { ConsoleDashboardView } from './components/ConsoleDashboardView';
import { LoginGatewayView } from './components/LoginGatewayView';
import { DashboardView } from './components/DashboardView';
import { RoleSwitchModal } from './components/RoleSwitchModal';
import { PickupRequestModal } from './components/PickupRequestModal';

// Code-splitting with lazy loading for heavy views
const EducationView = lazy(() => import('./components/EducationView').then(m => ({ default: m.EducationView })));
const CommunityView = lazy(() => import('./components/CommunityView').then(m => ({ default: m.CommunityView })));
const GamificationView = lazy(() => import('./components/GamificationView').then(m => ({ default: m.GamificationView })));
const AIScannerView = lazy(() => import('./components/AIScannerView').then(m => ({ default: m.AIScannerView })));
const LedgerAuditView = lazy(() => import('./components/LedgerAuditView').then(m => ({ default: m.LedgerAuditView })));
const AdminDashboardView = lazy(() => import('./components/AdminDashboardView').then(m => ({ default: m.AdminDashboardView })));
const ReduceActionTracker = lazy(() => import('./components/ReduceActionTracker').then(m => ({ default: m.ReduceActionTracker })));
const StudentSurveyModal = lazy(() => import('./components/StudentSurveyModal').then(m => ({ default: m.StudentSurveyModal })));
const RoleApplicationModal = lazy(() => import('./components/RoleApplicationModal').then(m => ({ default: m.RoleApplicationModal })));
const SystemArchitectureModal = lazy(() => import('./components/SystemArchitectureModal').then(m => ({ default: m.SystemArchitectureModal })));

const ViewLoadingFallback: React.FC = () => (
  <div className="flex flex-col items-center justify-center py-20 px-4 space-y-3">
    <div className="w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin" />
    <p className="text-xs font-semibold text-slate-500">Memuat modul EcoCampus...</p>
  </div>
);
import {
  getStoredSurveys,
  getUserAnsweredSurveyIds,
  isSurveyActiveForStudent,
} from './utils/surveyStorage';
import { AuthModal } from './components/AuthModal';
import { UserInboxModal } from './components/UserInboxModal';
import { PublicProfileModal } from './components/PublicProfileModal';
import { OnboardingModal } from './components/OnboardingModal';
import { PrivacyPolicyModal } from './components/PrivacyPolicyModal';
import {
  INITIAL_USER,
  INITIAL_LEDGER_TRANSACTIONS,
  WASTE_CATEGORIES,
  INITIAL_CHAT_THREADS,
  DEMO_ACCOUNTS,
} from './data/mockData';
import {
  UserProfile,
  LedgerTransaction,
  WasteCategoryType,
  PickupRequest,
  ChatThread,
  ChatMessage,
  ReuseItem,
  Survey,
} from './types';
import {
  getStoredUserChatThreads,
  saveStoredUserChatThreads,
  deliverMessageToRecipient,
  getStoredTransactions,
  saveStoredTransactions,
} from './utils/storage';
import { Leaf, ShieldCheck, CheckCircle2, MessageSquare, LogIn, Sparkles, Layers, Cookie, HelpCircle, BarChart3, LayoutGrid } from 'lucide-react';
import { useAuth } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { IdleSessionWarningModal } from './components/IdleSessionWarningModal';
import { ErrorBoundary } from './components/ErrorBoundary';

export default function App() {
  const {
    user: currentUser,
    isLoggedIn,
    login: handleLogin,
    logout: handleLogout,
    updateUser: setCurrentUser,
    authNotice,
    clearAuthNotice,
  } = useAuth();

  // AUTH GUARD (PROTEKSI ROUTE):
  // Pengecekan status login di localStorage.
  // Jika status di localStorage masih kosong/belum login, paksa kembalikan (redirect) ke Halaman Login.
  // Dashboard HANYA boleh di-render jika sesi login valid.
  const isLocalStorageAuthenticated = typeof window !== 'undefined' && localStorage.getItem('isLoggedIn') === 'true';
  const isAuthenticated = Boolean(isLoggedIn && isLocalStorageAuthenticated);

  useEffect(() => {
    // Sinkronisasi Auth Guard: jika di localStorage tidak ada 'isLoggedIn' = 'true', paksa logout / reset ke login
    const storedStatus = localStorage.getItem('isLoggedIn');
    if (storedStatus !== 'true' && isLoggedIn) {
      handleLogout('Sesi Anda belum login atau telah berakhir.');
    }
  }, [isLoggedIn, handleLogout]);

  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [dashboardMode, setDashboardMode] = useState<'console' | 'analytics'>('console');

  // Theme State (Light / Dark Mode, matching reference designs)
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('ecocampus_theme');
    return saved === 'dark' ? 'dark' : 'light';
  });

  useEffect(() => {
    localStorage.setItem('ecocampus_theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const [transactions, setTransactions] = useState<LedgerTransaction[]>(() => getStoredTransactions());
  const [susScore, setSusScore] = useState<number>(88.5);
  const [pickupRequests, setPickupRequests] = useState<PickupRequest[]>([]);

  // Chat & Messaging State (Strictly isolated per user session)
  const [chatThreads, setChatThreads] = useState<ChatThread[]>(() => {
    if (isLoggedIn && currentUser?.id) {
      return getStoredUserChatThreads(currentUser.id, currentUser.name);
    }
    return [];
  });
  const [activeChatThreadId, setActiveChatThreadId] = useState<string | null>(null);
  const lastSentMessageRef = useRef<{ text: string; time: number; threadId: string } | null>(null);

  // Sync and isolate chat threads whenever authenticated user session changes or logs out
  useEffect(() => {
    if (!isLoggedIn || !currentUser?.id) {
      setChatThreads([]);
      setActiveChatThreadId(null);
      setIsInboxModalOpen(false);
    } else {
      const userThreads = getStoredUserChatThreads(currentUser.id, currentUser.name);
      setChatThreads(userThreads);
      setActiveChatThreadId(userThreads.length > 0 ? userThreads[0].id : null);
    }
  }, [isLoggedIn, currentUser?.id, currentUser?.name]);

  // Modals state
  const [isRoleModalOpen, setIsRoleModalOpen] = useState<boolean>(false);
  const [isRoleApplicationModalOpen, setIsRoleApplicationModalOpen] = useState<boolean>(false);
  const [isStudentSurveyModalOpen, setIsStudentSurveyModalOpen] = useState<boolean>(false);
  const [isSusModalOpen, setIsSusModalOpen] = useState<boolean>(false);
  const [isPickupModalOpen, setIsPickupModalOpen] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');
  const [isInboxModalOpen, setIsInboxModalOpen] = useState<boolean>(false);
  const [isPublicProfileModalOpen, setIsPublicProfileModalOpen] = useState<boolean>(false);
  const [selectedPublicUser, setSelectedPublicUser] = useState<UserProfile | null>(null);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState<boolean>(false);
  const [isArchitectureOpen, setIsArchitectureOpen] = useState<boolean>(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState<boolean>(false);
  const [hasAcceptedCookies, setHasAcceptedCookies] = useState<boolean>(() => {
    return localStorage.getItem('ecocampus_privacy_accepted') === 'true';
  });
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Dynamic Surveys State
  const [surveys, setSurveys] = useState<Survey[]>(() => getStoredSurveys());
  const [answeredSurveyIds, setAnsweredSurveyIds] = useState<string[]>(() =>
    getUserAnsweredSurveyIds(currentUser?.id || '')
  );

  useEffect(() => {
    if (currentUser?.id) {
      setAnsweredSurveyIds(getUserAnsweredSurveyIds(currentUser.id));
    }
    setSurveys(getStoredSurveys());
  }, [currentUser?.id]);

  // Survei yang valid dan tersedia khusus untuk mahasiswa saat ini (menggunakan isSurveyActiveForStudent)
  const availableSurveysForStudent = surveys.filter((s) =>
    isSurveyActiveForStudent(s, currentUser?.id || '', answeredSurveyIds)
  );
  const activeSurveysCount = availableSurveysForStudent.length;
  const totalManagedSurveysCount = surveys.length;

  // Check if first-time visitor to offer guided tour once logged in
  useEffect(() => {
    const seenTour = localStorage.getItem('ecocampus_tour_seen');
    if (!seenTour && isLoggedIn) {
      setIsOnboardingOpen(true);
      localStorage.setItem('ecocampus_tour_seen', 'true');
    }
  }, [isLoggedIn]);

  const showAppToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Unread messages count
  const unreadMessagesCount = chatThreads.reduce(
    (acc, thread) => acc + (thread.unreadCount || 0),
    0
  );

  // Sync Auth notices from AuthContext (e.g. idle timeout, login/logout events)
  useEffect(() => {
    if (authNotice) {
      showAppToast(authNotice);
      clearAuthNotice();
    }
  }, [authNotice, clearAuthNotice]);

  // Handle transaction recording
  const handleRecordTransaction = (newTx: LedgerTransaction) => {
    setTransactions((prev) => [newTx, ...prev]);

    // If verified immediately, credit points to user profile
    if (newTx.status === 'verified') {
      setCurrentUser((prev) => {
        const newPoints = prev.ecoPoints + newTx.totalPoints;
        const newXp = prev.xp + newTx.totalXp;
        const newWeight = Number((prev.totalWeightDepositedKg + newTx.totalWeightKg).toFixed(2));
        const newLevel = Math.max(prev.level, Math.floor(newXp / 400) + 1);

        return {
          ...prev,
          ecoPoints: newPoints,
          xp: newXp,
          level: newLevel,
          totalWeightDepositedKg: newWeight,
        };
      });
    }
  };

  // Handle Pickup Request creation
  const handlePickupRequest = (req: PickupRequest) => {
    setPickupRequests((prev) => [req, ...prev]);
    showAppToast('Permintaan penjemputan terkirim ke petugas!');
  };

  // Send Message in Inter-User Chat (Strictly isolated per user, no auto-replies, no unwanted redirects)
  const handleSendMessage = (threadId: string, text: string) => {
    const trimmed = text.trim();
    if (!trimmed || !currentUser?.id) return;

    // Deduplication guard: prevent same message within 800ms to same thread
    const now = Date.now();
    if (
      lastSentMessageRef.current &&
      lastSentMessageRef.current.threadId === threadId &&
      lastSentMessageRef.current.text === trimmed &&
      now - lastSentMessageRef.current.time < 800
    ) {
      return;
    }
    lastSentMessageRef.current = { text: trimmed, time: now, threadId };

    const targetThread = chatThreads.find((t) => t.id === threadId);
    if (!targetThread) return;

    const messageId = `msg_${now}_${Math.random().toString(36).substring(2, 6)}`;
    const timestampStr =
      new Date().toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
      }) + ' WITA';

    const newMsg: ChatMessage = {
      id: messageId,
      senderId: currentUser.id,
      senderName: currentUser.name,
      recipientId: targetThread.participantId,
      recipientName: targetThread.participantName,
      text: trimmed,
      timestamp: timestampStr,
      isSelf: true,
    };

    const updatedThreads = chatThreads.map((thread) => {
      if (thread.id === threadId) {
        return {
          ...thread,
          lastMessage: trimmed,
          lastTimestamp: 'Baru saja',
          messages: [...thread.messages, newMsg],
        };
      }
      return thread;
    });

    setChatThreads(updatedThreads);
    saveStoredUserChatThreads(currentUser.id, updatedThreads);

    // Real P2P delivery: save to recipient account storage for seamless multi-account testing
    if (targetThread.participantId) {
      deliverMessageToRecipient(
        targetThread.participantId,
        newMsg,
        currentUser,
        targetThread.itemContext
      );
    }
  };

  // Open Chat with Seller or Peer
  const handleOpenChatWithSeller = (sellerName: string, item?: ReuseItem) => {
    if (!isLoggedIn || !currentUser?.id) {
      setAuthModalMode('login');
      setIsAuthModalOpen(true);
      showAppToast('Silakan masuk akun terlebih dahulu untuk mengirim pesan.');
      return;
    }

    // Guard: Prevent sending message to self
    if (
      sellerName.trim().toLowerCase() === currentUser.name.trim().toLowerCase() ||
      (item && item.donorName && item.donorName.trim().toLowerCase() === currentUser.name.trim().toLowerCase())
    ) {
      showAppToast('Ini adalah barang/unggahan Anda sendiri.');
      return;
    }

    // Find matching thread in current user's threads
    const existing = chatThreads.find(
      (t) => t.participantName.toLowerCase() === sellerName.toLowerCase()
    );

    if (existing) {
      setActiveChatThreadId(existing.id);
    } else {
      // Find seller profile in demo accounts
      const matchedProfile = DEMO_ACCOUNTS.find(
        (acc) => acc.name.toLowerCase() === sellerName.toLowerCase()
      );

      const newThreadId = `thread_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
      const timestampStr =
        new Date().toLocaleTimeString('id-ID', {
          hour: '2-digit',
          minute: '2-digit',
        }) + ' WITA';

      const itemCtx = item
        ? {
            id: item.id,
            title: item.title,
            imageUrl: item.imageUrl,
            price: item.isFree
              ? 'GRATIS (Hibah)'
              : item.priceRupiah
              ? `Rp ${item.priceRupiah.toLocaleString('id-ID')}`
              : `${item.pointPrice} Pts`,
          }
        : undefined;

      const initMessage: ChatMessage = {
        id: `msg_init_${Date.now()}`,
        senderId: currentUser.id,
        senderName: currentUser.name,
        recipientId: matchedProfile?.id || `peer_${sellerName.toLowerCase().replace(/\s+/g, '_')}`,
        recipientName: sellerName,
        text: item
          ? `Halo kak ${sellerName}, saya mahasiswa tertarik dengan barang "${item.title}". Apakah masih tersedia untuk COD di kampus?`
          : 'Halo kak, salam lestari!',
        timestamp: timestampStr,
        isSelf: true,
        itemTitle: item?.title,
      };

      const newThread: ChatThread = {
        id: newThreadId,
        participantId: matchedProfile?.id || `peer_${sellerName.toLowerCase().replace(/\s+/g, '_')}`,
        participantName: sellerName,
        participantAvatar:
          matchedProfile?.avatarUrl ||
          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
        participantRole: matchedProfile?.role === 'petugas_tps' ? 'Petugas TPST' : 'Mahasiswa',
        participantFaculty: matchedProfile?.faculty || 'Kampus UNM',
        onlineStatus: 'online',
        lastMessage: initMessage.text,
        lastTimestamp: 'Baru saja',
        unreadCount: 0,
        itemContext: itemCtx,
        messages: [initMessage],
      };

      const updated = [newThread, ...chatThreads];
      setChatThreads(updated);
      saveStoredUserChatThreads(currentUser.id, updated);
      setActiveChatThreadId(newThreadId);

      if (newThread.participantId) {
        deliverMessageToRecipient(newThread.participantId, initMessage, currentUser, itemCtx);
      }
    }

    setIsInboxModalOpen(true);
  };

  // Open User Public Profile
  const handleOpenUserProfile = (userId: string, userName: string) => {
    const matched = DEMO_ACCOUNTS.find(
      (u) => u.id === userId || u.name.toLowerCase() === userName.toLowerCase()
    );

    if (matched) {
      setSelectedPublicUser(matched);
    } else {
      // Fallback
      setSelectedPublicUser({
        id: userId,
        name: userName,
        email: `${userName.toLowerCase().replace(/\s+/g, '.')}@gmail.com`,
        faculty: 'Warga Komunitas',
        major: 'Pengguna Terdaftar',
        role: 'mahasiswa',
        ecoPoints: 350,
        xp: 700,
        level: 2,
        currentStreakDays: 3,
        totalWeightDepositedKg: 12.5,
        avatarUrl:
          'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=250&q=80',
        badges: [
          {
            id: 'b1',
            title: 'Pegiat 3R Kampus',
            description: 'Aktif mendonasikan barang bekas dan memilah sampah.',
            icon: 'Sprout',
          },
        ],
      });
    }

    setIsPublicProfileModalOpen(true);
  };

  const handleVerifyTransaction = (txId: string) => {
    let verifiedTx: LedgerTransaction | undefined;
    const updated = transactions.map((t) => {
      if (t.id === txId) {
        verifiedTx = { ...t, status: 'verified' as const, verifiedBy: currentUser?.name + ' (Petugas TPST)' };
        return verifiedTx;
      }
      return t;
    });
    setTransactions(updated);
    saveStoredTransactions(updated);

    if (verifiedTx && currentUser) {
      if (
        verifiedTx.userId === currentUser.id ||
        verifiedTx.userName.toLowerCase() === currentUser.name.toLowerCase()
      ) {
        const addedPoints = verifiedTx.totalPoints || 0;
        const addedWeight = verifiedTx.totalWeightKg || 0;
        setCurrentUser({
          ...currentUser,
          ecoPoints: (currentUser.ecoPoints || 0) + addedPoints,
          xp: (currentUser.xp || 0) + addedPoints * 2,
          totalWeightDepositedKg: Number(
            ((currentUser.totalWeightDepositedKg || 0) + addedWeight).toFixed(1)
          ),
        });
      }
    }
    showAppToast('Setoran berhasil diverifikasi dan poin dikreditkan!');
  };

  const handleRejectTransaction = (txId: string) => {
    const updated = transactions.map((t) =>
      t.id === txId ? { ...t, status: 'flagged' as const } : t
    );
    setTransactions(updated);
    saveStoredTransactions(updated);
    showAppToast('Transaksi ditandai perlu perbaikan audit.');
  };

  const handleRecordDeposit = (newTx: LedgerTransaction) => {
    const updated = [newTx, ...transactions];
    setTransactions(updated);
    saveStoredTransactions(updated);

    if (newTx.status === 'verified') {
      if (
        currentUser &&
        (newTx.userId === currentUser.id ||
          newTx.userName.toLowerCase() === currentUser.name.toLowerCase())
      ) {
        const addedPoints = newTx.totalPoints || 0;
        const addedWeight = newTx.totalWeightKg || 0;
        setCurrentUser({
          ...currentUser,
          ecoPoints: (currentUser.ecoPoints || 0) + addedPoints,
          xp: (currentUser.xp || 0) + addedPoints * 2,
          totalWeightDepositedKg: Number(
            ((currentUser.totalWeightDepositedKg || 0) + addedWeight).toFixed(1)
          ),
        });
      }
      showAppToast(`Setoran ${newTx.totalWeightKg} kg berhasil dicatat & ${newTx.totalPoints} pts dikreditkan!`);
    } else {
      showAppToast(`Setoran ${newTx.totalWeightKg} kg dicatat & ditandai untuk verifikasi anomali.`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans transition-colors duration-200">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 dark:bg-slate-800 text-white px-4 py-3 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-3 text-xs font-semibold animate-in fade-in slide-in-from-bottom-5 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* AUTH GUARD: DEFAULT ROUTE WAJIB LOGIN                                      */}
      {/* Saat website pertama kali dibuka (URL root /), komponen yang HARUS muncul  */}
      {/* pertama kali adalah Halaman Login, BUKAN Dashboard.                        */}
      {/* Dashboard HANYA boleh di-render jika sesi login valid.                      */}
      {/* ========================================================================= */}
      {!isAuthenticated ? (
        <LoginGatewayView
          onLogin={(user) => {
            handleLogin(user);
            setActiveTab('dashboard');
          }}
          theme={theme}
          onToggleTheme={toggleTheme}
          onOpenArchitecture={() => setIsArchitectureOpen(true)}
          onOpenSusModal={() => setIsSusModalOpen(true)}
          onOpenPrivacyPolicy={() => setIsPrivacyModalOpen(true)}
        />
      ) : (
        /* Main 3-Column Console Architecture Layout */
        <ConsoleLayout
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          currentUser={currentUser}
          isLoggedIn={isAuthenticated}
          theme={theme}
          onToggleTheme={toggleTheme}
          unreadMessagesCount={unreadMessagesCount}
          onOpenInbox={() => setIsInboxModalOpen(true)}
          onOpenMyProfile={() => {
            setSelectedPublicUser(currentUser);
            setIsPublicProfileModalOpen(true);
          }}
          onOpenRoleModal={
            currentUser.role === 'admin' || currentUser.role === 'admin_kampus'
              ? () => setIsRoleModalOpen(true)
              : undefined
          }
          onOpenRoleApplicationModal={() => setIsRoleApplicationModalOpen(true)}
          onOpenSurveyModal={() => setIsStudentSurveyModalOpen(true)}
          activeSurveysCount={activeSurveysCount}
          totalManagedSurveysCount={totalManagedSurveysCount}
          onOpenSusModal={() => setIsSusModalOpen(true)}
          onOpenAuthModal={(mode) => {
            setAuthModalMode(mode);
            setIsAuthModalOpen(true);
          }}
          onLogout={handleLogout}
          onOpenOnboarding={() => setIsOnboardingOpen(true)}
          onOpenArchitecture={() => setIsArchitectureOpen(true)}
          onOpenChat={handleOpenChatWithSeller}
        >
        {/* Dynamic View Content according to Active Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-4">
            {/* Mode Switcher: Console View (3-Column Layout from Reference) vs Deep Analytical View */}
            <div className="flex items-center justify-between bg-white dark:bg-[#131b2e] border border-slate-200/90 dark:border-slate-800 rounded-2xl p-2 px-3 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-700 dark:text-slate-300">
                  Mode Tampilan:
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:inline">
                  {dashboardMode === 'console'
                    ? 'Console Hub (Banner Hero, Trending Bursa Preloved & Akses Cepat)'
                    : 'Dasbor Analitik (Grafik Emisi, Streak Harian & Penimbangan)'}
                </span>
              </div>

              <div className="flex items-center gap-1 bg-slate-100 dark:bg-[#1a233a] p-1 rounded-xl">
                <button
                  onClick={() => setDashboardMode('console')}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-bold text-xs transition-all cursor-pointer ${
                    dashboardMode === 'console'
                      ? 'bg-emerald-500 text-slate-950 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                  <span>Console Hub</span>
                </button>
                <button
                  onClick={() => setDashboardMode('analytics')}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-bold text-xs transition-all cursor-pointer ${
                    dashboardMode === 'analytics'
                      ? 'bg-emerald-500 text-slate-950 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <BarChart3 className="w-3.5 h-3.5" />
                  <span>Analisis Lengkap</span>
                </button>
              </div>
            </div>

            {dashboardMode === 'console' ? (
              <ConsoleDashboardView
                currentUser={currentUser}
                transactions={transactions}
                onNavigate={setActiveTab}
                onOpenChatWithSeller={handleOpenChatWithSeller}
                onUpdateUser={(updated) => {
                  setCurrentUser(updated);
                  showAppToast('Poin dan aksi reduce berhasil diperbarui!');
                }}
              />
            ) : (
              <DashboardView
                currentUser={currentUser}
                transactions={transactions}
                onNavigate={setActiveTab}
                onOpenSurveyModal={() => setIsStudentSurveyModalOpen(true)}
                activeSurveysCount={activeSurveysCount}
                onNavigateToScanner={() => setActiveTab('scanner')}
                onNavigateToGamification={() => setActiveTab('gamification')}
                onNavigateToEducation={() => setActiveTab('edukasi')}
              />
            )}
          </div>
        )}

        {/* Lazy Loaded Module Tabs */}
        <Suspense fallback={<ViewLoadingFallback />}>
          {activeTab === 'reduce' && (
            <ErrorBoundary
              fallbackTitle="Pusat Aksi Reduce Mengalami Kendala Sementara"
              fallbackMessage="Terjadi kendala saat memuat pelacak aksi reduce bebas sampah. Anda dapat mencoba memuat ulang di bawah."
            >
              <ReduceActionTracker
                currentUser={currentUser}
                onUpdateUser={(updated) => {
                  setCurrentUser(updated);
                  showAppToast('Poin dan XP aksi reduce berhasil diperbarui!');
                }}
              />
            </ErrorBoundary>
          )}

          {activeTab === 'komunitas' && (
            <ErrorBoundary
              fallbackTitle="Bursa & Papan Dicari Mengalami Kendala Sementara"
              fallbackMessage="Terjadi kendala saat memuat modul bursa reuse dan papan dicari. Anda dapat menekan tombol coba pulihkan di bawah."
            >
              <CommunityView
                currentUser={currentUser}
                onOpenChatWithSeller={handleOpenChatWithSeller}
                onOpenUserProfile={handleOpenUserProfile}
              />
            </ErrorBoundary>
          )}

          {activeTab === 'scanner' && (
            <AIScannerView
              currentUser={currentUser}
              onNavigateToEducation={() => setActiveTab('edukasi')}
              onNavigateToCommunity={() => setActiveTab('komunitas')}
              onCancel={() => setActiveTab('dashboard')}
            />
          )}

          {activeTab === 'edukasi' && (
            <EducationView
              onOpenScanner={() => setActiveTab('scanner')}
              onNavigateToScanner={() => setActiveTab('scanner')}
              onNavigateToMarketplace={() => setActiveTab('komunitas')}
            />
          )}

          {activeTab === 'gamification' && (
            <GamificationView
              currentUser={currentUser}
              onUpdateUser={(updated) => {
                setCurrentUser(updated);
                showAppToast('Poin dan profil Anda berhasil diperbarui!');
              }}
            />
          )}

          {activeTab === 'admin' && (
            <ProtectedRoute
              requiredRoles={['admin_kampus', 'admin']}
              onUnauthorizedRedirect={() => setActiveTab('dashboard')}
            >
              <AdminDashboardView
                currentUser={currentUser}
                onNavigateToTab={setActiveTab}
                onShowToast={showAppToast}
              />
            </ProtectedRoute>
          )}

          {activeTab === 'ledger' && (
            <ProtectedRoute
              requiredRoles={['petugas_tps', 'admin_kampus', 'admin']}
              onUnauthorizedRedirect={() => setActiveTab('dashboard')}
            >
              <LedgerAuditView
                currentUser={currentUser}
                transactions={transactions}
                onVerifyTransaction={handleVerifyTransaction}
                onRejectTransaction={handleRejectTransaction}
                onRecordDeposit={handleRecordDeposit}
              />
            </ProtectedRoute>
          )}
        </Suspense>
      </ConsoleLayout>
      )}

      {/* Idle Session Warning Modal (OWASP Inactivity Protocol) */}
      <IdleSessionWarningModal />

      {/* Cookie & Privacy Consent Banner (GDPR / PDPL Compliance) */}
      {!hasAcceptedCookies && (
        <div 
          id="cookie-consent-banner"
          className="fixed bottom-4 left-4 right-4 sm:left-6 sm:right-auto sm:max-w-md z-50 bg-white border border-slate-200 rounded-2xl p-4 shadow-2xl animate-in slide-in-from-bottom-5 duration-200"
        >
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <Cookie className="w-4 h-4" />
            </div>
            <div className="flex-1 text-xs">
              <div className="font-bold text-slate-900 mb-0.5">Privasi & Penyimpanan Data Kampus</div>
              <p className="text-slate-600 leading-snug text-[11px] mb-2.5">
                EcoCampus 3R menyimpan data sesi bursa, riwayat scan, dan tantangan di penyimpanan lokal demi kecepatan akses & kepatuhan privasi (UU PDP).
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setHasAcceptedCookies(true);
                    localStorage.setItem('ecocampus_privacy_accepted', 'true');
                  }}
                  id="accept-cookies-btn"
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors"
                >
                  Setuju & Lanjutkan
                </button>
                <button
                  onClick={() => setIsPrivacyModalOpen(true)}
                  id="view-privacy-policy-btn"
                  className="px-2.5 py-1.5 text-slate-600 hover:text-slate-900 text-xs font-semibold hover:underline"
                >
                  Kebijakan Privasi
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      <Suspense fallback={null}>
        <OnboardingModal
          isOpen={isOnboardingOpen}
          onClose={() => setIsOnboardingOpen(false)}
          onNavigateToTab={(tab) => setActiveTab(tab)}
        />

        <SystemArchitectureModal
          isOpen={isArchitectureOpen}
          onClose={() => setIsArchitectureOpen(false)}
        />

        <PrivacyPolicyModal
          isOpen={isPrivacyModalOpen}
          onClose={() => setIsPrivacyModalOpen(false)}
        />

        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          onLogin={handleLogin}
          currentUser={currentUser}
          initialMode={authModalMode}
        />

        <UserInboxModal
          isOpen={isInboxModalOpen}
          onClose={() => {
            setIsInboxModalOpen(false);
            setActiveChatThreadId(null);
          }}
          currentUser={currentUser}
          initialThreadId={activeChatThreadId}
          onOpenUserProfile={handleOpenUserProfile}
          threads={chatThreads}
          onSendMessage={handleSendMessage}
          onSelectThread={(threadId) => setActiveChatThreadId(threadId)}
        />

        <PublicProfileModal
          isOpen={isPublicProfileModalOpen}
          onClose={() => setIsPublicProfileModalOpen(false)}
          user={selectedPublicUser}
          onOpenChatWithUser={(user) => handleOpenChatWithSeller(user.name)}
        />

        <StudentSurveyModal
          isOpen={isStudentSurveyModalOpen}
          onClose={() => {
            setIsStudentSurveyModalOpen(false);
            setSurveys(getStoredSurveys());
            if (currentUser?.id) {
              setAnsweredSurveyIds(getUserAnsweredSurveyIds(currentUser.id));
            }
          }}
          currentUser={currentUser}
          activeSurveys={surveys}
          answeredSurveyIds={answeredSurveyIds}
          onSurveyCompleted={(surveyId) => {
            setCurrentUser((prev) => ({
              ...prev,
              ecoPoints: prev.ecoPoints + 25,
            }));
            setSurveys(getStoredSurveys());
            if (currentUser?.id) {
              setAnsweredSurveyIds(getUserAnsweredSurveyIds(currentUser.id));
            }
            showAppToast('Terima kasih! Jawaban survei Anda berhasil disimpan (+25 Eco-Points).');
          }}
        />

        <RoleApplicationModal
          isOpen={isRoleApplicationModalOpen}
          onClose={() => setIsRoleApplicationModalOpen(false)}
          currentUser={currentUser}
          onSubmitSuccess={() => {
            showAppToast('Pengajuan perubahan peran Anda telah dikirim dan menunggu verifikasi Admin.');
          }}
        />

        <RoleSwitchModal
          isOpen={isRoleModalOpen}
          onClose={() => setIsRoleModalOpen(false)}
          currentUser={currentUser}
          onSelectUser={(user) => {
            handleLogin(user);
            showAppToast(`Beralih ke akun ${user.name} (${user.role})`);
          }}
        />

        <PickupRequestModal
          isOpen={isPickupModalOpen}
          onClose={() => setIsPickupModalOpen(false)}
          currentUser={currentUser}
          onSubmitRequest={handlePickupRequest}
        />
      </Suspense>
    </div>
  );
}
