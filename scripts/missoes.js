import { iniciarDialog, pegareventosdoarm2, today } from "./home.js";
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
        document.addEventListener("criar-missao", () => {
            dialog.close();
        });
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
        
        if (titulom.trim() === "") {
            console.log("O campo de nome de uma missão não pode ficar vazio.")
            return
        }
        if (datalm.trim() === "") {
            console.log("O campo de data limite de uma missão não pode ficar vazio.")
            return
        }
        if (dificuldadem == null) {
            console.log("O campo de dificuldade de uma missão não pode ficar vazio.")
            return
        }
        let dataldata = new Date(datalm);
        dataldata.setUTCHours(12, 0, 0, 0);
        let hoje = today();
        hoje.setUTCHours(12, 0, 0, 0); 
        if (dataldata < hoje) {
            console.log("A data de uma missão não pode ser anterior a data de hoje.");
            return;
        }
        if (tarefas.length === 0) {
            console.log("Uma missão não pode ser criada sem tarefas.");
            return;
        };
        let temTarefaInvalida = tarefas.some(tarefa => tarefa.nome.trim() === "");
        if (temTarefaInvalida) {
            console.log("O campo de nome de uma tarefa não pode ficar vazio.");
            return;
        };
        var temTarefaInvalidaData = [];
        tarefas.forEach(tarefa => {
            let datatarefa = new Date(tarefa.datalimite);
            datatarefa.setUTCHours(12, 0, 0, 0); 
            let datamissao = new Date(datalm);
            datamissao.setUTCHours(12, 0, 0, 0); 
            if (datatarefa > datamissao) {
                temTarefaInvalidaData.push(tarefa);
            } 
        });
        if (temTarefaInvalidaData.length > 0) {
            console.log("A data limite de uma tarefa de missão não pode ser posterior a data limite da missão.");
            return;
        };
        var temTarefaInvalidaData2 = [];
        tarefas.forEach(tarefa => {
            let datatarefa = new Date(tarefa.datalimite);
            datatarefa.setUTCHours(12, 0, 0, 0); 
            let hoje = today();
            hoje.setUTCHours(12, 0, 0, 0); 
            if (datatarefa < hoje) {
                temTarefaInvalidaData2.push(tarefa);
            } 
        });
        if (temTarefaInvalidaData2.length > 0) {
            console.log("A data de uma tarefa de missão não pode ser anterior a data de hoje.");
            return;
        };
        let temTarefaInvalidasemdata = tarefas.some(tarefa => tarefa.datalimite.trim() === "");
        if (temTarefaInvalidasemdata) {
            console.log("O campo de data limite de uma tarefa não pode ficar vazio.");
            return;
        };
        let tarefasm = JSON.stringify(tarefas);
        $.post("php/missaoBD.php", {titulom, descm, datalm, dificuldadem, feitom, tarefasm})
        .done(function (data) {
            console.log("Resposta do servidor: ", data);
            
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
document.addEventListener("atualizar-missao", () => {
    aparecermissao();
});
export async function aparecermissao() {
    const missoesbd = await pegarmissaobd();
    // console.log(missoesbd);
    const { tarefas, tarefasmissao } = await pegareventosdoarm2();
    let hoje = today();
    hoje.setUTCHours(12, 0, 0, 0); 
    let ultimaData = localStorage.getItem('ultimaDataCalculo');
    if (ultimaData !== hoje.toDateString()) {
        let missoesatrasadas = [];
        missoesbd.forEach(missao => {
            let datadata = new Date(missao.DataLimite);
            datadata.setUTCHours(12, 0, 0, 0); 
            if (datadata < hoje && missao.Completa == 0) {
                missoesatrasadas.push(missao);
            };
        });
        let tarefasnaomissao = tarefas.filter(tarefa => tarefa.fk_missao_id == null);
        let tarefasatrasadas = [];
        tarefasnaomissao.forEach(tarefa => {
            let datadata = new Date(tarefa.DataLimite);
            datadata.setUTCHours(12, 0, 0, 0); 
            if (datadata < hoje && tarefa.Feita == 0) {
                tarefasatrasadas.push(tarefa);
            };
        });
        if (tarefasatrasadas.length > 0 || missoesatrasadas.length > 0) {
            let danotarefas = (tarefasatrasadas.reduce((acumulado, tarefa) => acumulado + Number(tarefa.Recompensa_xp), 0)) / 2;
            let danomissoes = (missoesatrasadas.reduce((acumulado, missao) => acumulado + Number(missao.Recompensa_xp), 0)) / 2;
            let danototal = danotarefas + danomissoes;
            console.log(`Você acaba de receber ${danototal} de dano por conta de suas missões e tarefas atrasadas.`);
        }
        localStorage.setItem('ultimaDataCalculo', hoje.toDateString());
    }
    const espacomissao = document.querySelector("[data-espaco-missoes]");
    while (espacomissao.hasChildNodes()) {
        espacomissao.removeChild(espacomissao.firstChild);
      }
    missoesbd.forEach(missao => {
        missaoaparecer(missao, tarefas);
    });
}
function missaoatualizar(titulomissao,desc,data,dataEvento2,missao,idmissao, mudancastarefas, tarefassembdjson) {
    verseigual(titulomissao,desc,data,dataEvento2,missao,idmissao, mudancastarefas, tarefassembdjson);
}
function verseigual(titulomissao,desc,data,dataEvento2,missao,idmissao, mudancastarefas, tarefassembdjson) {
    const dificuldadeSelecionada = $("input[name='dificuldade']:checked").val();
    const feito = $("#feito-checkbox").prop("checked");
    const mudancas = {};
    let dados = JSON.parse(tarefassembdjson);
    // Agora dados.tarefas será um array
    if (titulomissao.val().trim() === "") {
        console.log("O campo de nome de uma missão não pode ficar vazio");
        return
    }
    if (data) {
        let datadata = new Date(data.val());
        datadata.setUTCHours(12, 0, 0, 0); 
        let hoje = today();
        hoje.setUTCHours(12, 0, 0, 0); 
        if (data.val().trim() === "") {
            console.log("O campo de data limite de uma missão não pode ficar vazio");
            return
        } else if (datadata < hoje) {
            console.log("A data limite de uma missão não pode ser anterior ao dia de hoje.");
            return
        } 
    }
    let temTarefaInvalida = dados.some(tarefa => tarefa.nome.trim() === "");
    if (temTarefaInvalida) {
        console.log("O campo de nome de uma tarefa não pode ficar vazio.");
        return;
    }
    let temTarefaInvalida2 = dados.some(tarefa => tarefa.datalimite.trim() === "");
    if (temTarefaInvalida2) {
        console.log("O campo de data de uma tarefa não pode ficar vazio.");
        return;
    }
    if (titulomissao.val() != missao.Nome) {
        mudancas.Nome = titulomissao.val();
    }
    if (desc.val() != missao.Descricao) {
        mudancas.Descricao = desc.val();
    }
    if (data.val() != dataEvento2) {
        mudancas.DataLimite = data.val();
    }
    if (dificuldadeSelecionada != missao.Dificuldade) {
        mudancas.Dificuldade = dificuldadeSelecionada;
    }
    if (feito != (missao.Feita === 1)) {
        var feitoN;
        if (feito == true) {
            feitoN = 1;
        } else {
            feitoN = 0;
        }
        mudancas.Feita = feitoN;
    }
    if (Object.keys(mudancas).length > 0) {
        mudancas.ID = missao.ID;
    }
    if ((Object.keys(mudancas).length > 0) || JSON.parse(mudancastarefas).length > 0 || JSON.parse(tarefassembdjson).length > 0) {
        if (data.val() != '' && titulomissao.val() != "") {
            var mudanca = JSON.stringify(mudancas);
            console.log(mudanca, mudancastarefas, tarefassembdjson);
            atualiazarmissaobd(mudanca, mudancastarefas, tarefassembdjson);
        } else {
            console.log("os campos de data e nome não podem ficar vazios");
        }
    }
    async function atualiazarmissaobd(mudanca, mudancastarefas, tarefassembdjson) {
        try {
            const data = await $.post("php/atualizarmissao.php", {mudanca, mudancastarefas, tarefassembdjson});  
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
        document.dispatchEvent(new CustomEvent("atualizar-missao", {
            bubbles: true
        }));
    }    
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
    missaobarra.style.width = (porcentagem * 100) + "%";
    missaobarra.innerHTML = (porcentagem * 100) + "%";
    parent.appendChild(ElementoMissaoBD);
    ElementoMissaoBD.addEventListener("click", function () { 
        const dialog = iniciarDialog("form-missao2");
        if (dialog) {
            dialog.open();
            
        } else {
            console.error("Erro ao iniciar o diálogo.");
        }
        
        const elementoDialog = document.querySelector("[data-dialog='form-missao2']");
        const missaodialogid = elementoDialog.querySelector("[data-missao-dialog-id]");
        missaodialogid.setAttribute('data-missao-dialog-id', missao.ID);
        const titulomissao = $(elementoDialog).find("[id='nomem']");
        const descmissao = $(elementoDialog).find("[id='descricaom']");
        const datamissaoa = $(elementoDialog).find("[id='data-limitem']");
        const bossvida = elementoDialog.querySelector("[class='barra bv']");
        bossvida.style.width = missao.vida_boss + "%";
        bossvida.innerHTML = missao.vida_boss;
        const dificuldademissao = missao.Dificuldade;
        const atualizarbtn = elementoDialog.querySelector("[id='atualizartarefa-buttonm']");
        const deletarbtn = $(elementoDialog).find("[id='deletar-buttonm']");
        // const idmissao = missao.ID;

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
        atualizarbtn.addEventListener("click", () => {
            const divs = document.querySelectorAll("[data-tarefam]");
            const divmissao = document.querySelector("[data-dialog-missao]");
            const ElementomissaoId = divmissao.querySelector("[class='dialogmdentro']");
            const tarefasm = [];
            divs.forEach((div) => {
                let tarefam_nomeinput = div.querySelector("[id='tarefam-titulo']").value;
                let tarefam_datalimiteinput = div.querySelector("[id='data-limitefm']").value;
                let tarefam_feito = div.querySelector("[id='feito-checkboxm']").value;
                let tarefam_id = div.getAttribute("data-tarefa-missao-id");
                let missaotarefa_id = ElementomissaoId.getAttribute("data-missao-dialog-id");
                tarefasm.push({
                    id: tarefam_id,
                    nome: tarefam_nomeinput,
                    datalimite: tarefam_datalimiteinput,
                    missaoid: missaotarefa_id,
                    feito: tarefam_feito
                });
            });
            const idmissao = missao.ID;
            var { tarefassembdjson, mudancastarefas }  = verseigualtarefas(tarefasm, tarefasdamissaototal);
            missaoatualizar(titulomissao,descmissao,datamissaoa,datamissao2,missao ,idmissao, mudancastarefas, tarefassembdjson);
        });
        deletarbtn.on('click', async function () {
            await $.post("php/deletarmissao.php", {missao})
            .done(function (data) {
                console.log("Resposta do servidor: ", data);
                dialog.close();
                // document.dispatchEvent(new CustomEvent("eventos-mudaram", {
                //     bubbles: true
                // }));
            })
            .fail(function (jqXHR, textStatus, errorThrown) {
                console.error('Erro na requisição:', textStatus, errorThrown);
            });

          });
        const btnadicionartarefamissao = document.querySelector("[data-adicionar-tarefa-missao2]");
        const area = document.getElementsByClassName("tarefas2")[0];
        btnadicionartarefamissao.replaceWith(btnadicionartarefamissao.cloneNode(true));
        const novoBtnAdicionar = document.querySelector("[data-adicionar-tarefa-missao2]");
        
        novoBtnAdicionar.addEventListener("click", () => {
            // console.log("Adicionando tarefa", area);
            addtarefamissao(area);
        });
        dialog.elementoDialog.addEventListener("close", () => {
            while (area.firstChild) {
                area.removeChild(area.firstChild);
            }
        })
    });
}
function verseigualtarefas(tarefasm, tarefasdamissaototal) { 
    var mudancatarefas = [];
    var tarefassembd = tarefasm.filter(t => t.id == "");
    tarefasdamissaototal.forEach(tarefa => {
            var tarefam = tarefasm.find(t => t.id == tarefa.ID);
            const datatarefa = new Date(tarefa.DataLimite);
            const datatarefa2 = datatarefa.toISOString().split('T')[0];
            let mudanca = {};
            if (tarefam != undefined)  {
                if (tarefam.nome != tarefa.Nome) {
                    if (tarefam.nome.trim() == '') {
                        console.log("O campo de nome de uma tarefa não pode ficar vazio.");
                        return
                    }
                    mudanca.Nome = tarefam.nome;
                }
                if (tarefam.datalimite != datatarefa2) {
                    if (tarefam.datalimite == '') {
                     console.log("O campo de data de uma tarefa não pode ficar vazio.");
                     return
                    }
                    mudanca.DataLimite = tarefam.datalimite;
                }
                if (tarefam.feito != (tarefa.Feita === 1)) {
                    var feitoN;
                    if (tarefam.feito == true) {
                        feitoN = 1;
                    } else {
                        feitoN = 0;
                    }
                    mudanca.Feita = feitoN;
                }
                if (Object.keys(mudanca).length > 0) {
                    mudanca.ID = tarefa.ID;
                    mudanca.missaoid = tarefa.fk_missao_id;
                    mudancatarefas.push(mudanca);
                }
            }
        }
    );
    var mudancastarefas = JSON.stringify(mudancatarefas);
    var tarefassembdjson = JSON.stringify(tarefassembd);
    return { tarefassembdjson, mudancastarefas};
 }
function addtarefamissao(parent) {
    const ElementoTemplateTarefaM = document.querySelector("[data-template='tarefam']");
    const ConteudoTarefaM = ElementoTemplateTarefaM.content.cloneNode(true);
    const ElementoTarefaM = ConteudoTarefaM.querySelector("[data-tarefam]");
    const checkbox = ElementoTarefaM.querySelector("#feito-checkboxm");
    checkbox.addEventListener("click", (missao) => {
        missao.preventDefault();
    });
    parent.appendChild(ElementoTarefaM);
}
function addtarefamissao2(parent, tarefa) {
    const ElementoTemplateTarefaM = document.querySelector("[data-template='tarefam']");
    const ConteudoTarefaM = ElementoTemplateTarefaM.content.cloneNode(true);
    const ElementoTarefaM = ConteudoTarefaM.querySelector("[data-tarefam]");
    const TarefaMNome = ConteudoTarefaM.querySelector("[data-titulo-tarefam]");
    const TarefaMData = ConteudoTarefaM.querySelector("[data-data-tarefam]")
    const deletartarefamissaobtn = ConteudoTarefaM.querySelector("[dialog-delete-tarefa-button]");
    deletartarefamissaobtn.addEventListener("click", async function () {
        console.log("cliquei", tarefa);
        await $.post("php/deletartarefamissao.php", {tarefa})
        .done(function (data) {
            console.log("Resposta do servidor: ", data);
            // document.dispatchEvent(new CustomEvent("eventos-mudaram", {
            //     bubbles: true
            // }));
        })
        .fail(function (jqXHR, textStatus, errorThrown) {
            console.error('Erro na requisição:', textStatus, errorThrown);
        });
    });
    const checkbox = ElementoTarefaM.querySelector("#feito-checkboxm");
    const ElementoId = ConteudoTarefaM.querySelector("[data-tarefa-missao-id='']");
    ElementoId.setAttribute('data-tarefa-missao-id', tarefa.ID);
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