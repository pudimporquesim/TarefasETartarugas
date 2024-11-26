<?php 
include 'conectbd.php';
$email = "";


if(( isset($_POST['emails']))){
    $email = $_POST['emails'];

    //juntando a variavel no script (substituir :atributo)
    // ver se já tem essa conta
    $sql = "SELECT id FROM usuario WHERE email = :email";

    try{
        $stmt = $pdo->prepare($sql);
        //de acordo com o que veio no post
        $stmt->bindParam(':email', $email);
        $stmt->execute();

        //recupera os dados fetch fetchAll
        $usuario = $stmt->fetch(PDO::FETCH_ASSOC);
        if ($usuario != false) {
            $mensagem = "Teste";
            $emailm = $usuario['email'];
            mail($emailm, 'teste', $mensagem);
        }else {
            echo("Esse email não foi cadastrado.");
        }
        // Aqui nós teriamos que conferir se esse nome heroico existe e depois mudar a senha e mandar o email
        // if ($senha ==  $usuario['senha']) {
        //     echo json_encode(['success' => 'Login realizado com sucesso', 'user_id' => $usuario['id']]);
        // } else {
        //     echo json_encode(['error' => 'Senha incorreta']);
        // }

    } catch (PDOException $e) {
        echo json_encode(['error' => 'Erro ao executar a consulta: ' . $e->getMessage()]);
    }

}else {
    // Retorna um erro caso algum parâmetro obrigatório esteja faltando
    echo json_encode(['error' => 'Parametros obrigatorios nao especificados']);
}

?>