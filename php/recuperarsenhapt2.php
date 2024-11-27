<?php
include 'conectbd.php';
$senha = "";
$email = "";

if ((isset($_POST['email'])) && (isset($_POST['senha']))) {
    $senha = $_POST['senha'];
    $email = $_POST['email'];
    $checarEmail = "SELECT email FROM usuario where email = :email";
    try {
        $stmt = $pdo->prepare($checarEmail);
        $stmt->bindParam(':email', $email);
        $stmt->execute();
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        if ($result != false) {
            $sql = "UPDATE usuario set senha = :senha where email = :email";
            try{
                $stmt = $pdo->prepare($sql);
                //de acordo com o que veio no post
                $stmt->bindParam(':email', $email);
                $stmt->bindParam(':senha', $senha);
                $stmt->execute();
                //recupera os dados fetch fetchAll
                $usuario = $stmt->fetch(PDO::FETCH_ASSOC);
                echo ("Senha atualizada com sucesso");
            } catch (PDOException $e) {
                echo json_encode(['error' => 'Erro ao executar a consulta: ' . $e->getMessage()]);
            }
        } else {
            echo("Esse email não foi cadastrado.");
        }
    } catch (PDOException $e) {
        echo json_encode(['error' => 'Erro ao executar a consulta: ' . $e->getMessage()]);
    }

}else {
    // Retorna um erro caso algum parâmetro obrigatório esteja faltando
    echo json_encode(['error' => 'Parametros obrigatorios nao especificados']);
}

?>