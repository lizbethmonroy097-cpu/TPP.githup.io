<?php
include "db.php";

$usuario = $_GET['id'];

$sql = "
SELECT v.folio, v.origen, v.destino, e.nombre estatus
FROM viajes v
JOIN clientes c ON v.cliente_id=c.id
JOIN estatus_viaje e ON v.estatus_actual=e.id
WHERE c.usuario_id=?
";

$stmt = $conn->prepare($sql);
$stmt->bind_param("i",$usuario);
$stmt->execute();

$res = $stmt->get_result();

$rows = [];
while($r=$res->fetch_assoc()){
  $rows[]=$r;
}

echo json_encode($rows);
