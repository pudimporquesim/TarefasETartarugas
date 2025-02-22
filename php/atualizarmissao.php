<?php
include 'conectbd.php';
header('Content-Type: application/json; charset=UTF-8');
session_start();
if (isset($_POST['mudanca']) && !empty($_POST['mudanca']) && json_decode($_POST['mudanca'], true) != []) {
    $mudanca = json_decode($_POST['mudanca'], true);
} else {
    $mudanca = null;
}
if (isset($_POST['mudancastarefas']) && !empty($_POST['mudancastarefas']) && json_decode($_POST['mudancastarefas'], true) != []) {
    $mudancastarefas = json_decode($_POST['mudancastarefas'], true);
} else {
    $mudancastarefas = null;
} 
if (isset($_POST['tarefassembdjson']) && !empty($_POST['tarefassembdjson']) && json_decode($_POST['tarefassembdjson'], true) != []) {
    $tarefassembdjson = json_decode($_POST['tarefassembdjson'], true);
} else {
    $tarefassembdjson = null;
}
if ($mudanca === null && $mudancastarefas === null && $tarefassembdjson === null) {
    echo json_encode(['error' => 'Nenhum dado de mudança foi enviado']);
    exit;
}
try {
    if ($mudanca != null && isset($mudanca)) {
        $sql = "UPDATE missao SET ";
        $params = [];

        if (!empty($mudanca['Nome'])) {
            $sql .= "Nome = :Nome, ";
            $params[':Nome'] = $mudanca['Nome'];
        }
        if (!empty($mudanca['Descricao'])) {
            $sql .= "Descricao = :Descricao, ";
            $params[':Descricao'] = $mudanca['Descricao'];
        }
        if (!empty($mudanca['DataLimite'])) {
            $sql .= "DataLimite = :DataLimite, ";
            $params[':DataLimite'] = $mudanca['DataLimite'];
        }
        if (!empty($mudanca['Dificuldade'])) {
            $sql .= "Dificuldade = :Dificuldade, ";
            $params[':Dificuldade'] = $mudanca['Dificuldade'];
        }

        $sql = rtrim($sql, ', ') . " WHERE id = :id";
        $params[':id'] = $mudanca['ID'] ?? null;
        $idmissao = $mudanca['ID'];
        if (!$params[':id']) {
            echo json_encode(['error' => "Id da missão não encontrado."]);
            exit;
        }
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        
    } 

    if ($mudancastarefas != null && is_array($mudancastarefas)) {
        foreach ($mudancastarefas as $tarefa) {
            $sql = "UPDATE tarefa SET ";
            $params = [];
            if (isset($tarefa['Nome'])) {
                $sql .= "Nome = :Nome, ";
                $params[':Nome'] = $tarefa['Nome'];
            }
            if (isset($tarefa['DataLimite'])) {
                $sql .= "DataLimite = :DataLimite, ";
                $params[':DataLimite'] = $tarefa['DataLimite'];
            }
            if (isset($tarefa['Feita'])) {
                $sql .= "Feita = :Feita, ";
                $params[':Feita'] = $tarefa['Feita'];
            }
            $sql = rtrim($sql, ', ') . " WHERE id = :id";
            $params[':id'] = $tarefa['ID'];
            $stmt = $pdo->prepare($sql);
            $stmt->execute($params);
        }
    } 

    if ($tarefassembdjson != null && is_array($tarefassembdjson)) {
        foreach ($tarefassembdjson as $novaTarefa) {
            $idpessoa = intval($_SESSION["user-id"]);
            $sql = "INSERT INTO tarefa (Nome, fk_Missao_id, DataLimite, fk_usuario_id, feita) VALUES (:Nome, :MissaoID, :data, :id, :feito)";
            $stmt = $pdo->prepare($sql);
            $stmt->bindParam(':Nome', $novaTarefa['nome']);
            $stmt->bindParam(':data', $novaTarefa['datalimite']);
            $stmt->bindParam(':MissaoID', $novaTarefa['missaoid']);
            $stmt->bindParam(':id', $idpessoa);
            $stmt->bindParam(':feito', $novaTarefa['feito']);
            $stmt->execute();
        }
    } 
    echo json_encode(['success' => 'Missão atualizada', $tarefassembdjson]);
} catch (PDOException $e) {
    echo json_encode(['error' => $e->getMessage(), $tarefassembdjson]);
}
?>
