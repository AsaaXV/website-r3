import React, { useState, useRef, useEffect } from 'react';
import {
  Camera,
  Upload,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight,
  Info,
  Layers,
  Scale,
  Zap,
  Eye,
  BookOpen,
  Users,
  MapPin,
  Lightbulb,
  History,
  Trash2,
  ChevronDown,
  ChevronUp,
  Clock,
  Wrench,
  Compass
} from 'lucide-react';
import { PRESET_DETECTIONS, WASTE_CATEGORIES } from '../data/mockData';
import { DetectionResult, WasteCategoryType, UpcyclingTip, ScanHistoryItem, UserProfile } from '../types';
import { getUserScanHistory, saveUserScanHistory, clearUserScanHistory } from '../utils/storage';
import { compressImage, formatBytes, CompressionResult } from '../utils/imageCompression';

interface AIScannerViewProps {
  currentUser?: UserProfile;
  onNavigateToEducation?: () => void;
  onNavigateToCommunity?: () => void;
  onNavigateToMap?: () => void;
  onCancel?: () => void;
  onTransferToDeposit?: (detectedCategory: WasteCategoryType, estimatedWeight: number) => void;
}

// Built-in DIY Upcycling Tips database by material label
const MATERIAL_UPCYCLING_GUIDES: Record<string, UpcyclingTip[]> = {
  'Botol Plastik PET': [
    {
      title: 'Pot Tanaman Hidroponik Wick System',
      difficulty: 'Mudah',
      estTime: '10 menit',
      materialsNeeded: 'Botol PET 600ml/1.5L, kain flanel/sumbu kompor, gunting, media tanam/air nutrisi.',
      steps: [
        'Potong botol menjadi dua bagian (bagian atas sepertiga panjang botol).',
        'Lubangi tutup botol dan selipkan kain flanel sebagai sumbu penyerap nutrisi.',
        'Balikkan potongan atas botol ke dalam potongan bawah yang diisi air nutrisi. Sangat cocok diletakkan di jendela kosan.',
      ],
    },
    {
      title: 'Wadah Pensil & Alat Tulis Estetik',
      difficulty: 'Mudah',
      estTime: '5 menit',
      materialsNeeded: 'Bagian bawah botol PET, setrika hangat (untuk menghaluskan pinggiran potong).',
      steps: [
        'Potong botol setinggi 10 cm dari bagian alas.',
        'Tempelkan pinggiran potongan ke permukaan setrika hangat selama 3-4 detik agar tepian melengkung halus dan tidak tajam.',
        'Wadah siap dipakai menata pulpen, spidol, dan gunting di meja belajar.',
      ],
    },
  ],
  'Kardus Karton Bekas': [
    {
      title: 'Penyekat (Divider) Laci & Rak Lemari Kos',
      difficulty: 'Mudah',
      estTime: '10 menit',
      materialsNeeded: 'Lembaran kardus tebal, cutter, penggaris.',
      steps: [
        'Ukur tinggi dan lebar laci meja atau lemari pakaian Anda.',
        'Potong kardus membentuk bilah-bilah panjang dengan celah selip di tengahnya.',
        'Rakit bersilangan membentuk kotak-kotak untuk merapikan kaus kaki, charger, atau alat tulis.',
      ],
    },
    {
      title: 'Dudukan Laptop Ergonomis DIY',
      difficulty: 'Menengah',
      estTime: '15 menit',
      materialsNeeded: 'Kardus gelombang ganda tebal, lem kertas/tembak, pisau cutter.',
      steps: [
        'Potong 2 bentuk segitiga siku-siku dengan sudut kemiringan 15–20 derajat.',
        'Hubungkan kedua segitiga dengan balok kardus penyangga di bagian belakang.',
        'Alasi laptop Anda untuk sirkulasi udara lebih dingin dan posisi layar sejajar pandangan mata.',
      ],
    },
  ],
  'Botol Kaca Minuman': [
    {
      title: 'Vas Bunga / Propagasi Tanaman Air (Sirih Gading)',
      difficulty: 'Mudah',
      estTime: '5 menit',
      materialsNeeded: 'Botol kaca bersih, air bersih, tangkai tanaman sirih gading.',
      steps: [
        'Rendam botol dalam air sabun hangat untuk melepaskan sisa stiker label.',
        'Bilas hingga jernih, lalu isi dengan air bersuhu ruang.',
        'Masukkan tangkai sirih gading untuk mempercantik meja belajar dan menyegarkan sirkulasi kamar kos.',
      ],
    },
    {
      title: 'Tempat Lilin Aromaterapi atau Lampu Tumblr Meja',
      difficulty: 'Mudah',
      estTime: '5 menit',
      materialsNeeded: 'Botol kaca bening, lampu LED kawat kaktus/tumblr bertenaga baterai.',
      steps: [
        'Pastikan bagian dalam botol kering sempurna.',
        'Masukkan untaian kawat lampu LED ke dalam botol kaca.',
        'Nyalakan lampu saat belajar malam untuk suasana kamar kos yang hangat tanpa polusi plastik.',
      ],
    },
  ],
  'Sisa Makanan & Sayur Organik': [
    {
      title: 'Cairan Pembersih Serbaguna (Eco-Enzyme)',
      difficulty: 'Menengah',
      estTime: '15 menit',
      materialsNeeded: 'Kulit buah (jeruk/nanas/apel), gula merah/molase, air bersih (rasio 1:3:10), wadah plastik berpenutup.',
      steps: [
        'Campurkan 100g gula merah dengan 1 liter air dalam botol plastik hingga larut.',
        'Masukkan 300g kulit buah segar yang telah dicuci bersih.',
        'Tutup rapat dan simpan di tempat sejuk selama 3 bulan. Hasil fermentasi adalah cairan pembersih lantai dan piring alami tanpa deterjen kimia.',
      ],
    },
    {
      title: 'Kompos Takakura Mini Kosan',
      difficulty: 'Mudah',
      estTime: '10 menit',
      materialsNeeded: 'Ember bekas berlubang, kardus pelapis dalam, sekam/tanah gembur, sisa sayur/buah.',
      steps: [
        'Lapisi dinding ember dengan kardus untuk menyerap kelembapan dan ventilasi udara.',
        'Isi sepertiga ember dengan tanah atau kompos matang.',
        'Cincang sisa sayur/buah, masukkan dan aduk tipis. Dalam 2–3 minggu menghasilkan pupuk tanaman kosan yang subur.',
      ],
    },
  ],
  'Kaleng Minuman Alumunium': [
    {
      title: 'Tempat Kuas / Alat Tulis Kaleng Daur Ulang',
      difficulty: 'Mudah',
      estTime: '10 menit',
      materialsNeeded: 'Kaleng minuman, pembuka kaleng aman, amplas halus.',
      steps: [
        'Buka tutup atas kaleng menggunakan pembuka kaleng putar agar pinggiran halus.',
        'Gosok perlahan tepian dalam dengan amplas halus.',
        'Hias dengan kertas motif atau tali rami untuk wadah alat tulis estetik.',
      ],
    },
  ],
};

export const AIScannerView: React.FC<AIScannerViewProps> = ({
  currentUser,
  onNavigateToEducation,
  onNavigateToCommunity,
  onNavigateToMap,
  onCancel,
}) => {
  const [activeSubView, setActiveSubView] = useState<'scanner' | 'history'>('scanner');
  const [selectedPresetId, setSelectedPresetId] = useState<string>(PRESET_DETECTIONS[0].id);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [isLiveCamera, setIsLiveCamera] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [customImage, setCustomImage] = useState<string | null>(null);
  const [compressionInfo, setCompressionInfo] = useState<CompressionResult | null>(null);
  const [detection, setDetection] = useState<DetectionResult>(PRESET_DETECTIONS[0].result);
  const [showUpcyclingTips, setShowUpcyclingTips] = useState<boolean>(true);
  const [scanHistory, setScanHistory] = useState<ScanHistoryItem[]>(() =>
    getUserScanHistory(currentUser?.id || '')
  );

  // Sync scan history when active authenticated user changes
  useEffect(() => {
    setScanHistory(getUserScanHistory(currentUser?.id || ''));
  }, [currentUser?.id]);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const currentPreset = PRESET_DETECTIONS.find((p) => p.id === selectedPresetId);

  // Match category details from dataset
  const matchedCategoryInfo = WASTE_CATEGORIES.find(
    (cat) => cat.id === detection.category
  );

  // Get upcycling tips for current detection
  const currentUpcyclingTips: UpcyclingTip[] =
    MATERIAL_UPCYCLING_GUIDES[detection.label] ||
    (detection.category === 'plastik'
      ? MATERIAL_UPCYCLING_GUIDES['Botol Plastik PET']
      : detection.category === 'kertas'
      ? MATERIAL_UPCYCLING_GUIDES['Kardus Karton Bekas']
      : detection.category === 'organik'
      ? MATERIAL_UPCYCLING_GUIDES['Sisa Makanan & Sayur Organik']
      : MATERIAL_UPCYCLING_GUIDES['Kaleng Minuman Alumunium']);

  // Add item to history
  const recordScanToHistory = (det: DetectionResult, imageSrc: string) => {
    const now = new Date();
    const timeString = `${now.getDate()} Sep ${now.getFullYear()}, ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')} WITA`;
    const tips =
      MATERIAL_UPCYCLING_GUIDES[det.label] ||
      (det.category === 'plastik'
        ? MATERIAL_UPCYCLING_GUIDES['Botol Plastik PET']
        : MATERIAL_UPCYCLING_GUIDES['Kardus Karton Bekas']);

    const historyItem: ScanHistoryItem = {
      id: `scan_${Date.now()}`,
      timestamp: timeString,
      materialName: det.label,
      category: det.category,
      confidence: det.confidence,
      thumbnailUrl: imageSrc,
      suggestedAction: det.suggestedAction,
      upcyclingTips: tips,
    };

    setScanHistory((prev) => {
      // Avoid duplicate consecutive scans of same label within 3 seconds
      if (prev.length > 0 && prev[0].materialName === det.label) {
        return prev;
      }
      const updated = [historyItem, ...prev.slice(0, 19)]; // Keep latest 20
      saveUserScanHistory(currentUser?.id || '', updated);
      return updated;
    });
  };

  // Switch preset
  const handleSelectPreset = (id: string) => {
    stopCamera();
    setSelectedPresetId(id);
    setCustomImage(null);
    setCompressionInfo(null);
    const item = PRESET_DETECTIONS.find((p) => p.id === id);
    if (item) {
      triggerScanAnimation(item.result, item.sampleImg);
    }
  };

  // Trigger scan effect
  const triggerScanAnimation = (targetResult: DetectionResult, imageSrc: string) => {
    setIsScanning(true);
    setTimeout(() => {
      setDetection(targetResult);
      setIsScanning(false);
      recordScanToHistory(targetResult, imageSrc);
    }, 600);
  };

  // Handle custom image upload with client-side compression
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      stopCamera();
      try {
        const compressed = await compressImage(file, 1280, 1280, 0.85);
        setCustomImage(compressed.dataUrl);
        setCompressionInfo(compressed);
        const matched = PRESET_DETECTIONS[0].result;
        triggerScanAnimation(matched, compressed.dataUrl);
      } catch (err) {
        // Fallback to FileReader if compression fails
        const reader = new FileReader();
        reader.onload = (event) => {
          const url = event.target?.result as string;
          setCustomImage(url);
          setCompressionInfo(null);
          const matched = PRESET_DETECTIONS[0].result;
          triggerScanAnimation(matched, url);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  // Live Camera handling
  const startCamera = async () => {
    setCameraError(null);
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
        setIsLiveCamera(true);
        setCustomImage(null);
        triggerScanAnimation(PRESET_DETECTIONS[0].result, PRESET_DETECTIONS[0].sampleImg);
      } else {
        setCameraError('Kamera tidak didukung oleh browser Anda.');
      }
    } catch (err) {
      setCameraError('Akses izin kamera ditolak atau tidak tersedia pada perangkat.');
      setIsLiveCamera(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsLiveCamera(false);
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const handleClearHistory = () => {
    if (confirm('Bersihkan seluruh riwayat pemindaian AI dari perangkat ini?')) {
      setScanHistory([]);
      clearUserScanHistory(currentUser?.id || '');
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header with Switcher Tabs */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-emerald-100 text-emerald-900 border border-emerald-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
              <span>AI Computer Vision 3R</span>
            </span>
            <span className="text-xs text-slate-500 font-medium">Model YOLOv8 Edge Inference</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Pemindai Material Sampah & Ide Upcycling
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
            Arahkan kamera ke sampah untuk identifikasi seketika jenis wadah pilah dan temukan ide kreatif pemanfaatan ulang (upcycling DIY) di kosan Anda.
          </p>
        </div>

        {/* View Switcher: Scanner vs History */}
        <div className="flex p-1 rounded-xl bg-slate-100 border border-slate-200 self-start md:self-auto shrink-0">
          <button
            onClick={() => setActiveSubView('scanner')}
            id="tab-scanner-view"
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeSubView === 'scanner'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Kamera & Deteksi AI</span>
          </button>
          <button
            onClick={() => setActiveSubView('history')}
            id="tab-scan-history"
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeSubView === 'history'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>Riwayat Scan ({scanHistory.length})</span>
          </button>
        </div>
      </div>

      {/* VIEW 1: ACTIVE SCANNER VIEW */}
      {activeSubView === 'scanner' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Camera / Image Viewport & Preset Test Strip (7 cols) */}
          <div className="lg:col-span-7 bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 shadow-md flex flex-col justify-between">
            {/* Viewport Top Bar Controls */}
            <div className="p-3 px-4 bg-slate-950 text-white flex items-center justify-between text-xs border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="font-mono text-[11px] text-slate-300 font-semibold">
                  {isLiveCamera ? 'LIVE CAMERA STREAM' : 'STATIC INFERENCE CANVAS'}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="font-mono text-[11px] text-emerald-400">
                  Confidence: {(detection.confidence * 100).toFixed(1)}%
                </span>
              </div>
            </div>

            {/* Video or Image Canvas */}
            <div className="relative aspect-4/3 sm:aspect-16/10 bg-slate-950 flex items-center justify-center overflow-hidden">
              {isLiveCamera ? (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
              ) : (
                <img
                  src={customImage || currentPreset?.sampleImg}
                  alt="Sample Sampah"
                  className="w-full h-full object-cover"
                />
              )}

              {/* Scanning Line Animation */}
              {isScanning && (
                <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/0 via-emerald-400/20 to-emerald-500/0 animate-pulse border-y-2 border-emerald-400"></div>
              )}

              {/* AI Bounding Box Overlay */}
              {!isScanning && (
                <div
                  className="absolute border-2 border-emerald-400 rounded-md transition-all duration-300 pointer-events-none shadow-md"
                  style={{
                    top: `${detection.bbox[0]}%`,
                    left: `${detection.bbox[1]}%`,
                    height: `${detection.bbox[2] - detection.bbox[0]}%`,
                    width: `${detection.bbox[3] - detection.bbox[1]}%`,
                  }}
                >
                  {/* Bounding box label tag */}
                  <div className="absolute -top-7 left-0 bg-emerald-600 text-white font-mono text-[10px] font-bold px-2 py-0.5 rounded shadow-sm flex items-center gap-1.5 whitespace-nowrap">
                    <Sparkles className="w-3 h-3 text-amber-300" />
                    <span>{detection.label}</span>
                    <span className="text-emerald-200">
                      {(detection.confidence * 100).toFixed(0)}%
                    </span>
                  </div>

                  {/* Corner reticles */}
                  <div className="absolute -top-1 -left-1 w-2.5 h-2.5 border-t-2 border-l-2 border-emerald-300"></div>
                  <div className="absolute -top-1 -right-1 w-2.5 h-2.5 border-t-2 border-r-2 border-emerald-300"></div>
                  <div className="absolute -bottom-1 -left-1 w-2.5 h-2.5 border-b-2 border-l-2 border-emerald-300"></div>
                  <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 border-b-2 border-r-2 border-emerald-300"></div>
                </div>
              )}
            </div>

            {/* Camera Control Action Buttons */}
            <div className="p-3 bg-slate-900 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                {!isLiveCamera ? (
                  <button
                    onClick={startCamera}
                    id="btn-start-camera"
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>Buka Kamera Ponsel</span>
                  </button>
                ) : (
                  <button
                    onClick={stopCamera}
                    className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Hentikan Kamera</span>
                  </button>
                )}

                <label className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-700">
                  <Upload className="w-3.5 h-3.5 text-slate-400" />
                  <span>Unggah Foto</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>

                {compressionInfo && (
                  <div className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-950/80 border border-emerald-700/60 text-[11px] text-emerald-300">
                    <Zap className="w-3 h-3 text-amber-300" />
                    <span>Kompresi AI: Hemat {compressionInfo.savedPercentage}% ({formatBytes(compressionInfo.originalSizeBytes)} ➔ {formatBytes(compressionInfo.compressedSizeBytes)})</span>
                  </div>
                )}
              </div>

              {cameraError && (
                <div className="text-[11px] text-amber-400 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{cameraError}</span>
                </div>
              )}
            </div>

            {/* Preset Selector Strip */}
            <div className="p-3 bg-slate-950 border-t border-slate-800">
              <div className="text-[11px] font-semibold text-slate-400 mb-2 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-emerald-400" />
                <span>Preset Simulasi Objek Sampah Kampus:</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {PRESET_DETECTIONS.map((p) => {
                  const isSelected = p.id === selectedPresetId && !customImage && !isLiveCamera;
                  return (
                    <button
                      key={p.id}
                      onClick={() => handleSelectPreset(p.id)}
                      className={`flex items-center gap-2 p-1.5 rounded-lg border text-left transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-emerald-950/80 border-emerald-500 text-white ring-1 ring-emerald-500'
                          : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <img
                        src={p.sampleImg}
                        alt={p.name}
                        className="w-8 h-8 rounded object-cover shrink-0"
                      />
                      <div className="truncate text-[10px] font-medium leading-tight">
                        {p.name}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Inference Analytics, Upcycling Ideas & Direct Action (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            {/* Primary Classification Result */}
            <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">Hasil Klasifikasi AI</h3>
                    <p className="text-[11px] text-slate-500">Kecocokan Model {(detection.confidence * 100).toFixed(1)}%</p>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                  {detection.category.toUpperCase()}
                </span>
              </div>

              {/* Target Label & Bin Color */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="text-xs text-slate-500 font-semibold uppercase">Identifikasi Material</div>
                <div className="text-base font-bold text-slate-900">
                  {detection.label}
                </div>

                <div className="pt-2 border-t border-slate-200 flex items-center gap-2">
                  <span
                    className="w-3.5 h-3.5 rounded-full shrink-0 shadow-xs"
                    style={{ backgroundColor: matchedCategoryInfo?.binColor || '#10b981' }}
                  />
                  <span className="text-xs font-bold text-slate-800">
                    {detection.recommendedBin}
                  </span>
                </div>
              </div>

              {/* Handling Guideline */}
              <div className="text-xs p-3 rounded-xl bg-emerald-50/70 border border-emerald-200 text-emerald-900 space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Instruksi Penanganan Mahasiswa:</span>
                </div>
                <p className="text-emerald-800 leading-relaxed text-[11px]">
                  {detection.suggestedAction}
                </p>
              </div>

              {/* Value & Weight Estimation */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="p-3 rounded-xl border border-slate-200 bg-slate-50/50">
                  <span className="text-[10px] text-slate-500 font-medium">Estimasi Berat Satuan</span>
                  <div className="text-lg font-black text-slate-900 mt-0.5">
                    {detection.estimatedWeightKg} <span className="text-xs font-normal text-slate-500">kg</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl border border-slate-200 bg-emerald-50/50">
                  <span className="text-[10px] text-emerald-700 font-medium">Estimasi Eco-Points</span>
                  <div className="text-lg font-black text-emerald-700 mt-0.5">
                    +{detection.ecoPointsEst} <span className="text-xs font-normal text-emerald-600">pts</span>
                  </div>
                </div>
              </div>

              {/* Quick Navigation Action Buttons */}
              <div className="space-y-2 pt-1">
                {onNavigateToEducation && (
                  <button
                    onClick={onNavigateToEducation}
                    id="scan-goto-edu-btn"
                    className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-2xs transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>Panduan Pemilahan Lengkap</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}

                <div className="grid grid-cols-2 gap-2">
                  {onNavigateToCommunity && (
                    <button
                      onClick={onNavigateToCommunity}
                      id="scan-goto-reuse-btn"
                      className="py-2.5 px-3 rounded-xl bg-teal-50 hover:bg-teal-100 border border-teal-200 text-teal-800 font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Users className="w-3.5 h-3.5" />
                      <span>Bursa Reuse</span>
                    </button>
                  )}

                  {onNavigateToMap && (
                    <button
                      onClick={onNavigateToMap}
                      id="scan-goto-map-btn"
                      className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <MapPin className="w-3.5 h-3.5" />
                      <span>Peta Drop Box</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Upcycling & DIY Section (Fitur Saran 2) */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
              <div
                onClick={() => setShowUpcyclingTips(!showUpcyclingTips)}
                className="flex items-center justify-between cursor-pointer group"
              >
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                    <Lightbulb className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-xs sm:text-sm">
                      Ide Upcycling & Pemanfaatan Ulang
                    </h3>
                    <p className="text-[10px] text-slate-500">Solusi kreatif agar tak jadi sampah</p>
                  </div>
                </div>

                <div className="text-slate-400 group-hover:text-slate-700 transition-colors">
                  {showUpcyclingTips ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </div>

              {showUpcyclingTips && (
                <div className="space-y-3 pt-2 border-t border-slate-100">
                  {currentUpcyclingTips.map((tip, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-200/80 space-y-2 text-xs"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="font-bold text-slate-900 leading-snug">
                          {tip.title}
                        </div>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900 shrink-0">
                          {tip.difficulty}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 text-[11px] text-slate-600">
                        <span className="flex items-center gap-1 text-slate-500">
                          <Clock className="w-3 h-3 text-amber-600" />
                          <span>{tip.estTime}</span>
                        </span>
                        <span className="flex items-center gap-1 text-slate-500 truncate">
                          <Wrench className="w-3 h-3 text-amber-600" />
                          <span className="truncate">{tip.materialsNeeded}</span>
                        </span>
                      </div>

                      <div className="space-y-1 pt-1 border-t border-amber-200/60 text-[11px] text-slate-700">
                        <div className="font-semibold text-slate-800">Langkah Pengerjaan:</div>
                        <ol className="list-decimal list-inside space-y-0.5 text-slate-600">
                          {tip.steps.map((st, sIdx) => (
                            <li key={sIdx} className="leading-relaxed">{st}</li>
                          ))}
                        </ol>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: SCAN HISTORY VIEW (Fitur Saran 2) */}
      {activeSubView === 'history' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 sm:p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                <History className="w-5 h-5 text-emerald-700" />
                <span>Log Riwayat Pemindaian Material Saya</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Daftar sampah yang telah Anda pindai dengan rekomendasi tong pilah & ide upcycling.
              </p>
            </div>

            {scanHistory.length > 0 && (
              <button
                onClick={handleClearHistory}
                className="px-3 py-1.5 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer self-start sm:self-auto"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Hapus Semua Riwayat</span>
              </button>
            )}
          </div>

          {scanHistory.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <Camera className="w-6 h-6" />
              </div>
              <div className="text-sm font-bold text-slate-700">Belum Ada Riwayat Pemindaian</div>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Gunakan tab "Kamera & Deteksi AI" di atas untuk memindai sampah botol, kertas, atau kardus pertama Anda.
              </p>
              <button
                onClick={() => setActiveSubView('scanner')}
                className="mt-2 px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-colors"
              >
                Mulai Pindai Sekarang
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {scanHistory.map((item) => (
                <div
                  key={item.id}
                  className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-3 shadow-2xs hover:border-slate-300 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-semibold text-slate-500">{item.timestamp}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        {item.category.toUpperCase()} • {(item.confidence * 100).toFixed(0)}%
                      </span>
                    </div>

                    <div className="flex gap-3 items-center">
                      <img
                        src={item.thumbnailUrl}
                        alt={item.materialName}
                        className="w-14 h-14 rounded-lg object-cover border border-slate-200 shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="font-bold text-slate-900 text-xs sm:text-sm truncate">
                          {item.materialName}
                        </div>
                        <div className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">
                          {item.suggestedAction}
                        </div>
                      </div>
                    </div>
                  </div>

                  {item.upcyclingTips && item.upcyclingTips.length > 0 && (
                    <div className="pt-2 border-t border-slate-200/80 text-[11px]">
                      <div className="font-bold text-amber-900 flex items-center gap-1 mb-1">
                        <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
                        <span>Ide DIY: {item.upcyclingTips[0].title}</span>
                      </div>
                      <div className="text-slate-600 text-[10px] truncate">
                        Bahan: {item.upcyclingTips[0].materialsNeeded}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
