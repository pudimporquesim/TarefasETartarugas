<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <div>
        <form method="post">
            <label for="senha">Insira sua nova senha:</label> <br>
            <input name="senha" id="senhat" type="password"> <br>
            <label for="senha2">Insira sua nova senha novamente:</label> <br>
            <input name="senha2" id="senha2" type="password"> <br>
            <input type="hidden" name="hash" id="hash" value="<?php echo $_GET['hash']; ?>">
            <button id="trocar" type="submit">Trocar senha</button>
        </form>
    </div>
    <script src="https://code.jquery.com/jquery-3.7.1.js" integrity="sha256-eKhayi8LEQwp4NKxN+CfCh+3qOVUtJn3QNZ0TciWLP4=" crossorigin="anonymous"></script>
    <script type="text/javascript" src="../TarefasETartarugas/scripts/recuperarsenha.js"></script>
</body>
</html>