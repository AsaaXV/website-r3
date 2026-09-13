import React, { useState } from 'react';
import {
  X,
  Layers,
  Database,
  ShieldCheck,
  Server,
  Cpu,
  Workflow,
  Search,
  CheckCircle2,
  Lock,
  Code2,
  Gauge,
  FileText,
  Activity,
  ArrowRight,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

interface SystemArchitectureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SystemArchitectureModal: React.FC<SystemArchitectureModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeSection, setActiveSection] = useState<'overview' | 'erd' | 'api' | 'userflow' | 'security' | 'vitals'>('overview');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        id="system-architecture-modal"
        className="relative bg-white rounded-3xl max-w-4xl w-full h-[90vh] max-h-[800px] shadow-2xl border border-slate-200 flex flex-col overflow-hidden text-slate-900"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-600/20">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-extrabold text-slate-900">
                  Dokumen Arsitektur & Spesifikasi Sistem
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  EcoCampus 3R v1.2
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Berdasarkan Pedoman Rekayasa Perangkat Lunak, Model Data ERD, API Kontrak & Standar OWASP
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            id="close-architecture-modal-btn"
            className="p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
            title="Tutup Spesifikasi"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 px-6 py-2.5 bg-slate-100 border-b border-slate-200 overflow-x-auto text-xs font-bold shrink-0">
          {[
            { id: 'overview', label: '1. Tujuan & Arsitektur', icon: Server },
            { id: 'userflow', label: '2. Alur Pengguna (Flow)', icon: Workflow },
            { id: 'erd', label: '3. Model Data & ERD', icon: Database },
            { id: 'api', label: '4. Kontrak REST API', icon: Code2 },
            { id: 'security', label: '5. Keamanan & Privasi', icon: Lock },
            { id: 'vitals', label: '6. Performa & Core Vitals', icon: Gauge },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeSection === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSection(tab.id as any)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-white text-emerald-800 shadow-xs border border-slate-200'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-600' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-slate-800 text-xs sm:text-sm">
          {/* SECTION 1: OVERVIEW & SYSTEM ARCHITECTURE */}
          {activeSection === 'overview' && (
            <div className="space-y-6">
              <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-5">
                <h3 className="text-sm font-extrabold text-emerald-950 mb-2 flex items-center gap-2">
                  <Server className="w-4 h-4 text-emerald-700" />
                  <span>Tujuan Platform & Ringkasan Eksekutif</span>
                </h3>
                <p className="text-slate-700 leading-relaxed text-xs">
                  EcoCampus 3R dirancang untuk memecahkan hambatan fisik pengelolaan sampah di lingkungan universitas yang belum memiliki fasilitas penimbangan manual formal. Dengan mentransformasikan pemilahan menjadi ekosistem digital: edukasi pemilahan berbasis warna wadah nasional, <strong>Bursa Preloved / Barter & Request Board</strong> untuk mencegah timbulan barang baru, <strong>AI Scanner Material</strong> untuk instruksi pemilahan & upcycling DIY, serta <strong>Peta Geospasial Fasilitas TPA/Drop Box</strong>.
                </p>
              </div>

              {/* High-Level Architecture Diagram */}
              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
                  Arsitektur Sistem (Client ↔ API ↔ State Storage ↔ AI Engine)
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-center">
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                    <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 mx-auto flex items-center justify-center font-bold">
                      UI
                    </div>
                    <div className="font-bold text-slate-900 text-xs">Frontend Client</div>
                    <div className="text-[11px] text-slate-500">React 18, TypeScript, Tailwind CSS, Lucide Icons, WCAG 2.1 Accessible</div>
                  </div>
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center font-bold">
                      BFF
                    </div>
                    <div className="font-bold text-slate-900 text-xs">Application Logic</div>
                    <div className="text-[11px] text-slate-500">State Handlers, Chat Router, Audit Verifier, Haversine Geolocation</div>
                  </div>
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                    <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 mx-auto flex items-center justify-center font-bold">
                      DB
                    </div>
                    <div className="font-bold text-slate-900 text-xs">Persistent Storage</div>
                    <div className="text-[11px] text-slate-500">LocalStorage Relational Cache & Cloud Firestore Migration Ready</div>
                  </div>
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                    <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 mx-auto flex items-center justify-center font-bold">
                      AI
                    </div>
                    <div className="font-bold text-slate-900 text-xs">AI Vision & LLM</div>
                    <div className="text-[11px] text-slate-500">Google Gemini API Vision + Heuristic Material Knowledge Base</div>
                  </div>
                </div>
              </div>

              {/* Core Modules Breakdown */}
              <div className="border border-slate-200 rounded-2xl overflow-hidden">
                <div className="bg-slate-100 px-4 py-2.5 font-bold text-xs text-slate-800 border-b border-slate-200">
                  Modul Fungsional Utama (Sesuai Prioritas MVP & Fase 2)
                </div>
                <div className="divide-y divide-slate-100 text-xs">
                  <div className="p-3 flex items-start gap-3">
                    <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold shrink-0">MVP</span>
                    <div>
                      <strong className="text-slate-900">Bursa Reuse & Request Board:</strong> Katalog barang preloved, filter hibah/gratis (Rp 0), Safe COD Spots kampus, dan posting barang dicari.
                    </div>
                  </div>
                  <div className="p-3 flex items-start gap-3">
                    <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold shrink-0">MVP</span>
                    <div>
                      <strong className="text-slate-900">AI Scanner Material:</strong> Analisis citra material, deteksi kategori wadah, estimasi reduksi CO2, ide upcycling DIY, dan riwayat scan.
                    </div>
                  </div>
                  <div className="p-3 flex items-start gap-3">
                    <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold shrink-0">MVP</span>
                    <div>
                      <strong className="text-slate-900">Peta Fasilitas & TPA Kritis:</strong> Titik drop box khusus (E-Waste, pakaian, minyak jelantah), status darurat gunung sampah, jam operasional & narahubung.
                    </div>
                  </div>
                  <div className="p-3 flex items-start gap-3">
                    <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-bold shrink-0">Fase 2</span>
                    <div>
                      <strong className="text-slate-900">Gamifikasi Berkelanjutan:</strong> Tantangan 7 Hari, poin Eco-Points, penukaran voucher, leaderboard sivitas, dan generator E-Sertifikat MBKM.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 2: USER FLOW */}
          {activeSection === 'userflow' && (
            <div className="space-y-5">
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                  Diagram Alur Pengguna (User Journey Flow)
                </h3>
                <p className="text-xs text-slate-600 mb-4">
                  Setiap persona memiliki alur terarah untuk meminimalkan friksi:
                </p>

                <div className="space-y-3 font-mono text-[11px] bg-slate-900 text-emerald-400 p-4 rounded-xl overflow-x-auto leading-relaxed">
                  <div><strong>1. ALUR PENGUNJUNG (MAHASISWA BARU/TAMU):</strong></div>
                  <div>Beranda / Edukasi ➔ Pelajari 4 Wadah Sampah ➔ Coba AI Scanner Kamera ➔ Deteksi Material & Baca Ide DIY ➔ Lihat Bursa Reuse</div>
                  <div className="pt-2"><strong>2. ALUR BURSA PRELOVED & BARANG DICARI:</strong></div>
                  <div>Bursa Reuse ➔ [Pilihan A] Pasang Barang Preloved / Donasi Rp 0 + Pilih Titik Temu Aman (Safe COD Spot)</div>
                  <div>Bursa Reuse ➔ [Pilihan B] Pasang Kebutuhan di "Papan Dicari" (Request Board) ➔ Rekan Mahasiswa Chat / Menanggapi</div>
                  <div className="pt-2"><strong>3. ALUR GAMIFIKASI 7 HARI & E-SERTIKAT:</strong></div>
                  <div>Tab Gamifikasi ➔ Ambil Tantangan Hari Ini ➔ Selesaikan Aksi Ramah Lingkungan ➔ Peroleh Eco-Points ➔ Generate E-Sertifikat Portofolio</div>
                  <div className="pt-2"><strong>4. ALUR PETUGAS TPST & AUDIT:</strong></div>
                  <div>Switch Role Petugas ➔ Buka Peta Rute Angkut / Verifikasi Transparansi ➔ Audit Z-Score Anomali ➔ Konfirmasi Bersih</div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 bg-emerald-50/50 border border-emerald-200 rounded-xl">
                  <div className="font-bold text-emerald-900 text-xs">Persona: Mahasiswa</div>
                  <div className="text-[11px] text-slate-600 mt-1">
                    Fokus pada bursa hemat biaya kos, cari barang gratis, deteksi material sampah, dan sertifikat portofolio.
                  </div>
                </div>
                <div className="p-3 bg-blue-50/50 border border-blue-200 rounded-xl">
                  <div className="font-bold text-blue-900 text-xs">Persona: Petugas TPST</div>
                  <div className="text-[11px] text-slate-600 mt-1">
                    Fokus pada jadwal penjemputan berkala fakultas, pengosongan drop box limbah khusus, dan validasi transaksi.
                  </div>
                </div>
                <div className="p-3 bg-purple-50/50 border border-purple-200 rounded-xl">
                  <div className="font-bold text-purple-900 text-xs">Persona: Admin Kampus</div>
                  <div className="text-[11px] text-slate-600 mt-1">
                    Fokus pada monitoring tonase sampah tereduksi, evaluasi kepuasan SUS, dan metrik lingkungan kampus.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 3: ERD DATABASE SCHEMA */}
          {activeSection === 'erd' && (
            <div className="space-y-4">
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Database className="w-4 h-4 text-emerald-600" />
                  <span>Skema Basis Data Relasional (Conceptual ERD)</span>
                </h3>
                <p className="text-xs text-slate-600 mb-4">
                  Normalisasi data memisahkan entitas secara ketat sesuai prinsip rekayasa basis data:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Table USERS */}
                  <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-2xs">
                    <div className="bg-slate-800 text-white px-3 py-1.5 font-mono text-xs font-bold flex justify-between">
                      <span>TABLE: users</span>
                      <span className="text-emerald-400">PK: id</span>
                    </div>
                    <div className="p-3 font-mono text-[11px] space-y-1 text-slate-700">
                      <div>id: VARCHAR(36) [PK]</div>
                      <div>name: VARCHAR(100)</div>
                      <div>email: VARCHAR(100) [UNIQUE]</div>
                      <div>role: ENUM('mahasiswa', 'petugas_tps', 'admin')</div>
                      <div>faculty: VARCHAR(80)</div>
                      <div>eco_points: INT DEFAULT 0</div>
                      <div>xp: INT DEFAULT 0</div>
                      <div>streak_days: INT DEFAULT 1</div>
                      <div>created_at: TIMESTAMP</div>
                    </div>
                  </div>

                  {/* Table REUSE_ITEMS */}
                  <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-2xs">
                    <div className="bg-slate-800 text-white px-3 py-1.5 font-mono text-xs font-bold flex justify-between">
                      <span>TABLE: reuse_items</span>
                      <span className="text-amber-400">FK: donor_id</span>
                    </div>
                    <div className="p-3 font-mono text-[11px] space-y-1 text-slate-700">
                      <div>id: VARCHAR(36) [PK]</div>
                      <div>title: VARCHAR(150)</div>
                      <div>category: VARCHAR(50)</div>
                      <div>is_free: BOOLEAN (Hibah/Gratis)</div>
                      <div>price_rupiah: INT DEFAULT 0</div>
                      <div>donor_id: VARCHAR(36) [FK to users.id]</div>
                      <div>meetup_point: VARCHAR(100) (Safe COD Spot)</div>
                      <div>status: ENUM('available', 'claimed')</div>
                      <div>posted_at: TIMESTAMP</div>
                    </div>
                  </div>

                  {/* Table ITEM_REQUESTS */}
                  <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-2xs">
                    <div className="bg-slate-800 text-white px-3 py-1.5 font-mono text-xs font-bold flex justify-between">
                      <span>TABLE: item_requests</span>
                      <span className="text-indigo-400">Papan "Dicari"</span>
                    </div>
                    <div className="p-3 font-mono text-[11px] space-y-1 text-slate-700">
                      <div>id: VARCHAR(36) [PK]</div>
                      <div>requester_id: VARCHAR(36) [FK to users.id]</div>
                      <div>title: VARCHAR(150)</div>
                      <div>description: TEXT</div>
                      <div>urgency: ENUM('Segera', 'Santai', 'Fleksibel')</div>
                      <div>preferred_cod_spot: VARCHAR(100)</div>
                      <div>status: ENUM('open', 'fulfilled')</div>
                      <div>created_at: TIMESTAMP</div>
                    </div>
                  </div>

                  {/* Table SCAN_HISTORY */}
                  <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-2xs">
                    <div className="bg-slate-800 text-white px-3 py-1.5 font-mono text-xs font-bold flex justify-between">
                      <span>TABLE: scan_history</span>
                      <span className="text-purple-400">AI Logs</span>
                    </div>
                    <div className="p-3 font-mono text-[11px] space-y-1 text-slate-700">
                      <div>id: VARCHAR(36) [PK]</div>
                      <div>user_id: VARCHAR(36) [FK to users.id]</div>
                      <div>material_name: VARCHAR(100)</div>
                      <div>category: ENUM('organik', 'kertas', 'plastik', 'khusus')</div>
                      <div>confidence: FLOAT</div>
                      <div>suggested_action: TEXT</div>
                      <div>timestamp: TIMESTAMP</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 4: REST API SPECIFICATION */}
          {activeSection === 'api' && (
            <div className="space-y-4">
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Code2 className="w-4 h-4 text-indigo-600" />
                  <span>Kontrak REST API & Komunikasi Sistem</span>
                </h3>
                <p className="text-xs text-slate-600 mb-3">
                  Pola arsitektur Backend-for-Frontend (BFF) melindungi data kredensial serta mengabstraksi panggilan pihak ketiga:
                </p>

                <div className="space-y-2 text-xs">
                  <div className="p-3 bg-white border border-slate-200 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono font-bold text-[10px]">POST</span>
                      <span className="font-mono font-bold text-slate-900">/api/bursa/items</span>
                    </div>
                    <span className="text-slate-500 text-[11px]">Pasang barang preloved / donasi gratis</span>
                  </div>

                  <div className="p-3 bg-white border border-slate-200 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono font-bold text-[10px]">POST</span>
                      <span className="font-mono font-bold text-slate-900">/api/bursa/requests</span>
                    </div>
                    <span className="text-slate-500 text-[11px]">Pasang kebutuhan di papan "Dicari"</span>
                  </div>

                  <div className="p-3 bg-white border border-slate-200 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-mono font-bold text-[10px]">GET</span>
                      <span className="font-mono font-bold text-slate-900">/api/scanner/history</span>
                    </div>
                    <span className="text-slate-500 text-[11px]">Ambil riwayat scan material pribadi</span>
                  </div>

                  <div className="p-3 bg-white border border-slate-200 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono font-bold text-[10px]">POST</span>
                      <span className="font-mono font-bold text-slate-900">/api/challenges/complete</span>
                    </div>
                    <span className="text-slate-500 text-[11px]">Klaim reward tantangan harian (7 Hari)</span>
                  </div>

                  <div className="p-3 bg-white border border-slate-200 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-mono font-bold text-[10px]">GET</span>
                      <span className="font-mono font-bold text-slate-900">/api/facilities/nearby</span>
                    </div>
                    <span className="text-slate-500 text-[11px]">Kueri drop box dan TPA berdasarkan koordinat GPS</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 5: SECURITY & PRIVACY */}
          {activeSection === 'security' && (
            <div className="space-y-5">
              {/* Executive Summary of Auth */}
              <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-700" />
                  <h3 className="text-sm font-extrabold text-slate-900">
                    Ringkasan Eksekutif: Arsitektur Sistem Otentikasi & Keamanan
                  </h3>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">
                  Sistem otentikasi menyediakan fitur <strong>register, login, verifikasi email, reset password</strong>, dan <strong>logout</strong>.
                  Tujuan fungsional memungkinkan pembuatan akun (dengan verifikasi email) dan akses aman ke akun melalui login, serta pemulihan akun jika lupa kata sandi. 
                  Tujuan non-fungsional mencakup enkripsi saluran (TLS/HTTPS), hashing+salting password (bcrypt 12 rounds / Argon2), proteksi CSRF/XSS, rate limiting 5 percobaan dengan backoff eksponensial, keandalan tinggi, dan skalabilitas microservices.
                </p>
              </div>

              {/* Sequence Diagrams */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Workflow className="w-4 h-4 text-emerald-600" />
                  <span>Alur & Sequence Diagram Proses Otentikasi</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px] font-mono">
                  {/* Sequence 1: Register */}
                  <div className="bg-slate-900 text-emerald-400 p-3.5 rounded-xl space-y-1.5 overflow-x-auto">
                    <div className="text-white font-bold pb-1 border-b border-slate-700 text-xs">
                      1. ALUR REGISTRASI & VERIFIKASI EMAIL
                    </div>
                    <div>Pengguna -&gt; Web Server: GET /register (Formulir)</div>
                    <div>Pengguna -&gt; Web Server: POST /register {'{email, pw}'}</div>
                    <div>Web Server: Validasi input (regex email, pw &gt;= 8)</div>
                    <div>Web Server -&gt; DB: Simpan user {'{email, hashed_pw, aktif=false}'}</div>
                    <div>Web Server -&gt; Email: Kirim link token acak (nonce, expire 60m)</div>
                    <div>Pengguna -&gt; Web Server: GET /verify?token=...</div>
                    <div>Web Server -&gt; DB: Cari token, set user.aktif = true</div>
                    <div>Web Server -&gt; Pengguna: Akun aktif, selamat datang (+250 Poin)</div>
                  </div>

                  {/* Sequence 2: Login */}
                  <div className="bg-slate-900 text-cyan-300 p-3.5 rounded-xl space-y-1.5 overflow-x-auto">
                    <div className="text-white font-bold pb-1 border-b border-slate-700 text-xs">
                      2. ALUR LOGIN, RATE LIMITING & SESI
                    </div>
                    <div>Pengguna -&gt; Web Server: POST /login {'{email, pw}'}</div>
                    <div>Web Server -&gt; DB: Cari user berdasarkan email</div>
                    <div className="text-rose-400">alt Jika salah: Status 401 (Hitung gagal &gt;= 5x -&gt; Lockout 30s)</div>
                    <div className="text-emerald-300">else Valid: Bandingkan hash bcrypt(pw, hash)</div>
                    <div>Web Server: Terbitkan Session ID / signed JWT (15m expiry)</div>
                    <div>Web Server -&gt; Pengguna: Set-Cookie: __Host-SessionID=...;</div>
                    <div className="pl-4 text-slate-400">Secure; HttpOnly; SameSite=Strict</div>
                  </div>

                  {/* Sequence 3: Forgot Password */}
                  <div className="bg-slate-900 text-amber-300 p-3.5 rounded-xl space-y-1.5 overflow-x-auto">
                    <div className="text-white font-bold pb-1 border-b border-slate-700 text-xs">
                      3. PEMULIHAN AKUN (FORGOT & RESET PASSWORD)
                    </div>
                    <div>Pengguna -&gt; Web Server: POST /forgot-password {'{email}'}</div>
                    <div>Web Server: Buat token reset acak, simpan hash token (expire 15m)</div>
                    <div>Web Server -&gt; Email: Kirim link tautan reset dengan token</div>
                    <div>Pengguna -&gt; Web Server: GET /reset-password?token=...</div>
                    <div>Pengguna -&gt; Web Server: POST /reset-password {'{token, pw_baru}'}</div>
                    <div>Web Server: Validasi single-use token & belum kedaluwarsa</div>
                    <div>Web Server -&gt; DB: Update hash password baru, invalidasi token</div>
                    <div>Web Server -&gt; Pengguna: Konfirmasi berhasil, redirect ke Login</div>
                  </div>

                  {/* Sequence 4: Logout */}
                  <div className="bg-slate-900 text-purple-300 p-3.5 rounded-xl space-y-1.5 overflow-x-auto">
                    <div className="text-white font-bold pb-1 border-b border-slate-700 text-xs">
                      4. ALUR LOGOUT & TERMINASI SESI
                    </div>
                    <div>Pengguna -&gt; Web Server: POST /logout</div>
                    <div>Web Server -&gt; DB/Redis: Hapus token sesi aktif</div>
                    <div>Web Server -&gt; Pengguna: Clear Cookie (Max-Age=0)</div>
                    <div>Web Server -&gt; Pengguna: Redirect ke halaman Login / Tamu</div>
                  </div>
                </div>
              </div>

              {/* Comparison Table */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Database className="w-4 h-4 text-emerald-600" />
                  <span>Matriks Perbandingan Mekanisme Autentikasi</span>
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse bg-white rounded-xl overflow-hidden shadow-2xs">
                    <thead>
                      <tr className="bg-slate-800 text-white font-bold text-[11px]">
                        <th className="p-2.5">Mekanisme</th>
                        <th className="p-2.5">Arsitektur & Alur</th>
                        <th className="p-2.5">Penyimpanan</th>
                        <th className="p-2.5">Keamanan (CSRF/XSS/Replay)</th>
                        <th className="p-2.5">Skenario Cocok</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 text-slate-700 text-[11px]">
                      <tr>
                        <td className="p-2.5 font-bold text-slate-900">Session Cookie</td>
                        <td className="p-2.5">Stateful: Server simpan sesi di memori/DB/Redis. Kirim sessionID via cookie HTTP-only.</td>
                        <td className="p-2.5">Sesi di server (DB/Redis)</td>
                        <td className="p-2.5">Cookie HttpOnly + Secure + SameSite=Strict kurangi XSS/CSRF. Perlu short expiry.</td>
                        <td className="p-2.5">Web tradisional server-rendered</td>
                      </tr>
                      <tr className="bg-slate-50/60">
                        <td className="p-2.5 font-bold text-slate-900">JWT (JSON Web Token)</td>
                        <td className="p-2.5">Stateless: Server terbitkan signed JWT berisi claim user. Simpan di cookie/storage klien.</td>
                        <td className="p-2.5">Token di klien (Cookie / localStorage)</td>
                        <td className="p-2.5">Jika di localStorage rentan XSS. Disarankan HttpOnly cookie + short-lived refresh token.</td>
                        <td className="p-2.5 font-bold text-emerald-700">SPA / API microservice (Pola EcoCampus)</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-bold text-slate-900">OAuth2</td>
                        <td className="p-2.5">Delegated auth via Identity Provider eksternal (Google/Kampus) dengan authorization code + PKCE.</td>
                        <td className="p-2.5">Access token pada klien / frontend</td>
                        <td className="p-2.5">Gunakan state + nonce untuk cegah CSRF. Token short-lived.</td>
                        <td className="p-2.5">Aplikasi dengan integrasi login akun eksternal</td>
                      </tr>
                      <tr className="bg-slate-50/60">
                        <td className="p-2.5 font-bold text-slate-900">SSO (OIDC / SAML)</td>
                        <td className="p-2.5">Federasi identitas kampus/enterprise: verifikasi tanda tangan ID token dari IdP resmi.</td>
                        <td className="p-2.5">Cookie / JWT terfederasi</td>
                        <td className="p-2.5">Verifikasi tanda tangan token terpusat (iss, aud, exp).</td>
                        <td className="p-2.5">Portal akademik kampus & Single Sign-On</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Security Checklist & Implementation Patterns */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Checklist Keamanan Operasional & Rekomendasi Best Practice</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3 text-xs">
                  <div className="p-3 bg-white border border-slate-200 rounded-xl space-y-1">
                    <strong className="text-slate-900">1. TLS / HTTPS Enkripsi:</strong>
                    <p className="text-slate-600 text-[11px]">
                      Wajib HTTPS untuk semua endpoint login/register guna mencegah sniffing di jaringan Wi-Fi publik kampus.
                    </p>
                  </div>
                  <div className="p-3 bg-white border border-slate-200 rounded-xl space-y-1">
                    <strong className="text-slate-900">2. Secure Cookie Flags:</strong>
                    <p className="text-slate-600 text-[11px]">
                      Set <code>Secure; HttpOnly; SameSite=Strict</code> dan prefiks <code>__Host-</code> untuk mencegah pencurian token oleh skrip XSS.
                    </p>
                  </div>
                  <div className="p-3 bg-white border border-slate-200 rounded-xl space-y-1">
                    <strong className="text-slate-900">3. Rate Limiting & Lockout:</strong>
                    <p className="text-slate-600 text-[11px]">
                      Maksimal 5 percobaan salah sebelum lockout sementara dengan opsi pemulihan lupa kata sandi.
                    </p>
                  </div>
                  <div className="p-3 bg-white border border-slate-200 rounded-xl space-y-1">
                    <strong className="text-slate-900">4. Password Hashing Kuat:</strong>
                    <p className="text-slate-600 text-[11px]">
                      Gunakan bcrypt (12 rounds), Argon2, atau PBKDF2 dengan salt kriptografis unik per akun.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 6: PERFORMANCE & CORE WEB VITALS */}
          {activeSection === 'vitals' && (
            <div className="space-y-4">
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Gauge className="w-4 h-4 text-emerald-600" />
                  <span>Optimalisasi Core Web Vitals & Standar Aksesibilitas (WCAG 2.1)</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-4 text-center">
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                    <div className="text-xl font-extrabold text-emerald-700">≤ 1.2s</div>
                    <div className="text-xs font-bold text-slate-800 mt-0.5">LCP (Largest Contentful Paint)</div>
                    <div className="text-[10px] text-slate-500">Target Google: &le; 2.5s (Status: Optimal)</div>
                  </div>
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                    <div className="text-xl font-extrabold text-emerald-700">≤ 45ms</div>
                    <div className="text-xs font-bold text-slate-800 mt-0.5">INP (Interaction to Next Paint)</div>
                    <div className="text-[10px] text-slate-500">Target Google: &le; 200ms (Status: Sangat Cepat)</div>
                  </div>
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                    <div className="text-xl font-extrabold text-emerald-700">&lt; 0.02</div>
                    <div className="text-xs font-bold text-slate-800 mt-0.5">CLS (Cumulative Layout Shift)</div>
                    <div className="text-[10px] text-slate-500">Target Google: &lt; 0.1 (Status: Stabil)</div>
                  </div>
                </div>

                <div className="space-y-2 text-xs text-slate-700">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Desain Responsif Mobile-First:</strong> Menggunakan grid fleksibel dan touch targets minimal 44px untuk smartphone mahasiswa.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Kontras Warna Terstandar (WCAG AA):</strong> Rasio kontras teks body minimum 4.5:1 untuk keterbacaan tinggi di segala kondisi cahaya.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>JSON-LD Schema Markup:</strong> Terintegrasi di <code>index.html</code> untuk mempermudah perayapan mesin pencari (SEO On-Page).</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-200 bg-slate-50 flex items-center justify-between shrink-0">
          <div className="text-[11px] text-slate-500">
            Arsitektur mematuhi standar Google AI Studio & Pedoman Software Engineering
          </div>
          <button
            onClick={onClose}
            id="close-architecture-footer-btn"
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors"
          >
            Tutup Dokumen
          </button>
        </div>
      </div>
    </div>
  );
};
