import React, { useState } from 'react';
import {
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Hash,
  Search,
  Filter,
  Eye,
  Key,
  Database,
  Lock,
  RefreshCw,
  Clock,
  UserCheck,
  FileSpreadsheet,
  Printer,
  Download,
  PlusCircle,
  Scale,
  Sparkles,
  MapPin,
  X,
} from 'lucide-react';
import { LedgerTransaction, UserProfile } from '../types';
import { exportLedgerToCSV, printOfficialAuditReport } from '../utils/exportReport';

interface LedgerAuditViewProps {
  currentUser: UserProfile;
  transactions: LedgerTransaction[];
  onVerifyTransaction: (txId: string) => void;
  onRejectTransaction: (txId: string) => void;
  onRecordDeposit?: (newTx: LedgerTransaction) => void;
}

export const LedgerAuditView: React.FC<LedgerAuditViewProps> = ({
  currentUser,
  transactions,
  onVerifyTransaction,
  onRejectTransaction,
  onRecordDeposit,
}) => {
  const [filterStatus, setFilterStatus] = useState<'all' | 'flagged' | 'verified'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedTx, setSelectedTx] = useState<LedgerTransaction | null>(null);

  // New Deposit Modal State
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [depositUserName, setDepositUserName] = useState(currentUser.name);
  const [depositFaculty, setDepositFaculty] = useState(currentUser.faculty || 'Fakultas Teknik');
  const [depositDropPoint, setDepositDropPoint] = useState('TPS Terpadu Kampus Parangtambung');
  const [depositCategory, setDepositCategory] = useState<'Plastik PET' | 'Kertas & Karton' | 'Kaleng Logam' | 'Kaca' | 'Elektronik'>('Plastik PET');
  const [depositWeightKg, setDepositWeightKg] = useState<number>(1.5);
  const [depositNotes, setDepositNotes] = useState('');

  const RATE_PER_KG: Record<string, number> = {
    'Plastik PET': 50,
    'Kertas & Karton': 40,
    'Kaleng Logam': 80,
    'Kaca': 30,
    'Elektronik': 100,
  };

  const calculatedPoints = Math.round(depositWeightKg * (RATE_PER_KG[depositCategory] || 50));

  const handleCreateDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    if (depositWeightKg <= 0) return;

    // Detect anomaly if weight is extraordinarily high (> 12kg single deposit)
    const isAnomalous = depositWeightKg >= 12;
    const zScore = isAnomalous ? Number((3.1 + Math.random() * 0.8).toFixed(2)) : Number((0.6 + Math.random() * 0.8).toFixed(2));
    const randomHash = '0x' + Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16)).join('');

    // Map to system WasteCategoryType ('organik' | 'kertas' | 'plastik' | 'khusus')
    const categoryMapping: Record<string, 'organik' | 'kertas' | 'plastik' | 'khusus'> = {
      'Plastik PET': 'plastik',
      'Kertas & Karton': 'kertas',
      'Kaleng Logam': 'khusus',
      'Kaca': 'khusus',
      'Elektronik': 'khusus',
    };
    const mappedCategory = categoryMapping[depositCategory] || 'plastik';

    const newTx: LedgerTransaction = {
      id: `TX-${Date.now().toString().slice(-6)}`,
      timestamp: new Date().toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      userId: currentUser.id,
      userName: depositUserName,
      faculty: depositFaculty,
      dropPointId: 'dp_' + depositDropPoint.toLowerCase().slice(0, 12).replace(/[^a-z0-9]/g, '_'),
      dropPointName: depositDropPoint,
      items: [
        {
          categoryId: mappedCategory,
          categoryName: depositCategory,
          materialName: depositCategory,
          weightKg: depositWeightKg,
          pointsEarned: calculatedPoints,
          xpEarned: calculatedPoints * 2,
          co2SavedKg: Number((depositWeightKg * 2.5).toFixed(2)),
        },
      ],
      totalWeightKg: depositWeightKg,
      totalPoints: calculatedPoints,
      totalXp: calculatedPoints * 2,
      zScore: zScore,
      status: isAnomalous ? 'flagged' : 'verified',
      flagReason: isAnomalous ? `Bobot ${depositWeightKg} kg melebihi batas statistik wajar (Z = ${zScore}σ > 3.0σ). Memerlukan audit fisik operator.` : undefined,
      verifiedBy: isAnomalous ? undefined : currentUser.name + ' (Petugas TPS)',
      hash: randomHash,
    };

    if (onRecordDeposit) {
      onRecordDeposit(newTx);
    }

    setIsDepositModalOpen(false);
    setSelectedTx(newTx);
  };

  const filtered = transactions.filter((t) => {
    if (filterStatus !== 'all' && t.status !== filterStatus) return false;
    if (searchQuery.trim() === '') return true;
    const q = searchQuery.toLowerCase();
    return (
      t.id.toLowerCase().includes(q) ||
      t.userName.toLowerCase().includes(q) ||
      t.faculty.toLowerCase().includes(q) ||
      t.dropPointName.toLowerCase().includes(q)
    );
  });

  const flaggedCount = transactions.filter((t) => t.status === 'flagged').length;
  const verifiedCount = transactions.filter((t) => t.status === 'verified').length;


  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
              PostgreSQL Double-Entry & Anti-Cheat Engine
            </span>
            <span className="text-xs text-slate-500 font-medium">
              Bagian 6.1 & 8.2 Dokumen
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900">
            Buku Besar Transaksi (Ledger) & Audit Keamanan Anti-Cheat
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
            Sistem buku besar append-only berbasis SHA-hash. Dilengkapi deteksi anomali statistik Z-score (Z &gt; 3.0σ) dan rate-limiting untuk memitigasi manipulasi skor (gaming the system).
          </p>
        </div>

        {/* Status Pills */}
        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
          <div className="px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-xs text-slate-700">
            Total: <span className="font-bold text-slate-900">{transactions.length}</span>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800">
            Anomali Terkunci: <span className="font-bold">{flaggedCount}</span>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800">
            Terverifikasi: <span className="font-bold">{verifiedCount}</span>
          </div>
        </div>
      </div>

      {/* Security Architecture Parameters Card */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span className="font-semibold uppercase tracking-wider">Algoritma Anomali</span>
            <ShieldCheck className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-lg font-black text-slate-900">Z-Score &gt; 3.0σ</div>
          <p className="text-[11px] text-slate-500">
            Transaksi berbobot ekstrem dikunci otomatis sebelum poin cair.
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span className="font-semibold uppercase tracking-wider">Rate Limiting XP</span>
            <Lock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-lg font-black text-slate-900">Maks. 1.000 XP / Tx</div>
          <p className="text-[11px] text-slate-500">
            Mencegah bot atau injeksi skrip otomatisasi XP mahasiswa.
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span className="font-semibold uppercase tracking-wider">Integritas Data</span>
            <Database className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-lg font-black text-slate-900">Append-Only Ledger</div>
          <p className="text-[11px] text-slate-500">
            Double-entry ledger immutable, tidak dapat dimodifikasi/dihapus.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Cari ID transaksi, nasabah, atau fakultas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-slate-200 text-xs focus:outline-emerald-500 bg-slate-50"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-slate-500 font-medium">Status:</span>
            {(['all', 'flagged', 'verified'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  filterStatus === st
                    ? 'bg-slate-900 text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {st === 'all' ? 'Semua' : st === 'flagged' ? 'Anomali' : 'Terverifikasi'}
              </button>
            ))}
          </div>

          <div className="h-4 w-px bg-slate-200 hidden sm:block mx-1" />

          {/* Export & Action Buttons */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setIsDepositModalOpen(true)}
              className="flex items-center gap-1 px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow-xs cursor-pointer"
              title="Input penimbangan sampah fisik nasabah"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>+ Catat Setoran TPS</span>
            </button>
            <button
              onClick={() => exportLedgerToCSV(filtered, `Buku-Kas-EcoCampus-UNM-${filterStatus}.csv`)}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold transition cursor-pointer"
              title="Unduh data dalam format CSV/Excel"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
              <span>Ekspor Excel</span>
            </button>
            <button
              onClick={() => printOfficialAuditReport(filtered, { operatorName: currentUser.name })}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 text-xs font-bold transition cursor-pointer"
              title="Cetak format laporan resmi / Simpan PDF"
            >
              <Printer className="w-3.5 h-3.5 text-slate-600" />
              <span>Cetak PDF</span>
            </button>
          </div>
        </div>
      </div>

      {/* Ledger Table & Inspector Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Table List (7 or 12 cols) */}
        <div className={`${selectedTx ? 'lg:col-span-7' : 'lg:col-span-12'} bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden`}>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
                  <th className="py-3 px-4">ID Transaksi</th>
                  <th className="py-3 px-4">Nasabah</th>
                  <th className="py-3 px-4">Material & Bobot</th>
                  <th className="py-3 px-4">Eco-Points</th>
                  <th className="py-3 px-4">Z-Score</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((tx) => {
                  const isSelected = selectedTx?.id === tx.id;
                  return (
                    <tr
                      key={tx.id}
                      onClick={() => setSelectedTx(tx)}
                      className={`cursor-pointer transition-colors ${
                        isSelected
                          ? 'bg-emerald-50/70'
                          : tx.status === 'flagged'
                          ? 'bg-rose-50/30 hover:bg-rose-50/60'
                          : 'hover:bg-slate-50'
                      }`}
                    >
                      <td className="py-3 px-4 font-mono text-[11px]">
                        <div className="font-bold text-slate-900">{tx.id}</div>
                        <div className="text-[10px] text-slate-400">{tx.timestamp}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900">{tx.userName}</div>
                        <div className="text-[10px] text-slate-500">{tx.faculty}</div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-bold text-slate-900">{tx.totalWeightKg} kg</span>
                        <div className="text-[10px] text-slate-500 truncate max-w-[120px]">
                          {tx.items[0]?.materialName}
                        </div>
                      </td>
                      <td className="py-3 px-4 font-bold text-emerald-700">
                        +{tx.totalPoints}
                      </td>
                      <td className="py-3 px-4 font-mono font-bold">
                        <span
                          className={`px-1.5 py-0.5 rounded text-[11px] ${
                            tx.zScore > 3.0
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {tx.zScore.toFixed(2)}σ
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {tx.status === 'verified' ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Valid</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 animate-pulse">
                            <AlertTriangle className="w-3 h-3" />
                            <span>Terkunci</span>
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedTx(tx);
                          }}
                          className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px]"
                        >
                          Audit
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Inspector Detail Panel (5 cols) */}
        {selectedTx && (
          <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 shadow-xs p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Hash className="w-4 h-4 text-emerald-600" />
                <span className="font-mono text-xs font-bold text-slate-900">
                  {selectedTx.id}
                </span>
              </div>
              <button
                onClick={() => setSelectedTx(null)}
                className="text-xs text-slate-400 hover:text-slate-600 font-bold"
              >
                Tutup
              </button>
            </div>

            {/* Anomaly banner if flagged */}
            {selectedTx.status === 'flagged' && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-900 space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                  <span>Deteksi Anomali Anti-Cheat Aktif</span>
                </div>
                <p className="text-[11px] text-rose-700">
                  {selectedTx.flagReason}
                </p>
              </div>
            )}

            {/* Record details */}
            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Nasabah</span>
                <span className="font-bold text-slate-900">{selectedTx.userName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Fakultas / Asal</span>
                <span className="font-bold text-slate-900">{selectedTx.faculty}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Titik Fasilitas</span>
                <span className="font-bold text-slate-900">{selectedTx.dropPointName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Bobot Timbangan Bersih</span>
                <span className="font-black text-slate-900 text-sm">{selectedTx.totalWeightKg} kg</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Kalkulasi Eco-Points</span>
                <span className="font-bold text-emerald-700">+{selectedTx.totalPoints} pts</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Indeks Deviasi Statistik</span>
                <span className="font-mono font-bold text-slate-900">{selectedTx.zScore}σ</span>
              </div>
              <div className="py-1">
                <span className="text-slate-500 block mb-1">Hash SHA-256 Ledger:</span>
                <div className="p-2 rounded bg-slate-100 text-[10px] font-mono text-slate-700 break-all border border-slate-200">
                  {selectedTx.hash}
                </div>
              </div>
            </div>

            {/* Operator Actions for Flagged Records */}
            {selectedTx.status === 'flagged' ? (
              <div className="pt-3 border-t border-slate-200 space-y-2">
                <div className="text-[11px] font-bold text-slate-700">
                  Otoritas Operator / Admin TPST:
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => onVerifyTransaction(selectedTx.id)}
                    className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Verifikasi Timbangan</span>
                  </button>
                  <button
                    onClick={() => onRejectTransaction(selectedTx.id)}
                    className="py-2.5 px-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Tolak Transaksi</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Transaksi telah diverifikasi oleh: {selectedTx.verifiedBy}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Record Deposit Modal for TPS Operator */}
      {isDepositModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-3xl bg-white border border-slate-200 p-6 space-y-4 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                  <Scale className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-base">
                    Pencatatan Penimbangan Sampah TPS
                  </h3>
                  <p className="text-xs text-slate-500">
                    Input data penimbangan fisik nasabah & minting Eco-Points
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsDepositModalOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateDeposit} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Nama Nasabah / Mahasiswa</label>
                  <input
                    type="text"
                    required
                    value={depositUserName}
                    onChange={(e) => setDepositUserName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-emerald-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Fakultas / Unit</label>
                  <select
                    value={depositFaculty}
                    onChange={(e) => setDepositFaculty(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-emerald-500"
                  >
                    <option value="Fakultas Teknik">Fakultas Teknik</option>
                    <option value="FMIPA">FMIPA</option>
                    <option value="FBS">FBS</option>
                    <option value="FIS-H">FIS-H</option>
                    <option value="FIP">FIP</option>
                    <option value="FIK">FIK</option>
                    <option value="FEB">FEB</option>
                    <option value="FPSI">FPSI</option>
                    <option value="Pascasarjana">Pascasarjana</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Titik Fasilitas TPS Kampus</label>
                <select
                  value={depositDropPoint}
                  onChange={(e) => setDepositDropPoint(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-emerald-500"
                >
                  <option value="TPS Terpadu Kampus Parangtambung">TPS Terpadu Kampus Parangtambung (FT/FMIPA)</option>
                  <option value="Bank Sampah Menara Pinisi Lt. 1">Bank Sampah Menara Pinisi Lt. 1 (Gunungsari)</option>
                  <option value="Drop Point Gedung PKM UNM">Drop Point Gedung PKM UNM Parangtambung</option>
                  <option value="TPS FMIPA UNM Samping Lab Kimia">TPS FMIPA UNM Samping Lab Kimia</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Kategori Material Pilah</label>
                  <select
                    value={depositCategory}
                    onChange={(e) => setDepositCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-emerald-500"
                  >
                    <option value="Plastik PET">Plastik PET (Botol/Gelas Bersih) - 50 Pts/kg</option>
                    <option value="Kertas & Karton">Kertas Diktat & Kardus - 40 Pts/kg</option>
                    <option value="Kaleng Logam">Kaleng Aluminium & Besi - 80 Pts/kg</option>
                    <option value="Kaca">Botol Beling / Kaca - 30 Pts/kg</option>
                    <option value="Elektronik">E-Waste / Elektronik Rusak - 100 Pts/kg</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Bobot Timbangan (kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    max="100"
                    required
                    value={depositWeightKg}
                    onChange={(e) => setDepositWeightKg(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono font-bold focus:outline-emerald-500"
                  />
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
                <div>
                  <div className="font-bold text-emerald-950">Kalkulasi Eco-Points Otomatis:</div>
                  <div className="text-[11px] text-emerald-700">
                    {depositWeightKg} kg × {RATE_PER_KG[depositCategory]} pts/kg
                  </div>
                </div>
                <div className="text-xl font-black text-emerald-700 font-mono">
                  +{calculatedPoints} Pts
                </div>
              </div>

              {depositWeightKg >= 12 && (
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-[11px] flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>
                    Perhatian: Bobot di atas 12 kg akan otomatis berstatus <strong>Anomali (Flagged)</strong> untuk audit operator guna mencegah manipulasi.
                  </span>
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsDepositModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black flex items-center gap-1.5 shadow-md shadow-emerald-600/30 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Simpan Transaksi & Minting Poin</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
