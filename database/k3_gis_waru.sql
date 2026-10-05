-- ====================================================================
-- DATABASE K3 ZONA MERAH GIS 150 KV WARU
-- Nama Database: k3_gis_waru
-- ====================================================================

CREATE DATABASE IF NOT EXISTS k3_gis_waru CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE k3_gis_waru;

-- 1. TABEL DATA PENGGUNA (users)
DROP TABLE IF EXISTS users;
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nama VARCHAR(150) NOT NULL,
    id_pengguna VARCHAR(50) NOT NULL COMMENT 'NIP / NIM / KTP',
    instansi VARCHAR(150) NOT NULL,
    jabatan VARCHAR(100) NOT NULL,
    keperluan TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_id_pengguna (id_pengguna)
) ENGINE=InnoDB;

-- 2. TABEL CHECKLIST K3 (checklist)
DROP TABLE IF EXISTS checklist;
CREATE TABLE checklist (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    nomor_pemeriksaan VARCHAR(50) UNIQUE NOT NULL,
    helm ENUM('ya', 'tidak') NOT NULL DEFAULT 'ya',
    safety_vest ENUM('ya', 'tidak') NOT NULL DEFAULT 'ya',
    safety_shoes ENUM('ya', 'tidak') NOT NULL DEFAULT 'ya',
    gloves ENUM('ya', 'tidak') NOT NULL DEFAULT 'ya',
    safety_glasses ENUM('ya', 'tidak') NOT NULL DEFAULT 'ya',
    paham_bahaya ENUM('ya', 'tidak') NOT NULL DEFAULT 'ya',
    paham_prosedur ENUM('ya', 'tidak') NOT NULL DEFAULT 'ya',
    izin_masuk ENUM('ya', 'tidak') NOT NULL DEFAULT 'ya',
    kondisi_sehat ENUM('ya', 'tidak') NOT NULL DEFAULT 'ya',
    patuh_k3 ENUM('ya', 'tidak') NOT NULL DEFAULT 'ya',
    status ENUM('LAYAK', 'TIDAK_LAYAK') NOT NULL,
    catatan_penolakan TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_status (status),
    INDEX idx_nomor_pemeriksaan (nomor_pemeriksaan)
) ENGINE=InnoDB;

-- 3. TABEL HASIL DETEKSI APD OLEH COMPUTER VISION (detection_results)
DROP TABLE IF EXISTS detection_results;
CREATE TABLE detection_results (
    id INT AUTO_INCREMENT PRIMARY KEY,
    checklist_id INT NOT NULL,
    foto_path VARCHAR(255) NULL,
    model_ai VARCHAR(100) DEFAULT 'YOLOv8-K3-Architecture',
    helmet_detected BOOLEAN DEFAULT FALSE,
    helmet_confidence DECIMAL(5,2) DEFAULT 0.00,
    vest_detected BOOLEAN DEFAULT FALSE,
    vest_confidence DECIMAL(5,2) DEFAULT 0.00,
    shoes_detected BOOLEAN DEFAULT FALSE,
    shoes_confidence DECIMAL(5,2) DEFAULT 0.00,
    gloves_detected BOOLEAN DEFAULT FALSE,
    gloves_confidence DECIMAL(5,2) DEFAULT 0.00,
    glasses_detected BOOLEAN DEFAULT FALSE,
    glasses_confidence DECIMAL(5,2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (checklist_id) REFERENCES checklist(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- DATA INITIAL SEED
INSERT INTO users (nama, id_pengguna, instansi, jabatan, keperluan) 
VALUES ('Bambang Triyono', '198705122011011003', 'PT PLN (Persero) ULTG Waru', 'Supervisor Pemeliharaan GIS', 'Inspeksi Tekanan Gas SF6 Bay Krian 1');

INSERT INTO checklist (user_id, nomor_pemeriksaan, helm, safety_vest, safety_shoes, gloves, safety_glasses, paham_bahaya, paham_prosedur, izin_masuk, kondisi_sehat, patuh_k3, status)
VALUES (1, 'K3-WARU-20261004-0021', 'ya', 'ya', 'ya', 'ya', 'ya', 'ya', 'ya', 'ya', 'ya', 'ya', 'LAYAK');

INSERT INTO detection_results (checklist_id, helmet_detected, helmet_confidence, vest_detected, vest_confidence, shoes_detected, shoes_confidence, gloves_detected, gloves_confidence, glasses_detected, glasses_confidence)
VALUES (1, 1, 96.00, 1, 94.00, 1, 92.00, 1, 88.00, 1, 85.00);
