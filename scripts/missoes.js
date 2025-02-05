import { iniciarDialog, pegareventosdoarm2 } from "./home.js";
export function iniciarmissoes() {
    const btncriarmissao = document.querySelector("[data-criar-missao]");
    const btnmissao = document.querySelector("[data-nav-abrir-form-missao]");
    btnmissao.addEventListener("click", () => {
        const dialog = iniciarDialog("form-missao");
        if (dialog) {
            dialog.open();
            
        } else {
            console.error("Erro ao iniciar o diálogo.");
        }
        let FormMissao = document.querySelector("[data-missao-form]");
        dialog.elementoDialog.addEventListener("close", () => {
            FormMissao.reset();
            const parent = document.getElementsByClassName("tarefas")[0];
            while (parent.firstChild) {
                parent.removeChild(parent.firstChild);
            }
        })
    });

    const btnadicionartarefamissao = document.querySelector("[data-adicionar-tarefa-missao]");
    const area = document.getElementsByClassName("tarefas")[0];
    btnadicionartarefamissao.addEventListener("click", () => {
        // console.log("add tarefa", area);
        addtarefamissao(area);
    });
    
    btncriarmissao.addEventListener("click", () => {
        var dadosMissao = pegarmissaoform();
        let titulom = dadosMissao.titulo;
        let descm = dadosMissao.descricao;
        let datalm = dadosMissao.datalimite;
        let dificuldadem = dadosMissao.dificuldade;
        let feitom = dadosMissao.feito;
        let tarefas = dadosMissao.tarefas;
        let tarefasm = JSON.stringify(tarefas);
        $.post("php/missaoBD.php", {titulom, descm, datalm, dificuldadem, feitom, tarefasm})
        .done(function (data) {
            console.log("Resposta do servidor: ", data);
            document.dispatchEvent(new CustomEvent("criar-missão", {
                bubbles: true
            }));
        })
        .fail(function (jqXHR, textStatus, errorThrown) {
            console.error('Erro na requisição:', textStatus, errorThrown);
        });
    });
    function pegarmissaoform () {
        let FormMissao = document.querySelector("[data-missao-form]");
        let DadosFormM = new FormData(FormMissao);
        let titulo = DadosFormM.get("nomem");
        const datalimite = DadosFormM.get("data-limitem");
        const dificuldade = DadosFormM.get("dificuldade");
        const descricao = DadosFormM.get("descricaom");
        const feito = DadosFormM.get("feito");
        const divs = document.querySelectorAll("[data-tarefam]");
        const tarefasm = [];
        divs.forEach((div) => {
            let tarefam_nomeinput = div.querySelector("[id='tarefam-titulo']").value;
            let tarefam_datalimiteinput = div.querySelector("[id='data-limitefm']").value;
            let tarefam_feito = div.querySelector("[id='feito-checkboxm']").value;
            tarefasm.push({
                nome: tarefam_nomeinput,
                datalimite: tarefam_datalimiteinput,
                feito: tarefam_feito
            });
        });
        const missao = {
            titulo,
            datalimite,
            dificuldade,
            descricao,
            feito,
            tarefas: tarefasm
        }
        return missao;
    }
}
export async function aparecermissao() {
    const missoesbd = await pegarmissaobd();
    // console.log(missoesbd);
    const { tarefas, tarefasmissao } = await pegareventosdoarm2();
    missoesbd.forEach(missao => {
        missaoaparecer(missao, tarefas);
    });
    missaoatualizar(tarefasmissao);
}
function missaoatualizar(tarefasmissao) {

    // .addEventListener("click", () => {
    //     const dialog = iniciarDialog("form-missao");
    //     if (dialog) {
    //         dialog.open();
            
    //     } else {
    //         console.error("Erro ao iniciar o diálogo.");
    //     }
    // });
}
async function pegarmissaobd() {
    try {
        var missoes = [];
        const data = await $.post("php/puxarmissaoBD.php");
        if (data.error !== undefined) {
            console.error(data.error);
            return [];
        }
        if (data.missoes !== undefined) {
            missoes = data.missoes;
            missoes = missoes.map((missao) => {
                const datan = new Date(missao.DataLimite); 
                datan.setUTCHours(12, 0, 0, 0); 
                return {
                    ...missao, 
                    DataLimite: datan 
                };
            });            
            return missoes;
        }
        return [];
    } catch (error) {
        console.error("Erro na requisição:", error);
        return [];
    }
}
async function missaoaparecer(missao, tarefas) {
    const espacomissao = document.querySelector("[data-espaco-missoes]");
    // console.log(tarefas, tarefasmissao);
    await addmissao(espacomissao, missao, tarefas);
}
async function addmissao(parent, missao, tarefas) {
    const ElementoTemplateMissaoBD = document.querySelector("[data-template='missaobd']");
    const ConteudoMissaoBD = ElementoTemplateMissaoBD.content.cloneNode(true);
    const ElementoMissaoBD = ConteudoMissaoBD.querySelector("[data-missao]");
    const missaonome = ElementoMissaoBD.querySelector("[class='missao-titulo']");
    missaonome.innerHTML = missao.Nome;
    const missaodata = ElementoMissaoBD.querySelector("[class='data-limite']");
    missaodata.innerHTML = (missao.DataLimite).toLocaleDateString("pt-BR");
    var tarefasdamissaototal = tarefas.filter(tarefa => tarefa.fk_Missao_ID == missao.ID);
    var tarefasdamissaofeitas = tarefasdamissaototal.filter(tarefas => tarefas.Feita == 1);
    var quanttarefastotal = tarefasdamissaototal.length;
    var quanttarefasfeitas = tarefasdamissaofeitas.length;
    var porcentagem = (quanttarefasfeitas / quanttarefastotal);
    porcentagem = Number.isInteger(porcentagem) ? porcentagem.toString() : porcentagem.toFixed(2);
    const ElementoId = ConteudoMissaoBD.querySelector("[data-missao-id='']");
    ElementoId.setAttribute('data-missao-id', missao.ID);
    // se a vida do boss
    // var qtdfalta = quanttarefastotal - quanttarefasfeitas;
    // var porcentagem = qtdfalta / quanttarefastotal;
    // console.log(porcentagem, quanttarefastotal, quanttarefasfeitas);
    const missaobarra = ElementoMissaoBD.querySelector("[class='barra bx']");
    missaobarra.innerHTML = (porcentagem * 100) + "%";
    parent.appendChild(ElementoMissaoBD);
    ElementoMissaoBD.addEventListener("click", function () { 
        const dialog = iniciarDialog("form-missao2");
        if (dialog) {
            dialog.open();
            const elementoDialog = document.querySelector("[data-dialog='form-missao2']");
            const titulomissao = $(elementoDialog).find("[id='nomem']");
            const descmissao = $(elementoDialog).find("[id='descricaom']");
            const datamissaoa = $(elementoDialog).find("[id='data-limitem']");
            const dificuldademissao = missao.Dificuldade;
            const atualizarbtn = elementoDialog.querySelector("[id='atualizartarefa-buttonm']");
            const deletarbtn = $(elementoDialog).find("[id='deletar-buttonm']");
            const idmissao = missao.ID;
            if (dificuldademissao) {
                document.getElementById(`dificuldadem-${dificuldademissao}`).checked = true;
            }
            titulomissao.val(missao.Nome);
            descmissao.val(missao.Descricao);
            const datamissao = new Date(missao.DataLimite);
            const datamissao2 = datamissao.toISOString().split('T')[0];
            datamissaoa.val(datamissao2);
            tarefasdamissaototal.forEach(tarefa => {
                const area = document.getElementsByClassName("tarefas2")[0];
                addtarefamissao2(area,tarefa);
            });
        } else {
            console.error("Erro ao iniciar o diálogo.");
        }
        const btnadicionartarefamissao = document.querySelector("[data-adicionar-tarefa-missao2]");
        const area = document.getElementsByClassName("tarefas2")[0];
        btnadicionartarefamissao.addEventListener("click", () => {
            console.log("add tarefa", area);
            addtarefamissao(area);
        });
        dialog.elementoDialog.addEventListener("close", () => {
            while (area.firstChild) {
                area.removeChild(area.firstChild);
            }
        })
    });
}
function addtarefamissao(parent) {
    const ElementoTemplateTarefaM = document.querySelector("[data-template='tarefam']");
    const ConteudoTarefaM = ElementoTemplateTarefaM.content.cloneNode(true);
    const ElementoTarefaM = ConteudoTarefaM.querySelector("[data-tarefam]");
    const checkbox = ElementoTarefaM.querySelector("#feito-checkboxm");
    checkbox.addEventListener("click", (event) => {
        event.preventDefault();
    });
    parent.appendChild(ElementoTarefaM);
}
function addtarefamissao2(parent, tarefa) {
    const ElementoTemplateTarefaM = document.querySelector("[data-template='tarefam']");
    const ConteudoTarefaM = ElementoTemplateTarefaM.content.cloneNode(true);
    const ElementoTarefaM = ConteudoTarefaM.querySelector("[data-tarefam]");
    const TarefaMNome = ConteudoTarefaM.querySelector("[data-titulo-tarefam]");
    const TarefaMData = ConteudoTarefaM.querySelector("[data-data-tarefam]")
    const checkbox = ElementoTarefaM.querySelector("#feito-checkboxm");
    const feito = tarefa.Feita;
    if (feito == 1) {
        checkbox.checked = true;
    } else {
        checkbox.checked = false;
    }
    TarefaMNome.value = tarefa.Nome;
    const datatarefa = new Date(tarefa.DataLimite);
    const datatarefa2 = datatarefa.toISOString().split('T')[0];
    TarefaMData.value = datatarefa2;
    parent.appendChild(ElementoTarefaM);
}