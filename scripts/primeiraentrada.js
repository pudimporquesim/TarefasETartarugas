import { iniciarDialog } from "./home.js";
import {espacamentotexto} from "./dialogo.js";
export function primeiraentrada() { 
    let nomeHeroico = " ";
    let classe = "";
    var caixaclasses = document.getElementsByClassName("dialogo22")[0];
    const dialogof = document.querySelector(`[data-dialog="nomeheroico"]`);
    $.post("php/primeiraentrada.php")
    .done(function (data) {
        if (data.error != undefined) {
            console.log(data.error);
        } else if (data.slogin != undefined) {
            window.location.href = "index.html";
        } else if (data.snome != undefined) {
            const dialog = iniciarDialog("nomeheroico");
            if (dialog) {
                dialog.open();
                espacamentotexto();
            } else {
                console.error("Erro: o diálogo não foi encontrado ou inicializado corretamente.");
            }
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
                        escolherclassefunc();
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
                
                caixaclasses.style.display = "flex";
                $(".cagado").on("mouseover", function() {
                    mudartextoDebounced("Essa é a classe cágado, o cágado é veloz e astuto, por conta disso recebe menos dano caso atrase suas tarefas");
                }) .on("mouseout", function () {  
                    mudartextoDebounced(getTextoClasse(nomeHeroico));
                });
                $(".jabuti").on("mouseover", function() {
                    mudartextoDebounced("Essa é a classe jabuti, o jabuti é forte e sagaz, por conta disso recebe um bônus de 1,5 em moedas.");
                }) .on("mouseout", function () {  
                    mudartextoDebounced(getTextoClasse(nomeHeroico));
                });
                $(".tartaruga").on("mouseover", function() {
                    mudartextoDebounced("Essa é a classe tartaruga, a tartaruga é sábia e irreverente, por conta disso recebe um bônus de 1,5 em xp.");
                }) .on("mouseout", function () {  
                    mudartextoDebounced(getTextoClasse(nomeHeroico));
                });
            }
            function getTextoClasse(nome) {
                return `Belo nome <strong>${nome}</strong>, agora você poderá escolher sua classe, entre as três disponíveis. Sua classe define suas habilidades.`;
            }
            function mudartextoDebounced(novoTexto) {
                let debounceTimer;
                clearTimeout(debounceTimer);
                debounceTimer = setTimeout(() => {
                    mudartexto(novoTexto); 
                }, 50); 
            }
            let clicks = 0; 
            var classeesc = "";
            function escolherclassefunc() {
                $(".tartaruga").on("click", function () {
                    if (clicks === 1) { 
                        console.log("Clicou a segunda vez na tartaruga");
                        classeesc = "tartaruga";
                        $.post("php/classe.php", {classeesc: classeesc})
                        .done(function (data) {
                            console.log("Resposta do servidor: ", data);
                            caixaclasses.style.display = "none";
                            classe = data.classe;
                            console.log(classe);
                            setTimeout(() => {
                                mudartexto(`Fico feliz que você ${nomeHeroico} da classe ${classe} esteja aqui para proteger os recifes de Água Branca <br> <span class='clique'>Clique em qualquer lugar para continuar</span>`);
                              }, 100);
                              const dialogof = document.querySelector(`[data-dialog="nomeheroico"]`);
                              document.addEventListener("click", () => {
                                  if (dialogof.open) {
                                      dialogof.close(); 
                                  }
                              });
                        })
                        .fail(function (jqXHR, textStatus, errorThrown) {
                            console.error('Erro na requisição:', textStatus, errorThrown);
                        });
                    } else { 
                        mudartexto("Oh, grande escolha a <strong>tartaruga</strong>, tem certeza? <br> <span class='clique'>Clique novamente se tiver</span>");
                        clicks = 1; 
                    }
                });
                $(".jabuti").on("click", function () {
                    if (clicks === 2) {
                        console.log("Clicou a segunda vez na jabuti");
                        classeesc = "jabuti";
                        $.post("php/classe.php", {classeesc: classeesc})
                        .done(function (data) {
                            console.log("Resposta do servidor: ", data);
                            caixaclasses.style.display = "none";
                            classe = data.classe;
                            console.log(classe);
                            setTimeout(() => {
                                mudartexto(`Fico feliz que você ${nomeHeroico} da classe ${classe} esteja aqui para proteger os recifes de Água Branca <br> <span class='clique'>Clique em qualquer lugar para continuar</span>`);
                              }, 100);
                              const dialogof = document.querySelector(`[data-dialog="nomeheroico"]`);
                              document.addEventListener("click", () => {
                                  if (dialogof.open) {
                                      dialogof.close(); 
                                  }
                              });
                        })
                        .fail(function (jqXHR, textStatus, errorThrown) {
                            console.error('Erro na requisição:', textStatus, errorThrown);
                        });
                    } else {
                        mudartexto("Oh, grande escolha o <strong>jabuti</strong>, tem certeza? <br> <span class='clique'>Clique novamente se tiver</span>");
                        clicks = 2;
                    }
                });
                $(".cagado").on("click", function () {
                    if (clicks === 3) {
                        console.log("Clicou a segunda vez no cágado");
                        classeesc = "cágado";
                        $.post("php/classe.php", {classeesc: classeesc})
                        .done(function (data) {
                            console.log("Resposta do servidor: ", data);
                            caixaclasses.style.display = "none";
                            classe = data.classe;
                            console.log(classe);
                            setTimeout(() => {
                                mudartexto(`Fico feliz que você ${nomeHeroico} da classe ${classe} esteja aqui para proteger os recifes de Água Branca <br> <span class='clique'>Clique em qualquer lugar para continuar</span>`);
                              }, 100);
                              const dialogof = document.querySelector(`[data-dialog="nomeheroico"]`);
                              document.addEventListener("click", () => {
                                  if (dialogof.open) { 
                                      dialogof.close(); 
                                  }
                              });
                        })
                        .fail(function (jqXHR, textStatus, errorThrown) {
                            console.error('Erro na requisição:', textStatus, errorThrown);
                        });

                    } else {
                        mudartexto("Oh, grande escolha o <strong>cágado</strong>, tem certeza? <br> <span class='clique'>Clique novamente se tiver</span>");
                        clicks = 3;
                    }
                });
            }
        } 
    })
    .fail(function (jqXHR, textStatus, errorThrown) {
        console.error('Erro na requisição:', textStatus, errorThrown);
    });
}