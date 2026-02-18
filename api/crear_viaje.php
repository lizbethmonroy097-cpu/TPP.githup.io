<?php
header("Content-Type: application/json");
require_once "db.php";

$raw = file_get_contents("php://input");
$data = json_decode($raw, true);

if (!$data) {
  echo json_encode([
    "ok" => false,
    "error" => "JSON inválido"
  ]);
  exit;
}

$cliente_id = $data["cliente_id"] ?? null;
$origen = $data["origen"] ?? null;
$destino = $data["destino"] ?? null;
$tipo_carga = $data["tipo_carga"] ?? null;
$descripcion = $data["descripcion"] ?? null;
$fecha_salida = $data["fecha_salida"] ?? null;

if (!$origen || !$destino || !$tipo_carga || !$fecha_salida) {
  echo json_encode([
    "ok" => false,
    "error" => "Datos incompletos"
  ]);
  exit;
}

$folio = "TPP-" . time();

$cliente_id = $data["cliente_id"];

$stmt = $conn->prepare("
  INSERT INTO viajes 
  (cliente_id, folio, origen, destino, tipo_carga, descripcion, fecha_salida, estatus_actual)
  VALUES (?, ?, ?, ?, ?, ?, ?, 1)
");

$stmt->bind_param(
  "issssss",
  $cliente_id,
  $folio,
  $origen,
  $destino,
  $tipo_carga,
  $descripcion,
  $fecha_salida
);

if ($stmt->execute()) {
  echo json_encode([
    "ok" => true,
    "folio" => $folio
  ]);
} else {
  echo json_encode([
    "ok" => false,
    "error" => $stmt->error
  ]);
}
