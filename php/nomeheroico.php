<?php
include 'conectbd.php';
header('Content-Type: application/json; charset=UTF-8');
session_start();
$id = intval($_SESSION["user-id"]);
// $nomeheroico = "";
if ($_POST['nomeheroico'] != null) {
    $nomeheroico = $_POST['nomeheroico'];
    $sql = "UPDATE usuario SET nome_heroico = :nomeheroico WHERE id = :id";
    try {
        $stmt = $pdo->prepare($sql);
        $stmt->bindParam(':nomeheroico', $nomeheroico);
        $stmt->bindParam(':id', $id);
        $stmt->execute();
        echo json_encode(['success' => 'Nome heroico inserido', 'nomeheroico' => $nomeheroico]);
    } catch (PDOException $e) {
        echo json_encode(['error' => 'Erro ao executar a consulta: ' . $e->getMessage()]);
    }
} else {
    echo json_encode(['error' => 'Parametros obrigatorios nao especificados']);
}
?>