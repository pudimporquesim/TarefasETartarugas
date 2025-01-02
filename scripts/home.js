
var calendarioMes = document.getElementsByClassName("calendario-mes")[0]; 
var calendarioSemana = document.getElementsByClassName("calendario-semana")[0];

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
function today() {
    const agora = new Date();

    return new Date(
        agora.getFullYear(),
        agora.getMonth(),
        agora.getDate(),
        12
    );
}
function adicionarMeses(data, meses) {
    const primeiroDiadoMes = new Date(
        data.getFullYear(),
        data.getMonth() + meses,
        1,
        data.getHours()
    );
    const ultimoDiadoMes = ultimodiadomesfunc(primeiroDiadoMes);
    const diaDoMes = Math.min(data.getDate(), ultimoDiadoMes.getDate());

    return new Date(
        data.getFullYear(),
        data.getMonth() + meses,
        diaDoMes,
        data.getHours()
    );
}
function subtrairMeses(data, meses) { 
    return adicionarMeses(data, -meses);
}
function adicionaDias(data, dias) {
    return new Date(
        data.getFullYear(),
        data.getMonth(),
        data.getDate() + dias,
        data.getHours()
    );
}
function subtrairDias(data, dias) {
    return adicionaDias(data, -dias);
}
function ultimodiadomesfunc(data) {
    return new Date(
       data.getFullYear(),
       data.getMonth() + 1,
       0,
       12
    );
}
const ElementoTemplateCalendario = document.querySelector("[data-template='calendario-mes']");
const ElementoTemplateCalendarioDia = document.querySelector("[data-template='calendario-mes-dia']");
function iniciarCalendarioMes(parent, dataSelecionada) {
    const ConteudoCalendario = ElementoTemplateCalendario.content.cloneNode(true);
    const ElementoCalendario = ConteudoCalendario.querySelector("[data-calendario-mes]");
    const ElementoListaDiaCalendario = ElementoCalendario.querySelector("[data-calendario-mes-lista-dia]");
    
    parent.appendChild(ElementoCalendario);
}
function iniciarCalendario() {
    const ElementoCalendario = document.querySelector("[data-calendario]");
    let dataSelecionada = today();
    document.addEventListener("data-mudou", (event) => {
        dataSelecionada = event.detail.date;
        refreshCalendario();
    })
    function refreshCalendario() {
        iniciarCalendarioMes(ElementoCalendario, dataSelecionada);    
    }
    refreshCalendario();
}
const formatadorData = new Intl.DateTimeFormat("pt-BR", {
    month: "long",
    year: "numeric"
});
function iniciarNav() {
    const buttonshoje = document.querySelectorAll("[data-nav-button-hoje]");
    const buttonanterior = document.querySelector("[data-nav-anterior-button]");
    const buttonproximo = document.querySelector("[data-nav-proximo-button]");
    const elementoData = document.querySelector("[data-nav-data]");
    let dataSelecionada = today();

    for (const buttonhoje of buttonshoje)  {
        buttonhoje.addEventListener("click", () => {
            buttonhoje.dispatchEvent(new CustomEvent("data-mudada", {
                detail: {
                    data:today()
                },
                bubbles: true
            }));
        });
    }
    buttonanterior.addEventListener("click", () => {
        buttonanterior.dispatchEvent(new CustomEvent("data-mudada", {
            detail: {
                data: pegarDataAnterior(dataSelecionada)
            },
            bubbles: true
        }));
    });
    buttonproximo.addEventListener("click", () => {
        buttonproximo.dispatchEvent(new CustomEvent("data-mudada", {
            detail: {
                data: pegarProximaData(dataSelecionada)
            },
            bubbles: true
        }));
    });
    // document.addEventListener("view-change")
    document.addEventListener("data-mudada", (event) => {
        dataSelecionada = event.detail.data;
        refreshElementoData(elementoData, dataSelecionada);
    });
    refreshElementoData(elementoData, dataSelecionada);

}
function refreshElementoData(elementoData, dataSelecionada) {
    let dataFormatada = formatadorData.format(dataSelecionada);
    dataFormatada = dataFormatada.charAt(0).toUpperCase() + dataFormatada.slice(1);
    elementoData.textContent = dataFormatada;
}
function pegarDataAnterior(dataSelecionada) {
    return subtrairMeses(dataSelecionada, 1);
}
function pegarProximaData(dataSelecionada) {
    return adicionarMeses(dataSelecionada, 1);
}
function salvarEventos() {  }
// butao.onclick = iniciarCalendario;
// butaocriacaoevento();
formdialogevento();
butaocriacaoevento();
iniciarArmEvento();
iniciarCalendario();
iniciarNav();