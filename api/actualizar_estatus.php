<?php
header("Content-Type: application/json");
require_once "db.php";

$data = json_decode(file_get_contents("php://input"), true);

$id = $data["id"] ?? null;
$estatus = $data["estatus"] ?? null;

if (!$id || !$estatus) {
  echo json_encode(["ok"=>false]);
  exit;
}

$stmt = $conn->prepare("UPDATE viajes SET estatus_actual=? WHERE id=?");
$stmt->bind_param("ii", $estatus, $id);

if ($stmt->execute()) {
  echo json_encode(["ok"=>true]);
} else {
  echo json_encode(["ok"=>false,"error"=>$stmt->error]);
}
