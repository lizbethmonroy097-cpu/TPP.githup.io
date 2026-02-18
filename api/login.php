<?php
include "db.php";

$data = json_decode(file_get_contents("php://input"), true);

$correo = $data['correo'];
$pass   = $data['password'];

$stmt = $conn->prepare("SELECT id,nombre,rol,password FROM usuarios WHERE correo=? AND activo=1");
$stmt->bind_param("s",$correo);
$stmt->execute();

$res = $stmt->get_result();
$user = $res->fetch_assoc();

if($user && password_verify($pass, $user['password'])){

  echo json_encode([
    "ok"=>true,
    "id"=>$user['id'],
    "nombre"=>$user['nombre'],
    "rol"=>$user['rol']
  ]);

}else{
  echo json_encode(["ok"=>false]);
}
