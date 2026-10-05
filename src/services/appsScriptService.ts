import { InspectionRecord } from '../types/k3';

const APPS_SCRIPT_STORAGE_KEY = 'gis_waru_apps_script_url_v1';

export const APPS_SCRIPT_TEMPLATE_CODE = `function doPost(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getActiveSheet();
    
    // Buat baris header otomatis jika sheet masih kosong
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "ID Pemeriksaan",
        "Waktu Akses",
        "Nama Personel",
        "NIP / NIM",
        "Instansi",
        "Jabatan",
        "Keperluan Zona Merah",
        "Status Kelayakan",
        "Helm Safety",
        "Rompi Safety",
        "Sepatu Safety",
        "Catatan Pelanggaran"
      ]);
      // Format header khas PLN
      sheet.getRange(1, 1, 1, 12)
        .setBackground("#005B6E")
        .setFontColor("#FFFFFF")
        .setFontWeight("bold");
    }

    var payload = JSON.parse(e.postData.contents);

    // Jika mengirim batch banyak data sekaligus
    if (payload.action === "batch_sync" && Array.isArray(payload.records)) {
      payload.records.forEach(function(item) {
        tambahBaris(sheet, item);
      });
      return ContentService.createTextOutput(JSON.stringify({ 
        status: "success", 
        message: "Berhasil menyimpan " + payload.records.length + " rekaman K3" 
      })).setMimeType(ContentService.MimeType.JSON);
    } 
    
    // Jika mengirim 1 rekaman pemeriksaan
    var record = payload.record || payload;
    tambahBaris(sheet, record);

    return ContentService.createTextOutput(JSON.stringify({ 
      status: "success", 
      message: "Data K3 berhasil ditambahkan ke Google Sheets" 
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ 
      status: "error", 
      message: error.toString() 
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function tambahBaris(sheet, r) {
  var helm = "TIDAK";
  var vest = "TIDAK";
  var shoes = "TIDAK";

  if (r.detections && Array.isArray(r.detections)) {
    r.detections.forEach(function(d) {
      if (d.key === "helmet" && d.detected) helm = "YA";
      if (d.key === "vest" && d.detected) vest = "YA";
      if (d.key === "shoes" && d.detected) shoes = "YA";
    });
  }

  var reasons = (r.reasons && Array.isArray(r.reasons)) ? r.reasons.join("; ") : "-";

  sheet.appendRow([
    r.id || "",
    (r.user ? r.user.tanggal + " " + r.user.waktu + " WIB" : r.createdAt) || "",
    (r.user ? r.user.nama : "") || "",
    (r.user ? r.user.id_pengguna : "") || "",
    (r.user ? r.user.instansi : "") || "",
    (r.user ? r.user.jabatan : "") || "",
    (r.user ? r.user.keperluan : "") || "",
    r.status || "",
    helm,
    vest,
    shoes,
    reasons
  ]);
}
`;

export const getAppsScriptUrl = (): string => {
  try {
    return localStorage.getItem(APPS_SCRIPT_STORAGE_KEY) || '';
  } catch {
    return '';
  }
};

export const setAppsScriptUrl = (url: string): void => {
  try {
    localStorage.setItem(APPS_SCRIPT_STORAGE_KEY, url.trim());
  } catch (e) {
    console.error('Failed to save Apps Script URL', e);
  }
};

/**
 * Mengirim satu atau banyak rekaman ke Google Sheets melalui Apps Script Web App
 */
export const sendToGoogleAppsScript = async (
  records: InspectionRecord | InspectionRecord[],
  overrideUrl?: string
): Promise<{ success: boolean; message: string }> => {
  const targetUrl = (overrideUrl || getAppsScriptUrl()).trim();

  if (!targetUrl) {
    throw new Error('URL Google Apps Script belum diisi. Silakan masukkan Web App URL di pengaturan.');
  }

  const isBatch = Array.isArray(records);
  const payload = isBatch
    ? { action: 'batch_sync', records }
    : { action: 'single_record', record: records };

  try {
    // Menggunakan text/plain dengan mode no-cors untuk kompatibilitas Web App Google
    await fetch(targetUrl, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify(payload),
    });

    return {
      success: true,
      message: isBatch
        ? `Berhasil mengirim ${records.length} data pemeriksaan ke Google Sheets!`
        : 'Data pemeriksaan berhasil dikirim ke Google Sheets!',
    };
  } catch (error: any) {
    console.error('Error sending to Apps Script:', error);
    throw new Error(error.message || 'Gagal mengirim data ke Google Apps Script.');
  }
};
