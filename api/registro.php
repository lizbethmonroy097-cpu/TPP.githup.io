<?php
header("Content-Type: application/json");
require_once "db.php";

$data = json_decode(file_get_contents("php://input"), true);

$nombre = $data["nombre"] ?? null;
$correo = $data["correo"] ?? null;
$pass   = $data["pass"] ?? null;

if (!$nombre || !$correo || !$pass) {
  echo json_encode(["ok"=>false,"error"=>"Datos incompletos"]);
  exit;
}

$hash = password_hash($pass, PASSWORD_DEFAULT);

/* 1️⃣ Crear usuario */
$stmt = $conn->prepare("INSERT INTO usuarios (nombre, correo, password, rol) VALUES (?, ?, ?, 'cliente')");
$stmt->bind_param("sss", $nombre, $correo, $hash);

if (!$stmt->execute()) {
  echo json_encode(["ok"=>false,"error"=>"Correo ya registrado"]);
  exit;
}

$usuario_id = $conn->insert_id;

/* 2️⃣ Crear cliente */
$stmt2 = $conn->prepare("INSERT INTO clientes (usuario_id, empresa) VALUES (?, ?)");
$empresa = $nombre;
$stmt2->bind_param("is", $usuario_id, $empresa);
$stmt2->execute();

echo json_encode([
  "ok" => true,
  "cliente_id" => $stmt2->insert_id
]);
