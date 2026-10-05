import React from 'react';
import { User, ClipboardList, Camera, Cpu, Award } from 'lucide-react';

interface StepIndicatorProps {
  currentStep: number; // 1 to 5
  setStep: (step: number) => void;
  maxAccessibleStep: number;
}

const STEPS = [
  { step: 1, label: 'Data Pengguna', icon: User },
  { step: 2, label: 'Checklist K3', icon: ClipboardList },
  { step: 3, label: 'Foto APD', icon: Camera },
  { step: 4, label: 'Verifikasi AI', icon: Cpu },
  { step: 5, label: 'Status Akses', icon: Award },
];

export const StepIndicator: React.FC<StepIndicatorProps> = ({
  currentStep,
  setStep,
  maxAccessibleStep,
}) => {
  return (
    <div className="w-full bg-white rounded-xl p-4 border border-slate-200 shadow-sm mb-6">
      <div className="flex items-center justify-between mb-3 px-1">
        <span className="text-xs font-bold text-[#00829B] tracking-wide">
          PROGRES PEMERIKSAAN K3
        </span>
        <span className="text-xs font-medium bg-slate-100 px-2.5 py-0.5 rounded text-slate-700">
          Langkah <strong className="text-slate-900">{currentStep}</strong> dari 5
        </span>
      </div>

      {/* Steps bar */}
      <div className="grid grid-cols-5 gap-2">
        {STEPS.map(({ step, label, icon: Icon }) => {
          const isCurrent = currentStep === step;
          const isDone = currentStep > step;
          const isAccessible = step <= maxAccessibleStep;

          return (
            <button
              key={step}
              type="button"
              disabled={!isAccessible}
              onClick={() => isAccessible && setStep(step)}
              className={`flex flex-col items-center text-center p-2 rounded-lg transition-all relative ${
                isCurrent
                  ? 'bg-cyan-50 border-2 border-[#00829B] text-[#00829B]'
                  : isDone
                  ? 'bg-emerald-50 border border-emerald-300 text-emerald-800 hover:bg-emerald-100/70'
                  : 'bg-slate-50 border border-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold mb-1 transition-transform ${
                  isCurrent
                    ? 'bg-[#00829B] text-white'
                    : isDone
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-200 text-slate-500'
                }`}
              >
                {isDone ? '✓' : <Icon className="w-3.5 h-3.5" />}
              </div>
              <span className="text-[11px] font-semibold hidden sm:inline-block truncate max-w-full">
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
