<?php 
header('Content-Type: application/json; charset=UTF-8');
include 'conectbd.php';
//variavels (dependendo do que vc fará)
$email = "mabelwna@gmail.com";
$senha = "1234";


//pegando os valores e verificando
if(($email != null) && ($senha != null)) {
    $email = md5($email);
    $senha = md5($senha);

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
            $checarSenha = "SELECT * FROM tarefa WHERE fk_usuario_id = 1";
            $ah = $pdo->prepare($checarSenha);
            $ah->execute();
            $resultado = $ah->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode(['tarefas' => $resultado]);
                // Verifica a senha usando password_verify
            // if ($senha == $resultado['senha']) {
            //     session_start();
            //     $_SESSION["user-id"] = $usuario['id'];
            //     echo json_encode(['success' => 'Login realizado com sucesso', 'user_id' => $_SESSION["user-id"]]);
            // } else {
            //     echo json_encode(['error' => 'Senha incorreta']);
            // }
        } else {
            echo json_encode(['error' => 'Esse email não foi cadastrado.']); // Mudar para json_encode
        }
    } catch (PDOException $e) {
        echo json_encode(['error' => 'Erro ao executar a consulta: ' . $e->getMessage()]);
    }

}else {
    // Retorna um erro caso algum parâmetro obrigatório esteja faltando
    echo json_encode(['error' => 'Parametros obrigatorios nao especificados']);
}
?>