import React from 'react';
import { ItemRequest, UserProfile } from '../../types';
import { UserCheck, ShieldCheck, CheckCircle2, Trash2, Phone } from 'lucide-react';

interface ItemRequestCardProps {
  req: ItemRequest;
  currentUser?: UserProfile;
  isOwner: boolean;
  cancelingReqId: string | null;
  onSetCancelingReqId: (id: string | null) => void;
  onToggleFulfill: (reqId: string) => void;
  onCancelRequest: (reqId: string) => void;
}

export const ItemRequestCard: React.FC<ItemRequestCardProps> = ({
  req,
  isOwner,
  cancelingReqId,
  onSetCancelingReqId,
  onToggleFulfill,
  onCancelRequest,
}) => {
  const isFulfilled = req.status === 'fulfilled';
  const isUrgent = req.urgency === 'Segera';
  const displayName = req.requesterName || req.userName || 'Rekan Mahasiswa';
  const displayFaculty = req.requesterFaculty || req.userFaculty || 'Sivitas Akademika';
  const displayDate = req.postedAt || req.createdAt || 'Baru saja';
  const displaySpot = req.preferredMeetupPoint || req.preferredCodSpot || 'Lobi Utama Kampus';
  const rawWhatsapp = req.contactWhatsapp || '081234567890';
  const cleanWhatsapp = rawWhatsapp.replace(/^0/, '62').replace(/[^0-9]/g, '') || '6281234567890';
  const whatsappUrl = `https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent(
    `Halo ${displayName}, saya melihat postingan Anda di Papan Dicari SIPAS-Kampus mengenai "${req.title || 'Barang Kebutuhan'}". Saya memiliki barang tersebut dan siap bantu COD di ${displaySpot}.`
  )}`;

  return (
    <div
      className={`bg-white rounded-2xl border transition-all p-5 flex flex-col justify-between gap-4 shadow-xs hover:shadow-md ${
        isFulfilled
          ? 'border-slate-200 bg-slate-50/60 opacity-80'
          : isOwner
          ? 'border-teal-300 ring-1 ring-teal-200 shadow-sm'
          : isUrgent
          ? 'border-rose-200 hover:border-rose-400'
          : 'border-slate-200 hover:border-amber-400'
      }`}
    >
      <div className="space-y-3">
        {/* Urgency, Status Tags & Post Ownership Badge */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span
              className={`px-2.5 py-0.5 rounded-md text-[11px] font-black border flex items-center gap-1 ${
                req.urgency === 'Segera'
                  ? 'bg-rose-50 text-rose-700 border-rose-200'
                  : req.urgency === 'Santai'
                  ? 'bg-amber-50 text-amber-800 border-amber-200'
                  : 'bg-emerald-50 text-emerald-800 border-emerald-200'
              }`}
            >
              {req.urgency === 'Segera' && (
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
              )}
              <span>{req.urgency || 'Santai'}</span>
            </span>
            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-600">
              {req.category || 'Peralatan Kos'}
            </span>

            {/* Penanda bahwa postingan ini dibuat oleh akun yang sedang aktif */}
            {isOwner && (
              <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-teal-50 text-teal-700 border border-teal-200 flex items-center gap-1">
                <UserCheck className="w-3 h-3 text-teal-600" />
                <span>Postingan Anda</span>
              </span>
            )}
          </div>

          <span
            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
              isFulfilled
                ? 'bg-slate-200 text-slate-700'
                : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
            }`}
          >
            {isFulfilled ? '✓ Terpenuhi' : '● Mencari'}
          </span>
        </div>

        {/* Request Title & Description */}
        <div>
          <h3
            className={`font-black text-sm sm:text-base leading-snug ${
              isFulfilled ? 'line-through text-slate-500' : 'text-slate-900'
            }`}
          >
            {req.title || 'Barang Kebutuhan'}
          </h3>
          <p className="text-xs text-slate-600 mt-1 line-clamp-3 leading-relaxed">
            {req.description || 'Tidak ada deskripsi tambahan.'}
          </p>
        </div>

        {/* Requester & Safe Meetup Spot */}
        <div className="pt-2 border-t border-slate-100 space-y-2 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-amber-100 text-amber-800 font-black text-xs flex items-center justify-center">
              {(displayName.charAt(0) || 'M').toUpperCase()}
            </div>
            <div>
              <div className="font-bold text-slate-900 text-xs">{displayName}</div>
              <div className="text-[10px] text-slate-500">
                {displayFaculty} • {displayDate}
              </div>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-amber-50/60 border border-amber-200 text-[11px] text-amber-950 flex items-start gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Titik COD Aman Pilihan: </span>
              <span>{displaySpot}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="pt-2.5 border-t border-slate-100">
        {isOwner ? (
          cancelingReqId === req.id ? (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 space-y-2 text-xs">
              <p className="font-bold text-rose-800">
                Batalkan & hapus postingan ini dari Papan Dicari?
              </p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onCancelRequest(req.id)}
                  className="flex-1 py-1.5 px-3 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs cursor-pointer shadow-xs transition-colors"
                >
                  Ya, Batalkan
                </button>
                <button
                  type="button"
                  onClick={() => onSetCancelingReqId(null)}
                  className="py-1.5 px-3 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs cursor-pointer transition-colors"
                >
                  Kembali
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onToggleFulfill(req.id)}
                className={`flex-1 py-2 px-3 rounded-xl font-bold text-xs transition-colors cursor-pointer border flex items-center justify-center gap-1.5 shadow-2xs ${
                  isFulfilled
                    ? 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-200'
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-600'
                }`}
                title="Tentukan bahwa permintaan Anda sudah selesai atau ingin dibuka kembali"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{isFulfilled ? 'Buka Kembali' : 'Tandai Selesai'}</span>
              </button>

              <button
                type="button"
                onClick={() => onSetCancelingReqId(req.id)}
                className="py-2 px-3 rounded-xl font-bold text-xs transition-colors cursor-pointer border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 flex items-center justify-center gap-1.5 shadow-2xs"
                title="Batalkan dan hapus postingan ini"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Batalkan</span>
              </button>
            </div>
          )
        ) : isFulfilled ? (
          <div className="w-full py-2 px-3 rounded-xl bg-slate-100 border border-slate-200 text-slate-500 font-bold text-xs flex items-center justify-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-slate-400" />
            <span>Permintaan Telah Selesai / Terpenuhi</span>
          </div>
        ) : (
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer"
            className="w-full py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-2xs transition-colors"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Bantu via WA</span>
          </a>
        )}
      </div>
    </div>
  );
};
