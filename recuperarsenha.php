<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" type="text/css" href="../TarefasETartarugas/css/senha.css">
    <title>Recuperar senha</title>
</head>
<body>
    <div class="container">
        <h1>Recuperar Senha</h1>
        <form method="post">
            <label for="senha">Insira sua nova senha:</label> 
            <input name="senha" id="senhat" type="password">
            <input type="hidden" name="hash" id="hash" value="<?php echo $_GET['hash']; ?>">
        </form>
        <button id="trocar" type="submit">Trocar senha</button>
    </div>
    <script src="https://code.jquery.com/jquery-3.7.1.js" integrity="sha256-eKhayi8LEQwp4NKxN+CfCh+3qOVUtJn3QNZ0TciWLP4=" crossorigin="anonymous"></script>
    <script type="text/javascript" src="../TarefasETartarugas/scripts/recuperarsenha.js"></script>
</body>
</html>