import React, { useState } from 'react';
import {
  X,
  User,
  Star,
  ShieldCheck,
  Award,
  MessageSquare,
  ShoppingBag,
  Heart,
  Flame,
  CheckCircle2,
  Calendar,
  Send,
  ThumbsUp,
} from 'lucide-react';
import { UserProfile, UserReview } from '../types';
import { MOCK_USER_REVIEWS, REUSE_ITEMS } from '../data/mockData';

interface PublicProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile | null;
  onOpenChatWithUser: (user: UserProfile) => void;
}

export const PublicProfileModal: React.FC<PublicProfileModalProps> = ({
  isOpen,
  onClose,
  user,
  onOpenChatWithUser,
}) => {
  const [reviews, setReviews] = useState<UserReview[]>(MOCK_USER_REVIEWS);
  const [showAddReview, setShowAddReview] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [newReviewType, setNewReviewType] = useState<'Bursa Reuse' | 'Titip Pilah Sampah' | 'Barter Edukasi'>('Bursa Reuse');

  if (!isOpen || !user) return null;

  // Filter items posted by this user in Bursa Reuse
  const userItems = REUSE_ITEMS.filter(
    (item) => item.donorName.toLowerCase() === user.name.toLowerCase()
  );

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const newRev: UserReview = {
      id: `rev_${Date.now()}`,
      reviewerName: 'Mahasiswa Kampus (Anda)',
      reviewerAvatar:
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
      rating: newRating,
      comment: newComment.trim(),
      timestamp: 'Baru saja',
      transactionType: newReviewType,
    };

    setReviews([newRev, ...reviews]);
    setNewComment('');
    setShowAddReview(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-xl w-full p-5 sm:p-6 shadow-2xl border border-slate-200 my-auto animate-in fade-in zoom-in-95 duration-200 space-y-5 max-h-[90vh] overflow-y-auto">
        {/* Top bar */}
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Kartu Profil Rekan Mahasiswa 3R
          </span>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* User Banner & Avatar */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 p-4 rounded-2xl bg-gradient-to-br from-emerald-50 to-slate-50 border border-emerald-100">
          <div className="relative">
            <img
              src={user.avatarUrl}
              alt={user.name}
              className="w-20 h-20 rounded-2xl object-cover border-2 border-white shadow-md"
            />
            <div className="absolute -bottom-1 -right-1 bg-emerald-600 text-white p-1 rounded-full shadow-xs">
              <ShieldCheck className="w-3.5 h-3.5" />
            </div>
          </div>

          <div className="flex-1 text-center sm:text-left space-y-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h3 className="font-bold text-slate-900 text-lg">{user.name}</h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                Pengguna Terverifikasi
              </span>
            </div>
            <p className="text-xs text-slate-600 font-medium">
              {user.email} • {user.faculty}
            </p>

            {/* Peer rating bar */}
            <div className="flex items-center justify-center sm:justify-start gap-2 pt-1 text-xs">
              <div className="flex items-center text-amber-500 font-bold gap-1">
                <Star className="w-4 h-4 fill-amber-400" />
                <span>4.9 / 5.0</span>
              </div>
              <span className="text-slate-300">|</span>
              <span className="text-slate-500 text-[11px]">
                {reviews.length} Ulasan Kepuasan Transaksi
              </span>
            </div>
          </div>
        </div>

        {/* Eco Badges & Stats */}
        <div className="grid grid-cols-3 gap-2.5 text-center">
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
            <div className="text-base font-bold text-emerald-700">
              {user.ecoPoints.toLocaleString('id-ID')}
            </div>
            <div className="text-[10px] text-slate-500 font-semibold">Eco-Points</div>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
            <div className="text-base font-bold text-slate-900">
              {user.totalWeightDepositedKg} kg
            </div>
            <div className="text-[10px] text-slate-500 font-semibold">Pilah Sampah</div>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
            <div className="text-base font-bold text-amber-600 flex items-center justify-center gap-1">
              <Flame className="w-3.5 h-3.5 fill-amber-500" />
              <span>{user.currentStreakDays}w</span>
            </div>
            <div className="text-[10px] text-slate-500 font-semibold">Streak Berkelanjutan</div>
          </div>
        </div>

        {/* Main Action Buttons */}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenChatWithUser(user);
            }}
            className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Kirim Pesan Langsung</span>
          </button>
          <button
            type="button"
            onClick={() => setShowAddReview(!showAddReview)}
            className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
          >
            <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
            <span>Beri Ulasan</span>
          </button>
        </div>

        {/* Form Add Review (Collapsible) */}
        {showAddReview && (
          <form onSubmit={handleAddReview} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="font-bold text-xs text-slate-800 flex items-center gap-1.5">
              <ThumbsUp className="w-3.5 h-3.5 text-emerald-600" />
              <span>Tulis Ulasan Kepuasan Transaksi Antar-Pengguna</span>
            </div>

            <div className="flex items-center gap-3 text-xs">
              <span className="text-slate-600 font-semibold">Beri Bintang:</span>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    onClick={() => setNewRating(star)}
                    className="p-1"
                  >
                    <Star
                      className={`w-4 h-4 ${
                        star <= newRating
                          ? 'text-amber-500 fill-amber-400'
                          : 'text-slate-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <input
                type="text"
                required
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Contoh: Sangat ramah, COD tepat waktu di kantin danau..."
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:border-emerald-500 outline-none bg-white"
              />
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowAddReview(false)}
                className="px-3 py-1.5 text-xs text-slate-500 hover:text-slate-700"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold"
              >
                Kirim Ulasan
              </button>
            </div>
          </form>
        )}

        {/* Peer Reviews List */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-900">
              Ulasan & Testimoni Rekan Kampus ({reviews.length})
            </span>
          </div>
          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {reviews.map((rev) => (
              <div
                key={rev.id}
                className="p-2.5 rounded-xl bg-white border border-slate-200 space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img
                      src={rev.reviewerAvatar}
                      alt={rev.reviewerName}
                      className="w-6 h-6 rounded-full object-cover"
                    />
                    <span className="text-xs font-bold text-slate-900">
                      {rev.reviewerName}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      • {rev.timestamp}
                    </span>
                  </div>
                  <div className="flex items-center text-amber-500">
                    {Array.from({ length: rev.rating }).map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-amber-400" />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  "{rev.comment}"
                </p>
                <span className="inline-block text-[9px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                  {rev.transactionType}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
