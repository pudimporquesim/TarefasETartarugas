export function sessionfunc() {
    $.post("php/session.php")
        .done(function (data) {
            console.log("Resposta do servidor: ", data);
            
        })
        .fail(function (jqXHR, textStatus, errorThrown) {
            console.error('Erro na requisição:', textStatus, errorThrown);
        });
}