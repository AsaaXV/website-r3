import React, { useState } from 'react';
import {
  X,
  FileText,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Calendar,
  Send,
  Star,
  Check,
  ChevronRight,
  Sparkles,
  ArrowLeft,
  UserCheck,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Survey, SurveyQuestion, UserProfile } from '../types';
import { submitSurveyResponse, isSurveyActiveForStudent } from '../utils/surveyStorage';

interface StudentSurveyModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  activeSurveys: Survey[];
  answeredSurveyIds: string[];
  onSurveyCompleted: (surveyId: string) => void;
}

export const StudentSurveyModal: React.FC<StudentSurveyModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  activeSurveys,
  answeredSurveyIds,
  onSurveyCompleted,
}) => {
  // Filter only published surveys that have not been completed by current user (unless allowResubmission)
  const pendingSurveys = activeSurveys.filter((s) =>
    isSurveyActiveForStudent(s, currentUser.id, answeredSurveyIds)
  );

  const [selectedSurvey, setSelectedSurvey] = useState<Survey | null>(() => {
    return pendingSurveys.length > 0 ? pendingSurveys[0] : null;
  });

  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  // If pending surveys change, sync selectedSurvey
  React.useEffect(() => {
    if (!selectedSurvey && pendingSurveys.length > 0) {
      setSelectedSurvey(pendingSurveys[0]);
    }
  }, [pendingSurveys, selectedSurvey]);

  if (!isOpen) return null;

  const handleSelectSurvey = (survey: Survey) => {
    setSelectedSurvey(survey);
    setAnswers({});
    setValidationErrors({});
    setSubmissionError(null);
    setSubmittedSuccess(false);
  };

  const handleAnswerChange = (questionId: string, value: any) => {
    setSubmissionError(null);
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
    // Clear error for this question if answered
    if (validationErrors[questionId]) {
      setValidationErrors((prev) => {
        const copy = { ...prev };
        delete copy[questionId];
        return copy;
      });
    }
  };

  const handleMultipleChoiceToggle = (questionId: string, option: string) => {
    const currentValues: string[] = Array.isArray(answers[questionId]) ? answers[questionId] : [];
    const exists = currentValues.includes(option);
    const updated = exists ? currentValues.filter((item) => item !== option) : [...currentValues, option];
    handleAnswerChange(questionId, updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSurvey) return;
    setSubmissionError(null);

    // Validate required questions
    const errors: Record<string, string> = {};
    for (const q of selectedSurvey.questions) {
      if (q.required) {
        const val = answers[q.id];
        if (val === undefined || val === null || val === '') {
          errors[q.id] = 'Pertanyaan ini wajib diisi sebelum mengirim survei.';
        } else if (Array.isArray(val) && val.length === 0) {
          errors[q.id] = 'Pilih minimal satu jawaban pada pertanyaan ini.';
        }
      }
      // If question type is number and value is not empty, ensure valid number
      if (q.type === 'number' && answers[q.id] !== undefined && answers[q.id] !== '') {
        if (isNaN(Number(answers[q.id]))) {
          errors[q.id] = 'Masukkan nilai angka yang valid.';
        }
      }
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      // Scroll to first error
      const firstErrorKey = Object.keys(errors)[0];
      const element = document.getElementById(`question_card_${firstErrorKey}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    setIsSubmitting(true);

    try {
      // Map answers to required format
      const answersPayload = Object.entries(answers).map(([qId, val]) => ({
        questionId: qId,
        value: val,
      }));

      // Record in storage strictly linked to currentUser
      submitSurveyResponse(
        selectedSurvey.id,
        {
          id: currentUser.id,
          name: currentUser.name,
          faculty: currentUser.faculty,
          major: currentUser.major,
          role: currentUser.role,
          batch: currentUser.batch,
        },
        answersPayload
      );

      // Trigger celebratory confetti
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });

      setIsSubmitting(false);
      setSubmittedSuccess(true);
      onSurveyCompleted(selectedSurvey.id);
    } catch (err: any) {
      console.error('Failed to submit survey:', err);
      setIsSubmitting(false);
      setSubmissionError(
        err?.message || 'Periode survei telah berakhir atau survei sudah tidak tersedia.'
      );
    }
  };

  return (
    <div
      id="student-survey-modal-backdrop"
      className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto"
    >
      <div className="bg-white dark:bg-[#111827] rounded-3xl max-w-3xl w-full my-auto shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col max-h-[92vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 bg-slate-50/70 dark:bg-[#162032] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold shadow-xs">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-900 dark:text-white text-base sm:text-lg">
                  Kuesioner & Survei Riset Kampus
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700">
                  {pendingSurveys.length} Tersedia
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Direktorat Green Campus & Sarpras Universitas Negeri Makassar
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-300 transition-colors cursor-pointer"
            title="Tutup"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* If Survey Submitted Successfully */}
          {submittedSuccess ? (
            <div className="text-center py-12 px-4 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-md">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h4 className="text-xl font-bold text-slate-900 dark:text-white">
                  Survei Telah Selesai!
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto">
                  Terima kasih banyak, <strong>{currentUser.name}</strong>! Tanggapan Anda telah berhasil
                  terekam ke dalam basis data riset EcoCampus UNM.
                </p>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                {pendingSurveys.length > 1 && (
                  <button
                    onClick={() => {
                      setSubmittedSuccess(false);
                      const next = pendingSurveys.find((s) => s.id !== selectedSurvey?.id);
                      if (next) setSelectedSurvey(next);
                    }}
                    className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs transition-colors cursor-pointer"
                  >
                    Isi Survei Lainnya
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all shadow-md shadow-emerald-600/20 cursor-pointer"
                >
                  Kembali ke Dashboard
                </button>
              </div>
            </div>
          ) : pendingSurveys.length === 0 ? (
            /* If no pending surveys */
            <div className="text-center py-12 px-4 space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white">
                Tidak Ada Survei Aktif yang Perlu Diisi
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
                Seluruh survei yang diterbitkan oleh tim Direktorat Kampus telah berhasil Anda tuntaskan.
                Survei baru akan muncul secara otomatis ketika dipublikasikan oleh admin.
              </p>
              <div className="pt-2">
                <button
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs transition-colors cursor-pointer"
                >
                  Tutup Jendela
                </button>
              </div>
            </div>
          ) : (
            /* Active Survey Form */
            <div className="space-y-6">
              {/* Multiple Surveys Tabs if more than 1 */}
              {pendingSurveys.length > 1 && (
                <div className="flex gap-2 pb-2 overflow-x-auto border-b border-slate-100 dark:border-slate-800 scrollbar-none">
                  {pendingSurveys.map((survey) => (
                    <button
                      key={survey.id}
                      onClick={() => handleSelectSurvey(survey)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                        selectedSurvey?.id === survey.id
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                      }`}
                    >
                      {survey.title.length > 35 ? `${survey.title.slice(0, 35)}...` : survey.title}
                    </button>
                  ))}
                </div>
              )}

              {selectedSurvey && (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Submission Error Banner */}
                  {submissionError && (
                    <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800 text-rose-800 dark:text-rose-200 flex items-start gap-3 animate-in fade-in duration-200">
                      <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                      <div>
                        <div className="font-bold text-xs">Gagal Mengirimkan Survei</div>
                        <div className="text-xs mt-0.5">{submissionError}</div>
                      </div>
                    </div>
                  )}

                  {/* Survey Info Card */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/60 space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-emerald-200/70 dark:bg-emerald-900/80 text-emerald-900 dark:text-emerald-200">
                        Survei Aktif
                      </span>
                      <div className="flex items-center gap-1.5 text-[11px] text-emerald-800 dark:text-emerald-300">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>
                          Periode:{' '}
                          {selectedSurvey.startDateTime
                            ? selectedSurvey.startDateTime.replace('T', ' ')
                            : selectedSurvey.startDate}{' '}
                          s/d{' '}
                          {selectedSurvey.endDateTime
                            ? selectedSurvey.endDateTime.replace('T', ' ')
                            : selectedSurvey.endDate}
                        </span>
                      </div>
                    </div>
                    <h3 className="font-extrabold text-slate-900 dark:text-white text-base sm:text-lg">
                      {selectedSurvey.title}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      {selectedSurvey.description}
                    </p>
                    <div className="pt-2 text-[11px] text-slate-500 dark:text-slate-400">
                      Diselenggarakan oleh: <strong>{selectedSurvey.createdBy}</strong>
                    </div>
                  </div>

                  {/* List of Dynamic Questions */}
                  <div className="space-y-5">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400 px-1">
                      <span>Daftar Pertanyaan ({selectedSurvey.questions.length} Soal)</span>
                      <span className="text-[11px] text-emerald-600 dark:text-emerald-400">
                        * Wajib dijawab
                      </span>
                    </div>

                    {selectedSurvey.questions.map((q, index) => {
                      const isError = Boolean(validationErrors[q.id]);

                      return (
                        <div
                          key={q.id}
                          id={`question_card_${q.id}`}
                          className={`p-4 sm:p-5 rounded-2xl border transition-all space-y-3 ${
                            isError
                              ? 'bg-rose-50/40 dark:bg-rose-950/20 border-rose-300 dark:border-rose-800 ring-2 ring-rose-400/20'
                              : 'bg-white dark:bg-[#151c2e] border-slate-200 dark:border-slate-800 shadow-xs'
                          }`}
                        >
                          <div className="flex items-start gap-2.5">
                            <span className="w-6 h-6 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                              {index + 1}
                            </span>
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
                                {q.question}
                                {q.required && <span className="text-rose-500 ml-1">*</span>}
                              </div>
                              {q.helpText && (
                                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                                  {q.helpText}
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Dynamic Input Based on Question Type */}
                          <div className="pt-2">
                            {/* 1. SINGLE CHOICE */}
                            {q.type === 'single_choice' && (
                              <div className="space-y-2">
                                {q.options?.map((opt, oIdx) => {
                                  const isSelected = answers[q.id] === opt;
                                  return (
                                    <label
                                      key={oIdx}
                                      onClick={() => handleAnswerChange(q.id, opt)}
                                      className={`flex items-center gap-3 p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                                        isSelected
                                          ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-950 dark:text-emerald-100 font-semibold ring-1 ring-emerald-400'
                                          : 'bg-slate-50/60 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                                      }`}
                                    >
                                      <div
                                        className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                                          isSelected
                                            ? 'border-emerald-600 bg-emerald-600 text-white'
                                            : 'border-slate-400 dark:border-slate-500'
                                        }`}
                                      >
                                        {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                                      </div>
                                      <span>{opt}</span>
                                    </label>
                                  );
                                })}
                              </div>
                            )}

                            {/* 2. MULTIPLE CHOICE */}
                            {q.type === 'multiple_choice' && (
                              <div className="space-y-2">
                                {q.options?.map((opt, oIdx) => {
                                  const selectedList = Array.isArray(answers[q.id]) ? answers[q.id] : [];
                                  const isChecked = selectedList.includes(opt);
                                  return (
                                    <label
                                      key={oIdx}
                                      onClick={() => handleMultipleChoiceToggle(q.id, opt)}
                                      className={`flex items-center gap-3 p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                                        isChecked
                                          ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-950 dark:text-emerald-100 font-semibold ring-1 ring-emerald-400'
                                          : 'bg-slate-50/60 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                                      }`}
                                    >
                                      <div
                                        className={`w-4 h-4 rounded-md border flex items-center justify-center ${
                                          isChecked
                                            ? 'border-emerald-600 bg-emerald-600 text-white'
                                            : 'border-slate-400 dark:border-slate-500'
                                        }`}
                                      >
                                        {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                                      </div>
                                      <span>{opt}</span>
                                    </label>
                                  );
                                })}
                              </div>
                            )}

                            {/* 3. LIKERT / SCALE (1-5) */}
                            {q.type === 'likert' && (
                              <div className="space-y-2.5">
                                <div className="grid grid-cols-5 gap-2 sm:gap-3">
                                  {[1, 2, 3, 4, 5].map((scaleVal) => {
                                    const isSelected = answers[q.id] === scaleVal;
                                    return (
                                      <button
                                        type="button"
                                        key={scaleVal}
                                        onClick={() => handleAnswerChange(q.id, scaleVal)}
                                        className={`py-3 rounded-xl border text-center font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                                          isSelected
                                            ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-600/30 scale-102'
                                            : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-emerald-400'
                                        }`}
                                      >
                                        <div className="text-base sm:text-lg font-black">{scaleVal}</div>
                                      </button>
                                    );
                                  })}
                                </div>
                                <div className="flex justify-between text-[11px] text-slate-500 dark:text-slate-400 font-medium px-1">
                                  <span>{q.scaleLabels?.min || '1: Sangat Tidak Setuju'}</span>
                                  <span>{q.scaleLabels?.max || '5: Sangat Setuju'}</span>
                                </div>
                              </div>
                            )}

                            {/* 4. YES / NO */}
                            {q.type === 'yes_no' && (
                              <div className="grid grid-cols-2 gap-3 max-w-sm">
                                {['Ya', 'Tidak'].map((val) => {
                                  const isSelected = answers[q.id] === val;
                                  return (
                                    <button
                                      type="button"
                                      key={val}
                                      onClick={() => handleAnswerChange(q.id, val)}
                                      className={`py-2.5 px-4 rounded-xl border font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                                        isSelected
                                          ? val === 'Ya'
                                            ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                                            : 'bg-rose-600 text-white border-rose-600 shadow-sm'
                                          : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
                                      }`}
                                    >
                                      {val === 'Ya' ? (
                                        <CheckCircle2 className="w-4 h-4" />
                                      ) : (
                                        <X className="w-4 h-4" />
                                      )}
                                      <span>{val}</span>
                                    </button>
                                  );
                                })}
                              </div>
                            )}

                            {/* 5. SHORT TEXT */}
                            {q.type === 'short_text' && (
                              <input
                                type="text"
                                value={answers[q.id] || ''}
                                onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                                placeholder="Ketikkan jawaban Anda di sini..."
                                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:bg-white dark:focus:bg-[#151c2e]"
                              />
                            )}

                            {/* 6. LONG TEXT */}
                            {q.type === 'long_text' && (
                              <textarea
                                rows={3}
                                value={answers[q.id] || ''}
                                onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                                placeholder="Tuliskan ulasan atau tanggapan lengkap Anda di sini..."
                                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:bg-white dark:focus:bg-[#151c2e]"
                              />
                            )}

                            {/* 7. NUMBER */}
                            {q.type === 'number' && (
                              <div className="max-w-xs">
                                <input
                                  type="number"
                                  min={0}
                                  value={answers[q.id] !== undefined ? answers[q.id] : ''}
                                  onChange={(e) =>
                                    handleAnswerChange(
                                      q.id,
                                      e.target.value === '' ? '' : Number(e.target.value)
                                    )
                                  }
                                  placeholder="0"
                                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:bg-white dark:focus:bg-[#151c2e]"
                                />
                              </div>
                            )}
                          </div>

                          {/* Error Validation Message */}
                          {isError && (
                            <div className="flex items-center gap-1.5 text-rose-600 dark:text-rose-400 text-xs font-semibold pt-1">
                              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                              <span>{validationErrors[q.id]}</span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Submit Button Bar */}
                  <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                      <UserCheck className="w-4 h-4 text-emerald-500" />
                      <span>
                        Responden: <strong>{currentUser.name}</strong> ({currentUser.faculty})
                      </span>
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs transition-colors cursor-pointer"
                      >
                        Batal
                      </button>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-emerald-600/20 disabled:opacity-50 cursor-pointer"
                      >
                        <Send className="w-4 h-4" />
                        <span>{isSubmitting ? 'Mengirim...' : 'Kirim Jawaban Survei'}</span>
                      </button>
                    </div>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
