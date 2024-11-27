<?php 
include 'conectbd.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;
require '../vendor/autoload.php';
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
                $mail->Body    = 'This is the HTML message body <b>in bold!</b>';
                $mail->AltBody = 'This is the body in plain text for non-HTML mail clients';

                $mail->send();
                echo 'Message has been sent';
            } catch (Exception $e) {
                echo "Message could not be sent. Mailer Error: {$mail->ErrorInfo}";
            }
            // $mensagem = "Teste";
            // $emailm = $usuario['email'];
            // mail($emailm, 'teste', $mensagem);
        }else {
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