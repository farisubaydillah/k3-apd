import { InspectionRecord, UserFormData, ApdItem } from '../types/k3';
import { INITIAL_INSPECTIONS } from '../data/mockData';
import QRCode from 'qrcode';

const STORAGE_KEY = 'gis_waru_k3_inspections_v1';

export const getInspections = (): InspectionRecord[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_INSPECTIONS));
      return INITIAL_INSPECTIONS;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to read inspections from localStorage', e);
    return INITIAL_INSPECTIONS;
  }
};

export const saveInspection = (record: InspectionRecord): void => {
  try {
    const current = getInspections();
    const updated = [record, ...current.filter(item => item.id !== record.id)];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save inspection', e);
  }
};

export const deleteInspection = (id: string): InspectionRecord[] => {
  try {
    const current = getInspections();
    const updated = current.filter(item => item.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error('Failed to delete inspection', e);
    return getInspections();
  }
};

export const resetToInitialInspections = (): InspectionRecord[] => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_INSPECTIONS));
  return INITIAL_INSPECTIONS;
};

export const generateInspectionId = (): string => {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `K3-WARU-${yyyy}${mm}${dd}-${rand}`;
};

export const generateQRCodeDataUrl = async (text: string): Promise<string> => {
  try {
    return await QRCode.toDataURL(text, {
      width: 280,
      margin: 2,
      color: {
        dark: '#0f172a',
        light: '#ffffff',
      },
    });
  } catch (err) {
    console.error('Error generating QR code', err);
    return '';
  }
};

export const exportInspectionsToCsv = (records: InspectionRecord[]): void => {
  const headers = [
    'ID Pemeriksaan',
    'Nama Pengguna',
    'ID / NIM / NIP',
    'Instansi',
    'Jabatan',
    'Keperluan',
    'Tanggal',
    'Waktu',
    'Status Akses',
    'Helm Terdeteksi',
    'Rompi Terdeteksi',
    'Sepatu Terdeteksi',
    'Sarung Tangan Terdeteksi',
    'Kacamata Terdeteksi',
    'Alasan Penolakan'
  ];

  const rows = records.map(r => {
    const helm = r.detections.find(d => d.key === 'helmet')?.detected ? 'YA' : 'TIDAK';
    const vest = r.detections.find(d => d.key === 'vest')?.detected ? 'YA' : 'TIDAK';
    const shoes = r.detections.find(d => d.key === 'shoes')?.detected ? 'YA' : 'TIDAK';
    const gloves = r.detections.find(d => d.key === 'gloves')?.detected ? 'YA' : 'TIDAK';
    const glasses = r.detections.find(d => d.key === 'glasses')?.detected ? 'YA' : 'TIDAK';
    const reasons = r.reasons.join('; ').replace(/"/g, '""');

    return [
      `"${r.id}"`,
      `"${r.user.nama}"`,
      `"${r.user.id_pengguna}"`,
      `"${r.user.instansi}"`,
      `"${r.user.jabatan}"`,
      `"${r.user.keperluan}"`,
      `"${r.user.tanggal}"`,
      `"${r.user.waktu}"`,
      `"${r.status}"`,
      `"${helm}"`,
      `"${vest}"`,
      `"${shoes}"`,
      `"${gloves}"`,
      `"${glasses}"`,
      `"${reasons}"`
    ].join(',');
  });

  const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `riwayat_k3_gis_waru_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
