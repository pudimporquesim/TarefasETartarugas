<?php 
include 'conectbd.php';
$nome = "";
$email = "";
$senha = "";

if( ( isset($_POST['emailr']) ) && ( isset($_POST['senhaR1'])) && (isset($_POST['nome'])) ){
    $email = $_POST['emailr'];
    $senha = $_POST['senhaR1'];
    $nome = $_POST['nome'];

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
                $stmt->bindParam(':nome', $nome);
                $stmt->execute();
                //recupera os dados fetch fetchAll
                $usuario = $stmt->fetch(PDO::FETCH_ASSOC);
                //mandando o usuário pra algum lugar
                header('Location: ../index.html');
            } catch (PDOException $e) {
                echo json_encode(['error' => 'Erro ao executar a consulta: ' . $e->getMessage()]);
            }
        } else {
            echo("Essa conta já existe, crie outra deixe de bobaje");
        }
    } catch (PDOException $e) {
        echo json_encode(['error' => 'Erro ao executar a consulta: ' . $e->getMessage()]);
    }
}else {
    // Retorna um erro caso algum parâmetro obrigatório esteja faltando
    echo json_encode(['error' => 'Parametros obrigatorios nao especificados']);
}

?>