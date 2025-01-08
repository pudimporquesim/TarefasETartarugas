<?php
include 'conectbd.php';
header('Content-Type: application/json; charset=UTF-8');
session_start();
if (isset($_POST['classeesc'])) {
    $id = intval($_SESSION["user-id"]);
    $classe = $_POST['classeesc'];
    $sql = "UPDATE usuario SET fk_Classe_nome = :classe WHERE id = :id";
    try {
        $stmt = $pdo->prepare($sql);
        $stmt->bindParam(':classe', $classe);
        $stmt->bindParam(':id', $id);
        $stmt->execute();
        echo json_encode(['success' => 'Classe inserida', 'classe' => $classe]);
        $_SESSION["classe"] = $classe;
    } catch (PDOException $e) {
        echo json_encode(['error' => 'Erro ao executar a consulta: ' . $e->getMessage()]);
    }
} else {
    echo json_encode(['error' => 'Parametros obrigatorios nao especificados']);
}
?>