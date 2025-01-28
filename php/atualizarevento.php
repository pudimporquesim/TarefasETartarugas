<?php
include 'conectbd.php';
header('Content-Type: application/json; charset=UTF-8');
if ($_POST['mudanca'] != null) {
    $mudanca = $_POST['mudanca'];
    $mudanca_array = json_decode($mudanca, true);
    $nome = $mudanca_array['Nome'] ?? null;
    $descricao = $mudanca_array['Descricao'] ?? '';
    $dataLimite = $mudanca_array['DataLimite'] ?? null;
    $dificuldade = $mudanca_array['Dificuldade'] ?? null;
    $feita = $mudanca_array['Feita'] ?? null;
    $sql = "UPDATE tarefa SET ";
    $params = [];
    if ($nome) {
        $sql .= "Nome = :Nome, ";
        $params[':Nome'] = $nome;
    }
    $sql .= "Descricao = :Descricao, ";
    $params[':Descricao'] = $descricao; 
    if ($dataLimite) {
        $sql .= "DataLimite = :DataLimite, ";
        $params[':DataLimite'] = $dataLimite;
    }
    if ($dificuldade) {
        $sql .= "Dificuldade = :Dificuldade, ";
        $params[':Dificuldade'] = $dificuldade;
    }
    if ($feita !== null) {
        $sql .= "Feita = :Feita, ";
        $params[':Feita'] = $feita;
    }
    $sql = rtrim($sql, ', ') . " WHERE id = :id";
    $params[':id'] = $mudanca_array['ID'];
    try {
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        echo json_encode(['success' => 'Atualização realizada com sucesso']);
    } catch (PDOException $e) {
        echo json_encode(['error' => $e->getMessage()]);
    }
} else {
    echo json_encode(['error' => 'Parâmetros obrigatórios não especificados']);
}
?>
