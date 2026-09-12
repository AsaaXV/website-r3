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
  UserCheck
} from 'lucide-react';
import { LedgerTransaction, UserProfile } from '../types';

interface LedgerAuditViewProps {
  currentUser: UserProfile;
  transactions: LedgerTransaction[];
  onVerifyTransaction: (txId: string) => void;
  onRejectTransaction: (txId: string) => void;
}

export const LedgerAuditView: React.FC<LedgerAuditViewProps> = ({
  currentUser,
  transactions,
  onVerifyTransaction,
  onRejectTransaction,
}) => {
  const [filterStatus, setFilterStatus] = useState<'all' | 'flagged' | 'verified'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedTx, setSelectedTx] = useState<LedgerTransaction | null>(null);

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

        <div className="flex items-center gap-1.5 self-start sm:self-auto">
          <span className="text-xs text-slate-500 font-medium">Status:</span>
          {(['all', 'flagged', 'verified'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                filterStatus === st
                  ? 'bg-slate-900 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st === 'all' ? 'Semua' : st === 'flagged' ? 'Anomali' : 'Terverifikasi'}
            </button>
          ))}
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
    </div>
  );
};
