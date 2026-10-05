import React, { useEffect, useState } from 'react';
import { ApdItem } from '../../types/k3';
import { detectApdMock, DetectionScenario } from '../../services/aiDetection';
import { ApdBoundingBoxOverlay } from '../ApdBoundingBoxOverlay';
import { 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  XCircle, 
  RefreshCw, 
  Cpu, 
  Sliders, 
  ShieldCheck, 
  ShieldAlert,
  Server
} from 'lucide-react';

interface StepAiDetectionProps {
  photoUrl: string;
  detections: ApdItem[];
  onDetectionsChange: (items: ApdItem[]) => void;
  onBack: () => void;
  onNext: () => void;
}

export const StepAiDetection: React.FC<StepAiDetectionProps> = ({
  photoUrl,
  detections,
  onDetectionsChange,
  onBack,
  onNext,
}) => {
  const [isScanning, setIsScanning] = useState<boolean>(true);
  const [scenario, setScenario] = useState<DetectionScenario>('all_complete');
  const [showApiSettings, setShowApiSettings] = useState<boolean>(false);
  const [detectionMode, setDetectionMode] = useState<'mock' | 'yolo_api'>('mock');
  const [yoloUrl, setYoloUrl] = useState<string>('http://localhost:5000/detect');

  // Trigger detection scan on initial mount or photo change
  useEffect(() => {
    runDetection(scenario);
  }, []);

  const runDetection = (selectedScenario: DetectionScenario) => {
    setIsScanning(true);

    if (detectionMode === 'yolo_api') {
      // Connect to local python YOLO server
      fetch(yoloUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image_url: photoUrl }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data && data.items) {
            onDetectionsChange(data.items);
          } else {
            // fallback
            const res = detectApdMock(selectedScenario);
            onDetectionsChange(res.items);
          }
        })
        .catch(() => {
          const res = detectApdMock(selectedScenario);
          onDetectionsChange(res.items);
        })
        .finally(() => {
          setIsScanning(false);
        });
    } else {
      // Simulation engine
      setTimeout(() => {
        const res = detectApdMock(selectedScenario);
        onDetectionsChange(res.items);
        setIsScanning(false);
      }, 700);
    }
  };

  // Verify APD mandatory items
  const mandatoryItems = detections.filter((d) => d.isMandatory);
  const missingMandatory = mandatoryItems.filter((d) => !d.detected);
  const allMandatoryPassed = missingMandatory.length === 0;

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="text-xs font-bold text-[#00829B] tracking-wide">
            LANGKAH 04 DARI 05
          </div>
          <h2 className="text-xl font-bold text-slate-900 mt-0.5">
            Hasil Verifikasi APD oleh Computer Vision
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Sistem kamera memindai dan memvalidasi keberadaan Helm, Rompi, dan Sepatu Safety.
          </p>
        </div>

        {/* Engine status & Settings */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowApiSettings(!showApiSettings)}
            className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Sliders className="w-3.5 h-3.5 text-[#00829B]" />
            <span>Koneksi Python YOLO</span>
          </button>
        </div>
      </div>

      {/* Advanced API Config Drawer (if toggled) */}
      {showApiSettings && (
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-3">
          <div className="flex items-center gap-2 text-[#00829B] font-bold">
            <Server className="w-4 h-4" />
            <span>KONEKSI BACKEND OBJECT DETECTION (PYTHON / YOLO)</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-slate-600 block mb-1 font-medium">Mode Inferensi:</label>
              <select
                value={detectionMode}
                onChange={(e) => setDetectionMode(e.target.value as 'mock' | 'yolo_api')}
                className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-900 text-xs"
              >
                <option value="mock">Simulasi Computer Vision Bawaan (Cepat)</option>
                <option value="yolo_api">Server Python Lokal (Ultralytics / Flask)</option>
              </select>
            </div>

            {detectionMode === 'yolo_api' && (
              <div>
                <label className="text-slate-600 block mb-1 font-medium">Endpoint URL API YOLO:</label>
                <input
                  type="text"
                  value={yoloUrl}
                  onChange={(e) => setYoloUrl(e.target.value)}
                  placeholder="http://localhost:5000/detect"
                  className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-900 text-xs font-mono"
                />
              </div>
            )}
          </div>

          <div className="text-[11px] text-slate-500 bg-white p-2.5 rounded border border-slate-200">
            Keterangan: Server backend Python YOLO dapat dijalankan di port lokal <code className="text-[#00829B]">http://localhost:5000/detect</code>.
          </div>
        </div>
      )}

      {/* Quick Testing Scenario Picker */}
      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-800">
            Skenario Simulasi Pengujian K3:
          </span>
          <span className="text-[11px] text-slate-500">
            Gunakan untuk mendemonstrasikan kasus Layak dan Tidak Layak
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <button
            type="button"
            disabled={isScanning}
            onClick={() => {
              setScenario('all_complete');
              runDetection('all_complete');
            }}
            className={`px-3 py-2 rounded-lg text-xs font-semibold text-center transition-all cursor-pointer ${
              scenario === 'all_complete'
                ? 'bg-emerald-600 text-white font-bold shadow-sm'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            🟢 Skenario 1: APD Lengkap
          </button>

          <button
            type="button"
            disabled={isScanning}
            onClick={() => {
              setScenario('missing_helmet');
              runDetection('missing_helmet');
            }}
            className={`px-3 py-2 rounded-lg text-xs font-semibold text-center transition-all cursor-pointer ${
              scenario === 'missing_helmet'
                ? 'bg-red-600 text-white font-bold shadow-sm'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            🔴 Skenario 2: Lupa Helm
          </button>

          <button
            type="button"
            disabled={isScanning}
            onClick={() => {
              setScenario('missing_shoes');
              runDetection('missing_shoes');
            }}
            className={`px-3 py-2 rounded-lg text-xs font-semibold text-center transition-all cursor-pointer ${
              scenario === 'missing_shoes'
                ? 'bg-red-600 text-white font-bold shadow-sm'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            🔴 Skenario 3: Lupa Sepatu
          </button>

          <button
            type="button"
            disabled={isScanning}
            onClick={() => {
              setScenario('missing_vest');
              runDetection('missing_vest');
            }}
            className={`px-3 py-2 rounded-lg text-xs font-semibold text-center transition-all cursor-pointer ${
              scenario === 'missing_vest'
                ? 'bg-red-600 text-white font-bold shadow-sm'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            🔴 Skenario 4: Lupa Rompi
          </button>
        </div>
      </div>

      {/* Main Detection Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Image with Bounding Boxes */}
        <div className="lg:col-span-6 flex flex-col items-center">
          <div className="relative w-full max-w-[420px] aspect-[3/4] bg-slate-900 rounded-2xl overflow-hidden border border-slate-200 shadow-md">
            <img
              src={photoUrl}
              alt="Foto Personel"
              className="w-full h-full object-cover"
            />

            {/* AI Bounding Boxes Overlay */}
            {!isScanning && (
              <ApdBoundingBoxOverlay detections={detections} />
            )}

            {/* Scanning line animation */}
            {isScanning && (
              <div className="absolute inset-0 bg-slate-900/60 flex flex-col items-center justify-center p-6 text-center text-white">
                <RefreshCw className="w-10 h-10 text-cyan-400 animate-spin mb-3" />
                <div className="text-sm font-bold tracking-wide">
                  MEMINDAI KELENGKAPAN APD...
                </div>
                <div className="text-xs text-slate-300 mt-1">
                  Mendeteksi Safety Helmet, High-Vis Vest, Safety Shoes
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: Detected APD Checklist Cards */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
              HASIL PEMERIKSAAN OBJEK APD
            </h3>
            <span className="text-xs font-semibold text-slate-500">
              {detections.filter((d) => d.detected).length} dari 5 Terdeteksi
            </span>
          </div>

          <div className="space-y-2.5">
            {detections.map((item) => (
              <div
                key={item.key}
                className={`p-3.5 rounded-xl border transition-all ${
                  item.detected
                    ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
                    : 'bg-red-50/70 border-red-200 text-red-900'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs ${
                        item.detected
                          ? 'bg-emerald-600 text-white'
                          : 'bg-red-600 text-white'
                      }`}
                    >
                      {item.detected ? '✓' : '✗'}
                    </div>

                    <div>
                      <div className="text-xs sm:text-sm font-bold flex items-center gap-2">
                        <span>{item.nameIndo}</span>
                        {item.isMandatory ? (
                          <span className="text-[10px] px-1.5 py-0.2 rounded font-bold bg-red-100 text-red-800 border border-red-200">
                            WAJIB
                          </span>
                        ) : (
                          <span className="text-[10px] px-1.5 py-0.2 rounded font-medium bg-slate-200 text-slate-700">
                            TAMBAHAN
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {item.name} • Confidence: <span className="font-semibold">{item.confidence}%</span>
                      </div>
                    </div>
                  </div>

                  <span className="text-xs font-bold">
                    {item.detected ? 'LENGKAP' : 'TIDAK TERDETEKSI'}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Verdict Box */}
          <div
            className={`p-4 rounded-xl border flex items-center gap-3 ${
              allMandatoryPassed
                ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                : 'bg-red-50 border-red-300 text-red-900'
            }`}
          >
            {allMandatoryPassed ? (
              <ShieldCheck className="w-8 h-8 text-emerald-600 shrink-0" />
            ) : (
              <ShieldAlert className="w-8 h-8 text-red-600 shrink-0" />
            )}
            <div>
              <div className="text-xs font-bold uppercase tracking-wider">
                {allMandatoryPassed ? 'APD WAJIB LENGKAP' : 'APD WAJIB BELUM MEMENUHI SYARAT'}
              </div>
              <div className="text-xs mt-0.5 leading-snug">
                {allMandatoryPassed
                  ? 'Seluruh APD wajib (Helm, Rompi, Sepatu) terverifikasi lengkap pada tubuh pekerja.'
                  : `Kurang: ${missingMandatory.map((m) => m.nameIndo).join(', ')}. Akses akan ditolak.`}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-100">
        <button
          type="button"
          onClick={onBack}
          className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-semibold flex items-center gap-2 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Ambil Foto Ulang</span>
        </button>

        <button
          type="button"
          onClick={onNext}
          className="px-6 py-2.5 rounded-lg bg-[#00829B] hover:bg-[#006F85] text-white text-xs sm:text-sm font-bold flex items-center gap-2 shadow-sm transition-all cursor-pointer"
        >
          <span>Lihat Status Kelayakan & Izin Masuk</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
