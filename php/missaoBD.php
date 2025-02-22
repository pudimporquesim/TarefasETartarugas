<?php
include 'conectbd.php';
header('Content-Type: application/json; charset=UTF-8');
date_default_timezone_set('America/Bahia');
session_start();
if(($_POST['titulom'] != null) && ($_POST['datalm'] != null) && ($_POST['dificuldadem'] != null) && ($_POST['feitom'] != null) && ($_POST['tarefasm'])) {
    $titulo = $_POST['titulom'];
    $descricao = $_POST['descm'];
    $data_limite = $_POST['datalm'];
    $data_criada = date("Y-m-d");
    $datalimitedata = new DateTime($data_limite);
    $datacriadadata = new DateTime($data_criada);
    if ($datalimitedata < $datacriadadata) {
        echo json_encode(['error' => 'A missão não pode ter uma data anterior ao dia atual']);
    } else {
        $dificuldade = $_POST['dificuldadem'];
        $feito = $_POST['feitom'];
        $idpessoa = intval($_SESSION["user-id"]);
        $tarefasm_input = $_POST['tarefasm'];
        $tarefas_array = json_decode($tarefasm_input, true);
        $recompensa_moedas = 10;
        $recompensa_xp = 7;
        function quantidadeDias() {
            $data_limite = $_POST['datalm'];
            $datalimitedata = new DateTime($data_limite);
        
            $data_criada = date("Y-m-d");
            $datacriadadata = new DateTime($data_criada);
            $dateInterval = $datacriadadata->diff($datalimitedata);
            $quantdias = $dateInterval->days;
            if ($quantdias <= 3) {
                $mult_quantdias = 2.5;
            } elseif ($quantdias <= 15) {
                $mult_quantdias = 1.5;
            } else {
                $mult_quantdias = 1;
            }
            return $mult_quantdias;
        }
        function multclasse() {
            $classe =  $_SESSION["classe"];
            if ($classe == "tartaruga") {
                $mult_classeX = 1.5;
                $mult_classeM = 1;
            } elseif ($classe == "jabuti") {
                $mult_classeM = 1.5;
                $mult_classeX = 1;
            } else {
                $mult_classeM = 1;
                $mult_classeX = 1;
            }
            return [$mult_classeM, $mult_classeX];
        }
        $mult_classe = multclasse();
        $mult_quantdias = quantidadeDias();
        switch ($dificuldade) {
            case "facil":
                $mult_dific = 1;
                $recompensa_xp = $recompensa_xp * $mult_dific * $mult_quantdias * $mult_classe[1];
                $recompensa_moedas = $recompensa_moedas * $mult_dific * $mult_quantdias * $mult_classe[0];
                break;
            case "medio":
                $mult_dific = 2;
                $recompensa_xp = $recompensa_xp * $mult_dific * $mult_quantdias * $mult_classe[1];
                $recompensa_moedas = $recompensa_moedas * $mult_dific * $mult_quantdias * $mult_classe[0];
                break;
            case "dificil":
                $mult_dific = 4;
                $recompensa_xp = $recompensa_xp * $mult_dific * $mult_quantdias * $mult_classe[1];
                $recompensa_moedas = $recompensa_moedas * $mult_dific * $mult_quantdias * $mult_classe[0];
                break;
        }
        $sql = "INSERT INTO missao (nome, descricao, datalimite, datacriacao, dificuldade, completa, recompensa_moedas, recompensa_xp) values (:nome, :desc, :datal, :datac, :dific, :feita,  :recompensa_m, :recompensa_x)";
            try {
                $stmt = $pdo->prepare($sql);
                $stmt->bindParam(':nome', $titulo);
                $stmt->bindParam(':desc', $descricao);
                $stmt->bindParam(':datal', $data_limite);
                $stmt->bindParam(':datac', $data_criada);
                $stmt->bindParam(':dific', $dificuldade);
                $stmt->bindParam(':feita', $feito);
                $stmt->bindParam(':recompensa_m', $recompensa_moedas);
                $stmt->bindParam(':recompensa_x', $recompensa_xp);
                if ($stmt->execute()) {
                    $misssaoid = $pdo->lastInsertId();
                    $sql2 = "INSERT INTO usuario_missao (fk_Usuario_ID, fk_Missao_ID) values (:usuario_id, :missao_id)";
                    try {
                        $smm = $pdo->prepare($sql2);
                        $smm->bindParam(':usuario_id', $idpessoa);
                        $smm->bindParam(':missao_id', $misssaoid);
                        $smm->execute();
                        foreach ($tarefas_array as $tarefa) {
                            $nomet = $tarefa["nome"];
                            $data_limitet = $tarefa["datalimite"];
                            $feitot = $tarefa["feito"];
                            $sql3 = "INSERT INTO tarefa (nome, datalimite, feita, fk_usuario_id, fk_Missao_ID, recompensa_moedas, recompensa_xp) values (:nome, :datal, :feita, :usuario_id, :missaoid, :recompensa_m, :recompensa_x)";
                            try {
                                $ah = $pdo->prepare($sql3);
                                $ah->bindParam(':nome', $nomet);
                                $ah->bindParam(':datal', $data_limitet);
                                $ah->bindParam(':feita', $feitot);
                                $recompm = 0;
                                $recompx = 0;
                                $ah->bindParam(':recompensa_m', $recompm);
                                $ah->bindParam(':recompensa_x', $recompx);
                                $ah->bindParam(':usuario_id', $idpessoa);
                                $ah->bindParam(':missaoid', $misssaoid);
                                $ah->execute();
                            } catch (PDOException $e) {
                                echo json_encode(['error' => 'Erro ao executar a consulta: ' . $e->getMessage()]);
                            }
                        }
                        echo json_encode(['success' => 'Missão criada']);
                    } catch (PDOException $e) {
                        echo json_encode(['error' => 'Erro ao executar a consulta: ' . $e->getMessage()]);
                    }
                } else {
                    echo json_encode(['error' => 'Erro ao executar a consulta: ']);
                }
            } catch (PDOException $e) {
                echo json_encode(['error' => 'Erro ao executar a consulta: ' . $e->getMessage()]);
            }
    }
} else {
    echo json_encode(['error' => 'Parametros obrigatorios nao especificados']);
}
?>