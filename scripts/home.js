import {feito} from "./checkbox.js";
import {primeiraentrada} from "./primeiraentrada.js";
// import {abrirevento} from "./eventoabrir.js";
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

    FormEvento.ElementoForm.addEventListener("criar-evento2", () => {
        dialog.close();
    });
}
export function iniciarDialog(nome) {
    const elementoDialog = document.querySelector(`[data-dialog=${nome}]`);
    const butaofechar = document.querySelectorAll("[data-dialog-close-button]");

    for (const pedacobutaofechar of butaofechar) {
        pedacobutaofechar.addEventListener("click", () => {
            elementoDialog.close();
        });
    }
    if (nome != "nomeheroico"){
        elementoDialog.addEventListener("click", (event) => {
            if (event.target === elementoDialog) {
                elementoDialog.close();
            }
        })
    }
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
        const EventoForm2 = FormparaEvento2(ElementoForm);
        ElementoForm.dispatchEvent(new CustomEvent("criar-evento2", {
            detail: {
                evento: EventoForm2
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
function FormparaEvento2(ElementoForm) { 
    const DadosForm = new FormData(ElementoForm);
    const titulo = DadosForm.get("nome");
    const data = DadosForm.get("data-limite");
    const dificuldade = DadosForm.get("dificuldade");
    const descricao = DadosForm.get("descricao");
    const feito = DadosForm.get("feito");
    const evento = {
        titulo,
        data,
        dificuldade,
        descricao,
        feito
    }

    return evento;
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
    // const ElementoEventoTitulo = abrirevento(event);
    const ElementoEventoTitulo = ConteudoEvento.querySelector("[data-evento-titulo]");
    ElementoEventoTitulo.addEventListener("click", function () {
        const dialog = iniciarDialog("evento");
        if (dialog) {
            dialog.open();
        } else {
            console.error("Erro: o diálogo não foi encontrado ou inicializado corretamente.");
        }
        const elementoDialog = document.querySelector("[data-dialog='evento']");
        const tituloevento = elementoDialog.querySelector("[id='nome']");
        const desc = elementoDialog.querySelector("[id='descricao']");
        const data = elementoDialog.querySelector("[id='data-limite']");
        
        tituloevento.value = event.Nome;
        desc.value = event.Descricao;
        const dataEvento = new Date(event.DataLimite);
        data.value = dataEvento.toISOString().split('T')[0];
        
    });
    const ElementoId = ConteudoEvento.querySelector("[data-evento-id='']");
    const ElementoCheckbox = ConteudoEvento.querySelector("[data-checkbox]");
    
    ElementoEventoTitulo.textContent = event.Nome;
    ElementoId.setAttribute('data-evento-id', event.ID);
    if (event.Feita == 1) {
        ElementoEventoTitulo.classList.add("feito");
        ElementoCheckbox.checked = true;
    }
    return ElementoEvento
}
function iniciarArmEvento() { 
    const eventos = [];
    document.addEventListener("criar-evento2", async (event)=>{
        const tarefas = await pegareventosdoarm2();
        eventos.push(...tarefas);
        document.dispatchEvent(new CustomEvent("eventos-mudaram", {
            bubbles: true
        }));
    });
    document.addEventListener("criar-evento2", (evento) =>{
        const EventoCriado2 = evento.detail.evento;
        var titulo = EventoCriado2.titulo;
        var descricao = EventoCriado2.descricao;
        var data_limite = EventoCriado2.data;
        var dificuldade = EventoCriado2.dificuldade;
        var feito = EventoCriado2.feito;
        $.post("php/eventoBD.php", {titulo, descricao, data_limite, dificuldade, feito})
        .done(function (data) {
            console.log("Resposta do servidor: ", data);
        })
        .fail(function (jqXHR, textStatus, errorThrown) {
            console.error('Erro na requisição:', textStatus, errorThrown);
        });
    });
    return {
        async pegarEventosPorData(data) {
            const tarefas = await pegareventosdoarm2();
            const EventosFiltrados = tarefas.filter((evento) => mesmodia(evento.DataLimite, data));
            return EventosFiltrados;
        }
    };
}
async function pegareventosdoarm2() {
    try {
        var tarefas = [];
        const data = await $.post("php/puxareventoBD.php");
        if (data.error !== undefined) {
            console.error(data.error);
            return [];
        }
        if (data.tarefas !== undefined) {
            tarefas = data.tarefas;
            tarefas = tarefas.map((evento) => {
                const datan = new Date(evento.DataLimite); 
                datan.setUTCHours(12, 0, 0, 0); 
                return {
                    ...evento, 
                    DataLimite: datan 
                };
            });            
            return tarefas;
        }
        return [];
    } catch (error) {
        console.error("Erro na requisição:", error);
        return [];
    }
}

function today() {
    const agora = new Date();
    const dataAjustada = new Date(agora.getFullYear(), agora.getMonth(), agora.getDate());
    return dataAjustada;
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
async function iniciarCalendarioMes(parent, dataSelecionada, armEvento) {
    const ConteudoCalendario = ElementoTemplateCalendario.content.cloneNode(true);
    const ElementoCalendario = ConteudoCalendario.querySelector("[data-calendario-mes]");
    const ElementoListaDiaCalendario = ElementoCalendario.querySelector("[data-calendario-mes-lista-dia]");
    
    const DiasCalendario = gerarDiasCalendarioMes(dataSelecionada);
    const SemanasCalendario = DiasCalendario.length / 7;
    const ClasseCalendarioSemanas = ClassesCalendarioSemanas[SemanasCalendario];
    ElementoListaDiaCalendario.classList.add(ClasseCalendarioSemanas);
    for (const DiaCalendario of DiasCalendario) {
        const events = await armEvento.pegarEventosPorData(DiaCalendario);
        await iniciarDiaCalendario(ElementoListaDiaCalendario, DiaCalendario, events);
    }

    parent.appendChild(ElementoCalendario);
}
async function iniciarDiaCalendario(parent, DiaCalendario, events) {
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
async function iniciarCalendario(armEvento) {
    const ElementoCalendario = document.querySelector("[data-calendario]");
    let dataSelecionada = today();
    document.addEventListener("data-mudou", (evento) => {
        dataSelecionada = evento.detail.data;
        refreshCalendario();
    })
    async function refreshCalendario() {
        ElementoCalendario.replaceChildren();
        await  iniciarCalendarioMes(ElementoCalendario, dataSelecionada, armEvento);    
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
feito();
formdialogevento(); 
butaocriacaoevento();
const armEvento = iniciarArmEvento();
iniciarCalendario(armEvento);
iniciarNav();
primeiraentrada();
