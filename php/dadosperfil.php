<?php
header('Content-Type: application/json; charset=UTF-8');
include 'conectbd.php';
session_start();
$id = intval($_SESSION["user-id"]);
try {
    $sql = "SELECT nome_heroico, nivel, vida, experiencia, moedas FROM usuario WHERE id = :id";
    $stmt = $pdo->prepare($sql);
    $stmt->bindParam(':id', $id);
    $stmt->execute();
    $dados = $stmt->fetch(PDO::FETCH_ASSOC);
    echo json_encode(['dados' => $dados]);
} catch (PDOException $e) {
    echo json_encode(['error' => 'Erro ao executar a consulta: ' . $e->getMessage()]);
}
?>