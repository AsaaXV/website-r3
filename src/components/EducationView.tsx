import React, { useState } from 'react';
import {
  BookOpen,
  Sparkles,
  Camera,
  CheckCircle2,
  HelpCircle,
  Clock,
  User,
  ArrowRight,
  AlertCircle,
  FileText,
  Lightbulb,
  ChevronRight,
  Check,
  X,
  RefreshCw,
  AlertTriangle,
  Award,
  Timer,
  Info,
  ExternalLink,
  Layers,
  Leaf,
  ShieldCheck,
  Search,
  Users
} from 'lucide-react';
import { EDUCATION_ARTICLES, WASTE_CATEGORIES } from '../data/mockData';
import {
  SORTING_QUIZ_QUESTIONS,
  ECO_MYTHS,
  DEGRADATION_TIMELINE,
  ECO_GLOSSARY,
  QuizQuestion,
  EcoMyth,
  DegradationItem,
  GlossaryItem
} from '../data/educationData';
import { EducationArticle, WasteCategoryType } from '../types';

interface EducationViewProps {
  onOpenScanner?: () => void;
  onNavigateToScanner?: () => void;
  onNavigateToDeposit?: () => void;
  onNavigateToMap?: () => void;
  onNavigateToMarketplace?: () => void;
}

type EduSubTab = 'taxonomy' | 'quiz' | 'myths' | 'timeline' | 'articles' | 'glossary';

export const EducationView: React.FC<EducationViewProps> = ({
  onOpenScanner,
  onNavigateToScanner,
  onNavigateToDeposit,
  onNavigateToMap,
  onNavigateToMarketplace,
}) => {
  const handleOpenScanner = () => {
    if (onOpenScanner) onOpenScanner();
    else if (onNavigateToScanner) onNavigateToScanner();
  };
  // Main Sub-Tab State (Defaults to Taxonomy/Panduan Pilah)
  const [activeSubTab, setActiveSubTab] = useState<EduSubTab>('taxonomy');

  // Taxonomy Category State
  const [activeSortingGuide, setActiveSortingGuide] = useState<WasteCategoryType>('plastik');

  // Articles State
  const [selectedArticleCategory, setSelectedArticleCategory] = useState<string>('all');
  const [selectedArticle, setSelectedArticle] = useState<EducationArticle | null>(null);

  // Quiz State
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(null);
  const [hasAnsweredCurrent, setHasAnsweredCurrent] = useState<boolean>(false);
  const [quizScore, setQuizScore] = useState<number>(0);
  const [completedQuiz, setCompletedQuiz] = useState<boolean>(false);
  const [answeredHistory, setAnsweredHistory] = useState<{ [qIndex: number]: { selected: number; isCorrect: boolean } }>({});

  // Degradation Filter State
  const [selectedDegradationFilter, setSelectedDegradationFilter] = useState<string>('all');

  // Glossary Search
  const [glossarySearch, setGlossarySearch] = useState<string>('');

  // Article Categories
  const articleCategories = [
    { id: 'all', label: 'Semua Artikel' },
    { id: 'Panduan Pemilahan', label: 'Panduan Pemilahan' },
    { id: 'Kabar Kampus', label: 'Kabar Kampus' },
    { id: 'Riset & Inovasi', label: 'Riset & Inovasi' },
    { id: 'Tips Kosan', label: 'Tips Kosan' },
  ];

  const filteredArticles = EDUCATION_ARTICLES.filter((art) => {
    if (selectedArticleCategory === 'all') return true;
    return art.category === selectedArticleCategory;
  });

  const currentCategoryData =
    WASTE_CATEGORIES.find((c) => c.id === activeSortingGuide) || WASTE_CATEGORIES[2];

  // Current Quiz Question
  const activeQuizQuestion = SORTING_QUIZ_QUESTIONS[currentQuestionIndex];

  const handleSelectQuizOption = (optIndex: number) => {
    if (hasAnsweredCurrent) return;
    setSelectedOptionIndex(optIndex);
    setHasAnsweredCurrent(true);

    const isCorrect = activeQuizQuestion.options[optIndex].isCorrect;
    if (isCorrect) {
      setQuizScore((prev) => prev + 1);
    }

    setAnsweredHistory((prev) => ({
      ...prev,
      [currentQuestionIndex]: { selected: optIndex, isCorrect },
    }));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < SORTING_QUIZ_QUESTIONS.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      const nextHistory = answeredHistory[currentQuestionIndex + 1];
      if (nextHistory) {
        setSelectedOptionIndex(nextHistory.selected);
        setHasAnsweredCurrent(true);
      } else {
        setSelectedOptionIndex(null);
        setHasAnsweredCurrent(false);
      }
    } else {
      setCompletedQuiz(true);
    }
  };

  const handleRestartQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedOptionIndex(null);
    setHasAnsweredCurrent(false);
    setQuizScore(0);
    setCompletedQuiz(false);
    setAnsweredHistory({});
  };

  const filteredGlossary = ECO_GLOSSARY.filter(
    (item) =>
      item.term.toLowerCase().includes(glossarySearch.toLowerCase()) ||
      item.definition.toLowerCase().includes(glossarySearch.toLowerCase()) ||
      item.campusExample.toLowerCase().includes(glossarySearch.toLowerCase())
  );

  const filteredDegradation = DEGRADATION_TIMELINE.filter((item) => {
    if (selectedDegradationFilter === 'all') return true;
    return item.category === selectedDegradationFilter;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner - Primary Focus: Educational Literacy */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white p-6 sm:p-7 rounded-2xl border border-emerald-800/40 shadow-xl relative overflow-hidden">
        <div className="absolute -right-8 -bottom-8 w-64 h-64 rounded-full bg-emerald-500/10 blur-2xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-2 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-200 text-xs font-semibold">
              <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
              <span>Pusat Edukasi & Literasi Pengelolaan Sampah Kampus</span>
            </div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight">
              Belajar Memilah, Memahami Dampak, dan Mencegah Sampah
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
              Platform ini dirancang khusus untuk membangun pengetahuan praktis mahasiswa: mulai dari cara membedakan polimer plastik, kuis interaktif pilah cerdas, membongkar mitos daur ulang, hingga tips zero waste anak kos.
            </p>
          </div>

          {/* Quick AI Scanner Assist */}
          <div className="shrink-0 flex flex-col sm:flex-row md:flex-col gap-2.5">
            <button
              onClick={handleOpenScanner}
              id="btn-edu-scan-ai"
              className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all active:scale-95 cursor-pointer"
            >
              <Camera className="w-4 h-4" />
              <span>Kenali Material dengan AI</span>
            </button>
            <div className="text-[11px] text-emerald-200/80 text-center font-medium">
              Deteksi jenis sampah via kamera ponsel
            </div>
          </div>
        </div>
      </div>

      {/* Sub-Navigation Tabs: 6 Educational Modules */}
      <div className="bg-white p-1.5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-1 overflow-x-auto">
        <button
          onClick={() => setActiveSubTab('taxonomy')}
          id="edu-tab-taxonomy"
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeSubTab === 'taxonomy'
              ? 'bg-emerald-600 text-white shadow-2xs'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>1. Panduan Pilah & Taksonomi</span>
        </button>

        <button
          onClick={() => setActiveSubTab('quiz')}
          id="edu-tab-quiz"
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeSubTab === 'quiz'
              ? 'bg-emerald-600 text-white shadow-2xs'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <HelpCircle className="w-3.5 h-3.5 text-amber-500" />
          <span>2. Latihan Pilah Cerdas (Kuis)</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-100 text-amber-900 font-extrabold">
            Interaktif
          </span>
        </button>

        <button
          onClick={() => setActiveSubTab('myths')}
          id="edu-tab-myths"
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeSubTab === 'myths'
              ? 'bg-emerald-600 text-white shadow-2xs'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <Lightbulb className="w-3.5 h-3.5 text-yellow-500" />
          <span>3. Mitos vs Fakta Daur Ulang</span>
        </button>

        <button
          onClick={() => setActiveSubTab('timeline')}
          id="edu-tab-timeline"
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeSubTab === 'timeline'
              ? 'bg-emerald-600 text-white shadow-2xs'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <Timer className="w-3.5 h-3.5 text-rose-500" />
          <span>4. Garis Waktu Masa Urai</span>
        </button>

        <button
          onClick={() => setActiveSubTab('articles')}
          id="edu-tab-articles"
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeSubTab === 'articles'
              ? 'bg-emerald-600 text-white shadow-2xs'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <FileText className="w-3.5 h-3.5 text-blue-500" />
          <span>5. Artikel & Riset Kampus</span>
        </button>

        <button
          onClick={() => setActiveSubTab('glossary')}
          id="edu-tab-glossary"
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeSubTab === 'glossary'
              ? 'bg-emerald-600 text-white shadow-2xs'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5 text-purple-500" />
          <span>6. Kamus Istilah 3R</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* 1. PANDUAN PILAH & TAKSONOMI MATERIAL */}
      {/* ========================================================================= */}
      {activeSubTab === 'taxonomy' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 sm:p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <span className="text-[11px] font-black text-emerald-700 uppercase tracking-wider">
                  Panduan Visual Praktis
                </span>
                <h2 className="text-base sm:text-lg font-black text-slate-900">
                  Standar Pemilahan 4 Kategori Sampah Kampus
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Kenali warna wadah, jenis polimer, dan tata cara higienis sebelum disetor ke Bank Sampah atau drop box.
                </p>
              </div>

              {/* Action Button */}
              <button
                onClick={() => setActiveSubTab('quiz')}
                className="px-3.5 py-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 font-bold text-xs flex items-center gap-1.5 hover:bg-amber-100 transition-colors shrink-0 cursor-pointer"
              >
                <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
                <span>Uji Pengetahuan di Kuis</span>
              </button>
            </div>

            {/* 4 Category Selector Tabs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {WASTE_CATEGORIES.map((cat) => {
                const isActive = activeSortingGuide === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveSortingGuide(cat.id)}
                    className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                      isActive
                        ? 'ring-2 ring-emerald-500 bg-emerald-50/60 border-emerald-400 shadow-xs'
                        : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      <span
                        className="w-3.5 h-3.5 rounded-full shrink-0 shadow-2xs"
                        style={{ backgroundColor: cat.binColor }}
                      ></span>
                      <span className="font-bold text-xs text-slate-900 truncate">
                        {cat.name}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 font-medium">
                      {cat.percentageVolume} total timbulan
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Detailed Guide Card for Selected Category */}
            <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/80 grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
              <div className="md:col-span-8 space-y-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className="px-3 py-1 rounded-md text-xs font-bold text-white shadow-2xs"
                    style={{ backgroundColor: currentCategoryData.binColor }}
                  >
                    Wadah: {currentCategoryData.binColorName}
                  </span>
                  <span className="text-xs font-bold text-slate-700 bg-white px-2.5 py-1 rounded-md border border-slate-200">
                    Nilai Tabungan: +{currentCategoryData.pointsPerKg} Eco-Points / kg
                  </span>
                </div>

                <div>
                  <h3 className="text-base sm:text-lg font-black text-slate-900">
                    {currentCategoryData.name}
                  </h3>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    {currentCategoryData.description}
                  </p>
                </div>

                {/* Subtypes Chips */}
                <div>
                  <div className="text-xs font-bold text-slate-800 mb-1.5">
                    Contoh Barang yang Termasuk:
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {currentCategoryData.subtypes.map((st) => (
                      <span
                        key={st}
                        className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-800 text-xs font-semibold shadow-2xs"
                      >
                        ✓ {st}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Handling Steps Card */}
                <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-2">
                  <div className="font-bold text-xs text-slate-900 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Langkah Penanganan Higienis (Standar TPST):</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {currentCategoryData.handlingAction}
                  </p>
                  <div className="grid grid-cols-3 gap-2 pt-2 text-[11px] text-slate-500 font-medium">
                    <div className="p-2 bg-slate-50 rounded-lg text-center border border-slate-100">
                      1. Kosongkan Sisa
                    </div>
                    <div className="p-2 bg-slate-50 rounded-lg text-center border border-slate-100">
                      2. Bilas & Keringkan
                    </div>
                    <div className="p-2 bg-slate-50 rounded-lg text-center border border-slate-100">
                      3. Pipihkan / Rapikan
                    </div>
                  </div>
                </div>
              </div>

              {/* Environmental Impact Side Panel */}
              <div className="md:col-span-4 bg-white p-5 rounded-xl border border-slate-200 space-y-4 shadow-xs">
                <div className="text-xs font-bold text-slate-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                  <Leaf className="w-4 h-4 text-emerald-600" />
                  <span>Dampak Nyata Setiap 1 Kg:</span>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="p-2.5 rounded-lg bg-emerald-50/60 border border-emerald-100 flex items-center justify-between">
                    <span className="text-emerald-900 font-medium">Mencegah Emisi Karbon</span>
                    <span className="font-extrabold text-emerald-800">
                      {currentCategoryData.co2SavedPerKg} kg CO₂e
                    </span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-blue-50/60 border border-blue-100 flex items-center justify-between">
                    <span className="text-blue-900 font-medium">Menghemat Air Bersih</span>
                    <span className="font-extrabold text-blue-800">
                      {currentCategoryData.waterSavedPerKg} Liter
                    </span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-amber-50/60 border border-amber-100 flex items-center justify-between">
                    <span className="text-amber-900 font-medium">Poin Reward Mahasiswa</span>
                    <span className="font-extrabold text-amber-800">
                      +{currentCategoryData.pointsPerKg} Pts
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 space-y-2">
                  <button
                    onClick={handleOpenScanner}
                    className="w-full py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Scan Material Ini via Kamera AI</span>
                  </button>
                  {onNavigateToMarketplace && (
                    <button
                      onClick={onNavigateToMarketplace}
                      className="w-full py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Users className="w-3.5 h-3.5 text-teal-600" />
                      <span>Cari / Tawarkan di Bursa Reuse</span>
                    </button>
                  )}
                  <p className="text-[11px] text-slate-400 text-center">
                    Gunakan AI untuk identifikasi atau pakai ulang bersama sivitas kampus
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. LATIHAN PILAH CERDAS (INTERACTIVE QUIZ / SIMULATOR) */}
      {/* ========================================================================= */}
      {activeSubTab === 'quiz' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 sm:p-7 space-y-6">
            {/* Quiz Header & Progress */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
                    Kuis Edukasi Praktis
                  </span>
                  <span className="text-xs text-slate-500">
                    Studi Kasus Sampah Kampus Nyata
                  </span>
                </div>
                <h2 className="text-base sm:text-lg font-black text-slate-900 mt-1">
                  Latihan Pilah Cerdas: Barang Ini Masuk Tong Mana?
                </h2>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1.5 rounded-xl">
                  Soal {currentQuestionIndex + 1} dari {SORTING_QUIZ_QUESTIONS.length}
                </div>
                <div className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1.5 rounded-xl">
                  Skor Benar: {quizScore}
                </div>
                <button
                  onClick={handleRestartQuiz}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                  title="Mulai Ulang Kuis"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Question Display */}
            {!completedQuiz ? (
              <div className="space-y-6">
                {/* Visual Card with Image & Case Description */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="md:col-span-4 h-44 sm:h-48 w-full rounded-xl overflow-hidden bg-slate-200 border border-slate-200 relative">
                    <img
                      src={activeQuizQuestion.itemImage}
                      alt={activeQuizQuestion.itemTitle}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 left-2 bg-slate-950/80 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                      Studi Kasus #{currentQuestionIndex + 1}
                    </div>
                  </div>

                  <div className="md:col-span-8 space-y-2">
                    <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider">
                      Pertanyaan Pemilahan
                    </span>
                    <h3 className="text-base sm:text-xl font-black text-slate-900">
                      {activeQuizQuestion.itemTitle}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {activeQuizQuestion.itemDescription}
                    </p>
                    <div className="text-xs text-blue-800 bg-blue-50 border border-blue-200 p-2.5 rounded-lg flex items-center gap-2">
                      <Lightbulb className="w-4 h-4 text-blue-600 shrink-0" />
                      <span><strong>Petunjuk Edukasi:</strong> {activeQuizQuestion.hint}</span>
                    </div>
                  </div>
                </div>

                {/* Multiple Choice Options */}
                <div className="space-y-2.5">
                  <div className="text-xs font-bold text-slate-700">
                    Pilih Tindakan & Tong Sampah yang Tepat:
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {activeQuizQuestion.options.map((option, idx) => {
                      const isSelected = selectedOptionIndex === idx;
                      let optionBg = 'bg-white hover:bg-slate-50 border-slate-200';

                      if (hasAnsweredCurrent) {
                        if (option.isCorrect) {
                          optionBg = 'bg-emerald-50 border-emerald-400 text-emerald-950 ring-2 ring-emerald-500 font-bold';
                        } else if (isSelected && !option.isCorrect) {
                          optionBg = 'bg-rose-50 border-rose-400 text-rose-950 ring-2 ring-rose-500 font-bold';
                        } else {
                          optionBg = 'bg-slate-50 border-slate-200 text-slate-400 opacity-60';
                        }
                      }

                      return (
                        <button
                          key={idx}
                          onClick={() => handleSelectQuizOption(idx)}
                          disabled={hasAnsweredCurrent}
                          className={`p-4 rounded-xl border text-left text-xs transition-all flex items-start gap-3 cursor-pointer ${optionBg}`}
                        >
                          <div className="w-6 h-6 rounded-full shrink-0 flex items-center justify-center font-bold text-xs bg-slate-100 border border-slate-300">
                            {hasAnsweredCurrent ? (
                              option.isCorrect ? (
                                <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />
                              ) : isSelected ? (
                                <X className="w-3.5 h-3.5 text-rose-600 stroke-[3]" />
                              ) : (
                                String.fromCharCode(65 + idx)
                              )
                            ) : (
                              String.fromCharCode(65 + idx)
                            )}
                          </div>
                          <div className="space-y-1">
                            <div className="font-semibold text-slate-900 leading-snug">
                              {option.label}
                            </div>
                            <div className="text-[11px] text-slate-500 font-normal">
                              Tujuan: {option.binName}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Immediate Educational Feedback Explanation */}
                {hasAnsweredCurrent && (
                  <div className="p-4 sm:p-5 rounded-xl border bg-slate-900 text-white space-y-3 animate-fadeIn">
                    <div className="flex items-center gap-2">
                      {selectedOptionIndex !== null && activeQuizQuestion.options[selectedOptionIndex].isCorrect ? (
                        <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-xs">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Tepat Sekali! Anda memahami prinsip pemilahan.</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 text-rose-400 font-bold text-xs">
                          <AlertCircle className="w-4 h-4" />
                          <span>Kurang Tepat, mari pelajari alasannya:</span>
                        </div>
                      )}
                    </div>

                    <div className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                      <strong>Penjelasan Ilmiah:</strong> {activeQuizQuestion.explanation}
                    </div>

                    <div className="pt-2 border-t border-slate-800 text-xs text-amber-300 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                      <span><strong>Tips Kampus:</strong> {activeQuizQuestion.practicalTip}</span>
                    </div>

                    <div className="pt-2 flex justify-end">
                      <button
                        onClick={handleNextQuestion}
                        className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <span>
                          {currentQuestionIndex < SORTING_QUIZ_QUESTIONS.length - 1
                            ? 'Lanjut ke Soal Berikutnya'
                            : 'Lihat Hasil Kuis'}
                        </span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Quiz Completion Summary */
              <div className="p-6 sm:p-8 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-4">
                <div className="w-14 h-14 rounded-full bg-emerald-600 text-white mx-auto flex items-center justify-center shadow-md">
                  <Award className="w-7 h-7" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-xl font-black text-slate-900">
                    Latihan Kuis Selesai!
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
                    Skor Pemahaman Pemilahan Anda: <strong className="text-emerald-700 text-base">{quizScore}</strong> dari {SORTING_QUIZ_QUESTIONS.length} Soal Benar ({Math.round((quizScore / SORTING_QUIZ_QUESTIONS.length) * 100)}%).
                  </p>
                </div>

                <div className="max-w-md mx-auto text-xs text-slate-600 bg-white p-4 rounded-xl border border-emerald-100 text-left space-y-2">
                  <div className="font-bold text-slate-800">
                    Rangkuman Edukasi Kunci:
                  </div>
                  <ul className="list-disc pl-4 space-y-1 text-[11px] text-slate-600">
                    <li>Gelas & botol plastik wajib dibilas singkat agar tidak membusuk.</li>
                    <li>Kardus berminyak tidak dapat didaur ulang menjadi bubur kertas.</li>
                    <li>Struk kasir mengandung lapisan kimia BPA dan masuk ke tong residu.</li>
                    <li>Baterai bekas wajib masuk ke tong merah B3 demi mencegah racun logam berat.</li>
                  </ul>
                </div>

                <div className="flex flex-wrap justify-center gap-3 pt-2">
                  <button
                    onClick={handleRestartQuiz}
                    className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-800 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Ulangi Latihan Kuis</span>
                  </button>
                  <button
                    onClick={() => setActiveSubTab('myths')}
                    className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span>Lanjut ke Mitos vs Fakta</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. MITOS VS FAKTA DAUR ULANG (MYTHBUSTERS) */}
      {/* ========================================================================= */}
      {activeSubTab === 'myths' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 sm:p-6 space-y-6">
            <div>
              <span className="text-[11px] font-black text-yellow-700 uppercase tracking-wider">
                Eco Mythbusters Kampus
              </span>
              <h2 className="text-base sm:text-lg font-black text-slate-900">
                Mitos vs Fakta Seputar Pengelolaan Sampah
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Banyak kebiasaan sehari-hari yang kita kira ramah lingkungan ternyata justru mencemari alam. Mari bedah fakta ilmiahnya!
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
              {ECO_MYTHS.map((item) => (
                <div
                  key={item.id}
                  className="p-5 rounded-2xl border border-slate-200 bg-slate-50 hover:border-slate-300 transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-200 text-slate-700">
                        {item.category}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800">
                        Tingkat Miskonsepsi: {item.impactLevel}
                      </span>
                    </div>

                    {/* Myth Section */}
                    <div className="p-3 bg-rose-50/70 rounded-xl border border-rose-200 space-y-1">
                      <div className="text-[11px] font-extrabold text-rose-700 flex items-center gap-1.5 uppercase">
                        <X className="w-3.5 h-3.5 stroke-[3]" />
                        <span>Mitos Populer:</span>
                      </div>
                      <p className="text-xs font-semibold text-rose-950 italic">
                        "{item.myth}"
                      </p>
                    </div>

                    {/* Fact Section */}
                    <div className="p-3 bg-emerald-50/70 rounded-xl border border-emerald-200 space-y-1">
                      <div className="text-[11px] font-extrabold text-emerald-800 flex items-center gap-1.5 uppercase">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                        <span>Fakta Ilmiah Sebenarnya:</span>
                      </div>
                      <p className="text-xs font-semibold text-emerald-950">
                        {item.fact}
                      </p>
                    </div>

                    {/* Detailed Explanation */}
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {item.explanation}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. GARIS WAKTU MASA URAI SAMPAH (DEGRADATION TIMELINE) */}
      {/* ========================================================================= */}
      {activeSubTab === 'timeline' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 sm:p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[11px] font-black text-rose-700 uppercase tracking-wider">
                  Infografis Garis Waktu
                </span>
                <h2 className="text-base sm:text-lg font-black text-slate-900">
                  Berapa Lama Sampah Bertahan di Alam Terbuka?
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Memahami waktu penguraian membantu kita menyadari pentingnya menolak (Refuse) plastik sekali pakai.
                </p>
              </div>

              {/* Filter Chips */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                {['all', 'Organik', 'Kertas', 'Plastik', 'Logam & Kaca', 'B3 & Residu'].map(
                  (f) => (
                    <button
                      key={f}
                      onClick={() => setSelectedDegradationFilter(f)}
                      className={`px-3 py-1 rounded-full text-[11px] font-bold whitespace-nowrap cursor-pointer transition-colors ${
                        selectedDegradationFilter === f
                          ? 'bg-slate-900 text-white'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                      }`}
                    >
                      {f === 'all' ? 'Semua' : f}
                    </button>
                  )
                )}
              </div>
            </div>

            {/* Timeline Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {filteredDegradation.map((deg) => (
                <div
                  key={deg.id}
                  className="p-4 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-white hover:shadow-md transition-all flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-200 text-slate-700">
                        {deg.category}
                      </span>
                      <span
                        className="text-xs font-black px-2 py-0.5 rounded-full text-white"
                        style={{ backgroundColor: deg.color }}
                      >
                        {deg.durationText}
                      </span>
                    </div>

                    <h3 className="font-extrabold text-slate-900 text-sm">
                      {deg.name}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {deg.description}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-200/80">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 mb-0.5">
                      Solusi Gaya Hidup Mahasiswa:
                    </div>
                    <p className="text-[11px] text-slate-700">
                      {deg.alternativeSolution}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. ARTIKEL & RISET KAMPUS */}
      {/* ========================================================================= */}
      {activeSubTab === 'articles' && (
        <div className="space-y-6">
          {/* Article Categories Filter */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {articleCategories.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedArticleCategory(c.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  selectedArticleCategory === c.id
                    ? 'bg-slate-900 text-white shadow-2xs'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>

          {/* Articles Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredArticles.map((art) => (
              <div
                key={art.id}
                onClick={() => setSelectedArticle(art)}
                className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:border-slate-300 hover:shadow-md transition-all overflow-hidden flex flex-col cursor-pointer group"
              >
                <div className="relative h-44 w-full overflow-hidden bg-slate-100">
                  <img
                    src={art.imageUrl}
                    alt={art.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-950/75 text-white backdrop-blur-xs">
                    {art.category}
                  </span>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 text-[11px] text-slate-400 font-medium">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{art.readTime}</span>
                      </span>
                      <span>•</span>
                      <span>{art.date}</span>
                    </div>

                    <h3 className="font-bold text-slate-900 text-sm sm:text-base group-hover:text-emerald-700 transition-colors line-clamp-2">
                      {art.title}
                    </h3>

                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {art.summary}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 text-slate-500">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      <span className="text-[11px] font-medium">{art.author}</span>
                    </div>
                    <span className="font-bold text-emerald-600 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform text-[11px]">
                      <span>Baca Selengkapnya</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. KAMUS ISTILAH 3R & ZERO WASTE */}
      {/* ========================================================================= */}
      {activeSubTab === 'glossary' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 sm:p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div>
                <span className="text-[11px] font-black text-purple-700 uppercase tracking-wider">
                  Glosarium & Terminologi
                </span>
                <h2 className="text-base sm:text-lg font-black text-slate-900">
                  Kamus Istilah 3R & Ekologi Sirkular Kampus
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Pelajari definisi istilah-istilah penting lingkungan dengan contoh implementasi nyata di lingkungan universitas.
                </p>
              </div>

              {/* Search input */}
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={glossarySearch}
                  onChange={(e) => setGlossarySearch(e.target.value)}
                  placeholder="Cari istilah..."
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-emerald-500 bg-slate-50"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredGlossary.map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-slate-50 transition-colors space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-extrabold text-slate-900 text-sm">
                      {item.term}
                    </h3>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-800">
                      {item.category}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {item.definition}
                  </p>
                  <div className="p-2.5 rounded-lg bg-white border border-slate-200/80 text-[11px] text-slate-700">
                    <strong className="text-emerald-700">Contoh di Kampus:</strong> {item.campusExample}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Article Detail Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl border border-slate-200 p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
                {selectedArticle.category}
              </span>
              <button
                onClick={() => setSelectedArticle(null)}
                className="text-xs text-slate-400 hover:text-slate-700 font-bold cursor-pointer"
              >
                Tutup (Esc)
              </button>
            </div>

            <div className="space-y-2">
              <h2 className="text-lg sm:text-xl font-black text-slate-900 leading-snug">
                {selectedArticle.title}
              </h2>
              <div className="text-xs text-slate-500 flex items-center gap-3">
                <span>Oleh {selectedArticle.author}</span>
                <span>•</span>
                <span>{selectedArticle.date}</span>
                <span>•</span>
                <span>{selectedArticle.readTime}</span>
              </div>
            </div>

            <img
              src={selectedArticle.imageUrl}
              alt={selectedArticle.title}
              className="w-full h-48 sm:h-64 object-cover rounded-xl border border-slate-200"
            />

            <div className="space-y-3 text-xs sm:text-sm text-slate-700 leading-relaxed">
              {selectedArticle.content.map((p, idx) => (
                <p key={idx}>{p}</p>
              ))}
            </div>

            <div className="flex flex-wrap gap-1.5 pt-2">
              {selectedArticle.tags.map((t) => (
                <span
                  key={t}
                  className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px] font-bold"
                >
                  #{t}
                </span>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setSelectedArticle(null)}
                className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 cursor-pointer"
              >
                Selesai Membaca
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
