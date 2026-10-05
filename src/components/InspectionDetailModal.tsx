import React from 'react';
import { InspectionRecord } from '../types/k3';
import { CHECKLIST_QUESTIONS } from '../data/mockData';
import { ApdBoundingBoxOverlay } from './ApdBoundingBoxOverlay';
import { 
  X, 
  CheckCircle2, 
  XCircle, 
  ShieldCheck, 
  ShieldAlert, 
  Calendar, 
  Clock, 
  Zap
} from 'lucide-react';

interface InspectionDetailModalProps {
  record: InspectionRecord | null;
  onClose: () => void;
}

export const InspectionDetailModal: React.FC<InspectionDetailModalProps> = ({
  record,
  onClose,
}) => {
  if (!record) return null;

  const isLayak = record.status === 'LAYAK';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="p-5 sm:p-6 bg-slate-50 border-b border-slate-200 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              className={`p-2 rounded-xl ${
                isLayak ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
              }`}
            >
              {isLayak ? <ShieldCheck className="w-6 h-6" /> : <ShieldAlert className="w-6 h-6" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-slate-900">
                  Rincian Hasil Pemeriksaan K3 GIS Waru
                </h3>
                <span
                  className={`text-xs font-bold px-2 py-0.5 rounded ${
                    isLayak ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                  }`}
                >
                  {isLayak ? 'LAYAK' : 'TIDAK LAYAK'}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-mono">
                No: {record.id} • {record.user.tanggal} ({record.user.waktu} WIB)
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto text-xs sm:text-sm">
          {/* Identity Grid */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
            <h4 className="font-bold text-xs text-[#00829B] tracking-wide uppercase">
              DATA PERSONEL & KEPERLUAN KERJA
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              <div>
                <span className="text-slate-500 block">Nama Lengkap:</span>
                <span className="font-bold text-slate-900 text-sm">{record.user.nama}</span>
              </div>
              <div>
                <span className="text-slate-500 block">NIP / NIM / KTP:</span>
                <span className="font-mono text-slate-800 font-medium">{record.user.id_pengguna}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Instansi / Unit:</span>
                <span className="text-slate-800">{record.user.instansi}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Jabatan:</span>
                <span className="text-slate-800">{record.user.jabatan}</span>
              </div>
              <div className="sm:col-span-2 lg:col-span-4">
                <span className="text-slate-500 block">Keperluan Akses di Zona Merah:</span>
                <span className="text-slate-900 font-medium">{record.user.keperluan}</span>
              </div>
            </div>
          </div>

          {/* Photo & APD Comparison */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            {/* Photo with Bounding boxes */}
            <div className="md:col-span-5 flex flex-col items-center">
              <div className="relative w-full max-w-[260px] aspect-[3/4] rounded-xl overflow-hidden border border-slate-200 bg-slate-900 shadow-sm">
                <img
                  src={record.photoUrl}
                  alt="Foto Personel"
                  className="w-full h-full object-cover"
                />
                <ApdBoundingBoxOverlay detections={record.detections} />
              </div>
              <span className="text-[11px] text-slate-500 mt-2 font-mono">
                Bounding Box AI Computer Vision
              </span>
            </div>

            {/* APD Checklist */}
            <div className="md:col-span-7 space-y-3">
              <h4 className="font-bold text-xs text-slate-700 tracking-wide uppercase">
                STATUS KELENGKAPAN 5 ITEM APD
              </h4>

              <div className="space-y-2">
                {record.detections.map((d) => (
                  <div
                    key={d.key}
                    className={`p-3 rounded-lg border text-xs flex items-center justify-between ${
                      d.detected
                        ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
                        : 'bg-red-50/70 border-red-200 text-red-900'
                    }`}
                  >
                    <div>
                      <div className="font-bold">{d.nameIndo} ({d.name})</div>
                      <div className="text-[11px] text-slate-500">
                        {d.isMandatory ? 'Kategori: Wajib' : 'Kategori: Tambahan'} • Confidence: {d.confidence}%
                      </div>
                    </div>
                    <span className="font-bold">
                      {d.detected ? '✓ TERDETEKSI' : '✗ TIDAK ADA'}
                    </span>
                  </div>
                ))}
              </div>

              {/* Status Reasons */}
              {record.reasons.length > 0 && (
                <div className="p-3.5 rounded-lg bg-red-50 border border-red-200 text-red-900 space-y-1">
                  <div className="font-bold text-xs">Catatan / Alasan Penolakan:</div>
                  <ul className="list-disc list-inside space-y-0.5 text-xs">
                    {record.reasons.map((r, i) => (
                      <li key={i}>{r}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* 10 Checklist Answers Table */}
          <div className="space-y-2 pt-2">
            <h4 className="font-bold text-xs text-slate-700 tracking-wide uppercase">
              JAWABAN 10 CHECKLIST K3
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {CHECKLIST_QUESTIONS.map((q) => {
                const ans = record.checklistAnswers[q.id];
                const isYa = ans === 'ya';

                return (
                  <div
                    key={q.id}
                    className={`p-2.5 rounded-lg border flex items-center justify-between ${
                      isYa ? 'bg-slate-50 border-slate-200' : 'bg-red-50 border-red-200'
                    }`}
                  >
                    <span className="text-slate-800 pr-2 leading-tight">
                      {q.id}. {q.text}
                    </span>
                    <span
                      className={`font-bold px-2 py-0.5 rounded text-[11px] shrink-0 ${
                        isYa ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {isYa ? 'YA' : 'TIDAK'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-semibold cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
