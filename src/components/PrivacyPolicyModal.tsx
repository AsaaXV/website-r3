import React from 'react';
import { ShieldCheck, X, Lock, CheckCircle2, FileText, Database, Eye } from 'lucide-react';

interface PrivacyPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacyPolicyModal: React.FC<PrivacyPolicyModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        id="privacy-policy-modal"
        className="relative bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] shadow-2xl border border-slate-200 flex flex-col overflow-hidden text-slate-900"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900">
                Kebijakan Privasi & Ketentuan Layanan
              </h2>
              <p className="text-xs text-slate-500">
                Kepatuhan Perlindungan Data Pribadi (UU PDP & GDPR Compliance)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            id="close-privacy-modal-btn"
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5 text-xs sm:text-sm text-slate-700 leading-relaxed">
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-emerald-600" />
              1. Pengumpulan & Penggunaan Data
            </h3>
            <p className="text-xs text-slate-600">
              EcoCampus 3R mengumpulkan data minimal yang dibutuhkan untuk operasional platform: profil pengguna dasar (Nama, NIM/Fakultas), riwayat pemilahan sampah, transaksi bursa preloved, serta pesan interaksi antar-pengguna. Data ini digunakan murni untuk keperluan pencatatan jejak sirkularitas dan gamifikasi akademik.
            </p>
          </div>

          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-indigo-600" />
              2. Privasi Kamera & Pemrosesan AI
            </h3>
            <p className="text-xs text-slate-600">
              Akses kamera hanya aktif ketika pengguna menekan tombol "Mulai Kamera" di fitur AI Scanner. Citra foto sampah diproses secara lokal di browser dan melalui model inferensi untuk mendeteksi jenis material sampah. Tidak ada foto wajah atau data sensitif yang disimpan ke basis data publik.
            </p>
          </div>

          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-amber-600" />
              3. Penyimpanan Lokal (Local Storage & Cache)
            </h3>
            <p className="text-xs text-slate-600">
              Aplikasi menyimpan preferensi sesi, daftar barang bursa, serta riwayat scan di LocalStorage perangkat Anda. Pengguna memiliki kendali penuh untuk menghapus data lokal kapan saja melalui pengaturan peramban atau tombol keluar (logout).
            </p>
          </div>

          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-purple-600" />
              4. Keamanan Transaksi Bursa & Titik COD Aman
            </h3>
            <p className="text-xs text-slate-600">
              Pengguna disarankan selalu melakukan serah terima barang di <em>Safe COD Spots</em> (titik temu resmi kampus yang ramai dan berpenerangan baik) seperti Lobi Fakultas, Kantin Pusat, atau Perpustakaan demi keamanan bersama.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-200 bg-slate-50 flex justify-end shrink-0">
          <button
            onClick={onClose}
            id="accept-privacy-policy-btn"
            className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-colors"
          >
            Saya Memahami & Menyetujui
          </button>
        </div>
      </div>
    </div>
  );
};
