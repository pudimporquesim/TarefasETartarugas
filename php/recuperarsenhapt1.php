<?php 
include 'conectbd.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;
require '../vendor/autoload.php';
$email = "";

if(( isset($_POST['emails']))){
    $email = md5($_POST['emails']);
    $sql = "SELECT id FROM usuario WHERE email = :email";
    try{
        $stmt = $pdo->prepare($sql);
        //de acordo com o que veio no post
        $stmt->bindParam(':email', $email);
        $stmt->execute();
        //recupera os dados fetch fetchAll
        $usuario = $stmt->fetch(PDO::FETCH_ASSOC);
        if ($usuario != false) {
            $data = date("Y-m-d");
            //juntando a variavel no script (substituir :atributo)
            // ver se já tem essa conta
            
            $hash = md5(strval( rand() ) . $email);
            $sqlhash = "INSERT INTO hash (hash, dataCriado, fk_email_usuario) VALUES (:hash, :data, :email)";
            try {
            $hashtry = $pdo->prepare($sqlhash);
            $hashtry->bindParam(':hash', $hash);
            $hashtry->bindParam(':data', $data);
            $hashtry->bindParam(':email', $email);
            $hashtry->execute();
            } catch (PDOException $e) {
                echo json_encode(['error' => 'Erro ao executar a consulta: ' . $e->getMessage()]);
            }
            $mail = new PHPMailer(true);
            try {
                //Server settings
                // $mail->SMTPDebug = SMTP::DEBUG_SERVER;                
                $mail->isSMTP();                                          
                $mail->Host       = 'smtp.gmail.com';                  
                $mail->SMTPAuth   = true;                             
                $mail->Username   = 'tarefasetartarugas@gmail.com';                   
                $mail->Password   = 'giur mjae iaka arxz';                           
                $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;           
                $mail->Port       = 465;                                    
                //TCP port to connect to; use 587 if you have set `SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS`

                //Recipients
                $mail->setFrom('tarefasetartarugas@gmail.com', 'Tarefas & Tartarugas');
                $mail->addAddress($_POST['emails']);   
                $mail->addReplyTo('tarefasetartarugas@gmail.com', 'Information');
                //Content
                $mail->isHTML(true);                                
                $mail->Subject = 'Here is the subject';
                $end = "http://localhost/tarefasetartarugas/recuperarsenha.php?hash=".$hash;
                $mail->Body    = '<a href="'.$end.'">Clique aqui</a>';
                $mail->AltBody = '<a href="'.$end.'">Clique aqui</a>';
                $mail->send();
                echo json_encode (['success' => "O email foi enviado com sucesso"], JSON_UNESCAPED_UNICODE);
            } catch (Exception $e) {
                //Não sei se muda para echo json_encode porque esse veio direto do php mailler
                echo "Message could not be sent. Mailer Error: {$mail->ErrorInfo}";
            }
        }else {
            echo json_encode(['error' => 'Esse email não foi cadastrado'], JSON_UNESCAPED_UNICODE);
        }

    } catch (PDOException $e) {
        echo json_encode(['error' => 'Erro ao executar a consulta: ' . $e->getMessage()]);
    }

}else {
    // Retorna um erro caso algum parâmetro obrigatório esteja faltando
    echo json_encode(['error' => 'Parametros obrigatorios nao especificados']);
}

?>