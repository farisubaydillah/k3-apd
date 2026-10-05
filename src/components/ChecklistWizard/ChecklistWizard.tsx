import React, { useState } from 'react';
import { UserFormData, ApdItem } from '../../types/k3';
import { DEFAULT_APD_ITEMS } from '../../data/mockData';
import { StepIndicator } from './StepIndicator';
import { StepUserData } from './StepUserData';
import { StepChecklistQuestions } from './StepChecklistQuestions';
import { StepPhotoCapture } from './StepPhotoCapture';
import { StepAiDetection } from './StepAiDetection';
import { StepAccessResult } from './StepAccessResult';

interface ChecklistWizardProps {
  onViewInAdmin: () => void;
  onRefreshRecords: () => void;
}

export const ChecklistWizard: React.FC<ChecklistWizardProps> = ({
  onViewInAdmin,
  onRefreshRecords,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [maxAccessibleStep, setMaxAccessibleStep] = useState<number>(1);

  // Form State
  const now = new Date();
  const defaultDate = now.toISOString().split('T')[0];
  const defaultTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

  const [userData, setUserData] = useState<UserFormData>({
    nama: '',
    id_pengguna: '',
    instansi: '',
    jabatan: '',
    keperluan: '',
    tanggal: defaultDate,
    waktu: defaultTime,
  });

  const [checklistAnswers, setChecklistAnswers] = useState<Record<number, 'ya' | 'tidak'>>({
    1: 'ya',
    2: 'ya',
    3: 'ya',
    4: 'ya',
    5: 'ya',
    6: 'ya',
    7: 'ya',
    8: 'ya',
    9: 'ya',
    10: 'ya',
  });

  const [photoUrl, setPhotoUrl] = useState<string>(
    'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=700&q=80'
  );

  const [detections, setDetections] = useState<ApdItem[]>(DEFAULT_APD_ITEMS);
  const [isVerified, setIsVerified] = useState<boolean>(false);

  const goToStep = (step: number) => {
    setCurrentStep(step);
    if (step > maxAccessibleStep) {
      setMaxAccessibleStep(step);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReset = () => {
    setCurrentStep(1);
    setMaxAccessibleStep(1);
    setUserData({
      nama: '',
      id_pengguna: '',
      instansi: '',
      jabatan: '',
      keperluan: '',
      tanggal: new Date().toISOString().split('T')[0],
      waktu: `${String(new Date().getHours()).padStart(2, '0')}:${String(new Date().getMinutes()).padStart(2, '0')}`,
    });
    setChecklistAnswers({
      1: 'ya',
      2: 'ya',
      3: 'ya',
      4: 'ya',
      5: 'ya',
      6: 'ya',
      7: 'ya',
      8: 'ya',
      9: 'ya',
      10: 'ya',
    });
    setPhotoUrl('https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=700&q=80');
    setDetections(DEFAULT_APD_ITEMS);
    setIsVerified(false);
    onRefreshRecords();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16">
      {/* Progress Indicator */}
      <StepIndicator
        currentStep={currentStep}
        setStep={goToStep}
        maxAccessibleStep={maxAccessibleStep}
      />

      {/* Step 1: Data Pengguna */}
      {currentStep === 1 && (
        <StepUserData
          data={userData}
          onChange={setUserData}
          onNext={() => goToStep(2)}
        />
      )}

      {/* Step 2: 10 Pertanyaan Checklist K3 */}
      {currentStep === 2 && (
        <StepChecklistQuestions
          answers={checklistAnswers}
          onAnswerChange={(qid, val) =>
            setChecklistAnswers((prev) => ({ ...prev, [qid]: val }))
          }
          onSetAll={(val) => {
            const all: Record<number, 'ya' | 'tidak'> = {};
            for (let i = 1; i <= 10; i++) all[i] = val;
            setChecklistAnswers(all);
          }}
          onBack={() => goToStep(1)}
          onNext={() => goToStep(3)}
        />
      )}

      {/* Step 3: Pengambilan dan Upload Foto APD */}
      {currentStep === 3 && (
        <StepPhotoCapture
          photoUrl={photoUrl}
          onPhotoSelected={setPhotoUrl}
          onBack={() => goToStep(2)}
          onNext={() => goToStep(4)}
        />
      )}

      {/* Step 4: Deteksi APD dengan Computer Vision */}
      {currentStep === 4 && (
        <StepAiDetection
          photoUrl={photoUrl}
          detections={detections}
          onDetectionsChange={setDetections}
          onBack={() => goToStep(3)}
          onNext={() => {
            onRefreshRecords();
            goToStep(5);
          }}
        />
      )}

      {/* Step 5: Validasi Akhir & Tiket Akses Zona Merah */}
      {currentStep === 5 && (
        <StepAccessResult
          userData={userData}
          checklistAnswers={checklistAnswers}
          photoUrl={photoUrl}
          detections={detections}
          onReset={handleReset}
          onGoToStep={goToStep}
          onViewInAdmin={() => {
            onRefreshRecords();
            onViewInAdmin();
          }}
        />
      )}
    </div>
  );
};
