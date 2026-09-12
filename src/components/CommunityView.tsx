import React, { useState, useMemo } from 'react';
import {
  Users,
  Trophy,
  Repeat,
  MessageSquare,
  Sparkles,
  Plus,
  CheckCircle2,
  Heart,
  Share2,
  Tag,
  MapPin,
  ExternalLink,
  Flame,
  Award,
  Search,
  SlidersHorizontal,
  ArrowUpDown,
  Eye,
  ShieldCheck,
  Phone,
  MessageCircle,
  Clock,
  X,
  UserCheck,
  BookOpen,
  Laptop,
  Check,
  Filter,
  Grid,
  List as ListIcon,
  ShoppingCart,
  Trash2,
  ShoppingBag
} from 'lucide-react';
import {
  UserProfile,
  RewardItem,
  ReuseItem,
  ForumPost,
  ItemRequest
} from '../types';
import {
  REUSE_ITEMS,
  FORUM_POSTS,
  REWARD_ITEMS,
  INITIAL_LEADERBOARD_STUDENTS,
  FACULTY_LEADERBOARD_DATA
} from '../data/mockData';
import {
  getStoredReuseItems,
  saveStoredReuseItems,
  getStoredItemRequests,
  saveStoredItemRequests,
  SAFE_COD_SPOTS
} from '../utils/storage';
import confetti from 'canvas-confetti';

interface CommunityViewProps {
  currentUser: UserProfile;
  onRedeemReward: (reward: RewardItem) => boolean;
  onOpenChatWithSeller?: (sellerName: string, item?: ReuseItem) => void;
  onOpenUserProfile?: (userId: string, userName: string) => void;
}

// Preset photo options for quick ad posting
const PHOTO_PRESETS = [
  { label: 'Buku Kuliah', url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80' },
  { label: 'Alat Gambar / Meja', url: 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&w=600&q=80' },
  { label: 'Elektronik / Kalkulator', url: 'https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?auto=format&fit=crop&w=600&q=80' },
  { label: 'Peralatan Kos / Kipas', url: 'https://images.unsplash.com/photo-1618941716939-553df3c6c278?auto=format&fit=crop&w=600&q=80' },
  { label: 'Jas Lab / Medis', url: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=600&q=80' },
  { label: 'Tas / Perlengkapan', url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80' },
];

export const CommunityView: React.FC<CommunityViewProps> = ({
  currentUser,
  onRedeemReward,
  onOpenChatWithSeller,
  onOpenUserProfile,
}) => {
  // Navigation Tabs inside Community
  const [activeTab, setActiveTab] = useState<'reuse' | 'requests' | 'leaderboard' | 'forum'>('reuse');
  const [reuseItems, setReuseItems] = useState<ReuseItem[]>(() => getStoredReuseItems());
  const [forumPosts, setForumPosts] = useState<ForumPost[]>(FORUM_POSTS);

  // Request Board State (Fitur Dicari Mahasiswa)
  const [itemRequests, setItemRequests] = useState<ItemRequest[]>(() => getStoredItemRequests());
  const [isNewRequestModalOpen, setIsNewRequestModalOpen] = useState(false);
  const [requestSearchQuery, setRequestSearchQuery] = useState('');
  const [requestUrgencyFilter, setRequestUrgencyFilter] = useState<'all' | 'Segera' | 'Santai' | 'Fleksibel'>('all');

  // New Request Form fields
  const [reqTitle, setReqTitle] = useState('');
  const [reqDesc, setReqDesc] = useState('');
  const [reqCategory, setReqCategory] = useState('Peralatan Kos');
  const [reqUrgency, setReqUrgency] = useState<'Segera' | 'Santai' | 'Fleksibel'>('Segera');
  const [reqMeetupSpot, setReqMeetupSpot] = useState(SAFE_COD_SPOTS[0]);
  const [reqWhatsapp, setReqWhatsapp] = useState('0812' + Math.floor(10000000 + Math.random() * 90000000));

  // Campus Reuse Marketplace Search & Filtering
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCampusLocation, setSelectedCampusLocation] = useState('Semua Lokasi');
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [filterPricingType, setFilterPricingType] = useState<'all' | 'free' | 'cash' | 'points'>('all');
  const [onlyNego, setOnlyNego] = useState(false);
  const [sortBy, setSortBy] = useState<'newest' | 'priceAsc' | 'priceDesc' | 'popular'>('newest');
  const [viewLayout, setViewLayout] = useState<'grid' | 'list'>('grid');

  // Wishlist / Liked items
  const [wishlistIds, setWishlistIds] = useState<string[]>(['reuse_01', 'reuse_05']);

  // Reuse Cart & COD Coordination Management
  const [cartItemIds, setCartItemIds] = useState<string[]>(['reuse_02', 'reuse_04']);
  const [isCartModalOpen, setIsCartModalOpen] = useState(false);

  // Modals
  const [activeDetailItem, setActiveDetailItem] = useState<ReuseItem | null>(null);
  const [isPostAdModalOpen, setIsPostAdModalOpen] = useState(false);
  const [isNewForumModalOpen, setIsNewForumModalOpen] = useState(false);
  const [redeemSuccessMsg, setRedeemSuccessMsg] = useState<string | null>(null);
  const [quickToastMsg, setQuickToastMsg] = useState<string | null>(null);

  // In-App Chat Modal (For direct COD coordination)
  const [chattingWithItem, setChattingWithItem] = useState<ReuseItem | null>(null);
  const [chatMessageText, setChatMessageText] = useState('');
  const [chatSentSuccess, setChatSentSuccess] = useState(false);

  // Post New Ad Form State
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState<ReuseItem['category']>('Buku & Diktat');
  const [formCondition, setFormCondition] = useState<ReuseItem['condition']>('Sangat Baik');
  const [formPricingType, setFormPricingType] = useState<'free' | 'cash' | 'points'>('free');
  const [formCashPrice, setFormCashPrice] = useState<number>(35000);
  const [formPointPrice, setFormPointPrice] = useState<number>(30);
  const [formIsNego, setFormIsNego] = useState(true);
  const [formLocation, setFormLocation] = useState('Lobi Fakultas Teknik');
  const [formMeetupPoint, setFormMeetupPoint] = useState('Kantin Danau Rektorat / Lobi Gedung Sipil');
  const [formWhatsapp, setFormWhatsapp] = useState('0812' + Math.floor(10000000 + Math.random() * 90000000));
  const [formImageUrl, setFormImageUrl] = useState(PHOTO_PRESETS[0].url);
  const [formDesc, setFormDesc] = useState('');

  // Forum state
  const [forumTitle, setForumTitle] = useState('');
  const [forumContent, setForumContent] = useState('');
  const [forumCategory, setForumCategory] = useState<'Diskusi' | 'Ide Inovasi' | 'Tanya Petugas' | 'Kegiatan Bersih'>('Diskusi');

  const showToast = (msg: string) => {
    setQuickToastMsg(msg);
    setTimeout(() => setQuickToastMsg(null), 3500);
  };

  const toggleWishlist = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setWishlistIds((prev) => {
      const isFav = prev.includes(id);
      if (isFav) {
        showToast('Iklan dihapus dari daftar favorit');
        return prev.filter((item) => item !== id);
      } else {
        showToast('Iklan disimpan ke daftar favorit');
        return [...prev, id];
      }
    });
  };

  // Filter and sort items
  const filteredAndSortedItems = useMemo(() => {
    let result = [...reuseItems];

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          item.donorName.toLowerCase().includes(q) ||
          item.location.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q)
      );
    }

    // Location Filter
    if (selectedCampusLocation !== 'Semua Lokasi') {
      result = result.filter((item) =>
        item.location.toLowerCase().includes(selectedCampusLocation.toLowerCase()) ||
        item.donorFaculty.toLowerCase().includes(selectedCampusLocation.toLowerCase())
      );
    }

    // Category Filter
    if (selectedCategory !== 'Semua') {
      result = result.filter((item) => item.category === selectedCategory);
    }

    // Pricing type
    if (filterPricingType === 'free') {
      result = result.filter((item) => item.isFree);
    } else if (filterPricingType === 'cash') {
      result = result.filter((item) => !item.isFree && (item.priceRupiah || 0) > 0);
    } else if (filterPricingType === 'points') {
      result = result.filter((item) => !item.isFree && item.pointPrice > 0);
    }

    // Nego only
    if (onlyNego) {
      result = result.filter((item) => item.isNego);
    }

    // Sorting
    result.sort((a, b) => {
      if (sortBy === 'newest') {
        return (b.id.localeCompare(a.id));
      } else if (sortBy === 'priceAsc') {
        const pA = a.isFree ? 0 : (a.priceRupiah || a.pointPrice * 1000);
        const pB = b.isFree ? 0 : (b.priceRupiah || b.pointPrice * 1000);
        return pA - pB;
      } else if (sortBy === 'priceDesc') {
        const pA = a.isFree ? 0 : (a.priceRupiah || a.pointPrice * 1000);
        const pB = b.isFree ? 0 : (b.priceRupiah || b.pointPrice * 1000);
        return pB - pA;
      } else if (sortBy === 'popular') {
        return (b.viewsCount || 0) - (a.viewsCount || 0);
      }
      return 0;
    });

    return result;
  }, [reuseItems, searchQuery, selectedCampusLocation, selectedCategory, filterPricingType, onlyNego, sortBy]);

  // Filtered Item Requests for Request Board
  const filteredItemRequests = useMemo(() => {
    let list = [...itemRequests];
    if (requestSearchQuery.trim()) {
      const q = requestSearchQuery.toLowerCase();
      list = list.filter(
        (r) =>
          r.title.toLowerCase().includes(q) ||
          r.description.toLowerCase().includes(q) ||
          r.category.toLowerCase().includes(q) ||
          r.requesterName.toLowerCase().includes(q)
      );
    }
    if (requestUrgencyFilter !== 'all') {
      list = list.filter((r) => r.urgency === requestUrgencyFilter);
    }
    return list;
  }, [itemRequests, requestSearchQuery, requestUrgencyFilter]);

  // Cart Management
  const toggleCart = (itemId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setCartItemIds((prev) => {
      const exists = prev.includes(itemId);
      if (exists) {
        showToast('Barang dikeluarkan dari keranjang.');
        return prev.filter((id) => id !== itemId);
      } else {
        showToast('Barang dimasukkan ke keranjang reuse!');
        return [...prev, itemId];
      }
    });
  };

  const removeFromCart = (itemId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setCartItemIds((prev) => prev.filter((id) => id !== itemId));
    showToast('Barang dihapus dari keranjang.');
  };

  const cartItemsList = useMemo(() => {
    return reuseItems.filter((i) => cartItemIds.includes(i.id));
  }, [reuseItems, cartItemIds]);

  // Handle Post New Reuse Item
  const handlePostAd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    const isFree = formPricingType === 'free';
    const newItem: ReuseItem = {
      id: `reuse_${Date.now()}`,
      title: formTitle,
      category: formCategory,
      condition: formCondition,
      isFree,
      pointPrice: isFree ? 0 : formPricingType === 'points' ? formPointPrice : 0,
      priceRupiah: isFree ? 0 : formPricingType === 'cash' ? formCashPrice : 0,
      isNego: isFree ? false : formIsNego,
      donorName: currentUser.name,
      donorFaculty: currentUser.faculty,
      location: formLocation,
      meetupPoint: formMeetupPoint,
      imageUrl: formImageUrl,
      description: formDesc || 'Barang second/preloved layak pakai dari mahasiswa, siap COD di lingkungan kampus.',
      postedAt: 'Baru saja',
      status: 'available',
      contactWhatsapp: formWhatsapp,
      sellerRating: 5.0,
      viewsCount: 1,
      isVerifiedStudent: true,
    };

    const updatedItems = [newItem, ...reuseItems];
    setReuseItems(updatedItems);
    saveStoredReuseItems(updatedItems);
    setIsPostAdModalOpen(false);
    confetti({ particleCount: 70, spread: 80, origin: { y: 0.6 } });
    showToast('Iklan barang berhasil dipasang di Bursa Reuse Kampus!');

    // Reset fields
    setFormTitle('');
    setFormDesc('');
  };

  // Handle Create Item Request
  const handleCreateRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reqTitle.trim()) return;

    const newReq: ItemRequest = {
      id: `req_${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      userEmail: currentUser.email,
      userFaculty: currentUser.faculty,
      requesterName: currentUser.name,
      requesterFaculty: currentUser.faculty,
      title: reqTitle,
      description: reqDesc || 'Dibutuhkan untuk keperluan mendesak di kampus.',
      category: reqCategory as any,
      urgency: reqUrgency,
      preferredCodSpot: reqMeetupSpot,
      preferredMeetupPoint: reqMeetupSpot,
      status: 'open',
      createdAt: 'Baru saja',
      postedAt: 'Baru saja',
      responsesCount: 0,
      contactWhatsapp: reqWhatsapp,
    };

    const updated = [newReq, ...itemRequests];
    setItemRequests(updated);
    saveStoredItemRequests(updated);
    setIsNewRequestModalOpen(false);
    confetti({ particleCount: 70, spread: 80, origin: { y: 0.6 } });
    showToast('Permintaan barang berhasil diposting ke Papan "Dicari"!');
    setReqTitle('');
    setReqDesc('');
  };

  // Toggle Request Fulfilled status
  const handleToggleRequestFulfill = (reqId: string) => {
    const updated = itemRequests.map((r) =>
      r.id === reqId ? { ...r, status: (r.status === 'open' ? 'fulfilled' : 'open') as any } : r
    );
    setItemRequests(updated);
    saveStoredItemRequests(updated);
    showToast('Status permintaan berhasil diperbarui!');
  };

  // Handle Send In-App Chat
  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessageText.trim()) return;
    setChatSentSuccess(true);
    setTimeout(() => {
      setChatSentSuccess(false);
      setChattingWithItem(null);
      setChatMessageText('');
      showToast('Pesan berhasil terkirim ke penjual');
    }, 1500);
  };

  // Handle New Forum Post
  const handleAddForumPost = (e: React.FormEvent) => {
    e.preventDefault();
    const post: ForumPost = {
      id: `post_${Date.now()}`,
      authorName: currentUser.name,
      authorFaculty: currentUser.faculty,
      authorRole: currentUser.role === 'petugas_tps' ? 'Petugas TPST' : 'Mahasiswa',
      avatarUrl: currentUser.avatarUrl,
      title: forumTitle,
      content: forumContent,
      category: forumCategory,
      likes: 1,
      repliesCount: 0,
      createdAt: 'Baru saja',
      tags: ['Komunitas Kampus', 'Bursa Preloved', 'Zero Waste'],
    };
    setForumPosts([post, ...forumPosts]);
    setIsNewForumModalOpen(false);
    setForumTitle('');
    setForumContent('');
    showToast('Topik diskusi berhasil diterbitkan!');
  };

  const handleRedeem = (reward: RewardItem) => {
    const success = onRedeemReward(reward);
    if (success) {
      confetti({ particleCount: 70, spread: 80, origin: { y: 0.6 } });
      setRedeemSuccessMsg(`Berhasil menukarkan "${reward.title}"! Voucher digital aktif di profil.`);
      setTimeout(() => setRedeemSuccessMsg(null), 4000);
    } else {
      alert(`Saldo Eco-Points (${currentUser.ecoPoints} pts) belum mencukupi untuk hadiah ini (${reward.costPoints} pts).`);
    }
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Quick Toast Notification */}
      {quickToastMsg && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-semibold shadow-2xl flex items-center gap-2 animate-bounce-short">
          <Sparkles className="w-4 h-4 text-yellow-400" />
          <span>{quickToastMsg}</span>
        </div>
      )}

      {/* Top Banner Navigation */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-teal-50 text-teal-900 border border-teal-200 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-teal-600 animate-pulse" />
              <span>Bursa Reuse & Preloved Kampus</span>
            </span>
            <span className="text-xs text-slate-500 font-medium hidden sm:inline">
              Mencegah barang layak pakai terbuang ke TPA Tamangapa
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Pusat Barter, Hibah & Preloved Mahasiswa
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
            Sistem sirkular preloved khusus sivitas akademika. Simpan barang ke keranjang, lalu chat langsung penjual untuk janjian COD di area kampus yang aman dan nyaman.
          </p>
        </div>

        {/* Tab Switcher Pills */}
        <div className="flex p-1 rounded-xl bg-slate-100 border border-slate-200 self-start md:self-auto shrink-0">
          <button
            onClick={() => setActiveTab('reuse')}
            id="tab-reuse-marketplace"
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'reuse'
                ? 'bg-teal-900 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Repeat className="w-3.5 h-3.5 text-teal-300" />
            <span>Bursa Reuse Kampus</span>
          </button>
          <button
            onClick={() => setActiveTab('requests')}
            id="tab-requests-board"
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'requests'
                ? 'bg-teal-900 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Search className="w-3.5 h-3.5 text-amber-300" />
            <span>Papan "Dicari" ({itemRequests.filter((r) => r.status === 'open').length})</span>
          </button>
          <button
            onClick={() => setActiveTab('leaderboard')}
            id="tab-leaderboard"
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'leaderboard'
                ? 'bg-teal-900 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span>Peringkat & Hadiah</span>
          </button>
          <button
            onClick={() => setActiveTab('forum')}
            id="tab-forum"
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'forum'
                ? 'bg-teal-900 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5 text-indigo-400" />
            <span>Forum Diskusi</span>
          </button>
        </div>
      </div>

      {/* Success Notification Alert */}
      {redeemSuccessMsg && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{redeemSuccessMsg}</span>
        </div>
      )}

      {/* ================= TAB 1: BURSA KAMPUS MARKETPLACE ================= */}
      {activeTab === 'reuse' && (
        <div className="space-y-6">
          {/* SIGNATURE HERO SEARCH & POST AD BAR */}
          <div className="bg-gradient-to-br from-teal-950 via-slate-900 to-teal-900 text-white rounded-3xl p-5 sm:p-7 shadow-xl relative overflow-hidden border border-teal-800/40">
            {/* Ambient decoration */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

            <div className="relative z-10 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <div className="px-3 py-1 rounded-full bg-teal-400/20 text-teal-300 border border-teal-400/30 text-xs font-black tracking-wider uppercase flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                    <span>Bursa Barang Preloved Kampus</span>
                  </div>
                  <span className="text-xs text-slate-300">
                    Pilah • Pakai Ulang • Janjian COD Langsung
                  </span>
                </div>

                {/* Right badges: Cart shortcut & impact */}
                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    onClick={() => setIsCartModalOpen(true)}
                    className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black shadow-md transition-transform active:scale-95 cursor-pointer"
                  >
                    <ShoppingCart className="w-4 h-4 text-slate-950" />
                    <span>Keranjang Reuse</span>
                    <span className="px-1.5 py-0.2 rounded-full bg-slate-950 text-white text-[11px] font-bold">
                      {cartItemIds.length}
                    </span>
                  </button>

                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 text-xs text-emerald-200 font-semibold self-start sm:self-auto">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>312+ Barang Diselamatkan dari TPA</span>
                  </div>
                </div>
              </div>

              {/* Big Search Box with Location selector, JUAL button, & Cart */}
              <div className="flex flex-col lg:flex-row items-stretch gap-2.5 pt-1">
                {/* Search Input */}
                <div className="flex-1 relative flex items-center">
                  <Search className="w-5 h-5 text-slate-400 absolute left-4 pointer-events-none" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Cari buku Stewart, meja kos, kipas angin mini, kalkulator Casio, jas lab..."
                    className="w-full pl-12 pr-10 py-3.5 rounded-2xl bg-white text-slate-900 font-medium text-sm placeholder-slate-400 focus:outline-none focus:ring-3 focus:ring-teal-400 shadow-md"
                    id="reuse-search-input"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-4 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Location Filter Dropdown */}
                <div className="relative min-w-[210px] flex items-center">
                  <MapPin className="w-4 h-4 text-teal-700 absolute left-4 z-10 pointer-events-none" />
                  <select
                    value={selectedCampusLocation}
                    onChange={(e) => setSelectedCampusLocation(e.target.value)}
                    className="w-full pl-11 pr-8 py-3.5 rounded-2xl bg-white text-slate-900 font-semibold text-xs appearance-none focus:outline-none focus:ring-3 focus:ring-teal-400 shadow-md cursor-pointer"
                    id="reuse-location-select"
                  >
                    <option value="Semua Lokasi">Semua Lokasi Kampus</option>
                    <option value="Fakultas Teknik">Fakultas Teknik</option>
                    <option value="Fakultas Kedokteran">Fakultas Kedokteran</option>
                    <option value="Fakultas MIPA">Fakultas MIPA</option>
                    <option value="Fakultas Hukum">Fakultas Hukum</option>
                    <option value="Asrama Mahasiswa Ramsis">Asrama Ramsis</option>
                    <option value="Kantin Pusat / Danau">Kantin Danau & Perpus</option>
                    <option value="Kos Tamalanrea">Area Kos Tamalanrea</option>
                  </select>
                  <div className="absolute right-4 text-slate-400 pointer-events-none text-xs">▼</div>
                </div>

                {/* "+ PASANG IKLAN REUSE" BUTTON */}
                <button
                  onClick={() => setIsPostAdModalOpen(true)}
                  id="btn-post-reuse-ad"
                  className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/30 transition-all hover:scale-[1.02] active:scale-[0.98] border-2 border-white cursor-pointer shrink-0"
                >
                  <div className="w-5 h-5 rounded-full bg-slate-950 text-white flex items-center justify-center font-black text-xs">
                    +
                  </div>
                  <span>PASANG IKLAN REUSE</span>
                </button>
              </div>

              {/* CATEGORY HORIZONTAL CHIP RAIL */}
              <div className="pt-2 flex items-center gap-2 overflow-x-auto pb-1 text-xs no-scrollbar">
                <span className="text-[11px] font-bold text-teal-300 uppercase tracking-wider shrink-0 pr-1">
                  Kategori:
                </span>
                {[
                  { id: 'Semua', label: 'Semua Barang' },
                  { id: 'Buku & Diktat', label: '📚 Buku & Diktat' },
                  { id: 'Elektronik & Kos', label: '⚡ Elektronik Kos' },
                  { id: 'Alat Lab & Gambar', label: '📐 Alat Lab & Gambar' },
                  { id: 'Peralatan Kos', label: '🍳 Peralatan Kos' },
                  { id: 'Fashion & Sepatu', label: '👟 Fashion & Sepatu' },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-3 py-1.5 rounded-xl font-bold transition-all shrink-0 cursor-pointer ${
                      selectedCategory === cat.id
                        ? 'bg-teal-400 text-slate-950 shadow-md'
                        : 'bg-white/15 text-white hover:bg-white/25 border border-white/10'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* FILTERS & SORTING STRIP */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
            {/* Filter pills */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
                <Filter className="w-3.5 h-3.5" />
                <span>Skema:</span>
              </span>

              <button
                onClick={() => setFilterPricingType('all')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  filterPricingType === 'all'
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Semua
              </button>

              <button
                onClick={() => setFilterPricingType('free')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                  filterPricingType === 'free'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200'
                }`}
              >
                <span>🎁 Hibah Gratis (Rp 0)</span>
              </button>

              <button
                onClick={() => setFilterPricingType('cash')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  filterPricingType === 'cash'
                    ? 'bg-teal-700 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                💵 Tunai / Terjangkau (Rp)
              </button>

              <button
                onClick={() => setFilterPricingType('points')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  filterPricingType === 'points'
                    ? 'bg-amber-500 text-slate-950 font-black'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                ⚡ Tukar Eco-Points
              </button>

              <label className="flex items-center gap-1.5 ml-2 text-xs font-semibold text-slate-700 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={onlyNego}
                  onChange={(e) => setOnlyNego(e.target.checked)}
                  className="rounded text-teal-600"
                />
                <span>Hanya Bisa Nego</span>
              </label>
            </div>

            {/* Sort & Layout Toggles */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                <span className="font-semibold hidden sm:inline">Urutkan:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-slate-100 border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-bold text-slate-800 focus:outline-none cursor-pointer"
                >
                  <option value="newest">Iklan Terbaru</option>
                  <option value="priceAsc">Harga Terendah</option>
                  <option value="priceDesc">Harga Tertinggi</option>
                  <option value="popular">Paling Banyak Dilihat</option>
                </select>
              </div>

              {/* View Layout Toggle */}
              <div className="hidden sm:flex items-center p-1 rounded-lg bg-slate-100 border border-slate-200">
                <button
                  onClick={() => setViewLayout('grid')}
                  className={`p-1 rounded cursor-pointer ${viewLayout === 'grid' ? 'bg-white shadow-2xs text-slate-900' : 'text-slate-400'}`}
                  title="Tampilan Grid"
                >
                  <Grid className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setViewLayout('list')}
                  className={`p-1 rounded cursor-pointer ${viewLayout === 'list' ? 'bg-white shadow-2xs text-slate-900' : 'text-slate-400'}`}
                  title="Tampilan Daftar"
                >
                  <ListIcon className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* ACTIVE RESULTS SUMMARY */}
          <div className="flex items-center justify-between text-xs text-slate-500 px-1">
            <span>
              Menampilkan <strong>{filteredAndSortedItems.length}</strong> barang preloved aktif di kampus
            </span>
            {(searchQuery || selectedCategory !== 'Semua' || selectedCampusLocation !== 'Semua Lokasi' || filterPricingType !== 'all') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('Semua');
                  setSelectedCampusLocation('Semua Lokasi');
                  setFilterPricingType('all');
                  setOnlyNego(false);
                }}
                className="text-teal-700 font-bold hover:underline cursor-pointer"
              >
                Reset Semua Filter
              </button>
            )}
          </div>

          {/* EMPTY STATE IF NO ITEMS MATCH */}
          {filteredAndSortedItems.length === 0 && (
            <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4 max-w-lg mx-auto shadow-xs">
              <div className="w-16 h-16 rounded-full bg-teal-50 text-teal-700 flex items-center justify-center mx-auto">
                <Search className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900">Belum Ada Barang yang Cocok</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Coba gunakan kata kunci lain atau pasang iklan barang preloved ini agar bisa COD dengan rekan kampus!
                </p>
              </div>
              <button
                onClick={() => setIsPostAdModalOpen(true)}
                className="px-5 py-2.5 rounded-xl bg-teal-800 text-white font-bold text-xs hover:bg-teal-900 transition-colors shadow-xs cursor-pointer"
              >
                + Pasang Iklan Sekarang
              </button>
            </div>
          )}

          {/* REUSE LISTINGS: GRID VIEW */}
          {viewLayout === 'grid' && filteredAndSortedItems.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {filteredAndSortedItems.map((item) => {
                const isFavorited = wishlistIds.includes(item.id);
                const isClaimed = item.status === 'claimed';
                const isInCart = cartItemIds.includes(item.id);

                return (
                  <div
                    key={item.id}
                    onClick={() => setActiveDetailItem(item)}
                    id={`reuse-card-${item.id}`}
                    className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden flex flex-col justify-between hover:border-teal-400 hover:shadow-lg transition-all duration-200 cursor-pointer group"
                  >
                    <div>
                      {/* Card Image Container with Badges */}
                      <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ${isClaimed ? 'grayscale opacity-60' : ''}`}
                        />

                        {/* Top Category Tag */}
                        <div className="absolute top-2.5 left-2.5 flex items-center gap-1">
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-950/80 text-white backdrop-blur-xs">
                            {item.category}
                          </span>
                        </div>

                        {/* Heart Wishlist Button */}
                        <button
                          onClick={(e) => toggleWishlist(item.id, e)}
                          title="Simpan Favorit"
                          className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-slate-700 hover:text-rose-600 flex items-center justify-center shadow-md transition-all cursor-pointer z-10"
                        >
                          <Heart
                            className={`w-4 h-4 ${isFavorited ? 'fill-rose-500 text-rose-500' : ''}`}
                          />
                        </button>

                        {/* Status Overlay if Claimed */}
                        {isClaimed && (
                          <div className="absolute inset-0 bg-slate-900/60 flex items-center justify-center">
                            <span className="px-3 py-1 rounded-lg bg-rose-600 text-white text-xs font-black uppercase tracking-wider shadow-lg">
                              Terjual / Sudah Diadopsi
                            </span>
                          </div>
                        )}

                        {/* Bottom Tag on image */}
                        <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1.5">
                          {item.isVerifiedStudent && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-900/90 text-teal-200 backdrop-blur-xs flex items-center gap-1">
                              <UserCheck className="w-3 h-3 text-teal-300" />
                              <span>Mahasiswa Unhas</span>
                            </span>
                          )}
                        </div>

                        {/* Views count */}
                        <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded text-[10px] font-semibold bg-black/60 text-slate-300 backdrop-blur-xs flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          <span>{item.viewsCount || 100}</span>
                        </div>
                      </div>

                      {/* Content Body */}
                      <div className="p-4 space-y-2">
                        {/* Prominent Price */}
                        <div className="flex items-baseline justify-between gap-2">
                          {item.isFree ? (
                            <span className="text-base font-black text-emerald-600">
                              GRATIS (Hibah Rp 0)
                            </span>
                          ) : (item.priceRupiah || 0) > 0 ? (
                            <div className="flex items-center gap-1.5">
                              <span className="text-lg font-black text-slate-900">
                                Rp {item.priceRupiah?.toLocaleString('id-ID')}
                              </span>
                              {item.isNego && (
                                <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-teal-50 text-teal-800 border border-teal-200">
                                  Nego
                                </span>
                              )}
                            </div>
                          ) : (
                            <span className="text-base font-black text-amber-600">
                              {item.pointPrice} Eco-Points
                            </span>
                          )}

                          <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                            {item.condition}
                          </span>
                        </div>

                        {/* Title */}
                        <h3 className="font-bold text-slate-900 text-sm leading-snug line-clamp-2 group-hover:text-teal-700 transition-colors">
                          {item.title}
                        </h3>

                        {/* Description Preview */}
                        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </div>

                    {/* Bottom Metadata & Actions: Keranjang & Chat Penjual (COD) */}
                    <div className="p-4 pt-0 space-y-3">
                      <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500 space-y-1">
                        <div className="flex items-center justify-between text-slate-400">
                          <div className="flex items-center gap-1 text-slate-600 truncate max-w-[170px]">
                            <MapPin className="w-3 h-3 text-teal-600 shrink-0" />
                            <span className="truncate font-medium">{item.location}</span>
                          </div>
                          <span>{item.postedAt}</span>
                        </div>
                      </div>

                      {/* Action buttons: Keranjang and Chat Penjual (No Beli Button) */}
                      <div className="grid grid-cols-2 gap-2">
                        {/* Tombol Keranjang */}
                        <button
                          onClick={(e) => toggleCart(item.id, e)}
                          className={`py-2 px-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                            isInCart
                              ? 'bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 shadow-2xs'
                              : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                          }`}
                          title={isInCart ? 'Keluarkan dari Keranjang' : 'Tambah ke Keranjang'}
                        >
                          <ShoppingCart className={`w-3.5 h-3.5 ${isInCart ? 'text-amber-700' : 'text-slate-600'}`} />
                          <span className="truncate">
                            {isInCart ? 'Di Keranjang' : '+ Keranjang'}
                          </span>
                        </button>

                        {/* Tombol Chat Penjual (Janjian COD Langsung) */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (onOpenChatWithSeller) {
                              onOpenChatWithSeller(item.donorName, item);
                            } else {
                              setChattingWithItem(item);
                              setChatMessageText(`Halo ${item.donorName}, saya tertarik dengan '${item.title}'. Mau janjian COD di area kampus mana ya?`);
                            }
                          }}
                          className="py-2 px-2.5 rounded-xl bg-teal-800 hover:bg-teal-900 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                          title="Chat Penjual untuk Janjian Lokasi COD"
                        >
                          <MessageCircle className="w-3.5 h-3.5 text-teal-200" />
                          <span className="truncate">Chat COD</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* REUSE LISTINGS: LIST VIEW */}
          {viewLayout === 'list' && filteredAndSortedItems.length > 0 && (
            <div className="space-y-3">
              {filteredAndSortedItems.map((item) => {
                const isFavorited = wishlistIds.includes(item.id);
                const isClaimed = item.status === 'claimed';
                const isInCart = cartItemIds.includes(item.id);

                return (
                  <div
                    key={item.id}
                    onClick={() => setActiveDetailItem(item)}
                    className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden flex flex-col sm:flex-row hover:border-teal-400 hover:shadow-md transition-all cursor-pointer p-3 sm:p-4 gap-4 items-center group"
                  >
                    <div className="relative w-full sm:w-44 h-36 rounded-xl overflow-hidden shrink-0 bg-slate-100">
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <span className="absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-bold bg-slate-950/80 text-white">
                        {item.category}
                      </span>
                    </div>

                    <div className="flex-1 space-y-1.5 w-full">
                      <div className="flex items-center justify-between">
                        {item.isFree ? (
                          <span className="text-lg font-black text-emerald-600">GRATIS (Hibah)</span>
                        ) : (item.priceRupiah || 0) > 0 ? (
                          <div className="flex items-center gap-2">
                            <span className="text-lg font-black text-slate-900">
                              Rp {item.priceRupiah?.toLocaleString('id-ID')}
                            </span>
                            {item.isNego && (
                              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-teal-50 text-teal-800 border border-teal-200">
                                Nego
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-base font-black text-amber-600">{item.pointPrice} Eco-Points</span>
                        )}

                        <span className="text-xs text-slate-500 font-medium">{item.condition}</span>
                      </div>

                      <h3 className="font-bold text-slate-900 text-sm sm:text-base group-hover:text-teal-700 transition-colors">
                        {item.title}
                      </h3>

                      <p className="text-xs text-slate-600 line-clamp-1">
                        {item.description}
                      </p>

                      <div className="flex items-center gap-4 text-xs text-slate-400 pt-1">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-teal-600" />
                          <span>{item.location} ({item.donorFaculty})</span>
                        </div>
                        <span>•</span>
                        <span>{item.postedAt}</span>
                        <span>•</span>
                        <span>Penjual: <strong>{item.donorName}</strong></span>
                      </div>
                    </div>

                    <div className="flex sm:flex-col items-stretch gap-2 shrink-0 w-full sm:w-48">
                      {/* Tombol Keranjang */}
                      <button
                        onClick={(e) => toggleCart(item.id, e)}
                        className={`py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                          isInCart
                            ? 'bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                        }`}
                      >
                        <ShoppingCart className="w-3.5 h-3.5 text-amber-600" />
                        <span>{isInCart ? 'Di Keranjang' : '+ Keranjang'}</span>
                      </button>

                      {/* Tombol Chat Penjual (COD) */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onOpenChatWithSeller) {
                            onOpenChatWithSeller(item.donorName, item);
                          } else {
                            setChattingWithItem(item);
                            setChatMessageText(`Halo ${item.donorName}, saya tertarik dengan '${item.title}'. Mau janjian COD di area kampus mana?`);
                          }
                        }}
                        className="py-2 px-3 rounded-xl bg-teal-800 hover:bg-teal-900 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
                      >
                        <MessageCircle className="w-3.5 h-3.5 text-teal-200" />
                        <span>Chat Penjual (COD)</span>
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveDetailItem(item);
                        }}
                        className="py-1.5 px-3 rounded-xl text-slate-600 hover:text-slate-900 text-xs font-semibold text-center hover:bg-slate-100"
                      >
                        Lihat Detail
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ================= TAB: PAPAN "DICARI" (REQUEST BOARD) ================= */}
      {activeTab === 'requests' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Hero Banner for Request Board */}
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-amber-600 via-amber-700 to-orange-800 text-white p-6 sm:p-8 shadow-lg">
            <div className="relative z-10 max-w-3xl space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/25 text-xs font-bold text-amber-100">
                <Search className="w-3.5 h-3.5 text-yellow-300" />
                <span>Papan Kebutuhan Komunitas Mahasiswa</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                Cari Barang yang Dibutuhkan atau Bantu Rekan Kampus
              </h2>
              <p className="text-xs sm:text-sm text-amber-100/90 leading-relaxed">
                Butuh kardus bekas untuk pindahan kos? Butuh buku pegangan kuliah semester 2 atau jas lab?
                Posting di sini agar mahasiswa lain yang memiliki barang tak terpakai bisa langsung menghubungi Anda.
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => setIsNewRequestModalOpen(true)}
                  id="btn-open-request-modal"
                  className="px-5 py-2.5 rounded-xl bg-white text-slate-900 hover:bg-amber-50 font-black text-xs shadow-md flex items-center gap-2 transition-transform active:scale-95 cursor-pointer"
                >
                  <Plus className="w-4 h-4 text-amber-600" />
                  <span>+ Pasang Kebutuhan (Dicari)</span>
                </button>
                <div className="text-xs text-amber-200 font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-300" />
                  <span>Janjian COD aman di titik resmi kampus</span>
                </div>
              </div>
            </div>
          </div>

          {/* Search & Urgency Filter Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="flex-1 relative w-full">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={requestSearchQuery}
                  onChange={(e) => setRequestSearchQuery(e.target.value)}
                  placeholder="Cari kebutuhan: kardus, buku diktat, hanger, jas lab..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              {/* Urgency Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-1">
                  Urgensi:
                </span>
                {[
                  { id: 'all', label: 'Semua' },
                  { id: 'Segera', label: '🔴 Butuh Segera' },
                  { id: 'Santai', label: '🟡 Santai' },
                  { id: 'Fleksibel', label: '🟢 Fleksibel' },
                ].map((urg) => (
                  <button
                    key={urg.id}
                    onClick={() => setRequestUrgencyFilter(urg.id as any)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer ${
                      requestUrgencyFilter === urg.id
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {urg.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Request Cards Grid */}
          {filteredItemRequests.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4 shadow-xs">
              <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto text-2xl font-bold">
                🔍
              </div>
              <div className="space-y-1">
                <h3 className="font-black text-slate-900 text-base">Belum Ada Permintaan yang Cocok</h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Tidak menemukan barang kebutuhan yang Anda cari? Jadilah yang pertama memposting kebutuhan barang di kampus!
                </p>
              </div>
              <button
                onClick={() => setIsNewRequestModalOpen(true)}
                className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md cursor-pointer"
              >
                + Buat Permintaan Barang Baru
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredItemRequests.map((req) => {
                const isFulfilled = req.status === 'fulfilled';
                const isUrgent = req.urgency === 'Segera';
                const whatsappUrl = `https://wa.me/${req.contactWhatsapp.replace(/^0/, '62').replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                  `Halo ${req.requesterName}, saya melihat postingan Anda di Papan Dicari SIPAS-Kampus mengenai "${req.title}". Saya memiliki barang tersebut dan siap bantu COD di ${req.preferredMeetupPoint}.`
                )}`;

                return (
                  <div
                    key={req.id}
                    className={`bg-white rounded-2xl border transition-all p-5 flex flex-col justify-between gap-4 shadow-xs hover:shadow-md ${
                      isFulfilled
                        ? 'border-slate-200 bg-slate-50/60 opacity-80'
                        : isUrgent
                        ? 'border-rose-200 hover:border-rose-400'
                        : 'border-slate-200 hover:border-amber-400'
                    }`}
                  >
                    <div className="space-y-3">
                      {/* Urgency & Status Tags */}
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`px-2.5 py-0.5 rounded-md text-[11px] font-black border flex items-center gap-1 ${
                              req.urgency === 'Segera'
                                ? 'bg-rose-50 text-rose-700 border-rose-200'
                                : req.urgency === 'Santai'
                                ? 'bg-amber-50 text-amber-800 border-amber-200'
                                : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            }`}
                          >
                            {req.urgency === 'Segera' && (
                              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                            )}
                            <span>{req.urgency}</span>
                          </span>
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-600">
                            {req.category}
                          </span>
                        </div>

                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            isFulfilled
                              ? 'bg-slate-200 text-slate-700'
                              : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          }`}
                        >
                          {isFulfilled ? '✓ Terpenuhi' : '● Mencari'}
                        </span>
                      </div>

                      {/* Request Title & Description */}
                      <div>
                        <h3 className={`font-black text-sm sm:text-base leading-snug ${isFulfilled ? 'line-through text-slate-500' : 'text-slate-900'}`}>
                          {req.title}
                        </h3>
                        <p className="text-xs text-slate-600 mt-1 line-clamp-3 leading-relaxed">
                          {req.description}
                        </p>
                      </div>

                      {/* Requester & Safe Meetup Spot */}
                      <div className="pt-2 border-t border-slate-100 space-y-2 text-xs">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-amber-100 text-amber-800 font-black text-xs flex items-center justify-center">
                            {req.requesterName.charAt(0)}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 text-xs">{req.requesterName}</div>
                            <div className="text-[10px] text-slate-500">{req.requesterFaculty} • {req.postedAt}</div>
                          </div>
                        </div>

                        <div className="p-2.5 rounded-xl bg-amber-50/60 border border-amber-200 text-[11px] text-amber-950 flex items-start gap-1.5">
                          <ShieldCheck className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-bold">Titik COD Aman Pilihan: </span>
                            <span>{req.preferredMeetupPoint}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
                      <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-2xs transition-colors"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>Bantu via WA</span>
                      </a>

                      <button
                        onClick={() => handleToggleRequestFulfill(req.id)}
                        className={`py-2 px-3 rounded-xl font-bold text-xs transition-colors cursor-pointer border ${
                          isFulfilled
                            ? 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-200'
                            : 'bg-white text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 border-slate-200'
                        }`}
                        title="Ubah status terpenuhi"
                      >
                        {isFulfilled ? 'Buka Kembali' : 'Tandai Selesai'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ================= TAB 2: PERINGKAT & HADIAH ================= */}
      {activeTab === 'leaderboard' && (
        <div className="space-y-8">
          {/* User Progress Header */}
          <div className="bg-gradient-to-r from-teal-900 to-slate-900 rounded-3xl p-6 sm:p-7 text-white shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6 border border-teal-800/40">
            <div className="flex items-center gap-4">
              <img
                src={currentUser.avatarUrl}
                alt={currentUser.name}
                className="w-16 h-16 rounded-2xl object-cover ring-4 ring-white/20"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-black">{currentUser.name}</h2>
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-white/20 text-teal-200 border border-white/30">
                    Level {currentUser.level}
                  </span>
                </div>
                <p className="text-xs text-teal-200 mt-0.5">
                  {currentUser.email} • {currentUser.faculty}
                </p>
                <div className="flex items-center gap-3 mt-2 text-xs font-semibold">
                  <span className="flex items-center gap-1 text-amber-300">
                    <Flame className="w-4 h-4 fill-amber-300" />
                    <span>{currentUser.currentStreakDays}x Partisipasi Pilah Aktif</span>
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="px-5 py-3 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/15 text-center">
                <div className="text-[11px] text-teal-200 uppercase tracking-wider font-semibold">Saldo Poin</div>
                <div className="text-2xl font-black text-amber-300">{currentUser.ecoPoints}</div>
                <div className="text-[10px] text-teal-200">Eco-Points</div>
              </div>
              <div className="px-5 py-3 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/15 text-center">
                <div className="text-[11px] text-teal-200 uppercase tracking-wider font-semibold">Sampah Diredusir</div>
                <div className="text-2xl font-black text-white">{currentUser.totalWeightDepositedKg}</div>
                <div className="text-[10px] text-teal-200">Kilogram Terdiversi</div>
              </div>
            </div>
          </div>

          {/* Leaderboard Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Student Leaderboard */}
            <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200 shadow-xs p-5 sm:p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-amber-500" />
                  <h3 className="font-bold text-slate-900 text-base">
                    Papan Peringkat Mahasiswa Teraktif
                  </h3>
                </div>
                <span className="text-xs text-slate-500 font-medium">Bulan Ini</span>
              </div>

              <div className="divide-y divide-slate-100">
                {INITIAL_LEADERBOARD_STUDENTS.map((usr) => (
                  <div key={usr.id} className="py-3 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center font-black text-xs ${
                        usr.rank === 1 ? 'bg-amber-100 text-amber-800' :
                        usr.rank === 2 ? 'bg-slate-200 text-slate-800' :
                        usr.rank === 3 ? 'bg-amber-50 text-amber-900' : 'text-slate-400'
                      }`}>
                        {usr.rank}
                      </span>
                      <img src={usr.avatar} alt={usr.name} className="w-8 h-8 rounded-full object-cover" />
                      <div>
                        <div className="font-bold text-slate-900">{usr.name}</div>
                        <div className="text-[11px] text-slate-400">{usr.faculty}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-black text-teal-800">{usr.totalKg} kg</div>
                      <div className="text-[11px] text-slate-400">{usr.ecoPoints} pts</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Faculty Leaderboard */}
            <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200 shadow-xs p-5 sm:p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-teal-600" />
                  <h3 className="font-bold text-slate-900 text-base">
                    Kompetisi Keberlanjutan Antar-Fakultas
                  </h3>
                </div>
                <span className="text-xs text-slate-500 font-medium">Semester Genap</span>
              </div>

              <div className="divide-y divide-slate-100">
                {FACULTY_LEADERBOARD_DATA.map((fac) => (
                  <div key={fac.faculty} className="py-3 space-y-1 text-xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-400 w-4">#{fac.rank}</span>
                        <span className="font-bold text-slate-900">{fac.faculty}</span>
                      </div>
                      <span className="font-black text-slate-900">{fac.totalKg.toLocaleString()} kg</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-teal-600 h-2 rounded-full"
                        style={{ width: `${Math.min(100, (fac.totalKg / 1300) * 100)}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[11px] text-slate-400">
                      <span>{fac.participantsCount} mahasiswa aktif</span>
                      <span>Mereduksi {fac.co2ReducedKg.toLocaleString()} kg CO₂e</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Reward Catalog */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 sm:p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-slate-900 text-base">
                  Katalog Penukaran Hadiah & Insentif Akademik
                </h3>
                <p className="text-xs text-slate-500">
                  Tukarkan Eco-Points hasil setor sampah & reuse barang dengan voucher makan kantin atau SKP
                </p>
              </div>
              <div className="px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-xs font-bold text-amber-900">
                Poin Anda: {currentUser.ecoPoints} pts
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {REWARD_ITEMS.map((rew) => {
                const canAfford = currentUser.ecoPoints >= rew.costPoints;
                return (
                  <div
                    key={rew.id}
                    className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-white hover:border-teal-300 transition-all flex flex-col justify-between space-y-3"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-200 text-slate-700">
                          {rew.category}
                        </span>
                        <span className="font-black text-teal-800 text-sm">
                          {rew.costPoints} pts
                        </span>
                      </div>
                      <h4 className="font-bold text-slate-900 text-xs sm:text-sm">
                        {rew.title}
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        {rew.description}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs">
                      <span className="text-[10px] text-slate-400">Mitra: {rew.partner}</span>
                      <button
                        onClick={() => handleRedeem(rew)}
                        disabled={!canAfford}
                        className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-all cursor-pointer ${
                          canAfford
                            ? 'bg-teal-700 hover:bg-teal-800 text-white shadow-2xs'
                            : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                        }`}
                      >
                        {canAfford ? 'Tukarkan' : 'Poin Kurang'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 3: FORUM DISKUSI ================= */}
      {activeTab === 'forum' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Forum Aspirasi & Kolaborasi Lingkungan Kampus</h3>
              <p className="text-xs text-slate-500">Ajukan usulan fasilitas pilah, tanyakan info barter buku, atau ajak teman aksi bersih-bersih</p>
            </div>
            <button
              onClick={() => setIsNewForumModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors shrink-0 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Buat Topik Baru</span>
            </button>
          </div>

          <div className="space-y-4">
            {forumPosts.map((post) => (
              <div
                key={post.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 sm:p-6 space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={post.avatarUrl}
                      alt={post.authorName}
                      className="w-10 h-10 rounded-full object-cover border border-slate-200"
                    />
                    <div>
                      <div className="font-bold text-slate-900 text-xs sm:text-sm">
                        {post.authorName}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {post.authorFaculty} • {post.authorRole} • {post.createdAt}
                      </div>
                    </div>
                  </div>

                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-800 border border-indigo-200">
                    {post.category}
                  </span>
                </div>

                <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                  {post.title}
                </h3>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {post.content}
                </p>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {post.tags.map((t) => (
                    <span key={t} className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-500">
                      #{t}
                    </span>
                  ))}
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center gap-4 text-xs text-slate-500">
                  <button className="flex items-center gap-1 hover:text-rose-600 font-semibold cursor-pointer">
                    <Heart className="w-3.5 h-3.5" />
                    <span>{post.likes} Dukungan</span>
                  </button>
                  <button className="flex items-center gap-1 hover:text-indigo-600 font-semibold cursor-pointer">
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>{post.repliesCount} Tanggapan</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= ITEM DETAIL MODAL (POP-UP IKLAN LENGKAP) ================= */}
      {activeDetailItem && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-200 my-auto animate-fadeIn max-h-[92vh] flex flex-col">
            {/* Modal Header Strip */}
            <div className="p-4 px-6 border-b border-slate-100 flex items-center justify-between bg-slate-50 shrink-0">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-teal-100 text-teal-900 border border-teal-200">
                  {activeDetailItem.category}
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  ID Iklan: #{activeDetailItem.id}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleWishlist(activeDetailItem.id)}
                  className="p-2 rounded-full text-slate-500 hover:text-rose-600 hover:bg-white transition-colors cursor-pointer"
                  title="Simpan Favorit"
                >
                  <Heart className={`w-5 h-5 ${wishlistIds.includes(activeDetailItem.id) ? 'fill-rose-500 text-rose-500' : ''}`} />
                </button>
                <button
                  onClick={() => setActiveDetailItem(null)}
                  className="p-2 rounded-full text-slate-400 hover:text-slate-800 hover:bg-white transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body (Scrollable) */}
            <div className="p-6 overflow-y-auto space-y-6">
              {/* Product Image & Main Price */}
              <div className="space-y-4">
                <div className="relative h-64 sm:h-72 w-full rounded-2xl overflow-hidden bg-slate-100 shadow-inner">
                  <img
                    src={activeDetailItem.imageUrl}
                    alt={activeDetailItem.title}
                    className="w-full h-full object-cover"
                  />
                  {activeDetailItem.status === 'claimed' && (
                    <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center">
                      <span className="px-4 py-2 rounded-xl bg-rose-600 text-white font-black text-sm uppercase tracking-widest shadow-xl">
                        Sudah Terjual / Diadopsi
                      </span>
                    </div>
                  )}
                </div>

                {/* Price Display */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      Harga Penawaran:
                    </div>
                    <div className="flex items-baseline gap-2 mt-0.5">
                      {activeDetailItem.isFree ? (
                        <span className="text-2xl sm:text-3xl font-black text-emerald-600">
                          GRATIS (Hibah Rp 0)
                        </span>
                      ) : (activeDetailItem.priceRupiah || 0) > 0 ? (
                        <>
                          <span className="text-2xl sm:text-3xl font-black text-slate-900">
                            Rp {activeDetailItem.priceRupiah?.toLocaleString('id-ID')}
                          </span>
                          {activeDetailItem.isNego && (
                            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-teal-100 text-teal-900 border border-teal-200">
                              Bisa Nego
                            </span>
                          )}
                        </>
                      ) : (
                        <span className="text-2xl sm:text-3xl font-black text-amber-600">
                          {activeDetailItem.pointPrice} Eco-Points
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="text-left sm:text-right text-xs text-slate-500">
                    <div>Kondisi Barang: <strong className="text-slate-900">{activeDetailItem.condition}</strong></div>
                    <div>Diposting: <strong>{activeDetailItem.postedAt}</strong></div>
                  </div>
                </div>
              </div>

              {/* Title & Description */}
              <div className="space-y-3">
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
                  {activeDetailItem.title}
                </h2>

                <div className="p-4 rounded-2xl bg-white border border-slate-200 text-xs sm:text-sm text-slate-700 leading-relaxed space-y-2">
                  <div className="font-bold text-slate-900 text-xs uppercase tracking-wider text-slate-400">
                    Deskripsi Lengkap:
                  </div>
                  <p className="whitespace-pre-line">{activeDetailItem.description}</p>
                </div>
              </div>

              {/* SELLER PROFILE CARD */}
              <div
                onClick={() => {
                  if (onOpenUserProfile) {
                    onOpenUserProfile(activeDetailItem.id, activeDetailItem.donorName);
                  }
                }}
                className="p-5 rounded-2xl bg-gradient-to-br from-slate-50 to-teal-50/40 border border-slate-200 space-y-4 cursor-pointer hover:border-teal-400 transition-colors"
                title="Klik untuk melihat profil & reputasi lengkap penjual"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-teal-800 text-white font-black text-lg flex items-center justify-center shadow-md">
                      {activeDetailItem.donorName.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="font-black text-slate-900 text-sm">
                          {activeDetailItem.donorName}
                        </h4>
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-teal-100 text-teal-900 flex items-center gap-0.5">
                          <UserCheck className="w-3 h-3 text-teal-700" />
                          <span>Terverifikasi</span>
                        </span>
                      </div>
                      <div className="text-xs text-slate-500">
                        {activeDetailItem.donorFaculty} • Mahasiswa Aktif (Klik Lihat Profil)
                      </div>
                    </div>
                  </div>

                  <div className="text-right text-xs">
                    <div className="flex items-center gap-1 font-bold text-amber-500">
                      <span>★</span>
                      <span>{activeDetailItem.sellerRating || 4.9}</span>
                      <span className="text-slate-400 text-[11px]">(Rating Penjual)</span>
                    </div>
                    <div className="text-[11px] text-slate-400">Responsif & Ramah</div>
                  </div>
                </div>

                {/* Safe Meetup Point in Campus */}
                <div className="p-3 rounded-xl bg-white border border-slate-200 text-xs space-y-1">
                  <div className="font-bold text-slate-700 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-teal-600" />
                    <span>Titik Ketemu / Lokasi COD Aman:</span>
                  </div>
                  <div className="text-slate-600 pl-5">
                    {activeDetailItem.meetupPoint || activeDetailItem.location}
                  </div>
                </div>
              </div>

              {/* Educational Impact Note */}
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-center gap-3">
                <ShieldCheck className="w-6 h-6 text-emerald-600 shrink-0" />
                <div className="leading-snug">
                  <strong>Aksi Nyata Cegah Sampah TPA:</strong> Mengadopsi atau membeli barang preloved ini memangkas jejak karbon manufaktur baru dan memastikan barang tidak menumpuk di TPA Tamangapa Antang.
                </div>
              </div>
            </div>

            {/* Modal Bottom CTA Bar */}
            <div className="p-4 px-6 border-t border-slate-200 bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
              <div className="text-xs text-slate-500">
                Tentukan lokasi COD langsung dengan penjual:
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                {/* Tombol Keranjang */}
                <button
                  onClick={() => toggleCart(activeDetailItem.id)}
                  className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                    cartItemIds.includes(activeDetailItem.id)
                      ? 'bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300'
                      : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 shadow-2xs'
                  }`}
                >
                  <ShoppingCart className="w-4 h-4 text-amber-600" />
                  <span>
                    {cartItemIds.includes(activeDetailItem.id)
                      ? 'Di Keranjang'
                      : 'Tambah ke Keranjang'}
                  </span>
                </button>

                {/* Chat via WhatsApp */}
                <a
                  href={`https://wa.me/62${activeDetailItem.contactWhatsapp?.replace(/^0/, '') || '81234567890'}?text=${encodeURIComponent(
                    `Halo ${activeDetailItem.donorName}, saya mahasiswa tertarik dengan barang reuse '${activeDetailItem.title}' di Bursa Preloved Kampus. Mau janjian COD di mana?`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-2xs transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  <span className="hidden sm:inline">WhatsApp</span>
                </a>

                {/* Chat Penjual untuk Janjian COD */}
                <button
                  onClick={() => {
                    if (onOpenChatWithSeller) {
                      onOpenChatWithSeller(activeDetailItem.donorName, activeDetailItem);
                      setActiveDetailItem(null);
                    } else {
                      setChattingWithItem(activeDetailItem);
                      setChatMessageText(
                        `Halo ${activeDetailItem.donorName}, saya tertarik dengan '${activeDetailItem.title}'. Mau janjian COD di area kampus mana ya?`
                      );
                    }
                  }}
                  className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-teal-800 hover:bg-teal-900 text-white font-black text-xs flex items-center justify-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4 text-teal-200" />
                  <span>Chat Penjual (Janjian COD)</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= IN-APP CHAT MODAL (JANJIAN COD) ================= */}
      {chattingWithItem && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-teal-600" />
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Kirim Pesan ke Penjual</h3>
                  <div className="text-[11px] text-slate-400">{chattingWithItem.donorName} ({chattingWithItem.donorFaculty})</div>
                </div>
              </div>
              <button
                onClick={() => setChattingWithItem(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs flex items-center gap-3">
              <img
                src={chattingWithItem.imageUrl}
                alt={chattingWithItem.title}
                className="w-12 h-12 rounded-lg object-cover"
              />
              <div className="truncate">
                <div className="font-bold text-slate-900 truncate">{chattingWithItem.title}</div>
                <div className="text-teal-700 font-black">
                  {chattingWithItem.isFree ? 'Gratis' : `Rp ${chattingWithItem.priceRupiah?.toLocaleString('id-ID') || chattingWithItem.pointPrice + ' Pts'}`}
                </div>
              </div>
            </div>

            {chatSentSuccess ? (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-center space-y-1">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <div className="font-bold text-xs">Pesan Terkirim!</div>
                <div className="text-[11px] text-emerald-700">Penjual akan menerima notifikasi obrolan kampus ini.</div>
              </div>
            ) : (
              <form onSubmit={handleSendChat} className="space-y-3 text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Pesan Cepat:</label>
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {[
                      'Apakah barang ini masih ada?',
                      'Bisa COD di Lobi FT besok?',
                      'Boleh minta nomor WA?',
                      'Harganya bisa nego tipis?'
                    ].map((template) => (
                      <button
                        type="button"
                        key={template}
                        onClick={() => setChatMessageText(template)}
                        className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-teal-50 text-[11px] text-slate-600 font-medium cursor-pointer"
                      >
                        {template}
                      </button>
                    ))}
                  </div>

                  <textarea
                    rows={3}
                    required
                    value={chatMessageText}
                    onChange={(e) => setChatMessageText(e.target.value)}
                    placeholder="Tuliskan pertanyaan atau ajakan bertemu..."
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setChattingWithItem(null)}
                    className="px-4 py-2 font-bold text-slate-500 hover:text-slate-700"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-teal-800 text-white font-bold hover:bg-teal-900 shadow-sm cursor-pointer"
                  >
                    Kirim Pesan
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ================= "PASANG IKLAN REUSE" MODAL ================= */}
      {isPostAdModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 my-auto animate-fadeIn max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-400 to-yellow-500 text-slate-950 flex items-center justify-center font-black text-base shadow-sm">
                  +
                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-base">Pasang Iklan Barang Bekas</h3>
                  <div className="text-[11px] text-slate-500">Bursa Reuse Mahasiswa Ramah Lingkungan</div>
                </div>
              </div>
              <button
                onClick={() => setIsPostAdModalOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handlePostAd} className="space-y-4 text-xs">
              {/* Title */}
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Judul Iklan Barang:</label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="Contoh: Kalkulus Stewart Edisi 8 / Meja Lipat Kos / Jas Lab L"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium"
                />
              </div>

              {/* Category & Condition */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Kategori Barang:</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-medium bg-white"
                  >
                    <option value="Buku & Diktat">Buku & Diktat</option>
                    <option value="Elektronik & Kos">Elektronik & Kos</option>
                    <option value="Alat Lab & Gambar">Alat Lab & Gambar</option>
                    <option value="Peralatan Kos">Peralatan Kos</option>
                    <option value="Fashion & Sepatu">Fashion & Sepatu</option>
                    <option value="Lainnya">Lainnya</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Kondisi Barang:</label>
                  <select
                    value={formCondition}
                    onChange={(e) => setFormCondition(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-medium bg-white"
                  >
                    <option value="Seperti Baru">Seperti Baru (95%)</option>
                    <option value="Sangat Baik">Sangat Baik (85-90%)</option>
                    <option value="Cukup Baik">Cukup Baik (Layak Pakai)</option>
                    <option value="Butuh Perbaikan">Butuh Perbaikan Ringan</option>
                  </select>
                </div>
              </div>

              {/* Pricing Model */}
              <div className="space-y-2 p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                <label className="font-bold text-slate-800">Skema Penawaran / Harga:</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setFormPricingType('free')}
                    className={`py-2 px-2 rounded-xl text-center font-bold text-xs transition-all cursor-pointer ${
                      formPricingType === 'free'
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-white text-slate-700 border border-slate-200'
                    }`}
                  >
                    🎁 Hibah (Rp 0)
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormPricingType('cash')}
                    className={`py-2 px-2 rounded-xl text-center font-bold text-xs transition-all cursor-pointer ${
                      formPricingType === 'cash'
                        ? 'bg-teal-700 text-white shadow-xs'
                        : 'bg-white text-slate-700 border border-slate-200'
                    }`}
                  >
                    💵 Tunai (Rp)
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormPricingType('points')}
                    className={`py-2 px-2 rounded-xl text-center font-bold text-xs transition-all cursor-pointer ${
                      formPricingType === 'points'
                        ? 'bg-amber-500 text-slate-950 font-black shadow-xs'
                        : 'bg-white text-slate-700 border border-slate-200'
                    }`}
                  >
                    ⚡ Eco-Points
                  </button>
                </div>

                {/* Amount inputs */}
                {formPricingType === 'cash' && (
                  <div className="pt-2 flex items-center gap-3">
                    <div className="flex-1 space-y-1">
                      <label className="font-bold text-slate-600 text-[11px]">Harga Tunai (Rp):</label>
                      <input
                        type="number"
                        min="5000"
                        step="5000"
                        value={formCashPrice}
                        onChange={(e) => setFormCashPrice(parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 font-bold bg-white"
                      />
                    </div>

                    <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 mt-5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formIsNego}
                        onChange={(e) => setFormIsNego(e.target.checked)}
                        className="rounded text-teal-600"
                      />
                      <span>Bisa Nego</span>
                    </label>
                  </div>
                )}

                {formPricingType === 'points' && (
                  <div className="pt-2 space-y-1">
                    <label className="font-bold text-slate-600 text-[11px]">Jumlah Eco-Points yang diminta:</label>
                    <input
                      type="number"
                      min="10"
                      max="500"
                      value={formPointPrice}
                      onChange={(e) => setFormPointPrice(parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 font-bold bg-white"
                    />
                  </div>
                )}
              </div>

              {/* Photo Preset Selector */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700">Pilih Foto Representatif Barang:</label>
                <div className="grid grid-cols-3 gap-2">
                  {PHOTO_PRESETS.map((preset) => (
                    <button
                      type="button"
                      key={preset.label}
                      onClick={() => setFormImageUrl(preset.url)}
                      className={`relative h-16 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                        formImageUrl === preset.url ? 'border-teal-600 ring-2 ring-teal-300' : 'border-slate-200'
                      }`}
                    >
                      <img src={preset.url} alt={preset.label} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-slate-950/40 flex items-center justify-center text-[10px] text-white font-bold px-1 text-center">
                        {preset.label}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Location & WhatsApp */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Fakultas / Gedung:</label>
                  <input
                    type="text"
                    required
                    value={formLocation}
                    onChange={(e) => setFormLocation(e.target.value)}
                    placeholder="Contoh: Lobi FT Unhas"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-medium"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">No. WhatsApp Kontak:</label>
                  <input
                    type="text"
                    required
                    value={formWhatsapp}
                    onChange={(e) => setFormWhatsapp(e.target.value)}
                    placeholder="08123456789"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-medium"
                  />
                </div>
              </div>

              {/* COD Point */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 flex items-center justify-between">
                  <span>Titik Ketemu COD Aman di Kampus:</span>
                  <span className="text-[10px] text-teal-700 font-bold flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-teal-600" />
                    <span>Titik Rekomendasi</span>
                  </span>
                </label>
                <input
                  type="text"
                  required
                  value={formMeetupPoint}
                  onChange={(e) => setFormMeetupPoint(e.target.value)}
                  placeholder="Contoh: Kantin Danau Rektorat / Lobi Gedung Arsitektur"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 font-medium"
                />
                {/* Quick Select Chips */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {SAFE_COD_SPOTS.map((spot) => (
                    <button
                      type="button"
                      key={spot}
                      onClick={() => setFormMeetupPoint(spot)}
                      className={`px-2 py-0.5 rounded-md text-[10px] font-medium transition-colors cursor-pointer border ${
                        formMeetupPoint === spot
                          ? 'bg-teal-700 text-white border-teal-800'
                          : 'bg-slate-100 hover:bg-teal-50 text-slate-600 border-slate-200'
                      }`}
                    >
                      + {spot}
                    </button>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Deskripsi Barang & Alasan Dilepas:</label>
                <textarea
                  rows={2}
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  placeholder="Kondisi kelengkapan, minus pemakaian wajar, alasan dilepas (misal sudah lulus matkul)..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 resize-none font-medium"
                />
              </div>

              {/* Buttons */}
              <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsPostAdModalOpen(false)}
                  className="px-4 py-2 font-bold text-slate-500 hover:text-slate-700"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950 rounded-xl font-black hover:from-amber-300 hover:to-yellow-300 shadow-md cursor-pointer"
                >
                  Terbitkan Iklan Sekarang
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= KERANJANG REUSE & JANJIAN COD MODAL ================= */}
      {isCartModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-5 sm:p-6 shadow-2xl border border-slate-200 space-y-5 my-auto animate-fadeIn max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center shadow-xs">
                  <ShoppingCart className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-black text-slate-900 text-base">Keranjang Preloved & Reuse</h3>
                    <span className="px-2 py-0.2 rounded-full bg-slate-900 text-white text-xs font-bold">
                      {cartItemsList.length} Barang
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">
                    Daftar barang incaran untuk langsung janjian COD di area kampus
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsCartModalOpen(false)}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content List */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
              {cartItemsList.length === 0 ? (
                <div className="py-12 text-center space-y-3">
                  <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto border border-amber-200">
                    <ShoppingBag className="w-8 h-8" />
                  </div>
                  <h4 className="font-black text-slate-800 text-base">Keranjang Anda Masih Kosong</h4>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Belum ada barang reuse yang Anda simpan. Silakan jelajahi bursa preloved dan klik tombol "+ Keranjang" pada barang yang ingin Anda ambil/beli.
                  </p>
                  <button
                    onClick={() => setIsCartModalOpen(false)}
                    className="px-5 py-2.5 rounded-xl bg-teal-800 text-white text-xs font-bold hover:bg-teal-900 shadow-xs cursor-pointer"
                  >
                    Mulai Jelajahi Barang
                  </button>
                </div>
              ) : (
                cartItemsList.map((item) => (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-2xl border border-slate-200 hover:border-teal-300 bg-slate-50/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 transition-colors"
                  >
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-16 h-16 rounded-xl object-cover shrink-0 border border-slate-200"
                      />
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.2 rounded text-[10px] font-bold bg-slate-200 text-slate-700">
                            {item.category}
                          </span>
                          <span className="text-[10px] font-medium text-slate-500">
                            {item.condition}
                          </span>
                        </div>
                        <h5 className="font-bold text-slate-900 text-xs sm:text-sm truncate">
                          {item.title}
                        </h5>
                        <div className="flex items-center gap-2 text-xs">
                          {item.isFree ? (
                            <span className="font-black text-emerald-600">GRATIS</span>
                          ) : item.priceRupiah ? (
                            <span className="font-black text-slate-900">
                              Rp {item.priceRupiah.toLocaleString('id-ID')}
                            </span>
                          ) : (
                            <span className="font-black text-amber-600">
                              {item.pointPrice} Pts
                            </span>
                          )}
                          <span className="text-slate-400">•</span>
                          <span className="text-slate-500 text-[11px] truncate">
                            Penjual: <strong>{item.donorName}</strong> ({item.donorFaculty})
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-[11px] text-teal-700 font-medium">
                          <MapPin className="w-3 h-3 text-teal-600 shrink-0" />
                          <span>Titik COD: {item.meetupPoint || item.location}</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions: Chat Penjual for COD & Remove */}
                    <div className="flex items-center gap-2 self-end sm:self-center shrink-0 w-full sm:w-auto justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-200">
                      <button
                        onClick={() => {
                          setIsCartModalOpen(false);
                          if (onOpenChatWithSeller) {
                            onOpenChatWithSeller(item.donorName, item);
                          } else {
                            setChattingWithItem(item);
                            setChatMessageText(
                              `Halo ${item.donorName}, barang '${item.title}' ada di keranjang saya. Mau janjian COD di ${item.meetupPoint || item.location}? Jam berapa kira-kira bisa?`
                            );
                          }
                        }}
                        className="px-3.5 py-2 rounded-xl bg-teal-800 hover:bg-teal-900 text-white font-bold text-xs flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
                        title="Chat Penjual untuk Janjian COD"
                      >
                        <MessageCircle className="w-3.5 h-3.5 text-teal-200" />
                        <span>Chat COD</span>
                      </button>

                      <button
                        onClick={(e) => removeFromCart(item.id, e)}
                        className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                        title="Hapus dari Keranjang"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Educational footer inside modal */}
            <div className="p-3.5 rounded-2xl bg-teal-50 border border-teal-200 text-xs text-teal-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shrink-0">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-teal-700 shrink-0" />
                <span className="leading-tight text-[11px] text-teal-900">
                  <strong>Janjian COD Mandiri:</strong> Diskusikan tempat dan waktu bertemu yang strategis di area kampus (perpustakaan, kantin, atau lobi fakultas) tanpa perantara.
                </span>
              </div>
              <button
                onClick={() => setIsCartModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors cursor-pointer shrink-0 self-end sm:self-auto"
              >
                Kembali ke Bursa
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= NEW FORUM POST MODAL ================= */}
      {isNewForumModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base">Mulai Topik Diskusi Baru</h3>
              <button onClick={() => setIsNewForumModalOpen(false)} className="text-xs text-slate-400">Tutup</button>
            </div>

            <form onSubmit={handleAddForumPost} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Kategori Diskusi:</label>
                <select
                  value={forumCategory}
                  onChange={(e) => setForumCategory(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                >
                  <option value="Diskusi">Diskusi Umum</option>
                  <option value="Ide Inovasi">Ide Inovasi Fasilitas Kampus</option>
                  <option value="Tanya Petugas">Pertanyaan untuk Petugas TPST</option>
                  <option value="Kegiatan Bersih">Aksi Relawan Bersih Lingkungan</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Judul Topik:</label>
                <input
                  type="text"
                  required
                  value={forumTitle}
                  onChange={(e) => setForumTitle(e.target.value)}
                  placeholder="Contoh: Usul penambahan tempat sampah pilah di kantin fakultas..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Isi Diskusi:</label>
                <textarea
                  rows={4}
                  required
                  value={forumContent}
                  onChange={(e) => setForumContent(e.target.value)}
                  placeholder="Tuliskan argumen atau usulan Anda..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 resize-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewForumModalOpen(false)}
                  className="px-3 py-2 font-bold text-slate-500"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 cursor-pointer"
                >
                  Kirim Diskusi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: PASANG KEBUTUHAN BARANG (PAPAN DICARI) ================= */}
      {isNewRequestModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 my-auto animate-fadeIn max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 text-white flex items-center justify-center font-black text-sm shadow-sm">
                  🔍
                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-base">Pasang Permintaan Barang</h3>
                  <div className="text-[11px] text-slate-500">Papan "Dicari" Komunitas Kampus</div>
                </div>
              </div>
              <button
                onClick={() => setIsNewRequestModalOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateRequest} className="space-y-4 text-xs">
              {/* Request Title */}
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Barang yang Dibutuhkan:</label>
                <input
                  type="text"
                  required
                  value={reqTitle}
                  onChange={(e) => setReqTitle(e.target.value)}
                  placeholder="Contoh: Kardus bekas tebal untuk pindahan kos (5-10 buah)"
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 font-medium focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              {/* Category & Urgency */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Kategori Barang:</label>
                  <select
                    value={reqCategory}
                    onChange={(e) => setReqCategory(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 font-medium bg-white"
                  >
                    <option value="Peralatan Kos">Peralatan Kos</option>
                    <option value="Buku & Diktat">Buku & Diktat Kuliah</option>
                    <option value="Elektronik & Kos">Elektronik & Gadget</option>
                    <option value="Alat Lab & Gambar">Alat Lab & Gambar</option>
                    <option value="Fashion & Sepatu">Fashion & Pakaian</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Tingkat Urgensi:</label>
                  <select
                    value={reqUrgency}
                    onChange={(e) => setReqUrgency(e.target.value as any)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 font-medium bg-white"
                  >
                    <option value="Segera">🔴 Butuh Segera (1-2 hari)</option>
                    <option value="Santai">🟡 Santai (Pekan ini)</option>
                    <option value="Fleksibel">🟢 Fleksibel (Kapan saja)</option>
                  </select>
                </div>
              </div>

              {/* Safe Meetup Spot with Suggestions */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 flex items-center justify-between">
                  <span>Pilihan Titik COD Aman Kampus:</span>
                  <span className="text-[10px] text-teal-700 font-bold flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-teal-600" />
                    <span>Terverifikasi</span>
                  </span>
                </label>
                <input
                  type="text"
                  required
                  value={reqMeetupSpot}
                  onChange={(e) => setReqMeetupSpot(e.target.value)}
                  placeholder="Kantin Utama / Lobi Fakultas"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 font-medium focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />

                {/* Quick select chips */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {SAFE_COD_SPOTS.map((spot) => (
                    <button
                      type="button"
                      key={spot}
                      onClick={() => setReqMeetupSpot(spot)}
                      className={`px-2 py-0.5 rounded-md text-[10px] font-medium transition-colors cursor-pointer border ${
                        reqMeetupSpot === spot
                          ? 'bg-teal-700 text-white border-teal-800'
                          : 'bg-slate-100 hover:bg-teal-50 text-slate-600 border-slate-200'
                      }`}
                    >
                      + {spot}
                    </button>
                  ))}
                </div>
              </div>

              {/* Contact WhatsApp */}
              <div className="space-y-1">
                <label className="font-bold text-slate-700">No. WhatsApp Kontak Anda:</label>
                <input
                  type="text"
                  required
                  value={reqWhatsapp}
                  onChange={(e) => setReqWhatsapp(e.target.value)}
                  placeholder="Contoh: 081234567890"
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 font-medium"
                />
                <span className="text-[10px] text-slate-400">
                  Mahasiswa yang memiliki barang dapat langsung menghubungi Anda via WhatsApp untuk koordinasi penyerahan.
                </span>
              </div>

              {/* Detailed Description */}
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Detail & Catatan Kebutuhan:</label>
                <textarea
                  rows={3}
                  value={reqDesc}
                  onChange={(e) => setReqDesc(e.target.value)}
                  placeholder="Jelaskan kebutuhan Anda, apakah bersedia barter atau mengganti biaya sukarela..."
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 resize-none font-medium"
                />
              </div>

              {/* Modal Action Buttons */}
              <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsNewRequestModalOpen(false)}
                  className="px-4 py-2 font-bold text-slate-500 hover:text-slate-700"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white rounded-xl font-bold shadow-md cursor-pointer flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Terbitkan Kebutuhan</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
