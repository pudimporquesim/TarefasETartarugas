<?php
include 'conectbd.php';
header('Content-Type: application/json; charset=UTF-8');
date_default_timezone_set('America/Bahia');
session_start();
if(($_POST['titulo'] != null) && ($_POST['data_limite'] != null) && ($_POST['dificuldade'] != null) && ($_POST['feito'] != null)) {
    $titulo = $_POST['titulo'];
    $descricao = $_POST['descricao'];
    $data_limite = $_POST['data_limite'];
    $data_criada = date("Y-m-d");
    $dificuldade = $_POST['dificuldade'];
    $feito = $_POST['feito'];
    $idpessoa = intval($_SESSION["user-id"]);
    $recompensa_moedas = 5;
    $recompensa_xp = 3;
    function quantidadeDias() {
        $data_limite = $_POST['data_limite'];
        $datalimitedata = new DateTime($data_limite);
        // $dialimite = (int) $datalimitedata->format('d');
        $data_criada = date("Y-m-d");
        $datacriadadata = new DateTime($data_criada);
        // $diacriada = (int) $datacriadadata->format('d');
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
    $sql = "INSERT INTO tarefa (nome, descricao, datalimite, datacriacao, dificuldade, feita, fk_usuario_id, recompensa_moedas, recompensa_xp) values (:nome, :desc, :datal, :datac, :dific, :feita, :usuario_id, :recompensa_m, :recompensa_x)";
    try {
        $stmt = $pdo->prepare($sql);
        $stmt->bindParam(':nome', $titulo);
        $stmt->bindParam(':desc', $descricao);
        $stmt->bindParam(':datal', $data_limite);
        $stmt->bindParam(':datac', $data_criada);
        $stmt->bindParam(':dific', $dificuldade);
        $stmt->bindParam(':feita', $feito);
        $stmt->bindParam(':usuario_id', $idpessoa);
        $stmt->bindParam(':recompensa_m', $recompensa_moedas);
        $stmt->bindParam(':recompensa_x', $recompensa_xp);
        $stmt->execute();
        echo json_encode(['success' => 'Tarefa criada']);
    } catch (PDOException $e) {
        echo json_encode(['error' => 'Erro ao executar a consulta: ' . $e->getMessage()]);
    }
} else {
    echo json_encode(['error' => 'Parametros obrigatorios nao especificados']);
}
?>