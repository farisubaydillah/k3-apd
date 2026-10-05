import React, { useState, useEffect } from 'react';
import { generateQRCodeDataUrl } from '../services/storageService';
import { QrCode, Download, Printer, ShieldAlert, ArrowRight, Copy, Check, Zap } from 'lucide-react';

interface GateQrViewProps {
  onStartChecklist: () => void;
}

export const GateQrView: React.FC<GateQrViewProps> = ({ onStartChecklist }) => {
  const defaultUrl = window.location.origin;
  const [targetUrl, setTargetUrl] = useState<string>(defaultUrl);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    generateQRCodeDataUrl(targetUrl).then((url) => {
      setQrCodeDataUrl(url);
    });
  }, [targetUrl]);

  const handleDownload = () => {
    if (!qrCodeDataUrl) return;
    const link = document.createElement('a');
    link.href = qrCodeDataUrl;
    link.download = `QR_CODE_PINTU_ZONA_MERAH_GIS_WARU.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(targetUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-16">
      {/* Title */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-50 border border-cyan-200 text-[#00829B] text-xs font-semibold">
          <QrCode className="w-3.5 h-3.5" />
          <span>PORTAL GERBANG FISIK GIS WARU</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          Standee QR Code Gerbang Zona Merah
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto">
          Cetak poster / standee ini untuk dipasang pada pintu pembatas Gardu Induk GIS Waru 150 kV. Pekerja cukup memindai QR Code untuk memulai checklist K3.
        </p>
      </div>

      {/* URL Customizer Panel */}
      <div className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-sm space-y-3">
        <label className="text-xs font-bold text-slate-700 block">
          Target Tautan / URL Pindai QR Code:
        </label>
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={targetUrl}
            onChange={(e) => setTargetUrl(e.target.value)}
            className="flex-1 bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-[#00829B] focus:bg-white font-mono"
            placeholder="https://..."
          />
          <button
            type="button"
            onClick={handleCopy}
            className="px-3.5 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-300"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Tersalin' : 'Salin URL'}</span>
          </button>
        </div>
      </div>

      {/* Printable Poster Standee - Authentic PLN Clean Poster */}
      <div className="bg-white rounded-2xl border-2 border-slate-300 p-8 shadow-sm text-center space-y-6 max-w-md mx-auto">
        {/* Header Poster */}
        <div className="space-y-2 border-b border-slate-200 pb-5">
          <div className="w-12 h-12 rounded-lg bg-amber-400 border border-amber-500 flex items-center justify-center text-red-600 shadow-sm mx-auto">
            <Zap className="w-7 h-7 fill-red-600" />
          </div>
          <div className="text-xs font-bold text-[#00829B] tracking-wide">
            PT PLN (PERSERO) • ULTG WARU
          </div>
          <h2 className="text-xl font-black text-slate-900 leading-tight">
            PERINGATAN BAHAYA <br />
            <span className="text-red-600">ZONA MERAH GIS 150 KV</span>
          </h2>
          <p className="text-xs text-slate-600">
            DILARANG MEMASUKI AREA INI TANPA VERIFIKASI K3 & APD LENGKAP
          </p>
        </div>

        {/* Big QR Code */}
        <div className="flex flex-col items-center space-y-3">
          <div className="p-4 bg-white rounded-2xl border-2 border-slate-200 shadow-sm">
            {qrCodeDataUrl ? (
              <img
                src={qrCodeDataUrl}
                alt="QR Code Pintu Masuk"
                className="w-56 h-56 mx-auto"
              />
            ) : (
              <div className="w-56 h-56 flex items-center justify-center text-slate-400">
                Membuat QR Code...
              </div>
            )}
          </div>
          <div className="text-xs font-bold text-slate-800">
            PINDAI UNTUK VERIFIKASI K3
          </div>
          <p className="text-[11px] text-slate-500 max-w-xs leading-relaxed">
            Gunakan kamera smartphone untuk mengisi checklist keselamatan dan memverifikasi APD secara digital sebelum membuka pintu interlock.
          </p>
        </div>

        {/* 3 Step Icons */}
        <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-100 text-[11px] text-slate-600">
          <div className="p-2 rounded bg-slate-50 border border-slate-200">
            <span className="font-bold text-slate-900 block">1. Pindai</span>
            <span>QR Code pintu</span>
          </div>
          <div className="p-2 rounded bg-slate-50 border border-slate-200">
            <span className="font-bold text-slate-900 block">2. Foto APD</span>
            <span>Verifikasi AI</span>
          </div>
          <div className="p-2 rounded bg-slate-50 border border-slate-200">
            <span className="font-bold text-slate-900 block">3. Buka Pintu</span>
            <span>Izin resmi</span>
          </div>
        </div>
      </div>

      {/* Standee Actions */}
      <div className="flex items-center justify-center gap-3">
        <button
          type="button"
          onClick={handlePrint}
          className="px-5 py-2.5 rounded-lg bg-[#00829B] hover:bg-[#006F85] text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-sm transition-all cursor-pointer"
        >
          <Printer className="w-4 h-4" />
          <span>Cetak Poster Standee (A4)</span>
        </button>

        <button
          type="button"
          onClick={handleDownload}
          className="px-5 py-2.5 rounded-lg bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-semibold text-xs sm:text-sm flex items-center gap-2 shadow-sm transition-colors cursor-pointer"
        >
          <Download className="w-4 h-4 text-slate-500" />
          <span>Unduh Gambar QR</span>
        </button>

        <button
          type="button"
          onClick={onStartChecklist}
          className="px-5 py-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs sm:text-sm flex items-center gap-2 border border-slate-300 cursor-pointer"
        >
          <span>Uji Coba Checklist Sekarang</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
