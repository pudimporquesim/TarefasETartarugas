<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <div>
        <form action="php/recuperarsenhapt2.php" method="post">
            <label for="senha">Insira sua nova senha:</label> <br>
            <input name="senha" id="senha" type="password"> <br>
            <label for="senha2">Insira sua nova senha novamente:</label> <br>
            <input name="senha2" id="senha2" type="password"> <br>
            <input type="hidden" name="hash" value="<?php echo $_GET['hash']; ?>">
            <input type="submit" value="Trocar senha">
        </form>
    </div>
</body>
</html>