<?php
session_start();
header("Content-Type: application/json");

if (isset($_SESSION["usuario"])) {
  echo json_encode(["ok"=>true]);
} else {
  echo json_encode(["ok"=>false]);
}
