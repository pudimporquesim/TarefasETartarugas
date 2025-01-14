export function feito() {
const ElementoTemplateEvento = document.querySelector("[data-template='evento']");
const ConteudoEvento = ElementoTemplateEvento.content.cloneNode(true);
const checkbox = ConteudoEvento.querySelector("[data-checkbox]");
document.addEventListener("click", function (event) {
    if (event.target.matches("[data-checkbox]")) {
        const ElementoEvento = event.target.closest("[data-evento]");
        const ElementoEventoTitulo = ElementoEvento.querySelector("[data-evento-titulo]");
        feito = 0;
        if (event.target.checked) {
            ElementoEventoTitulo.classList.add("feito");
            feito = 1;
        } else {
            ElementoEventoTitulo.classList.remove("feito");
            feito = 0;
        }
        $.post("php/eventofeito.php", {feito})
        .done(function (data) {
            console.log("Resposta do servidor: ", data);
        })
        .fail(function (jqXHR, textStatus, errorThrown) {
            console.error('Erro na requisição:', textStatus, errorThrown);
        });
    }
});
}