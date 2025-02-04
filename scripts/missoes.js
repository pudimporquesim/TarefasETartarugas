import { iniciarDialog } from "./home.js";
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
    });
    const btnadicionartarefamissao = document.querySelector("[data-adicionar-tarefa-missao]");
    const area = document.getElementsByClassName("lado2")[0];
    btnadicionartarefamissao.addEventListener("click", () => {
        // console.log("add tarefa", area);
        addtarefamissao(area);
    });
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