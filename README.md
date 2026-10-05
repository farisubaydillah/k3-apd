# SISTEM CHECKLIST KESELAMATAN DAN KESEHATAN KERJA (K3) SEBELUM MEMASUKI ZONA MERAH GIS WARU
*Mini Project Prototype: Digital Safety Inspection & Computer Vision APD Detection*

---

## 1. DESKRIPSI SISTEM
Sistem ini dirancang khusus untuk memodernisasi dan mendigitalkan prosedur izin masuk pada **Zona Merah Gardu Induk Berisolasi Gas (GIS) 150 kV Waru**. 
Zona Merah merupakan area bertegangan tinggi kritis yang mensyaratkan standar K3 mutlak demi mencegah risiko fatal seperti *electric flashover*, sengatan tegangan tinggi, maupun paparan kebocoran gas SF6.

### Alur Utama Sistem:
```text
Scan QR Standee Pintu Masuk
          ↓
Buka Web Form Checklist K3
          ↓
1. Isi Identitas Personel (NIP / NIM / Instansi / Keperluan)
          ↓
2. Jawab 10 Pertanyaan Checklist K3 (SOP & Kesiapan Kerja)
          ↓
3. Ambil / Upload Foto APD (Kamera HP / Laptop)
          ↓
4. Deteksi APD dengan Computer Vision (Bounding Box & Confidence)
          ↓
5. Validasi Aturan K3 (Checklist 'YA' + APD Wajib Terdeteksi)
          ↓
Penerbitan Status Kelayakan Akses + QR Code Tiket Izin Masuk
          ↓
Pencatatan Riwayat Real-Time ke Dashboard Admin Pengawas K3
```

---

## 2. ATURAN KELAYAKAN MASUK (SAFETY MATRIX)
Sistem menerapkan evaluasi bertingkat:
- **APD Wajib (Harus 100% Terdeteksi):**
  1. *Safety Helmet* (Helm Keselamatan Dielektrik Class E)
  2. *Safety Vest* (Rompi Reflektor Visibilitas Tinggi)
  3. *Safety Shoes* (Sepatu Keselamatan Isolasi Listrik)
- **APD Tambahan (Pelengkap Pekerjaan Spesifik):**
  4. *Safety Gloves* (Sarung Tangan Mekanik/Isolator)
  5. *Safety Glasses* (Kacamata Pelindung / Anti-Arc Flash)
- **10 Pertanyaan Checklist K3:**
  Seluruhnya harus dijawab **"YA"**. Jika terdapat satu saja jawaban **"TIDAK"**, akses ditolak demi perlindungan jiwa.

---

## 3. STRUKTUR DIREKTORI PROYEK
```text
k3-gis-waru/
├── index.html                      # Entry HTML & Meta Tags
├── package.json                    # Konfigurasi dependensi
├── vite.config.ts                  # Bundler Vite
├── README.md                       # Dokumentasi lengkap
├── src/
│   ├── main.tsx                    # Entry point React
│   ├── App.tsx                     # App shell & Tab navigasi
│   ├── index.css                   # Tailwind v4 & Print styling
│   ├── types/
│   │   └── k3.ts                   # Tipe data K3, APD, & Inspeksi
│   ├── data/
│   │   └── mockData.ts             # 10 Soal K3 GIS & data riwayat demo
│   ├── services/
│   │   ├── aiDetection.ts          # Engine Computer Vision (Mock & YOLO API)
│   │   └── storageService.ts       # Database client, QR Code, CSV export
│   └── components/
│       ├── Navbar.tsx              # Navigasi & Safety banner
│       ├── HomeView.tsx            # Beranda & Alur interaktif
│       ├── GateQrView.tsx          # Standee QR Code gerbang fisik
│       ├── AdminDashboard.tsx      # Monitoring KPI & tabel riwayat
│       ├── InspectionDetailModal.tsx # Modal detail pemeriksaan + bounding box
│       ├── ApdBoundingBoxOverlay.tsx # Overlay visual deteksi APD
│       ├── DocumentationView.tsx   # Pusat kode & panduan mahasiswa
│       └── ChecklistWizard/        # 5 Langkah Wizard Form K3
│           ├── StepIndicator.tsx
│           ├── StepUserData.tsx
│           ├── StepChecklistQuestions.tsx
│           ├── StepPhotoCapture.tsx
│           ├── StepAiDetection.tsx
│           └── StepAccessResult.tsx
```

---

## 4. CARA MENJALANKAN DI KOMPUTER LOKAL

### A. Menjalankan Frontend Prototype:
1. Pastikan telah terinstall **Node.js** (versi 18 ke atas).
2. Buka terminal di folder project:
   ```bash
   npm install
   npm run dev
   ```
3. Buka browser di: `http://localhost:3000`

---

## 5. FITUR UNGGULAN UNTUK DEMO SIDANG MINI PROJECT

1. **Simulator Skenario Sidang (1-Klik Switch):**
   - *Skenario 1 (Lulus)*: APD Lengkap -> Sistem otomatis menyatakan **🟢 LAYAK MEMASUKI ZONA MERAH** dan menerbitkan QR Code tiket akses.
   - *Skenario 2 (Gagal)*: Lupa Helm -> Sistem otomatis menolak dengan status **🔴 TIDAK LAYAK** dan memaparkan alasan ketidaksesuaian.
   - *Skenario 3 (Gagal)*: Lupa Sepatu Safety -> Sistem menolak akses.
   - *Skenario 4 (Gagal)*: Lupa Rompi Keselamatan -> Sistem menolak akses.
2. **Kamera & Upload:**
   - Mendukung akses webcam live stream langsung dari browser dengan silhouette guide untuk posisi tubuh pekerja.
   - Mendukung unggah foto JPG/PNG hingga 8MB.
   - Disediakan 3 foto sampel pekerja siap pakai untuk demo cepat tanpa kamera.
3. **Bounding Box Interaktif:**
   - Visualisasi kotak deteksi warna-warni pada setiap APD beserta label dan nilai kepercayaan (*confidence percentage*).
4. **QR Code Generator Tiket & Standee Gerbang:**
   - Generate tiket digital QR Code.
   - Generate poster standee pintu gerbang fisik yang siap dicetak/diunduh PNG.
5. **Dashboard Admin Real-time:**
   - Metrik KPI (Total, Layak, Tidak Layak, Hari Ini, Compliance Rate %).
   - Fitur pencarian, filter tanggal & status, detail modal, dan ekspor ke format CSV/Excel.
6. **Pusat Kode Mahasiswa (Tab Dokumentasi):**
   - Skrip Database MySQL (`k3_gis_waru.sql`).
   - Kode Python YOLOv8 Server Flask (`ai/app.py`).
   - Kode PHP Native API (`api/detect.php`).
   - Tombol copy 1-klik dan unduh file langsung dari web.
