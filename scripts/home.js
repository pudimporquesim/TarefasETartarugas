
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
const ElementoTemplateEvento = document.querySelector("[data-template='evento']");
function iniciarEventoEstatico(parent, event) {  
    const ElementoEvento = iniciarEvento(event);
    parent.appendChild(ElementoEvento);
}
function iniciarEvento(event) {
    const ConteudoEvento = ElementoTemplateEvento.content.cloneNode(true);
    const ElementoEvento = ConteudoEvento.querySelector("[data-evento]");
    const ElementoEventoTitulo = ElementoEvento.querySelector("[data-evento-titulo]");
    ElementoEventoTitulo.textContent = event.titulo;
    return ElementoEvento
}
function iniciarArmEvento() { 
    document.addEventListener("criar-evento", (event)=>{
        const EventoCriado = event.detail.event;
        const events = pegareventosdoarm();
        events.push(EventoCriado);
        saveEventsIntoLocalStorage(events);

        document.dispatchEvent(new CustomEvent("eventos-mudaram", {
            bubbles: true
        }));
    });

    return {
        pegarEventosPorData(data) {
            const events = pegareventosdoarm();
            const EventosFiltrados = events.filter((event) => mesmodia(event.data, data));

            return EventosFiltrados;
        }
    };
}
function saveEventsIntoLocalStorage(events) {
    const safeToStringifyEvents = events.map((event) => ({
        ...event,
        data: event.data.toISOString() 
    }));

    try {
        const stringifiedEvents = JSON.stringify(safeToStringifyEvents);
        localStorage.setItem("events", stringifiedEvents);
    } catch (error) {
        console.error("Erro ao salvar os eventos", error);
    }
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
        console.error("Erro ao analisar os eventos", error);
        return [];
    }

    const events = parsedEventos.map((event) => {

        const data = new Date(event.data);
        data.setUTCHours(12, 0, 0, 0); 

        return {
            ...event,
            data: data 
        };
    });

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
function gerarDiasCalendarioMes(diaAtual) {
    const DiasCalendario = [];
    const ultimoDiadoMesAnterior = ultimodiadomesfunc(
        subtrairMeses(diaAtual, 1)
    );

    const ultimoDiadoMesAnteriorSemana = ultimoDiadoMesAnterior.getDay();
    if (ultimoDiadoMesAnteriorSemana !== 6) {
        for (let i = ultimoDiadoMesAnteriorSemana; i >= 0; i -= 1) {
            const DiaCalendario = subtrairDias(ultimoDiadoMesAnterior, i);
            DiasCalendario.push(DiaCalendario);
        }
    }
    const ultimoDiadoMesAtual = ultimodiadomesfunc(diaAtual);
    for (let i = 1; i <= ultimoDiadoMesAtual.getDate(); i += 1) {
        const diaCalendario = adicionaDias(ultimoDiadoMesAnterior, i);
        DiasCalendario.push(diaCalendario);
    }

    const SemanasTotais = Math.ceil(DiasCalendario.length / 7);
    const DiasTotais = SemanasTotais * 7;
    const QuantDiasFaltantes = DiasTotais - DiasCalendario.length;
    for (let i = 1; i <= QuantDiasFaltantes; i += 1) {
        const DiaCalendario = adicionaDias(ultimoDiadoMesAtual, i);
        DiasCalendario.push(DiaCalendario);
    }
    return DiasCalendario;
}
function mesmodia(dataA, dataB) {
    return dataA.getFullYear() === dataB.getFullYear() && dataA.getMonth() === dataB.getMonth() && dataA.getDate() === dataB.getDate();
}
const ElementoTemplateCalendario = document.querySelector("[data-template='calendario-mes']");
const ElementoTemplateCalendarioDia = document.querySelector("[data-template='calendario-mes-dia']");
const ClassesCalendarioSemanas = {
    4: "quatro-semanas",
    5: "cinco-semanas",
    6: "seis-semanas"
}
function iniciarCalendarioMes(parent, dataSelecionada, armEvento) {
    const ConteudoCalendario = ElementoTemplateCalendario.content.cloneNode(true);
    const ElementoCalendario = ConteudoCalendario.querySelector("[data-calendario-mes]");
    const ElementoListaDiaCalendario = ElementoCalendario.querySelector("[data-calendario-mes-lista-dia]");
    
    const DiasCalendario = gerarDiasCalendarioMes(dataSelecionada);
    const SemanasCalendario = DiasCalendario.length / 7;
    const ClasseCalendarioSemanas = ClassesCalendarioSemanas[SemanasCalendario];
    ElementoListaDiaCalendario.classList.add(ClasseCalendarioSemanas);
    for (const DiaCalendario of DiasCalendario) {
        const events = armEvento.pegarEventosPorData(DiaCalendario);
        iniciarDiaCalendario(ElementoListaDiaCalendario, DiaCalendario, events);
    }

    parent.appendChild(ElementoCalendario);
}
function iniciarDiaCalendario(parent, DiaCalendario, events) {
    const DiaCalendarioConteudo = ElementoTemplateCalendarioDia.content.cloneNode(true);
    const ElementoDiaCalendario = DiaCalendarioConteudo.querySelector("[data-calendario-mes-dia]");
    const ElementoDiaLabelCalendario = DiaCalendarioConteudo.querySelector("[data-calendario-mes-dia-numero]");
    if (mesmodia(today(), DiaCalendario)) {
        ElementoDiaCalendario.classList.add("highlight");
    }
    ElementoDiaLabelCalendario.textContent = DiaCalendario.getDate();
    iniciarListaEventos(ElementoDiaCalendario, events);
    parent.appendChild(ElementoDiaCalendario);
}
function iniciarCalendario(armEvento) {
    const ElementoCalendario = document.querySelector("[data-calendario]");
    let dataSelecionada = today();
    document.addEventListener("data-mudou", (event) => {
        dataSelecionada = event.detail.data;
        refreshCalendario();
    })
    function refreshCalendario() {
        ElementoCalendario.replaceChildren();
        iniciarCalendarioMes(ElementoCalendario, dataSelecionada, armEvento);    
    }
    refreshCalendario();
    document.addEventListener("eventos-mudaram", () => {
        refreshCalendario();
    })
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
            buttonhoje.dispatchEvent(new CustomEvent("data-mudou", {
                detail: {
                    data:today()
                },
                bubbles: true
            }));
        });
    }
    buttonanterior.addEventListener("click", () => {
        buttonanterior.dispatchEvent(new CustomEvent("data-mudou", {
            detail: {
                data: pegarDataAnterior(dataSelecionada)
            },
            bubbles: true
        }));
    });
    buttonproximo.addEventListener("click", () => {
        buttonproximo.dispatchEvent(new CustomEvent("data-mudou", {
            detail: {
                data: pegarProximaData(dataSelecionada)
            },
            bubbles: true
        }));
    });
    // document.addEventListener("view-change")
    document.addEventListener("data-mudou", (event) => {
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
const ElementoTemplateListaEventoItem = document.querySelector("[data-template='evento-lista-item']");
function iniciarListaEventos(parent, events) { 
    const ElementoListaEvento = parent.querySelector("[data-lista-eventos]")
    for (const event of events) {
        const ListaEventoItemConteudo = ElementoTemplateListaEventoItem.content.cloneNode(true);
        const ElementoListaEventoItem = ListaEventoItemConteudo.querySelector("[data-evento-lista-item]");

        iniciarEventoEstatico(ElementoListaEventoItem, event);
        ElementoListaEvento.appendChild(ElementoListaEventoItem);
    }
 }

// function salvarEventos() { 
    
//  }
// butao.onclick = iniciarCalendario;
// butaocriacaoevento();
formdialogevento(); 
butaocriacaoevento();
const armEvento = iniciarArmEvento();
iniciarCalendario(armEvento);
iniciarNav();