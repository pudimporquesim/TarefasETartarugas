<?php
include 'conectbd.php';
header('Content-Type: application/json; charset=utf-8');
$senhat = "";
$hash = "";
if ((isset($_POST['hash']))) {
    $hash = $_POST['hash'];
    date_default_timezone_set('America/Bahia');
    $data = date("Y-m-d");
    $sqlhash = "SELECT hash FROM hash WHERE hash = :hash AND dataCriado = :data";
    try {
       $hashtry = $pdo->prepare($sqlhash);
       $hashtry->bindParam(':hash', $hash);
       $hashtry->bindParam(':data', $data);
       $hashtry->execute();
       $hashstring = $hashtry->fetch(PDO::FETCH_ASSOC);
       if ($hashstring != false) {
        $sqlseusado = "SELECT usado FROM hash WHERE hash = :hash";
        $seusado = $pdo->prepare($sqlseusado);
        $seusado->bindParam(':hash', $hash);
        $seusado->execute();
        $seusadostr = $seusado->fetch(PDO::FETCH_ASSOC);
        if ($seusadostr['usado'] == 0) {
            if (isset($_POST['senhat'])) {
                $senhat = md5($_POST['senhat']);
                $sql = "UPDATE usuario set senha = :senhat where email IN (SELECT fk_email_usuario FROM hash WHERE hash = :hash)";
                $sql2 = "UPDATE hash set usado = 1 where hash = :hash";
                try {
                    $trocasenhat = $pdo->prepare($sql);
                    $usado = $pdo->prepare($sql2);
                    $usado->bindParam(':hash', $hash);
                    $trocasenhat->bindParam(':senhat', $senhat);
                    $trocasenhat->bindParam(':hash', $hash);
                    $trocasenhat->execute();
                    $usado->execute();
                    echo json_encode(['success' => 'senha atualizada com sucesso'], JSON_UNESCAPED_UNICODE);
                }catch (PDOException $e) {
                    echo json_encode(['error' => 'Erro ao executar a consulta: ' . $e->getMessage()]);
                }
            } else {
                echo json_encode(['error' => 'Parametros obrigatorios nao especificados senha']);
            }
        } else {
            echo json_encode(['error' => 'Essa solicitação de troca de senha já foi usada, solicite uma nova'], JSON_UNESCAPED_UNICODE);
        }
       } else {
        echo json_encode(['error' => 'Essa solicitação de troca de senha expirou, solicite uma nova'], JSON_UNESCAPED_UNICODE);
       }
    } catch (PDOException $e) {
        echo json_encode(['error' => 'Erro ao executar a consulta: ' . $e->getMessage()]);
    }
}else {
    // Retorna um erro caso algum parâmetro obrigatório esteja faltando
    echo json_encode(['error' => 'Parametros obrigatorios nao especificados hash']);
}

?>