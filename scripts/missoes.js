import { iniciarDialog } from "./home.js";
export function iniciarmissoes() {
    const btnmissao = document.querySelector("[data-nav-criar-missao]");
    btnmissao.addEventListener("click", () => {
        const dialog = iniciarDialog("form-missao");
        if (dialog) {
            dialog.open();
        } else {
            console.error("Erro ao iniciar o diálogo.");
        }
    });
}