import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  QrCode, 
  LayoutDashboard, 
  Home, 
  ClipboardCheck, 
  Zap,
  FileSpreadsheet,
  CheckCircle2,
  Settings
} from 'lucide-react';
import { AppsScriptModal } from './AppsScriptModal';
import { getAppsScriptUrl } from '../services/appsScriptService';

export type ActiveTab = 'home' | 'checklist' | 'qr_gate' | 'admin';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  pendingCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, pendingCount = 0 }) => {
  const [showAppsScriptModal, setShowAppsScriptModal] = useState<boolean>(false);
  const [hasAppsScriptUrl, setHasAppsScriptUrl] = useState<boolean>(false);

  const checkUrl = () => {
    setHasAppsScriptUrl(Boolean(getAppsScriptUrl()));
  };

  useEffect(() => {
    checkUrl();
  }, []);

  return (
    <>
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
        {/* Top Corporate Strip - Authentic PLN Corporate Blue */}
        <div className="bg-[#005B6E] text-white text-[11px] font-semibold py-1.5 px-4 sm:px-8 flex items-center justify-between">
          <div className="flex items-center gap-2 tracking-wide font-medium">
            <span className="font-bold text-amber-300">PT PLN (PERSERO)</span>
            <span className="text-cyan-200/60 hidden sm:inline">•</span>
            <span className="text-cyan-100 hidden sm:inline">UNIT LAYANAN TRANSMISI DAN GARDU INDUK (ULTG) WARU</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="bg-red-600 text-white font-bold text-[10px] px-2 py-0.5 rounded tracking-wider uppercase flex items-center gap-1">
              <Zap className="w-3 h-3 text-amber-300" />
              <span>ZONA MERAH 150 KV</span>
            </span>
            <span className="hidden md:inline-block text-[11px] text-cyan-100 font-normal">
              SOP K3 & APD WAJIB
            </span>
          </div>
        </div>

        {/* Main Navbar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Official PLN Brand Identity */}
            <div 
              onClick={() => setActiveTab('home')}
              className="flex items-center gap-3 cursor-pointer group"
            >
              {/* PLN Diamond Logo with Red Lightning & Blue Waves */}
              <div className="w-10 h-10 rounded-lg bg-amber-400 flex items-center justify-center shadow-sm relative overflow-hidden border border-amber-500 shrink-0">
                <div className="absolute inset-x-0 bottom-1 flex flex-col items-center gap-0.5 opacity-90">
                  <div className="w-6 h-0.5 bg-[#00829B] rounded-full"></div>
                  <div className="w-6 h-0.5 bg-[#00829B] rounded-full"></div>
                  <div className="w-6 h-0.5 bg-[#00829B] rounded-full"></div>
                </div>
                <Zap className="w-6 h-6 text-red-600 fill-red-600 drop-shadow -mt-1" />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-base sm:text-lg tracking-tight text-slate-900 group-hover:text-[#00829B] transition-colors">
                    PLN K3 GIS WARU
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
                  Sistem Verifikasi Checklist K3 & AI APD Vision 150 kV
                </p>
              </div>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1">
              <button
                onClick={() => setActiveTab('home')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === 'home'
                    ? 'bg-cyan-50 text-[#00829B] font-bold border border-cyan-200'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Home className="w-4 h-4" />
                <span>Beranda</span>
              </button>

              <button
                onClick={() => setActiveTab('checklist')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all shadow-sm ${
                  activeTab === 'checklist'
                    ? 'bg-[#00829B] text-white shadow-cyan-900/10'
                    : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <ClipboardCheck className="w-4 h-4 text-amber-300" />
                <span>Mulai Checklist K3</span>
              </button>

              <button
                onClick={() => setActiveTab('qr_gate')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === 'qr_gate'
                    ? 'bg-cyan-50 text-[#00829B] font-bold border border-cyan-200'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <QrCode className="w-4 h-4" />
                <span>QR Pintu Masuk</span>
              </button>

              <button
                onClick={() => setActiveTab('admin')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all relative ${
                  activeTab === 'admin'
                    ? 'bg-cyan-50 text-[#00829B] font-bold border border-cyan-200'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Dashboard Admin</span>
                {pendingCount > 0 && (
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-ping absolute top-2 right-2" />
                )}
              </button>
            </nav>

            {/* Google Apps Script Integration Button (100% Gratis Tanpa Billing) */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowAppsScriptModal(true)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer shadow-sm ${
                  hasAppsScriptUrl
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                    : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                }`}
                title="Konfigurasi Google Apps Script (Gratis)"
              >
                <FileSpreadsheet className={`w-4 h-4 ${hasAppsScriptUrl ? 'text-emerald-600' : 'text-[#00829B]'}`} />
                <span className="hidden sm:inline">Google Sheets</span>
                <span className={`w-2 h-2 rounded-full ${hasAppsScriptUrl ? 'bg-emerald-500' : 'bg-amber-400'}`} />
                <Settings className="w-3 h-3 text-slate-400" />
              </button>
            </div>
          </div>

          {/* Mobile Sub-Navigation Bar */}
          <div className="flex md:hidden items-center justify-around py-2 border-t border-slate-100 text-xs text-slate-600 overflow-x-auto">
            <button
              onClick={() => setActiveTab('home')}
              className={`px-3 py-1 rounded font-medium ${activeTab === 'home' ? 'text-[#00829B] font-bold bg-cyan-50' : ''}`}
            >
              Beranda
            </button>
            <button
              onClick={() => setActiveTab('checklist')}
              className={`px-3 py-1 rounded font-medium ${activeTab === 'checklist' ? 'text-[#00829B] font-bold bg-cyan-50' : ''}`}
            >
              Checklist
            </button>
            <button
              onClick={() => setActiveTab('qr_gate')}
              className={`px-3 py-1 rounded font-medium ${activeTab === 'qr_gate' ? 'text-[#00829B] font-bold bg-cyan-50' : ''}`}
            >
              QR Gate
            </button>
            <button
              onClick={() => setActiveTab('admin')}
              className={`px-3 py-1 rounded font-medium ${activeTab === 'admin' ? 'text-[#00829B] font-bold bg-cyan-50' : ''}`}
            >
              Admin
            </button>
          </div>
        </div>
      </header>

      {/* Apps Script Settings Modal */}
      <AppsScriptModal
        isOpen={showAppsScriptModal}
        onClose={() => setShowAppsScriptModal(false)}
        onSuccess={checkUrl}
      />
    </>
  );
};
