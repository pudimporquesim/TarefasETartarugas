export function espacamentotexto(){
    const img = document.querySelector("[data-dialog-img]");
    const espacamento = document.getElementsByClassName("espacamentoimg")[0];
    const espacotodo = document.getElementsByClassName("dialog2dentro")[0];
    const dialogo = document.querySelector("[data-dialogo]");
    const imgWidth = img.offsetWidth;
    const espacotodoWidth = espacotodo.offsetWidth;
    var x = imgWidth + 'px';
    var y = espacotodoWidth + 'px';
    dialogo.style.width = espacotodoWidth - imgWidth + 'px';
    espacamento.style.width = x;
}