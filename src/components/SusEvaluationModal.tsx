import React, { useState } from 'react';
import {
  ClipboardCheck,
  X,
  CheckCircle2,
  HelpCircle,
  Award,
  Layers,
  Sparkles,
  Info
} from 'lucide-react';
import { SUS_QUESTIONS } from '../data/mockData';

interface SusEvaluationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveScore: (newScore: number) => void;
  currentScore: number;
}

export const SusEvaluationModal: React.FC<SusEvaluationModalProps> = ({
  isOpen,
  onClose,
  onSaveScore,
  currentScore,
}) => {
  // 10 answers with initial realistic positive response (mix of 4s and 5s for positive, 1s and 2s for negative)
  const [answers, setAnswers] = useState<number[]>([5, 1, 5, 1, 4, 1, 5, 1, 4, 1]);
  const [activeTab, setActiveTab] = useState<'survey' | 'empathy'>('survey');
  const [submitted, setSubmitted] = useState<boolean>(false);

  if (!isOpen) return null;

  // John Brooke's SUS score formula:
  // Odd questions: (score - 1)
  // Even questions: (5 - score)
  // Total * 2.5
  const calculateSus = (ans: number[]): number => {
    let sum = 0;
    for (let i = 0; i < ans.length; i++) {
      if (i % 2 === 0) {
        // odd question (index 0, 2, 4, 6, 8)
        sum += ans[i] - 1;
      } else {
        // even question (index 1, 3, 5, 7, 9)
        sum += 5 - ans[i];
      }
    }
    return Math.min(100, Math.max(0, Number((sum * 2.5).toFixed(1))));
  };

  const calculatedScore = calculateSus(answers);

  const getAdjectiveRating = (score: number) => {
    if (score >= 80) return { label: 'Best Imaginable (A+)', color: 'text-emerald-700 bg-emerald-100 border-emerald-300' };
    if (score >= 68) return { label: 'Acceptable / Good (B)', color: 'text-blue-700 bg-blue-100 border-blue-300' };
    if (score >= 50) return { label: 'Marginal / Poor (C)', color: 'text-amber-700 bg-amber-100 border-amber-300' };
    return { label: 'Unacceptable (F)', color: 'text-rose-700 bg-rose-100 border-rose-300' };
  };

  const currentAdjective = getAdjectiveRating(calculatedScore);

  const handleScoreChange = (index: number, val: number) => {
    const updated = [...answers];
    updated[index] = val;
    setAnswers(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveScore(calculatedScore);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 flex flex-col">
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-slate-200 flex items-center justify-between sticky top-0 bg-white z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
              <ClipboardCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-slate-900">
                  Evaluasi Metrik Usabilitas (System Usability Scale)
                </h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-800 border border-indigo-200">
                  Bagian 4 Dokumen
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Instrumen psikometrik standar John Brooke (1986) untuk mengukur ergonomi kognitif UI/UX
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

        {/* Tab switchers */}
        <div className="px-6 pt-4 flex gap-2 border-b border-slate-100">
          <button
            onClick={() => setActiveTab('survey')}
            className={`pb-2.5 text-xs font-bold border-b-2 transition-all ${
              activeTab === 'survey'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            10 Pertanyaan SUS Kuantitatif
          </button>
          <button
            onClick={() => setActiveTab('empathy')}
            className={`pb-2.5 text-xs font-bold border-b-2 transition-all ${
              activeTab === 'empathy'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Sintesis Empathy Map (Says, Thinks, Does, Feels)
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 flex-1">
          {activeTab === 'survey' ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Score Preview Banner */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-indigo-50 to-slate-50 border border-indigo-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="text-[10px] font-bold text-indigo-900 uppercase tracking-wider">
                    Hasil Komputasi Matematis Skala SUS
                  </div>
                  <div className="text-2xl font-black text-slate-900 mt-0.5">
                    {calculatedScore} <span className="text-xs font-normal text-slate-500">/ 100</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold border ${currentAdjective.color}`}>
                    {currentAdjective.label}
                  </span>
                  <span className="text-xs text-slate-500">
                    Baseline: 68.0
                  </span>
                </div>
              </div>

              {/* 10 Questions List */}
              <div className="space-y-4">
                {SUS_QUESTIONS.map((q, idx) => {
                  const isOdd = idx % 2 === 0;
                  return (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2.5"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="text-xs font-bold text-slate-900 flex items-start gap-2">
                          <span className="w-5 h-5 rounded bg-indigo-100 text-indigo-700 flex items-center justify-center text-[10px] font-black shrink-0">
                            {idx + 1}
                          </span>
                          <span>{q}</span>
                        </div>
                        <span className="text-[10px] font-mono text-slate-400 shrink-0">
                          {isOdd ? '(Skor Positif)' : '(Skor Terbalik)'}
                        </span>
                      </div>

                      {/* 1 to 5 Likert radio selection */}
                      <div className="flex items-center justify-between max-w-md pt-1">
                        <span className="text-[10px] text-slate-400 font-medium">Sangat Tidak Setuju (1)</span>
                        <div className="flex items-center gap-3">
                          {[1, 2, 3, 4, 5].map((val) => (
                            <label
                              key={val}
                              className="flex flex-col items-center gap-1 cursor-pointer"
                            >
                              <input
                                type="radio"
                                name={`q_${idx}`}
                                value={val}
                                checked={answers[idx] === val}
                                onChange={() => handleScoreChange(idx, val)}
                                className="w-4 h-4 text-indigo-600 focus:ring-indigo-500"
                              />
                              <span className="text-[10px] font-semibold text-slate-600">{val}</span>
                            </label>
                          ))}
                        </div>
                        <span className="text-[10px] text-slate-400 font-medium">Sangat Setuju (5)</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-800"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitted}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{submitted ? 'Skor Disimpan...' : 'Simpan & Perbarui Skor SUS Sistem'}</span>
                </button>
              </div>
            </form>
          ) : (
            /* Empathy Map Synthesized Insights */
            <div className="space-y-4 text-xs">
              <div className="p-3 bg-indigo-50/70 border border-indigo-200 rounded-xl text-indigo-900 leading-relaxed">
                Pemetaan empati kognitif mahasiswa kampus yang menjadi acuan perancangan UX platform 3R:
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                  <div className="font-black text-slate-900 flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
                    <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                    <span>Says (Perkataan Verbal)</span>
                  </div>
                  <ul className="list-disc list-inside space-y-1 text-slate-600">
                    <li>"Saya bingung botol plastik jenis ini masuk keranjang mana."</li>
                    <li>"Saya malas mengantre kalau birokrasi penimbangannya manual dan lama."</li>
                  </ul>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                  <div className="font-black text-slate-900 flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    <span>Thinks (Kognisi & Rasionalitas)</span>
                  </div>
                  <ul className="list-disc list-inside space-y-1 text-slate-600">
                    <li>"Apakah poin yang saya kumpulkan benar-benar bisa ditukar makan di kantin?"</li>
                    <li>"Apakah sampah saya benar-benar didaur ulang atau akhirnya tercampur lagi?"</li>
                  </ul>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                  <div className="font-black text-slate-900 flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
                    <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                    <span>Does (Perilaku Nyata)</span>
                  </div>
                  <ul className="list-disc list-inside space-y-1 text-slate-600">
                    <li>Membuang botol air mineral dengan sisa air langsung ke tong sampah kantin.</li>
                    <li>Meninggalkan kardus paket belanja online di koridor gedung asrama.</li>
                  </ul>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                  <div className="font-black text-slate-900 flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
                    <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                    <span>Feels (Beban Emosional)</span>
                  </div>
                  <ul className="list-disc list-inside space-y-1 text-slate-600">
                    <li>Merasa bersalah melihat timbunan sampah di TPA Antang Makassar.</li>
                    <li>Bangga saat kontribusinya tercatat resmi dan diakui secara sosial di kampus.</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
