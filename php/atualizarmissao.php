<?php
include 'conectbd.php';
header('Content-Type: application/json; charset=UTF-8');
session_start();
if (isset($_POST['mudanca']) && !empty($_POST['mudanca']) ) {
    $mudanca = json_decode($_POST['mudanca'], true);
} else {
    $mudanca = null;
}
if (isset($_POST['mudancastarefas']) && !empty($_POST['mudancastarefas']) ) {
    $mudancastarefas = json_decode($_POST['mudancastarefas'], true);
} else {
    $mudancastarefas = null;
}
if (isset($_POST['tarefassembdjson']) && !empty($_POST['tarefassembdjson']) ) {
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
        $mudanca_status = "Missão atualizada com sucesso";
    } else {
        $mudanca_status = "Nenhuma mudança na missão";
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
        $mudancastarefas_status = "Tarefas atualizadas com sucesso";
    } else {
        $mudancastarefas_status = "Nenhuma mudança nas tarefas";
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
        $tarefassembdjson_status = "Novas tarefas adicionadas";
    } else {
        $tarefassembdjson_status = "Nenhuma nova tarefa adicionada";
    }

    echo json_encode([
        'mudanca' => $mudanca_status,
        'mudancastarefas' => $mudancastarefas_status,
        'tarefassembdjson' => $tarefassembdjson_status
    ]);
} catch (PDOException $e) {
    echo json_encode(['error' => $e->getMessage(), $tarefassembdjson]);
}




// if ($_POST['mudanca'] != null && !isset($_POST['mudanca']) ) {
//     $mudanca = $_POST['mudanca'];
//     $mudanca_array = json_decode($mudanca, true);
//     $nome = $mudanca_array['Nome'] ?? null;
//     $descricao = $mudanca_array['Descricao'] ?? '';
//     $dataLimite = $mudanca_array['DataLimite'] ?? null;
//     $dificuldade = $mudanca_array['Dificuldade'] ?? null;
//     $sql = "UPDATE tarefa SET ";
//     $params = [];
//     if ($nome) {
//         $sql .= "Nome = :Nome, ";
//         $params[':Nome'] = $nome;
//     }
//     $sql .= "Descricao = :Descricao, ";
//     $params[':Descricao'] = $descricao; 
//     if ($dataLimite) {
//         $sql .= "DataLimite = :DataLimite, ";
//         $params[':DataLimite'] = $dataLimite;
//     }
//     if ($dificuldade) {
//         $sql .= "Dificuldade = :Dificuldade, ";
//         $params[':Dificuldade'] = $dificuldade;
//     }
//     $sql = rtrim($sql, ', ') . " WHERE id = :id";
//     $params[':id'] = $mudanca_array['ID'];
//     try {
//         $stmt = $pdo->prepare($sql);
//         $stmt->execute($params);
//         $mudanca_arraytarefas = json_decode($mudanca = $_POST['mudancastarefas'], true);
//         echo json_encode(['tarefas' => $mudanca_array]);
//     } catch (PDOException $e) {
//         echo json_encode(['error' => $e->getMessage()]);
//     }
// } else {
//     echo json_encode(['error' => 'Parâmetros obrigatórios não especificados']);
// }
?>
