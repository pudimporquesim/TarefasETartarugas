<?php
// Configurações do banco de dados
$host = "localhost";

$banco = "tarefasetartarugas";
$usuario = "root";
$senha = "";

try {
    // Cria uma nova conexão PDO com o banco de dados
    $pdo = new PDO("mysql:host=$host;dbname=$banco;charset=utf8", $usuario, $senha);
    // Configura o modo de erro do PDO para exceções
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    // Exibe uma mensagem de erro se a conexão falhar
    die("Erro ao conectar com o banco de dados: " . $e->getMessage());
}
?>
