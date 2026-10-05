import React, { useState, useMemo } from 'react';
import { InspectionRecord } from '../types/k3';
import { deleteInspection, resetToInitialInspections, exportInspectionsToCsv } from '../services/storageService';
import { InspectionDetailModal } from './InspectionDetailModal';
import { AppsScriptModal } from './AppsScriptModal';
import { 
  getAppsScriptUrl, 
  sendToGoogleAppsScript 
} from '../services/appsScriptService';
import { 
  Search, 
  Download, 
  Trash2, 
  Eye, 
  RotateCcw, 
  ShieldCheck, 
  ShieldAlert, 
  Calendar, 
  CheckCircle2, 
  XCircle,
  Activity,
  HardHat,
  FileSpreadsheet,
  ExternalLink,
  UploadCloud,
  Check,
  Zap,
  Settings,
  AlertCircle
} from 'lucide-react';

interface AdminDashboardProps {
  records: InspectionRecord[];
  onRecordsChange: (updated: InspectionRecord[]) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  records,
  onRecordsChange,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'LAYAK' | 'TIDAK_LAYAK'>('ALL');
  const [selectedRecord, setSelectedRecord] = useState<InspectionRecord | null>(null);

  // Apps Script sync state
  const [showAppsScriptModal, setShowAppsScriptModal] = useState<boolean>(false);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [syncAlert, setSyncAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Statistics calculation
  const totalCount = records.length;
  const layakCount = records.filter((r) => r.status === 'LAYAK').length;
  const tidakLayakCount = records.filter((r) => r.status === 'TIDAK_LAYAK').length;

  const todayStr = new Date().toISOString().split('T')[0];
  const todayCount = records.filter((r) => r.user.tanggal === todayStr || r.createdAt.startsWith(todayStr)).length;
  const complianceRate = totalCount > 0 ? Math.round((layakCount / totalCount) * 100) : 0;

  const hasAppsScriptUrl = Boolean(getAppsScriptUrl());

  // Filtered records
  const filteredRecords = useMemo(() => {
    return records.filter((r) => {
      const matchesSearch =
        r.user.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.user.id_pengguna.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.user.instansi.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.id.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === 'ALL' ? true : r.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [records, searchQuery, statusFilter]);

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(`Apakah Anda yakin ingin menghapus data pemeriksaan ${id}?`)) {
      const updated = deleteInspection(id);
      onRecordsChange(updated);
    }
  };

  const handleResetData = () => {
    if (confirm('Muat ulang dataset awal simulasi K3 GIS Waru?')) {
      const reset = resetToInitialInspections();
      onRecordsChange(reset);
    }
  };

  const handleExportCsv = () => {
    exportInspectionsToCsv(filteredRecords);
  };

  const handleSyncToAppsScript = async () => {
    const url = getAppsScriptUrl();
    if (!url) {
      setShowAppsScriptModal(true);
      return;
    }

    setIsSyncing(true);
    setSyncAlert(null);

    try {
      const res = await sendToGoogleAppsScript(filteredRecords);
      setSyncAlert({
        type: 'success',
        message: `${res.message} (${filteredRecords.length} baris telah tersinkronkan ke Google Spreadsheet).`,
      });
    } catch (err: any) {
      setSyncAlert({
        type: 'error',
        message: err.message || 'Gagal mengirim data ke Google Apps Script.',
      });
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Title & Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200/90 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#00829B]">
            <span>PANEL PENGAWAS K3</span>
            <span className="text-slate-300">•</span>
            <span className="text-slate-500">DATABASE GIS 150 KV WARU</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1">
            Dashboard Monitoring K3 & Log Akses Masuk
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Rekapitulasi riwayat keselamatan, verifikasi APD, dan sinkronisasi Google Sheets (Apps Script 100% Gratis)
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Google Sheets Sync via Apps Script Button */}
          <button
            type="button"
            disabled={isSyncing}
            onClick={handleSyncToAppsScript}
            className="px-4 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-all cursor-pointer disabled:opacity-70"
          >
            <FileSpreadsheet className={`w-4 h-4 ${isSyncing ? 'animate-bounce' : ''}`} />
            <span>{isSyncing ? 'Menyinkronkan...' : 'Kirim ke Google Sheets'}</span>
          </button>

          <button
            type="button"
            onClick={handleExportCsv}
            className="px-3.5 py-2.5 rounded-lg bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
          >
            <Download className="w-3.5 h-3.5 text-slate-600" />
            <span>Ekspor CSV</span>
          </button>

          <button
            type="button"
            onClick={handleResetData}
            className="px-3 py-2.5 rounded-lg bg-white hover:bg-slate-50 text-slate-600 border border-slate-300 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
            title="Reset data ke bawaan"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo</span>
          </button>
        </div>
      </div>

      {/* Sync Alert Banner */}
      {syncAlert && (
        <div
          className={`p-4 rounded-xl text-xs sm:text-sm flex items-center justify-between gap-3 ${
            syncAlert.type === 'success'
              ? 'bg-emerald-50 text-emerald-900 border border-emerald-300'
              : 'bg-red-50 text-red-900 border border-red-300'
          }`}
        >
          <div className="flex items-center gap-2">
            {syncAlert.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
            )}
            <span>{syncAlert.message}</span>
          </div>
          <button
            type="button"
            onClick={() => setSyncAlert(null)}
            className="text-xs font-bold underline cursor-pointer"
          >
            Tutup
          </button>
        </div>
      )}

      {/* Google Apps Script Integration Banner (100% Gratis Tanpa Billing) */}
      <div className="p-5 rounded-xl bg-white border border-slate-200/90 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 shrink-0">
            <FileSpreadsheet className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-wide">
                INTEGRASI GOOGLE APPS SCRIPT (WEB APP)
              </span>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">
                100% Gratis • Tanpa Billing Google Cloud
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600">
              {hasAppsScriptUrl ? (
                <>
                  Status: <strong className="text-emerald-700">Tersambung ke Google Spreadsheet Anda</strong>. Anda dapat mengirim data rekap K3 kapan saja secara langsung tanpa login atau setup OAuth.
                </>
              ) : (
                <>
                  Hubungkan Google Spreadsheet Anda menggunakan URL Apps Script untuk menyimpan seluruh riwayat pemeriksaan K3 secara otomatis dan gratis.
                </>
              )}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setShowAppsScriptModal(true)}
            className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-300"
          >
            <Settings className="w-3.5 h-3.5 text-[#00829B]" />
            <span>{hasAppsScriptUrl ? 'Ganti URL Apps Script' : 'Setup Apps Script (2 Menit)'}</span>
          </button>

          <button
            type="button"
            disabled={isSyncing}
            onClick={handleSyncToAppsScript}
            className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer disabled:opacity-60"
          >
            <UploadCloud className="w-3.5 h-3.5" />
            <span>{isSyncing ? 'Mengirim...' : 'Kirim Log Sekarang'}</span>
          </button>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        {/* Total Pemeriksaan */}
        <div className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>TOTAL PEMERIKSAAN</span>
            <Activity className="w-4 h-4 text-cyan-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">{totalCount}</div>
          <div className="text-[11px] text-slate-400">Seluruh riwayat personel</div>
        </div>

        {/* Layak Masuk */}
        <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200/80 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-emerald-800 text-xs font-semibold">
            <span>LAYAK MASUK</span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-700">{layakCount}</div>
          <div className="text-[11px] text-emerald-600">Lolos verifikasi K3 & APD</div>
        </div>

        {/* Tidak Layak */}
        <div className="p-4 rounded-xl bg-red-50/60 border border-red-200/80 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-red-800 text-xs font-semibold">
            <span>TIDAK LAYAK</span>
            <ShieldAlert className="w-4 h-4 text-red-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-red-700">{tidakLayakCount}</div>
          <div className="text-[11px] text-red-600">Akses ditolak / APD kurang</div>
        </div>

        {/* Hari Ini */}
        <div className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>HARI INI</span>
            <Calendar className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">{todayCount}</div>
          <div className="text-[11px] text-slate-400">Inspeksi tanggal ini</div>
        </div>

        {/* Kepatuhan APD */}
        <div className="col-span-2 sm:col-span-1 p-4 rounded-xl bg-white border border-slate-200/90 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>KEPATUHAN APD</span>
            <HardHat className="w-4 h-4 text-[#00829B]" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#00829B]">{complianceRate}%</div>
          <div className="text-[11px] text-slate-400">Indeks kepatuhan K3</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari nama, NIP/NIM, instansi..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 rounded-lg pl-9 pr-4 py-2 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#00829B] focus:bg-white transition-colors"
          />
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1 self-stretch md:self-auto overflow-x-auto bg-slate-100 p-1 rounded-lg">
          <button
            type="button"
            onClick={() => setStatusFilter('ALL')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
              statusFilter === 'ALL'
                ? 'bg-white text-slate-900 shadow-sm font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Semua ({records.length})
          </button>

          <button
            type="button"
            onClick={() => setStatusFilter('LAYAK')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
              statusFilter === 'LAYAK'
                ? 'bg-white text-emerald-700 shadow-sm font-bold'
                : 'text-slate-600 hover:text-emerald-700'
            }`}
          >
            Layak ({layakCount})
          </button>

          <button
            type="button"
            onClick={() => setStatusFilter('TIDAK_LAYAK')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
              statusFilter === 'TIDAK_LAYAK'
                ? 'bg-white text-red-700 shadow-sm font-bold'
                : 'text-slate-600 hover:text-red-700'
            }`}
          >
            Tidak Layak ({tidakLayakCount})
          </button>
        </div>
      </div>

      {/* History Table */}
      <div className="bg-white rounded-xl border border-slate-200/90 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">No</th>
                <th className="py-3 px-4">Nama Personel</th>
                <th className="py-3 px-4">NIP / ID</th>
                <th className="py-3 px-4">Instansi & Jabatan</th>
                <th className="py-3 px-4">Waktu Akses</th>
                <th className="py-3 px-4 text-center">Status APD Wajib</th>
                <th className="py-3 px-4 text-center">Status Kelayakan</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">
                    Tidak ditemukan data riwayat pemeriksaan yang sesuai kriteria pencarian.
                  </td>
                </tr>
              ) : (
                filteredRecords.map((r, index) => {
                  const isLayak = r.status === 'LAYAK';
                  const helmOk = r.detections.find((d) => d.key === 'helmet')?.detected;
                  const vestOk = r.detections.find((d) => d.key === 'vest')?.detected;
                  const shoesOk = r.detections.find((d) => d.key === 'shoes')?.detected;

                  return (
                    <tr
                      key={r.id}
                      onClick={() => setSelectedRecord(r)}
                      className="hover:bg-slate-50/80 cursor-pointer transition-colors"
                    >
                      <td className="py-3.5 px-4 text-slate-400 font-medium">
                        {index + 1}
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900 text-sm">{r.user.nama}</div>
                        <div className="text-[11px] font-mono text-slate-400 truncate max-w-[180px]">
                          {r.id}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 font-mono text-slate-600">
                        {r.user.id_pengguna}
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-medium text-slate-800">{r.user.instansi}</div>
                        <div className="text-[11px] text-slate-500">{r.user.jabatan}</div>
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="font-medium text-slate-800">{r.user.tanggal}</div>
                        <div className="text-[11px] text-slate-500">{r.user.waktu} WIB</div>
                      </td>

                      {/* APD Mini Badges */}
                      <td className="py-3.5 px-4 text-center">
                        <div className="inline-flex items-center gap-1">
                          <span
                            title={`Helm: ${helmOk ? 'Terdeteksi' : 'Tidak Ada'}`}
                            className={`w-6 h-6 rounded flex items-center justify-center text-[10px] font-bold ${
                              helmOk ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
                            }`}
                          >
                            H
                          </span>
                          <span
                            title={`Rompi: ${vestOk ? 'Terdeteksi' : 'Tidak Ada'}`}
                            className={`w-6 h-6 rounded flex items-center justify-center text-[10px] font-bold ${
                              vestOk ? 'bg-orange-100 text-orange-800' : 'bg-red-100 text-red-800'
                            }`}
                          >
                            V
                          </span>
                          <span
                            title={`Sepatu: ${shoesOk ? 'Terdeteksi' : 'Tidak Ada'}`}
                            className={`w-6 h-6 rounded flex items-center justify-center text-[10px] font-bold ${
                              shoesOk ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'
                            }`}
                          >
                            S
                          </span>
                        </div>
                      </td>

                      {/* Status Kelayakan */}
                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                            isLayak
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {isLayak ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>LAYAK</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="w-3.5 h-3.5" />
                              <span>TIDAK LAYAK</span>
                            </>
                          )}
                        </span>
                      </td>

                      {/* Action */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedRecord(r);
                            }}
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                            title="Lihat Detail Pemeriksaan"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={(e) => handleDelete(r.id, e)}
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-red-50 text-slate-500 hover:text-red-600 transition-colors cursor-pointer"
                            title="Hapus Data"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Detail */}
      <InspectionDetailModal
        record={selectedRecord}
        onClose={() => setSelectedRecord(null)}
      />

      {/* Modal Setup Apps Script */}
      <AppsScriptModal
        isOpen={showAppsScriptModal}
        onClose={() => setShowAppsScriptModal(false)}
      />
    </div>
  );
};
