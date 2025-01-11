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
    // $recompensa = [
    //     "moedas" => "",
    //     "xp" => ""
    // ];
    $recompensa = 0;
    function quantidadeDias() {
        $data_limite = $_POST['data_limite'];
        $datalimitedata = new DateTime($data_limite);
        $dialimite = (int) $datalimitedata->format('d');
        $data_criada = date("Y-m-d");
        $datacriadadata = new DateTime($data_criada);
        $diacriada = (int) $datacriadadata->format('d');
        $quantdias = $dialimite - $diacriada;
        if ($quantdias <= 3) {
            $mult_quantdias = 2.5;
        } elseif ($quantdias <= 15) {
            $mult_quantdias = 1.5;
        } else {
            $mult_quantdias = 1;
        }
        return $mult_quantdias;
    }
    $mult_quantdias = quantidadeDias();
    switch ($dificuldade) {
        case "facil":
            
            break;
        case "medio":
            echo "i é igual a 1";
            break;
        case "dificil":
            echo "i é igual a 2";
            break;
    }
    echo json_encode(['success' => "hoje é {$data_criada}"]);
} else {
    echo json_encode(['error' => 'Parametros obrigatorios nao especificados']);
}
?>