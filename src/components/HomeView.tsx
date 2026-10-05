import React from 'react';
import { 
  ShieldAlert, 
  ArrowRight, 
  Camera, 
  CheckCircle2, 
  AlertTriangle, 
  FileText, 
  HardHat, 
  QrCode, 
  Zap, 
  Lock,
  ChevronRight,
  ShieldCheck,
  Building2,
  FileSpreadsheet
} from 'lucide-react';

interface HomeViewProps {
  onStartChecklist: () => void;
  onOpenQrGate: () => void;
  onOpenAdmin: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ 
  onStartChecklist, 
  onOpenQrGate, 
  onOpenAdmin 
}) => {
  return (
    <div className="space-y-8 pb-12">
      {/* PLN Corporate Hero Banner */}
      <section className="relative overflow-hidden rounded-2xl bg-white border border-slate-200 shadow-sm p-6 sm:p-10 lg:p-12">
        {/* Subtle decorative accent */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-50/60 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-10 w-72 h-72 bg-amber-50/60 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-5">
            {/* Department Identifier */}
            <div className="flex items-center gap-2 text-xs font-semibold text-[#00829B]">
              <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
              <span>PT PLN (PERSERO) ULTG WARU</span>
              <span className="text-slate-300">|</span>
              <span className="text-slate-500">GARDU INDUK 150 KV</span>
            </div>

            {/* Main Headline */}
            <div className="space-y-2">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
                Sistem Checklist K3 <br />
                <span className="text-[#00829B]">
                  Zona Merah GIS Waru
                </span>
              </h1>
              <p className="text-base sm:text-lg text-slate-600 font-medium">
                Verifikasi digital kepatuhan keselamatan kerja & deteksi APD berbasis AI sebelum memasuki area bertegangan tinggi 150 kV.
              </p>
            </div>

            {/* Safety Commitment Banner */}
            <div className="p-3.5 rounded-xl bg-amber-50 border-l-4 border-amber-500 text-amber-900 text-xs sm:text-sm font-medium flex items-center gap-3">
              <Zap className="w-5 h-5 text-amber-600 shrink-0" />
              <span>
                <strong>Perhatian:</strong> Zona Merah adalah area gas insulated switchgear dengan medan elektromagnetik kuat. Tidak ada toleransi untuk ketidaklengkapan APD.
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                onClick={onStartChecklist}
                className="px-6 py-3 rounded-xl bg-[#00829B] hover:bg-[#006F85] text-white font-bold text-sm flex items-center gap-2.5 shadow-md shadow-cyan-900/10 transition-all cursor-pointer"
              >
                <span>Mulai Checklist K3</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={onOpenQrGate}
                className="px-5 py-3 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-semibold text-sm flex items-center gap-2 transition-colors cursor-pointer shadow-sm"
              >
                <QrCode className="w-4 h-4 text-[#00829B]" />
                <span>Lihat QR Gerbang Masuk</span>
              </button>

              <button
                type="button"
                onClick={onOpenAdmin}
                className="px-5 py-3 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-semibold text-sm flex items-center gap-2 transition-colors cursor-pointer shadow-sm"
              >
                <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                <span>Dashboard & Google Sheets</span>
              </button>
            </div>

            {/* Corporate KPI strip */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-100">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <div className="text-lg sm:text-xl font-extrabold text-slate-900">150 kV</div>
                <div className="text-[11px] text-slate-500">Tegangan Sistem GIS</div>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <div className="text-lg sm:text-xl font-extrabold text-[#00829B]">5 APD</div>
                <div className="text-[11px] text-slate-500">Verifikasi Kamera AI</div>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <div className="text-lg sm:text-xl font-extrabold text-emerald-600">100%</div>
                <div className="text-[11px] text-slate-500">Target Zero Accident</div>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Infographic of GIS Waru Red Zone */}
          <div className="lg:col-span-5 space-y-4">
            <div className="p-5 rounded-2xl bg-slate-900 text-white shadow-xl space-y-4 relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
                  <span className="text-xs font-bold tracking-wider text-red-400 uppercase">
                    PETA ZONA MERAH GIS WARU
                  </span>
                </div>
                <span className="text-[10px] font-mono bg-slate-800 text-slate-300 px-2 py-0.5 rounded">
                  ULTG WARU
                </span>
              </div>

              {/* Diagram GIS Busbar */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3 font-mono text-xs">
                <div className="flex items-center justify-between text-slate-400 text-[11px]">
                  <span>Peralatan: GIS SF6 150kV</span>
                  <span className="text-amber-400 font-bold">Interlock Gate: ON</span>
                </div>

                <div className="p-3 rounded-lg bg-red-950/60 border border-red-700/50 space-y-1">
                  <div className="text-red-300 font-bold flex items-center gap-1.5">
                    <ShieldAlert className="w-4 h-4 text-red-400" />
                    <span>ZONA MERAH (Dilarang Masuk Tanpa Izin)</span>
                  </div>
                  <p className="text-[11px] text-slate-300 font-sans leading-relaxed">
                    Radius bahaya induksi tinggi dan tabung gas SF6 bertekanan. APD Wajib: Safety Helmet, Rompi Reflektor, Sepatu Safety 20kV.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300 font-sans">
                  <div className="p-2 rounded bg-slate-900 border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">Jarak Bebas Minimum:</span>
                    <strong className="text-white">1.50 Meter</strong>
                  </div>
                  <div className="p-2 rounded bg-slate-900 border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">Media Isolasi:</span>
                    <strong className="text-cyan-400">Gas SF6 (Sulfur Hexafluoride)</strong>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                <span>Standar K3: PLN SPLN K3 / OHSAS</span>
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Sistem Aktif
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SOP Workflow Steps - Clean PLN Corporate White Cards */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Alur Verifikasi K3 Sebelum Memasuki Zona Merah
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Setiap teknisi dan pengunjung wajib menuntaskan tahapan berikut:
            </p>
          </div>
          <button
            type="button"
            onClick={onStartChecklist}
            className="text-xs font-bold text-[#00829B] hover:text-[#006F85] flex items-center gap-1 self-start sm:self-auto cursor-pointer"
          >
            <span>Mulai Proses Verifikasi</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Step 1 */}
          <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-sm space-y-3 relative group hover:border-[#00829B] transition-colors">
            <div className="w-10 h-10 rounded-lg bg-cyan-50 border border-cyan-200 text-[#00829B] flex items-center justify-center font-bold text-sm">
              01
            </div>
            <h3 className="font-bold text-slate-900 text-sm">
              Data Diri & Keperluan
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Pengisian nama, NIP/NIM, instansi (PLN/Vendor/Tamu), jabatan, dan keperluan pekerjaan di area GIS.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-sm space-y-3 relative group hover:border-[#00829B] transition-colors">
            <div className="w-10 h-10 rounded-lg bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center font-bold text-sm">
              02
            </div>
            <h3 className="font-bold text-slate-900 text-sm">
              10 Checklist Evaluasi K3
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Verifikasi mandiri mengenai pemahaman bahaya tegangan tinggi, SOP GIS, izin kerja (Working Permit), dan kondisi fisik.
            </p>
          </div>

          {/* Step 3 & 4 */}
          <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-sm space-y-3 relative group hover:border-[#00829B] transition-colors">
            <div className="w-10 h-10 rounded-lg bg-purple-50 border border-purple-200 text-purple-700 flex items-center justify-center font-bold text-sm">
              03
            </div>
            <h3 className="font-bold text-slate-900 text-sm">
              Foto & Deteksi APD Vision
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Ambil foto tubuh personel. Sistem AI mendeteksi kelengkapan Helm, Rompi, dan Sepatu Safety secara otomatis.
            </p>
          </div>

          {/* Step 5 */}
          <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-sm space-y-3 relative group hover:border-[#00829B] transition-colors">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center font-bold text-sm">
              04
            </div>
            <h3 className="font-bold text-slate-900 text-sm">
              Tiket Izin Masuk QR
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Sistem menerbitkan status LAYAK beserta kode QR pintu gerbang dan opsi sinkronisasi otomatis ke Google Sheets PLN.
            </p>
          </div>
        </div>
      </section>

      {/* Safety Matrix Table - Clean Corporate Design */}
      <section className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/90 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <HardHat className="w-5 h-5 text-[#00829B]" />
              <span>Standar APD Wajib Zona Merah GIS Waru 150 kV</span>
            </h2>
            <p className="text-xs text-slate-500">
              Sesuai Peraturan Direksi PT PLN (Persero) No. 0081.P/DIR/2019 tentang Pedoman K3
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded bg-red-50 text-red-700 border border-red-200 self-start sm:self-auto">
            Wajib 100% Dipatuhi
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-slate-900">Safety Helmet</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-100 text-red-800">WAJIB</span>
            </div>
            <p className="text-xs text-slate-600">
              Melindungi dari bahaya benturan peralatan busbar dan tegangan induksi kejut. Tali dagu (chin strap) wajib terpasang kencang.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-slate-900">Rompi Reflektor (Hi-Vis)</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-100 text-red-800">WAJIB</span>
            </div>
            <p className="text-xs text-slate-600">
              Warna oranye/hijau neon menyala dengan strip scotchlite pemantul cahaya agar personel terpantau jelas di ruang gardu switchgear.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-slate-900">Sepatu Safety Isolasi</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-100 text-red-800">WAJIB</span>
            </div>
            <p className="text-xs text-slate-600">
              Sepatu safety bersol dielektrik tahan tegangan langkah (step voltage) dan memiliki toe-cap baja pelindung benturan.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
