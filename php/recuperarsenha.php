<?php 
include 'conectbd.php';
$nome_heroico = "";


if(( isset($_POST['nome_heroico']))){
    $email = $_POST['nome_heroico'];

    //juntando a variavel no script (substituir :atributo)
    // ver se já tem essa conta
    $sql = "SELECT id, email FROM usuario WHERE nome_heroico = :nome_heroico";

    try{
        $stmt = $pdo->prepare($sql);
        //de acordo com o que veio no post
        $stmt->bindParam(':nome_heroico', $nome_heroico);
        $stmt->execute();

        //recupera os dados fetch fetchAll
        $usuario = $stmt->fetch(PDO::FETCH_ASSOC);

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