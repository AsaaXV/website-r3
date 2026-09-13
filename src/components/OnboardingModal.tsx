import React, { useState } from 'react';
import {
  Sparkles,
  BookOpen,
  Camera,
  Repeat,
  MapPin,
  Award,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  X,
  ShieldCheck,
  Zap,
  Leaf
} from 'lucide-react';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToTab?: (tab: string) => void;
}

interface TourStep {
  title: string;
  badge: string;
  description: string;
  icon: React.ElementType;
  iconColor: string;
  bgColor: string;
  keyPoints: string[];
  tabTarget?: string;
  actionText?: string;
}

const TOUR_STEPS: TourStep[] = [
  {
    title: 'Selamat Datang di EcoCampus 3R',
    badge: 'Panduan Ekosistem Kampus',
    description:
      'Platform sirkularitas dan literasi pemilahan sampah digital mahasiswa & sivitas akademika kampus. Dirancang berbasis analisis kebutuhan nyata civitas kampus untuk mereduksi timbulan sampah.',
    icon: Leaf,
    iconColor: 'text-emerald-600',
    bgColor: 'bg-emerald-50 border-emerald-200',
    keyPoints: [
      'Belajar memilah sampah sesuai 4 wadah standar kampus (Organik, Kertas, Plastik, Khusus).',
      'Pemanfaatan bursa preloved untuk mencegah penumpukan barang tak terpakai di kos/kampus.',
      'Deteksi material berbasis AI dengan rekomendasi aksi dan ide upcycling DIY.',
    ],
    tabTarget: 'edukasi',
    actionText: 'Lihat Modul Edukasi',
  },
  {
    title: 'Bursa Reuse & Papan Kebutuhan (Preloved)',
    badge: 'Fitur Paling Bernilai Tambah',
    description:
      'Tukarkan atau hibahkan barang preloved (buku kuliah, alat lab, peralatan kos) ke sesama mahasiswa, serta pasang kebutuhan barang di Papan "Dicari".',
    icon: Repeat,
    iconColor: 'text-amber-600',
    bgColor: 'bg-amber-50 border-amber-200',
    keyPoints: [
      'Kategori Donasi / 100% Gratis untuk membantu mahasiswa baru & hemat biaya hidup.',
      'Rekomendasi Titik Temu Aman (Safe COD Spots) di titik ramai kampus (Lobi Fakultas, Kantin, Perpustakaan).',
      'Chat pesan langsung antar-mahasiswa yang terproteksi dan transparan.',
    ],
    tabTarget: 'komunitas',
    actionText: 'Jelajahi Bursa Reuse',
  },
  {
    title: 'AI Scanner Material & Ide DIY Upcycling',
    badge: 'Teknologi AI Ramah Lingkungan',
    description:
      'Arahkan kamera atau unggah foto sampah kemasan untuk mendeteksi jenis material dan mendapatkan instruksi penanganan instan.',
    icon: Camera,
    iconColor: 'text-indigo-600',
    bgColor: 'bg-indigo-50 border-indigo-200',
    keyPoints: [
      'Identifikasi botol PET, kardus, kaleng, dan kaca beserta persentase kecocokan.',
      'Panduan kreatif Upcycling & DIY sederhana untuk membuat pot hidroponik atau organizer meja kos.',
      'Riwayat scan pribadi tersimpan rapi untuk memantau jejak pemilahan Anda.',
    ],
    tabTarget: 'scanner',
    actionText: 'Coba AI Scanner',
  },
  {
    title: 'Peta Fasilitas TPA Akhir & Drop Box Khusus',
    badge: 'GIS Geospasial & Drop Point',
    description:
      'Pantau kondisi darurat timbunan sampah di TPA akhir kota serta temukan lokasi drop box spesifik terdekat di lingkungan fakultas.',
    icon: MapPin,
    iconColor: 'text-rose-600',
    bgColor: 'bg-rose-50 border-rose-200',
    keyPoints: [
      'Visualisasi darurat gunung sampah dan status overcapacity TPA Tamangapa Antang.',
      'Titik Drop Box khusus E-Waste (baterai/gadget), donasi pakaian, dan minyak jelantah.',
      'Jadwal operasional serta kontak WhatsApp petugas pengelola untuk penjemputan berkala.',
    ],
    tabTarget: 'fasilitas',
    actionText: 'Buka Peta Fasilitas',
  },
  {
    title: 'Tantangan 7 Hari & E-Sertifikat Hijau',
    badge: 'Gamifikasi & Portofolio MBKM',
    description:
      'Bentuk kebiasaan berkelanjutan dengan menyelesaikan micro-challenge harian dan unduh sertifikat resmi untuk portofolio kampus.',
    icon: Award,
    iconColor: 'text-purple-600',
    bgColor: 'bg-purple-50 border-purple-200',
    keyPoints: [
      'Micro-challenge: Bawa tumbler, tolak kantong kresek, hingga donasi barang ke bursa reuse.',
      'Peroleh Eco-Points dan tukarkan dengan voucher kantin, kuota internet, atau merchandise.',
      'E-Sertifikat Partisipasi Hijau yang dapat dicetak dan dimasukkan ke berkas Merdeka Belajar.',
    ],
    tabTarget: 'gamification',
    actionText: 'Buka Gamifikasi',
  },
];

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onClose,
  onNavigateToTab,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  if (!isOpen) return null;

  const currentStep = TOUR_STEPS[currentStepIndex];
  const StepIcon = currentStep.icon;
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === TOUR_STEPS.length - 1;

  const handleNext = () => {
    if (isLastStep) {
      onClose();
    } else {
      setCurrentStepIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (!isFirstStep) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  const handleActionClick = () => {
    if (currentStep.tabTarget && onNavigateToTab) {
      onNavigateToTab(currentStep.tabTarget);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        id="onboarding-modal-card"
        className="relative bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 overflow-hidden text-slate-900"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          id="close-onboarding-btn"
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          title="Tutup Panduan"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Step Progress Indicators */}
        <div className="flex items-center gap-1.5 mb-6">
          {TOUR_STEPS.map((step, idx) => (
            <button
              key={step.title}
              onClick={() => setCurrentStepIndex(idx)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                idx === currentStepIndex
                  ? 'w-8 bg-emerald-600'
                  : idx < currentStepIndex
                  ? 'w-3 bg-emerald-300'
                  : 'w-3 bg-slate-200'
              }`}
              title={`Langkah ${idx + 1}: ${step.title}`}
            />
          ))}
          <span className="ml-auto text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            {currentStepIndex + 1} dari {TOUR_STEPS.length}
          </span>
        </div>

        {/* Step Header */}
        <div className="flex items-start gap-4 mb-4">
          <div
            className={`w-14 h-14 rounded-2xl flex items-center justify-center border shrink-0 ${currentStep.bgColor}`}
          >
            <StepIcon className={`w-7 h-7 ${currentStep.iconColor}`} />
          </div>
          <div>
            <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700 border border-slate-200 mb-1">
              {currentStep.badge}
            </span>
            <h2 className="text-xl font-extrabold text-slate-900 leading-tight">
              {currentStep.title}
            </h2>
          </div>
        </div>

        {/* Step Description */}
        <p className="text-sm text-slate-600 leading-relaxed mb-5">
          {currentStep.description}
        </p>

        {/* Key Highlights */}
        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 mb-6 space-y-2.5">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-500" />
            <span>Poin Utama Fitur:</span>
          </h3>
          <ul className="space-y-2">
            {currentStep.keyPoints.map((point, i) => (
              <li key={i} className="flex items-start gap-2.5 text-xs text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span className="leading-snug">{point}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Modal Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-slate-100">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            {!isFirstStep && (
              <button
                onClick={handlePrev}
                id="onboarding-prev-btn"
                className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold flex items-center justify-center gap-1 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Sebelumnya</span>
              </button>
            )}
            {currentStep.actionText && (
              <button
                onClick={handleActionClick}
                id="onboarding-direct-action-btn"
                className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors"
              >
                {currentStep.actionText}
              </button>
            )}
          </div>

          <button
            onClick={handleNext}
            id="onboarding-next-btn"
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold shadow-md shadow-emerald-600/20 flex items-center justify-center gap-1.5 transition-all"
          >
            <span>{isLastStep ? 'Selesai & Jelajah' : 'Langkah Berikutnya'}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
