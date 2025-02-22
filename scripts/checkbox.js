import { iniciarToaster } from "./home.js";
export function feito() {
let main = document.querySelector("main");
const toaster = iniciarToaster(main);
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
            if (data.error != undefined) {
                toaster.error(data.error);
              } else if (data.success != undefined) {
                toaster.success(data.success);
              }
        })
        document.dispatchEvent(new CustomEvent
            ("evento-feito", {
                bubbles: true 
            }));
    }
});
}