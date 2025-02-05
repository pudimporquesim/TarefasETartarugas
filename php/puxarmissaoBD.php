<?php
header('Content-Type: application/json; charset=UTF-8');
include 'conectbd.php';
session_start();
$id = intval($_SESSION["user-id"]);
try {
    $sql = "SELECT * FROM missao JOIN usuario_missao ON missao.id = usuario_missao.fk_missao_id WHERE fk_Usuario_ID = :id";
    $stmt = $pdo->prepare($sql);
    $stmt->bindParam(':id', $id);
    $stmt->execute();
    $missoes = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode(['missoes' => $missoes]);
} catch (PDOException $e) {
    echo json_encode(['error' => 'Erro ao executar a consulta: ' . $e->getMessage()]);
}
?>