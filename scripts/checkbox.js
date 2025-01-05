export function feito() {
const ElementoTemplateEvento = document.querySelector("[data-template='evento']");
const ConteudoEvento = ElementoTemplateEvento.content.cloneNode(true);
const checkbox = ConteudoEvento.querySelector("[data-checkbox]");
document.addEventListener("click", function (event) {
    if (event.target.matches("[data-checkbox]")) {
        const ElementoEvento = event.target.closest("[data-evento]");
        const ElementoEventoTitulo = ElementoEvento.querySelector("[data-evento-titulo]");
        if (event.target.checked) {
            ElementoEventoTitulo.classList.add("feito");
        } else {
            ElementoEventoTitulo.classList.remove("feito");
        }
    }
});
}