<?php
//conexao com banco
include 'conectbd.php';
//variavels (dependendo do que vc fará)
$email = "";
$senha = "";

//pegando os valores e verificando
if( ( isset($_POST['email']) ) && ( isset($_POST['senha']) ) ){
    $email = $_POST['email'];
    $senha = $_POST['senha'];

    //juntando a variavel no script (substituir :atributo)
    $sql = "SELECT id FROM usuario WHERE email = :email and senha = :senha";

    try{
        $stmt = $pdo->prepare($sql);
        //de acordo com o que veio no post
        $stmt->bindParam(':email', $email);
        $stmt->bindParam(':senha', $senha);
        $stmt->execute();

        //recupera os dados fetch fetchAll
        $usuario = $stmt->fetch(PDO::FETCH_ASSOC);

            // Verifica a senha usando password_verify
        if ($senha ==  $usuario['senha']) {
            echo json_encode(['success' => 'Login realizado com sucesso', 'user_id' => $usuario['id']]);
        } else {
            echo json_encode(['error' => 'Senha incorreta']);
        }

    } catch (PDOException $e) {
        echo json_encode(['error' => 'Erro ao executar a consulta: ' . $e->getMessage()]);
    }

}else {
    // Retorna um erro caso algum parâmetro obrigatório esteja faltando
    echo json_encode(['error' => 'Parametros obrigatorios nao especificados']);
}