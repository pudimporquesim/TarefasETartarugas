var checkbox = document.getElementById("checkbox");
var texto = document.getElementsByClassName("evento-titulo")[0];
function checkfeito() {
    if (checkbox.checked == true) {
        texto.classList.add("feito");
    } else {
        texto.classList.remove("feito");
    }
}
checkbox.onclick = checkfeito;