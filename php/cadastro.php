<?php 
include 'conectbd.php';
header('Content-Type: application/json');
$nomer = "";
$email = "";
$senha = "";

if( ($_POST['emailr'] != null) && ($_POST['senhaR1'] != null) && ($_POST['nomer'] != null) ){
    $email = md5($_POST['emailr']);
    $senha = md5($_POST['senhaR1']);
    $nomer = $_POST['nomer'];

    $checarEmail = "SELECT email FROM usuario where email = :email";
    //checa se o email já foi cadastrado
    try {
        $stmt = $pdo->prepare($checarEmail);
        $stmt->bindParam(':email', $email);
        $stmt->execute();
        $result = $stmt->fetch();
        if (empty($result) ) {
            $sql = "INSERT INTO usuario (nome, email, senha) values (:nome, :email, :senha)";
            try{
                $stmt = $pdo->prepare($sql);
                //de acordo com o que veio no post
                $stmt->bindParam(':email', $email);
                $stmt->bindParam(':senha', $senha);
                $stmt->bindParam(':nome', $nomer);
                $stmt->execute();
                //recupera os dados fetch fetchAll
                $usuario = $stmt->fetch(PDO::FETCH_ASSOC);
                //
                echo json_encode (['success' => "Conta cadastrada com sucesso"], JSON_UNESCAPED_UNICODE);
            } catch (PDOException $e) {
                echo json_encode(['error' => 'Erro ao executar a consulta: ' . $e->getMessage()]);
            }
        } else {
            echo json_encode (['error' => "Esse email já foi cadastrado, faça login"], JSON_UNESCAPED_UNICODE);
        }
    } catch (PDOException $e) {
        echo json_encode(['error' => 'Erro ao executar a consulta: ' . $e->getMessage()]);
    }
}else {
    // Retorna um erro caso algum parâmetro obrigatório esteja faltando
    echo json_encode(['error' => 'Parametros obrigatorios nao especificados']);
}

?>