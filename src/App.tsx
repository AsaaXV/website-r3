import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { DashboardView } from './components/DashboardView';
import { EducationView } from './components/EducationView';
import { FacilitiesView } from './components/FacilitiesView';
import { CommunityView } from './components/CommunityView';
import { GamificationView } from './components/GamificationView';
import { AIScannerView } from './components/AIScannerView';
import { LedgerAuditView } from './components/LedgerAuditView';
import { SusEvaluationModal } from './components/SusEvaluationModal';
import { RoleSwitchModal } from './components/RoleSwitchModal';
import { PickupRequestModal } from './components/PickupRequestModal';
import { AuthModal } from './components/AuthModal';
import { UserInboxModal } from './components/UserInboxModal';
import { PublicProfileModal } from './components/PublicProfileModal';
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
  RewardItem,
  PickupRequest,
  ChatThread,
  ChatMessage,
  ReuseItem,
} from './types';
import { Leaf, ShieldCheck, CheckCircle2, MessageSquare, LogIn } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('edukasi');

  // Authentication State
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    const saved = localStorage.getItem('ecocampus_logged_in');
    return saved !== null ? saved === 'true' : true;
  });

  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('ecocampus_user_profile');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return INITIAL_USER;
      }
    }
    return INITIAL_USER;
  });

  // Save session to localStorage
  useEffect(() => {
    localStorage.setItem('ecocampus_logged_in', String(isLoggedIn));
    localStorage.setItem('ecocampus_user_profile', JSON.stringify(currentUser));
  }, [isLoggedIn, currentUser]);

  const [transactions, setTransactions] = useState<LedgerTransaction[]>(INITIAL_LEDGER_TRANSACTIONS);
  const [susScore, setSusScore] = useState<number>(88.5);
  const [pickupRequests, setPickupRequests] = useState<PickupRequest[]>([]);

  // Chat & Messaging State (Inter-User Feature)
  const [chatThreads, setChatThreads] = useState<ChatThread[]>(INITIAL_CHAT_THREADS);
  const [activeChatThreadId, setActiveChatThreadId] = useState<string | null>(null);

  // Modals state
  const [isRoleModalOpen, setIsRoleModalOpen] = useState<boolean>(false);
  const [isSusModalOpen, setIsSusModalOpen] = useState<boolean>(false);
  const [isPickupModalOpen, setIsPickupModalOpen] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');
  const [isInboxModalOpen, setIsInboxModalOpen] = useState<boolean>(false);
  const [isPublicProfileModalOpen, setIsPublicProfileModalOpen] = useState<boolean>(false);
  const [selectedPublicUser, setSelectedPublicUser] = useState<UserProfile | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showAppToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Unread messages count
  const unreadMessagesCount = chatThreads.reduce(
    (acc, thread) => acc + (thread.unreadCount || 0),
    0
  );

  // Handle Login & Logout
  const handleLogin = (user: UserProfile) => {
    setCurrentUser(user);
    setIsLoggedIn(true);
    showAppToast(`Selamat datang kembali, ${user.name}!`);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    showAppToast('Anda telah keluar dari akun. Menjelajah dalam Mode Tamu.');
  };

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

  // Redeem Reward from Gamification Store
  const handleRedeemReward = (reward: RewardItem): boolean => {
    if (!isLoggedIn) {
      setAuthModalMode('login');
      setIsAuthModalOpen(true);
      showAppToast('Silakan masuk akun kampus untuk menukarkan hadiah');
      return false;
    }
    if (currentUser.ecoPoints < reward.costPoints) return false;

    setCurrentUser((prev) => ({
      ...prev,
      ecoPoints: prev.ecoPoints - reward.costPoints,
    }));
    showAppToast(`Berhasil menukarkan voucher ${reward.title}!`);
    return true;
  };

  // Send Message in Inter-User Chat
  const handleSendMessage = (threadId: string, text: string) => {
    setChatThreads((prevThreads) =>
      prevThreads.map((thread) => {
        if (thread.id === threadId) {
          const newMsg: ChatMessage = {
            id: `msg_${Date.now()}`,
            senderId: currentUser.id,
            senderName: currentUser.name,
            recipientId: thread.participantId,
            recipientName: thread.participantName,
            text,
            timestamp: new Date().toLocaleTimeString('id-ID', {
              hour: '2-digit',
              minute: '2-digit',
            }) + ' WITA',
            isSelf: true,
          };
          return {
            ...thread,
            lastMessage: text,
            lastTimestamp: 'Baru saja',
            messages: [...thread.messages, newMsg],
          };
        }
        return thread;
      })
    );
  };

  // Open Chat with Seller or Peer
  const handleOpenChatWithSeller = (sellerName: string, item?: ReuseItem) => {
    // Find matching thread or create one
    let existing = chatThreads.find(
      (t) => t.participantName.toLowerCase() === sellerName.toLowerCase()
    );

    if (existing) {
      setActiveChatThreadId(existing.id);
    } else {
      // Find seller profile in demo accounts
      const matchedProfile = DEMO_ACCOUNTS.find(
        (acc) => acc.name.toLowerCase() === sellerName.toLowerCase()
      );

      const newThreadId = `thread_${Date.now()}`;
      const newThread: ChatThread = {
        id: newThreadId,
        participantId: matchedProfile?.id || `peer_${Date.now()}`,
        participantName: sellerName,
        participantAvatar:
          matchedProfile?.avatarUrl ||
          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
        participantRole: matchedProfile?.role === 'petugas_tps' ? 'Petugas TPST' : 'Mahasiswa',
        participantFaculty: matchedProfile?.faculty || 'Kampus Unhas',
        onlineStatus: 'online',
        lastMessage: item ? `Halo kak, saya tertarik dengan ${item.title}` : 'Halo rekan mahasiswa!',
        lastTimestamp: 'Baru saja',
        unreadCount: 0,
        itemContext: item
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
          : undefined,
        messages: [
          {
            id: `msg_init_${Date.now()}`,
            senderId: currentUser.id,
            senderName: currentUser.name,
            recipientId: matchedProfile?.id || 'peer',
            recipientName: sellerName,
            text: item
              ? `Halo kak ${sellerName}, saya mahasiswa tertarik dengan barang "${item.title}". Apakah masih tersedia untuk COD di kampus?`
              : 'Halo kak, salam lestari!',
            timestamp: new Date().toLocaleTimeString('id-ID', {
              hour: '2-digit',
              minute: '2-digit',
            }) + ' WITA',
            isSelf: true,
            itemTitle: item?.title,
          },
        ],
      };

      setChatThreads((prev) => [newThread, ...prev]);
      setActiveChatThreadId(newThreadId);
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

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-3 text-xs font-semibold animate-in fade-in slide-in-from-bottom-5 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main App Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={currentUser}
        isLoggedIn={isLoggedIn}
        onOpenRoleModal={() => setIsRoleModalOpen(true)}
        onOpenSusModal={() => setIsSusModalOpen(true)}
        onOpenAuthModal={(mode) => {
          setAuthModalMode(mode);
          setIsAuthModalOpen(true);
        }}
        onLogout={handleLogout}
        onOpenInbox={() => setIsInboxModalOpen(true)}
        onOpenMyProfile={() => {
          setSelectedPublicUser(currentUser);
          setIsPublicProfileModalOpen(true);
        }}
        unreadMessagesCount={unreadMessagesCount}
      />

      {/* Main Tab Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {activeTab === 'edukasi' && (
          <EducationView
            onOpenScanner={() => setActiveTab('scanner')}
            onNavigateToScanner={() => setActiveTab('scanner')}
            onNavigateToMap={() => setActiveTab('fasilitas')}
            onNavigateToMarketplace={() => setActiveTab('komunitas')}
          />
        )}

        {activeTab === 'dashboard' && (
          <DashboardView
            currentUser={currentUser}
            transactions={transactions}
            onNavigate={setActiveTab}
            onOpenSusModal={() => setIsSusModalOpen(true)}
            susScore={susScore}
            onNavigateToScanner={() => setActiveTab('scanner')}
            onNavigateToGamification={() => setActiveTab('gamification')}
            onNavigateToEducation={() => setActiveTab('edukasi')}
          />
        )}

        {activeTab === 'scanner' && (
          <AIScannerView
            onNavigateToEducation={() => setActiveTab('edukasi')}
            onNavigateToCommunity={() => setActiveTab('komunitas')}
            onNavigateToMap={() => setActiveTab('fasilitas')}
            onCancel={() => setActiveTab('dashboard')}
          />
        )}

        {activeTab === 'fasilitas' && (
          <FacilitiesView
            onOpenPickupModal={() => setIsPickupModalOpen(true)}
            onRequestPickup={() => setIsPickupModalOpen(true)}
            currentUserRole={currentUser.role}
          />
        )}

        {activeTab === 'komunitas' && (
          <CommunityView
            currentUser={currentUser}
            onRedeemReward={handleRedeemReward}
            onOpenChatWithSeller={handleOpenChatWithSeller}
            onOpenUserProfile={handleOpenUserProfile}
          />
        )}

        {activeTab === 'gamification' && (
          <GamificationView
            currentUser={currentUser}
            onRedeemReward={handleRedeemReward}
            onUpdateUser={(updated) => {
              setCurrentUser(updated);
              showAppToast('Poin dan profil Anda berhasil diperbarui!');
            }}
          />
        )}

        {activeTab === 'ledger' && (
          <LedgerAuditView
            transactions={transactions}
            onVerifyTransaction={(id) => {
              setTransactions((prev) =>
                prev.map((t) => (t.id === id ? { ...t, status: 'verified' } : t))
              );
              showAppToast('Aksi berhasil diverifikasi dan poin dikreditkan!');
            }}
          />
        )}

        {/* Fallback in case of unknown tab */}
        {!['edukasi', 'dashboard', 'scanner', 'fasilitas', 'komunitas', 'gamification', 'ledger'].includes(activeTab) && (
          <DashboardView
            currentUser={currentUser}
            transactions={transactions}
            onNavigate={setActiveTab}
            onOpenSusModal={() => setIsSusModalOpen(true)}
            susScore={susScore}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold">
              <Leaf className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-slate-900">
                EcoCampus 3R • Platform Edukasi, Reduksi Sampah & Sirkularitas Kampus
              </div>
              <p className="text-[11px] text-slate-500">
                Edukasi 3R, Peta TPA Akhir, Bursa Reuse Preloved Sivitas Kampus, dan Fitur Komunikasi Antar-Pengguna
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-[11px]">
            <span className="flex items-center gap-1 text-slate-600 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Sistem Akun SSO Kampus</span>
            </span>
            <span className="text-slate-300">|</span>
            <button
              onClick={() => setIsInboxModalOpen(true)}
              className="flex items-center gap-1 text-emerald-700 font-bold hover:underline"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Pesan Antar-Pengguna ({unreadMessagesCount})</span>
            </button>
            <span className="text-slate-300">|</span>
            <button
              onClick={() => setIsSusModalOpen(true)}
              className="text-indigo-600 font-bold hover:underline"
            >
              Skor SUS: {susScore.toFixed(1)} / 100
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLogin={handleLogin}
        currentUser={currentUser}
        initialMode={authModalMode}
      />

      <UserInboxModal
        isOpen={isInboxModalOpen}
        onClose={() => setIsInboxModalOpen(false)}
        currentUser={currentUser}
        initialThreadId={activeChatThreadId}
        onOpenUserProfile={handleOpenUserProfile}
        threads={chatThreads}
        onSendMessage={handleSendMessage}
      />

      <PublicProfileModal
        isOpen={isPublicProfileModalOpen}
        onClose={() => setIsPublicProfileModalOpen(false)}
        user={selectedPublicUser}
        onOpenChatWithUser={(user) => handleOpenChatWithSeller(user.name)}
      />

      <RoleSwitchModal
        isOpen={isRoleModalOpen}
        onClose={() => setIsRoleModalOpen(false)}
        currentUser={currentUser}
        onSelectUser={(user) => {
          setCurrentUser(user);
          setIsLoggedIn(true);
          showAppToast(`Beralih ke akun ${user.name} (${user.role})`);
        }}
      />

      <SusEvaluationModal
        isOpen={isSusModalOpen}
        onClose={() => setIsSusModalOpen(false)}
        onSaveScore={(newScore) => setSusScore(newScore)}
        currentScore={susScore}
      />

      <PickupRequestModal
        isOpen={isPickupModalOpen}
        onClose={() => setIsPickupModalOpen(false)}
        currentUser={currentUser}
        onSubmitRequest={handlePickupRequest}
      />
    </div>
  );
}
