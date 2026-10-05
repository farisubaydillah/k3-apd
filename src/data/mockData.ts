import { ChecklistQuestion, ApdItem, InspectionRecord } from '../types/k3';

export const CHECKLIST_QUESTIONS: ChecklistQuestion[] = [
  {
    id: 1,
    text: 'Apakah Anda menggunakan helm keselamatan (Safety Helmet) standar isolasi listrik?',
    category: 'apd',
    warningMessage: 'Helm keselamatan wajib digunakan di dalam area GIS untuk melindungi dari benturan dan bahaya overhead crane / busbar.'
  },
  {
    id: 2,
    text: 'Apakah Anda menggunakan safety vest / rompi reflektor keselamatan?',
    category: 'apd',
    warningMessage: 'Rompi reflektor visibilitas tinggi wajib dikenakan agar terlihat jelas oleh operator dan pengawas K3.'
  },
  {
    id: 3,
    text: 'Apakah Anda menggunakan safety shoes berstandar dielektrik/isolasi tegangan?',
    category: 'apd',
    warningMessage: 'Sepatu keselamatan dengan sol isolasi wajib digunakan di zona bertegangan dan ruang kubikel switchgear.'
  },
  {
    id: 4,
    text: 'Apakah Anda menggunakan sarung tangan keselamatan sesuai jenis pekerjaan (Mechanical/Insulating Gloves)?',
    category: 'apd',
    warningMessage: 'Gunakan sarung tangan berstandar kelas proteksi sesuai potensi bahaya mekanik/listrik.'
  },
  {
    id: 5,
    text: 'Apakah Anda menggunakan perlengkapan keselamatan tambahan yang diperlukan (Safety Glasses / Earplug / Masker Gas SF6)?',
    category: 'apd',
    warningMessage: 'Pastikan kacamata pelindung atau alat proteksi tambahan terpasang bila ada potensi percikan/debu partikel.'
  },
  {
    id: 6,
    text: 'Apakah Anda memahami seluruh potensi bahaya di Zona Merah (Tegangan Tinggi 150 kV, Kebocoran Gas SF6, & Arus Hubung Singkat)?',
    category: 'pemahaman',
    warningMessage: 'Zona Merah GIS Waru memiliki potensi bahaya sengatan listrik tegangan tinggi dan sesak napas jika gas SF6 bocor.'
  },
  {
    id: 7,
    text: 'Apakah Anda memahami Standar Operasional Prosedur (SOP) keselamatan & rute evakuasi darurat sebelum memasuki area?',
    category: 'pemahaman',
    warningMessage: 'Anda wajib mengenali letak pintu darurat, titik kumpul (assembly point), dan tombol sirine evakuasi.'
  },
  {
    id: 8,
    text: 'Apakah Anda telah memiliki izin resmi yang masih berlaku (Working Permit / JSA / Form Izin Masuk Zona Merah)?',
    category: 'legalitas',
    warningMessage: 'Dilarang keras melintasi garis batas Zona Merah tanpa Surat Izin Kerja (Working Permit) yang disetujui Pengawas K3.'
  },
  {
    id: 9,
    text: 'Apakah kondisi tubuh Anda saat ini dalam keadaan sehat, fit, dan tidak sedang mengonsumsi obat pemicu kantuk?',
    category: 'kesehatan',
    warningMessage: 'Pekerja dengan kondisi kurang fit, pusing, atau mengantuk dilarang beraktivitas di area kritis kelistrikan.'
  },
  {
    id: 10,
    text: 'Apakah Anda bersedia mematuhi seluruh rambu keselamatan, batas aman (Safety Clearance Distance), dan arahan Pengawas K3?',
    category: 'legalitas',
    warningMessage: 'Kepatuhan mutlak diperlukan demi zero-accident di Gardu Induk GIS Waru.'
  }
];

export const DEFAULT_APD_ITEMS: ApdItem[] = [
  {
    key: 'helmet',
    name: 'Safety Helmet',
    nameIndo: 'Helm Keselamatan',
    isMandatory: true,
    detected: false,
    confidence: 0,
    bbox: { x: 38, y: 8, width: 24, height: 16 },
    color: '#eab308', // Yellow
    description: 'Helm pelindung kepala Class E (up to 20kV protection)'
  },
  {
    key: 'vest',
    name: 'Safety Vest',
    nameIndo: 'Rompi Keselamatan',
    isMandatory: true,
    detected: false,
    confidence: 0,
    bbox: { x: 32, y: 24, width: 36, height: 35 },
    color: '#f97316', // Orange
    description: 'Hi-Vis Vest fluorescent dengan pita scotlight reflektif'
  },
  {
    key: 'shoes',
    name: 'Safety Shoes',
    nameIndo: 'Sepatu Keselamatan',
    isMandatory: true,
    detected: false,
    confidence: 0,
    bbox: { x: 34, y: 80, width: 32, height: 18 },
    color: '#3b82f6', // Blue
    description: 'Sepatu bot kerja sol tebal berujung baja & anti-slip dielektrik'
  },
  {
    key: 'gloves',
    name: 'Safety Gloves',
    nameIndo: 'Sarung Tangan Kerja',
    isMandatory: false,
    detected: false,
    confidence: 0,
    bbox: { x: 24, y: 52, width: 14, height: 16 },
    color: '#a855f7', // Purple
    description: 'Sarung tangan mekanik/isolator elektrik'
  },
  {
    key: 'glasses',
    name: 'Safety Glasses',
    nameIndo: 'Kacamata Pelindung',
    isMandatory: false,
    detected: false,
    confidence: 0,
    bbox: { x: 42, y: 17, width: 16, height: 8 },
    color: '#14b8a6', // Teal
    description: 'Kacamata anti-debu & arc flash impact polycarbonate'
  }
];

// Sample default inspections for dashboard demonstration
export const INITIAL_INSPECTIONS: InspectionRecord[] = [
  {
    id: 'K3-WARU-20261004-0021',
    user: {
      nama: 'Bambang Triyono',
      id_pengguna: '198705122011011003',
      instansi: 'PT PLN (Persero) ULTG Waru',
      jabatan: 'Supervisor Pemeliharaan GIS',
      keperluan: 'Inspeksi Tekanan Gas SF6 Bay Krian 1',
      tanggal: '2026-10-04',
      waktu: '08:30'
    },
    checklistAnswers: { 1: 'ya', 2: 'ya', 3: 'ya', 4: 'ya', 5: 'ya', 6: 'ya', 7: 'ya', 8: 'ya', 9: 'ya', 10: 'ya' },
    photoUrl: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=600&q=80',
    detections: [
      { ...DEFAULT_APD_ITEMS[0], detected: true, confidence: 96, bbox: { x: 38, y: 9, width: 24, height: 16 } },
      { ...DEFAULT_APD_ITEMS[1], detected: true, confidence: 94, bbox: { x: 32, y: 25, width: 36, height: 35 } },
      { ...DEFAULT_APD_ITEMS[2], detected: true, confidence: 92, bbox: { x: 35, y: 81, width: 30, height: 17 } },
      { ...DEFAULT_APD_ITEMS[3], detected: true, confidence: 88, bbox: { x: 25, y: 53, width: 13, height: 15 } },
      { ...DEFAULT_APD_ITEMS[4], detected: true, confidence: 85, bbox: { x: 43, y: 17, width: 14, height: 7 } },
    ],
    allMandatoryChecklistPassed: true,
    allMandatoryApdDetected: true,
    status: 'LAYAK',
    reasons: [],
    createdAt: '2026-10-04T08:35:00.000Z',
    verifiedByAi: true
  },
  {
    id: 'K3-WARU-20261004-0019',
    user: {
      nama: 'Rizky Alamsyah',
      id_pengguna: '5007211045',
      instansi: 'Institut Teknologi Sepuluh Nopember (Magang)',
      jabatan: 'Mahasiswa Kerja Praktik K3',
      keperluan: 'Pengamatan Lapangan Sistem Pembumian GIS',
      tanggal: '2026-10-04',
      waktu: '09:15'
    },
    checklistAnswers: { 1: 'ya', 2: 'ya', 3: 'tidak', 4: 'ya', 5: 'ya', 6: 'ya', 7: 'ya', 8: 'ya', 9: 'ya', 10: 'ya' },
    photoUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?auto=format&fit=crop&w=600&q=80',
    detections: [
      { ...DEFAULT_APD_ITEMS[0], detected: true, confidence: 95, bbox: { x: 39, y: 9, width: 23, height: 15 } },
      { ...DEFAULT_APD_ITEMS[1], detected: true, confidence: 93, bbox: { x: 33, y: 24, width: 34, height: 34 } },
      { ...DEFAULT_APD_ITEMS[2], detected: false, confidence: 18, bbox: undefined },
      { ...DEFAULT_APD_ITEMS[3], detected: true, confidence: 84, bbox: { x: 26, y: 54, width: 12, height: 14 } },
      { ...DEFAULT_APD_ITEMS[4], detected: false, confidence: 22, bbox: undefined },
    ],
    allMandatoryChecklistPassed: false,
    allMandatoryApdDetected: false,
    status: 'TIDAK_LAYAK',
    reasons: [
      'Sepatu keselamatan (Safety Shoes) tidak terdeteksi pada sistem verifikasi kamera AI.',
      'Checklist no. 3: Pengguna menyatakan belum menggunakan sepatu keselamatan dielektrik.'
    ],
    createdAt: '2026-10-04T09:20:00.000Z',
    verifiedByAi: true
  },
  {
    id: 'K3-WARU-20261004-0015',
    user: {
      nama: 'Agus Setiawan',
      id_pengguna: 'VND-2026-092',
      instansi: 'PT Rekadaya Elektrika (Kontraktor)',
      jabatan: 'Teknisi Pengujian Relai Proteksi',
      keperluan: 'Retrofit Panel Kontrol Kompartemen GIS 150kV',
      tanggal: '2026-10-04',
      waktu: '10:00'
    },
    checklistAnswers: { 1: 'ya', 2: 'ya', 3: 'ya', 4: 'ya', 5: 'ya', 6: 'ya', 7: 'ya', 8: 'ya', 9: 'ya', 10: 'ya' },
    photoUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80',
    detections: [
      { ...DEFAULT_APD_ITEMS[0], detected: true, confidence: 94, bbox: { x: 38, y: 10, width: 24, height: 16 } },
      { ...DEFAULT_APD_ITEMS[1], detected: true, confidence: 91, bbox: { x: 31, y: 26, width: 37, height: 34 } },
      { ...DEFAULT_APD_ITEMS[2], detected: true, confidence: 90, bbox: { x: 34, y: 82, width: 31, height: 16 } },
      { ...DEFAULT_APD_ITEMS[3], detected: true, confidence: 82, bbox: { x: 25, y: 52, width: 14, height: 16 } },
      { ...DEFAULT_APD_ITEMS[4], detected: true, confidence: 87, bbox: { x: 42, y: 18, width: 15, height: 7 } },
    ],
    allMandatoryChecklistPassed: true,
    allMandatoryApdDetected: true,
    status: 'LAYAK',
    reasons: [],
    createdAt: '2026-10-04T10:05:00.000Z',
    verifiedByAi: true
  }
];
