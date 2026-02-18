<?php
include "db.php";

$sql = "
SELECT v.id, v.folio, v.origen, v.destino, e.nombre estatus
FROM viajes v
JOIN estatus_viaje e ON v.estatus_actual=e.id
";

$res = $conn->query($sql);

$rows = [];
while($r=$res->fetch_assoc()){
  $rows[]=$r;
}

echo json_encode($rows);
