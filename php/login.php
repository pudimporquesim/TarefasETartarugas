<?php
//conexao com banco
include 'conectbd.php';
//variavels (dependendo do que vc fará)
$email = "";
$senha = "";

//pegando os valores e verificando
if( ( isset($_POST['emaill']) ) && ( isset($_POST['senhal']) ) ){
    $email = md5($_POST['emaill']);
    $senha = md5($_POST['senhal']);

    //juntando a variavel no script (substituir :atributo)
    $sql = "SELECT id FROM usuario WHERE email = :email";

    try{
        $stmt = $pdo->prepare($sql);
        //de acordo com o que veio no post
        $stmt->bindParam(':email', $email);
        $stmt->execute();

        //recupera os dados fetch fetchAll
        $usuario = $stmt->fetch(PDO::FETCH_ASSOC);
        if ($usuario != false) {
            $checarSenha = "SELECT senha FROM usuario WHERE email = :email";
            $ah = $pdo->prepare($checarSenha);
            $ah->bindParam(':email', $email);
            $ah->execute();
            $resultado = $ah->fetch();
                // Verifica a senha usando password_verify
            if ($senha == $resultado['senha']) {
                echo json_encode(['success' => 'Login realizado com sucesso', 'user_id' => $usuario['id']]);
            } else {
                echo json_encode(['error' => 'Senha incorreta']);
            }
        } else {
            echo("Esse email não foi cadastrado."); // Mudar para json_encode
        }
    } catch (PDOException $e) {
        echo json_encode(['error' => 'Erro ao executar a consulta: ' . $e->getMessage()]);
    }

}else {
    // Retorna um erro caso algum parâmetro obrigatório esteja faltando
    echo json_encode(['error' => 'Parametros obrigatorios nao especificados']);
}