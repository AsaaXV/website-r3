import React from 'react';
import { X, CheckCircle2, User, KeyRound, ShieldAlert, GraduationCap, Building2 } from 'lucide-react';
import { UserProfile, UserRole } from '../types';
import { INITIAL_USER, OPERATOR_USER, ADMIN_USER } from '../data/mockData';

interface RoleSwitchModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  onSelectUser: (user: UserProfile) => void;
}

export const RoleSwitchModal: React.FC<RoleSwitchModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onSelectUser,
}) => {
  if (!isOpen) return null;

  const usersList = [
    {
      user: INITIAL_USER,
      badge: 'Mahasiswa / Nasabah 3R',
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      description: 'Akses penuh untuk setor sampah, scan YOLOv8, lihat saldo Eco-Points, tantangan 7 hari, dan bursa reuse.',
    },
    {
      user: OPERATOR_USER,
      badge: 'Operator Lapangan TPST / Bank Sampah',
      badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
      description: 'Otoritas memverifikasi timbangan fisik, membuka transaksi yang terkunci sistem anti-cheat, dan memonitor rute VRP.',
    },
    {
      user: ADMIN_USER,
      badge: 'Direktur Green Campus / Administrator',
      badgeColor: 'bg-purple-100 text-purple-800 border-purple-200',
      description: 'Akses tata kelola komprehensif, evaluasi metrik usabilitas SUS, pemantauan emisi karbon, dan audit buku besar.',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center">
              <KeyRound className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                Simulasi Kampus SSO & Multi-Role
              </h3>
              <p className="text-xs text-slate-500">
                Google Workspace / SIAKAD SSO Terpadu (Bagian 5.1 Dokumen)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-3">
          {usersList.map(({ user, badge, badgeColor, description }) => {
            const isSelected = currentUser.id === user.id;
            return (
              <div
                key={user.id}
                onClick={() => {
                  onSelectUser(user);
                  onClose();
                }}
                className={`p-4 rounded-xl border cursor-pointer transition-all space-y-2 ${
                  isSelected
                    ? 'bg-emerald-50/70 border-emerald-500 ring-2 ring-emerald-400'
                    : 'bg-slate-50/60 border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={user.avatarUrl}
                      alt={user.name}
                      className="w-10 h-10 rounded-full object-cover border border-slate-200"
                    />
                    <div>
                      <div className="font-bold text-slate-900 text-xs sm:text-sm flex items-center gap-1.5">
                        <span>{user.name}</span>
                        {isSelected && (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        )}
                      </div>
                      <div className="text-[11px] text-slate-500 font-mono">
                        {user.email} • {user.role === 'petugas_tps' ? 'Operator TPST' : user.role === 'admin_kampus' ? 'Admin / Pengelola' : 'Pengguna Komunitas'}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${badgeColor}`}>
                    {badge}
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">
                    {user.faculty}
                  </span>
                </div>

                <p className="text-[11px] text-slate-600 leading-relaxed">
                  {description}
                </p>
              </div>
            );
          })}
        </div>

        <div className="pt-2 text-center">
          <p className="text-[11px] text-slate-400">
            Otentikasi menggunakan JWT Token & Single Sign-On mencegah akun ganda dan manipulasi saldo Eco-Points.
          </p>
        </div>
      </div>
    </div>
  );
};
