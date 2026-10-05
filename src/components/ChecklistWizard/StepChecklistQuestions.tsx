import React from 'react';
import { CHECKLIST_QUESTIONS } from '../../data/mockData';
import { ClipboardCheck, ArrowRight, ArrowLeft, CheckCircle2, ShieldAlert } from 'lucide-react';

interface StepChecklistQuestionsProps {
  answers: Record<number, 'ya' | 'tidak'>;
  onAnswerChange: (questionId: number, val: 'ya' | 'tidak') => void;
  onSetAll: (val: 'ya' | 'tidak') => void;
  onBack: () => void;
  onNext: () => void;
}

export const StepChecklistQuestions: React.FC<StepChecklistQuestionsProps> = ({
  answers,
  onAnswerChange,
  onSetAll,
  onBack,
  onNext,
}) => {
  const answeredCount = Object.keys(answers).length;
  const totalQuestions = CHECKLIST_QUESTIONS.length;
  const allAnswered = answeredCount === totalQuestions;

  // Count "tidak" answers
  const negativeAnswers = Object.entries(answers).filter(([_, val]) => val === 'tidak');
  const hasNegative = negativeAnswers.length > 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!allAnswered) {
      alert('Mohon jawab seluruh 10 pertanyaan checklist sebelum melanjutkan.');
      return;
    }
    onNext();
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="text-xs font-bold text-[#00829B] tracking-wide">
            LANGKAH 02 DARI 05
          </div>
          <h2 className="text-xl font-bold text-slate-900 mt-0.5">
            10 Checklist Evaluasi Keselamatan (K3)
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Jawab dengan jujur sesuai kondisi aktual sebelum memasuki perimeter Zona Merah GIS Waru 150 kV.
          </p>
        </div>

        {/* Quick action buttons for testing */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onSetAll('ya')}
            className="text-xs bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-semibold px-3 py-1.5 rounded-lg border border-emerald-200 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Pilih Semua "YA"</span>
          </button>
        </div>
      </div>

      {/* Warning banner if any answer is TIDAK */}
      {hasNegative && (
        <div className="p-3.5 rounded-xl bg-red-50 border-l-4 border-red-500 text-xs sm:text-sm text-red-900 flex items-center gap-2.5">
          <ShieldAlert className="w-5 h-5 text-red-600 shrink-0" />
          <span>
            <strong>Peringatan K3:</strong> Anda menjawab "TIDAK" pada {negativeAnswers.length} item. Menurut SOP PLN, seluruh butir checklist K3 wajib terpenuhi untuk memperoleh izin masuk.
          </span>
        </div>
      )}

      {/* Questions List */}
      <div className="space-y-3">
        {CHECKLIST_QUESTIONS.map((q) => {
          const val = answers[q.id];

          return (
            <div
              key={q.id}
              className={`p-4 rounded-xl border transition-all ${
                val === 'ya'
                  ? 'bg-slate-50/80 border-slate-200'
                  : val === 'tidak'
                  ? 'bg-red-50/70 border-red-200'
                  : 'bg-white border-slate-200'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start gap-3 flex-1">
                  <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    {q.id}
                  </span>
                  <div>
                    <p className="text-xs sm:text-sm font-semibold text-slate-900 leading-snug">
                      {q.text}
                    </p>
                    <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-1">
                      <span>Kategori: {q.category === 'apd' ? 'Peralatan APD' : 'Prosedur & Kondisi Personel'}</span>
                      <span>•</span>
                      <span className="text-red-600 font-medium">Wajib YA</span>
                    </div>
                  </div>
                </div>

                {/* Segmented Radio Buttons */}
                <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
                  <button
                    type="button"
                    onClick={() => onAnswerChange(q.id, 'ya')}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      val === 'ya'
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    YA (Lengkap)
                  </button>

                  <button
                    type="button"
                    onClick={() => onAnswerChange(q.id, 'tidak')}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      val === 'tidak'
                        ? 'bg-red-600 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    TIDAK
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-100">
        <button
          type="button"
          onClick={onBack}
          className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-semibold flex items-center gap-2 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali</span>
        </button>

        <button
          type="button"
          onClick={handleSubmit}
          className="px-6 py-2.5 rounded-lg bg-[#00829B] hover:bg-[#006F85] text-white text-xs sm:text-sm font-bold flex items-center gap-2 shadow-sm transition-all cursor-pointer"
        >
          <span>Lanjut ke Verifikasi Foto APD</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
