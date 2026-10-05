import React, { useRef, useState, useEffect } from 'react';
import { Camera, Upload, RefreshCw, ArrowRight, ArrowLeft, Image as ImageIcon, AlertCircle, Check } from 'lucide-react';

interface StepPhotoCaptureProps {
  photoUrl: string;
  onPhotoSelected: (url: string) => void;
  onBack: () => void;
  onNext: () => void;
}

// Preset photos for quick demonstration
const SAMPLE_PRESET_PHOTOS = [
  {
    id: 'complete',
    name: 'Pekerja APD Lengkap',
    desc: 'Helm, rompi reflektif, sepatu safety',
    url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=700&q=80',
  },
  {
    id: 'substation',
    name: 'Teknisi GIS Substation',
    desc: 'Di depan panel switchgear Gardu Induk',
    url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=700&q=80',
  },
  {
    id: 'engineer',
    name: 'Safety Inspector',
    desc: 'Pakaian kerja lapangan PLN',
    url: 'https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?auto=format&fit=crop&w=700&q=80',
  }
];

export const StepPhotoCapture: React.FC<StepPhotoCaptureProps> = ({
  photoUrl,
  onPhotoSelected,
  onBack,
  onNext,
}) => {
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Stop camera stream when unmounting or switching
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 720 }, height: { ideal: 960 } },
        audio: false,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setIsCameraActive(true);
    } catch (err: any) {
      console.error('Camera error:', err);
      setCameraError('Gagal mengakses kamera. Pastikan izin kamera aktif pada browser.');
      setIsCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;

    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
      onPhotoSelected(dataUrl);
      stopCamera();
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          onPhotoSelected(event.target.result as string);
          stopCamera();
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="text-xs font-bold text-[#00829B] tracking-wide">
            LANGKAH 03 DARI 05
          </div>
          <h2 className="text-xl font-bold text-slate-900 mt-0.5">
            Pengambilan Foto Tubuh & APD
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Foto ini akan diverifikasi oleh sistem Computer Vision untuk mendeteksi Helm, Rompi, dan Sepatu Safety.
          </p>
        </div>

        {/* Action Toggle buttons */}
        <div className="flex items-center gap-2">
          {!isCameraActive ? (
            <button
              type="button"
              onClick={startCamera}
              className="px-3.5 py-1.5 rounded-lg bg-[#00829B] hover:bg-[#006F85] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Nyalakan Kamera Web</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={stopCamera}
              className="px-3.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>Matikan Kamera</span>
            </button>
          )}

          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            className="hidden"
            onChange={handleFileUpload}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="px-3.5 py-1.5 rounded-lg bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Unggah Berkas</span>
          </button>
        </div>
      </div>

      {cameraError && (
        <div className="p-3.5 rounded-xl bg-red-50 border-l-4 border-red-500 text-xs sm:text-sm text-red-900 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{cameraError}</span>
        </div>
      )}

      {/* Main Preview / Capture Viewport */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Camera Feed or Active Selected Photo */}
        <div className="lg:col-span-7 flex flex-col items-center">
          <div className="relative w-full max-w-[420px] aspect-[3/4] bg-slate-900 rounded-2xl overflow-hidden border-2 border-slate-200 shadow-md flex items-center justify-center">
            {isCameraActive ? (
              <>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />

                {/* Viewfinder Target Overlay */}
                <div className="absolute inset-8 border border-white/40 rounded-xl pointer-events-none flex flex-col justify-between p-3">
                  <div className="flex justify-between text-[10px] text-white/80 font-mono">
                    <span>AREA KEPALA (HELM)</span>
                    <span>150 kV SAFE</span>
                  </div>
                  <div className="w-full border-t border-dashed border-white/30 my-auto" />
                  <div className="flex justify-between text-[10px] text-white/80 font-mono">
                    <span>AREA BADAN (ROMPI)</span>
                    <span>SEPATU SAFETY</span>
                  </div>
                </div>

                {/* Capture Button Overlay */}
                <div className="absolute bottom-4 inset-x-0 flex justify-center">
                  <button
                    type="button"
                    onClick={capturePhoto}
                    className="px-6 py-2.5 rounded-full bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg transition-transform hover:scale-105 cursor-pointer"
                  >
                    <Camera className="w-4 h-4 text-slate-950" />
                    <span>Ambil Foto Sekarang</span>
                  </button>
                </div>
              </>
            ) : photoUrl ? (
              <div className="relative w-full h-full">
                <img
                  src={photoUrl}
                  alt="Foto Terpilih"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 right-3 bg-emerald-600 text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" />
                  <span>Foto Siap Dianalisis</span>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center text-slate-400 space-y-3">
                <div className="w-14 h-14 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
                  <Camera className="w-7 h-7" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">Belum Ada Foto Dipilih</p>
                  <p className="text-xs text-slate-400 mt-1">
                    Nyalakan kamera, unggah foto dari komputer, atau pilih salah satu foto simulasi di sebelah kanan.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: Presets and Guidance */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
              Panduan Foto Standar K3 PLN:
            </h3>
            <ul className="text-xs text-slate-600 space-y-1.5 list-disc list-inside">
              <li>Posisikan tubuh tegak menghadap ke arah kamera.</li>
              <li>Pastikan dari helm kepala hingga sepatu terlihat di dalam bingkai.</li>
              <li>Pencahayaan terang dan hindari latar belakang yang terlalu silau.</li>
            </ul>
          </div>

          {/* Quick Preset Selector */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-700">
              Pilihan Contoh Foto Simulasi APD:
            </h4>

            <div className="space-y-2">
              {SAMPLE_PRESET_PHOTOS.map((preset) => {
                const isSelected = photoUrl === preset.url;

                return (
                  <div
                    key={preset.id}
                    onClick={() => {
                      onPhotoSelected(preset.url);
                      stopCamera();
                    }}
                    className={`flex items-center gap-3 p-2.5 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-cyan-50 border-[#00829B] shadow-sm'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <img
                      src={preset.url}
                      alt={preset.name}
                      className="w-12 h-12 rounded-lg object-cover shrink-0 border border-slate-200"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold text-slate-900 truncate">
                        {preset.name}
                      </div>
                      <div className="text-[11px] text-slate-500 truncate">
                        {preset.desc}
                      </div>
                    </div>
                    {isSelected && (
                      <div className="w-5 h-5 rounded-full bg-[#00829B] text-white flex items-center justify-center shrink-0 text-xs">
                        ✓
                      </div>
                    )}
                  </div>
                );
              })}
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
          <span>Kembali</span>
        </button>

        <button
          type="button"
          disabled={!photoUrl}
          onClick={onNext}
          className="px-6 py-2.5 rounded-lg bg-[#00829B] hover:bg-[#006F85] text-white text-xs sm:text-sm font-bold flex items-center gap-2 shadow-sm transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span>Lanjut ke Verifikasi AI</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
