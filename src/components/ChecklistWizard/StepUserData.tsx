import React, { useState } from 'react';
import { UserFormData } from '../../types/k3';
import { User, Building2, Briefcase, FileQuestion, Calendar, Clock, ArrowRight, AlertCircle } from 'lucide-react';

interface StepUserDataProps {
  data: UserFormData;
  onChange: (updated: UserFormData) => void;
  onNext: () => void;
}

export const StepUserData: React.FC<StepUserDataProps> = ({ data, onChange, onNext }) => {
  const [errors, setErrors] = useState<Partial<Record<keyof UserFormData, string>>>({});

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof UserFormData, string>> = {};

    if (!data.nama.trim()) newErrors.nama = 'Nama lengkap wajib diisi';
    if (!data.id_pengguna.trim()) newErrors.id_pengguna = 'ID / NIM / NIP wajib diisi';
    if (!data.instansi.trim()) newErrors.instansi = 'Instansi / Divisi wajib diisi';
    if (!data.jabatan.trim()) newErrors.jabatan = 'Jabatan wajib diisi';
    if (!data.keperluan.trim()) newErrors.keperluan = 'Keperluan memasuki Zona Merah wajib diisi';
    if (!data.tanggal) newErrors.tanggal = 'Tanggal wajib diisi';
    if (!data.waktu) newErrors.waktu = 'Waktu wajib diisi';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onNext();
    }
  };

  const fillSampleData = (type: 'pln' | 'vendor' | 'student') => {
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    if (type === 'pln') {
      onChange({
        nama: 'Agung Prasetyo, S.T.',
        id_pengguna: '199208152014021004',
        instansi: 'PT PLN (Persero) ULTG Waru',
        jabatan: 'Senior Engineer Pemeliharaan GIS 150kV',
        keperluan: 'Pemeriksaan Rutin SF6 Density Monitor & Interlock Kubikel Bay Waru-Rungkut 1',
        tanggal: dateStr,
        waktu: timeStr,
      });
    } else if (type === 'vendor') {
      onChange({
        nama: 'Hendrik Sanjaya',
        id_pengguna: 'VND-ABB-2026-08',
        instansi: 'PT Hitachi Energy Indonesia (Vendor GIS)',
        jabatan: 'Spesialis Switchgear SF6',
        keperluan: 'Retrofit Circuit Breaker Compartment Bay Trafo 60MVA GIS Waru',
        tanggal: dateStr,
        waktu: timeStr,
      });
    } else {
      onChange({
        nama: 'Muhammad Faris Ubaydillah',
        id_pengguna: '21050874012',
        instansi: 'Universitas Negeri Surabaya (Magang K3)',
        jabatan: 'Mahasiswa Magang K3 & Proteksi',
        keperluan: 'Pengujian Lapangan Proyek Sistem Checklist K3 & Deteksi APD AI di Gardu Induk',
        tanggal: dateStr,
        waktu: timeStr,
      });
    }
    setErrors({});
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
      {/* Title & Quick Demo Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <div className="text-xs font-bold text-[#00829B] tracking-wide">
            LANGKAH 01 DARI 05
          </div>
          <h2 className="text-xl font-bold text-slate-900 mt-0.5">
            Identitas Personel & Keperluan Akses
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Setiap orang yang melintasi pintu Zona Merah GIS Waru wajib tercatat secara resmi.
          </p>
        </div>

        {/* Quick Fill Buttons for Fast Testing */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[11px] font-medium text-slate-500 mr-1">
            Contoh Cepat:
          </span>
          <button
            type="button"
            onClick={() => fillSampleData('pln')}
            className="px-2.5 py-1 text-xs font-semibold rounded bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
          >
            Pegawai PLN
          </button>
          <button
            type="button"
            onClick={() => fillSampleData('vendor')}
            className="px-2.5 py-1 text-xs font-semibold rounded bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
          >
            Vendor GIS
          </button>
          <button
            type="button"
            onClick={() => fillSampleData('student')}
            className="px-2.5 py-1 text-xs font-semibold rounded bg-cyan-50 hover:bg-cyan-100 text-[#00829B] border border-cyan-200 transition-colors cursor-pointer"
          >
            Mahasiswa
          </button>
        </div>
      </div>

      {/* Form Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Nama Lengkap */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-[#00829B]" />
            <span>Nama Lengkap Personel <span className="text-red-500">*</span></span>
          </label>
          <input
            type="text"
            placeholder="Contoh: Agung Prasetyo, S.T."
            value={data.nama}
            onChange={(e) => onChange({ ...data, nama: e.target.value })}
            className={`w-full bg-slate-50 border rounded-lg px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#00829B] transition-colors ${
              errors.nama ? 'border-red-500' : 'border-slate-300'
            }`}
          />
          {errors.nama && (
            <p className="text-xs text-red-600 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              <span>{errors.nama}</span>
            </p>
          )}
        </div>

        {/* NIP / NIM / KTP */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
            <span>Nomor Identitas (NIP / NIM / KTP) <span className="text-red-500">*</span></span>
          </label>
          <input
            type="text"
            placeholder="Contoh: 199208152014021004 / 21050874012"
            value={data.id_pengguna}
            onChange={(e) => onChange({ ...data, id_pengguna: e.target.value })}
            className={`w-full bg-slate-50 border rounded-lg px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#00829B] transition-colors font-mono ${
              errors.id_pengguna ? 'border-red-500' : 'border-slate-300'
            }`}
          />
          {errors.id_pengguna && (
            <p className="text-xs text-red-600 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              <span>{errors.id_pengguna}</span>
            </p>
          )}
        </div>

        {/* Instansi / Unit */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-[#00829B]" />
            <span>Instansi / Unit / Perusahaan <span className="text-red-500">*</span></span>
          </label>
          <input
            type="text"
            placeholder="Contoh: PT PLN (Persero) ULTG Waru"
            value={data.instansi}
            onChange={(e) => onChange({ ...data, instansi: e.target.value })}
            className={`w-full bg-slate-50 border rounded-lg px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#00829B] transition-colors ${
              errors.instansi ? 'border-red-500' : 'border-slate-300'
            }`}
          />
          {errors.instansi && (
            <p className="text-xs text-red-600 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              <span>{errors.instansi}</span>
            </p>
          )}
        </div>

        {/* Jabatan / Posisi */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
            <Briefcase className="w-3.5 h-3.5 text-[#00829B]" />
            <span>Jabatan / Peran Kerja <span className="text-red-500">*</span></span>
          </label>
          <input
            type="text"
            placeholder="Contoh: Teknisi Pemeliharaan GIS / Pengawas K3"
            value={data.jabatan}
            onChange={(e) => onChange({ ...data, jabatan: e.target.value })}
            className={`w-full bg-slate-50 border rounded-lg px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#00829B] transition-colors ${
              errors.jabatan ? 'border-red-500' : 'border-slate-300'
            }`}
          />
          {errors.jabatan && (
            <p className="text-xs text-red-600 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              <span>{errors.jabatan}</span>
            </p>
          )}
        </div>

        {/* Keperluan Memasuki Zona Merah */}
        <div className="md:col-span-2 space-y-1.5">
          <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
            <FileQuestion className="w-3.5 h-3.5 text-[#00829B]" />
            <span>Deskripsi Keperluan / Pekerjaan di Zona Merah GIS Waru <span className="text-red-500">*</span></span>
          </label>
          <textarea
            rows={2}
            placeholder="Jelaskan jenis pekerjaan, nomor working permit (jika ada), bay peralatan yang dikerjakan..."
            value={data.keperluan}
            onChange={(e) => onChange({ ...data, keperluan: e.target.value })}
            className={`w-full bg-slate-50 border rounded-lg px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#00829B] transition-colors ${
              errors.keperluan ? 'border-red-500' : 'border-slate-300'
            }`}
          />
          {errors.keperluan && (
            <p className="text-xs text-red-600 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              <span>{errors.keperluan}</span>
            </p>
          )}
        </div>

        {/* Tanggal Akses */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-[#00829B]" />
            <span>Tanggal Akses Masuk <span className="text-red-500">*</span></span>
          </label>
          <input
            type="date"
            value={data.tanggal}
            onChange={(e) => onChange({ ...data, tanggal: e.target.value })}
            className={`w-full bg-slate-50 border rounded-lg px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:bg-white focus:border-[#00829B] transition-colors font-mono ${
              errors.tanggal ? 'border-red-500' : 'border-slate-300'
            }`}
          />
        </div>

        {/* Jam / Waktu */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-[#00829B]" />
            <span>Waktu Akses Masuk (WIB) <span className="text-red-500">*</span></span>
          </label>
          <input
            type="time"
            value={data.waktu}
            onChange={(e) => onChange({ ...data, waktu: e.target.value })}
            className={`w-full bg-slate-50 border rounded-lg px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:bg-white focus:border-[#00829B] transition-colors font-mono ${
              errors.waktu ? 'border-red-500' : 'border-slate-300'
            }`}
          />
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex items-center justify-end pt-4 border-t border-slate-100">
        <button
          type="submit"
          className="px-6 py-2.5 rounded-lg bg-[#00829B] hover:bg-[#006F85] text-white font-bold text-sm flex items-center gap-2 shadow-sm transition-all cursor-pointer"
        >
          <span>Lanjut ke 10 Checklist K3</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </form>
  );
};
