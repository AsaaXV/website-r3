import React, { useState, useMemo } from 'react';
import {
  LayoutDashboard,
  FileText,
  PlusCircle,
  BarChart3,
  CheckCircle2,
  XCircle,
  Clock,
  Users,
  Tag,
  MessageSquare,
  ShieldCheck,
  ChevronRight,
  Trash2,
  Copy,
  ArrowUp,
  ArrowDown,
  Edit,
  Save,
  Send,
  Eye,
  Calendar,
  AlertCircle,
  PieChart as PieChartIcon,
  TrendingUp,
  Filter,
  Check,
  Search,
  ExternalLink,
  Sliders,
  Sparkles,
  Archive,
  RefreshCw,
} from 'lucide-react';
import {
  Survey,
  SurveyQuestion,
  SurveyQuestionType,
  SurveyResponse,
  SurveyStatus,
  RoleRequest,
  ReuseCategory,
  OfficialCommunityPost,
  UserProfile,
  UserRole,
} from '../types';
import {
  getStoredSurveys,
  saveStoredSurveys,
  getStoredSurveyResponses,
  getStoredRoleRequests,
  saveStoredRoleRequests,
  getStoredCategories,
  saveStoredCategories,
  getStoredOfficialPosts,
  saveStoredOfficialPosts,
  getEffectiveSurveyStatus,
  deleteSurvey,
  updateSurveyStatus,
} from '../utils/surveyStorage';
import { AUTHORIZED_ACCOUNTS, getRegisteredLocalAccounts } from '../utils/authAccounts';

interface AdminDashboardViewProps {
  currentUser: UserProfile;
  onNavigateToTab?: (tab: string) => void;
  onShowToast?: (message: string) => void;
}

export const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({
  currentUser,
  onNavigateToTab,
  onShowToast,
}) => {
  // Main admin active menu
  const [adminSection, setAdminSection] = useState<
    'overview' | 'role_requests' | 'categories' | 'posts' | 'surveys' | 'users'
  >('overview');

  // Survey sub-tab
  const [surveySubTab, setSurveySubTab] = useState<
    'all' | 'create' | 'draft' | 'scheduled' | 'published' | 'closed' | 'expired' | 'analytics'
  >('all');

  // Storage states
  const [surveys, setSurveys] = useState<Survey[]>(() => getStoredSurveys());
  const [responses, setResponses] = useState<SurveyResponse[]>(() => getStoredSurveyResponses());
  const [roleRequests, setRoleRequests] = useState<RoleRequest[]>(() => getStoredRoleRequests());
  const [categories, setCategories] = useState<ReuseCategory[]>(() => getStoredCategories());
  const [officialPosts, setOfficialPosts] = useState<OfficialCommunityPost[]>(() => getStoredOfficialPosts());

  // Analytics selection
  const [selectedAnalyticsSurveyId, setSelectedAnalyticsSurveyId] = useState<string>(() => {
    return surveys.length > 0 ? surveys[0].id : '';
  });

  // Comparison group filter for analytics: 'all' | 'faculty' | 'role' | 'batch'
  const [analyticsGroupFilter, setAnalyticsGroupFilter] = useState<'all' | 'faculty' | 'role' | 'batch'>('all');
  const [selectedGroupValue, setSelectedGroupValue] = useState<string>('all');

  // Selected response for "Lihat Jawaban" modal
  const [viewingResponseDetail, setViewingResponseDetail] = useState<SurveyResponse | null>(null);

  // Survey Builder state
  const [editingSurveyId, setEditingSurveyId] = useState<string | null>(null);
  const [surveyTitle, setSurveyTitle] = useState('');
  const [surveyDesc, setSurveyDesc] = useState('');
  const [surveyStartDateTime, setSurveyStartDateTime] = useState<string>(() => {
    const d = new Date();
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().slice(0, 16);
  });
  const [surveyEndDateTime, setSurveyEndDateTime] = useState<string>(() => {
    const d = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().slice(0, 16);
  });
  const [allowResubmission, setAllowResubmission] = useState(false);
  const [surveyQuestions, setSurveyQuestions] = useState<SurveyQuestion[]>([]);

  // Category modal / builder state
  const [newCatName, setNewCatName] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');

  // Official Post builder state
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostCategory, setNewPostCategory] = useState('Kebijakan Kampus');
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostImage, setNewPostImage] = useState('');

  // Toast helper
  const notify = (msg: string) => {
    if (onShowToast) onShowToast(msg);
  };

  // Re-read storage on demand
  const refreshAllData = () => {
    setSurveys(getStoredSurveys());
    setResponses(getStoredSurveyResponses());
    setRoleRequests(getStoredRoleRequests());
    setCategories(getStoredCategories());
    setOfficialPosts(getStoredOfficialPosts());
  };

  // ============================================================
  // QUESTION BUILDER HANDLERS
  // ============================================================
  const handleStartCreateSurvey = () => {
    setEditingSurveyId(null);
    setSurveyTitle('');
    setSurveyDesc('');
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    const future = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    future.setMinutes(future.getMinutes() - future.getTimezoneOffset());
    setSurveyStartDateTime(now.toISOString().slice(0, 16));
    setSurveyEndDateTime(future.toISOString().slice(0, 16));
    setAllowResubmission(false);
    setSurveyQuestions([
      {
        id: `q_${Date.now()}_1`,
        surveyId: '',
        question: 'Seberapa mudah menggunakan layanan aplikasi ini?',
        type: 'likert',
        required: true,
        order: 1,
        scaleMin: 1,
        scaleMax: 5,
        scaleLabels: { min: 'Sangat Sulit', max: 'Sangat Mudah' },
      },
    ]);
    setSurveySubTab('create');
  };

  const handleStartEditSurvey = (survey: Survey) => {
    setEditingSurveyId(survey.id);
    setSurveyTitle(survey.title);
    setSurveyDesc(survey.description);
    setSurveyStartDateTime(
      survey.startDateTime || (survey.startDate ? `${survey.startDate}T08:00` : '')
    );
    setSurveyEndDateTime(
      survey.endDateTime || (survey.endDate ? `${survey.endDate}T23:59` : '')
    );
    setAllowResubmission(Boolean(survey.allowResubmission));
    setSurveyQuestions(JSON.parse(JSON.stringify(survey.questions)));
    setSurveySubTab('create');
  };

  const handleAddQuestion = () => {
    const newQ: SurveyQuestion = {
      id: `q_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      surveyId: editingSurveyId || '',
      question: '',
      type: 'single_choice',
      options: ['Pilihan A', 'Pilihan B', 'Pilihan C'],
      required: true,
      order: surveyQuestions.length + 1,
    };
    setSurveyQuestions((prev) => [...prev, newQ]);
  };

  const handleUpdateQuestion = (qId: string, patch: Partial<SurveyQuestion>) => {
    setSurveyQuestions((prev) =>
      prev.map((q) => (q.id === qId ? { ...q, ...patch } : q))
    );
  };

  const handleDeleteQuestion = (qId: string) => {
    if (surveyQuestions.length <= 1) {
      alert('Survei harus memiliki minimal satu pertanyaan.');
      return;
    }
    setSurveyQuestions((prev) =>
      prev.filter((q) => q.id !== qId).map((q, idx) => ({ ...q, order: idx + 1 }))
    );
  };

  const handleDuplicateQuestion = (qId: string) => {
    const target = surveyQuestions.find((q) => q.id === qId);
    if (!target) return;
    const duplicated: SurveyQuestion = {
      ...JSON.parse(JSON.stringify(target)),
      id: `q_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      question: `${target.question} (Salinan)`,
      order: surveyQuestions.length + 1,
    };
    setSurveyQuestions((prev) => [...prev, duplicated]);
    notify('Pertanyaan berhasil diduplikasi.');
  };

  const handleMoveQuestionOrder = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === surveyQuestions.length - 1) return;

    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    const copy = [...surveyQuestions];
    const temp = copy[index];
    copy[index] = copy[targetIdx];
    copy[targetIdx] = temp;

    // Re-index order
    const updated = copy.map((q, idx) => ({ ...q, order: idx + 1 }));
    setSurveyQuestions(updated);
  };

  const handleSaveSurvey = (targetStatus: SurveyStatus) => {
    if (!surveyTitle.trim()) {
      alert('Judul survei wajib diisi.');
      return;
    }

    if (surveyQuestions.some((q) => !q.question.trim())) {
      alert('Semua butir pertanyaan wajib memiliki teks pertanyaan.');
      return;
    }

    const surveyId = editingSurveyId || `survey_${Date.now()}`;
    const mappedQuestions = surveyQuestions.map((q, idx) => ({
      ...q,
      surveyId,
      order: idx + 1,
    }));

    const nowIso = new Date().toISOString();
    let updatedSurveys: Survey[];

    if (editingSurveyId) {
      updatedSurveys = surveys.map((s) =>
        s.id === editingSurveyId
          ? {
              ...s,
              title: surveyTitle.trim(),
              description: surveyDesc.trim(),
              status: targetStatus,
              startDate: surveyStartDateTime.split('T')[0],
              endDate: surveyEndDateTime.split('T')[0],
              startDateTime: surveyStartDateTime,
              endDateTime: surveyEndDateTime,
              allowResubmission,
              updatedAt: nowIso,
              questions: mappedQuestions,
            }
          : s
      );
    } else {
      const newSurvey: Survey = {
        id: surveyId,
        title: surveyTitle.trim(),
        description: surveyDesc.trim(),
        status: targetStatus,
        startDate: surveyStartDateTime.split('T')[0],
        endDate: surveyEndDateTime.split('T')[0],
        startDateTime: surveyStartDateTime,
        endDateTime: surveyEndDateTime,
        createdBy: currentUser.name || 'Administrator Green Campus UNM',
        creatorId: currentUser.id,
        createdAt: nowIso,
        updatedAt: nowIso,
        allowResubmission,
        questions: mappedQuestions,
      };
      updatedSurveys = [newSurvey, ...surveys];
    }

    setSurveys(updatedSurveys);
    saveStoredSurveys(updatedSurveys);
    notify(
      targetStatus === 'published'
        ? 'Survei berhasil dipublikasikan dan aktif di dashboard mahasiswa!'
        : 'Draft survei berhasil disimpan.'
    );
    setSurveySubTab(targetStatus === 'published' ? 'published' : 'draft');
  };

  const handleChangeSurveyStatus = (surveyId: string, newStatus: SurveyStatus) => {
    updateSurveyStatus(surveyId, newStatus);
    setSurveys(getStoredSurveys());
    notify(`Status survei berhasil diperbarui menjadi: ${newStatus.toUpperCase()}`);
  };

  const handleDeleteSurvey = (surveyId: string) => {
    if (!window.confirm('Yakin ingin menghapus survei ini? Seluruh data respon survei ini juga akan dihapus.')) {
      return;
    }
    deleteSurvey(surveyId);
    const refreshed = getStoredSurveys();
    setSurveys(refreshed);
    setResponses(getStoredSurveyResponses());
    if (selectedAnalyticsSurveyId === surveyId) {
      setSelectedAnalyticsSurveyId(refreshed.length > 0 ? refreshed[0].id : '');
    }
    notify('Survei dan data responnya berhasil dihapus.');
  };

  // ============================================================
  // ROLE REQUEST HANDLERS
  // ============================================================
  const handleReviewRoleRequest = (requestId: string, action: 'approve' | 'reject') => {
    const target = roleRequests.find((r) => r.id === requestId);
    if (!target) return;

    const updated = roleRequests.map((r) => {
      if (r.id === requestId) {
        return {
          ...r,
          status: action === 'approve' ? ('approved' as const) : ('rejected' as const),
          reviewedBy: currentUser.name,
          reviewedAt: new Date().toISOString(),
          reviewNotes:
            action === 'approve'
              ? 'Disetujui oleh Administrator Kampus.'
              : 'Ditolak: Berkas identitas belum memenuhi verifikasi.',
        };
      }
      return r;
    });

    setRoleRequests(updated);
    saveStoredRoleRequests(updated);

    // If approved, update user's profile in registered users
    if (action === 'approve') {
      try {
        const registered = getRegisteredLocalAccounts();
        const matched = registered.find((acc) => acc.profile.id === target.userId);
        if (matched) {
          matched.profile.role = target.requestedRole;
          localStorage.setItem('ecocampus_registered_users', JSON.stringify(registered));
        }
      } catch (e) {
        console.warn('Could not sync approved role:', e);
      }
      notify(`Permohonan peran ${target.fullName} berhasil disetujui sebagai ${target.requestedRole}!`);
    } else {
      notify(`Permohonan peran ${target.fullName} telah ditolak.`);
    }
  };

  // ============================================================
  // CATEGORIES HANDLERS
  // ============================================================
  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    const newCat: ReuseCategory = {
      id: `cat_${Date.now()}`,
      name: newCatName.trim(),
      description: newCatDesc.trim() || 'Kategori barang sirkular kampus.',
      status: 'active',
      createdBy: currentUser.name,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updated = [...categories, newCat];
    setCategories(updated);
    saveStoredCategories(updated);
    setNewCatName('');
    setNewCatDesc('');
    notify('Kategori bursa reuse berhasil ditambahkan.');
  };

  const handleToggleCategoryStatus = (catId: string) => {
    const updated = categories.map((c) =>
      c.id === catId
        ? { ...c, status: (c.status === 'active' ? 'inactive' : 'active') as 'active' | 'inactive' }
        : c
    );
    setCategories(updated);
    saveStoredCategories(updated);
    notify('Status kategori berhasil diperbarui.');
  };

  const handleDeleteCategory = (catId: string) => {
    if (categories.length <= 1) {
      alert('Minimal harus ada satu kategori bursa reuse.');
      return;
    }
    const updated = categories.filter((c) => c.id !== catId);
    setCategories(updated);
    saveStoredCategories(updated);
    notify('Kategori berhasil dihapus.');
  };

  // ============================================================
  // OFFICIAL POSTS HANDLERS
  // ============================================================
  const handleCreateOfficialPost = (status: 'published' | 'draft') => {
    if (!newPostTitle.trim() || !newPostContent.trim()) {
      alert('Judul dan isi postingan wajib diisi.');
      return;
    }

    const newPost: OfficialCommunityPost = {
      id: `post_off_${Date.now()}`,
      title: newPostTitle.trim(),
      content: newPostContent.trim(),
      image: newPostImage.trim() || undefined,
      categoryId: `cat_${newPostCategory.toLowerCase().replace(/\s+/g, '_')}`,
      categoryName: newPostCategory,
      status,
      createdBy: currentUser.name,
      publishedAt: status === 'published' ? new Date().toISOString() : undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updated = [newPost, ...officialPosts];
    setOfficialPosts(updated);
    saveStoredOfficialPosts(updated);
    setNewPostTitle('');
    setNewPostContent('');
    setNewPostImage('');
    notify(
      status === 'published'
        ? 'Postingan resmi berhasil dipublikasikan ke feed komunitas!'
        : 'Postingan resmi disimpan sebagai draft.'
    );
  };

  const handleDeleteOfficialPost = (postId: string) => {
    const updated = officialPosts.filter((p) => p.id !== postId);
    setOfficialPosts(updated);
    saveStoredOfficialPosts(updated);
    notify('Postingan resmi berhasil dihapus.');
  };

  // ============================================================
  // SURVEY COUNTS & LIFECYCLE SUMMARY (EFFECTIVE STATUS)
  // ============================================================
  const surveySummary = useMemo(() => {
    const summary = {
      all: surveys.length,
      draft: 0,
      scheduled: 0,
      published: 0,
      closed: 0,
      expired: 0,
    };
    surveys.forEach((s) => {
      const eff = getEffectiveSurveyStatus(s);
      if (eff === 'draft') summary.draft++;
      else if (eff === 'scheduled') summary.scheduled++;
      else if (eff === 'published' || eff === 'active') summary.published++;
      else if (eff === 'closed') summary.closed++;
      else if (eff === 'expired') summary.expired++;
    });
    return summary;
  }, [surveys]);

  // ============================================================
  // ANALYTICS CALCULATIONS (REAL DATA ONLY - NO DUMMY!)
  // ============================================================
  const activeAnalyticsSurvey = useMemo(() => {
    return surveys.find((s) => s.id === selectedAnalyticsSurveyId) || surveys[0];
  }, [surveys, selectedAnalyticsSurveyId]);

  const surveyResponses = useMemo(() => {
    if (!activeAnalyticsSurvey) return [];
    return responses.filter((r) => r.surveyId === activeAnalyticsSurvey.id);
  }, [responses, activeAnalyticsSurvey]);

  // Comparison group values extraction
  const availableFaculties = useMemo(() => {
    const set = new Set<string>();
    surveyResponses.forEach((r) => {
      if (r.userFaculty) set.add(r.userFaculty);
    });
    return Array.from(set);
  }, [surveyResponses]);

  const availableRoles = useMemo(() => {
    const set = new Set<string>();
    surveyResponses.forEach((r) => {
      if (r.userRole) set.add(r.userRole);
    });
    return Array.from(set);
  }, [surveyResponses]);

  const availableBatches = useMemo(() => {
    const set = new Set<string>();
    surveyResponses.forEach((r) => {
      if (r.userBatch) set.add(r.userBatch);
    });
    return Array.from(set);
  }, [surveyResponses]);

  const uniqueRespondentsCount = useMemo(() => {
    const set = new Set<string>();
    surveyResponses.forEach((r) => {
      if (r.userId) set.add(r.userId);
    });
    return set.size;
  }, [surveyResponses]);

  // Filtered responses for comparison
  const filteredResponses = useMemo(() => {
    if (analyticsGroupFilter === 'faculty' && selectedGroupValue !== 'all') {
      return surveyResponses.filter((r) => r.userFaculty === selectedGroupValue);
    }
    if (analyticsGroupFilter === 'role' && selectedGroupValue !== 'all') {
      return surveyResponses.filter((r) => r.userRole === selectedGroupValue);
    }
    if (analyticsGroupFilter === 'batch' && selectedGroupValue !== 'all') {
      return surveyResponses.filter((r) => r.userBatch === selectedGroupValue);
    }
    return surveyResponses;
  }, [surveyResponses, analyticsGroupFilter, selectedGroupValue]);

  // Total campus registered users for participation rate calculation
  const totalRegisteredUsers = useMemo(() => {
    const local = getRegisteredLocalAccounts();
    return Math.max(local.length + AUTHORIZED_ACCOUNTS.length, 1);
  }, []);

  const participationRate = useMemo(() => {
    if (!surveyResponses.length) return 0;
    return Math.min(Math.round((surveyResponses.length / totalRegisteredUsers) * 100), 100);
  }, [surveyResponses.length, totalRegisteredUsers]);

  // Helper to compute question analytics
  const getQuestionStats = (q: SurveyQuestion) => {
    const answersList = filteredResponses
      .map((r) => r.answers.find((a) => a.questionId === q.id)?.value)
      .filter((v) => v !== undefined && v !== null && v !== '');

    const totalAnswers = answersList.length;

    // Single choice / Multiple choice distribution
    if (q.type === 'single_choice' || q.type === 'multiple_choice') {
      const counts: Record<string, number> = {};
      (q.options || []).forEach((opt) => (counts[opt] = 0));

      answersList.forEach((val) => {
        if (Array.isArray(val)) {
          val.forEach((item) => {
            counts[item] = (counts[item] || 0) + 1;
          });
        } else if (typeof val === 'string') {
          counts[val] = (counts[val] || 0) + 1;
        }
      });

      return {
        totalAnswers,
        distribution: counts,
      };
    }

    // Likert 1-5
    if (q.type === 'likert') {
      const counts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
      let sum = 0;
      answersList.forEach((val) => {
        const num = Number(val);
        if (!isNaN(num) && num >= 1 && num <= 5) {
          counts[num] = (counts[num] || 0) + 1;
          sum += num;
        }
      });
      const averageScore = totalAnswers > 0 ? (sum / totalAnswers).toFixed(2) : '0.00';
      return {
        totalAnswers,
        distribution: counts,
        averageScore,
      };
    }

    // Yes/No
    if (q.type === 'yes_no') {
      const counts = { Ya: 0, Tidak: 0 };
      answersList.forEach((val) => {
        if (val === 'Ya') counts.Ya++;
        if (val === 'Tidak') counts.Tidak++;
      });
      return {
        totalAnswers,
        distribution: counts,
      };
    }

    // Number
    if (q.type === 'number') {
      const numbers = answersList.map(Number).filter((n) => !isNaN(n));
      const sum = numbers.reduce((a, b) => a + b, 0);
      const avg = numbers.length > 0 ? (sum / numbers.length).toFixed(1) : '0';
      const min = numbers.length > 0 ? Math.min(...numbers) : 0;
      const max = numbers.length > 0 ? Math.max(...numbers) : 0;
      return {
        totalAnswers,
        average: avg,
        min,
        max,
        raw: numbers,
      };
    }

    // Text (short or long)
    return {
      totalAnswers,
      textAnswers: filteredResponses
        .map((r) => {
          const ans = r.answers.find((a) => a.questionId === q.id)?.value;
          if (!ans) return null;
          return {
            userName: r.userName || 'Anonim',
            userFaculty: r.userFaculty || 'UNM',
            submittedAt: r.submittedAt,
            text: String(ans),
          };
        })
        .filter(Boolean),
    };
  };

  return (
    <div className="space-y-6 select-none" id="admin-dashboard-container">
      {/* Top Header Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 text-white p-6 sm:p-8 border border-slate-700/60 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Portal Administrator Resmi</span>
              </span>
              <span className="text-xs text-slate-400 font-mono">
                UNM Green Campus Management Console
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              Pusat Kendali & Tata Kelola EcoCampus 3R
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Kelola sistem survei dinamis, question builder, analitik respon real-time, approval
              permohonan peran, kategori bursa reuse, dan publikasi pengumuman kampus.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={refreshAllData}
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Sinkronkan data"
            >
              <RefreshCw className="w-4 h-4" />
              <span className="hidden sm:inline">Refresh</span>
            </button>
            <button
              onClick={handleStartCreateSurvey}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-2 transition-all shadow-md shadow-emerald-600/30 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>+ Buat Survei Baru</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Admin Navigation Tabs (6 Primary Modules) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-200 dark:border-slate-800 scrollbar-none">
        {[
          { id: 'overview', label: 'Overview', icon: LayoutDashboard, badge: null },
          {
            id: 'role_requests',
            label: 'Pengajuan Role',
            icon: ShieldCheck,
            badge: roleRequests.filter((r) => r.status === 'pending').length || null,
          },
          { id: 'categories', label: 'Kategori Bursa', icon: Tag, badge: categories.length },
          { id: 'posts', label: 'Postingan Komunitas', icon: MessageSquare, badge: officialPosts.length },
          {
            id: 'surveys',
            label: 'Sistem Survei',
            icon: FileText,
            badge: surveys.filter((s) => s.status === 'published').length + ' Aktif',
          },
          { id: 'users', label: 'Daftar Pengguna', icon: Users, badge: null },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = adminSection === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setAdminSection(tab.id as any);
                if (tab.id === 'surveys' && surveySubTab === 'create' && !editingSurveyId) {
                  setSurveySubTab('all');
                }
              }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-white dark:bg-[#131b2e] border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.badge && (
                <span
                  className={`px-1.5 py-0.2 rounded text-[10px] font-black ${
                    isActive ? 'bg-white text-emerald-700' : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* 1. OVERVIEW SECTION                                                      */}
      {/* ========================================================================= */}
      {adminSection === 'overview' && (
        <div className="space-y-6">
          {/* Key Metric Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-white dark:bg-[#131b2e] border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs">
                <span className="font-semibold">Survei Aktif</span>
                <FileText className="w-4 h-4 text-emerald-500" />
              </div>
              <div className="text-2xl font-black text-slate-900 dark:text-white">
                {surveys.filter((s) => s.status === 'published').length}
              </div>
              <div className="text-[11px] text-slate-500">
                Dari total {surveys.length} survei terdaftar
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-[#131b2e] border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs">
                <span className="font-semibold">Total Responden</span>
                <Users className="w-4 h-4 text-blue-500" />
              </div>
              <div className="text-2xl font-black text-slate-900 dark:text-white">
                {responses.length}
              </div>
              <div className="text-[11px] text-slate-500">Partisipasi sivitas kampus UNM</div>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-[#131b2e] border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs">
                <span className="font-semibold">Pengajuan Role Pending</span>
                <Clock className="w-4 h-4 text-amber-500" />
              </div>
              <div className="text-2xl font-black text-amber-600 dark:text-amber-400">
                {roleRequests.filter((r) => r.status === 'pending').length}
              </div>
              <div className="text-[11px] text-slate-500">Menunggu persetujuan admin</div>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-[#131b2e] border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs">
                <span className="font-semibold">Kategori Bursa Aktif</span>
                <Tag className="w-4 h-4 text-purple-500" />
              </div>
              <div className="text-2xl font-black text-slate-900 dark:text-white">
                {categories.filter((c) => c.status === 'active').length}
              </div>
              <div className="text-[11px] text-slate-500">Kategori sirkular terverifikasi</div>
            </div>
          </div>

          {/* Quick Pending Approvals & Recent Surveys */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left: Pending Role Approvals */}
            <div className="p-5 rounded-2xl bg-white dark:bg-[#131b2e] border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-amber-500" />
                  <span>Pengajuan Peran Menunggu Review</span>
                </h3>
                <button
                  onClick={() => setAdminSection('role_requests')}
                  className="text-xs text-emerald-600 hover:underline font-bold"
                >
                  Lihat Semua
                </button>
              </div>

              {roleRequests.filter((r) => r.status === 'pending').length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-400">
                  Tidak ada permohonan peran yang menunggu saat ini.
                </div>
              ) : (
                <div className="space-y-2.5">
                  {roleRequests
                    .filter((r) => r.status === 'pending')
                    .slice(0, 3)
                    .map((req) => (
                      <div
                        key={req.id}
                        className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-3 text-xs"
                      >
                        <div>
                          <div className="font-bold text-slate-900 dark:text-white">
                            {req.fullName}
                          </div>
                          <div className="text-[11px] text-slate-500">
                            Mengajukan: <strong className="capitalize">{req.requestedRole}</strong> •{' '}
                            {req.faculty}
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            onClick={() => handleReviewRoleRequest(req.id, 'approve')}
                            className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white font-bold text-[11px] hover:bg-emerald-500 cursor-pointer"
                          >
                            Setujui
                          </button>
                          <button
                            onClick={() => handleReviewRoleRequest(req.id, 'reject')}
                            className="px-2.5 py-1 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-[11px] hover:bg-slate-300 cursor-pointer"
                          >
                            Tolak
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>

            {/* Right: Active Surveys Status */}
            <div className="p-5 rounded-2xl bg-white dark:bg-[#131b2e] border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                  <FileText className="w-4 h-4 text-emerald-500" />
                  <span>Survei Terbit & Partisipasi</span>
                </h3>
                <button
                  onClick={() => {
                    setAdminSection('surveys');
                    setSurveySubTab('analytics');
                  }}
                  className="text-xs text-emerald-600 hover:underline font-bold"
                >
                  Buka Analisis
                </button>
              </div>

              <div className="space-y-3">
                {surveys.slice(0, 3).map((survey) => {
                  const respCount = responses.filter((r) => r.surveyId === survey.id).length;
                  return (
                    <div
                      key={survey.id}
                      className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="font-bold text-slate-900 dark:text-white truncate">
                          {survey.title}
                        </div>
                        <div className="text-[11px] text-slate-500 flex items-center gap-2">
                          <span
                            className={`px-1.5 py-0.2 rounded uppercase font-black text-[9px] ${
                              survey.status === 'published'
                                ? 'bg-emerald-100 text-emerald-800'
                                : survey.status === 'draft'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-slate-200 text-slate-700'
                            }`}
                          >
                            {survey.status}
                          </span>
                          <span>{survey.questions.length} Pertanyaan</span>
                          <span>•</span>
                          <span>{respCount} Responden</span>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          setSelectedAnalyticsSurveyId(survey.id);
                          setAdminSection('surveys');
                          setSurveySubTab('analytics');
                        }}
                        className="p-2 rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 hover:text-emerald-500 cursor-pointer"
                        title="Buka analisis"
                      >
                        <BarChart3 className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. ROLE REQUESTS REVIEW SECTION                                          */}
      {/* ========================================================================= */}
      {adminSection === 'role_requests' && (
        <div className="space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                Manajemen & Persetujuan Pengajuan Peran
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Tinjau bukti berkas (SK Rektor, NIP, Surat Tugas) sebelum memberikan peningkatan hak akses.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131b2e] shadow-xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 font-extrabold uppercase text-[10px] border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="p-3.5">Nama & Identitas</th>
                  <th className="p-3.5">Fakultas</th>
                  <th className="p-3.5">Peran Diminta</th>
                  <th className="p-3.5">Alasan & Bukti Verifikasi</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right">Aksi Admin</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {roleRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30">
                    <td className="p-3.5">
                      <div className="font-bold text-slate-900 dark:text-white">{req.fullName}</div>
                      <div className="text-[11px] text-slate-500 font-mono">{req.identityNumber}</div>
                    </td>
                    <td className="p-3.5 text-slate-700 dark:text-slate-300">{req.faculty}</td>
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 rounded-full font-bold text-[10px] uppercase bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                        {req.requestedRole}
                      </span>
                    </td>
                    <td className="p-3.5 max-w-xs">
                      <div className="text-slate-800 dark:text-slate-200 line-clamp-2">{req.reason}</div>
                      <div className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-0.5 font-medium">
                        Bukti: {req.evidence}
                      </div>
                    </td>
                    <td className="p-3.5">
                      <span
                        className={`px-2 py-0.5 rounded-full font-bold text-[10px] uppercase ${
                          req.status === 'approved'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : req.status === 'rejected'
                            ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                            : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                        }`}
                      >
                        {req.status}
                      </span>
                    </td>
                    <td className="p-3.5 text-right">
                      {req.status === 'pending' ? (
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleReviewRoleRequest(req.id, 'approve')}
                            className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white font-bold text-[11px] hover:bg-emerald-500 cursor-pointer"
                          >
                            Setujui
                          </button>
                          <button
                            onClick={() => handleReviewRoleRequest(req.id, 'reject')}
                            className="px-2.5 py-1 rounded-lg bg-rose-600 text-white font-bold text-[11px] hover:bg-rose-500 cursor-pointer"
                          >
                            Tolak
                          </button>
                        </div>
                      ) : (
                        <div className="text-[11px] text-slate-400">
                          Telah ditinjau oleh {req.reviewedBy || 'Admin'}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. DYNAMIC CATEGORIES SECTION                                            */}
      {/* ========================================================================= */}
      {adminSection === 'categories' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Form Tambah Kategori */}
            <div className="p-5 rounded-2xl bg-white dark:bg-[#131b2e] border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <PlusCircle className="w-4 h-4 text-emerald-500" />
                <span>Tambah Kategori Baru</span>
              </h3>
              <form onSubmit={handleAddCategory} className="space-y-3 text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">
                    Nama Kategori:
                  </label>
                  <input
                    type="text"
                    value={newCatName}
                    onChange={(e) => setNewCatName(e.target.value)}
                    placeholder="Misal: Alat Praktikum Elektro"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">
                    Deskripsi Kategori:
                  </label>
                  <textarea
                    rows={3}
                    value={newCatDesc}
                    onChange={(e) => setNewCatDesc(e.target.value)}
                    placeholder="Penjelasan jenis barang yang masuk ke kategori ini..."
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors cursor-pointer"
                >
                  Simpan Kategori Baru
                </button>
              </form>
            </div>

            {/* List of Existing Categories */}
            <div className="lg:col-span-2 p-5 rounded-2xl bg-white dark:bg-[#131b2e] border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  Daftar Kategori Bursa Reuse ({categories.length})
                </h3>
                <span className="text-[11px] text-slate-400">
                  Dinamis & langsung tampil di formulir jual/hibah barang
                </span>
              </div>

              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {categories.map((cat) => (
                  <div
                    key={cat.id}
                    className="py-3 flex items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 dark:text-white">{cat.name}</span>
                        <span
                          className={`px-1.5 py-0.2 rounded text-[9px] font-black uppercase ${
                            cat.status === 'active'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-slate-200 text-slate-600'
                          }`}
                        >
                          {cat.status}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        {cat.description}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleToggleCategoryStatus(cat.id)}
                        className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 text-[11px] font-bold hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                      >
                        {cat.status === 'active' ? 'Nonaktifkan' : 'Aktifkan'}
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(cat.id)}
                        className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 cursor-pointer"
                        title="Hapus Kategori"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. OFFICIAL COMMUNITY POSTS SECTION                                      */}
      {/* ========================================================================= */}
      {adminSection === 'posts' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Create Post Form */}
            <div className="p-5 rounded-2xl bg-white dark:bg-[#131b2e] border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <PlusCircle className="w-4 h-4 text-emerald-500" />
                <span>Buat Pengumuman Resmi Kampus</span>
              </h3>
              <div className="space-y-3 text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">
                    Judul Pengumuman:
                  </label>
                  <input
                    type="text"
                    value={newPostTitle}
                    onChange={(e) => setNewPostTitle(e.target.value)}
                    placeholder="Contoh: Jadwal Penimbangan Sampah Kampus..."
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">Kategori:</label>
                  <select
                    value={newPostCategory}
                    onChange={(e) => setNewPostCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="Kebijakan Kampus">Kebijakan Kampus</option>
                    <option value="Jadwal TPST">Jadwal TPST</option>
                    <option value="Agenda Bersih">Agenda Bersih Lingkungan</option>
                    <option value="Tips Circular">Tips Circular & Zero Waste</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">
                    URL Gambar Sampul (Opsional):
                  </label>
                  <input
                    type="text"
                    value={newPostImage}
                    onChange={(e) => setNewPostImage(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">
                    Isi Pengumuman:
                  </label>
                  <textarea
                    rows={4}
                    value={newPostContent}
                    onChange={(e) => setNewPostContent(e.target.value)}
                    placeholder="Tuliskan isi pengumuman atau instruksi resmi di sini..."
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="flex gap-2 pt-1">
                  <button
                    onClick={() => handleCreateOfficialPost('draft')}
                    className="flex-1 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-bold text-xs cursor-pointer"
                  >
                    Simpan Draft
                  </button>
                  <button
                    onClick={() => handleCreateOfficialPost('published')}
                    className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs cursor-pointer"
                  >
                    Publikasikan
                  </button>
                </div>
              </div>
            </div>

            {/* List of Official Posts */}
            <div className="lg:col-span-2 p-5 rounded-2xl bg-white dark:bg-[#131b2e] border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                Daftar Pengumuman Resmi Direktorat ({officialPosts.length})
              </h3>

              <div className="space-y-3">
                {officialPosts.map((post) => (
                  <div
                    key={post.id}
                    className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-start justify-between gap-4 text-xs"
                  >
                    {post.image && (
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full sm:w-28 h-20 rounded-lg object-cover shrink-0"
                      />
                    )}
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                          {post.categoryName}
                        </span>
                        <span
                          className={`px-1.5 py-0.2 rounded text-[9px] font-black uppercase ${
                            post.status === 'published'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {post.status}
                        </span>
                      </div>
                      <div className="font-bold text-slate-900 dark:text-white text-sm">
                        {post.title}
                      </div>
                      <p className="text-slate-600 dark:text-slate-300 text-[11px] line-clamp-2">
                        {post.content}
                      </p>
                      <div className="text-[10px] text-slate-400">
                        Oleh: {post.createdBy} • {post.publishedAt || post.createdAt}
                      </div>
                    </div>

                    <button
                      onClick={() => handleDeleteOfficialPost(post.id)}
                      className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg cursor-pointer self-end sm:self-start"
                      title="Hapus postingan"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. DYNAMIC SURVEY MANAGEMENT SECTION (6 SUB-TABS)                         */}
      {/* ========================================================================= */}
      {adminSection === 'surveys' && (
        <div className="space-y-6">
          {/* Survey Navigation Rail / Subtabs */}
          <div className="flex items-center justify-between flex-wrap gap-3 pb-2 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-1.5 overflow-x-auto">
              {[
                { id: 'all', label: 'Semua Survei', count: surveySummary.all },
                { id: 'create', label: editingSurveyId ? 'Edit Survei' : 'Buat Survei Baru' },
                {
                  id: 'draft',
                  label: 'Draft',
                  count: surveySummary.draft,
                },
                {
                  id: 'scheduled',
                  label: 'Terjadwal',
                  count: surveySummary.scheduled,
                },
                {
                  id: 'published',
                  label: 'Aktif',
                  count: surveySummary.published,
                },
                {
                  id: 'closed',
                  label: 'Ditutup',
                  count: surveySummary.closed,
                },
                {
                  id: 'expired',
                  label: 'Kedaluwarsa',
                  count: surveySummary.expired,
                },
                { id: 'analytics', label: 'Analisis Survei' },
              ].map((sub) => (
                <button
                  key={sub.id}
                  onClick={() => {
                    if (sub.id === 'create' && !editingSurveyId) {
                      handleStartCreateSurvey();
                    } else {
                      setSurveySubTab(sub.id as any);
                    }
                  }}
                  className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all cursor-pointer whitespace-nowrap ${
                    surveySubTab === sub.id
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  <span>{sub.label}</span>
                  {sub.count !== undefined && (
                    <span className="ml-1.5 px-1.5 py-0.2 rounded text-[10px] bg-black/20 text-white">
                      {sub.count}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {surveySubTab !== 'create' && (
              <button
                onClick={handleStartCreateSurvey}
                className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>+ Buat Survei Baru</span>
              </button>
            )}
          </div>

          {/* 5A. QUESTION BUILDER / FORM SURVEI BARU */}
          {surveySubTab === 'create' && (
            <div className="space-y-6">
              <div className="p-6 rounded-3xl bg-white dark:bg-[#131b2e] border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      {editingSurveyId ? 'Modifikasi Survei Riset' : 'Pembuat Survei Dinamis Baru'}
                    </h3>
                    <p className="text-xs text-slate-500">
                      Rancang instrumen kuesioner dengan berbagai tipe pertanyaan sesuai kebutuhan riset kampus.
                    </p>
                  </div>
                  <button
                    onClick={() => setSurveySubTab('all')}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-600 dark:text-slate-300 font-bold text-xs cursor-pointer"
                  >
                    Batal
                  </button>
                </div>

                {/* Survey Metadata Inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="sm:col-span-2 space-y-1">
                    <label className="font-bold text-slate-700 dark:text-slate-300">
                      Judul Survei: <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={surveyTitle}
                      onChange={(e) => setSurveyTitle(e.target.value)}
                      placeholder="Contoh: Evaluasi Kebiasaan Pilah Sampah Mahasiswa Semester Ganjil"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div className="sm:col-span-2 space-y-1">
                    <label className="font-bold text-slate-700 dark:text-slate-300">
                      Deskripsi & Tujuan Survei:
                    </label>
                    <textarea
                      rows={2}
                      value={surveyDesc}
                      onChange={(e) => setSurveyDesc(e.target.value)}
                      placeholder="Jelaskan tujuan survei kepada responden..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 dark:text-slate-300">
                      Waktu & Tanggal Mulai:
                    </label>
                    <input
                      type="datetime-local"
                      value={surveyStartDateTime}
                      onChange={(e) => setSurveyStartDateTime(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 dark:text-slate-300">
                      Waktu & Tanggal Selesai:
                    </label>
                    <input
                      type="datetime-local"
                      value={surveyEndDateTime}
                      onChange={(e) => setSurveyEndDateTime(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                    />
                  </div>

                  <div className="sm:col-span-2 pt-2">
                    <label className="flex items-center gap-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={allowResubmission}
                        onChange={(e) => setAllowResubmission(e.target.checked)}
                        className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                      />
                      <span className="font-semibold text-slate-700 dark:text-slate-300 text-xs">
                        Bolehkan responden mengisi ulang kuesioner ini lebih dari satu kali
                      </span>
                    </label>
                  </div>
                </div>

                {/* Section Pertanyaan & Dynamic List */}
                <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                        Daftar Butir Pertanyaan ({surveyQuestions.length})
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        Mendukung 7 tipe pertanyaan: Pilihan Tunggal, Ganda, Likert 1-5, Ya/Tidak, Teks Singkat, Teks Panjang, Angka.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleAddQuestion}
                      className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <PlusCircle className="w-4 h-4" />
                      <span>+ Tambah Pertanyaan</span>
                    </button>
                  </div>

                  {/* List of Questions in Builder */}
                  <div className="space-y-4">
                    {surveyQuestions.map((q, index) => (
                      <div
                        key={q.id}
                        className="p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-700/80 bg-slate-50/50 dark:bg-[#162032] space-y-4 transition-all"
                      >
                        {/* Question Control Topbar */}
                        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-200 dark:border-slate-700">
                          <div className="flex items-center gap-2">
                            <span className="w-6 h-6 rounded-lg bg-emerald-600 text-white font-bold text-xs flex items-center justify-center">
                              {index + 1}
                            </span>
                            <span className="font-bold text-xs text-slate-900 dark:text-white">
                              Pertanyaan #{index + 1}
                            </span>
                          </div>

                          {/* Order, Duplicate, Delete Actions */}
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => handleMoveQuestionOrder(index, 'up')}
                              disabled={index === 0}
                              className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-30 cursor-pointer"
                              title="Geser Naik"
                            >
                              <ArrowUp className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleMoveQuestionOrder(index, 'down')}
                              disabled={index === surveyQuestions.length - 1}
                              className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-30 cursor-pointer"
                              title="Geser Turun"
                            >
                              <ArrowDown className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDuplicateQuestion(q.id)}
                              className="p-1.5 rounded-lg text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/50 cursor-pointer"
                              title="Duplikasi Pertanyaan"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteQuestion(q.id)}
                              className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/50 cursor-pointer"
                              title="Hapus Pertanyaan"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Question Text & Type Selection */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                          <div className="sm:col-span-2 space-y-1">
                            <label className="font-bold text-slate-700 dark:text-slate-300">
                              Teks Pertanyaan:
                            </label>
                            <input
                              type="text"
                              value={q.question}
                              onChange={(e) =>
                                handleUpdateQuestion(q.id, { question: e.target.value })
                              }
                              placeholder="Ketikkan teks pertanyaan di sini..."
                              className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="font-bold text-slate-700 dark:text-slate-300">
                              Tipe Jawaban:
                            </label>
                            <select
                              value={q.type}
                              onChange={(e) => {
                                const newType = e.target.value as SurveyQuestionType;
                                const patch: Partial<SurveyQuestion> = { type: newType };
                                if (
                                  (newType === 'single_choice' || newType === 'multiple_choice') &&
                                  (!q.options || q.options.length === 0)
                                ) {
                                  patch.options = ['Opsi 1', 'Opsi 2', 'Opsi 3'];
                                }
                                handleUpdateQuestion(q.id, patch);
                              }}
                              className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                            >
                              <option value="single_choice">Pilihan Tunggal (Radio)</option>
                              <option value="multiple_choice">Pilihan Ganda (Checklist)</option>
                              <option value="likert">Skala Likert (1-5)</option>
                              <option value="yes_no">Ya / Tidak</option>
                              <option value="short_text">Jawaban Singkat</option>
                              <option value="long_text">Jawaban Panjang (Ulasan)</option>
                              <option value="number">Angka (Numerik)</option>
                            </select>
                          </div>
                        </div>

                        {/* Options editor for choice types */}
                        {(q.type === 'single_choice' || q.type === 'multiple_choice') && (
                          <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2">
                            <div className="flex items-center justify-between text-[11px] font-bold text-slate-600 dark:text-slate-300">
                              <span>Pilihan Jawaban Responden:</span>
                              <button
                                type="button"
                                onClick={() => {
                                  const current = q.options || [];
                                  handleUpdateQuestion(q.id, {
                                    options: [...current, `Pilihan Baru ${current.length + 1}`],
                                  });
                                }}
                                className="text-emerald-600 hover:underline font-bold"
                              >
                                + Tambah Pilihan
                              </button>
                            </div>

                            <div className="space-y-1.5">
                              {(q.options || []).map((opt, oIdx) => (
                                <div key={oIdx} className="flex items-center gap-2">
                                  <span className="text-[10px] font-bold text-slate-400 w-4 text-center">
                                    {oIdx + 1}.
                                  </span>
                                  <input
                                    type="text"
                                    value={opt}
                                    onChange={(e) => {
                                      const updatedOpts = [...(q.options || [])];
                                      updatedOpts[oIdx] = e.target.value;
                                      handleUpdateQuestion(q.id, { options: updatedOpts });
                                    }}
                                    className="flex-1 px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const filtered = (q.options || []).filter((_, idx) => idx !== oIdx);
                                      handleUpdateQuestion(q.id, { options: filtered });
                                    }}
                                    className="p-1 text-slate-400 hover:text-rose-500 cursor-pointer"
                                  >
                                    <XCircle className="w-4 h-4" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Scale labels for Likert */}
                        {q.type === 'likert' && (
                          <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs">
                            <div className="space-y-1">
                              <label className="text-[11px] font-bold text-slate-500">
                                Label Nilai Terendah (Skor 1):
                              </label>
                              <input
                                type="text"
                                value={q.scaleLabels?.min || 'Sangat Tidak Setuju'}
                                onChange={(e) =>
                                  handleUpdateQuestion(q.id, {
                                    scaleLabels: {
                                      min: e.target.value,
                                      max: q.scaleLabels?.max || 'Sangat Setuju',
                                    },
                                  })
                                }
                                className="w-full px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[11px] font-bold text-slate-500">
                                Label Nilai Tertinggi (Skor 5):
                              </label>
                              <input
                                type="text"
                                value={q.scaleLabels?.max || 'Sangat Setuju'}
                                onChange={(e) =>
                                  handleUpdateQuestion(q.id, {
                                    scaleLabels: {
                                      min: q.scaleLabels?.min || 'Sangat Tidak Setuju',
                                      max: e.target.value,
                                    },
                                  })
                                }
                                className="w-full px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs"
                              />
                            </div>
                          </div>
                        )}

                        {/* Required toggle */}
                        <div className="flex items-center justify-between pt-1">
                          <label className="flex items-center gap-2 text-xs cursor-pointer">
                            <input
                              type="checkbox"
                              checked={q.required}
                              onChange={(e) =>
                                handleUpdateQuestion(q.id, { required: e.target.checked })
                              }
                              className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                            />
                            <span className="font-bold text-slate-700 dark:text-slate-300 text-xs">
                              Wajib Dijawab oleh Responden
                            </span>
                          </label>

                          <span className="text-[11px] text-slate-400">
                            ID: <code className="font-mono text-[10px]">{q.id}</code>
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom Action Bar */}
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between flex-wrap gap-3">
                  <div className="text-xs text-slate-500">
                    Total: <strong>{surveyQuestions.length} Pertanyaan</strong>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleSaveSurvey('draft')}
                      className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                    >
                      <Save className="w-4 h-4" />
                      <span>Simpan Draft</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSaveSurvey('published')}
                      className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-600/20 cursor-pointer"
                    >
                      <Send className="w-4 h-4" />
                      <span>Publikasikan Survei</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 5B. SEMUA SURVEI / FILTER LIST */}
          {(surveySubTab === 'all' ||
            surveySubTab === 'draft' ||
            surveySubTab === 'scheduled' ||
            surveySubTab === 'published' ||
            surveySubTab === 'closed' ||
            surveySubTab === 'expired') && (
            <div className="space-y-4">
              {surveys.filter((s) => {
                if (surveySubTab === 'all') return true;
                const eff = getEffectiveSurveyStatus(s);
                if (surveySubTab === 'published') return eff === 'published' || eff === 'active';
                return eff === surveySubTab;
              }).length === 0 ? (
                <div className="p-12 text-center rounded-3xl bg-white dark:bg-[#131b2e] border border-slate-200 dark:border-slate-800 space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 mx-auto flex items-center justify-center">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div className="font-bold text-slate-800 dark:text-slate-200 text-sm">
                    Tidak ada survei dalam kategori ini
                  </div>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    {surveySubTab === 'draft' && 'Tidak ada draf survei yang sedang dipersiapkan.'}
                    {surveySubTab === 'scheduled' && 'Tidak ada survei yang menunggu jadwal mulai.'}
                    {surveySubTab === 'published' && 'Saat ini tidak ada survei aktif yang sedang berlangsung.'}
                    {surveySubTab === 'closed' && 'Tidak ada survei yang ditutup manual oleh admin.'}
                    {surveySubTab === 'expired' && 'Tidak ada survei yang telah melewati batas waktu kedaluwarsa.'}
                    {surveySubTab === 'all' && 'Belum ada data survei yang dibuat di sistem.'}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {surveys
                    .filter((s) => {
                      if (surveySubTab === 'all') return true;
                      const eff = getEffectiveSurveyStatus(s);
                      if (surveySubTab === 'published') return eff === 'published' || eff === 'active';
                      return eff === surveySubTab;
                    })
                    .map((survey) => {
                    const respCount = responses.filter((r) => r.surveyId === survey.id).length;
                    const effStatus = getEffectiveSurveyStatus(survey);

                    const formatDT = (dt?: string, d?: string) => {
                      if (dt) {
                        const [datePart, timePart] = dt.split('T');
                        const [y, m, day] = datePart.split('-');
                        return `${day}/${m}/${y} ${timePart ? timePart.slice(0, 5) : '00:00'}`;
                      }
                      if (d) {
                        const [y, m, day] = d.split('-');
                        return `${day}/${m}/${y} 00:00`;
                      }
                      return '-';
                    };

                    const periodStr = `${formatDT(survey.startDateTime, survey.startDate)} - ${formatDT(
                      survey.endDateTime,
                      survey.endDate
                    )}`;

                    return (
                      <div
                        key={survey.id}
                        className="p-5 rounded-2xl bg-white dark:bg-[#131b2e] border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between gap-4 hover:border-emerald-300 dark:hover:border-emerald-700 transition-all"
                      >
                        <div className="space-y-2">
                          <h4 className="font-bold text-sm text-slate-900 dark:text-white leading-snug line-clamp-2">
                            {survey.title}
                          </h4>

                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
                              {respCount} Responden
                            </span>
                            <span className="text-slate-300 dark:text-slate-700">•</span>
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                                effStatus === 'published'
                                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                  : effStatus === 'scheduled'
                                  ? 'bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300'
                                  : effStatus === 'expired'
                                  ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                                  : effStatus === 'draft'
                                  ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                                  : 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                              }`}
                            >
                              {effStatus === 'published'
                                ? 'Aktif'
                                : effStatus === 'scheduled'
                                ? 'Terjadwal'
                                : effStatus === 'expired'
                                ? 'Berakhir'
                                : effStatus === 'draft'
                                ? 'Draft'
                                : 'Ditutup'}
                            </span>
                            <span className="text-[11px] text-slate-400 font-mono ml-auto">
                              {survey.questions.length} Butir
                            </span>
                          </div>

                          <div className="text-[11px] text-slate-400 pt-1 flex items-center gap-1.5 font-mono">
                            <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span className="truncate" title={`Periode: ${periodStr}`}>
                              Periode: {periodStr}
                            </span>
                          </div>

                          {survey.description && (
                            <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 pt-0.5">
                              {survey.description}
                            </p>
                          )}
                        </div>

                        {/* Card Actions: Kelola & Data */}
                        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2 text-xs">
                          <button
                            onClick={() => handleStartEditSurvey(survey)}
                            className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                          >
                            <Edit className="w-3.5 h-3.5 text-slate-500" />
                            <span>Kelola</span>
                          </button>

                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => {
                                setSelectedAnalyticsSurveyId(survey.id);
                                setSurveySubTab('analytics');
                              }}
                              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                            >
                              <BarChart3 className="w-3.5 h-3.5" />
                              <span>Data</span>
                            </button>

                            {survey.status === 'published' ? (
                              <button
                                onClick={() => handleChangeSurveyStatus(survey.id, 'closed')}
                                className="px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-[10px] font-bold hover:bg-rose-100 text-slate-600 dark:text-slate-400 cursor-pointer"
                                title="Tutup Survei"
                              >
                                Tutup
                              </button>
                            ) : survey.status === 'draft' ? (
                              <button
                                onClick={() => handleChangeSurveyStatus(survey.id, 'published')}
                                className="px-2 py-1 rounded-lg bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 text-[10px] font-bold hover:bg-emerald-200 cursor-pointer"
                                title="Publikasikan"
                              >
                                Terbitkan
                              </button>
                            ) : (
                              <button
                                onClick={() => handleChangeSurveyStatus(survey.id, 'published')}
                                className="px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-[10px] font-bold hover:bg-emerald-100 text-slate-600 cursor-pointer"
                                title="Buka Kembali"
                              >
                                Buka Lagi
                              </button>
                            )}

                            <button
                              onClick={() => handleDeleteSurvey(survey.id)}
                              className="p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg cursor-pointer transition-colors"
                              title="Hapus Survei"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* 5C. ANALISIS SURVEI & GRAFIK HASIL DINAMIS (REAL DATA) */}
          {surveySubTab === 'analytics' && activeAnalyticsSurvey && (
            <div className="space-y-6">
              {/* Analytics Top Nav & Survey Selector */}
              <div className="p-5 rounded-2xl bg-white dark:bg-[#131b2e] border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSurveySubTab('all')}
                      className="text-xs font-bold text-emerald-600 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      ← Kembali ke Daftar Survei
                    </button>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    Dashboard Data & Analisis Hasil Survei
                  </h3>
                  <p className="text-xs text-slate-500">
                    Menampilkan data respons nyata yang terisolasi khusus untuk ID survei ini tanpa data dummy.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-500">Pilih Survei:</span>
                  <select
                    value={activeAnalyticsSurvey.id}
                    onChange={(e) => setSelectedAnalyticsSurveyId(e.target.value)}
                    className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 cursor-pointer"
                  >
                    {surveys.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.title} ({getEffectiveSurveyStatus(s)})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* OVERVIEW SURVEI (Section 19 Requirements) */}
              <div className="p-6 rounded-3xl bg-white dark:bg-[#131b2e] border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className="text-xs font-mono font-bold text-slate-400">
                        ID: {activeAnalyticsSurvey.id}
                      </span>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          getEffectiveSurveyStatus(activeAnalyticsSurvey) === 'published'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : getEffectiveSurveyStatus(activeAnalyticsSurvey) === 'scheduled'
                            ? 'bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300'
                            : getEffectiveSurveyStatus(activeAnalyticsSurvey) === 'expired'
                            ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                            : getEffectiveSurveyStatus(activeAnalyticsSurvey) === 'draft'
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                            : 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                        }`}
                      >
                        Status: {getEffectiveSurveyStatus(activeAnalyticsSurvey).toUpperCase()}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                        {activeAnalyticsSurvey.allowResubmission
                          ? 'Boleh Isi Ulang'
                          : 'Sekali Pengisian'}
                      </span>
                    </div>
                    <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                      {activeAnalyticsSurvey.title}
                    </h2>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      {activeAnalyticsSurvey.description || 'Tidak ada deskripsi tambahan.'}
                    </p>
                  </div>

                  <div className="text-left md:text-right text-xs text-slate-500 space-y-1 shrink-0">
                    <div>
                      <span className="font-semibold text-slate-700 dark:text-slate-300">
                        Waktu Mulai:
                      </span>{' '}
                      {activeAnalyticsSurvey.startDateTime || activeAnalyticsSurvey.startDate}
                    </div>
                    <div>
                      <span className="font-semibold text-slate-700 dark:text-slate-300">
                        Waktu Selesai:
                      </span>{' '}
                      {activeAnalyticsSurvey.endDateTime || activeAnalyticsSurvey.endDate}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Dibuat oleh: {activeAnalyticsSurvey.createdBy}
                    </div>
                  </div>
                </div>

                {/* Top KPI Cards Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs pt-1">
                  <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/60 space-y-1">
                    <div className="text-emerald-800 dark:text-emerald-300 font-semibold text-xs">
                      Responden Unik
                    </div>
                    <div className="text-2xl font-black text-emerald-950 dark:text-emerald-100">
                      {uniqueRespondentsCount}
                    </div>
                    <div className="text-[10px] text-emerald-700 dark:text-emerald-400">
                      Total sivitas kampus
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-sky-50/70 dark:bg-sky-950/40 border border-sky-200/80 dark:border-sky-800/60 space-y-1">
                    <div className="text-sky-800 dark:text-sky-300 font-semibold text-xs">
                      Total Respons
                    </div>
                    <div className="text-2xl font-black text-sky-950 dark:text-sky-100">
                      {surveyResponses.length}
                    </div>
                    <div className="text-[10px] text-sky-700 dark:text-sky-400">
                      Entri kuesioner masuk
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-purple-50/70 dark:bg-purple-950/40 border border-purple-200/80 dark:border-purple-800/60 space-y-1">
                    <div className="text-purple-800 dark:text-purple-300 font-semibold text-xs">
                      Partisipasi Kampus
                    </div>
                    <div className="text-2xl font-black text-purple-950 dark:text-purple-100">
                      {participationRate}%
                    </div>
                    <div className="text-[10px] text-purple-700 dark:text-purple-400">
                      Rasio sivitas aktif
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800/60 space-y-1">
                    <div className="text-amber-800 dark:text-amber-300 font-semibold text-xs">
                      Total Pertanyaan
                    </div>
                    <div className="text-2xl font-black text-amber-950 dark:text-amber-100">
                      {activeAnalyticsSurvey.questions.length} Butir
                    </div>
                    <div className="text-[10px] text-amber-700 dark:text-amber-400">
                      Instrumen riset
                    </div>
                  </div>
                </div>
              </div>

              {/* Filter Perbandingan Kelompok (Fakultas / Role / Angkatan) */}
              <div className="p-4 rounded-2xl bg-white dark:bg-[#131b2e] border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-emerald-500" />
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    Perbandingan Kelompok Data:
                  </span>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <div className="flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1">
                    <button
                      onClick={() => {
                        setAnalyticsGroupFilter('all');
                        setSelectedGroupValue('all');
                      }}
                      className={`px-3 py-1 rounded-lg font-bold text-xs transition-colors cursor-pointer ${
                        analyticsGroupFilter === 'all'
                          ? 'bg-emerald-600 text-white'
                          : 'text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      Semua
                    </button>
                    {availableFaculties.length > 0 && (
                      <button
                        onClick={() => {
                          setAnalyticsGroupFilter('faculty');
                          setSelectedGroupValue(availableFaculties[0] || 'all');
                        }}
                        className={`px-3 py-1 rounded-lg font-bold text-xs transition-colors cursor-pointer ${
                          analyticsGroupFilter === 'faculty'
                            ? 'bg-emerald-600 text-white'
                            : 'text-slate-600 dark:text-slate-300'
                        }`}
                      >
                        Per Fakultas
                      </button>
                    )}
                    {availableRoles.length > 0 && (
                      <button
                        onClick={() => {
                          setAnalyticsGroupFilter('role');
                          setSelectedGroupValue(availableRoles[0] || 'all');
                        }}
                        className={`px-3 py-1 rounded-lg font-bold text-xs transition-colors cursor-pointer ${
                          analyticsGroupFilter === 'role'
                            ? 'bg-emerald-600 text-white'
                            : 'text-slate-600 dark:text-slate-300'
                        }`}
                      >
                        Per Role
                      </button>
                    )}
                    {availableBatches.length > 0 && (
                      <button
                        onClick={() => {
                          setAnalyticsGroupFilter('batch');
                          setSelectedGroupValue(availableBatches[0] || 'all');
                        }}
                        className={`px-3 py-1 rounded-lg font-bold text-xs transition-colors cursor-pointer ${
                          analyticsGroupFilter === 'batch'
                            ? 'bg-emerald-600 text-white'
                            : 'text-slate-600 dark:text-slate-300'
                        }`}
                      >
                        Per Angkatan
                      </button>
                    )}
                  </div>

                  {analyticsGroupFilter === 'faculty' && (
                    <select
                      value={selectedGroupValue}
                      onChange={(e) => setSelectedGroupValue(e.target.value)}
                      className="px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold"
                    >
                      {availableFaculties.map((f) => (
                        <option key={f} value={f}>
                          {f}
                        </option>
                      ))}
                    </select>
                  )}

                  {analyticsGroupFilter === 'role' && (
                    <select
                      value={selectedGroupValue}
                      onChange={(e) => setSelectedGroupValue(e.target.value)}
                      className="px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold capitalize"
                    >
                      {availableRoles.map((r) => (
                        <option key={r} value={r}>
                          {r}
                        </option>
                      ))}
                    </select>
                  )}

                  {analyticsGroupFilter === 'batch' && (
                    <select
                      value={selectedGroupValue}
                      onChange={(e) => setSelectedGroupValue(e.target.value)}
                      className="px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold"
                    >
                      {availableBatches.map((b) => (
                        <option key={b} value={b}>
                          Angkatan {b}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              </div>

              {/* Dynamic Question Statistics & Charts */}
              <div className="space-y-6">
                {surveyResponses.length === 0 ? (
                  <div className="text-center py-12 rounded-2xl bg-white dark:bg-[#131b2e] border border-slate-200 dark:border-slate-800 text-xs text-slate-400">
                    Belum ada responden yang mengisi survei ini.
                  </div>
                ) : (
                  activeAnalyticsSurvey.questions.map((q, idx) => {
                    const stats = getQuestionStats(q);

                    return (
                      <div
                        key={q.id}
                        className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#131b2e] border border-slate-200 dark:border-slate-800 shadow-xs space-y-4"
                      >
                        <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                          <div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                              Pertanyaan #{idx + 1} • Tipe: {q.type.replace('_', ' ')}
                            </span>
                            <h4 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white mt-0.5">
                              {q.question}
                            </h4>
                          </div>
                          <span className="px-2.5 py-1 rounded-full font-bold text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 shrink-0">
                            {stats.totalAnswers} Jawaban
                          </span>
                        </div>

                        {/* Chart / Distribution for Single & Multiple Choice */}
                        {(q.type === 'single_choice' || q.type === 'multiple_choice') &&
                          stats.distribution && (
                            <div className="space-y-3">
                              {Object.entries(stats.distribution).map(([opt, count]) => {
                                const total = Math.max(stats.totalAnswers, 1);
                                const pct = Math.round((Number(count) / total) * 100);

                                return (
                                  <div key={opt} className="space-y-1">
                                    <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-200">
                                      <span>{opt}</span>
                                      <span>
                                        {count} suara ({pct}%)
                                      </span>
                                    </div>
                                    <div className="w-full h-3 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                                      <div
                                        className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                                        style={{ width: `${pct}%` }}
                                      />
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          )}

                        {/* Chart for Likert 1-5 */}
                        {q.type === 'likert' && stats.distribution && (
                          <div className="space-y-4">
                            <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 flex items-center justify-between">
                              <span className="text-xs font-bold text-emerald-900 dark:text-emerald-200">
                                Rata-Rata Skor Kepuasan / Usabilitas:
                              </span>
                              <span className="text-xl font-black text-emerald-700 dark:text-emerald-300">
                                {stats.averageScore} / 5.00
                              </span>
                            </div>

                            <div className="space-y-2">
                              {[5, 4, 3, 2, 1].map((scaleVal) => {
                                const count = (stats.distribution as Record<number, number>)[scaleVal] || 0;
                                const total = Math.max(stats.totalAnswers, 1);
                                const pct = Math.round((count / total) * 100);

                                return (
                                  <div key={scaleVal} className="space-y-1">
                                    <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-200">
                                      <span>
                                        Skor {scaleVal}{' '}
                                        {scaleVal === 5
                                          ? `(${q.scaleLabels?.max || 'Sangat Setuju'})`
                                          : scaleVal === 1
                                          ? `(${q.scaleLabels?.min || 'Sangat Tidak Setuju'})`
                                          : ''}
                                      </span>
                                      <span>
                                        {count} suara ({pct}%)
                                      </span>
                                    </div>
                                    <div className="w-full h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                                      <div
                                        className={`h-full rounded-full transition-all duration-500 ${
                                          scaleVal >= 4
                                            ? 'bg-emerald-500'
                                            : scaleVal === 3
                                            ? 'bg-amber-500'
                                            : 'bg-rose-500'
                                        }`}
                                        style={{ width: `${pct}%` }}
                                      />
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {/* Chart for Yes / No */}
                        {q.type === 'yes_no' && stats.distribution && (
                          <div className="grid grid-cols-2 gap-3 max-w-md">
                            {['Ya', 'Tidak'].map((val) => {
                              const count = (stats.distribution as any)[val] || 0;
                              const total = Math.max(stats.totalAnswers, 1);
                              const pct = Math.round((count / total) * 100);

                              return (
                                <div
                                  key={val}
                                  className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-center space-y-1"
                                >
                                  <div className="text-xs font-bold text-slate-500">{val}</div>
                                  <div className="text-xl font-black text-slate-900 dark:text-white">
                                    {count} ({pct}%)
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}

                        {/* Number Stat Summary */}
                        {q.type === 'number' && (
                          <div className="grid grid-cols-3 gap-3 max-w-lg text-center text-xs">
                            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                              <div className="text-slate-500 text-[11px]">Rata-Rata</div>
                              <div className="text-lg font-black text-emerald-600">
                                {stats.average}
                              </div>
                            </div>
                            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                              <div className="text-slate-500 text-[11px]">Minimum</div>
                              <div className="text-lg font-black text-slate-700 dark:text-slate-200">
                                {stats.min}
                              </div>
                            </div>
                            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                              <div className="text-slate-500 text-[11px]">Maksimum</div>
                              <div className="text-lg font-black text-slate-700 dark:text-slate-200">
                                {stats.max}
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Structured Text Answers List */}
                        {(q.type === 'short_text' || q.type === 'long_text') &&
                          stats.textAnswers && (
                            <div className="space-y-2">
                              {stats.textAnswers.length === 0 ? (
                                <div className="text-xs text-slate-400 italic py-2">
                                  Belum ada tanggapan teks.
                                </div>
                              ) : (
                                stats.textAnswers.map((item: any, tIdx: number) => (
                                  <div
                                    key={tIdx}
                                    className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 text-xs space-y-1"
                                  >
                                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                                      <span className="font-bold text-slate-700 dark:text-slate-300">
                                        {item.userName} ({item.userFaculty})
                                      </span>
                                      <span>{item.submittedAt.split('T')[0]}</span>
                                    </div>
                                    <p className="text-slate-800 dark:text-slate-200 leading-relaxed">
                                      "{item.text}"
                                    </p>
                                  </div>
                                ))
                              )}
                            </div>
                          )}
                      </div>
                    );
                  })
                )}
              </div>

              {/* DATA RESPONDEN (Section 20 Requirements) */}
              <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-base">
                      Data Responden ({filteredResponses.length})
                    </h3>
                    <p className="text-xs text-slate-500">
                      Daftar seluruh sivitas akademika yang telah mengisi survei ini beserta identitas akun.
                    </p>
                  </div>
                </div>

                <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131b2e] shadow-xs">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 font-extrabold uppercase text-[10px] border-b border-slate-200 dark:border-slate-800">
                      <tr>
                        <th className="p-3.5 w-12 text-center">No</th>
                        <th className="p-3.5">Nama & Identitas</th>
                        <th className="p-3.5">Role</th>
                        <th className="p-3.5">Fakultas & Program Studi</th>
                        <th className="p-3.5">Angkatan</th>
                        <th className="p-3.5">Waktu Pengisian</th>
                        <th className="p-3.5 text-right">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                      {filteredResponses.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="p-8 text-center text-slate-400 text-xs">
                            Belum ada responden untuk survei ini.
                          </td>
                        </tr>
                      ) : (
                        filteredResponses.map((r, idx) => (
                          <tr key={r.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30">
                            <td className="p-3.5 text-center font-mono text-slate-400 font-bold">
                              {idx + 1}
                            </td>
                            <td className="p-3.5">
                              <div className="font-bold text-slate-900 dark:text-white">
                                {r.userName}
                              </div>
                              <div className="text-[10px] text-slate-400 font-mono">
                                ID: {r.userId}
                              </div>
                            </td>
                            <td className="p-3.5">
                              <span className="px-2 py-0.5 rounded-full font-bold text-[10px] uppercase bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                                {r.userRole || 'Mahasiswa'}
                              </span>
                            </td>
                            <td className="p-3.5 text-slate-700 dark:text-slate-300">
                              <div>{r.userFaculty || '-'}</div>
                              <div className="text-[10px] text-slate-400">
                                {r.userMajor || '-'}
                              </div>
                            </td>
                            <td className="p-3.5 font-mono text-slate-600 dark:text-slate-300">
                              {r.userBatch || '-'}
                            </td>
                            <td className="p-3.5 text-slate-600 dark:text-slate-300 font-mono text-[11px]">
                              {r.submittedAt ? r.submittedAt.replace('T', ' ').slice(0, 19) : '-'}
                            </td>
                            <td className="p-3.5 text-right">
                              <button
                                onClick={() => setViewingResponseDetail(r)}
                                className="px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100 text-emerald-700 dark:text-emerald-300 font-bold text-xs cursor-pointer transition-colors"
                              >
                                Lihat Jawaban
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* DETAIL JAWABAN PER RESPONDEN (MATRIKS) (Section 23 Requirements) */}
              <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-base">
                      Matriks Detail Jawaban Seluruh Responden
                    </h3>
                    <p className="text-xs text-slate-500">
                      Tabel matriks ringkasan jawaban setiap responden untuk setiap butir pertanyaan survei ini.
                    </p>
                  </div>
                </div>

                <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131b2e] shadow-xs">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 font-extrabold uppercase text-[10px] border-b border-slate-200 dark:border-slate-800">
                      <tr>
                        <th className="p-3.5 w-12 text-center">No</th>
                        <th className="p-3.5 min-w-[140px]">Responden</th>
                        <th className="p-3.5 min-w-[120px]">Fakultas</th>
                        {activeAnalyticsSurvey.questions.map((q, qIdx) => (
                          <th key={q.id} className="p-3.5 min-w-[180px]" title={q.question}>
                            P{qIdx + 1}: {q.question.slice(0, 30)}
                            {q.question.length > 30 ? '...' : ''}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                      {filteredResponses.length === 0 ? (
                        <tr>
                          <td
                            colSpan={3 + activeAnalyticsSurvey.questions.length}
                            className="p-8 text-center text-slate-400 text-xs"
                          >
                            Belum ada entri jawaban yang dapat ditampilkan pada matriks.
                          </td>
                        </tr>
                      ) : (
                        filteredResponses.map((r, rIdx) => (
                          <tr key={r.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30">
                            <td className="p-3.5 text-center font-mono text-slate-400 font-bold">
                              {rIdx + 1}
                            </td>
                            <td className="p-3.5 font-bold text-slate-900 dark:text-white">
                              {r.userName}
                            </td>
                            <td className="p-3.5 text-slate-600 dark:text-slate-400">
                              {r.userFaculty || '-'}
                            </td>
                            {activeAnalyticsSurvey.questions.map((q) => {
                              const ansObj = r.answers.find((a) => a.questionId === q.id);
                              let displayVal = '-';
                              if (ansObj) {
                                if (Array.isArray(ansObj.value)) {
                                  displayVal = ansObj.value.join(', ');
                                } else if (typeof ansObj.value === 'boolean') {
                                  displayVal = ansObj.value ? 'Ya' : 'Tidak';
                                } else if (ansObj.value !== undefined && ansObj.value !== null) {
                                  displayVal = String(ansObj.value);
                                }
                              }
                              return (
                                <td key={q.id} className="p-3.5 text-slate-700 dark:text-slate-300">
                                  <span className="line-clamp-2" title={displayVal}>
                                    {displayVal}
                                  </span>
                                </td>
                              );
                            })}
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* MODAL: DETAIL JAWABAN RESPONDEN */}
          {viewingResponseDetail && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
              <div className="w-full max-w-2xl bg-white dark:bg-[#131b2e] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                {/* Modal Header */}
                <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                        {viewingResponseDetail.userRole || 'Mahasiswa'}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">
                        {viewingResponseDetail.submittedAt ? viewingResponseDetail.submittedAt.replace('T', ' ').slice(0, 19) : '-'}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-1">
                      {viewingResponseDetail.userName}
                    </h3>
                    <p className="text-xs text-slate-500">
                      {viewingResponseDetail.userFaculty || '-'} • {viewingResponseDetail.userMajor || '-'} • Angkatan {viewingResponseDetail.userBatch || '-'}
                    </p>
                  </div>
                  <button
                    onClick={() => setViewingResponseDetail(null)}
                    className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                  >
                    ✕
                  </button>
                </div>

                {/* Modal Body */}
                <div className="p-6 overflow-y-auto space-y-4 text-xs">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Survei: {activeAnalyticsSurvey?.title}
                  </div>

                  <div className="space-y-4">
                    {activeAnalyticsSurvey?.questions.map((q, qIdx) => {
                      const ansObj = viewingResponseDetail.answers.find((a) => a.questionId === q.id);
                      let formattedAns = '-';
                      if (ansObj) {
                        if (Array.isArray(ansObj.value)) {
                          formattedAns = ansObj.value.join(', ');
                        } else if (typeof ansObj.value === 'boolean') {
                          formattedAns = ansObj.value ? 'Ya' : 'Tidak';
                        } else if (ansObj.value !== undefined && ansObj.value !== null) {
                          formattedAns = String(ansObj.value);
                        }
                      }

                      return (
                        <div
                          key={q.id}
                          className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-1.5"
                        >
                          <div className="text-[10px] font-bold text-slate-400 uppercase">
                            Pertanyaan #{qIdx + 1} ({q.type.replace('_', ' ')})
                          </div>
                          <div className="font-bold text-slate-900 dark:text-white text-xs">
                            {q.question}
                          </div>
                          <div className="pt-1 text-emerald-700 dark:text-emerald-300 font-medium">
                            <span className="text-slate-400 text-[11px]">Jawaban: </span>
                            {formattedAns}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                  <button
                    onClick={() => setViewingResponseDetail(null)}
                    className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-bold text-xs cursor-pointer"
                  >
                    Tutup
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. REGISTERED USERS MANAGEMENT SECTION                                    */}
      {/* ========================================================================= */}
      {adminSection === 'users' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 dark:text-white text-base">
              Daftar Sivitas Kampus & Hak Akses
            </h3>
            <span className="text-xs text-slate-400">Total Akun Terdata di Sistem</span>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131b2e] shadow-xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 font-extrabold uppercase text-[10px] border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="p-3.5">Nama & Email</th>
                  <th className="p-3.5">Fakultas / Unit</th>
                  <th className="p-3.5">Role Aktif</th>
                  <th className="p-3.5">Eco-Points</th>
                  <th className="p-3.5">Level</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {AUTHORIZED_ACCOUNTS.map((acc, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30">
                    <td className="p-3.5">
                      <div className="font-bold text-slate-900 dark:text-white">
                        {acc.profile.name}
                      </div>
                      <div className="text-[11px] text-slate-500 font-mono">{acc.email}</div>
                    </td>
                    <td className="p-3.5 text-slate-700 dark:text-slate-300">
                      {acc.profile.faculty}
                    </td>
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 rounded-full font-bold text-[10px] uppercase bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                        {acc.profile.role}
                      </span>
                    </td>
                    <td className="p-3.5 font-mono font-bold text-emerald-600">
                      {acc.profile.ecoPoints} pts
                    </td>
                    <td className="p-3.5 font-bold">Lvl {acc.profile.level}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
