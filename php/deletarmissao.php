<?php
include 'conectbd.php';
header('Content-Type: application/json; charset=UTF-8');
if ($_POST['missao'] != null) {
    $missao = $_POST['missao'];
    $sql = "DELETE FROM tarefa WHERE fk_missao_id = :id";
    try {
        $stmt = $pdo->prepare($sql);
        $stmt->bindParam(':id', $missao["ID"]);
        $stmt->execute();
        $sql2 = "DELETE FROM usuario_missao where fk_missao_id = :id";
        try {
            $stmt = $pdo->prepare($sql2);
            $stmt->bindParam(':id', $missao["ID"]);
            $stmt->execute();
            $sql3 = "DELETE FROM missao where ID = :id";
            try {
                $stmt = $pdo->prepare($sql3);
                $stmt->bindParam(':id', $missao["ID"]);
                $stmt->execute();
                echo json_encode(['success' => 'Missão excluida']);
            } catch (PDOException $e) {
                echo json_encode(['error' => 'Erro ao executar a consulta: ' . $e->getMessage()]);
            }
        } catch (PDOException $e) {
            echo json_encode(['error' => 'Erro ao executar a consulta: ' . $e->getMessage()]);
        }
    } catch (PDOException $e) {
        echo json_encode(['error' => 'Erro ao executar a consulta: ' . $e->getMessage()]);
    }
} else {
    echo json_encode(['error' => 'Parametros obrigatorios nao especificados']);
}
?>