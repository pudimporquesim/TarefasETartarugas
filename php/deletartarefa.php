<?php
include 'conectbd.php';
header('Content-Type: application/json; charset=UTF-8');
if ($_POST['idtarefa'] != null) {
    $id = $_POST['idtarefa'];
    $sql = "DELETE FROM tarefa WHERE ID = :id";
    try {
        $stmt = $pdo->prepare($sql);
        $stmt->bindParam(':id', $id);
        $stmt->execute();
        echo json_encode(['success' => 'Tarefa excluida']);
    } catch (PDOException $e) {
        echo json_encode(['error' => 'Erro ao executar a consulta: ' . $e->getMessage()]);
    }
} else {
    echo json_encode(['error' => 'Parametros obrigatorios nao especificados']);
}
?>