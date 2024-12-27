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
    document.addEventListener("requisicao-criacao-evento", () => {
        dialog.open();
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
    return {
        open() {
            elementoDialog.showModal();
        },
        close() {
            elementoDialog.close();
        }
    };
}
butao.onclick = teste;
butaocriacaoevento();
formdialogevento();