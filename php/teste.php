<?php 
function quantidadeDias() {
    $quantdias = 5;

    if ($quantdias <= 3) {
        $mult_quantdias = 2.5;
    } elseif ($quantdias <= 15) {
        $mult_quantdias = 1.5;
    } else { // $quantdias > 15
        $mult_quantdias = 1;
    }

    echo $mult_quantdias; // Mostra o multiplicador
    return $mult_quantdias; // Retorna o multiplicador
}

$valor = quantidadeDias(); // Chama a função e armazena o retorno
echo $valor; // Mostra o retorno da função
?>