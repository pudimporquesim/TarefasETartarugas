export async function iniciarperfil() {
    var nomeusuario = document.getElementsByClassName("nome")[0];
    var nivel = document.getElementsByClassName("nivel")[0];
    var barrav = document.getElementsByClassName("bv")[0];
    var barraxp = document.getElementsByClassName("bx")[0];
    var moedas = document.getElementsByClassName("moedasn")[0];
    refreshperfil();
    async function refreshperfil() {
        const dados = await pegardadosbd();
        nomeusuario.innerHTML = dados.nome_heroico;
        nivel.innerHTML = dados.nivel;
        barrav.innerHTML = dados.vida;
        barrav.style.width = dados.vida + "%";
        barraxp.innerHTML = dados.experiencia;
        moedas.innerHTML = dados.moedas;
        async function pegardadosbd() {
            try {
                var dados = [];
                const data = await $.post("php/dadosperfil.php");
                if (data.error !== undefined) {
                    console.error(data.error);
                    return [];
                }
                if (data.dados !== undefined) {
                    dados = data.dados;         
                    return dados;
                }
                return [];
            } catch (error) {
                console.error("Erro na requisição:", error);
                return [];
            }
        }
    }
    document.addEventListener("atualizou-evento", () => {
        setTimeout(() => {
            refreshperfil();
          }, 100);
    });
    document.addEventListener("eventos-mudaram", () => {
        setTimeout(() => {
            refreshperfil();
          }, 100);
    });
    document.addEventListener("evento-feito", () => {
        setTimeout(() => {
            refreshperfil();
          }, 100);
    });
}