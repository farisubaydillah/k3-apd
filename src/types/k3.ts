export interface UserFormData {
  nama: string;
  id_pengguna: string; // NIP / NIM / No. KTP
  instansi: string;    // PT PLN (Persero), Vendor PT ABC, Mahasiswa Magang, dll
  jabatan: string;     // Teknisi Pemeliharaan, Pengawas K3, dsb
  keperluan: string;   // Pemeliharaan Bay Trafo, Pengukuran SF6, dll
  tanggal: string;     // YYYY-MM-DD
  waktu: string;       // HH:mm
}

export interface ChecklistQuestion {
  id: number;
  text: string;
  category: 'apd' | 'pemahaman' | 'legalitas' | 'kesehatan';
  warningMessage?: string;
}

export type ApdKey = 'helmet' | 'vest' | 'shoes' | 'gloves' | 'glasses';

export interface BoundingBox {
  x: number;      // percentage 0-100
  y: number;      // percentage 0-100
  width: number;  // percentage 0-100
  height: number; // percentage 0-100
}

export interface ApdItem {
  key: ApdKey;
  name: string;
  nameIndo: string;
  isMandatory: boolean;
  detected: boolean;
  confidence: number; // 0 - 100
  bbox?: BoundingBox;
  color: string;
  description: string;
}

export interface InspectionRecord {
  id: string; // e.g. K3-WARU-20261005-0012
  user: UserFormData;
  checklistAnswers: Record<number, 'ya' | 'tidak'>;
  photoUrl: string;
  detections: ApdItem[];
  allMandatoryChecklistPassed: boolean;
  allMandatoryApdDetected: boolean;
  status: 'LAYAK' | 'TIDAK_LAYAK';
  reasons: string[];
  createdAt: string;
  verifiedByAi: boolean;
}

export interface DetectionResponse {
  success: boolean;
  detections: {
    class: ApdKey;
    confidence: number;
    bbox?: BoundingBox;
  }[];
  modelUsed: string;
  inferenceTimeMs: number;
}
