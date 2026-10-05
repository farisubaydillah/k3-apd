import React, { useState, useEffect } from 'react';
import { 
  X, 
  FileSpreadsheet, 
  Copy, 
  Check, 
  ExternalLink, 
  Send, 
  Sparkles, 
  ShieldCheck, 
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { 
  getAppsScriptUrl, 
  setAppsScriptUrl, 
  APPS_SCRIPT_TEMPLATE_CODE, 
  sendToGoogleAppsScript 
} from '../services/appsScriptService';
import { getInspections } from '../services/storageService';

interface AppsScriptModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const AppsScriptModal: React.FC<AppsScriptModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [url, setUrl] = useState<string>('');
  const [copiedCode, setCopiedCode] = useState<boolean>(false);
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [testMessage, setTestMessage] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      setUrl(getAppsScriptUrl());
      setTestStatus('idle');
      setTestMessage('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(APPS_SCRIPT_TEMPLATE_CODE);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  const handleSave = () => {
    setAppsScriptUrl(url);
    if (onSuccess) onSuccess();
    onClose();
  };

  const handleTestSync = async () => {
    if (!url.trim()) {
      setTestStatus('error');
      setTestMessage('Masukkan URL Web App terlebih dahulu.');
      return;
    }

    setTestStatus('testing');
    setTestMessage('Mengirim data sampel ke Google Sheets...');

    try {
      setAppsScriptUrl(url);
      const records = getInspections();
      const sample = records[0] || {
        id: 'K3-TEST-APPS-SCRIPT',
        user: {
          nama: 'Uji Coba Sistem K3 GIS Waru',
          id_pengguna: '12345678',
          instansi: 'PT PLN (Persero)',
          jabatan: 'Pengawas K3',
          keperluan: 'Uji Coba Integrasi Google Apps Script',
          tanggal: new Date().toISOString().split('T')[0],
          waktu: '12:00',
        },
        checklistAnswers: {},
        photoUrl: '',
        detections: [
          { key: 'helmet', name: 'Safety Helmet', nameIndo: 'Helm Safety', isMandatory: true, detected: true, confidence: 99, color: '#f59e0b' },
          { key: 'vest', name: 'Reflective Vest', nameIndo: 'Rompi Safety', isMandatory: true, detected: true, confidence: 98, color: '#f97316' },
          { key: 'shoes', name: 'Safety Shoes', nameIndo: 'Sepatu Safety', isMandatory: true, detected: true, confidence: 95, color: '#3b82f6' },
        ],
        allMandatoryChecklistPassed: true,
        allMandatoryApdDetected: true,
        status: 'LAYAK',
        reasons: [],
        createdAt: new Date().toISOString(),
        verifiedByAi: true,
      };

      await sendToGoogleAppsScript(sample, url);
      setTestStatus('success');
      setTestMessage('Data berhasil dikirim! Periksa tab Google Sheets Anda sekarang.');
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setTestStatus('error');
      setTestMessage(err.message || 'Gagal mengirim data. Pastikan akses deployment diatur ke "Siapa saja".');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-5 sm:p-6 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-slate-900">
                  Integrasi Google Apps Script (100% Gratis)
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300">
                  Tanpa Billing & Tanpa Login
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Simpan data checklist K3 langsung ke Google Spreadsheet milik Anda
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 text-xs sm:text-sm text-slate-600 max-h-[72vh] overflow-y-auto">
          {/* Tutorial Card */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
              <span>5 LANGKAH MUDAH SETUP SPREADSHEET:</span>
            </div>

            <ol className="list-decimal list-inside space-y-2 text-xs text-slate-700 leading-relaxed">
              <li>
                Buka spreadsheet baru di browser:{' '}
                <a
                  href="https://sheets.new"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#00829B] font-bold underline inline-flex items-center gap-0.5"
                >
                  <span>sheets.new</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                Di Google Sheets, klik menu <strong>Ekstensi (Extensions)</strong> &gt; <strong>Apps Script</strong>.
              </li>
              <li>
                Hapus semua kode bawaan di editor, lalu tempel (*paste*) kode script yang ada di bawah ini.
              </li>
              <li>
                Klik tombol biru <strong>Terapkan (Deploy)</strong> &gt; <strong>Deployment Baru (New deployment)</strong>:
                <div className="pl-4 mt-1 space-y-0.5 text-slate-500 text-[11px]">
                  <div>• Pilih tipe: <strong>Aplikasi web (Web app)</strong></div>
                  <div>• Jalankan sebagai: <strong>Saya (email Anda)</strong></div>
                  <div>• Yang memiliki akses: <strong className="text-emerald-700">Siapa saja (Anyone)</strong> *(PENTING)*</div>
                </div>
              </li>
              <li>
                Salin <strong>URL Aplikasi Web</strong> yang berakhiran <code className="bg-slate-200 px-1 py-0.5 rounded text-[#00829B]">/exec</code> dan tempelkan pada kolom URL di bawah.
              </li>
            </ol>
          </div>

          {/* Copy Code Section */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="font-bold text-xs text-slate-800">
                Kode Google Apps Script (Code.gs):
              </label>
              <button
                type="button"
                onClick={handleCopyCode}
                className="px-2.5 py-1 rounded bg-[#00829B] hover:bg-[#006F85] text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                {copiedCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCode ? 'Tersalin!' : 'Salin Kode Script'}</span>
              </button>
            </div>
            <pre className="p-3 bg-slate-900 text-slate-200 rounded-xl text-[11px] font-mono overflow-x-auto max-h-36 border border-slate-700">
              {APPS_SCRIPT_TEMPLATE_CODE}
            </pre>
          </div>

          {/* Web App URL Input */}
          <div className="space-y-1.5">
            <label className="font-bold text-xs text-slate-800 block">
              URL Aplikasi Web Apps Script Anda:
            </label>
            <input
              type="text"
              placeholder="https://script.google.com/macros/s/AKfycb.../exec"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-[#00829B] font-mono"
            />
            <p className="text-[11px] text-slate-500">
              Pastikan URL berakhiran dengan kata <code className="text-[#00829B] font-bold">/exec</code>.
            </p>
          </div>

          {/* Test Status feedback */}
          {testStatus !== 'idle' && (
            <div
              className={`p-3 rounded-lg text-xs flex items-center gap-2 ${
                testStatus === 'success'
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : testStatus === 'error'
                  ? 'bg-red-50 text-red-800 border border-red-200'
                  : 'bg-slate-100 text-slate-700 border border-slate-200'
              }`}
            >
              {testStatus === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
              {testStatus === 'error' && <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />}
              <span>{testMessage}</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            type="button"
            disabled={testStatus === 'testing' || !url.trim()}
            onClick={handleTestSync}
            className="w-full sm:w-auto px-4 py-2 rounded-lg bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
          >
            <Send className="w-3.5 h-3.5 text-[#00829B]" />
            <span>Uji Kirim Data Baris</span>
          </button>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-800 font-medium text-xs cursor-pointer"
            >
              Tutup
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2 rounded-lg bg-[#00829B] hover:bg-[#006F85] text-white font-bold text-xs shadow-sm transition-colors cursor-pointer"
            >
              Simpan URL
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
