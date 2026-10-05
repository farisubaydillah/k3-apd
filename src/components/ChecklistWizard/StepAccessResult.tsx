import React, { useEffect, useState, useRef } from 'react';
import { InspectionRecord, UserFormData, ApdItem } from '../../types/k3';
import { CHECKLIST_QUESTIONS } from '../../data/mockData';
import { generateInspectionId, generateQRCodeDataUrl, saveInspection } from '../../services/storageService';
import { 
  getAppsScriptUrl, 
  sendToGoogleAppsScript 
} from '../../services/appsScriptService';
import { AppsScriptModal } from '../AppsScriptModal';
import { 
  CheckCircle2, 
  XCircle, 
  Printer, 
  RotateCcw, 
  ShieldCheck, 
  ShieldAlert, 
  ExternalLink,
  UploadCloud,
  Check,
  Zap,
  FileSpreadsheet
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface StepAccessResultProps {
  userData: UserFormData;
  checklistAnswers: Record<number, 'ya' | 'tidak'>;
  photoUrl: string;
  detections: ApdItem[];
  onReset: () => void;
  onGoToStep: (step: number) => void;
  onViewInAdmin: () => void;
}

export const StepAccessResult: React.FC<StepAccessResultProps> = ({
  userData,
  checklistAnswers,
  photoUrl,
  detections,
  onReset,
  onGoToStep,
  onViewInAdmin,
}) => {
  const [inspectionRecord, setInspectionRecord] = useState<InspectionRecord | null>(null);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  
  // Apps Script State
  const [isSendingToSheet, setIsSendingToSheet] = useState<boolean>(false);
  const [sheetSuccess, setSheetSuccess] = useState<boolean>(false);
  const [showAppsScriptModal, setShowAppsScriptModal] = useState<boolean>(false);

  const printAreaRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // 1. Hitung kepatuhan checklist K3
    const negativeQuestions = CHECKLIST_QUESTIONS.filter(
      (q) => checklistAnswers[q.id] === 'tidak'
    );
    const allMandatoryChecklistPassed = negativeQuestions.length === 0;

    // 2. Hitung kepatuhan APD (Wajib: Helm, Rompi, Sepatu)
    const mandatoryApds = detections.filter((d) => d.isMandatory);
    const missingMandatoryApds = mandatoryApds.filter((d) => !d.detected);
    const allMandatoryApdDetected = missingMandatoryApds.length === 0;

    // 3. Tentukan status kelayakan
    const isLayak = allMandatoryChecklistPassed && allMandatoryApdDetected;
    const status: 'LAYAK' | 'TIDAK_LAYAK' = isLayak ? 'LAYAK' : 'TIDAK_LAYAK';

    // 4. Kumpulkan alasan jika tidak layak
    const failureReasons: string[] = [];
    if (!allMandatoryChecklistPassed) {
      negativeQuestions.forEach((q) => {
        failureReasons.push(`Checklist #${q.id}: ${q.text} (Dijawab: TIDAK)`);
      });
    }
    if (!allMandatoryApdDetected) {
      missingMandatoryApds.forEach((apd) => {
        failureReasons.push(`APD Wajib: ${apd.nameIndo} (${apd.name}) tidak terdeteksi oleh sistem kamera AI.`);
      });
    }

    const newId = generateInspectionId();
    const record: InspectionRecord = {
      id: newId,
      user: userData,
      checklistAnswers,
      photoUrl,
      detections,
      allMandatoryChecklistPassed,
      allMandatoryApdDetected,
      status,
      reasons: failureReasons,
      createdAt: new Date().toISOString(),
      verifiedByAi: true,
    };

    setInspectionRecord(record);

    // Otomatis simpan ke localStorage database
    saveInspection(record);

    // Generate QR Code data
    const qrPayload = JSON.stringify({
      id: record.id,
      nama: record.user.nama,
      status: record.status,
      zona: 'ZONA MERAH GIS 150KV WARU',
      tanggal: record.user.tanggal,
      waktu: record.user.waktu,
    });

    generateQRCodeDataUrl(qrPayload).then((url) => {
      setQrCodeUrl(url);
    });

    // Otomatis kirim ke Google Sheets jika Apps Script URL sudah disetel
    const appsScriptUrl = getAppsScriptUrl();
    if (appsScriptUrl) {
      sendToGoogleAppsScript(record).then(() => {
        setSheetSuccess(true);
      }).catch((e) => {
        console.warn('Auto-sync to Apps Script skipped or failed', e);
      });
    }

    // Jalankan confetti jika layak
    if (isLayak) {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#00829B', '#16a34a', '#f59e0b'],
      });
    }
  }, [userData, checklistAnswers, photoUrl, detections]);

  const handlePrint = () => {
    window.print();
  };

  const handleSendToAppsScript = async () => {
    if (!inspectionRecord) return;
    const url = getAppsScriptUrl();
    if (!url) {
      setShowAppsScriptModal(true);
      return;
    }

    setIsSendingToSheet(true);
    try {
      await sendToGoogleAppsScript(inspectionRecord);
      setSheetSuccess(true);
      alert('Data izin masuk berhasil dikirim ke Google Spreadsheet Anda!');
    } catch (err: any) {
      alert(err.message || 'Gagal mengirim ke Google Apps Script.');
    } finally {
      setIsSendingToSheet(false);
    }
  };

  if (!inspectionRecord) {
    return (
      <div className="p-8 text-center text-slate-500">
        Menghitung validasi akhir keselamatan K3...
      </div>
    );
  }

  const isLayak = inspectionRecord.status === 'LAYAK';

  return (
    <div className="space-y-6">
      {/* Printable Official PLN Permit Document */}
      <div
        ref={printAreaRef}
        className={`bg-white rounded-2xl border-2 p-6 sm:p-8 shadow-sm space-y-6 transition-all ${
          isLayak ? 'border-emerald-500' : 'border-red-500'
        }`}
      >
        {/* Header Document */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-amber-400 border border-amber-500 flex items-center justify-center text-red-600 shadow-sm shrink-0">
              <Zap className="w-7 h-7 fill-red-600" />
            </div>
            <div>
              <div className="text-xs font-bold text-[#00829B] tracking-wide">
                PT PLN (PERSERO) • ULTG WARU
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-0.5">
                Surat Izin Masuk Zona Merah (GIS 150 kV)
              </h2>
              <p className="text-xs font-mono text-slate-500">
                No. Registrasi: <strong className="text-slate-900">{inspectionRecord.id}</strong>
              </p>
            </div>
          </div>

          {/* Large Status Badge */}
          <div
            className={`px-5 py-3 rounded-xl border flex items-center gap-3 shrink-0 self-start sm:self-center ${
              isLayak
                ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                : 'bg-red-50 border-red-300 text-red-900'
            }`}
          >
            {isLayak ? (
              <ShieldCheck className="w-8 h-8 text-emerald-600 shrink-0" />
            ) : (
              <ShieldAlert className="w-8 h-8 text-red-600 shrink-0" />
            )}
            <div>
              <div className="text-[10px] font-bold tracking-wider uppercase text-slate-500">
                STATUS KELAYAKAN
              </div>
              <div className="text-base sm:text-lg font-black tracking-tight">
                {isLayak ? '🟢 LAYAK MEMASUKI ZONA MERAH' : '🔴 TIDAK LAYAK MEMASUKI ZONA MERAH'}
              </div>
            </div>
          </div>
        </div>

        {/* Content Body Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Photo & QR Permit */}
          <div className="lg:col-span-4 flex flex-col items-center space-y-4">
            <div className="relative w-full max-w-[240px] aspect-[3/4] rounded-xl overflow-hidden border border-slate-200 bg-slate-900 shadow-sm">
              <img
                src={photoUrl}
                alt="Foto Pekerja"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-2 inset-x-2 bg-slate-900/80 backdrop-blur-xs px-2 py-1 rounded text-[10px] text-center text-slate-200">
                VERIFIKASI KAMERA AI
              </div>
            </div>

            {/* QR Code Digital Pass */}
            {qrCodeUrl && (
              <div className="p-3 bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col items-center">
                <img
                  src={qrCodeUrl}
                  alt="QR Code Tiket Masuk"
                  className="w-36 h-36"
                />
                <span className="text-[10px] font-bold text-slate-700 mt-1">
                  KODE VERIFIKASI GERBANG
                </span>
              </div>
            )}
          </div>

          {/* Right Column: User Info & Verification Details */}
          <div className="lg:col-span-8 space-y-5">
            {/* User Data Card */}
            <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-3">
              <h3 className="text-xs font-bold text-[#00829B] tracking-wide uppercase">
                IDENTITAS PERSONEL & PEKERJAAN
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-slate-500 block">Nama Lengkap:</span>
                  <span className="font-bold text-slate-900 text-sm">{userData.nama}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">NIP / NIM / ID:</span>
                  <span className="font-mono text-slate-800">{userData.id_pengguna}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Instansi / Unit:</span>
                  <span className="text-slate-800 font-medium">{userData.instansi}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Jabatan:</span>
                  <span className="text-slate-800 font-medium">{userData.jabatan}</span>
                </div>
                <div className="sm:col-span-2">
                  <span className="text-slate-500 block">Keperluan di Zona Merah:</span>
                  <span className="text-slate-900 font-medium">{userData.keperluan}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Tanggal Akses:</span>
                  <span className="text-slate-800">{userData.tanggal}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Waktu Pemeriksaan:</span>
                  <span className="text-slate-800">{userData.waktu} WIB</span>
                </div>
              </div>
            </div>

            {/* APD Status Badges Grid */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-slate-700 tracking-wide uppercase">
                STATUS KELENGKAPAN APD (COMPUTER VISION)
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {detections.map((item) => (
                  <div
                    key={item.key}
                    className={`p-2.5 rounded-lg border text-xs flex items-center justify-between ${
                      item.detected
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                        : 'bg-red-50 border-red-200 text-red-900'
                    }`}
                  >
                    <div>
                      <div className="font-bold">{item.nameIndo}</div>
                      <div className="text-[10px] text-slate-500">
                        {item.isMandatory ? 'Wajib' : 'Tambahan'}
                      </div>
                    </div>
                    {item.detected ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-600 shrink-0" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* If NOT LAYAK: Show Reasons */}
            {!isLayak && (
              <div className="p-4 rounded-xl bg-red-50 border border-red-300 space-y-2 text-red-900">
                <div className="font-bold text-xs">
                  ALASAN PENOLAKAN AKSES MASUK:
                </div>
                <ul className="list-disc list-inside space-y-1 text-xs">
                  {inspectionRecord.reasons.map((reason, idx) => (
                    <li key={idx}>{reason}</li>
                  ))}
                </ul>
                <p className="text-xs text-slate-600 pt-1">
                  Silakan perbaiki kelengkapan APD Anda sebelum mencoba kembali memasuki gerbang Zona Merah GIS Waru.
                </p>
              </div>
            )}

            {/* If LAYAK: Security Notice */}
            {isLayak && (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>IZIN MASUK ZONA MERAH RESMI DITERBITKAN</span>
                </div>
                <p className="text-slate-600 leading-relaxed text-[11px]">
                  Tunjukkan kode QR ini ke scanner pintu interlock atau pengawas gardu induk di Pos Jaga GIS Waru. 
                  Selalu patuhi batas aman jarak bebas 1.5 meter dari peralatan bertegangan 150 kV.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer info for print */}
        <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-2">
          <span>PT PLN (Persero) • Sistem Checklist K3 Zona Merah GIS Waru</span>
          <span>Waktu Verifikasi: {new Date(inspectionRecord.createdAt).toLocaleString('id-ID')}</span>
        </div>
      </div>

      {/* Action Buttons Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-2 flex-wrap">
          {!isLayak ? (
            <>
              <button
                type="button"
                onClick={() => onGoToStep(2)}
                className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs sm:text-sm flex items-center gap-2 cursor-pointer shadow-sm"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Perbaiki Checklist K3</span>
              </button>

              <button
                type="button"
                onClick={() => onGoToStep(3)}
                className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs sm:text-sm flex items-center gap-2 cursor-pointer border border-slate-300"
              >
                <span>Ambil Ulang Foto APD</span>
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={handlePrint}
                className="px-4 py-2 rounded-lg bg-[#00829B] hover:bg-[#006F85] text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-sm cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Cetak Izin Masuk / PDF</span>
              </button>

              {/* Google Sheets Sync Button via Apps Script (Gratis) */}
              <button
                type="button"
                disabled={isSendingToSheet}
                onClick={handleSendToAppsScript}
                className={`px-4 py-2 rounded-lg font-semibold text-xs sm:text-sm flex items-center gap-2 shadow-sm transition-all cursor-pointer ${
                  sheetSuccess
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                    : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-300'
                }`}
              >
                <FileSpreadsheet className={`w-4 h-4 ${sheetSuccess ? 'text-emerald-600' : 'text-[#00829B]'}`} />
                <span>
                  {isSendingToSheet
                    ? 'Mengirim...'
                    : sheetSuccess
                    ? 'Tersimpan di Google Sheets'
                    : 'Kirim ke Google Sheets (Gratis)'}
                </span>
                {sheetSuccess && <Check className="w-3.5 h-3.5 text-emerald-600" />}
              </button>
            </>
          )}

          <button
            type="button"
            onClick={onViewInAdmin}
            className="px-4 py-2 rounded-lg bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs sm:text-sm flex items-center gap-2 border border-slate-300 shadow-sm cursor-pointer"
          >
            <ExternalLink className="w-4 h-4 text-slate-500" />
            <span>Lihat di Dashboard Admin</span>
          </button>
        </div>

        <button
          type="button"
          onClick={onReset}
          className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs sm:text-sm flex items-center gap-2 border border-slate-300 cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Mulai Checklist Baru</span>
        </button>
      </div>

      {/* Modal Setup Apps Script */}
      <AppsScriptModal
        isOpen={showAppsScriptModal}
        onClose={() => setShowAppsScriptModal(false)}
        onSuccess={handleSendToAppsScript}
      />
    </div>
  );
};
