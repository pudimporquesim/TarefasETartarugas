import {feito} from "./checkbox.js";
import {primeiraentrada} from "./primeiraentrada.js";
import {iniciarperfil} from "./perfil.js";
import {iniciarmissoes, aparecermissao} from "./missoes.js";
function butaocriacaoevento() {
    const butaoevento = document.getElementById("adicionartarefa");
    butaoevento.addEventListener("click", () => {
        butaoevento.dispatchEvent(new CustomEvent
            ("requisicao-criacao-evento", {
                bubbles: true 
            }));
    }) 
}
iniciarmissoes();
aparecermissao();
function iniciarToaster(parent) {
    const ElementoToaster = document.createElement("div");
    ElementoToaster.classList.add("toaster");
    parent.appendChild(ElementoToaster);
    return {
      success(message) {
        mostrarToaster(ElementoToaster, message, "success");
      },
      error(message) {
        mostrarToaster(ElementoToaster, message, "error");
      }
    };
  }
  function mostrarToaster(ElementoToaster, message, type) {
    const ElementoToast = criarToast(message,type);
    animarToast(ElementoToaster, ElementoToast);
  }
  function criarToast(message, type) {
    const ElementoToast = document.createElement("div");
    ElementoToast.textContent = message;
    ElementoToast.classList.add("toast");
    ElementoToast.classList.add(type);
    return ElementoToast;
  }
  function animarToast(ElementoToaster, ElementoToast){
    const alturaantes = ElementoToaster.offsetHeight;
    ElementoToaster.appendChild(ElementoToast);
    const alturadepois = ElementoToaster.offsetHeight;
    const diferencaaltura = alturadepois - alturaantes;
  
    const AnimacaoToaster = ElementoToaster.animate([
      { transform: `translate(0, ${diferencaaltura}px)`},
      { transform: "translate(0, 0)"}
    ], {
      duration: 150,
      easing: "ease-out"
    });
  
    AnimacaoToaster.startTime = document.timeline.currentTime;
    esperarAnimacao(ElementoToast)
    .then(() => {
      ElementoToaster.removeChild(ElementoToast);
    })
    .catch((error) => {
      console.error("Deu errado a animação", error);
    })
  }
  function esperarAnimacao(element) {
    const animationPromises = element.getAnimations().map(animation => animation.finished);
  
    return Promise.allSettled(animationPromises);
  }
function formdialogevento() {
    const dialog = iniciarDialog("form-evento");
    const FormEvento = iniciarFormEvento();
    // const toaster = iniciarToaster();
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
                event.preventDefault();
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
    const ElementoEventoTitulo = ConteudoEvento.querySelector("[data-evento-titulo]");
    ElementoEventoTitulo.addEventListener("click", function () {
        const dialog = iniciarDialog("evento");
        if (dialog) {
            dialog.open();
        } else {
            console.error("Erro: o diálogo não foi encontrado ou inicializado corretamente.");
        }
        const elementoDialog = document.querySelector("[data-dialog='evento']");
        const tituloevento = $(elementoDialog).find("[id='nome']");
        const desc = $(elementoDialog).find("[id='descricao']");
        const data = $(elementoDialog).find("[id='data-limite']");
        const dificuldade = event.Dificuldade;
        const feito = event.Feita;
        const atualizarbtn = elementoDialog.querySelector("[id='atualizartarefa-button']");
        const deletarbtn = $(elementoDialog).find("[id='deletar-button']");
        const idtarefa = event.ID;
        if (event.Dificuldade == null) {
            const dificuldadeRadios = elementoDialog.querySelectorAll('input[name="dificuldade"]');
            const descricaoInput = elementoDialog.querySelector("[id='descricao']");
            const dificuldadeLabels = elementoDialog.querySelectorAll('input[name="dificuldade"], label[for^="dificuldade"]');
            const descricaolabel = elementoDialog.querySelector('label[for="descricao"]');
            dificuldadeRadios.forEach(radio => {
                radio.hidden = true;
            });
            descricaoInput.hidden = true;
            dificuldadeLabels.forEach(label => {
                label.hidden = true;
            });
            descricaolabel.hidden = true;
        }
        if (feito == 1) {
            elementoDialog.querySelector("[id='feito-checkbox']").checked = true;
        } else {
            elementoDialog.querySelector("[id='feito-checkbox']").checked = false;
        }
        if (dificuldade) {
            document.getElementById(`dificuldade-${dificuldade}`).checked = true;
        }
        tituloevento.val(event.Nome);
        desc.val(event.Descricao);
        const dataEvento = new Date(event.DataLimite);
        const dataEvento2 = dataEvento.toISOString().split('T')[0];
        data.val(dataEvento2);
        atualizarbtn.addEventListener('click', function atualizarEventoAtual() {
            atualizarbtn.removeEventListener('click', atualizarEventoAtual);
            verseigual(tituloevento, desc, data, dataEvento2, event, idtarefa);
            dialog.close();
            document.dispatchEvent(new CustomEvent("atualizou-evento", {
                bubbles: true
            }));
        });
        dialog.elementoDialog.addEventListener("close", () => {
            const atualizarbtn = dialog.elementoDialog.querySelector("[id='atualizartarefa-button']");
            atualizarbtn.replaceWith(atualizarbtn.cloneNode(true));
        });
        deletarbtn.on('click', async function () {
            await $.post("php/deletartarefa.php", {idtarefa})
            .done(function (data) {
                console.log("Resposta do servidor: ", data);
                dialog.close();
                document.dispatchEvent(new CustomEvent("eventos-mudaram", {
                    bubbles: true
                }));
            })
            .fail(function (jqXHR, textStatus, errorThrown) {
                console.error('Erro na requisição:', textStatus, errorThrown);
            });
          });
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
function verseigual(tituloevento,desc,data,dataEvento2,event,idtarefa) {
    const dificuldadeSelecionada = $("input[name='dificuldade']:checked").val();
    const feito = $("#feito-checkbox").prop("checked");
    const mudancas = {};
    if (tituloevento.val() != event.Nome) {
        mudancas.Nome = tituloevento.val();
    }
    if (desc.val() != event.Descricao) {
        mudancas.Descricao = desc.val();
    }
    if (data.val() != dataEvento2) {
        mudancas.DataLimite = data.val();
    }
    if (dificuldadeSelecionada != event.Dificuldade) {
        mudancas.Dificuldade = dificuldadeSelecionada;
    }
    if (feito != (event.Feita === 1)) {
        var feitoN;
        if (feito == true) {
            feitoN = 1;
        } else {
            feitoN = 0;
        }
        mudancas.Feita = feitoN;
    }
    if (Object.keys(mudancas).length > 0) {
        if (data.val() != '' && tituloevento.val() != "") {
            mudancas.ID = idtarefa;
            var mudanca = JSON.stringify(mudancas);
            atualizarevento(mudanca);
        } else {
            console.log("os campos de data e nome não podem ficar vazios");
        }
    }
    async function atualizarevento(mudanca) {
        try {
            const data = await $.post("php/atualizarevento.php", {mudanca});  
            console.log("Resposta do servidor: ", data);
        } catch (error) {
            console.error('Erro na requisição:', error);
            if (error.responseText) {
                console.error('Resposta do erro:', error.responseText);
            }
            if (error.status) {
                console.error('Status do erro:', error.status);
            }
        }
    }    
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
        if (data_limite) {
            let datal = new Date(data_limite); // Tem que mexer aqui
            datal.setUTCHours(12, 0, 0, 0); 
            let hoje = today();
            hoje.setUTCHours(12, 0, 0, 0);
            if (datal < hoje) {
                console.log("A data de uma tarefa não pode ser anterior a data de hoje.");
                return;
            } 
        }
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
            const { tarefas, tarefasmissao } = await pegareventosdoarm2();
            // console.log(tarefasmissao);
            const EventosFiltrados = tarefas.filter((evento) => mesmodia(evento.DataLimite, data));
            return EventosFiltrados;
        }
    };
}
export async function pegareventosdoarm2() {
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
            var tarefasmissao = tarefas.filter(tarefa => tarefa.Dificuldade == null);
            return { tarefas, tarefasmissao };
        }
        return { tarefas: [], tarefasmissao: [] };
    } catch (error) {
        console.error("Erro na requisição:", error);
        return { tarefas: [], tarefasmissao: [] };
    }
}

export function today() {
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
        await iniciarCalendarioMes(ElementoCalendario, dataSelecionada, armEvento);    
    }
    refreshCalendario();
    document.addEventListener("eventos-mudaram", () => {
        refreshCalendario();
    })
    document.addEventListener("atualizou-evento", () => {
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
iniciarperfil();