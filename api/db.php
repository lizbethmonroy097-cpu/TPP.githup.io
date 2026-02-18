<?php
$host = "35.226.83.131";
$user = "tpp-admin";
$pass = "kFktHr4AGnilmjGg";
$db   = "tpp";

$conn = new mysqli($host, $user, $pass, $db, 3306);
$conn->set_charset("utf8mb4");

if ($conn->connect_error) {
  die("Error conexión BD");
}
?>
