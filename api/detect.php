<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// KONEKSI DATABASE MYSQL
$host = "localhost";
$user = "root";
$pass = "";
$db   = "k3_gis_waru";

$conn = new mysqli($host, $user, $pass, $db);
if ($conn->connect_error) {
    echo json_encode(["success" => false, "error" => "Koneksi database gagal: " . $conn->connect_error]);
    exit();
}

$rawInput = file_get_contents('php://input');
$data = json_decode($rawInput, true);

if (!$data) {
    echo json_encode(["success" => false, "error" => "Data input JSON tidak valid"]);
    exit();
}

// 1. Simpan Data Pengguna
$stmtUser = $conn->prepare("INSERT INTO users (nama, id_pengguna, instansi, jabatan, keperluan) VALUES (?, ?, ?, ?, ?)");
$stmtUser->bind_param("sssss", 
    $data['user']['nama'], 
    $data['user']['id_pengguna'], 
    $data['user']['instansi'], 
    $data['user']['jabatan'], 
    $data['user']['keperluan']
);
$stmtUser->execute();
$userId = $conn->insert_id;

// 2. Simpan Data Checklist
$nomorPemeriksaan = $data['id'];
$status = $data['status'];
$alasan = implode('; ', $data['reasons']);

$c = $data['checklistAnswers'];
$stmtCheck = $conn->prepare("INSERT INTO checklist (
    user_id, nomor_pemeriksaan, helm, safety_vest, safety_shoes, gloves, safety_glasses,
    paham_bahaya, paham_prosedur, izin_masuk, kondisi_sehat, patuh_k3, status, catatan_penolakan
) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");

$stmtCheck->bind_param("isssssssssssss",
    $userId, $nomorPemeriksaan,
    $c[1], $c[2], $c[3], $c[4], $c[5],
    $c[6], $c[7], $c[8], $c[9], $c[10],
    $status, $alasan
);
$stmtCheck->execute();
$checklistId = $conn->insert_id;

// 3. Simpan Hasil Deteksi APD
$d = [];
foreach ($data['detections'] as $det) {
    $d[$det['key']] = [
        'detected' => $det['detected'] ? 1 : 0,
        'confidence' => $det['confidence']
    ];
}

$stmtDet = $conn->prepare("INSERT INTO detection_results (
    checklist_id,
    helmet_detected, helmet_confidence,
    vest_detected, vest_confidence,
    shoes_detected, shoes_confidence,
    gloves_detected, gloves_confidence,
    glasses_detected, glasses_confidence
) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");

$stmtDet->bind_param("iidiidiidii",
    $checklistId,
    $d['helmet']['detected'], $d['helmet']['confidence'],
    $d['vest']['detected'], $d['vest']['confidence'],
    $d['shoes']['detected'], $d['shoes']['confidence'],
    $d['gloves']['detected'], $d['gloves']['confidence'],
    $d['glasses']['detected'], $d['glasses']['confidence']
);
$stmtDet->execute();

echo json_encode([
    "success" => true,
    "message" => "Pemeriksaan K3 GIS Waru berhasil dicatat ke database MySQL",
    "nomor_pemeriksaan" => $nomorPemeriksaan
]);
$conn->close();
?>
