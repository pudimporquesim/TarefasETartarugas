var butao = document.getElementById("hoje");
var calendarioMes = document.getElementsByClassName("calendario-mes")[0]; 
var calendarioSemana = document.getElementsByClassName("calendario-semana")[0];

function teste() {
    if (calendarioMes.style.display == "none") {
        calendarioMes.style.display = "flex";
        calendarioSemana.style.display = "none";
    } else {
        calendarioMes.style.display = "none";
        calendarioSemana.style.display = "flex";
    }
}

function butaocriacaoevento() {
    const butaoevento = document.getElementById("adicionartarefa");
    butaoevento.addEventListener("click", () => {
        butaoevento.dispatchEvent(new CustomEvent
            ("requisicao-criacao-evento", {
                bubbles: true
            }));
    })
}
function formdialogevento() {
    const dialog = iniciarDialog("form-evento");
    const FormEvento = iniciarFormEvento();
    document.addEventListener("requisicao-criacao-evento", () => {
        dialog.open();
    });

    dialog.elementoDialog.addEventListener("close", () => {
        FormEvento.reset();
    })

    FormEvento.ElementoForm.addEventListener("criar-evento", () => {
        dialog.close();
    });
}
function iniciarDialog(nome) {
    const elementoDialog = document.querySelector(`[data-dialog=${nome}]`);
    const butaofechar = document.querySelectorAll("[data-dialog-close-button]");

    for (const pedacobutaofechar of butaofechar) {
        pedacobutaofechar.addEventListener("click", () => {
            elementoDialog.close();
        });
    }
    elementoDialog.addEventListener("click", (event) => {
        if (event.target === elementoDialog) {
            elementoDialog.close();
        }
    })
    return {
        elementoDialog,
        open() {
            elementoDialog.showModal();
        },
        close() {
            elementoDialog.close();
        }
    };
}
function iniciarFormEvento() {
    const ElementoForm = document.querySelector("[data-event-form]");
    ElementoForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const EventoForm = FormparaEvento(ElementoForm);

        ElementoForm.dispatchEvent(new CustomEvent("criar-evento", {
            detail: {
                event: EventoForm
            },
            bubbles: true
        }));
    });
    return {
        ElementoForm,
        reset() {
            ElementoForm.reset();
        }
    };
}

function FormparaEvento(ElementoForm) { 
    const DadosForm = new FormData(ElementoForm);
    const titulo = DadosForm.get("nome");
    const data = DadosForm.get("data-limite");
    const dificuldade = DadosForm.get("dificuldade");

    const event = {
        titulo,
        data: new Date(data),
        dificuldade
    };

    return event;
}
// function validarEvento(event) {
    // eu validaria pra não colocar um evento antes do dia atual
// }
function iniciarArmEvento() { 
    document.addEventListener("criar-evento", (event)=>{
        const EventoCriado = event.detail.event;
        const events = pegareventosdoarm();
        events.push(EventoCriado);
        saveEventsIntoLocalStorage(events);
    })
}
function saveEventsIntoLocalStorage(events) {
    const safeToStringifyEvents = events.map((event) => ({
      ...event,
      data: event.data.toISOString()
    }));
  
    let stringifiedEvents;
    try {
      stringifiedEvents = JSON.stringify(safeToStringifyEvents);
    } catch (error) {
      console.error("Stringify events failed", error);
    }
  
    localStorage.setItem("events", stringifiedEvents);
}

function pegareventosdoarm() {  
    const eventosarm = localStorage.getItem("events");
    if (eventosarm === null) {
        return [];
    }

    let parsedEventos;
    try {
        parsedEventos = JSON.parse(eventosarm);
    } catch (error) {
        console.error("Parse deu errado", error);
        return [];
    }

    const events = parsedEventos.map((event) => ({
        ...event,
        data: new Date(event.data)
    }));

    return events;
}
function salvarEventos() {  }
butao.onclick = teste;
butaocriacaoevento();
formdialogevento();
iniciarArmEvento();