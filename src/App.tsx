import React, { useState, useEffect } from 'react';
import { Navbar, ActiveTab } from './components/Navbar';
import { HomeView } from './components/HomeView';
import { ChecklistWizard } from './components/ChecklistWizard/ChecklistWizard';
import { GateQrView } from './components/GateQrView';
import { AdminDashboard } from './components/AdminDashboard';
import { getInspections } from './services/storageService';
import { InspectionRecord } from './types/k3';
import { GoogleAuthProviderContext } from './context/GoogleAuthContext';
import { ShieldCheck, HardHat, Zap, CheckCircle2 } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [records, setRecords] = useState<InspectionRecord[]>([]);

  const refreshRecords = () => {
    setRecords(getInspections());
  };

  useEffect(() => {
    refreshRecords();
  }, []);

  return (
    <GoogleAuthProviderContext>
      <div className="min-h-screen bg-[#F8FAFC] text-slate-800 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
        {/* Navigation Header */}
        <Navbar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          pendingCount={records.filter(r => r.status === 'TIDAK_LAYAK').length}
        />

        {/* Main Container */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {activeTab === 'home' && (
            <HomeView
              onStartChecklist={() => setActiveTab('checklist')}
              onOpenQrGate={() => setActiveTab('qr_gate')}
              onOpenAdmin={() => setActiveTab('admin')}
            />
          )}

          {activeTab === 'checklist' && (
            <ChecklistWizard
              onViewInAdmin={() => setActiveTab('admin')}
              onRefreshRecords={refreshRecords}
            />
          )}

          {activeTab === 'qr_gate' && (
            <GateQrView
              onStartChecklist={() => setActiveTab('checklist')}
            />
          )}

          {activeTab === 'admin' && (
            <AdminDashboard
              records={records}
              onRecordsChange={setRecords}
            />
          )}
        </main>

        {/* Corporate Clean Footer */}
        <footer className="bg-white border-t border-slate-200 py-6 px-4 sm:px-6 lg:px-8 mt-auto print:hidden">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-400 border border-amber-500 flex items-center justify-center text-red-600 shadow-sm">
                <Zap className="w-5 h-5 fill-red-600" />
              </div>
              <div>
                <div className="font-bold text-slate-800">
                  PT PLN (Persero) • Unit Layanan Transmisi & Gardu Induk (ULTG) Waru
                </div>
                <div className="text-[11px] text-slate-400">
                  Sistem Informasi K3 & Verifikasi APD Zona Merah GIS 150 kV
                </div>
              </div>
            </div>

            {/* Safety Commitment */}
            <div className="flex items-center gap-2 bg-slate-50 px-3.5 py-1.5 rounded-full border border-slate-200 text-slate-700 text-[11px] font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Komitmen Bersama: <strong>Zero Accident di Setiap Pekerjaan</strong></span>
            </div>

            {/* Quick Links */}
            <div className="flex items-center gap-4 text-[11px] font-medium text-slate-600">
              <button
                onClick={() => setActiveTab('checklist')}
                className="hover:text-[#00829B] transition-colors cursor-pointer"
              >
                Mulai Checklist
              </button>
              <span>•</span>
              <button
                onClick={() => setActiveTab('qr_gate')}
                className="hover:text-[#00829B] transition-colors cursor-pointer"
              >
                QR Gate
              </button>
              <span>•</span>
              <button
                onClick={() => setActiveTab('admin')}
                className="hover:text-[#00829B] transition-colors cursor-pointer"
              >
                Dashboard
              </button>
            </div>
          </div>
        </footer>
      </div>
    </GoogleAuthProviderContext>
  );
}
