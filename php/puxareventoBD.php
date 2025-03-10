<?php
header('Content-Type: application/json; charset=UTF-8');
include 'conectbd.php';
session_start();
$id = intval($_SESSION["user-id"]);
try {
    $sql = "SELECT * FROM tarefa WHERE fk_usuario_id = :id";
    $stmt = $pdo->prepare($sql);
    $stmt->bindParam(':id', $id);
    $stmt->execute();
    $tarefas = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode(['tarefas' => $tarefas]);
} catch (PDOException $e) {
    echo json_encode(['error' => 'Erro ao executar a consulta: ' . $e->getMessage()]);
}
?>