import { iniciarDialog } from "./home.js";
import {espacamentotexto} from "./dialogo.js";
export function primeiraentrada() { 
    let nomeHeroico = " ";
    $.post("php/primeiraentrada.php")
    .done(function (data) {
        // console.log("Resposta do servidor: ", data);
        if (data.error != undefined) {
            console.log(data.error);
            window.location.href = "index.html";
        } else if (data.snome != undefined) {
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
                    // console.log("Resposta do servidor: ", data);
                    if (data.error != undefined) {
                        console.log(data.error);
                    } else if (data.nomeheroico != undefined) {
                        nomeHeroico = data.nomeheroico;
                        mudartexto(getTextoClasse(nomeHeroico));
                        removerform();
                        classesfunc();
                    }
                })
                .fail(function (jqXHR, textStatus, errorThrown) {
                    console.error('Erro na requisição:', textStatus, errorThrown);
                });
            }
            function mudartexto(texto) {
                var dialogo = document.getElementsByClassName("dialogop")[0];
                dialogo.innerHTML = texto;
            }
            function removerform(){
                var formnomeHeroico = document.getElementById("formnomeheroico");
                formnomeHeroico.remove();
            }
            function classesfunc() {
                var caixaclasses = document.getElementsByClassName("dialogo22")[0];
                caixaclasses.style.display = "flex";
                $(".cagado").on("mouseenter", function() {
                    mudartexto("Essa é a classe cágado");
                }) .on("mouseout", function () {  
                    mudartexto(getTextoClasse(nomeHeroico));
                });
                $(".jabuti").on("mouseenter", function() {
                    mudartexto("Essa é a classe jabuti");
                }) .on("mouseout", function () {  
                    mudartexto(getTextoClasse(nomeHeroico));
                });
                $(".tartaruga").on("mouseenter", function() {
                    mudartexto("Essa é a classe tartaruga");
                }) .on("mouseout", function () {  
                    mudartexto(getTextoClasse(nomeHeroico));
                });
            }
            function getTextoClasse(nome) {
                return `Belo nome <strong>${nome}</strong>, agora você terá de escolher sua classe, entre as três disponíveis.`;
            }
        } 
    })
    .fail(function (jqXHR, textStatus, errorThrown) {
        console.error('Erro na requisição:', textStatus, errorThrown);
    });
}