import { InspectionRecord } from '../types/k3';

export interface SheetExportResult {
  spreadsheetId: string;
  spreadsheetUrl: string;
  rowCount: number;
}

export interface DriveFileResult {
  fileId: string;
  fileName: string;
  webViewLink: string;
}

/**
 * Membuat spreadsheet baru di Google Sheets dan mengisi seluruh data riwayat K3 GIS Waru
 */
export async function exportToGoogleSheets(
  accessToken: string,
  records: InspectionRecord[],
  customTitle?: string
): Promise<SheetExportResult> {
  const title = customTitle || `LOG K3 ZONA MERAH GIS WARU (${new Date().toLocaleDateString('id-ID')})`;

  // 1. Buat Spreadsheet Baru via Google Sheets API v4
  const createRes = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      properties: {
        title,
      },
      sheets: [
        {
          properties: {
            title: 'Data Pemeriksaan K3',
            gridProperties: {
              frozenRowCount: 1,
            },
          },
        },
      ],
    }),
  });

  if (!createRes.ok) {
    const err = await createRes.json();
    throw new Error(err.error?.message || 'Gagal membuat Google Spreadsheet.');
  }

  const spreadsheetData = await createRes.json();
  const spreadsheetId = spreadsheetData.spreadsheetId;
  const spreadsheetUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}`;

  // 2. Siapkan data header dan baris
  const headers = [
    'No. Pemeriksaan',
    'Nama Personel',
    'NIP / NIM / KTP',
    'Instansi / Perusahaan',
    'Jabatan',
    'Keperluan Pekerjaan di GIS Waru',
    'Tanggal Akses',
    'Waktu',
    'Status Kelayakan Akses',
    'Helm Keselamatan',
    'Rompi Reflektor',
    'Sepatu Safety',
    'Sarung Tangan',
    'Kacamata Pelindung',
    'Catatan / Alasan Penolakan',
    'Timestamp Verifikasi Sistem',
  ];

  const rows = records.map((r) => {
    const helm = r.detections.find((d) => d.key === 'helmet')?.detected ? 'TERDETEKSI (✓)' : 'TIDAK (✗)';
    const vest = r.detections.find((d) => d.key === 'vest')?.detected ? 'TERDETEKSI (✓)' : 'TIDAK (✗)';
    const shoes = r.detections.find((d) => d.key === 'shoes')?.detected ? 'TERDETEKSI (✓)' : 'TIDAK (✗)';
    const gloves = r.detections.find((d) => d.key === 'gloves')?.detected ? 'TERDETEKSI (✓)' : 'TIDAK (✗)';
    const glasses = r.detections.find((d) => d.key === 'glasses')?.detected ? 'TERDETEKSI (✓)' : 'TIDAK (✗)';

    return [
      r.id,
      r.user.nama,
      r.user.id_pengguna,
      r.user.instansi,
      r.user.jabatan,
      r.user.keperluan,
      r.user.tanggal,
      `${r.user.waktu} WIB`,
      r.status === 'LAYAK' ? 'LAYAK MEMASUKI ZONA MERAH' : 'TIDAK LAYAK',
      helm,
      vest,
      shoes,
      gloves,
      glasses,
      r.reasons.join('; ') || 'Semua persyaratan terpenuhi',
      new Date(r.createdAt).toLocaleString('id-ID'),
    ];
  });

  const values = [headers, ...rows];

  // 3. Masukkan data ke dalam sheet via Value Update API
  const updateRes = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/A1:P${values.length}?valueInputOption=USER_ENTERED`,
    {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        values,
      }),
    }
  );

  if (!updateRes.ok) {
    const err = await updateRes.json();
    throw new Error(err.error?.message || 'Gagal mengisi data ke Google Spreadsheet.');
  }

  return {
    spreadsheetId,
    spreadsheetUrl,
    rowCount: records.length,
  };
}

/**
 * Menyimpan Surat Izin / Bukti Pemeriksaan K3 individual ke Google Drive dalam bentuk berkas teks resmi
 */
export async function uploadPermitToGoogleDrive(
  accessToken: string,
  record: InspectionRecord
): Promise<DriveFileResult> {
  const fileName = `IZIN_K3_${record.id}_${record.user.nama.replace(/\s+/g, '_')}.txt`;

  const helm = record.detections.find((d) => d.key === 'helmet');
  const vest = record.detections.find((d) => d.key === 'vest');
  const shoes = record.detections.find((d) => d.key === 'shoes');
  const gloves = record.detections.find((d) => d.key === 'gloves');
  const glasses = record.detections.find((d) => d.key === 'glasses');

  const fileContent = `========================================================================
             PT PLN (PERSERO) UNIT LAYANAN TRANSMISI DAN GARDU (ULTG) WARU
             SURAT HASIL PEMERIKSAAN K3 DIGITAL - ZONA MERAH GIS 150 KV
========================================================================

NOMOR PEMERIKSAAN : ${record.id}
TANGGAL & WAKTU    : ${record.user.tanggal} ${record.user.waktu} WIB
STATUS KELAYAKAN   : [ ${record.status === 'LAYAK' ? 'LAYAK MEMASUKI ZONA MERAH' : 'TIDAK LAYAK MEMASUKI ZONA MERAH'} ]

------------------------------------------------------------------------
I. DATA IDENTITAS PERSONEL
------------------------------------------------------------------------
Nama Lengkap      : ${record.user.nama}
NIP / NIM / KTP   : ${record.user.id_pengguna}
Instansi / Unit   : ${record.user.instansi}
Jabatan / Peran   : ${record.user.jabatan}
Keperluan Kerja   : ${record.user.keperluan}

------------------------------------------------------------------------
II. HASIL VERIFIKASI APD COMPUTER VISION (AI)
------------------------------------------------------------------------
1. Safety Helmet  : ${helm?.detected ? 'TERDETEKSI (LENGKAP)' : 'TIDAK TERDETEKSI'} (Confidence: ${helm?.confidence}%) [WAJIB]
2. Safety Vest    : ${vest?.detected ? 'TERDETEKSI (LENGKAP)' : 'TIDAK TERDETEKSI'} (Confidence: ${vest?.confidence}%) [WAJIB]
3. Safety Shoes   : ${shoes?.detected ? 'TERDETEKSI (LENGKAP)' : 'TIDAK TERDETEKSI'} (Confidence: ${shoes?.confidence}%) [WAJIB]
4. Safety Gloves  : ${gloves?.detected ? 'TERDETEKSI' : 'TIDAK ADA'} (Confidence: ${gloves?.confidence}%) [TAMBAHAN]
5. Safety Glasses : ${glasses?.detected ? 'TERDETEKSI' : 'TIDAK ADA'} (Confidence: ${glasses?.confidence}%) [TAMBAHAN]

------------------------------------------------------------------------
III. CATATAN SISTEM & KESELAMATAN
------------------------------------------------------------------------
${record.reasons.length > 0 ? record.reasons.map((r, i) => `${i + 1}. ${r}`).join('\n') : 'Semua syarat K3 dan APD terpenuhi. Patuhi jarak aman 1.5 meter dari busbar 150kV.'}

Waktu Verifikasi  : ${new Date(record.createdAt).toLocaleString('id-ID')}
Sistem Pengawas   : K3 Vision GIS Waru v1.0
========================================================================`;

  // Gunakan Multipart Upload Google Drive API v3
  const boundary = '-------314159265358979323846';
  const delimiter = `\r\n--${boundary}\r\n`;
  const closeDelimiter = `\r\n--${boundary}--`;

  const metadata = {
    name: fileName,
    mimeType: 'text/plain',
    description: `Bukti pemeriksaan K3 Zona Merah GIS Waru untuk ${record.user.nama} (${record.id})`,
  };

  const multipartRequestBody =
    delimiter +
    'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
    JSON.stringify(metadata) +
    delimiter +
    'Content-Type: text/plain; charset=UTF-8\r\n\r\n' +
    fileContent +
    closeDelimiter;

  const uploadRes = await fetch(
    'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,webViewLink',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': `multipart/related; boundary=${boundary}`,
      },
      body: multipartRequestBody,
    }
  );

  if (!uploadRes.ok) {
    const err = await uploadRes.json();
    throw new Error(err.error?.message || 'Gagal mengunggah berkas ke Google Drive.');
  }

  const uploadedData = await uploadRes.json();
  return {
    fileId: uploadedData.id,
    fileName: uploadedData.name,
    webViewLink: uploadedData.webViewLink || `https://drive.google.com/file/d/${uploadedData.id}/view`,
  };
}
