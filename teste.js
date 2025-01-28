const registerButton = document.getElementById("registro");
const loginButton = document.getElementById("login");
const container = document.getElementById("container");

registerButton.addEventListener("click", () => {
  container.classList.add("painel-direito-ativo");
  var modalsenha = document.getElementById("show");
  modalsenha.style.zIndex = '-1';
});

loginButton.addEventListener("click", () => {
  container.classList.remove("painel-direito-ativo");
});