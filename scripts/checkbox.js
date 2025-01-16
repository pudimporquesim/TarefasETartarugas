export function feito() {
document.addEventListener("click", function (event) {
    if (event.target.matches("[data-checkbox]")) {
        const ElementoEvento = event.target.closest("[data-evento]");
        const ElementoEventoTitulo = ElementoEvento.querySelector("[data-evento-titulo]");
        const tarefaID = ElementoEvento.getAttribute('data-evento-id');
        let feito = 0;
        if (event.target.checked) {
            ElementoEventoTitulo.classList.add("feito");
            feito = 1;
        } else {
            ElementoEventoTitulo.classList.remove("feito");
            feito = 0;
        }
        $.post("php/eventofeito.php", {feito, tarefaID})
        .done(function (data) {
            console.log("Resposta do servidor: ", data);
        })
        .fail(function (jqXHR, textStatus, errorThrown) {
            console.error('Erro na requisição:', textStatus, errorThrown);
        });
    }
});
}