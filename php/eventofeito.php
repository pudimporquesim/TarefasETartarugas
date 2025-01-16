<?php
header('Content-Type: application/json; charset=UTF-8');
include 'conectbd.php';
session_start();
$feito = $_POST['feito'];
$idtarefa = $_POST['tarefaID'];
$idusuario = intval($_SESSION["user-id"]);
$sql= "UPDATE tarefa SET feita = :feito WHERE id = :id";
try {
    $stmt = $pdo->prepare($sql);
    $stmt->bindParam(':feito', $feito);
    $stmt->bindParam(':id', $idtarefa);
    $stmt->execute();
    echo json_encode(['success' => 'Tarefa atualizada']);
} catch (PDOException $e) {
    echo json_encode(['error' => 'Erro ao executar a consulta: ' . $e->getMessage()]);
}
?>