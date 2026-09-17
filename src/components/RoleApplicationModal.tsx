import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  Send,
  FileCheck,
  CheckCircle2,
  AlertCircle,
  Clock,
  Building2,
  GraduationCap,
  Users,
} from 'lucide-react';
import { UserProfile, UserRole } from '../types';
import { submitRoleRequest } from '../utils/surveyStorage';

interface RoleApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  onSubmitSuccess?: () => void;
}

export const RoleApplicationModal: React.FC<RoleApplicationModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onSubmitSuccess,
}) => {
  const [requestedRole, setRequestedRole] = useState<UserRole>('dosen');
  const [identityNumber, setIdentityNumber] = useState('');
  const [reason, setReason] = useState('');
  const [evidence, setEvidence] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const roleOptions: { id: UserRole; title: string; desc: string; icon: any }[] = [
    {
      id: 'dosen',
      title: 'Dosen / Tenaga Pendidik UNM',
      desc: 'Verifikasi hak dosen untuk memonitor tugas daur ulang mahasiswa & riset sirkular.',
      icon: GraduationCap,
    },
    {
      id: 'petugas_tps',
      title: 'Pengelola / Petugas TPST Kampus',
      desc: 'Otoritas verifikasi penimbangan fisik sampah, input timbangan, & buku kas TPS3R.',
      icon: Building2,
    },
    {
      id: 'mitra',
      title: 'Mitra Daur Ulang / Bank Sampah Unit',
      desc: 'Akses koordinasi penjemputan logistik dan serah terima limbah anorganik bernilai jual.',
      icon: Users,
    },
    {
      id: 'admin_kampus',
      title: 'Administrator Green Campus UNM',
      desc: 'Hak tata kelola penuh, pembuat survei dinamis, approval pengajuan peran, & analisis emisi.',
      icon: ShieldCheck,
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!identityNumber.trim() || !reason.trim() || !evidence.trim()) {
      setErrorMsg('Harap lengkapi semua kolom persyaratan sebelum mengajukan.');
      return;
    }

    setIsSubmitting(true);

    try {
      submitRoleRequest(
        currentUser.id,
        currentUser.name,
        currentUser.faculty,
        requestedRole,
        identityNumber.trim(),
        reason.trim(),
        evidence.trim()
      );

      setIsSubmitting(false);
      setIsSuccess(true);
      if (onSubmitSuccess) onSubmitSuccess();
    } catch (err) {
      console.error('Error submitting role application:', err);
      setErrorMsg('Terjadi kendala saat menyimpan pengajuan. Silakan coba lagi.');
      setIsSubmitting(false);
    }
  };

  return (
    <div
      id="role-application-modal-backdrop"
      className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto"
    >
      <div className="bg-white dark:bg-[#111827] rounded-3xl max-w-xl w-full my-auto shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 bg-slate-50/70 dark:bg-[#162032]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base sm:text-lg">
                Pengajuan Perubahan Peran Resmi
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Sistem Otorisasi & Verifikasi Identitas Sivitas UNM
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-300 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 space-y-5">
          {isSuccess ? (
            <div className="text-center py-8 space-y-3">
              <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-xs">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 dark:text-white">
                Permohonan Berhasil Dikirimkan!
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
                Permohonan peningkatan peran Anda telah masuk ke antrean persetujuan tim Administrator Green Campus UNM.
                Status akan diperbarui setelah verifikasi berkas selesai.
              </p>
              <div className="pt-3">
                <button
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-500 transition-all cursor-pointer"
                >
                  Selesai
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 text-amber-900 dark:text-amber-300 flex items-start gap-2.5">
                <Clock className="w-4 h-4 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
                <div className="leading-snug">
                  Perubahan peran tidak lagi dilakukan secara instan demi integritas audit. Setiap permohonan ditinjau
                  secara objektif oleh Administrator Kampus berdasarkan nomor SK / bukti resmi.
                </div>
              </div>

              {/* Role Selection Options */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 dark:text-slate-300">
                  Pilih Peran yang Diajukan:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {roleOptions.map((opt) => {
                    const Icon = opt.icon;
                    const isSelected = requestedRole === opt.id;
                    return (
                      <div
                        key={opt.id}
                        onClick={() => setRequestedRole(opt.id)}
                        className={`p-3 rounded-xl border cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-950 dark:text-emerald-100 ring-1 ring-emerald-400'
                            : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <Icon className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                          <span className="font-bold">{opt.title}</span>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                          {opt.desc}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Identity Number (NIM / NIP / NIDN) */}
              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">
                  Nomor Identitas Resmi (NIP / NIDN / NIM / ID Staf):
                </label>
                <input
                  type="text"
                  value={identityNumber}
                  onChange={(e) => setIdentityNumber(e.target.value)}
                  placeholder="Contoh: 198504122010121002 atau 220209501045"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              {/* Reason */}
              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">
                  Alasan Permohonan Peran:
                </label>
                <textarea
                  rows={2}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Jelaskan kebutuhan peran ini untuk mendukung kegiatan akademik, riset, atau operasional TPST..."
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              {/* Evidence */}
              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">
                  Bukti / Nomor Surat Keputusan / Surat Tugas:
                </label>
                <input
                  type="text"
                  value={evidence}
                  onChange={(e) => setEvidence(e.target.value)}
                  placeholder="Contoh: SK Dekan FT No. 120/UN36/2026 atau Surat Tugas TPST Parangtambung"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              {errorMsg && (
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-rose-50 text-rose-800 border border-rose-200 text-xs font-semibold">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center gap-1.5 transition-all shadow-md shadow-emerald-600/20 disabled:opacity-50 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? 'Mengirim...' : 'Kirim Pengajuan'}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
