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
            // console.log("Resposta do servidor: ", data);
        })
        .fail(function (jqXHR, textStatus, errorThrown) {
            console.error('Erro na requisição:', textStatus, errorThrown);
        });
    }
    document.dispatchEvent(new CustomEvent
        ("evento-feito", {
            bubbles: true 
        }));
});
document.addEventListener("click", function (event) {
    if (event.target.matches("[data-checkbox-tarefam]")) {
        const ElementoEvento = event.target.closest("[data-tarefam]");
        // const ElementoEventoTitulo = ElementoEvento.querySelector("[data-evento-titulo]");
        const tarefaID = ElementoEvento.getAttribute('data-tarefa-missao-id');
        let feito = 0;
        if (event.target.checked) {
            const checkbox = ElementoEvento.querySelector("[data-checkbox-tarefam]");
            // ElementoEventoTitulo.classList.add("feito");
            feito = 1;
            checkbox.value = feito;
        } else {
            // ElementoEventoTitulo.classList.remove("feito");
            feito = 0;
            checkbox.value = feito;
        }
        // $.post("php/eventofeito.php", {feito, tarefaID})
        // .done(function (data) {
        //     // console.log("Resposta do servidor: ", data);
        // })
        // .fail(function (jqXHR, textStatus, errorThrown) {
        //     console.error('Erro na requisição:', textStatus, errorThrown);
        // });
    }
    // document.dispatchEvent(new CustomEvent
    //     ("evento-feito", {
    //         bubbles: true 
    //     }));
});
}