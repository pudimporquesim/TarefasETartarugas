<?php
include 'conectbd.php';
header('Content-Type: application/json; charset=UTF-8');
session_start();
if (isset($_SESSION["user-id"])) {
    // echo json_encode(['success' => 'Cê tem conta ein']);
    $sql = "SELECT nome_heroico FROM usuario WHERE id = :id";
    try {
        $stmt = $pdo->prepare($sql);
        $stmt->bindParam(':id', $_SESSION["user-id"]);
        $stmt->execute();
        $usuario = $stmt->fetch(PDO::FETCH_ASSOC);
        if ($usuario['nome_heroico'] == null) {
            echo json_encode(['snome' => 'Nome heroico não encontrado']);
        } else {
            // Caso o usuário tenha um nome heroico, retorne o nome
            echo json_encode(['cnome' => 'Nome heroico encontrado', 'nome_heroico' => $usuario['nome_heroico']]);
        }
        exit;
    } catch (PDOException $e) {
        echo json_encode(['error' => 'Erro ao executar a consulta: ' . $e->getMessage()]);
    }
} else {
    echo json_encode(['error' => 'Você não está logado, suma']);
}
?>