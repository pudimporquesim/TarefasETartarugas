import { iniciarDialog } from "./home.js";
import {espacamentotexto} from "./dialogo.js";
export function primeiraentrada() { 
    $.post("php/primeiraentrada.php")
    .done(function (data) {
        console.log("Resposta do servidor: ", data);
        if (data.error != undefined) {
            console.log("show 1");
            console.log(data.error);
            window.location.href = "index.html";
          } else if (data.success != undefined) {
            const dialog = iniciarDialog("nomeheroico");
            document.dispatchEvent(new CustomEvent (
                "abrir-dialog", {
                    bubbles: true
                }
            ));
            document.addEventListener("abrir-dialog", () =>{
                    dialog.open();
                    espacamentotexto();
            })
            var btnnomeheroico = document.getElementById("btnnomeheroico");
            var inp_nomeheroico = document.getElementById("nomeheroico");
            btnnomeheroico.onclick = function () { 
                event.preventDefault();
                nomeheroico(inp_nomeheroico.value);
            }
            function nomeheroico(nomeheroico) { 
                $.post("php/nomeheroico.php", {nomeheroico: nomeheroico})
                .done(function (data) {
                    console.log("Resposta do servidor: ", data);
                })
                .fail(function (jqXHR, textStatus, errorThrown) {
                    console.error('Erro na requisição:', textStatus, errorThrown);
                });
            }
          } 
    })
    .fail(function (jqXHR, textStatus, errorThrown) {
        console.error('Erro na requisição:', textStatus, errorThrown);
    });
}